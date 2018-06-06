<?php

$app->group('/tags', function() {

	$this->get('', function($request, $response, $args) {
		$mysql = init();

		$limit = intval($request->getQueryParam('limit', 10000));
		$query = strlen($request->getQueryParam('query')) > 0 ? "%".$request->getQueryParam('query')."%" : null;

		$stmt = $mysql->prepare(
			"SELECT DISTINCT t.*, q.question, q.exam_id, s.name AS 'subject', u.username
			FROM tags t
			INNER JOIN questions q ON q.question_id = t.question_id
			INNER JOIN exams e ON e.exam_id = q.exam_id
			INNER JOIN users u ON u.user_id = t.user_id
			INNER JOIN subjects s ON s.subject_id = e.subject_id
			WHERE t.tags != ''
			AND t.user_id = IFNULL(:user_id, t.user_id)
			AND t.question_id = IFNULL(:question_id, t.question_id)
			AND t.tags = IFNULL(:query, t.tags)
			ORDER BY t.question_id ASC
			LIMIT :limit"
		);
		$stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
		$stmt->bindValue(':question_id', $request->getQueryParam('question_id'), PDO::PARAM_INT);
		$stmt->bindValue(':query', $query);
		$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

		$data['tags'] = getAll($stmt);
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/distinct', function($request, $response, $args) {
		$mysql = init();

		$stmt_tags = $mysql->prepare(
			"SELECT DISTINCT t.tags
			FROM tags t
			WHERE t.tags != '' AND t.user_id = IFNULL(:user_id, t.user_id)"
		);
		$stmt_tags->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);

		$distinct_tags = getAll($stmt_tags);
		$tags = [];
		foreach ($distinct_tags as $a) {
			foreach (explode(",", $a['tags']) as $splitted) {
				$tags[] = array('tag' => $splitted);
			}
		}

		// Array unique for remove duplicates, array values for reset the keys
		$data['tags'] = array_values( array_unique($tags, SORT_REGULAR) );
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->get('/prepare', function($request, $response, $args) {
		$mysql = init();

		$limit = intval($request->getQueryParam('limit', 10000));
		$tag = $request->getQueryParam('tag');
		$tag_query = "%".$tag."%";

		$stmt = $mysql->prepare(
			"SELECT q.question_id
			FROM tags t
			INNER JOIN questions q ON q.question_id = t.question_id
			INNER JOIN users u ON u.user_id = t.user_id
			WHERE t.tags != ''
			AND t.user_id = :user_id
			AND t.tags LIKE IFNULL(:tag, t.tags)
			LIMIT :limit"
		);
		$stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
		$stmt->bindValue(':tag', $tag_query);
		$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

		$collection['list'] = getAll($stmt);
		// $collection['questions'] = [];
		$collection['type'] = 'tags';
		$collection['tag'] = $tag;

		$data['collection'] = $collection;
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->post('', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		if ($body['tags'] == '') {
			$stmt = $mysql->prepare(
				"DELETE
				FROM tags
				WHERE question_id = :question_id
				AND user_id = :user_id"
			);
			$stmt->bindValue(':question_id', $body['question_id'], PDO::PARAM_INT);
			$stmt->bindValue(':user_id', $body['user_id'], PDO::PARAM_INT);
		} else {
			$stmt = $mysql->prepare(
				"INSERT
				INTO tags (question_id, user_id, tags)
				VALUES (:question_id, :user_id, :tags)
				ON DUPLICATE KEY UPDATE tags = :tags"
			);
			$stmt->bindValue(':question_id', $body['question_id'], PDO::PARAM_INT);
			$stmt->bindValue(':user_id', $body['user_id'], PDO::PARAM_INT);
			$stmt->bindValue(':tags', $body['tags']);
		}

		$data['status'] = $stmt->execute();
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});

	$this->delete('/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
			"DELETE
			FROM tags
			WHERE user_id = :user_id"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data['status'] = $stmt->execute();
		return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
	});
});

?>
