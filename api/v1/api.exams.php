<?php

$app->group('/exams', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();

		$limit = intval($request->getQueryParam('limit', 10000));
		$query = strlen($request->getQueryParam('query')) > 0 ? "%".$request->getQueryParam('query')."%" : null;

        $answered_questions_sql_select = "";
		$answered_questions_sql_join = "";
		if ($request->getQueryParam('user_id')) {
    		$answered_questions_sql_select = ", IFNULL(answered_questions, 0) AS 'answered_questions'";
    		$answered_questions_sql_join = " LEFT JOIN (SELECT q.exam_id, COUNT(*) AS 'answered_questions'
                FROM results r
                INNER JOIN questions q ON q.question_id = r.question_id AND r.user_id = :user_id
                WHERE r.resetted = 0 AND r.attempt = 1
                GROUP BY q.exam_id) AS R ON e.exam_id = R.exam_id ";
		}

		$questions_sql_join = "INNER";
		if ($request->getQueryParam('showEmpty')) {
    		$questions_sql_join = "LEFT";
		}

		$stmt = $mysql->prepare(
		    "SELECT e.*, u.username AS 'author', s.name AS 'subject', COUNT(*) AS 'question_count' $answered_questions_sql_select
            FROM exams e
            $answered_questions_sql_join
            INNER JOIN users u ON u.user_id = e.user_id_added
            $questions_sql_join JOIN questions q ON q.exam_id = e.exam_id
			INNER JOIN subjects s ON s.subject_id = e.subject_id
            WHERE e.visibility = IFNULL(:visibility, e.visibility)
                AND e.semester = IFNULL(:semester, e.semester)
                AND e.user_id_added = IFNULL(:author_id, e.user_id_added)
                AND e.subject_id = IFNULL(:subject_id, e.subject_id)
                AND ( e.date LIKE IFNULL(:query, e.date)
                    OR s.name LIKE IFNULL(:query, s.name) )
            GROUP BY q.exam_id
            ORDER BY e.semester ASC, s.name ASC, e.date DESC
            LIMIT :limit"
		);
		$stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
        $stmt->bindValue(':visibility', $request->getQueryParam('visibility'));
        $stmt->bindValue(':semester', $request->getQueryParam('semester'));
        $stmt->bindValue(':author_id', $request->getQueryParam('author_id'), PDO::PARAM_INT);
        $stmt->bindValue(':subject_id', $request->getQueryParam('subject_id'), PDO::PARAM_INT);
        $stmt->bindValue(':query', $query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

        $data['exams'] = getAll($stmt);
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/distinct', function($request, $response, $args) {
		$mysql = init();

		$stmt_authors = $mysql->prepare(
		    "SELECT DISTINCT u.*
		    FROM exams e
		    INNER JOIN users u ON u.user_id = e.user_id_added
			WHERE e.visibility = IFNULL(:visibility, e.visibility)
		    ORDER BY u.username ASC"
		);
		$stmt_authors->bindValue(':visibility', $request->getQueryParam('visibility'));

		$stmt_semesters = $mysql->prepare(
		    "SELECT DISTINCT e.semester
		    FROM exams e
			WHERE e.visibility = IFNULL(:visibility, e.visibility)
		    ORDER BY e.semester ASC"
		);
		$stmt_semesters->bindValue(':visibility', $request->getQueryParam('visibility'));

		$stmt_subjects = $mysql->prepare(
		    "SELECT DISTINCT s.*
		    FROM subjects s
		    ORDER BY s.name ASC"
		);

        $data['authors'] = getAll($stmt_authors);
        $data['semesters'] = getAll($stmt_semesters);
		$data['subjects'] = getAll($stmt_subjects);
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt_exam = $mysql->prepare(
		    "SELECT e.*, u.username, u.email, s.name AS 'subject'
            FROM exams e
            LEFT JOIN users u ON u.user_id = e.user_id_added
			LEFT JOIN subjects s ON s.subject_id = e.subject_id
            WHERE e.exam_id = :exam_id"
		);
		$stmt_exam->bindValue(':exam_id', $args['exam_id']);
		$exam = getFetch($stmt_exam);

		$stmt_questions = $mysql->prepare(
		    "SELECT q.*, c.name AS 'topic'
		    FROM questions q
			LEFT JOIN categories c ON q.category_id = c.category_id
		    WHERE q.exam_id = :exam_id
		    ORDER BY q.question_id ASC"
		);
		$stmt_questions->bindValue(':exam_id', $args['exam_id']);
		$questions = getAll($stmt_questions);
		foreach ($questions as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		$data['exam'] = $exam;
		$data['questions'] = $questions;
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/abstract/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$limit = intval($request->getQueryParam('limit', 10000));

		$stmt_user = $mysql->prepare(
		    "SELECT *
		    FROM users
		    WHERE user_id = :user_id"
		);
		$stmt_user->bindValue(':user_id', $args['user_id']);
		$user = getFetch($stmt_user);

		$stmt = $mysql->prepare(
		    "SELECT e.*, s.name AS 'subject', COUNT(*) AS 'question_count', IFNULL(answered_questions, 0) AS 'answered_questions'
            FROM exams e
            LEFT JOIN (SELECT q.exam_id, COUNT(*) AS 'answered_questions'
                FROM results r
                INNER JOIN questions q ON q.question_id = r.question_id AND r.user_id = :user_id
                WHERE r.resetted = 0 AND r.attempt = 1
                GROUP BY q.exam_id) AS R ON e.exam_id = R.exam_id
            INNER JOIN questions q ON q.exam_id = e.exam_id
			INNER JOIN subjects s ON s.subject_id = e.subject_id
            WHERE e.visibility = 1
            GROUP BY q.exam_id
            HAVING answered_questions > 0
                OR ( e.semester = :semester
                    AND question_count > 20
                    AND e.date != 'Unbekannt' )
            ORDER BY answered_questions DESC, e.semester ASC, s.name ASC, e.date DESC
            LIMIT :limit"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);
		$stmt->bindValue(':semester', $user['semester'], PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

        $data['exams'] = getAll($stmt);
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/action/prepare/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$order_sql = '';
		if ($request->getQueryParam('random')) {
			$order_sql = "ORDER BY RAND()";
		}

		$stmt = $mysql->prepare(
		    "SELECT DISTINCT question_id
		    FROM questions
		    WHERE exam_id = :exam_id
		    $order_sql"
        );
        $stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);

		$collection['list'] = getAll($stmt);
        // $collection['questions'] = undefined;
        $collection['type'] = 'exam';
        $collection['exam_id'] = $args['exam_id'];

        $data['collection'] = $collection;
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->post('', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "INSERT INTO exams (subject_id, date_added, date_updated, user_id_added, sort)
            VALUES (:subject_id, :date_added, :date_updated, :user_id_added, :sort)"
		);
		$stmt->bindValue(':subject_id', $body['subject_id']);
		$stmt->bindValue(':date_added', time());
		$stmt->bindValue(':date_updated', time());
		$stmt->bindValue(':user_id_added', $body['user_id_added']);
		$stmt->bindValue(':sort', $body['sort']);

		$data['status'] = $stmt->execute();
        $data['exam_id'] = $mysql->lastInsertId();
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->put('/{exam_id}', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "UPDATE exams
            SET subject_id = :subject_id, professor = :professor, semester = :semester, date = :date,
                sort = :sort, duration = :duration, notes = :notes, file_name = :file_name,
                visibility = :visibility, date_updated = :date_updated
            WHERE exam_id = :exam_id"
		);
		$stmt->bindValue(':subject_id', $body['subject_id']);
		$stmt->bindValue(':professor', $body['professor']);
		$stmt->bindValue(':semester', $body['semester']);
		$stmt->bindValue(':date', $body['date']);
		$stmt->bindValue(':sort', $body['sort']);
		$stmt->bindValue(':duration', $body['duration']);
		$stmt->bindValue(':notes', $body['notes']);
		$stmt->bindValue(':file_name', $body['file_name']);
		$stmt->bindValue(':visibility', $body['visibility']);
		$stmt->bindValue(':date_updated', time());
		$stmt->bindValue(':exam_id', $args['exam_id']);

		$data['status'] = $stmt->execute();
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->delete('/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE
		    FROM exams
		    WHERE exam_id = :exam_id"
		);
		$stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);

		$data['status'] = $stmt->execute();
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});
});

?>
