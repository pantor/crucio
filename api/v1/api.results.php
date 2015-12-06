<?php

$app->group('/results', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();

		$user_id = $app->request()->params('user_id');
		$user_id_sql_where = "";
		if ($user_id) {
    		$user_id_sql_where = "AND r.user_id = $user_id ";
		}

		$response = get_all($mysql,
		    "SELECT r.*
		    FROM results r
		    WHERE 1 = 1 "
		        .$user_id_sql_where
		    ,
        [], 'results');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();

		$attempt_count = get_count($mysql, "results r WHERE r.user_id = ? AND r.question_id = ?", [$data->user_id, $data->question_id]);

		$response = execute_mysql($mysql, "INSERT INTO results (user_id, question_id, attempt, correct, given_result, date, resetted) VALUES (?, ?, ?, ?, ?, ?, '0')", [$data->user_id, $data->question_id, $attempt_count + 1, $data->correct, $data->given_result, time()]);
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