<?php
  
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

?>