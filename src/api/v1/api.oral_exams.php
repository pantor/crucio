<?php

$app->group('/oral_exams', function() {

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $limit = intval($request->getQueryParam('limit', 10000));
    $query = strlen($request->getQueryParam('query')) > 0 ? "%".$request->getQueryParam('query')."%" : null;

    $stmt = $mysql->prepare(
      "SELECT o.*
      FROM oral_exams o
      WHERE o.oral_exam_id = IFNULL(:oral_exam_id, o.oral_exam_id)
      AND o.year = IFNULL(:year, o.year)
      AND o.semester = IFNULL(:semester, o.semester)
      AND ( o.examiner_1 LIKE IFNULL(:query, o.examiner_1)
      OR o.examiner_2 LIKE IFNULL(:query, o.examiner_2)
      OR o.examiner_3 LIKE IFNULL(:query, o.examiner_3)
      OR o.examiner_4 LIKE IFNULL(:query, o.examiner_4) )
      ORDER BY o.oral_exam_id DESC
      LIMIT :limit "
    );
    $stmt->bindValue(':oral_exam_id', $request->getQueryParam('oral_exam_id'), PDO::PARAM_INT);
    $stmt->bindValue(':year', $request->getQueryParam('year'), PDO::PARAM_INT);
    $stmt->bindValue(':semester', $request->getQueryParam('semester'), PDO::PARAM_INT);
    $stmt->bindValue(':query', $query);

    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $data['oral_exams'] = getAll($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/distinct', function($request, $response, $args) {
    $mysql = init();

    $stmt_years = $mysql->prepare(
      "SELECT DISTINCT o.year
      FROM oral_exams o
      ORDER BY o.year ASC"
    );

    $data['years'] = getAll($stmt_years);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/{oral_exam_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "SELECT *
      FROM oral_exams
      WHERE oral_exam_id = :oral_exam_id"
    );
    $stmt->bindValue(':oral_exam_id', $args['oral_exam_id'], PDO::PARAM_INT);

    $data['oral_exam'] = getFetch($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->post('', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $stmt = $mysql->prepare(
      "INSERT INTO oral_exams (examiner_count, semester, year)
      VALUES (:examiner_count, :semester, :year)"
    );
    $stmt->bindValue(':examiner_count', $body['examiner_count']);
    $stmt->bindValue(':semester', $body['semester']);
    $stmt->bindValue(':year', $body['year']);

    $data['status'] = $stmt->execute();
    $data['oral_exam_id'] = $mysql->lastInsertId();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->put('/{oral_exam_id}', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $stmt = $mysql->prepare(
      "UPDATE oral_exams
      SET examiner_1 = :examiner_1, examiner_2 = :examiner_2, examiner_3 = :examiner_3, examiner_4 = :examiner_4, examiner_count = :examiner_count, semester = :semester, year = :year, filename = :filename
      WHERE oral_exam_id = :oral_exam_id"
    );
    $stmt->bindValue(':examiner_1', $body['examiner_1']);
    $stmt->bindValue(':examiner_2', $body['examiner_2']);
    $stmt->bindValue(':examiner_3', $body['examiner_3']);
    $stmt->bindValue(':examiner_4', $body['examiner_4']);
    $stmt->bindValue(':examiner_count', $body['examiner_count']);
    $stmt->bindValue(':semester', $body['semester']);
    $stmt->bindValue(':year', $body['year']);
    $stmt->bindValue(':filename', $body['filename']);
    $stmt->bindValue(':oral_exam_id', $args['oral_exam_id']);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{oral_exam_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE
      FROM oral_exams
      WHERE oral_exam_id = :oral_exam_id"
    );
    $stmt->bindValue(':oral_exam_id', $args['oral_exam_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
