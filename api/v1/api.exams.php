<?php

$app->group('/exams', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();

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

		$author_id = $app->request()->params('author_id');
		$author_id_sql_where = "";
		if ($author_id) {
    		$author_id_sql_where = "AND e.user_id_added = $author_id ";
		}

		$response = get_all($mysql,
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
		print_response($app, $response);
	});


	$app->get('/user_id/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();

		$visibility = 1; // $app->request()->params('visibility');
		$visibility_sql_where = "";
		if ($visibility) {
            $visibility_sql_where = "AND e.visibility = $visibility ";
		}

		$semester = $app->request()->params('semester');
		$semester_sql_where = "";
		if ($semester) {
    		$semester_sql_where = "AND e.semester = $semester ";
		}

		$author_id = $app->request()->params('author_id');
		$author_id_sql_where = "";
		if ($author_id) {
    		$author_id_sql_where = "AND e.user_id_added = $author_id ";
		}

		$response = get_all($mysql,
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
        [$user_id], 'exam');
		print_response($app, $response);
	});


	$app->get('/:exam_id', function($exam_id) use ($app) {
		$mysql = start_mysql();

		$exam = get_fetch($mysql,
		    "SELECT e.*, u.username, u.email
            FROM exams e
            INNER JOIN users u ON u.user_id = e.user_id_added
            WHERE e.exam_id = ?",
		[$exam_id]);

		$questions = get_all($mysql,
		    "SELECT *
		    FROM questions
		    WHERE exam_id = ? ORDER BY question_id ASC",
		[$exam_id]);

		foreach ($questions['result'] as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		$response = $exam['result'];
		$response['questions'] = $questions['result'];
		$response['question_count'] = count($questions['result']);
		print_response($app, $response);
	});


	$app->get('/action/prepare/:examid/:random', function($exam_id, $random) use ($app) {
		$mysql = start_mysql();

		$sql = "SELECT DISTINCT * FROM questions";
		$parameters = [];
		if ($exam_id) {
			$sql .= " WHERE exam_id = ?";
			$parameters[] = $exam_id;
		}
		if ($random) {
			$sql .= " ORDER BY RAND()";
		}

		$response = get_all($mysql, $sql, $parameters, 'list');
		foreach ($response['list'] as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		print_response($app, $response);
	});


	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql,
		    "INSERT INTO exams ( subject, professor, semester, date, sort, date_added, date_updated, user_id_added, duration, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[$data->subject, $data->professor, $data->semester, $data->date, $data->type, time(), time(), $data->user_id_added, $data->duration, $data->notes], function($stmt, $mysql) {
			$response['exam_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});


	$app->put('/:exam_id', function($exam_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql,
		    "UPDATE exams
            SET subject = ?, professor = ?, semester = ?, date = ?, sort = ?, duration = ?, notes = ?, file_name = ?, visibility = ?, date_updated = ?
            WHERE exam_id = ?",
		[$data->subject, $data->professor, $data->semester, $data->date, $data->sort, $data->duration, $data->notes, $data->file_name, $data->visibility, time(), $exam_id]);
		print_response($app, $response);
	});


	$app->delete('/:exam_id', function($exam_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM exams WHERE exam_id = ?", [$exam_id]);
		print_response($app, $response);
	});
});

?>