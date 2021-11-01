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
			WHERE r.attempt = 1
			GROUP BY q.exam_id) AS R ON e.exam_id = R.exam_id ";
		}

		$questions_sql_join = "INNER";
		if ($request->getQueryParam('showEmpty')) {
			$questions_sql_join = "LEFT";
		}

		$stmt = $mysql->prepare(
			"SELECT e.*, s.name AS 'subject', COUNT(q.question_id) AS 'question_count' $answered_questions_sql_select
			FROM exams e
			$answered_questions_sql_join
			$questions_sql_join JOIN questions q ON q.exam_id = e.exam_id
			INNER JOIN subjects s ON s.subject_id = e.subject_id
			WHERE ( ISNULL(:visibility) OR e.visibility = :visibility )
			AND ( ISNULL(:semester) OR e.semester = :semester )
			AND ( ISNULL(:subject_id) OR e.subject_id = :subject_id )
			AND ( ISNULL(:query) OR e.date LIKE :query OR s.name LIKE :query )
			GROUP BY e.exam_id
			ORDER BY e.semester ASC, s.name ASC, e.date DESC
			LIMIT :limit"
		);
		$stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
		$stmt->bindValue(':visibility', $request->getQueryParam('visibility'));
		$stmt->bindValue(':semester', $request->getQueryParam('semester'));
		$stmt->bindValue(':subject_id', $request->getQueryParam('subject_id'), PDO::PARAM_INT);
		$stmt->bindValue(':query', $query);
		$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
		$data['exams'] = getAll($stmt);
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/distinct', function($request, $response, $args) {
		$mysql = init();

		$stmt_semesters = $mysql->prepare(
			"SELECT DISTINCT e.semester
			FROM exams e
			WHERE ( ISNULL(:visibility) OR e.visibility = :visibility )
			ORDER BY e.semester ASC"
		);
		$stmt_semesters->bindValue(':visibility', $request->getQueryParam('visibility'));

		$stmt_subjects = $mysql->prepare(
			"SELECT DISTINCT s.*
			FROM subjects s
			ORDER BY s.name ASC"
		);

		$data['semesters'] = getAll($stmt_semesters);
		$data['subjects'] = getAll($stmt_subjects);
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/{exam_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt_exam = $mysql->prepare(
			"SELECT e.*, s.name AS 'subject'
			FROM exams e
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
			WHERE r.attempt = 1
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
			"INSERT INTO exams (subject_id, user_id_added, date_added, date_updated, sort)
			VALUES (:subject_id, :user_id_added, :date_added, :date_updated, :sort)"
		);
		$stmt->bindValue(':subject_id', $body['subject_id']);
		$stmt->bindValue(':user_id_added', $body['user_id_added']);
		$stmt->bindValue(':date_added', time());
		$stmt->bindValue(':date_updated', time());
		$stmt->bindValue(':sort', $body['sort']);

		$data['status'] = $stmt->execute();
		$data['exam_id'] = $mysql->lastInsertId();
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->put('/{exam_id}', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();
		$exam = $body['exam'];
		$questions = $body['questions'];
		$user_id = $body['user_id'];

		$stmt = $mysql->prepare(
			"UPDATE exams
			SET subject_id = :subject_id, professor = :professor, semester = :semester, date = :date,
			sort = :sort, duration = :duration, notes = :notes, file_name = :file_name,
			visibility = :visibility, date_updated = :date_updated
			WHERE exam_id = :exam_id"
		);
		$stmt->bindValue(':subject_id', $exam['subject_id'], PDO::PARAM_INT);
		$stmt->bindValue(':professor', $exam['professor'], PDO::PARAM_STR);
		$stmt->bindValue(':semester', $exam['semester'], PDO::PARAM_INT);
		$stmt->bindValue(':date', $exam['date'], PDO::PARAM_STR);
		$stmt->bindValue(':sort', $exam['sort'], PDO::PARAM_STR);
		$stmt->bindValue(':duration', $exam['duration'], PDO::PARAM_STR);
		$stmt->bindValue(':notes', $exam['notes'], PDO::PARAM_STR);
		$stmt->bindValue(':file_name', $exam['file_name'], PDO::PARAM_STR);
		$stmt->bindValue(':visibility', $exam['visibility'], PDO::PARAM_BOOL);
		$stmt->bindValue(':date_updated', time());
		$stmt->bindValue(':exam_id', $exam['exam_id'], PDO::PARAM_INT);
		$exam_status = $stmt->execute();

		$question_status = [];
		$question_id_list = [];
		foreach ($questions as $question) {
			if ($question['question_id']) {
				$stmt = $mysql->prepare(
					"UPDATE questions
					SET question = :question, answers = :answers, correct_answer = :correct_answer,
					exam_id = :exam_id, explanation = :explanation,
					question_image_url = :question_image_url, type = :type, category_id = :category_id
					WHERE question_id = :question_id"
				);
				$stmt->bindValue(':question', $question['question']);
				$stmt->bindValue(':answers', serialize($question['answers']));
				$stmt->bindValue(':correct_answer', $question['correct_answer']);
				$stmt->bindValue(':exam_id', $exam['exam_id'], PDO::PARAM_INT);
				$stmt->bindValue(':explanation', $question['explanation']);
				$stmt->bindValue(':question_image_url', $question['question_image_url']);
				$stmt->bindValue(':type', $question['type']);
				$stmt->bindValue(':category_id', $question['category_id'], PDO::PARAM_INT);
				$stmt->bindValue(':question_id', $question['question_id'], PDO::PARAM_INT);

				$question_status[] = $stmt->execute();
				$question_id_list[] = $question['question_id'];
			} else {
				if ($question['question']) { // Save only questions with question
					$explanation = strlen($question['explanation']) > 0 ? $question['explanation'] : '';
					$question_image_url = strlen($question['question_image_url']) > 0 ? $question['question_image_url'] : '';

					$stmt = $mysql->prepare(
						"INSERT INTO questions (question, answers, correct_answer, exam_id, date_added,
							user_id_added, explanation, question_image_url, type, category_id)
						VALUES (:question, :answers, :correct_answer, :exam_id, :date, :user_id_added,
								:explanation, :question_image_url, :type, :category_id)"
					);
					$stmt->bindValue(':question', $question['question']);
					$stmt->bindValue(':answers', serialize($question['answers']));
					$stmt->bindValue(':correct_answer', $question['correct_answer']);
					$stmt->bindValue(':exam_id', $exam['exam_id'], PDO::PARAM_INT);
					$stmt->bindValue(':user_id_added', $user_id, PDO::PARAM_INT);
					$stmt->bindValue(':date', time());
					$stmt->bindValue(':explanation', $explanation);
					$stmt->bindValue(':question_image_url', $question_image_url);
					$stmt->bindValue(':type', $question['type']);
					$stmt->bindValue(':category_id', $question['category_id']);

					$question_status[] = $stmt->execute();
					$question_id_list[] = $mysql->lastInsertId();
				} else {
					$question_status[] = true;
					$question_id_list[] = 0;
				}
			}
		}

		$data['exam_status'] = $exam_status;
		$data['question_status'] = !in_array(false, $question_status, true);
		$data['status'] = $data['exam_status'] && $data['question_status']; // Logical and
		$data['question_id_list'] = $question_id_list;
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