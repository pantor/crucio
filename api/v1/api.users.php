<?php

$app->group('/users', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = startMysql();
		$data = get_all($mysql,
		    "SELECT u.*, g.name AS 'group_name'
		    FROM users u
		    INNER JOIN groups g ON g.group_id = u.group_id
		    ORDER BY g.name ASC, u.user_id DESC",
        [], 'users');
		return createResponse($response, $data);
	});

	$this->get('/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$data = get_all($mysql,
		    "SELECT u.*, g.name
		    FROM users u
		    INNER JOIN groups g ON g.group_id = u.group_id
		    WHERE u.user_id = ?",
        [$args['user_id']], 'users');
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
    	$mysql = startMysql();

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
		if (get_count($mysql, "users WHERE username_clean = ?", [sanitize($clean_username)]) > 0) {
			$data['status'] = 'error_username_taken';
			$validate = false;
		}
		if (get_count($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) {
			$data['status'] = 'error_email_taken';
			$validate = false;
		}

		if ($validate) {
			$secure_pass = generate_hash($clean_password);
			$activation_token = generate_activation_token($mysql);

			$activation_message = $website_url.'activate-account?token='.$activation_token;
			$hooks = ["searchStrs" => ["#ACTIVATION-MESSAGE", "#ACTIVATION-KEY", "#USERNAME#"],
			    "subjectStrs" => [$activation_message, $activation_token, $username]];
			sendTemplateMail('new-registration.html', $clean_email, 'Willkommen bei Crucio', $hooks);

			$data = executeMysql($mysql, "INSERT INTO users (username, username_clean, password, email, activationtoken, last_activation_request, sign_up_date, course_id, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [$username, $clean_username, $secure_pass, $clean_email, $activation_token, time(), time(), $course_id, $semester]);

		    $data['status'] = 'success';
		}

		return createResponse($response, $data, false);
	});

	$this->post('/action/login', function($request, $response, $args) {
		$body =  $request->getParsedBody();

		$email = str_replace('(@)', '@', trim($body['email']));
		$password = trim($body['password']);
		$remember_choice = !empty( $body['remember_me'] ) ? trim( $body['remember_me'] ) : 0;

		$mysql = startMysql();

		if ($email == '')
		    $data['error'] = 'error_no_email';
		if ($password == '')
		    $data['error'] = 'error_no_password';

		if (count($data['error']) == 0) {
			if (get_count($mysql, "users WHERE email = ?", [sanitize($email)]) == 0) {
		    	$data['error'] = 'Name oder Passwort falsch.';

		    } else {
		    	$userdetails = fetch_user_details_by_mail($mysql, $email);

		    	if ($userdetails['active'] == 0) {
		    		$data['error'] = 'Account nicht aktiviert.';

		    	} else {
		    		$entered_pass = generate_hash($password, $userdetails['password']);

		    		if ($entered_pass != $userdetails['password']) {
		    			$data['error'] = 'Name oder Passwort falsch.';

		    		} else {
		    			$userdetails['display_username'] = $userdetails['username'];
		    			$userdetails['clean_username'] = $userdetails['username_clean'];
		    			$userdetails['hash_pw'] = $userdetails['password'];
		    			$userdetails['remember_me'] = $remember_choice;

		    			$data = executeMysql($mysql, "UPDATE users SET last_sign_in = ? WHERE user_id = ?", [time(), $userdetails['user_id']]);

		    			$data['login'] = 'success';
		    			$data['logged_in_user'] = $userdetails;
		    		}
		    	}
		    }
		}

		return createResponse($response, $data);
	});

	$this->post('/action/activate', function($request, $response, $args) {
		$mysql = startMysql();

        $body =  $request->getParsedBody();
		$token = $body['token'];

		$data['token'] = get_count($mysql, "users WHERE activationtoken = ?", [$token]) ;
		if ((get_count($mysql, "users WHERE activationtoken = ?", [$token]) != 1)) {
			$data['status'] = 'error_unknown';

		} else {
			executeMysql($mysql, "UPDATE users SET active = 1 WHERE activationtoken = ? LIMIT 1", [$token]);
			$data['status'] = 'success';
		}

	    return createResponse($response, $data, false);
	});

	$this->put('/{user_id}/account', function($request, $response, $args) {
		$mysql = startMysql();

		$body =  $request->getParsedBody();

		$user_id = $args['user_id'];
		$user = get_fetch($mysql, "SELECT u.* FROM users u WHERE u.user_id = ? LIMIT 1", [$user_id])['result'];

		$old_hash_pw = $user['password'];
		$old_email = $user['email'];

		$email = str_replace('(@)', '@', sanitize($body['email']));

		$data['status'] = 'success';
		if ((get_count($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) && $email != $old_email) {
			$data['status'] = 'error_email_taken';
        }

		if ($data['status'] == 'success') {
			$data = executeMysql($mysql, "UPDATE users SET email = ?, semester = ?, course_id = ? WHERE user_id = ?", [$email, $body['semester'], $body['course_id'], $user_id]);
        }

		$current_password_length = strlen($body['current_password']);
		$new_password_length = strlen($body['password']);

		if ($current_password_length > 0) {
			if ($new_password_length > 6) {

			    $entered_pass = generate_hash($body['current_password'], $old_hash_pw);
			    $entered_pass_new = generate_hash($body['password'], $old_hash_pw);

			    if ($entered_pass != $old_hash_pw)
			        $data['status'] = 'error_incorrect_password';

			    if ($entered_pass_new == $old_hash_pw)
			        $data['status'] = 'error_same_passwords';

			    if ($data['status'] == 'success') {
			    	$secure_pass = generate_hash($body['password']);
			    	$data = executeMysql($mysql, "UPDATE users SET password = ? WHERE user_id = ?", [$secure_pass, $user_id], null);
			    }
			} else {
				$data['status'] = 'error_password_length';
			}
		}

		return createResponse($response, $data, false);
	});

	$this->put('/{user_id}/settings', function($request, $response, $args) {
		$body =  $request->getParsedBody();

		$mysql = startMysql();
		$data = executeMysql($mysql, "UPDATE users SET highlightExams = ?, showComments = ?, repetitionValue = ?, useAnswers = ?, useTags = ? WHERE user_id = ?", [$body['highlightExams'], $body['showComments'], $body['repetitionValue'], $body['useAnswers'], $body['useTags'], $args['user_id']]);
		return createResponse($response, $data);
	});

	$this->put('/{user_id}/group', function($request, $response, $args) {
		$body =  $request->getParsedBody();

		$mysql = startMysql();
		$data = executeMysql($mysql, "UPDATE users SET group_id = ? WHERE user_id = ?", [$body['group_id'], $args['user_id']]);

		return createResponse($response, $data);
	});

	$this->delete('/test-account', function($request, $response, $args) {
		$mysql = startMysql();
		$data = executeMysql($mysql, "DELETE FROM users WHERE email = 'siasola@gmail.com'", []);

		return createResponse($response, $data);
	});


	$this->group('/password', function() {

		$this->post('/reset', function($request, $response, $args) {
			$mysql = startMysql();
			$body =  $request->getParsedBody();
			$email = str_replace('(@)', '@', $body['email']);

			if (get_count($mysql, "users WHERE email = ?", [sanitize($email)]) == 0)
				$data['status'] = 'error_email';

			if (count($response) == 0) {
			    $userdetails = fetch_user_details_by_mail($mysql, $email);

			    if($userdetails['LostpasswordRequest'] == 1) {
			        $response['status'] = 'error_already_requested';

			    } else {
			        global $website_url;
			        $confirm_url = $website_url."forgot-password?confirm=".$userdetails["activationtoken"];
			        $deny_url = $website_url."forgot-password?deny=".$userdetails["activationtoken"];

			        //Setup our custom hooks
			        $hooks = ["searchStrs" => ["#CONFIRM-URL#", "#DENY-URL#", "#USERNAME#"], "subjectStrs" => [$confirm_url, $deny_url, $userdetails['username']]];

			        sendTemplateMail('lost-password-request.html', $email, 'Neues Passwort I', $hooks);

			        flag_lostpassword_request($mysql, $userdetails['username'], 1);
			        $data['status'] = 'success';
			    }
			}

			return createResponse($response, $data, false);
		});

		$this->post('/confirm', function($request, $response, $args) {
			$mysql = startMysql();
			$body =  $request->getParsedBody();

			if($body['token'] == '' || !validate_activation_token($mysql, $body['token'], TRUE)) {
				$data['status'] = 'error_token';

			} else {
				$rand_pass = get_unique_code(15);
				$secure_pass = generate_hash($rand_pass);
				$userdetails = fetch_user_details_by_token($mysql, $body['token']);

				//Setup our custom hooks
				$hooks = ["searchStrs" => ["#GENERATED-PASS#","#USERNAME#"], "subjectStrs" => [$rand_pass, $userdetails['username']]];

				sendTemplateMail('your-lost-password.html', $userdetails['email'], 'Neues Passwort II', $hooks);

				$new_activation_token = generate_activation_token($mysql);
				$data = executeMysql($mysql, "UPDATE users SET password = ?, activationtoken = ? WHERE activationtoken = ?", [$secure_pass, $new_activation_token, sanitize($body['token'])]);

				flag_lostpassword_request($mysql, $userdetails["username_clean"], 0);
				$data['mail'] = $userdetails;
				$data['status'] = 'success';
			}

			return createResponse($response, $data, false);
		});

		$this->post('/deny', function($request, $response, $args) {
			$mysql = startMysql();
			$body =  $request->getParsedBody();

			if ($body['token'] == '' || !validate_activation_token($mysql, $body['token'], TRUE)) {
				$data['status'] = 'error_token';

			} else {
				$userdetails = fetch_user_details($mysql, NULL, $body['token']);
				flag_lostpassword_request($mysql, $userdetails['username_clean'], 0);

				$data['status'] = 'success';
			}

			return createResponse($response, $data, false);
		});
	});
});

?>