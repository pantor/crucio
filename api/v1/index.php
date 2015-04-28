<?php

require_once('funcs.general.php');
require_once('../../public/php/Slim/Slim.php');


\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$host_name = $_SERVER['HTTP_HOST'];
$protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"], 0, 5)) == 'https://' ? 'https://' : 'http://';
$website_url = $protocol.$host_name.'/';



$app->group('/exams', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT e.*, u.username AS 'author', COUNT(*) AS 'question_count' FROM exams e, users u, questions q WHERE e.visibility = 1 AND e.user_id_added = u.user_id AND q.exam_id = e.exam_id GROUP BY q.exam_id ORDER BY e.semester ASC, e.subject ASC, e.date DESC", [], 'exams');
		print_response($app, $response);
	});

	$app->get('/all-visibility', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT e.*, u.username AS 'author', COUNT(*) AS 'question_count' FROM exams e, users u, questions q WHERE e.user_id_added = u.user_id AND q.exam_id = e.exam_id GROUP BY q.exam_id ORDER BY e.semester ASC, e.subject ASC, e.date DESC", [], 'exams');
		print_response($app, $response);
	});

	$app->get('/user_id/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = get_each($mysql, "SELECT e.*, u.username, COUNT(*) AS 'question_count' FROM exams e, users u, questions q WHERE e.visibility = 1 AND e.user_id_added = u.user_id AND q.exam_id = e.exam_id GROUP BY q.exam_id ORDER BY e.semester ASC, e.subject ASC, e.date DESC", [], 'exam', function($row, $stmt, $mysql) use ($user_id) {
			$tmp['answered_questions'] = get_count($mysql, "questions q, results r WHERE r.user_id = ? AND r.resetted = 0 AND r.attempt = 1 AND q.exam_id = ? AND r.question_id = q.question_id", [$user_id, $row['exam_id']]);
			return $tmp;
		});
		print_response($app, $response);
	});

	$app->get('/:exam_id', function($exam_id) use ($app) {
		$mysql = start_mysql();
		$exam = execute_mysql($mysql, "SELECT e.*, u.username, u.email FROM exams e, users u WHERE e.exam_id = ? AND u.user_id = e.user_id_added", [$exam_id], function($stmt, $mysql) {
			$response['exam'] = $stmt->fetch(PDO::FETCH_ASSOC);
			return $response;
		});

		$questions = get_each($mysql, "SELECT * FROM questions WHERE exam_id = ? ORDER BY question_id ASC", [$exam_id], 'questions', function($row, $stmt, $mysql) {
			$tmp['answers'] = unserialize($row['answers']);
			return $tmp;
		});

		$response = $exam['exam'];
		$response['questions'] = $questions['questions'];
		$response['question_count'] = count($questions['questions']);
		print_response($app, $response);
	});

	$app->get('/action/prepare/:examid/:random', function($exam_id, $random) use ($app) {
		$mysql = start_mysql();

		$sql = "SELECT DISTINCT * FROM questions";
		$parameters = [];
		if ($exam_id) {
			$sql .= " WHERE exam_id = ?";
			$parameters[] = $exam_id;
		}
		if ($random) {
			$sql .= " ORDER BY RAND()";
		}

		$response = get_each($mysql, $sql, $parameters, 'list', function($row, $stmt, $mysql) {
			$tmp['answers'] = unserialize($row['answers']);
			return $tmp;
		});

		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO exams ( subject, professor, semester, date, sort, date_added, date_updated, user_id_added, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [$data->subject, $data->professor, $data->semester, $data->date, $data->type, time(), time(), $data->user_id_added, $data->duration, $data->notes], function($stmt, $mysql) {
			$response['exam_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});

	$app->put('/:exam_id', function($exam_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE exams SET subject = ?, professor = ?, semester = ?, date = ?, sort = ?, duration = ?, notes = ?, file_name = ?, visibility = ?, date_updated = ? WHERE exam_id = ?", [$data->subject, $data->professor, $data->semester, $data->date, $data->sort, $data->duration, $data->notes, $data->file_name, $data->visibility, time(), $exam_id]);
		print_response($app, $response);
	});

	$app->delete('/:exam_id', function($exam_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM exams WHERE exam_id = ?", [$exam_id]);
		print_response($app, $response);
	});
});


$app->group('/questions', function () use ($app) {

	$app->get('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$question = execute_mysql($mysql, "SELECT q.*, e.*, u.email, u.username FROM questions q, exams e, users u WHERE q.question_id = ? AND q.exam_id = e.exam_id AND e.user_id_added = u.user_id", [$question_id], function($stmt, $mysql) {
			$response['question'] = $stmt->fetch(PDO::FETCH_ASSOC);
			$response['question']['answers'] = unserialize($response['question']['answers']);
			return $response;
		});

		$comments = get_all($mysql, "SELECT * FROM comments WHERE question_id = ? ORDER BY comment_id ASC", [$question_id], 'comments');

		$response['question'] = $question['question'];
		$response['comments'] = $comments['comments'];
		print_response($app, $response);
	});

	$app->get('/:question_id/user/:user_id', function($question_id, $user_id) use ($app) {
		$mysql = start_mysql();
		$question = execute_mysql($mysql, "SELECT q.*, e.* FROM questions q, exams e WHERE q.question_id = ? AND q.exam_id = e.exam_id", [$question_id], function($stmt, $mysql) {
			$response['question'] = $stmt->fetch(PDO::FETCH_ASSOC);
			$response['question']['answers'] = unserialize($response['question']['answers']);
			return $response;
		});

		$tags = get_fetch($mysql, "SELECT tags FROM tags WHERE user_id = ? AND question_id = ?", [$user_id, $question_id], 'tags');
		if(!$tags)
			$tags['tags'] = '';

		$comments = get_all($mysql, "SELECT c.*, IF(uc.user_voting IS NULL, 0, uc.user_voting) AS 'user_voting', u.username, (SELECT SUM(uc.user_voting) FROM user_comments_data uc WHERE uc.comment_id = c.comment_id AND uc.user_id != ?) AS 'voting' FROM users u, comments c LEFT JOIN user_comments_data uc ON c.comment_id = uc.comment_id WHERE c.question_id = ? AND c.user_id = u.user_id AND (uc.user_id IS NULL OR uc.user_id = ?) ORDER BY c.comment_id ASC", [$user_id, $question_id, $user_id], 'comments');

		$response = $question['question'];
		$response['tags'] = $tags['tags']['tags'];
		$response['comments'] = $comments['comments'];
		print_response($app, $response);
	});

	$app->get('/search/:query/:user_id', function($query, $user_id) use ($app) {
		$mysql = start_mysql();
		execute_mysql($mysql, "INSERT INTO search_queries (user_id, query, date) VALUES (?, ?, ?)", [$user_id, $query, time()]);

		if (intval($query) > 0) {
			$result = get_all($mysql, "SELECT q.*, e.subject, e.semester FROM questions q, exams e WHERE (q.question_id = ?) AND q.exam_id = e.exam_id AND e.visibility = 1", [$query]);

		} else {
			$new_query = str_replace( ' ', '%\') AND LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(\'%', $query);
			$result = get_all($mysql, "SELECT q.*, e.subject, e.semester FROM questions q, exams e WHERE ( LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(?) ) AND q.exam_id = e.exam_id AND e.visibility = 1", ['%'.$new_query.'%']);
		}

		$response['query'] = $query;
		$response['result'] = $result['result'];
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO questions (question, answers, correct_answer, exam_id, date_added, user_id_added, explanation, question_image_url, type, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [$data->question, serialize($data->answers), $data->correct_answer, $data->exam_id, time(), $data->user_id_added, $data->explanation, $data->question_image_url, $data->type, $data->topic], function($stmt, $mysql) {
			$response['question_id'] = $mysql->lastInsertId();
			return $response;
		});

		print_response($app, $response);
	});

	$app->put('/:question_id', function($question_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE questions SET question = ?, answers = ?, correct_answer = ?, exam_id = ?, explanation = ?, question_image_url = ?, type = ?, topic = ? WHERE question_id = ?", [$data->question, serialize($data->answers), $data->correct_answer, $data->exam_id, $data->explanation, $data->question_image_url, $data->type, $data->topic, $question_id]);
		print_response($app, $response);
	});

	$app->delete('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM questions WHERE question_id = ?", [$question_id]);
		print_response($app, $response);
	});
});


$app->group('/learn', function () use ($app) {

	$app->post('/number-questions', function() use ($app) {
		$mysql = start_mysql();

		$data = json_decode($app->request()->getBody());
		$subject_list = $data->selection_subject_list;
		$result = 0;

		foreach ($subject_list as $key => $value) {
			if (count($value) == 0) {
				$result += get_count($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id", [$key]);
			} else {
				foreach ($subject_list->$key as $cat) {
					$result += get_count($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id AND q.topic = ?", [$key, $cat]);
				}
			}
		}
		
		$response['number_questions'] = $result;
	    print_response($app, $response);
	});

	$app->post('/prepare', function() use ($app) {
		$mysql = start_mysql();

		$data = json_decode($app->request()->getBody());
		$subject_list = $data->selection_subject_list;
		$selection_number_questions = $data->selection_number_questions;

		$list = [];

		foreach ($subject_list as $key => $value) {
			if (count($value) == 0) {
				$result = execute_mysql($mysql, "SELECT DISTINCT q.* FROM questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id", [$key], function($stmt, $mysql) {
					$response['stmt'] = $stmt;
					return $response;
				});
				while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
					$row['answers'] = unserialize($row['answers']);
					$list[] = $row;
				}

			} else {
				foreach ($subject_list->$key as $cat) {
					$result = execute_mysql($mysql, "SELECT DISTINCT q.* FROM questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id AND q.topic = ?", [$key, $cat], function($stmt, $mysql) {
						$response['stmt'] = $stmt;
						return $response;
					});
					while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
						$row['answers'] = unserialize($row['answers']);
						$list[] = $row;
					}
				}
			}
		}

		shuffle($list);

		if ($selection_number_questions > 0)
			$list = array_slice($list, 0, $selection_number_questions);

	    $response['list'] = $list;
	    $response['selection_subject_list'] = $subject_list;
	    print_response($app, $response);
	});
});


$app->group('/contact', function () use ($app) {

	$app->post('/send-mail', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$name = trim($data->name);
		$email = str_replace('(@)', '@', trim($data->email));

		$text = trim($data->text);
		$destination = 'kontakt@crucio-leipzig.de, allgemeinerkontakt@crucio-leipzig.de';

		$sender_name = $name.' - Kontakt Crucio';
		$sender_email = 'kontaktfeld@crucio-leipzig.de';

		$hooks = ["searchStrs" => ["#MESSAGE#", "#MAIL#", "#USERNAME#"],
			"subjectStrs" => [$text, $email, $name]];
		$response = send_template_mail('contact.html', $destination, 'Allgemeine Anfrage', $hooks, $sender_name, $sender_email);

		print_response($app, $response);
	});

	$app->post('/send-mail-question', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$name = trim($data->name);
		$email = str_replace('(@)', '@', trim($data->email));

		if ($data->mail_subject) {
			$subject = $data->mail_subject.' zur Frage #'.$data->question_id;
			$mail_subject_html = '<dt>Anliegen</dt><dd>'.$data->mail_subject.'</dd>';
		} else {
			$subject = 'Zur Frage #'.$data->question_id;
			$mail_subject_html = '';
		}

		$sender_name = $name.' - Kontakt Crucio';
		$sender_email = 'kontaktfeld@crucio-leipzig.de';

		$destination = 'kontakt@crucio-leipzig.de, '.$data->author_email;

		$hooks = ["searchStrs" => ["#MESSAGE#", "#MAIL#", "#USERNAME#", "#AUTHOR#", "#QUESTION#", "#QUESTION_ID#", "#SUBJECT#", "#DATE2#", "#EXAM_ID#", "#MAIL_SUBJECT#"],
			"subjectStrs" => [trim($data->text), $email, $name, $data->author, $data->question, $data->question_id, $data->subject, $data->date, $data->exam_id, $mail_subject_html]];
		$response = send_template_mail('contact-question.html', $destination, $subject, $hooks, $sender_name, $sender_email);

		print_response($app, $response);
	});
});


$app->group('/whitelist', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT w.*, IF(u.user_id IS NOT NULL, 1, 0) as 'used' FROM whitelist w LEFT JOIN users u ON u.email = w.mail_address", [], 'whitelist');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO whitelist ( mail_address ) VALUES (?)", [str_replace('(@)', '@', sanitize($data->mail_address))], null);
		print_response($app, $response);
	});

	$app->delete('/:mail_address', function($mail_address) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM whitelist WHERE mail_address = ?", [$mail_address], null);
		print_response($app, $response);
	});
});


$app->group('/users', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT u.*, g.name AS 'group_name' FROM users u, groups g WHERE u.group_id = g.group_id ORDER BY g.name ASC, u.user_id DESC", [], 'users');
		print_response($app, $response);
	});

	$app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT u.*, g.name FROM users u, groups g WHERE u.group_id = g.group_id AND u.user_id = ?", [$user_id], 'users');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());
		$username = $data->username;
		$email = str_replace('(@)', '@', sanitize($data->email));
		$clean_email = $email;
		$clean_password = trim($data->password);
		$clean_username = sanitize($username);
		$semester = $data->semester;
		$course_id = $data->course;
		$activation_token = 0;

		$mysql = start_mysql();
		global $website_url;

		$validate = true;
		if (!strlen($username)) {
			$response['status'] = 'error';
			$validate = false;
		}
		if (get_count($mysql, "users WHERE username_clean = ?", [sanitize($clean_username)]) > 0) {
			$response['status'] = 'error_username_taken';
			$validate = false;
		}
		if (get_count($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) {
			$response['status'] = 'error_email_taken';
			$validate = false;
		}

		if ($validate) {
			$secure_pass = generate_hash($clean_password);
			$activation_token = generate_activation_token($mysql);

			$activation_message = $website_url.'activate-account?token='.$activation_token;
			$hooks = ["searchStrs" => ["#ACTIVATION-MESSAGE", "#ACTIVATION-KEY", "#USERNAME#"],
			    "subjectStrs" => [$activation_message, $activation_token, $username]];
			send_template_mail('new-registration.html', $clean_email, 'Willkommen bei Crucio', $hooks);

			$response = execute_mysql($mysql, "INSERT INTO users (username, username_clean, password, email, activationtoken, last_activation_request, sign_up_date, course_id, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [$username, $clean_username, $secure_pass, $clean_email, $activation_token, time(), time(), $course_id, $semester]);

		    $response['status'] = 'success';
		}

		print_response($app, $response, false);
	});

	$app->post('/action/login', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$email = str_replace('(@)', '@', trim($data->email));
		$password = trim($data->password);
		$remember_choice = !empty( $data->remember_me ) ? trim( $data->remember_me ) : 0;

		$mysql = start_mysql();

		if ($email == '')
		    $response['error'] = 'error_no_email';
		if ($password == '')
		    $response['error'] = 'error_no_password';

		if (count($response['error']) == 0) {
			if (get_count($mysql, "users WHERE email = ?", [sanitize($email)]) == 0) {
		    	$response['error'] = 'Name oder Passwort falsch.';

		    } else {
		    	$userdetails = fetch_user_details_by_mail($mysql, $email);

		    	if ($userdetails['active'] == 0) {
		    		$response['error'] = 'Account nicht aktiviert.';

		    	} else {
		    		$entered_pass = generate_hash($password, $userdetails['password']);

		    		if ($entered_pass != $userdetails['password']) {
		    			$response['error'] = 'Name oder Passwort falsch.';

		    		} else {
		    			$userdetails['display_username'] = $userdetails['username'];
		    			$userdetails['clean_username'] = $userdetails['username_clean'];
		    			$userdetails['hash_pw'] = $userdetails['password'];
		    			$userdetails['remember_me'] = $remember_choice;

		    			$response = execute_mysql($mysql, "UPDATE users SET last_sign_in = ? WHERE user_id = ?", [time(), $userdetails['user_id']]);

		    			$response['login'] = 'success';
		    			$response['logged_in_user'] = $userdetails;
		    		}
		    	}
		    }
		}

		print_response($app, $response);
	});

	$app->post('/action/activate', function() use ($app) {
		$data = json_decode($app->request()->getBody());
		$token = $data->token;

		$mysql = start_mysql();

		$response['token'] = get_count($mysql, "users WHERE activationtoken = ?", [$token]) ;
		if ((get_count($mysql, "users WHERE activationtoken = ?", [$token]) != 1)) {
			$response['status'] = 'error_unknown';

		} else {
			execute_mysql($mysql, "UPDATE users SET active = 1 WHERE activationtoken = ? LIMIT 1", [$token]);
			$response['status'] = 'success';
		}

	    print_response($app, $response, false);
	});

	$app->put('/:user_id/account', function($user_id) use ($app) {
		$mysql = start_mysql();
		$data = json_decode($app->request()->getBody());
		$user = get_fetch($mysql, "SELECT u.* FROM users u WHERE u.user_id = ? LIMIT 1", [$user_id])['result'];

		$old_hash_pw = $user['password'];
		$old_email = $user['email'];

		$email = str_replace('(@)', '@', sanitize($data->email));

		$response['status'] = 'success';
		if ((get_count($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) && $email != $old_email)
			$response['status'] = 'error_email_taken';

		if ($response['status']=='success')
			$response = execute_mysql($mysql, "UPDATE users SET email = ?, semester = ?, course_id = ? WHERE user_id = ?", [$email, $data->semester, $data->course_id, $user_id]);

		$current_password_length = strlen($data->current_password);
		$new_password_length = strlen($data->password);

		if ($current_password_length > 0) {
			if ($new_password_length > 6) {

			    $entered_pass = generate_hash($data->current_password, $old_hash_pw);
			    $entered_pass_new = generate_hash($data->password, $old_hash_pw);
				
			    if ($entered_pass != $old_hash_pw)
			        $response['status'] = 'error_incorrect_password';

			    if ($entered_pass_new == $old_hash_pw)
			        $response['status'] = 'error_same_passwords';

			    if ($response['status'] == 'success') {
			    	$secure_pass = generate_hash($data->password);
			    	$response = execute_mysql($mysql, "UPDATE users SET password = ? WHERE user_id = ?", [$secure_pass, $user_id], null);
			    }
			} else {
				$response['status'] = 'error_password_length';
			}
		}

		print_response($app, $response, false);
	});

	$app->put('/:user_id/settings', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE users SET highlightExams = ?, showComments = ?, repetitionValue = ?, useAnswers = ?, useTags = ? WHERE user_id = ?", [$data->highlightExams, $data->showComments, $data->repetitionValue, $data->useAnswers, $data->useTags, $user_id]);
		print_response($app, $response);
	});

	$app->put('/:user_id/group', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE users SET group_id = ? WHERE user_id = ?", [$data->group_id, $user_id]);
		print_response($app, $response);
	});

	$app->delete('/test-account', function() use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM users WHERE username = 'Lars Test'", []);
		print_response($app, $response);
	});


	$app->group('/password', function () use ($app) {

		$app->post('/reset', function() use ($app) {
			$mysql = start_mysql();
			$data = json_decode($app->request()->getBody());
			$email = str_replace('(@)', '@', $data->email);

			if (get_count($mysql, "users WHERE email = ?", [sanitize($email)]) == 0)
				$response['status'] = 'error_email';

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

			        send_template_mail('lost-password-request.html', $email, 'Neues Passwort I', $hooks);

			        flag_lostpassword_request($mysql, $userdetails['username'], 1);
			        $response['status'] = 'success';
			    }
			}

			print_response($app, $response, false);
		});

		$app->post('/confirm', function() use ($app) {
			$mysql = start_mysql();
			$data = json_decode($app->request()->getBody());

			if($data->token == "" || !validate_activation_token($mysql, $data->token, TRUE)) {
				$response['status'] = 'error_token';

			} else {
				$rand_pass = get_unique_code(15);
				$secure_pass = generate_hash($rand_pass);
				$userdetails = fetch_user_details_by_token($mysql, $data->token);

				//Setup our custom hooks
				$hooks = ["searchStrs" => ["#GENERATED-PASS#","#USERNAME#"], "subjectStrs" => [$rand_pass, $userdetails['username']]];

				send_template_mail('your-lost-password.html', $userdetails['email'], 'Neues Passwort II', $hooks);

				$new_activation_token = generate_activation_token($mysql);
				$response = execute_mysql($mysql, "UPDATE users SET password = ?, activationtoken = ? WHERE activationtoken = ?", [$secure_pass, $new_activation_token, sanitize($data->token)]);

				flag_lostpassword_request($mysql, $userdetails["username_clean"], 0);
				$response['mail'] = $userdetails;
				$response['status'] = 'success';
			}

			print_response($app, $response, false);
		});

		$app->post('/deny', function() use ($app) {
			$mysql = start_mysql();
			$data = json_decode($app->request()->getBody());
			
			if ($data->token == "" || !validate_activation_token($mysql, $data->token, TRUE)) {
				$response['status'] = 'error_token';

			} else {
				$userdetails = fetch_user_details($mysql, NULL, $data->token);
				flag_lostpassword_request($mysql, $userdetails['username_clean'], 0);

				$response['status'] = 'success';
			}

			print_response($app, $response, false);
		});
	});
});



$app->group('/comments', function () use ($app) {

    $app->get('', function () use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT q.question, c.*, u.username FROM comments c, users u, questions q WHERE c.user_id = u.user_id AND c.question_id = q.question_id ORDER BY c.comment_id DESC", [], 'comments');
		print_response($app, $response);
    });

    $app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response['comments'] = get_all($mysql, "SELECT q.question, c.*, u.username FROM comments c, users u, questions q WHERE c.user_id = u.user_id AND u.user_id = ? AND q.question_id = c.question_id ORDER BY c.comment_id ASC", [$user_id], 'comments')['comments'];
		print_response($app, $response);
	});

    $app->get('/author/:user_id', function () use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "SELECT c.*, u.username, q.question, q.exam_id, e.user_id_added, (SELECT u2.username FROM users u2 WHERE u2.user_id = e.user_id_added) AS 'username_added' FROM comments c, users u, questions q, exams e WHERE c.user_id = u.user_id AND c.question_id = q.question_id AND q.exam_id = e.exam_id ORDER BY c.comment_id DESC", [], function($stmt, $mysql) {
			$response['comments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			return $response;
		});
		print_response($app, $response);
    });

    $app->post('/:user_id', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO comments (user_id, date, comment, question_id, reply_to) VALUES (?, ?, ?, ?, ?)", [$user_id, time(), $data->comment, $data->question_id, $data->reply_to], function($stmt, $mysql) {
			$response['comment_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});

	$app->post('/:comment_id/user/:user_id', function($comment_id, $user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO user_comments_data (user_id, comment_id, user_voting, subscription) VALUES (?, ?, ?, '0') ON DUPLICATE KEY UPDATE user_voting = ?", [$user_id, $comment_id, $data->user_voting, $data->user_voting]);
		print_response($app, $response);
	});

	$app->delete('/:comment_id', function($comment_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM comments WHERE comment_id = ?", [$comment_id]);
		print_response($app, $response);
	});
});


$app->group('/tags', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT DISTINCT t.*, q.question, q.exam_id, e.subject, u.username FROM tags t, questions q, exams e, users u WHERE t.question_id = q.question_id AND q.exam_id = e.exam_id AND t.user_id = u.user_id AND t.tags != '' ORDER BY t.question_id ASC", [], 'tags');
		print_response($app, $response);
	});

	$app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT DISTINCT t.tags, t.question_id, q.question, q.exam_id, e.subject FROM tags t, questions q, exams e WHERE t.question_id = q.question_id AND q.exam_id = e.exam_id AND t.user_id = ? AND t.tags != '' ORDER BY t.question_id ASC", [$user_id], 'tags');
		print_response($app, $response);
	});

	$app->get('question_id/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT DISTINCT t.tags, t.question_id, q.question, q.exam_id, e.subject FROM tags t, questions q, exams e WHERE t.question_id = q.question_id AND q.exam_id = e.exam_id AND t.question_id = ? AND t.tags != '' ORDER BY t.question_id ASC", [$question_id], 'tags');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		if ($data->tags == '')
			$response = execute_mysql($mysql, "DELETE FROM tags WHERE question_id = ? AND user_id = ?", [$data->question_id, $data->user_id]);
		else
			$response = execute_mysql($mysql, "INSERT INTO tags (question_id, user_id, tags) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tags = ?", [$data->question_id, $data->user_id, $data->tags, $data->tags]);
		print_response($app, $response);
	});
});


$app->group('/results', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT r.* FROM results r", [], 'results');
		print_response($app, $response);
	});

	$app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "SELECT * FROM results WHERE user_id = ?", [$user_id], 'results');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$attempt = execute_mysql($mysql, "SELECT IF(MAX(attempt), MAX(attempt), 0) AS max_attempt FROM results WHERE user_id = ? AND question_id = ?", [$data->user_id, $data->question_id], function($stmt, $mysql) {
			$response['max'] = $stmt->fetchAll(PDO::FETCH_ASSOC)['max_attempt'];
			return $response;
		});

		$response = execute_mysql($mysql, "INSERT INTO results (user_id, question_id, attempt, correct, given_result, date, resetted) VALUES (?, ?, ?, ?, ?, ?, '0')", [$data->user_id, $data->question_id, $attempt['max']+1, $data->correct, $data->given_result, time()]);
		print_response($app, $response);
	});

	$app->delete('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE results SET resetted = '1' WHERE user_id = ?", [$user_id]);
		print_response($app, $response);
	});

	$app->delete('/:user_id/:exam_id', function($user_id, $exam_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE results r, questions q SET r.resetted = '1' WHERE r.question_id = q.question_id AND q.exam_id = ? AND r.user_id = ?", [$exam_id, $user_id]);
		print_response($app, $response);
	});
});



$app->group('/admin', function () use ($app) {

	$app->post('/change-semester/:phrase', function($phrase) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE users SET semester = semester + ?", [$data->number]);
		print_response($app, $response);
	});
});


$app->group('/stats', function () use ($app) {

	$app->get('/general', function() use ($app) {
		$mysql = start_mysql();
		$stats['time'] = time();

		$stats['user_count'] = get_count($mysql, "users");
		$stats['user_count_register_today'] = get_count($mysql, "users WHERE sign_up_date > ?", [time() - 1*24*60*60]);
		$stats['user_count_login_today'] = get_count($mysql, "users WHERE last_sign_in > ?", [time() - 1*24*60*60]);

		$stats['exam_count'] = get_count($mysql, "exams");
		$stats['visible_exam_count'] = get_count($mysql, "exams WHERE visibility = 1");
		$stats['question_count'] = get_count($mysql, "questions");
		$stats['question_explanation_count'] = get_count($mysql, "questions WHERE explanation != ''");
		$stats['question_free_count'] = get_count($mysql, "questions WHERE type = 1");
		$stats['question_without_answer_count'] = get_count($mysql, "questions WHERE correct_answer < 1 AND type > 1");
		$stats['question_topic_count'] = get_count($mysql, "questions WHERE topic != '' AND topic != 'Sonstiges'");
		$stats['visible_question_count'] = get_count($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");
		$stats['question_worked_count'] = get_count_with_pre($mysql, "COUNT(DISTINCT question_id)", "results");
		$stats['question_worked_count_today'] = get_count_with_pre($mysql, "COUNT(DISTINCT question_id)", "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_count'] = get_count($mysql, "results");
		$stats['result_count_hour'] = get_count($mysql, "results WHERE date > ?", [time() - 60*60]);
		$stats['result_count_week'] = get_count($mysql, "results WHERE date > ?", [time() - 7*24*60*60]);
		$stats['result_count_today'] = get_count($mysql, "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_per_minute'] = (get_count($mysql, "results WHERE date > ?", [time() - 30*60])) / (30.); // Last Half Hour

		$stats['comment_count'] = get_count($mysql, "comments");
		$stats['tag_count'] = get_count($mysql, "tags");
		$stats['search_count'] = get_count($mysql, "search_queries");

		$user_count_semester = [];
		$exam_count_semester = [];
		$result_count_semester = [];
		for ($i = 1; $i < 7; $i++) {
			$user_count_semester[] = get_count($mysql, "users WHERE semester = ?", [$i]);
			$exam_count_semester[] = get_count($mysql, "exams WHERE semester = ?", [$i]);
			// $result_count_semester[] = get_count($mysql, "results r, users WHERE semester = ?", [$i]);
		}
		$user_count_semester[] = get_count($mysql, "users WHERE semester > 6");
		$exam_count_semester[] = get_count($mysql, "exams WHERE semester > 6");
		$result_count_semester[] = get_count($mysql, "results WHERE semester > 6");
		$stats['user_count_semester'] = $user_count_semester;
		$stats['exam_count_semester'] = $exam_count_semester;
		// $stats['result_count_semester'] = $result_count_semester;


		/* $result_dep_time = [];
		for ($i = 0; $i < 48; $i++) {
			$result_dep_time[] = get_count($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
		}
		$stats['result_dep_time'] = $result_dep_time; */


		$resolution = 1.5 * 60;
		$days = 2;
		$result_dep_time_today = [];
		for ($i = $days*round(24*60/$resolution); $i>=0; $i--) {
			$result_dep_time_today_label[] = ((time() % (24*60*60) - (time() % (60*60)))/(60*60) - ($resolution/60)*$i + $days*24 + 1) % 24;
			$result_dep_time_today[] = round( 60 * get_count($mysql, "results WHERE date > ? AND date < ?", [time() - ($i+1)*$resolution*60, time() - ($i)*$resolution*60]) / ($resolution) );
		}
		$stats['result_dep_time_today_label'] = $result_dep_time_today_label;
		$stats['result_dep_time_today'] = $result_dep_time_today;


		$response['stats'] = $stats;
		print_response($app, $response);
	});

	$app->get('/search-queries', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT s.*, u.username FROM search_queries s, users u WHERE s.user_id = u.user_id ORDER BY s.date DESC LIMIT 100", [], 'search_queries');
		print_response($app, $response);
	});

	$app->get('/results-dep-time', function() use ($app) {
		$mysql = start_mysql();

		$results_dep_time = [];
		for($i = 0; $i<48; $i++)
			$results_dep_time[] = get_count($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
		$response['results_dep_time'] = $results_dep_time;

		print_response($app, $response);
	});

	$app->post('/activities', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$activities = [];

		if (!$data->search_query) {
			$result = get_all($mysql, "SELECT 'search_query' activity, s.*, u.username FROM search_queries s, users u WHERE s.user_id = u.user_id ORDER BY s.date DESC LIMIT 100", [], 'search_query');
			$activities = array_merge($activities, $result['search_query']);
		}

		if (!$data->result) {
			$result = get_all($mysql, "SELECT 'result' activity, r.*, q.*, u.username FROM results r, users u, questions q WHERE r.user_id = u.user_id AND r.question_id = q.question_id ORDER BY r.date DESC LIMIT 100", [], 'result');
			$activities = array_merge($activities, $result['result']);
		}

		if (!$data->register) {
			$result = get_all($mysql, "SELECT 'register' activity, u.*, u.sign_up_date as date FROM users u ORDER BY u.sign_up_date DESC LIMIT 100", [], 'register');
			$activities = array_merge($activities, $result['register']);
		}

		if (!$data->login) {
			$result = get_all($mysql, "SELECT 'login' activity, u.*, u.last_sign_in as date FROM users u ORDER BY u.last_sign_in DESC LIMIT 100", [], 'login');
			$activities = array_merge($activities, $result['login']);
		}

		if (!$data->comment) {
			$result = get_all($mysql, "SELECT 'comment' activity, c.*, u.username FROM comments c, users u WHERE c.user_id = u.user_id ORDER BY c.date DESC LIMIT 100", [], 'comment');
			$activities = array_merge($activities, $result['comment']);
		}

		if (!$data->exam_new) {
			$result = get_all($mysql, "SELECT 'exam_new' activity, e.*, e.date as year, e.date_added as date, u.username FROM exams e, users u WHERE e.user_id_added = u.user_id ORDER BY e.date_added DESC LIMIT 100", [], 'exam_new');
			$activities = array_merge($activities, $result['exam_new']);
		}

		if (!$data->exam_update) {
			$result = get_all($mysql, "SELECT 'exam_update' activity, e.*, e.date as year, e.date_updated as date, u.username FROM exams e, users u WHERE e.user_id_added = u.user_id ORDER BY e.date_updated DESC LIMIT 100", [], 'exam_update');
			$activities = array_merge($activities, $result['exam_update']);
		}

		usort($activities, function($a, $b) {
		    return $b['date'] - $a['date'];
		});

		$response['activities'] = array_slice($activities, 0, 101);
		print_response($app, $response);
	});
});



$app->run();

?>