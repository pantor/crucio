<?php

$app->group('/users', function() {

    $this->get('', function($request, $response, $args) {
        $mysql = init();

        $stmt = $mysql->prepare(
		    "SELECT u.*, g.name AS 'group_name'
		    FROM users u
		    INNER JOIN groups g ON g.group_id = u.group_id
		    ORDER BY g.name ASC, u.user_id DESC"
		);

        $data['users'] = getAll($stmt);
		return createResponse($response, $data);
	});

    $this->get('/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "SELECT u.*, g.name
		    FROM users u
		    INNER JOIN groups g ON g.group_id = u.group_id
		    WHERE u.user_id = :user_id"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data['users'] = getAll($stmt);
		return createResponse($response, $data);
	});

    $this->post('', function($request, $response, $args) {
        $mysql = init();
        $body = $request->getParsedBody();

        $username = $body['username'];
        $email = str_replace('(@)', '@', sanitize($body['email']));
        $clean_email = $email;
        $clean_password = trim($body['password']);
        $clean_username = sanitize($username);
        $semester = $body['semester'];
        $course_id = $body['course'];
        $activation_token = 0;

        global $website_url;

        $validate = true;
        if (!strlen($username)) {
            $data['status'] = 'error';
            $validate = false;
        }

        if (getCount($mysql, "users WHERE username_clean = ?", [sanitize($clean_username)]) > 0) {
            $data['status'] = 'error_username_taken';
            $validate = false;
        }

        if (getCount($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) {
            $data['status'] = 'error_email_taken';
            $validate = false;
        }

		if ($validate) {
			$secure_pass = generateHash($clean_password);
			$activation_token = generateActivationToken($mysql);

			$activation_message = $website_url.'activate-account?token='.$activation_token;
			$hooks = ['searchStrs' => ["#ACTIVATION-MESSAGE", "#ACTIVATION-KEY", "#USERNAME#"],
			    'subjectStrs' => [$activation_message, $activation_token, $username]];
            sendTemplateMail('new-registration.html', $clean_email, 'Willkommen bei Crucio', $hooks);

            $stmt = $mysql->prepare(
    		    "INSERT INTO users (username, username_clean, password, email, activationtoken, last_activation_request, sign_up_date, course_id, semester)
    		    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    		);
    		$stmt->bindValue(1, $username);
    		$stmt->bindValue(2, $clean_username);
    		$stmt->bindValue(3, $secure_pass);
    		$stmt->bindValue(4, $clean_email);
    		$stmt->bindValue(5, $activation_token);
    		$stmt->bindValue(6, time());
    		$stmt->bindValue(7, time());
    		$stmt->bindValue(8, $course_id);
    		$stmt->bindValue(9, $semester);

    		$data = execute($stmt);
            $data['status'] = 'success';
        }

        return createResponse($response, $data, false);
	});

	$this->post('/action/login', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$email = str_replace('(@)', '@', trim($body['email']));
		$password = trim($body['password']);
		$remember_choice = !empty( $body['remember_me'] ) ? trim( $body['remember_me'] ) : 0;

		if ($email == '') {
		    $data['error'] = 'error_no_email';
        }

        if ($password == '') {
            $data['error'] = 'error_no_password';
        }

		if (count($data['error']) == 0) {
			if (getCount($mysql, "users WHERE email = ?", [sanitize($email)]) == 0) {
		    	$data['error'] = 'Name oder Passwort falsch.';
		    } else {
		    	$userdetails = fetchUserDetailsByMail($mysql, $email);

                $data['userdetails'] = $userdetails;

		    	if ($userdetails['active'] == 0) {
		    		$data['error'] = 'Account nicht aktiviert.';
		    	} else {
		    		$entered_pass = generateHash($password, $userdetails['password']);

		    		if ($entered_pass != $userdetails['password']) {
		    			$data['error'] = 'Name oder Passwort falsch.';
		    		} else {
		    			$userdetails['display_username'] = $userdetails['username'];
		    			$userdetails['clean_username'] = $userdetails['username_clean'];
		    			$userdetails['hash_pw'] = $userdetails['password'];
		    			$userdetails['remember_me'] = $remember_choice;

		    			$stmt = $mysql->prepare(
                		    "UPDATE users
                		    SET last_sign_in = :last_sign_in
                		    WHERE user_id = :user_id"
                		);
                		$stmt->bindValue(':last_sign_in', time());
                		$stmt->bindValue(':user_id', $userdetails['user_id']);

                		$data = execute($stmt);
		    			$data['login'] = 'success';
		    			$data['logged_in_user'] = $userdetails;
		    		}
		    	}
		    }
		}

		return createResponse($response, $data);
	});

	$this->post('/action/activate', function($request, $response, $args) {
		$mysql = init();
        $body = $request->getParsedBody();

		$token = $body['token'];

		$data['token'] = getCount($mysql, "users WHERE activationtoken = ?", [$token]) ;
		if ((getCount($mysql, "users WHERE activationtoken = ?", [$token]) != 1)) {
			$data['status'] = 'error_unknown';
		} else {
			$stmt = $mysql->prepare(
    		    "UPDATE users
    		    SET active = 1
    		    WHERE activationtoken = :token
    		    LIMIT 1"
    		);
    		$stmt->bindValue(':token', $token);

    		$data = execute($stmt);
			$data['status'] = 'success';
		}

	    return createResponse($response, $data, false);
	});

	$this->put('/{user_id}/account', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$user_id = $args['user_id'];
		$email = str_replace('(@)', '@', sanitize($body['email']));

		$stmt_user = $mysql->prepare(
		    "SELECT u.*
		    FROM users u
		    WHERE u.user_id = :user_id
		    LIMIT 1"
		);
		$stmt_user->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $user = getFetch($stmt_user);

		$old_hash_pw = $user['password'];
		$old_email = $user['email'];

		$data['status'] = 'success';
		if ((getCount($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) && $email != $old_email) {
			$data['status'] = 'error_email_taken';
        }

		if ($data['status'] == 'success') {
    		$stmt = $mysql->prepare(
    		    "UPDATE users
    		    SET email = ?, semester = ?, course_id = ?
    		    WHERE user_id = ?"
    		);
    		$stmt->bindValue(1, $email);
    		$stmt->bindValue(2, $body['semester']);
    		$stmt->bindValue(3, $body['course_id']);
    		$stmt->bindValue(4, $user_id, PDO::PARAM_INT);

    		$data = execute($stmt);
        }

		$current_password_length = strlen($body['current_password']);
		$new_password_length = strlen($body['password']);

		if ($current_password_length > 0) {
			if ($new_password_length > 6) {
			    $entered_pass = generateHash($body['current_password'], $old_hash_pw);
			    $entered_pass_new = generateHash($body['password'], $old_hash_pw);

			    if ($entered_pass != $old_hash_pw) {
			        $data['status'] = 'error_incorrect_password';
			    }

			    if ($entered_pass_new == $old_hash_pw) {
			        $data['status'] = 'error_same_passwords';
			    }

			    if ($data['status'] == 'success') {
			    	$secure_pass = generateHash($body['password']);

			    	$stmt = $mysql->prepare(
            		    "UPDATE users
            		    SET password = ?
            		    WHERE user_id = ?"
            		);
            		$stmt->bindValue(1, $secure_pass);
            		$stmt->bindValue(2, $user_id, PDO::PARAM_INT);

            		$data = execute($stmt);
			    }
			} else {
				$data['status'] = 'error_password_length';
			}
		}

		return createResponse($response, $data, false);
	});

	$this->put('/{user_id}/settings', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "UPDATE users
		    SET highlightExams = ?, showComments = ?, repetitionValue = ?, useAnswers = ?, useTags = ?
		    WHERE user_id = ?"
		);
		$stmt->bindValue(1, $body['highlightExams']);
		$stmt->bindValue(2, $body['showComments']);
		$stmt->bindValue(3, $body['repetitionValue']);
		$stmt->bindValue(4, $body['useAnswers']);
		$stmt->bindValue(5, $body['useTags']);
		$stmt->bindValue(6, $args['user_id']);

        $data = execute($stmt);
		return createResponse($response, $data);
	});

	$this->put('/{user_id}/group', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "UPDATE users
		    SET group_id = :group_id
		    WHERE user_id = :user_id"
		);
		$stmt->bindValue(':group_id', $body['group_id']);
		$stmt->bindValue(':user_id', $args['user_id']);

        $data = execute($stmt);
		return createResponse($response, $data);
	});

	$this->delete('/test-account', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE FROM users WHERE email = 'siasola@gmail.com'"
		);

        $data = execute($stmt);
		return createResponse($response, $data);
	});


	$this->group('/password', function() {

		$this->post('/reset', function($request, $response, $args) {
			$mysql = init();
			$body = $request->getParsedBody();

			$email = str_replace('(@)', '@', $body['email']);

			if (getCount($mysql, "users WHERE email = ?", [sanitize($email)]) == 0) {
				$data['status'] = 'error_email';
            }

			if (count($data) == 0) {
			    $userdetails = fetchUserDetailsByMail($mysql, $email);

			    if ($userdetails['LostpasswordRequest'] == 1) {
			        $data['status'] = 'error_already_requested';
			    } else {
			        global $website_url;
			        $confirm_url = $website_url.'forgot-password?confirm='.$userdetails['activationtoken'];
			        $deny_url = $website_url.'forgot-password?deny='.$userdetails['activationtoken'];

			        //Setup our custom hooks
			        $hooks = ['searchStrs' => ["#CONFIRM-URL#", "#DENY-URL#", "#USERNAME#"], 'subjectStrs' => [$confirm_url, $deny_url, $userdetails['username']]];

			        sendTemplateMail('lost-password-request.html', $email, 'Neues Passwort I', $hooks);

			        flagLostpasswordRequest($mysql, $userdetails['username'], 1);
			        $data['status'] = 'success';
			    }
			}

			return createResponse($response, $data, false);
		});

		$this->post('/confirm', function($request, $response, $args) {
			$mysql = init();
			$body = $request->getParsedBody();

			if ($body['token'] == '' || !validateActivationToken($mysql, $body['token'], TRUE)) {
				$data['status'] = 'error_token';
			} else {
				$rand_pass = getUniqueCode(15);
				$secure_pass = generateHash($rand_pass);
				$userdetails = fetchUserDetailsByToken($mysql, $body['token']);

				//Setup our custom hooks
				$hooks = ["searchStrs" => ["#GENERATED-PASS#","#USERNAME#"], "subjectStrs" => [$rand_pass, $userdetails['username']]];

				sendTemplateMail('your-lost-password.html', $userdetails['email'], 'Neues Passwort II', $hooks);

				$new_activation_token = generateActivationToken($mysql);

				$stmt = $mysql->prepare(
        		    "UPDATE users
        		    SET password = ?, activationtoken = ?
        		    WHERE activationtoken = ?"
        		);
        		$stmt->bindValue(1, $secure_pass);
        		$stmt->bindValue(2, $new_activation_token);
        		$stmt->bindValue(3, sanitize($body['token']));

        		$data = execute($stmt);

				flagLostpasswordRequest($mysql, $userdetails["username_clean"], 0);
				$data['mail'] = $userdetails;
				$data['status'] = 'success';
			}

			return createResponse($response, $data, false);
		});

		$this->post('/deny', function($request, $response, $args) {
			$mysql = init();
			$body = $request->getParsedBody();

			if ($body['token'] == '' || !validateActivationToken($mysql, $body['token'], TRUE)) {
				$data['status'] = 'error_token';
			} else {
				$userdetails = fetchUserDetailsByToken($mysql, $body['token']);
				flagLostpasswordRequest($mysql, $userdetails['username_clean'], 0);

				$data['status'] = 'success';
			}

			return createResponse($response, $data, false);
		});
	});
});

?>