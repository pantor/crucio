<?php

function start_mysql() {
	try {
		$config = include(dirname(__FILE__).'/../config.php'); // Global path for PDF
		
		$mysql = new PDO('mysql:host='.$config['host'].';dbname='.$config['dbname'], $config['user'], $config['password']);
		$mysql->exec("set names utf8");
		return $mysql;
	} catch(PDOException $ex) {
		die('connection error');
	}
}

function execute_mysql($mysql, $query, $parameters, $callback = null) {
	$stmt = $mysql->prepare($query);
	try {
		$stmt->execute($parameters);
		$response['status'] = 'success';
		if ($callback)
			$response += $callback($stmt, $mysql);
	} catch(PDOException $e){
		$response['status'] = 'error';
		$response['error'] = 'statement error';
	}
	return $response;
}

function print_response($app, $data, $status = true) {
	if ($status) {
		$data['status'] = 'success';
	}

	$response = $app->response();
	$response['Content-Type'] = 'application/json';
	$response['access-control-allow-origin'] = '*';
	$response['charset'] = 'iso-8859-1';
	$response['X-Powered-By'] = 'Crucio';
	$response->status(200);
	$response->body(json_encode($data));
}

function get_all($mysql, $query, $parameters, $name = 'result') {
	return execute_mysql($mysql, $query, $parameters, function($stmt, $mysql) use ($name) {
		$response[$name] = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $response;
	});
}

function get_fetch($mysql, $query, $parameters, $name = 'result') {
	return execute_mysql($mysql, $query, $parameters, function($stmt, $mysql) use ($name) {
		$response[$name] = $stmt->fetch(PDO::FETCH_ASSOC);
		return $response;
	});
}

function get_count($mysql, $sub_query, $parameters = []) {
	return get_count_with_pre($mysql, "COUNT(*)", $sub_query, $parameters);
}

function get_count_with_pre($mysql, $pre_query, $sub_query, $parameters = []) {
	$stmt = $mysql->prepare("SELECT ".$pre_query." AS 'c' FROM ".$sub_query);
	try {
		$stmt->execute($parameters);
		$result = $stmt->fetch(PDO::FETCH_ASSOC)['c'];
	} catch(PDOException $e){
		$result = 'error';
	}
	return $result;
}

function validate_activation_token($mysql, $token, $is_not_active) {
	if ($is_not_active) {
		return ( get_count($mysql, "users WHERE activationtoken = ?", [$token]) > 0 );
	} else {
		return ( get_count($mysql, "users WHERE active = 0 AND activationtoken = ?", [$token]) > 0 );
	}
}

function fetch_user_details($mysql, $username = null, $token = null) {
	if ($username != null)
		$response = get_fetch($mysql, "SELECT * FROM users WHERE username_clean = ? LIMIT 1", [sanitize($username)]);
	else
		$response = get_fetch($mysql, "SELECT * FROM users WHERE activationtoken = ? LIMIT 1", [sanitize($token)]);

	return $response['result'];
}

function fetch_user_details_by_mail($mysql, $email) {
	$response = get_fetch($mysql, "SELECT * FROM users WHERE email = ? LIMIT 1", [sanitize($email)]);
	return $response['result'];
}

function fetch_user_details_by_token($mysql, $token) {
	$response = get_fetch($mysql, "SELECT * FROM users WHERE activationtoken = ? LIMIT 1", [sanitize($token)]);
	return $response['result'];
}

function flag_lostpassword_request($mysql, $username, $value) {
	return execute_mysql($mysql, "UPDATE users SET LostpasswordRequest = ? WHERE username_clean = ? LIMIT 1", [$value, sanitize($username)]);
}



// -- -- -- --

function sanitize($str) {
	return strtolower(strip_tags(trim($str)));
}

function generate_hash($plainText, $salt = null) {
	if ($salt === null)
		$salt = substr(md5(uniqid(rand(), true)), 0, 25);
	else
		$salt = substr($salt, 0, 25);

	return $salt . sha1($salt . $plainText);
}

function get_unique_code($length = "") {
	$code = md5(uniqid(rand(), true));
	if ($length != '')
		return substr($code, 0, $length);
	else
		return $code;
}

// Generate an activation key
function generate_activation_token($mysql) {
	$gen;
	do {
		$gen = md5(uniqid(mt_rand(), false));
	} while (get_count($mysql, "users WHERE activationtoken = ?", [$gen]) > 0);

	return $gen;
}



// ------ Mail ------

function send_mail($destination, $subject, $message, $sender_name = 'Crucio', $sender_email = 'noreply@crucio-leipzig.de') {
	$header = "MIME-Version: 1.0\r\n";
	$header .= "Content-Type: text/html\r\n";
	$header .= 'FROM: '.$sender_name.' <'.$sender_email.'>';

	mail($destination, $subject, $message, $header);

	$response['status'] = 'success';
	$response['sender'] = $sender_name;
	return $response;
}

function send_template_mail($template, $destination, $subject, $additionalHooks, $sender_name = 'Crucio', $sender_email = 'noreply@crucio-leipzig.de') {
	$emailDate = date('l \\t\h\e jS');
	$message = file_get_contents('../../public/mail-templates/'.$template);
	$message = str_replace(array("#WEBSITENAME#", "#WEBSITEURL#", "#DATE#"), array('Crucio', $website_url, $emailDate), $message);
	$message = str_replace($additionalHooks["searchStrs"], $additionalHooks["subjectStrs"], $message);

	return send_mail($destination, $subject, $message, $sender_name, $sender_email);
}

?>