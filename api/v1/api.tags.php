<?php
  
$app->group('/tags', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, 
		"SELECT DISTINCT t.*, q.question, q.exam_id, e.subject, u.username 
		FROM tags t, questions q, exams e, users u 
		WHERE t.question_id = q.question_id AND q.exam_id = e.exam_id AND t.user_id = u.user_id AND t.tags != '' 
		ORDER BY t.question_id ASC", 
		[], 'tags');
		print_response($app, $response);
	});

	$app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, 
		"SELECT DISTINCT t.tags, t.question_id, q.question, q.exam_id, e.subject 
		FROM tags t, questions q, exams e 
		WHERE t.question_id = q.question_id AND q.exam_id = e.exam_id AND t.user_id = ? AND t.tags != '' 
		ORDER BY t.question_id ASC", 
		[$user_id], 'tags');
		print_response($app, $response);
	});

	$app->get('question_id/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, 
		"SELECT DISTINCT t.tags, t.question_id, q.question, q.exam_id, e.subject 
		FROM tags t, questions q, exams e 
		WHERE t.question_id = q.question_id AND q.exam_id = e.exam_id AND t.question_id = ? AND t.tags != '' 
		ORDER BY t.question_id ASC", 
		[$question_id], 'tags');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		if ($data->tags == '')
			$response = execute_mysql($mysql, "DELETE FROM tags WHERE question_id = ? AND user_id = ?", [$data->question_id, $data->user_id]);
		else
			$response = execute_mysql($mysql, "INSERT INTO tags (question_id, user_id, tags) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tags = ?", [$data->question_id, $data->user_id, $data->tags, $data->tags]);
		print_response($app, $response);
	});
});

?>