<?php

function init() {
  error_reporting(0);
  try {
    $mysql = new PDO(
      'mysql:host='.getenv('host').';dbname='.getenv('dbname').';charset=utf8', getenv('user'), getenv('password')
    );
    return $mysql;
  } catch(PDOException $ex) {
    die('connection error');
  }
}

function init_collections() {
  error_reporting(0);
  try {
    $mysql = new PDO(
      'mysql:host='.getenv('host2').';dbname='.getenv('dbname2').';charset=utf8', getenv('user2'), getenv('password2')
    );
    return $mysql;
  } catch(PDOException $ex) {
    die('connection error');
  }
}

function getAll($stmt) {
  if ($stmt->execute()) {
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  return false;
}

function getFetch($stmt, $params = null) {
  if ($stmt->execute($params)) {
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  return false;
}

function getCount($mysql, $sub_query, $parameters = []) {
  $stmt = $mysql->prepare("SELECT COUNT(*) AS 'count' FROM $sub_query");
  if ($stmt->execute($parameters)) {
    return $stmt->fetch(PDO::FETCH_ASSOC)['count'];
  }
  return false;
}


function validateActivationToken($mysql, $token) {
  return (getCount($mysql, "users WHERE activationtoken = ?", [$token]) > 0);
}

function validateEMail($mysql, $email) {
  return (getCount($mysql, "whitelist WHERE mail_address = ?", [$email]) > 0);
}

function fetchUserDetailsByMail($mysql, $email) {
  $stmt = $mysql->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
  $stmt->bindValue(':email', sanitize($email));

  return getFetch($stmt);
}

function fetchUserDetailsByToken($mysql, $token) {
  $stmt = $mysql->prepare("SELECT * FROM users WHERE activationtoken = :token LIMIT 1");
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
  return 'https://'.$_SERVER['HTTP_HOST'].'/';
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

function encodeURIComponent($str) {
  $revert = array('%21'=>'!', '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')');
  return strtr(rawurlencode($str), $revert);
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
    'WEBSITEURL' => 'https://crucio-leipzig.de',
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

  $mail->isSendmail();

  $mail->CharSet = 'UTF-8';
  $mail->setFrom($senderMail, $senderName);
  // $mail->addReplyTo('replyto@example.com', 'First Last');
  foreach(explode(',', $destination) as $address)
  {
    $mail->addAddress(trim($address));
  }

  $mail->msgHTML($message);

  $mail->Subject = $subject;
  $mail->AltBody = $message;

  $data['status'] = $mail->send();
  return $data;
}

?>