<?php
  
$app->group('/learn', function () use ($app) {

	$app->post('/number-questions', function() use ($app) {
		$mysql = start_mysql();

		$data = json_decode($app->request()->getBody());
		$subject_list = $data->selection_subject_list;
		$result = 0;

		foreach ($subject_list as $key => $value) {
			if (count($value) == 0) {
				$result += get_count($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id", [$key]);
			} else {
				foreach ($subject_list->$key as $cat) {
					$result += get_count($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id AND q.topic = ?", [$key, $cat]);
				}
			}
		}
		
		$response['number_questions'] = $result;
	    print_response($app, $response);
	});

	$app->post('/prepare', function() use ($app) {
		$mysql = start_mysql();

		$data = json_decode($app->request()->getBody());
		$subject_list = $data->selection_subject_list;
		$selection_number_questions = $data->selection_number_questions;

		$list = [];

		foreach ($subject_list as $key => $value) {
			if (count($value) == 0) {
				$result = execute_mysql($mysql, "SELECT DISTINCT q.* FROM questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id", [$key], function($stmt, $mysql) {
					$response['stmt'] = $stmt;
					return $response;
				});
				while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
					$row['answers'] = unserialize($row['answers']);
					$list[] = $row;
				}

			} else {
				foreach ($subject_list->$key as $cat) {
					$result = execute_mysql($mysql, "SELECT DISTINCT q.* FROM questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id AND q.topic = ?", [$key, $cat], function($stmt, $mysql) {
						$response['stmt'] = $stmt;
						return $response;
					});
					while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
						$row['answers'] = unserialize($row['answers']);
						$list[] = $row;
					}
				}
			}
		}

		shuffle($list);

		if ($selection_number_questions > 0)
			$list = array_slice($list, 0, $selection_number_questions);

	    $response['list'] = $list;
	    $response['selection_subject_list'] = $subject_list;
	    print_response($app, $response);
	});
});

?>