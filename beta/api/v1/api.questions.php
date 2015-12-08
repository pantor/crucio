<?php

$app->group('/questions', function() {

    $this->get('', function($request, $response, $args) {
		$mysql = startMysql();
		$params = [];

		$user_id = $request->getQueryParams()['user_id'];

		$query = urldecode($request->getQueryParams()['query']);
		$subquery_array = explode(' ', $query);
		$sql_query = "";
		foreach ($subquery_array as $sub_query) {
    		$sql_query .= "AND ( LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(?) ) ";
    		array_push($params, '%'.$sub_query.'%');
        }

		$limit = $request->getQueryParams()['limit'];
		$limit_sql_limit = "";
		if ($limit) {
    		$limit_sql_limit = "LIMIT $limit ";
		}

		$visibility = $request->getQueryParams()['visibility'];
		$visibility_sql_where = "";
		if ($visibility) {
    		$visibility_sql_where = "AND e.visibility = $visibility ";
		}

		$semester = $request->getQueryParams()['semester'];
		$semester_sql_where = "";
		if ($semester) {
    		$semester_sql_where = "AND e.semester = $semester ";
		}

		$subject_id = $request->getQueryParams()['subject_id'];
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


		$data = get_all($mysql,
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

		$data['query'] = $sql_query;
		return createResponse($response, $data);
	});


	$this->get('/{question_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$question = get_fetch($mysql,
		    "SELECT q.*, e.*, u.email, u.username
            FROM questions q, exams e, users u
            WHERE q.question_id = ? AND q.exam_id = e.exam_id AND e.user_id_added = u.user_id",
		[$args['question_id']]);
		$question['result']['answers'] = unserialize($question['result']['answers']);

		$comments = get_all($mysql,
		    "SELECT *
            FROM comments
            WHERE question_id = ?
            ORDER BY comment_id ASC",
		[$args['question_id']]);

		$data['question'] = $question['result'];
		$data['comments'] = $comments['result'];
		return createResponse($response, $data);
	});


	$this->get('/{question_id}/user/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();
		$question = get_fetch($mysql,
		    "SELECT q.*, e.*
            FROM questions q
            INNER JOIN exams e ON q.exam_id = e.exam_id
		    WHERE q.question_id = ?",
		[$args['question_id']]);
		$question['result']['answers'] = unserialize($question['result']['answers']);

		$tags = get_fetch($mysql,
		    "SELECT tags
            FROM tags
            WHERE user_id = ? AND question_id = ?",
		[$args['user_id'], $args['question_id']]);
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
        [$args['user_id'], $args['user_id'], $args['question_id']]);

		$data = $question['result'];
		$data['tags'] = $tags['result']['tags'];
		$data['comments'] = $comments['result'];
		return createResponse($response, $data);
	});


	$this->post('', function($request, $response, $args) {
    	$mysql = startMysql();

		$body =  $request->getParsedBody();
		$data = executeMysql($mysql,
		    "INSERT INTO questions (question, answers, correct_answer, exam_id, date_added, user_id_added, explanation, question_image_url, type, topic)
		    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[$body->question, serialize($body['answers']), $body['correct_answer'], $body['exam_id'], time(), $body['user_id_added'], $body['explanation'], $body['question_image_url'], $body['type'], $body['topic']], function($stmt, $mysql) {
			$data['question_id'] = $mysql->lastInsertId();
			return $data;
		});

		return createResponse($response, $data);
	});


	$this->put('/{question_id}', function($request, $response, $args) {
    	$mysql = startMysql();

		$body = $request->getParsedBody();
		$data = executeMysql($mysql,
		    "UPDATE questions SET question = ?, answers = ?, correct_answer = ?, exam_id = ?, explanation = ?, question_image_url = ?, type = ?, topic = ?
            WHERE question_id = ?",
		[$body['question'], serialize($body['answers']), $body['correct_answer'], $body['exam_id'], $body['explanation'], $body['question_image_url'], $body['type'], $body['topic'], $args['question_id']]);

		return createResponse($response, $data);
	});


	$this->delete('/{question_id}', function($request, $response, $args) {
		$mysql = startMysql();

		$data = executeMysql($mysql, "DELETE FROM questions WHERE question_id = ?", [$args['question_id']]);

		return createResponse($response, $data);
	});
});

?>