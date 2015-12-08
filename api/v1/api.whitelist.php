<?php

$app->group('/whitelist', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = startMysql();
		$data = get_all($mysql,
		    "SELECT w.*, IF(u.user_id IS NOT NULL, 1, 0) as 'used'
            FROM whitelist w
            LEFT JOIN users u ON u.email = w.mail_address",
		[], 'whitelist');

		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
    	$mysql = startMysql();

		$body = $request->getParsedBody();
		$data = executeMysql($mysql, "INSERT INTO whitelist ( mail_address ) VALUES (?)", [str_replace('(@)', '@', sanitize($body['mail_address']))]);

		return createResponse($response, $data);
	});

	$this->delete('/{mail_address}', function($request, $response, $args) {
		$mysql = startMysql();

		$data = executeMysql($mysql, "DELETE FROM whitelist WHERE mail_address = ?", [$args['mail_address']]);

		return createResponse($response, $data);
	});
});

?>