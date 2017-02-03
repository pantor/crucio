<?php

function init() {
    error_reporting(0);
    try {
        if ($_SERVER['SERVER_ADDR'] == '192.168.33.10') { // Vagrant Address
            $config = include(dirname(__FILE__).'/../config.vagrant.php');
        } else {
            $config = include(dirname(__FILE__).'/../config.php');
        }

        $mysql = new PDO(
            'mysql:host='.$config['host'].';dbname='.$config['dbname'].';charset=utf8',
            $config['user'],
            $config['password']
        );
        return $mysql;
    } catch(PDOException $ex) {
        die('connection error');
    }
}

function getAll($stmt, $params = null) {
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getFetch($stmt, $params = null) {
    $stmt->execute($params);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getCount($mysql, $sub_query, $parameters = []) {
    return getCustomCount($mysql, "SELECT COUNT(*) AS 'count' FROM $sub_query", $parameters);
}

function getCustomCount($mysql, $query, $parameters = []) {
    $stmt = $mysql->prepare($query);
    $stmt->execute($parameters);
    return $stmt->fetch(PDO::FETCH_ASSOC)['count'];
}

function createResponse($response, $data, $status = 200) {
    return $response->withJson($data, $status, JSON_NUMERIC_CHECK);
}


// ---------

function validateActivationToken($mysql, $token) {
	return (getCount($mysql, "users WHERE activationtoken = ?", [$token]) > 0);
}

function validateEMail($mysql, $email) {
	return (getCount($mysql, "whitelist WHERE mail_address = ?", [$email]) > 0);
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
    return $stmt->execute();
}


// --------

function getURL() {
    $protocol = strtolower(substr($_SERVER['SERVER_PROTOCOL'], 0, 5)) == 'https://' ? 'https://' : 'http://';
    return $protocol.$_SERVER['HTTP_HOST'].'/';
}

function sanitize($str) {
    return strtolower(strip_tags(trim($str)));
}

function generateHash($plainText, $salt = null) {
    if ($salt === null) {
        $salt = md5(uniqid(rand(), true));
    }
    $salt = substr($salt, 0, 25);
	return $salt.sha1($salt.$plainText);
}

function getUniqueCode($length = "") {
    $code = md5(uniqid(rand(), true));
    if ($length != '') {
        return substr($code, 0, $length);
    }
    return $code;
}

function generateActivationToken($mysql) {
    $gen;
    do {
        $gen = md5(uniqid(mt_rand(), false));
    } while (getCount($mysql, "users WHERE activationtoken = ?", [$gen]) > 0);

    return $gen;
}



// ------ Mail ------

function fillTemplate($hooks, $template) {
    $from = array_map(function($entry) { return '#'.$entry.'#'; }, array_keys($hooks));
    $to = array_values($hooks);
    return str_replace($from, $to, $template);
}

function sendTemplateMail($templateName, $destination, $subject, $additionalHooks, $senderName = 'Crucio', $senderMail = 'noreply@crucio-leipzig.de') {
    $basicHooks = [
        'WEBSITENAME' => 'Crucio',
        'WEBSITEURL' => $website_url,
        'DATE' => date('l \\t\h\e jS'),
    ];

    $template = file_get_contents('../mail-templates/'.$templateName.'.html');
    $message = fillTemplate(array_merge($basicHooks, $additionalHooks), $template);
    return sendMail($destination, $subject, $message, $senderName, $senderMail);
}

function sendMail($destination, $subject, $message, $senderName, $senderMail) {
    $mail = new PHPMailer;
    $mail->isSendmail();
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($senderMail, $senderName);
    // $mail->addReplyTo('replyto@example.com', 'First Last');
    foreach(explode(',', $destination) as $address)
    {
        $mail->addAddress(trim($address));
    }
    $mail->Subject = $subject;
    $mail->msgHTML($message);
    // $mail->AltBody = 'This is a plain-text message body';

    $data['status'] = $mail->send();
    return $data;
}



// ----- Outer ------

function activate($token) {
    $mysql = init();

    if ((getCount($mysql, "users WHERE activationtoken = ?", [$token]) != 1)) {
        $data['error'] = 'error_unknown';
        return $data;
    }

    $stmt = $mysql->prepare(
        "UPDATE users
        SET active = 1
        WHERE activationtoken = :token
        LIMIT 1"
    );
    $stmt->bindValue(':token', $token);

    $data['status'] = $stmt->execute();
    return $data;
}

?>
