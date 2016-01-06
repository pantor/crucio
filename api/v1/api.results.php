<?php

$app->group('/results', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$stmt = $mysql->prepare(
		    "SELECT r.*
		    FROM results r
		    WHERE r.user_id = IFNULL(:user_id, r.user_id)
		        AND r.question_id = IFNULL(:question_id, r.question_id)"
		);
		$stmt->bindValue(':user_id', $query_params['user_id'], PDO::PARAM_INT);
		$stmt->bindValue(':question_id', $query_params['question_id'], PDO::PARAM_INT);

		$data['results'] = getAll($stmt);
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$attempt_count = getCount($mysql, "results r WHERE r.user_id = ? AND r.question_id = ?", [$body['user_id'], $body['question_id']]);

        $stmt = $mysql->prepare(
		    "INSERT
		    INTO results (user_id, question_id, attempt, correct, given_result, date, resetted)
		    VALUES (?, ?, ?, ?, ?, ?, '0')"
		);
		$stmt->bindValue(1, $body['user_id'], PDO::PARAM_INT);
		$stmt->bindValue(2, $body['question_id'], PDO::PARAM_INT);
		$stmt->bindValue(3, $attempt_count + 1);
		$stmt->bindValue(4, $body['correct']);
		$stmt->bindValue(5, $body['given_result']);
		$stmt->bindValue(6, time());

		$data['status'] = execute($stmt);
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

		$data['status'] = execute($stmt);
		return createResponse($response, $data);
	});

	$this->delete('/{user_id}/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "UPDATE results r
		    INNER JOIN questions q ON q.question_id = r.question_id
		    SET r.resetted = '1'
		    WHERE q.exam_id = :exam_id
		        AND r.user_id = :user_id"
		);
		$stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data['status'] = execute($stmt);
		return createResponse($response, $data);
	});
});

?>