<?php

$app->group('/whitelist', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "SELECT w.*, IF(u.user_id IS NOT NULL, 1, 0) as 'used'
            FROM whitelist w
            LEFT JOIN users u ON u.email = w.mail_address"
		);

        $data['whitelist'] = getAll($stmt);
		return createResponse($response, $data);
	});

	$this->post('', function($request, $response, $args) {
    	$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "INSERT INTO whitelist ( mail_address ) VALUES (:mail_address)"
		);
		$stmt->bindValue(':mail_address', str_replace('(@)', '@', sanitize($body['mail_address'])));

		$data = execute($stmt);
		return createResponse($response, $data);
	});

	$this->delete('/{mail_address}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE FROM whitelist WHERE mail_address = :mail_address"
		);
		$stmt->bindValue(':mail_address', $args['mail_address']);

        $data = execute($stmt);
		return createResponse($response, $data);
	});
});

?>