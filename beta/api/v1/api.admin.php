<?php

$app->group('/admin', function() {

	$this->post('/change-semester/{phrase}', function($request, $response, $args) {
    	$mysql = startMysql();

		$body =  $request->getParsedBody();

		$data = executeMysql($mysql, "UPDATE users SET semester = semester + ?", [$body['number']]);
		return createResponse($response, $data);
	});
});

?>