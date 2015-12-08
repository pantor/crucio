<?php

$app->group('/tags', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = startMysql();

		$user_id = $request->getQueryParams()['user_id'];
		$user_id_sql_where = "";
		if ($user_id) {
    		$user_id_sql_where = "AND t.user_id = $user_id ";
		}

		$question_id = $request->getQueryParams()['question_id'];
		$question_id_sql_where = "";
		if ($question_id) {
    		$question_id_sql_where = "AND t.question_id = $question_id ";
		}

		$data = get_all($mysql,
		    "SELECT DISTINCT t.*, q.question, q.exam_id, e.subject, u.username
            FROM tags t
            INNER JOIN questions q ON q.question_id = t.question_id
            INNER JOIN exams e ON e.exam_id = q.exam_id
            INNER JOIN users u ON u.user_id = t.user_id
            WHERE t.tags != '' "
                .$user_id_sql_where
                .$question_id_sql_where
            ."ORDER BY t.question_id ASC",
		[], 'tags');
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
		$mysql = startMysql();

		$body = $request->getParsedBody();

		if ($body['tags'] == '') {
			$data = executeMysql($mysql, "DELETE FROM tags WHERE question_id = ? AND user_id = ?", [$body['question_id'], $body['user_id']]);
		} else {
			$data = executeMysql($mysql, "INSERT INTO tags (question_id, user_id, tags) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tags = ?", [$body['question_id'], $body['user_id'], $body['tags'], $body['tags']]);
        }

		return createResponse($response, $data);
	});
});

?>