<?php

$app->group('/learn', function() {

	$this->post('/number-questions', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$subject_list = $body['selection_subject_list'];
		$result = 0;

		foreach ($subject_list as $key => $value) {
			if (count($value) == 0) {
				$result += getCount($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id", [$key]);
			} else {
				foreach ($subject_list->$key as $cat) {
					$result += getCount($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id AND q.topic = ?", [$key, $cat]);
				}
			}
		}

		$data['number_questions'] = $result;
	    return createResponse($response, $data);
	});

	$this->post('/prepare', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$subject_list = $body['selection_subject_list'];
		$selection_number_questions = $body['selection_number_questions'];

		$list = [];
		foreach ($subject_list as $key => $value) {
			if (count($value) == 0) {
				$stmt = $mysql->prepare(
        		    "SELECT DISTINCT q.*
				    FROM questions q
				    INNER JOIN exams e ON e.exam_id = q.exam_id
				    WHERE e.subject = :subject"
        		);
        		$stmt->bindValue(':subject', $key);
        		$list += getAll($stmt);

			} else {
				foreach ($subject_list->$key as $cat) {
					$stmt = $mysql->prepare(
            		    "SELECT DISTINCT q.*
					    FROM questions q
					    INNER JOIN exams e ON e.exam_id = q.exam_id
					    WHERE e.subject = :subject AND q.topic = :topic"
            		);
            		$stmt->bindValue(':subject', $key);
            		$stmt->bindValue(':topic', $cat);
            		$list += getAll($stmt);
				}
			}
		}

		foreach ($list as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }

		shuffle($list);

		if ($selection_number_questions > 0) {
			$list = array_slice($list, 0, $selection_number_questions);
        }

	    $data['list'] = $list;
	    $data['selection_subject_list'] = $subject_list;
	    return createResponse($response, $data);
	});
});

?>