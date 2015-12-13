<?php

$app->group('/questions', function() {

    $this->get('', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$query = urldecode($query_params['query']);
		$subquery_array = explode(' ', $query);
		$sql_query = "";
		for ($i = 0; $i < count($subquery_array); $i++) {
    		$sql_query .= "AND ( LOWER(CONCAT(q.question, q.answers, q.explanation)) LIKE LOWER(:sub$i) ) ";
		}
		$question_id = ( intval($query) > 0) ? intval($query) : null ; // Query is question id
        $limit = ($query_params['limit']) ? intval($query_params['limit']) : 10000;

		$stmt = $mysql->prepare(
		    "SELECT q.*, s.name AS 'subject', e.subject_id, e.semester
		    FROM questions q
		    INNER JOIN exams e ON q.exam_id = e.exam_id
		    INNER JOIN subjects s ON e.subject_id = s.subject_id
		    WHERE e.visibility = IFNULL(:visibility, e.visibility)
		        AND e.semester = IFNULL(:semester, e.semester)
		        AND e.subject_id = IFNULL(:subject_id, e.subject_id)
		        $sql_query
		        AND q.question_id = IFNULL(:question_id, q.question_id)
		    LIMIT :limit"
		);
        $stmt->bindValue(':visibility', $query_params['visibility'], PDO::PARAM_INT);
        $stmt->bindValue(':semester', $query_params['semester'], PDO::PARAM_INT);
        $stmt->bindValue(':subject_id', $query_params['subject_id'], PDO::PARAM_INT);
        for ($i = 0; $i < count($subquery_array); $i++) {
            $stmt->bindValue(':sub0', "%test%");
        }
        $stmt->bindValue(':question_id', $question_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

		$data['result'] = getAll($stmt);
		return createResponse($response, $data);
	});


	$this->get('/{question_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt_question = $mysql->prepare(
		    "SELECT q.*, e.*, u.email, u.username
            FROM questions q
            INNER JOIN exams e ON e.exam_id = q.exam_id
            INNER JOIN users u ON u.user_id = e.user_id_added
            WHERE q.question_id = :question_id"
		);
		$stmt_question->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);
        $question = getFetch($stmt_question);
		$question['answers'] = unserialize($question['answers']);

		$stmt_comments = $mysql->prepare(
		    "SELECT *
            FROM comments
            WHERE question_id = :question_id
            ORDER BY comment_id ASC"
        );
        $stmt_comments->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);
        $comments = getAll($stmt_comments);

		$data['question'] = $question;
		$data['comments'] = $comments;
		return createResponse($response, $data);
	});


	$this->get('/{question_id}/user/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt_question = $mysql->prepare(
		    "SELECT q.*, e.*
            FROM questions q
            INNER JOIN exams e ON e.exam_id = q.exam_id
		    WHERE q.question_id = :question_id"
		);
		$stmt_question->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);
        $question = getFetch($stmt_question);
		$question['answers'] = unserialize($question['answers']);

		$stmt_tags = $mysql->prepare(
		    "SELECT t.tags
            FROM tags t
            WHERE t.user_id = :user_id
                AND t.question_id = :question_id"
		);
		$stmt_tags->bindValue(':user_id', intval($args['user_id']), PDO::PARAM_INT);
		$stmt_tags->bindValue(':question_id', intval($args['question_id']), PDO::PARAM_INT);
		$tags = getFetch($stmt_tags);
		if (!$tags) {
			$tags = '';
        }

        $stmt_comments = $mysql->prepare(
		    "SELECT c.*, u.username, SUM(IF(uc.user_id != :user_id0, uc.user_voting, 0)) as 'voting', SUM(IF(uc.user_id = :user_id1, uc.user_voting, 0)) as 'user_voting'
            FROM comments c
            INNER JOIN users u ON c.user_id = u.user_id
            LEFT JOIN user_comments_data uc ON uc.comment_id = c.comment_id
            WHERE c.question_id = :question_id
            GROUP BY c.comment_id
            ORDER BY c.comment_id ASC"
        );
        $stmt_comments->bindValue(':user_id0', $args['user_id'], PDO::PARAM_INT);
        $stmt_comments->bindValue(':user_id1', $args['user_id'], PDO::PARAM_INT);
        $stmt_comments->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);
        $comments = getAll($stmt_comments);

		$data = $question;
		$data['tags'] = $tags['tags'];
		$data['comments'] = $comments;
		return createResponse($response, $data);
	});


	$this->post('', function($request, $response, $args) {
    	$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
    		"INSERT INTO questions (question, answers, correct_answer, exam_id, date_added, user_id_added, explanation, question_image_url, type, topic)
		    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->bindValue(1, $body['question']);
        $stmt->bindValue(2, serialize($body['answers']));
        $stmt->bindValue(3, $body['correct_answer']);
        $stmt->bindValue(4, $body['exam_id'], PDO::PARAM_INT);
        $stmt->bindValue(5, time());
        $stmt->bindValue(6, $body['user_id_added'], PDO::PARAM_INT);
        $stmt->bindValue(7, $body['explanation']);
        $stmt->bindValue(8, $body['question_image_url']);
        $stmt->bindValue(9, $args['type']);
        $stmt->bindValue(10, $args['topic']);

        $data = execute($stmt);
        $data['question_id'] = $mysql->lastInsertId();
		return createResponse($response, $data);
	});


	$this->put('/{question_id}', function($request, $response, $args) {
    	$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
    		"UPDATE questions
    		SET question = ?, answers = ?, correct_answer = ?, exam_id = ?, explanation = ?, question_image_url = ?, type = ?, topic = ?
            WHERE question_id = ?"
        );
        $stmt->bindValue(1, $body['question']);
        $stmt->bindValue(2, serialize($body['answers']));
        $stmt->bindValue(3, $body['correct_answer']);
        $stmt->bindValue(4, $body['exam_id'], PDO::PARAM_INT);
        $stmt->bindValue(5, $body['explanation']);
        $stmt->bindValue(6, $body['question_image_url']);
        $stmt->bindValue(7, $body['type']);
        $stmt->bindValue(8, $body['topic']);
        $stmt->bindValue(9, $args['question_id'], PDO::PARAM_INT);

        $data = execute($stmt);
		return createResponse($response, $data);
	});


	$this->delete('/{question_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
    		"DELETE FROM questions WHERE question_id = :question_id"
        );
        $stmt->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);

        $data = execute($stmt);
		return createResponse($response, $data);
	});
});

?>