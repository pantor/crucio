<?php

$app->group('/exams', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = startMysql();

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

		$author_id = $request->getQueryParams()['author_id'];
		$author_id_sql_where = "";
		if ($author_id) {
    		$author_id_sql_where = "AND e.user_id_added = $author_id ";
		}

		$data = get_all($mysql,
		    "SELECT e.*, u.username AS 'author', COUNT(*) AS 'question_count'
            FROM exams e
            INNER JOIN users u ON u.user_id = e.user_id_added
            INNER JOIN questions q ON q.exam_id = e.exam_id
            WHERE 1 = 1 "
                .$visibility_sql_where
                .$semester_sql_where
                .$author_id_sql_where
            ."GROUP BY q.exam_id
            ORDER BY e.subject ASC, e.semester ASC, e.date DESC",
		[], 'exams');

		return createResponse($response, $data);
	});


	$this->get('/user_id/{user_id}', function($request, $response, $args) {
		$mysql = startMysql();

		$visibility = 1; // $request->getQueryParams()['visibility'];
		$visibility_sql_where = "";
		if ($visibility) {
            $visibility_sql_where = "AND e.visibility = $visibility ";
		}

		$semester = $request->getQueryParams()['semester'];
		$semester_sql_where = "";
		if ($semester) {
    		$semester_sql_where = "AND e.semester = $semester ";
		}

		$author_id = $request->getQueryParams()['author_id'];
		$author_id_sql_where = "";
		if ($author_id) {
    		$author_id_sql_where = "AND e.user_id_added = $author_id ";
		}

		$data = get_all($mysql,
		    "SELECT e.*, u.username, COUNT(*) AS 'question_count', IFNULL(answered_questions, 0) AS 'answered_questions'
            FROM exams e
            LEFT JOIN (SELECT q.exam_id, COUNT(*) AS 'answered_questions'
                FROM results r
                INNER JOIN questions q ON q.question_id = r.question_id AND r.user_id = ?
                WHERE r.resetted = 0 AND r.attempt = 1
                GROUP BY q.exam_id) AS R ON e.exam_id = R.exam_id
            INNER JOIN questions q ON q.exam_id = e.exam_id
            INNER JOIN users u ON u.user_id = e.user_id_added
            WHERE 1 = 1 "
                .$visibility_sql_where
                .$semester_sql_where
                .$author_id_sql_where
            ."GROUP BY q.exam_id
            ORDER BY e.semester ASC, e.subject ASC, e.date DESC",
        [$args['user_id']], 'exam');

		return createResponse($response, $data);
	});


	$this->get('/{exam_id}', function($request, $response, $args) {
		$mysql = startMysql();

		$exam = get_fetch($mysql,
		    "SELECT e.*, u.username, u.email
            FROM exams e
            INNER JOIN users u ON u.user_id = e.user_id_added
            WHERE e.exam_id = ?",
		[$args['exam_id']]);

		$questions = get_all($mysql,
		    "SELECT *
		    FROM questions
		    WHERE exam_id = ? ORDER BY question_id ASC",
		[$args['exam_id']]);

		foreach ($questions['result'] as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		$data = $exam['result'];
		$data['questions'] = $questions['result'];
		$data['question_count'] = count($questions['result']);
		return createResponse($response, $data);
	});


	$this->get('/action/prepare/{exam_id}/{random}', function($request, $response, $args) {
		$mysql = startMysql();

		$sql = "SELECT DISTINCT * FROM questions";
		$parameters = [];
		if ($args['exam_id']) {
			$sql .= " WHERE exam_id = ?";
			$parameters[] = $args['exam_id'];
		}
		if ($args['random']) {
			$sql .= " ORDER BY RAND()";
		}

		$data = get_all($mysql, $sql, $parameters, 'list');
		foreach ($data['list'] as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		return createResponse($response, $data);
	});


	$this->post('', function($request, $response, $args) {
		$body = $request->getParsedBody();

		$mysql = startMysql();
		$data = executeMysql($mysql,
		    "INSERT INTO exams ( subject, professor, semester, date, sort, date_added, date_updated, user_id_added, duration, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[$body['subject'], $body['professor'], $body['semester'], $body['date'], $body['type'], time(), time(), $body['user_id_added'], $body['duration'], $body['notes']], function($stmt, $mysql) {
			$response['exam_id'] = $mysql->lastInsertId();
			return $response;
		});

		return createResponse($response, $data);
	});


	$this->put('/{exam_id}', function($request, $response, $args) {
		$body = $request->getParsedBody();

		$mysql = startMysql();
		$data = executeMysql($mysql,
		    "UPDATE exams
            SET subject = ?, professor = ?, semester = ?, date = ?, sort = ?, duration = ?, notes = ?, file_name = ?, visibility = ?, date_updated = ?
            WHERE exam_id = ?",
		[$body['subject'], $body['professor'], $body['semester'], $body['date'], $body['sort'], $body['duration'], $body['notes'], $body['file_name'], $body['visibility'], time(), $args['exam_id']]);

		return createResponse($response, $data);
	});


	$this->delete('/:exam_id', function($exam_id) {
		$mysql = startMysql();
		$data = executeMysql($mysql, "DELETE FROM exams WHERE exam_id = ?", [$exam_id]);

		return createResponse($response, $data);
	});
});

?>