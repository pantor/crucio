<?php

$app->group('/contact', function () {

  $this->post('/send-mail', function($request, $response, $args) {
    $body = $request->getParsedBody();

    $name = trim($body['name']);
    $email = str_replace('(@)', '@', trim($body['email']));
    $text = trim($body['text']);

    $sender_name = $name.' - Kontakt Crucio';
    $destination = 'kontakt@crucio-leipzig.de, allgemeinerkontakt@crucio-leipzig.de';

    $hooks = [
      'MESSAGE' => $text,
      'MAIL' => $email,
      'USERNAME' => $name,
    ];

    $data['status'] = sendTemplateMail('contact', $destination, 'Allgemeine Anfrage', $hooks, $sender_name);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->post('/send-mail-question', function($request, $response, $args) {
    $body = $request->getParsedBody();

    $name = trim($body['name']);
    $email = str_replace('(@)', '@', trim($body['email']));
    $text = trim($body['text']);

    if ($body['mail_subject']) {
      $subject = $body['mail_subject'].' zur Frage #'.$body['question_id'];
      $mail_subject_html = '<dt>Anliegen</dt><dd>'.$body['mail_subject'].'</dd>';
    } else {
      $subject = 'Zur Frage #'.$body['question_id'];
      $mail_subject_html = '';
    }

    $sender_name = $name.' - Kontakt Crucio';
    $destination = 'kontakt@crucio-leipzig.de, '.$body['author_email'];

    $hooks = [
      'MESSAGE' => $text,
      'MAIL' => $email,
      'USERNAME' => $name,
      'AUTHOR' => $body['author'],
      'QUESTION' => $body['question'],
      'QUESTION_ID' => $body['question_id'],
      'SUBJECT' => $body['subject'],
      'DATE2' => $body['date'],
      'EXAM_ID' => $body['exam_id'],
      'MAIL_SUBJECT' => $mail_subject_html,
    ];

    $data['status'] = sendTemplateMail('contact-question', $destination, $subject, $hooks, $sender_name);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
