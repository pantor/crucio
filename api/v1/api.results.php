<?php

$app->group('/results', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$stmt = $mysql->prepare(
		    "SELECT r.*
		    FROM results r
		    WHERE r.user_id = :user_id"
		);
		$stmt->bindValue(':user_id', $query_params['user_id'], PDO::PARAM_INT);

		$data['results'] = getAll($stmt);
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$attempt_count = getCount($mysql, "results r WHERE r.user_id = ? AND r.question_id = ?", [$body['user_id'], $body['question_id']]);

        $stmt = $mysql->prepare(
		    "INSERT INTO results (user_id, question_id, attempt, correct, given_result, date, resetted)
		    VALUES (?, ?, ?, ?, ?, ?, '0')"
		);
		$stmt->bindValue(1, $body['user_id'], PDO::PARAM_INT);
		$stmt->bindValue(1, $body['question_id'], PDO::PARAM_INT);
		$stmt->bindValue(1, $attempt_count + 1);
		$stmt->bindValue(1, $body['correct']);
		$stmt->bindValue(1, $body['given_result']);
		$stmt->bindValue(1, time());

		$data = execute($stmt);
		return createResponse($response, $data);
	});

	$this->delete('/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "UPDATE results
		    SET resetted = '1'
		    WHERE user_id = :user_id"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data = execute($stmt);
		return createResponse($response, $data);
	});

	$this->delete('/{user_id}/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "UPDATE results r, questions q
		    SET r.resetted = '1'
		    WHERE r.question_id = q.question_id
		        AND q.exam_id = :exam_id AND r.user_id = :user_id"
		);
		$stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data = execute($stmt);
		return createResponse($response, $data);
	});
});

?>