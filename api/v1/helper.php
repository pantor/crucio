<?php

function init() {
	try {
		$config = include(dirname(__FILE__).'/../config.php');

		$mysql = new PDO('mysql:host='.$config['host'].';dbname='.$config['dbname'], $config['user'], $config['password']);
		$mysql->exec("set names utf8");
		return $mysql;
	} catch(PDOException $ex) {
		die('connection error');
	}
}

function execute($stmt) {
	$stmt->execute();
	return [];
}

function getAll($stmt) {
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getFetch($stmt) {
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getCount($mysql, $sub_query, $parameters = []) {
	return getCountWithPre($mysql, "COUNT(*)", $sub_query, $parameters);
}

function getCountWithPre($mysql, $pre_query, $sub_query, $parameters = []) {
    $stmt = $mysql->prepare(
        "SELECT $pre_query AS 'result' FROM $sub_query"
    );
    $stmt->execute($parameters);
    return $stmt->fetch(PDO::FETCH_ASSOC)['result'];
}

function createResponse($response, $data, $status_in_data = true, $status = 200) {
    $response = $response->withStatus($status);
    $response = $response->withHeader('Content-type', 'application/json');
    $response = $response->withHeader('charset', 'iso-8859-1');

    $response->write( json_encode($data) );
    return $response;
}


// ---------


function validateActivationToken($mysql, $token, $is_not_active) {
	if ($is_not_active) {
		return ( getCount($mysql, "users WHERE activationtoken = ?", [$token]) > 0 );
	} else {
		return ( getCount($mysql, "users WHERE active = 0 AND activationtoken = ?", [$token]) > 0 );
	}
}

function fetchUserDetails($mysql, $token = null, $email = null) {
    $stmt = $mysql->prepare(
	    "SELECT *
	    FROM users
	    WHERE email = :email
	        OR activationtoken = :token"
	);
	$stmt->bindValue(':email', sanitize($email));
	$stmt->bindValue(':token', sanitize($token));

	return getFetch($stmt);
}

function fetchUserDetailsByMail($mysql, $email) {
	return fetchUserDetails($mysql, null, $email);
}

function fetchUserDetailsByToken($mysql, $token) {
	return fetchUserDetails($mysql, $token, null);
}

function flagLostpasswordRequest($mysql, $username, $value) {
    $stmt = $mysql->prepare(
	    "UPDATE users
	    SET LostpasswordRequest = :request
	    WHERE username_clean = :username
	    LIMIT 1"
	);
	$stmt->bindValue(':request', $value);
	$stmt->bindValue(':username', sanitize($username));

	return execute($stmt);
}


// --------


function sanitize($str) {
	return strtolower(strip_tags(trim($str)));
}

function generateHash($plainText, $salt = null) {
	if ($salt === null) {
		$salt = substr(md5(uniqid(rand(), true)), 0, 25);
	} else {
		$salt = substr($salt, 0, 25);
    }

	return $salt . sha1($salt . $plainText);
}

function getUniqueCode($length = "") {
	$code = md5(uniqid(rand(), true));
	if ($length != '') {
		return substr($code, 0, $length);
	} else {
		return $code;
    }
}

function generateActivationToken($mysql) {
	$gen;
	do {
		$gen = md5(uniqid(mt_rand(), false));
	} while (getCount($mysql, "users WHERE activationtoken = ?", [$gen]) > 0);

	return $gen;
}



// ------ Mail ------

function sendTemplateMail($template, $destination, $subject, $additionalHooks, $sender_name = 'Crucio', $sender_email = 'noreply@crucio-leipzig.de') {
	$emailDate = date('l \\t\h\e jS');
	$message = file_get_contents('../mail-templates/'.$template);
	$message = str_replace(array("#WEBSITENAME#", "#WEBSITEURL#", "#DATE#"), array('Crucio', $website_url, $emailDate), $message);
	$message = str_replace($additionalHooks['searchStrs'], $additionalHooks['subjectStrs'], $message);

	return sendMail($destination, $subject, $message, $sender_name, $sender_email);
}

function sendMail($destination, $subject, $message, $sender_name, $sender_email) {
	$header = "MIME-Version: 1.0\r\n";
	$header .= "Content-Type: text/html\r\n";
	$header .= 'FROM: '.$sender_name.' <'.$sender_email.'>';

	mail($destination, $subject, $message, $header);

	$response['status'] = 'success';
	$response['sender'] = $sender_name;
	return $response;
}

?>