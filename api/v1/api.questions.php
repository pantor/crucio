<?php

$app->group('/questions', function () use ($app) {

    $app->get('', function() use ($app) {
		$mysql = start_mysql();
		$params = [];

		$user_id = $app->request()->params('user_id');

		$query = urldecode($app->request()->params('query'));
		$subquery_array = explode(' ', $query);
		$sql_query = "";
		foreach ($subquery_array as $sub_query) {
    		$sql_query .= "AND ( LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(?) ) ";
    		array_push($params, '%'.$sub_query.'%');
        }

		$limit = $app->request()->params('limit');
		$limit_sql_limit = "";
		if ($limit) {
    		$limit_sql_limit = "LIMIT $limit ";
		}

		$visibility = $app->request()->params('visibility');
		$visibility_sql_where = "";
		if ($visibility) {
    		$visibility_sql_where = "AND e.visibility = $visibility ";
		}

		$semester = $app->request()->params('semester');
		$semester_sql_where = "";
		if ($semester) {
    		$semester_sql_where = "AND e.semester = $semester ";
		}

		$subject_id = $app->request()->params('subject_id');
		$subject_id_sql_where = "";
		if ($subject_id) {
    		$subject_id_sql_where = "AND e.subject_id = $subject_id ";
		}

		$question_id = intval($query); // Query is question id
		$question_id_sql_where = "";
		if ($question_id > 0) {
    		$question_id_sql_where = "AND q.question_id = $question_id ";
    		$sql_query = "";
		}


		$response = get_all($mysql,
		    "SELECT q.*, s.name AS 'subject', e.subject_id, e.semester
		    FROM questions q
		    INNER JOIN exams e ON q.exam_id = e.exam_id
		    INNER JOIN subjects s ON e.subject_id = s.subject_id
		    WHERE 1 = 1 "
		        .$sql_query
                .$visibility_sql_where
                .$semester_sql_where
                .$subject_id_sql_where
                .$question_id_sql_where
		    .$limit_sql_limit,
        $params);

		$response['query'] = $sql_query;
		print_response($app, $response);
	});


	$app->get('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$question = get_fetch($mysql,
		    "SELECT q.*, e.*, u.email, u.username
            FROM questions q, exams e, users u
            WHERE q.question_id = ? AND q.exam_id = e.exam_id AND e.user_id_added = u.user_id",
		[$question_id]);
		$question['result']['answers'] = unserialize($question['result']['answers']);

		$comments = get_all($mysql,
		    "SELECT *
            FROM comments
            WHERE question_id = ?
            ORDER BY comment_id ASC",
		[$question_id]);

		$response['question'] = $question['result'];
		$response['comments'] = $comments['result'];
		print_response($app, $response);
	});


	$app->get('/:question_id/user/:user_id', function($question_id, $user_id) use ($app) {
		$mysql = start_mysql();
		$question = get_fetch($mysql,
		    "SELECT q.*, e.*
            FROM questions q
            INNER JOIN exams e ON q.exam_id = e.exam_id
		    WHERE q.question_id = ?",
		[$question_id]);
		$question['result']['answers'] = unserialize($question['result']['answers']);

		$tags = get_fetch($mysql,
		    "SELECT tags
            FROM tags
            WHERE user_id = ? AND question_id = ?",
		[$user_id, $question_id]);
		if (!$tags) {
			$tags['result'] = '';
        }

        $comments = get_all($mysql,
		    "SELECT c.*, u.username, SUM(IF(uc.user_id != ?, uc.user_voting, 0)) as 'voting', SUM(IF(uc.user_id = ?, uc.user_voting, 0)) as 'user_voting'
            FROM comments c
            INNER JOIN users u ON c.user_id = u.user_id
            LEFT JOIN user_comments_data uc ON uc.comment_id = c.comment_id
            WHERE c.question_id = ?
            GROUP BY c.comment_id
            ORDER BY c.comment_id ASC",
        [$user_id, $user_id, $question_id]);

		$response = $question['result'];
		$response['tags'] = $tags['result']['tags'];
		$response['comments'] = $comments['result'];
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
		$response = execute_mysql($mysql, "DELETE FROM questions WHERE question_id = ?", [$question_id]);
		print_response($app, $response);
	});
});

?>