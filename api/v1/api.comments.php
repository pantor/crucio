<?php
  
$app->group('/comments', function () use ($app) {

  $app->get('', function () use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, 
		"SELECT q.question, c.*, u.username 
		FROM comments c, users u, questions q 
		WHERE c.user_id = u.user_id AND c.question_id = q.question_id 
		ORDER BY c.comment_id DESC", 
		[], 'comments');
		print_response($app, $response);
    });

    $app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response['comments'] = get_all($mysql, 
		"SELECT q.question, c.*, u.username 
		FROM comments c, users u, questions q 
		WHERE c.user_id = u.user_id AND u.user_id = ? AND q.question_id = c.question_id 
		ORDER BY c.comment_id ASC", 
		[$user_id], 'comments')['comments'];
		print_response($app, $response);
	});

  $app->get('/author/:user_id', function () use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		"SELECT c.*, u.username, q.question, q.exam_id, e.user_id_added, (
		  SELECT u2.username 
		  FROM users u2 
		  WHERE u2.user_id = e.user_id_added) AS 'username_added' 
		FROM comments c, users u, questions q, exams e 
		WHERE c.user_id = u.user_id AND c.question_id = q.question_id AND q.exam_id = e.exam_id 
		ORDER BY c.comment_id DESC", 
		[], function($stmt, $mysql) {
			$response['comments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			return $response;
		});
		print_response($app, $response);
    });

    $app->post('/:user_id', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		"INSERT INTO comments (user_id, date, comment, question_id, reply_to) 
		VALUES (?, ?, ?, ?, ?)", 
		[$user_id, time(), $data->comment, $data->question_id, $data->reply_to], function($stmt, $mysql) {
			$response['comment_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});

	$app->post('/:comment_id/user/:user_id', function($comment_id, $user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		"INSERT INTO user_comments_data (user_id, comment_id, user_voting, subscription) 
		VALUES (?, ?, ?, '0') 
		ON DUPLICATE KEY UPDATE user_voting = ?", 
		[$user_id, $comment_id, $data->user_voting, $data->user_voting]);
		print_response($app, $response);
	});

	$app->delete('/:comment_id', function($comment_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		"DELETE 
		FROM comments 
		WHERE comment_id = ?", 
		[$comment_id]);
		print_response($app, $response);
	});
});

?>