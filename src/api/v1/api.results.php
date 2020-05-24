<?php

$app->group('/results', function() {

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "SELECT r.*
      FROM results r
      WHERE ( ISNULL(:user_id) OR r.user_id = :user_id )
      AND ( ISNULL(:question_id) OR r.question_id = :question_id )"
    );
    $stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
    $stmt->bindValue(':question_id', $request->getQueryParam('question_id'), PDO::PARAM_INT);

    $data['results'] = getAll($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->post('', function($request, $response, $args) {
    $mysql = init();
    $body = $request->getParsedBody();

    $attempt_count = getCount($mysql, "results r WHERE r.user_id = ? AND r.question_id = ?", [$body['user_id'], $body['question_id']]);

    $stmt = $mysql->prepare(
      "INSERT
      INTO results (user_id, question_id, attempt, correct, given_result, date)
      VALUES (:user_id, :question_id, :attempt, :correct, :given_result, :date)"
    );
    $stmt->bindValue(':user_id', $body['user_id'], PDO::PARAM_INT);
    $stmt->bindValue(':question_id', $body['question_id'], PDO::PARAM_INT);
    $stmt->bindValue(':attempt', $attempt_count + 1, PDO::PARAM_INT);
    $stmt->bindValue(':correct', $body['correct']);
    $stmt->bindValue(':given_result', $body['given_result'], PDO::PARAM_INT);
    $stmt->bindValue(':date', time());

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{user_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE FROM results
      WHERE user_id = :user_id"
    );
    $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{user_id}/{exam_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE r
      FROM results r
      INNER JOIN questions q ON q.question_id = r.question_id
      WHERE q.exam_id = :exam_id
      AND r.user_id = :user_id"
    );
    $stmt->bindValue(':exam_id', $args['exam_id'], PDO::PARAM_INT);
    $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
