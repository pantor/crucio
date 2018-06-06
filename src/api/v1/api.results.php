<?php

$app->group('/results', function() {

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "SELECT r.*
      FROM results r
      WHERE r.user_id = IFNULL(:user_id, r.user_id)
      AND r.question_id = IFNULL(:question_id, r.question_id)"
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
      INTO results (user_id, question_id, attempt, correct, given_result, date, resetted)
      VALUES (:user_id, :question_id, :attempt, :correct, :given_result, :date, '0')"
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
      "UPDATE results
      SET resetted = '1'
      WHERE user_id = :user_id"
    );
    $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{user_id}/{exam_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "UPDATE results r
      INNER JOIN questions q ON q.question_id = r.question_id
      SET r.resetted = '1'
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
