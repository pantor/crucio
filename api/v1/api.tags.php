<?php

$app->group('/tags', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$limit = $query_params['limit'] ? intval($query_params['limit']) : 10000;
		$query = strlen($query_params['query']) > 0 ? "%".$query_params['query']."%" : null;

		$stmt = $mysql->prepare(
		    "SELECT DISTINCT t.*, q.question, q.exam_id, s.name AS 'subject', u.username
            FROM tags t
            INNER JOIN questions q ON q.question_id = t.question_id
            INNER JOIN exams e ON e.exam_id = q.exam_id
            INNER JOIN users u ON u.user_id = t.user_id
			INNER JOIN subjects s ON s.subject_id = e.subject_id
            WHERE t.tags != ''
                AND t.user_id = IFNULL(:user_id, t.user_id)
                AND t.question_id = IFNULL(:question_id, t.question_id)
                AND t.tags = IFNULL(:query, t.tags)
            ORDER BY t.question_id ASC
            LIMIT :limit"
		);
		$stmt->bindValue(':user_id', $query_params['user_id'], PDO::PARAM_INT);
		$stmt->bindValue(':question_id', $query_params['question_id'], PDO::PARAM_INT);
		$stmt->bindValue(':query', $query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

		$data['tags'] = getAll($stmt);
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		if ($body['tags'] == '') {
    		$stmt = $mysql->prepare(
    		    "DELETE
    		    FROM tags
    		    WHERE question_id = :question_id
    		        AND user_id = :user_id"
    		);
    		$stmt->bindValue(':question_id', $body['question_id'], PDO::PARAM_INT);
    		$stmt->bindValue(':user_id', $body['user_id'], PDO::PARAM_INT);
		} else {
    		$stmt = $mysql->prepare(
    		    "INSERT
    		    INTO tags (question_id, user_id, tags)
    		    VALUES (:question_id, :user_id, :tags)
    		    ON DUPLICATE KEY UPDATE tags = :tags"
    		);
    		$stmt->bindValue(':question_id', $body['question_id'], PDO::PARAM_INT);
    		$stmt->bindValue(':user_id', $body['user_id'], PDO::PARAM_INT);
    		$stmt->bindValue(':tags', $body['tags']);
        }

        $data['status'] = execute($stmt);
		return createResponse($response, $data);
	});

    $this->delete('/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE
		    FROM tags
		    WHERE user_id = :user_id"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data['status'] = execute($stmt);
		return createResponse($response, $data);
	});
});

?>
