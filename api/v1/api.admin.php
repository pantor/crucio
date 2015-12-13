<?php

$app->group('/admin', function() {

	$this->post('/change-semester/{phrase}', function($request, $response, $args) {
    	$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
    		"UPDATE users SET semester = semester + :add"
        );
        $stmt->bindValue(':add', $body['number'], PDO::PARAM_INT);
        $data = execute($stmt);

		return createResponse($response, $data);
	});
});

?>