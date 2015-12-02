<?php

$app->group('/admin', function () use ($app) {

	$app->post('/change-semester/:phrase', function($phrase) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		"UPDATE users 
		SET semester = semester + ?", 
		[$data->number]);
		print_response($app, $response);
	});
});

?>