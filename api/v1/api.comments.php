<?php

$app->group('/comments', function() {

    $this->get('', function($request, $response, $args) {
		$mysql = startMysql();

		$user_id = $request->getQueryParams()['user_id'];
		$user_id_sql_where = "";
		if ($user_id) {
    		$user_id_sql_where = "AND u.user_id = $user_id ";
		}

		$data = get_all($mysql,
		    "SELECT q.question, c.*, u.username
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            INNER JOIN questions q ON q.question_id = c.question_id
            WHERE 1 = 1 "
                .$user_id_sql_where
            ."ORDER BY c.comment_id DESC",
		[], 'comments');
		return createResponse($response, $data);
    });

    $this->get('/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$data = get_all($mysql,
		    "SELECT q.question, c.*, u.username
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            INNER JOIN questions q ON q.question_id = c.question_id
            WHERE u.user_id = ?
            ORDER BY c.comment_id ASC",
		[$args['user_id']], 'comments');
		return createResponse($response, $data);
	});

    $this->get('/author/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$data = get_all($mysql,
		    "SELECT c.*, u.username, q.question, q.exam_id, e.user_id_added, (
                SELECT u2.username
                FROM users u2
                WHERE u2.user_id = e.user_id_added) AS 'username_added'
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            INNER JOIN questions q ON q.question_id = c.question_id
            INNER JOIN exams e ON e.exam_id = q.exam_id
            ORDER BY c.comment_id DESC",
		[], 'comments');
		return createResponse($response, $data);
    });

    $this->post('/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();

		$body =  $request->getParsedBody();

		$data = executeMysql($mysql,
		    "INSERT INTO comments (user_id, date, comment, question_id, reply_to)
		    VALUES (?, ?, ?, ?, ?)",
		[$args['user_id'], time(), $body['comment'], $body['question_id'], $body['reply_to']], function($stmt, $mysql) {
			$data['comment_id'] = $mysql->lastInsertId();
			return $data;
		});
		return createResponse($response, $data);
	});

	$this->post('/{comment_id}/user/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();

		$body =  $request->getParsedBody();

		$data = executeMysql($mysql,
		    "INSERT INTO user_comments_data (user_id, comment_id, user_voting, subscription)
		    VALUES (?, ?, ?, '0')
		    ON DUPLICATE KEY UPDATE user_voting = ?",
		[$args['user_id'], $args['comment_id'], $body['user_voting'], $body['user_voting']]);
		return createResponse($response, $data);
	});

	$this->delete('/{comment_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$data = executeMysql($mysql, "DELETE FROM comments  WHERE comment_id = ?", [$args['comment_id']]);
		return createResponse($response, $data);
	});
});

?>