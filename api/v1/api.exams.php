<?php

$app->group('/exams', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$stmt = $mysql->prepare(
		    "SELECT e.*, u.username AS 'author', COUNT(*) AS 'question_count'
            FROM exams e
            INNER JOIN users u ON u.user_id = e.user_id_added
            INNER JOIN questions q ON q.exam_id = e.exam_id
            WHERE e.visibility = IFNULL(:visibility, e.visibility)
                AND e.semester = IFNULL(:semester, e.semester)
                AND e.user_id_added = IFNULL(:author_id, e.user_id_added)
            GROUP BY q.exam_id
            ORDER BY e.subject ASC, e.semester ASC, e.date DESC"
		);

        $stmt->bindValue(':visibility', $query_params['visibility'], PDO::PARAM_INT);
        $stmt->bindValue(':semester', $query_params['semester'], PDO::PARAM_INT);
        $stmt->bindValue(':author_id', $query_params['author_id'], PDO::PARAM_INT);

        $data['exams'] = getAll($stmt);
		return createResponse($response, $data);
	});


	$this->get('/user_id/{user_id}', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$stmt = $mysql->prepare(
		    "SELECT e.*, u.username, COUNT(*) AS 'question_count', IFNULL(answered_questions, 0) AS 'answered_questions'
		    FROM exams e
		    LEFT JOIN (SELECT q.exam_id, COUNT(*) AS 'answered_questions'
                FROM results r
                INNER JOIN questions q ON q.question_id = r.question_id AND r.user_id = :user_id
                WHERE r.resetted = 0 AND r.attempt = 1
                GROUP BY q.exam_id) AS R ON e.exam_id = R.exam_id
		    INNER JOIN questions q ON q.exam_id = e.exam_id
            INNER JOIN users u ON u.user_id = e.user_id_added
            WHERE e.visibility = IFNULL(:visibility, e.visibility)
                AND e.semester = IFNULL(:semester, e.semester)
                AND e.user_id_added = IFNULL(:author_id, e.user_id_added)
            GROUP BY q.exam_id
            ORDER BY e.semester ASC, e.subject ASC, e.date DESC"
        );

        $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);
        $stmt->bindValue(':visibility', $query_params['visibility'], PDO::PARAM_INT);
        $stmt->bindValue(':semester', $query_params['semester'], PDO::PARAM_INT);
        $stmt->bindValue(':author_id', $query_params['author_id'], PDO::PARAM_INT);

		$data['exam'] = getAll($stmt);
		return createResponse($response, $data);
	});


	$this->get('/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt_exam = $mysql->prepare(
		    "SELECT e.*, u.username, u.email
            FROM exams e
            INNER JOIN users u ON u.user_id = e.user_id_added
            WHERE e.exam_id = :exam_id"
		);
		$stmt_exam->bindValue(':exam_id', $args['exam_id']);
		$exam = getFetch($stmt_exam);

		$stmt_questions = $mysql->prepare(
		    "SELECT *
		    FROM questions
		    WHERE exam_id = :exam_id
		    ORDER BY question_id ASC"
		);
		$stmt_questions->bindValue(':exam_id', $args['exam_id']);
		$questions = getFetch($stmt_questions);
		foreach ($questions as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		$data = $exam;
		$data['questions'] = $questions;
		$data['question_count'] = count($questions);
		return createResponse($response, $data);
	});


	$this->get('/action/prepare/{exam_id}/{random}', function($request, $response, $args) {
		$mysql = init();

		$order = '';
		if ($args['random']) {
			$order = "ORDER BY RAND()";
		}

		$stmt = $mysql->prepare(
		    "SELECT DISTINCT *
		    FROM questions
		    WHERE exam_id = IFNULL(:exam_id, exam_id)
		    $order"
        );
        $stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);

		$data['list'] = getAll($stmt);
		foreach ($data['list'] as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }
		return createResponse($response, $data);
	});


	$this->post('', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "INSERT INTO exams ( subject, professor, semester, date, sort, date_added, date_updated, user_id_added, duration, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
		);
		$stmt->bindValue(1, $body['subject']);
		$stmt->bindValue(2, $body['professor']);
		$stmt->bindValue(3, $body['semester']);
		$stmt->bindValue(4, $body['date']);
		$stmt->bindValue(5, $body['type']);
		$stmt->bindValue(6, time());
		$stmt->bindValue(7, time());
		$stmt->bindValue(8, $body['user_id_added']);
		$stmt->bindValue(9, $body['duration']);
		$stmt->bindValue(10, $body['notes']);

		$data = execute($stmt);
        $data['exam_id'] = $mysql->lastInsertId();
		return createResponse($response, $data);
	});


	$this->put('/{exam_id}', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "UPDATE exams
            SET subject = ?, professor = ?, semester = ?, date = ?, sort = ?, duration = ?, notes = ?, file_name = ?, visibility = ?, date_updated = ?
            WHERE exam_id = ?"
		);
		$stmt->bindValue(1, $body['subject']);
		$stmt->bindValue(2, $body['professor']);
		$stmt->bindValue(3, $body['semester']);
		$stmt->bindValue(4, $body['date']);
		$stmt->bindValue(5, $body['sort']);
		$stmt->bindValue(6, $body['duration']);
		$stmt->bindValue(7, $body['notes']);
		$stmt->bindValue(8, $body['file_name']);
		$stmt->bindValue(9, $body['visibility']);
		$stmt->bindValue(10, time());
		$stmt->bindValue(11, $args['exam_id']);

		$data = execute($stmt);
		return createResponse($response, $data);
	});


	$this->delete('/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE
		    FROM exams
		    WHERE exam_id = :exam_id"
		);
		$stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);

		$data = execute($stmt);
		return createResponse($response, $data);
	});
});

?>