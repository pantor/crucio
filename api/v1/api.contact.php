<?php

$app->group('/contact', function () {

	$this->post('/send-mail', function($request, $response, $args) {
		$body = $request->getParsedBody();

		$name = trim($body['name']);
		$email = str_replace('(@)', '@', trim($body['email']));
		$text = trim($body['text']);

		$sender_name = $name.' - Kontakt Crucio';
		$destination = 'kontakt@crucio-leipzig.de, allgemeinerkontakt@crucio-leipzig.de';

		$hooks = ['searchStrs' => ['#MESSAGE#', '#MAIL#', '#USERNAME#'],
			'subjectStrs' => [$text, $email, $name]];
		$data = sendTemplateMail('contact.html', $destination, 'Allgemeine Anfrage', $hooks, $sender_name);

		return createResponse($response, $data);
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

		$hooks = ['searchStrs' => ['#MESSAGE#', '#MAIL#', '#USERNAME#', '#AUTHOR#', '#QUESTION#', '#QUESTION_ID#', '#SUBJECT#', '#DATE2#', '#EXAM_ID#', '#MAIL_SUBJECT#'],
			'subjectStrs' => [$text, $email, $name, $body['author'], $body['question'], $body['question_id'], $body['subject'], $body['date'], $body['exam_id'], $mail_subject_html]];
		$data = sendTemplateMail('contact-question.html', $destination, $subject, $hooks, $sender_name);

		return createResponse($response, $data);
	});
});

?>