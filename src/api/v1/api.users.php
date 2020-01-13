<?php

$app->group('/users', function() {

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $limit = intval($request->getQueryParam('limit', 10000));
    $offset = intval($request->getQueryParam('offset', 0));
    $query = strlen($request->getQueryParam('query')) > 0 ? '%'.$request->getQueryParam('query').'%' : null;

    $stmt = $mysql->prepare(
      "SELECT u.*, g.name AS 'group_name'
      FROM users u
      INNER JOIN groups g ON g.group_id = u.group_id
      WHERE u.group_id = IFNULL(:group_id, u.group_id)
      AND u.semester = IFNULL(:semester, u.semester)
      AND ( u.username LIKE IFNULL(:query, u.username)
      OR u.email LIKE IFNULL(:query, u.email) )
      ORDER BY g.name ASC, u.user_id DESC
      LIMIT :offset, :limit"
    );
    $stmt->bindValue(':group_id', $request->getQueryParam('group_id'));
    $stmt->bindValue(':semester', $request->getQueryParam('semester'));
    $stmt->bindValue(':query', $query, PDO::PARAM_STR);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $data['users'] = getAll($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/distinct', function($request, $response, $args) {
    $mysql = init();

    $stmt_groups = $mysql->prepare(
      "SELECT DISTINCT g.*
      FROM groups g
      ORDER BY g.name ASC"
    );

    $stmt_semesters = $mysql->prepare(
      "SELECT DISTINCT u.semester
      FROM users u
      ORDER BY u.semester ASC"
    );

    $data['groups'] = getAll($stmt_groups);
    $data['semesters'] = getAll($stmt_semesters);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/login', function($request, $response, $args) {
    $email = $request->getQueryParam('email');
    // $password = $request->getQueryParam('password');
    $password_encoded = urldecode($request->getQueryParam('password_encoded'));
    $remember_choice = !empty($request->getQueryParam('remember_me')) ? $request->getQueryParam('remember_me') : 0;

    if (!$email) {
      $data['error'] = 'error_no_email';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    if (!$password_encoded) {
      $data['error'] = 'error_no_password';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    $mysql = init();
    $user = fetchUserDetailsByMail($mysql, $email);

    if (!is_array($user)) {
      $data['error'] = 'error_incorrect_password';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    if ($user['active'] == 0) {
      $data['error'] = 'error_account_not_activated';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    $entered_pass_encoded = generateHash($password_encoded, $user['password']);
    if ($entered_pass_encoded != $user['password']) {
      $data['error'] = 'error_incorrect_password';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    $user['display_username'] = $user['username'];
    $user['clean_username'] = $user['username_clean'];
    $user['hash_pw'] = $user['password'];
    $user['remember_me'] = $remember_choice;

    $stmt = $mysql->prepare(
      "UPDATE users
      SET last_sign_in = :last_sign_in
      WHERE user_id = :user_id"
    );
    $stmt->bindValue(':last_sign_in', time());
    $stmt->bindValue(':user_id', $user['user_id'], PDO::PARAM_INT);
    $data['status'] = $stmt->execute();

    $jwt_token = array(
      "iss" => "https://www.crucio-leipzig.de",
      "iat" => time(),
      "uid" => $user['user_id']
    );
    $user['jwt'] = \Firebase\JWT\JWT::encode($jwt_token, getenv('secret'));
    $data['logged_in_user'] = $user;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/{user_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "SELECT u.*, g.name AS 'group_name'
      FROM users u
      INNER JOIN groups g ON g.group_id = u.group_id
      WHERE u.user_id = :user_id"
    );
    $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

    $data['users'] = getAll($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->post('/register', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $username = $body['username'];
    $email = str_replace('(@)', '@', sanitize($body['email']));
    $clean_password = $body['password'];
    $clean_username = sanitize($username);
    $semester = $body['semester'];
    $course_id = $body['course'];
    $activation_token = 0;

    if (!$username) {
      $data['error'] = 'error';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    if (getCount($mysql, "users WHERE username_clean = ?", [$clean_username])) {
      $data['error'] = 'error_username_taken';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    if (getCount($mysql, "users WHERE email = ?", [sanitize($email)])) {
      $data['error'] = 'error_email_taken';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    $pattern = '/[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/';
    if (!preg_match($pattern, $email)) {
      if (!validateEMail($mysql, $email)) { // Check whitelist
        $data['error'] = 'error_email_forbidden';
        return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
      }
    }

    $secure_pass = generateHash($clean_password);
    $activation_token = generateActivationToken($mysql);

    $website_url = getURL();
    $activation_message = $website_url.'activate-account?token='.$activation_token;
    $hooks = [
      'ACTIVATION-MESSAGE' => $activation_message,
      'ACTIVATION-KEY' => $activation_token,
      'USERNAME' => $username,
    ];
    sendTemplateMail('new-registration', $email, 'Willkommen bei Crucio', $hooks);

    $stmt = $mysql->prepare(
      "INSERT INTO users (username, username_clean, password, email, activationtoken, last_activation_request, sign_up_date, course_id, semester)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bindValue(1, $username, PDO::PARAM_STR);
    $stmt->bindValue(2, $clean_username, PDO::PARAM_STR);
    $stmt->bindValue(3, $secure_pass, PDO::PARAM_STR);
    $stmt->bindValue(4, $email, PDO::PARAM_STR);
    $stmt->bindValue(5, $activation_token, PDO::PARAM_STR);
    $stmt->bindValue(6, time());
    $stmt->bindValue(7, time());
    $stmt->bindValue(8, $course_id, PDO::PARAM_INT);
    $stmt->bindValue(9, $semester, PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/activate', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    if ((getCount($mysql, "users WHERE activationtoken = ?", [$body['token']]) != 1)) {
        $data['error'] = 'error_unknown';
        return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }
    $stmt = $mysql->prepare(
        "UPDATE users
        SET active = 1
        WHERE activationtoken = :token
        LIMIT 1"
    );
    $stmt->bindValue(':token', $body['token'], PDO::PARAM_STR);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/change-semester', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $stmt = $mysql->prepare(
      "UPDATE users
      SET semester = semester + :add"
    );
    $stmt->bindValue(':add', $body['difference'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/{user_id}/password', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $user_id = $args['user_id'];

    if (!$body['password']) {
      $data['error'] = 'error_no_password';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    $stmt_user = $mysql->prepare(
      "SELECT u.*
      FROM users u
      WHERE u.user_id = :user_id
      LIMIT 1"
    );
    $stmt_user->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $user = getFetch($stmt_user);

    $entered_pass = generateHash($body['current_password'], $user['password']);
    $entered_pass_encoded = generateHash(urldecode($body['current_password_encoded']), $user['password']);
    $entered_pass_new = generateHash($body['password'], $user['password']);

    if ($entered_pass != $user['password'] && $entered_pass_encoded != $user['password']) {
      $data['error'] = 'error_incorrect_password';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    if ($entered_pass_new == $user['password']) {
      $data['error'] = 'error_same_passwords';
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    }

    $secure_pass = generateHash($body['password']);

    $stmt = $mysql->prepare(
      "UPDATE users
      SET password = :password
      WHERE user_id = :user_id"
    );
    $stmt->bindValue(':password', $secure_pass, PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/{user_id}/account', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $stmt = $mysql->prepare(
      "UPDATE users
      SET highlightExams = ?, showComments = ?, repetitionValue = ?, useAnswers = ?, useTags = ?, semester = ?, course_id = ?
      WHERE user_id = ?"
    );
    $stmt->bindValue(1, $body['highlightExams'], PDO::PARAM_BOOL);
    $stmt->bindValue(2, $body['showComments'], PDO::PARAM_BOOL);
    $stmt->bindValue(3, $body['repetitionValue'], PDO::PARAM_BOOL);
    $stmt->bindValue(4, $body['useAnswers'], PDO::PARAM_BOOL);
    $stmt->bindValue(5, $body['useTags'], PDO::PARAM_BOOL);
    $stmt->bindValue(6, $body['semester'], PDO::PARAM_INT);
    $stmt->bindValue(7, $body['course_id'], PDO::PARAM_INT);
    $stmt->bindValue(8, $args['user_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/{user_id}/group', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $stmt = $mysql->prepare(
      "UPDATE users
      SET group_id = :group_id
      WHERE user_id = :user_id"
    );
    $stmt->bindValue(':group_id', $body['group_id'], PDO::PARAM_INT);
    $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->group('/password', function() {

    $this->post('/token', function($request, $response, $args) {
      $mysql = init();
      $body = $request->getParsedBody();

      if (!validateActivationToken($mysql, $body['token'])) {
        $data['error'] = 'error_token';
        return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
      }

      $rand_pass = $body['password'];
      $secure_pass = generateHash($rand_pass);
      $user = fetchUserDetailsByToken($mysql, $body['token']);

      $new_activation_token = generateActivationToken($mysql);

      $stmt = $mysql->prepare(
        "UPDATE users
        SET password = ?, activationtoken = ?
        WHERE activationtoken = ?"
      );
      $stmt->bindValue(1, $secure_pass, PDO::PARAM_STR);
      $stmt->bindValue(2, $new_activation_token, PDO::PARAM_STR);
      $stmt->bindValue(3, sanitize($body['token']), PDO::PARAM_STR);

      $data['status'] = $stmt->execute();
      $data['status_flag'] = flagLostpasswordRequest($mysql, $user['username_clean'], 0);
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });

    $this->post('/reset', function($request, $response, $args) {
      $mysql = init();
      $body = $request->getParsedBody();

      $email = str_replace('(@)', '@', $body['email']);

      if (!getCount($mysql, "users WHERE email = ?", [sanitize($email)])) {
        $data['error'] = 'error_email';
        return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
      }

      $user = fetchUserDetailsByMail($mysql, $email);

      if ($user['LostpasswordRequest'] == 1) {
        $data['error'] = 'error_already_requested';
        return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
      }

      $website_url = getURL();
      $reset_url = $website_url.'change-password?token='.$user['activationtoken'];

      $hooks = [
        'USERNAME' => $user['username'],
        'RESET-URL' => $reset_url,
      ];
      sendTemplateMail('lost-password-request', $email, 'Passwort vergessen...', $hooks);

      $data['status'] = flagLostpasswordRequest($mysql, $user['username_clean'], 1);
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });
  });

  $this->delete('/test-account', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE
      FROM users
      WHERE email = 'siasola@gmail.com'"
    );

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{user_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE
      FROM users
      WHERE user_id = :user_id"
    );
    $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
