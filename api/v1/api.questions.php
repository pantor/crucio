<?php

$app->group('/questions', function () use ($app) {

	$app->get('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$question = execute_mysql($mysql, 
		    "SELECT q.*, e.*, u.email, u.username 
            FROM questions q, exams e, users u 
            WHERE q.question_id = ? AND q.exam_id = e.exam_id AND e.user_id_added = u.user_id", 
		[$question_id], function($stmt, $mysql) {
			$response['question'] = $stmt->fetch(PDO::FETCH_ASSOC);
			$response['question']['answers'] = unserialize($response['question']['answers']);
			return $response;
		});

		$comments = get_all($mysql, 
		    "SELECT * 
            FROM comments 
            WHERE question_id = ? 
            ORDER BY comment_id ASC", 
		[$question_id], 'comments');

		$response['question'] = $question['question'];
		$response['comments'] = $comments['comments'];
		print_response($app, $response);
	});

	$app->get('/:question_id/user/:user_id', function($question_id, $user_id) use ($app) {
		$mysql = start_mysql();
		$question = execute_mysql($mysql, 
		    "SELECT q.*, e.* 
            FROM questions q, exams e 
		    WHERE q.question_id = ? AND q.exam_id = e.exam_id", 
		[$question_id], function($stmt, $mysql) {
			$response['question'] = $stmt->fetch(PDO::FETCH_ASSOC);
			$response['question']['answers'] = unserialize($response['question']['answers']);
			return $response;
		});

		$tags = get_fetch($mysql, 
		    "SELECT tags 
            FROM tags 
            WHERE user_id = ? AND question_id = ?", 
		[$user_id, $question_id], 'tags');
		if(!$tags)
			$tags['tags'] = '';

		$comments = get_all($mysql, 
		    "SELECT c.*, IF(uc.user_voting IS NULL, 0, uc.user_voting) AS 'user_voting', u.username, (
                SELECT SUM(uc.user_voting) 
                FROM user_comments_data uc 
                WHERE uc.comment_id = c.comment_id AND uc.user_id != ?) AS 'voting' 
            FROM users u, comments c 
            LEFT JOIN user_comments_data uc ON c.comment_id = uc.comment_id 
            WHERE c.question_id = ? AND c.user_id = u.user_id AND (uc.user_id IS NULL OR uc.user_id = ?) 
            ORDER BY c.comment_id ASC", 
        [$user_id, $question_id, $user_id], 'comments');

		$response = $question['question'];
		$response['tags'] = $tags['tags']['tags'];
		$response['comments'] = $comments['comments'];
		print_response($app, $response);
	});

	$app->get('/search/:query/:user_id', function($query, $user_id) use ($app) {
		$mysql = start_mysql();
		execute_mysql($mysql, 
		    "INSERT INTO search_queries (user_id, query, date) 
            VALUES (?, ?, ?)", 
		[$user_id, $query, time()]);

		if (intval($query) > 0) {
			$result = get_all($mysql, "SELECT q.*, e.subject, e.semester FROM questions q, exams e WHERE (q.question_id = ?) AND q.exam_id = e.exam_id AND e.visibility = 1", [$query]);

		} else {
			$new_query = str_replace( ' ', '%\') AND LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(\'%', $query);
			$result = get_all($mysql, 
			"SELECT q.*, e.subject, e.semester 
			FROM questions q, exams e 
			WHERE ( LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(?) ) AND q.exam_id = e.exam_id AND e.visibility = 1", 
			['%'.$new_query.'%']);
		}

		$response['query'] = $query;
		$response['result'] = $result['result'];
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		    "INSERT INTO questions (question, answers, correct_answer, exam_id, date_added, user_id_added, explanation, question_image_url, type, topic) 
		    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
		[$data->question, serialize($data->answers), $data->correct_answer, $data->exam_id, time(), $data->user_id_added, $data->explanation, $data->question_image_url, $data->type, $data->topic], function($stmt, $mysql) {
			$response['question_id'] = $mysql->lastInsertId();
			return $response;
		});

		print_response($app, $response);
	});

	$app->put('/:question_id', function($question_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		    "UPDATE questions SET question = ?, answers = ?, correct_answer = ?, exam_id = ?, explanation = ?, question_image_url = ?, type = ?, topic = ? 
            WHERE question_id = ?", 
		[$data->question, serialize($data->answers), $data->correct_answer, $data->exam_id, $data->explanation, $data->question_image_url, $data->type, $data->topic, $question_id]);
		print_response($app, $response);
	});

	$app->delete('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, 
		    "DELETE FROM questions WHERE question_id = ?", 
		[$question_id]);
		print_response($app, $response);
	});
});

?>