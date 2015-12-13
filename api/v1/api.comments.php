<?php

$app->group('/comments', function() {

    $this->get('', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$stmt = $mysql->prepare(
		    "SELECT q.question, c.*, u.username
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            INNER JOIN questions q ON q.question_id = c.question_id
            WHERE u.user_id = IFNULL(:user_id, u.user_id)
            ORDER BY c.comment_id DESC"
		);
		$stmt->bindValue(':user_id', $query_params['user_id'], PDO::PARAM_INT);

		$data['comments'] = getAll($stmt);
		return createResponse($response, $data);
    });

    $this->get('/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "SELECT q.question, c.*, u.username
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            INNER JOIN questions q ON q.question_id = c.question_id
            WHERE u.user_id = :user_id
            ORDER BY c.comment_id ASC"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

        $data['comments'] = getAll($stmt);
		return createResponse($response, $data);
	});

    $this->get('/author/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "SELECT c.*, u.username, q.question, q.exam_id, e.user_id_added, (
                SELECT u2.username
                FROM users u2
                WHERE u2.user_id = e.user_id_added) AS 'username_added'
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            INNER JOIN questions q ON q.question_id = c.question_id
            INNER JOIN exams e ON e.exam_id = q.exam_id
            ORDER BY c.comment_id DESC"
		);

		$data['comments'] = getAll($stmt);
		return createResponse($response, $data);
    });

    $this->post('/{user_id}', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "INSERT INTO comments (user_id, date, comment, question_id, reply_to)
		    VALUES (?, ?, ?, ?, ?)"
		);
		$stmt->bindValue(1, $args['user_id']);
		$stmt->bindValue(2, time());
		$stmt->bindValue(3, $body['comment']);
		$stmt->bindValue(4, $body['question_id']);
		$stmt->bindValue(5, $body['reply_to']);

		$data = execute($stmt);
		$data['comment_id'] = $mysql->lastInsertId();
		return createResponse($response, $data);
	});

	$this->post('/{comment_id}/user/{user_id}', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "INSERT INTO user_comments_data (user_id, comment_id, user_voting, subscription)
		    VALUES (?, ?, ?, '0')
		    ON DUPLICATE KEY UPDATE user_voting = ?"
		);
		$stmt->bindValue(1, $args['user_id']);
		$stmt->bindValue(2, $args['comment_id']);
		$stmt->bindValue(3, $body['user_voting']);
		$stmt->bindValue(4, $body['user_voting']);

		$data = execute($stmt);
		return createResponse($response, $data);
	});

	$this->delete('/{comment_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE
		    FROM comments
		    WHERE comment_id = :comment_id"
		);
		$stmt->bindValue(':comment_id', $args['comment_id'], PDO::PARAM_INT);

		$data = execute($stmt);
		return createResponse($response, $data);
	});
});

?>