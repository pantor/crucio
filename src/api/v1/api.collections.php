<?php

$app->group('/collections', function() {
  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $limit = intval($request->getQueryParam('limit', 10000));

    $stmt = $mysql->prepare(
      "SELECT c.*
      FROM collections c
      WHERE c.user_id = IFNULL(:user_id, c.user_id)
      AND c.collection_id = IFNULL(:collection_id, c.collection_id)
      ORDER BY c.save_date DESC
      LIMIT :limit"
    );
    $stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
    $stmt->bindValue(':collection_id', $request->getQueryParam('collection_id'), PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $collections = getAll($stmt);
    foreach($collections as &$collection) {
      $collection_id = $collection['collection_id'];
      $collection = unserialize($collection['data']);
      $collection['collection_id'] = $collection_id;

      if ($collection['type'] == 'exam') {
        $stmt_exam = $mysql->prepare(
          "SELECT e.*, u.username, u.email, s.name AS 'subject'
          FROM exams e
          LEFT JOIN users u ON u.user_id = e.user_id_added
          LEFT JOIN subjects s ON s.subject_id = e.subject_id
          WHERE e.exam_id = :exam_id"
        );
        $stmt_exam->bindValue(':exam_id', $collection['exam_id']);
        $collection['exam'] = getFetch($stmt_exam);
      }

      if ($collection['type'] == 'query') {
        $stmt_subject = $mysql->prepare(
          "SELECT s.name as 'subject'
          FROM subjects s
          WHERE s.subject_id = :subject_id"
        );

        $stmt_subject->bindValue(':subject_id', $collection['questionSearch']['subject_id']);
        $collection['questionSearch']['subject'] = getFetch($stmt_subject)['subject'];
      }

      if ($collection['type'] == 'subjects') {
        $stmt_subject = $mysql->prepare(
          "SELECT s.name as 'subject'
          FROM subjects s
          WHERE s.subject_id = :subject_id"
        );

        $stmt_subject->bindValue(':subject_id', array_keys($collection['selection'])[0]);
        $collection['main_subject'] = getFetch($stmt_subject)['subject'];
      }
    }

    $data['collections'] = $collections;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->post('', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $collection = serialize($body['collection']);

    $stmt = $mysql->prepare(
      "INSERT INTO collections (user_id, data, save_date)
      VALUES (:user_id, :data, :save_date)"
    );
    $stmt->bindValue(':user_id', $body['user_id'], PDO::PARAM_INT);
    $stmt->bindValue(':data', $collection);
    $stmt->bindValue(':save_date', time());

    $data['status'] = $stmt->execute();
    $data['collection_id'] = $mysql->lastInsertId();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/{collection_id}', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $collection = serialize($body['collection']);

    $stmt = $mysql->prepare(
      "UPDATE collections
      SET data = :data, save_date = :save_date
      WHERE collection_id = :collection_id"
    );
    $stmt->bindValue(':data', $collection);
    $stmt->bindValue(':save_date', time());
    $stmt->bindValue(':collection_id', $args['collection_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{collection_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE FROM collections
      WHERE collection_id = :collection_id"
    );
    $stmt->bindValue(':collection_id', $args['collection_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
