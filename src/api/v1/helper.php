<?php

function isTestServer() {
  return ($_SERVER['SERVER_ADDR'] == '192.168.33.10'); // Vagrant Address
}

function init() {
  error_reporting(0);
  try {
    if (isTestServer()) {
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

function getAll($stmt) {
  $stmt->execute();
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getFetch($stmt, $params = null) {
  $stmt->execute($params);
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getCount($mysql, $sub_query, $parameters = []) {
  $stmt = $mysql->prepare("SELECT COUNT(*) AS 'count' FROM $sub_query");
  $stmt->execute($parameters);
  return $stmt->fetch(PDO::FETCH_ASSOC)['count'];
}


function validateActivationToken($mysql, $token) {
  return (getCount($mysql, "users WHERE activationtoken = ?", [$token]) > 0);
}

function validateEMail($mysql, $email) {
  return (getCount($mysql, "whitelist WHERE mail_address = ?", [$email]) > 0);
}

function fetchUserDetailsByMail($mysql, $email) {
  $stmt = $mysql->prepare("SELECT * FROM users WHERE email = :email");
  $stmt->bindValue(':email', sanitize($email));

  return getFetch($stmt);
}

function fetchUserDetailsByToken($mysql, $token) {
  $stmt = $mysql->prepare("SELECT * FROM users WHERE activationtoken = :token");
  $stmt->bindValue(':token', sanitize($token));

  return getFetch($stmt);
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

  $mail->isSMTP();
  $mail->Host = "127.0.0.1";
  $mail->SMTPAuth = false;
  $mail->Port = 1025;

  if (isTestServer()) {
    $mail->isSMTP();
    $mail->Host = "127.0.0.1";
    $mail->SMTPAuth = false;
    $mail->Port = 1025;
  } else {
    $mail->isSendmail();
  }

  $mail->CharSet = 'UTF-8';
  $mail->setFrom($senderMail, $senderName);
  // $mail->addReplyTo('replyto@example.com', 'First Last');
  foreach(explode(',', $destination) as $address)
  {
    $mail->addAddress(trim($address));
  }

  if (isTestServer()) {
    $mail->msgHTML("Test Mail");
  } else {
    $mail->msgHTML($message);
  }

  $mail->Subject = $subject;
  $mail->AltBody = $message;

  $data['status'] = $mail->send();
  return $data;
}

?>
