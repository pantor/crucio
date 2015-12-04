<?php
  
$app->group('/whitelist', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, 
		    "SELECT w.*, IF(u.user_id IS NOT NULL, 1, 0) as 'used' 
            FROM whitelist w 
            LEFT JOIN users u ON u.email = w.mail_address", 
		[], 'whitelist');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO whitelist ( mail_address ) VALUES (?)", [str_replace('(@)', '@', sanitize($data->mail_address))], null);
		print_response($app, $response);
	});

	$app->delete('/:mail_address', function($mail_address) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM whitelist WHERE mail_address = ?", [$mail_address], null);
		print_response($app, $response);
	});
});
  
?>