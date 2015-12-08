<?php

$app->group('/results', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = startMysql();

		$user_id = $request->getQueryParams()['user_id'];
		$user_id_sql_where = "";
		if ($user_id) {
    		$user_id_sql_where = "AND r.user_id = $user_id ";
		}

		$data = get_all($mysql,
		    "SELECT r.*
		    FROM results r
		    WHERE 1 = 1 "
		        .$user_id_sql_where
		    ,
        [], 'results');
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
		$body =  $request->getParsedBody();

		$mysql = startMysql();

		$attempt_count = get_count($mysql, "results r WHERE r.user_id = ? AND r.question_id = ?", [$body['user_id'], $body['question_id']]);

		$data = executeMysql($mysql, "INSERT INTO results (user_id, question_id, attempt, correct, given_result, date, resetted) VALUES (?, ?, ?, ?, ?, ?, '0')", [$body['user_id'], $body['question_id'], $attempt_count + 1, $body['correct'], $body['given_result'], time()]);
		return createResponse($response, $data);
	});

	$this->delete('/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$data = executeMysql($mysql, "UPDATE results SET resetted = '1' WHERE user_id = ?", [$user_id]);
		return createResponse($response, $data);
	});

	$this->delete('/{user_id}/{exam_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$data = executeMysql($mysql, "UPDATE results r, questions q SET r.resetted = '1' WHERE r.question_id = q.question_id AND q.exam_id = ? AND r.user_id = ?", [$exam_id, $user_id]);
		return createResponse($response, $data);
	});
});

?>