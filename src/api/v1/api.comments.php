<?php

$app->group('/comments', function() {

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $limit = intval($request->getQueryParam('limit', 10000));
    $query = strlen($request->getQueryParam('query')) > 0 ? "%".$request->getQueryParam('query')."%" : null;

    $stmt = $mysql->prepare(
      "SELECT c.*, q.question, u.username
      FROM comments c
      INNER JOIN users u ON u.user_id = c.user_id
      INNER JOIN questions q ON q.question_id = c.question_id
      WHERE u.user_id = IFNULL(:user_id, u.user_id)
      AND c.question_id = IFNULL(:question_id, c.question_id)
      AND ( c.comment LIKE IFNULL(:query, c.comment)
      OR q.question LIKE IFNULL(:query, q.question)
      OR q.question_id LIKE IFNULL(:query, q.question_id)
      OR u.username LIKE IFNULL(:query, u.username) )
      ORDER BY c.comment_id DESC
      LIMIT :limit"
    );
    $stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
    $stmt->bindValue(':question_id', $request->getQueryParam('question_id'), PDO::PARAM_INT);
    $stmt->bindValue(':query', $query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $data['comments'] = getAll($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/author', function($request, $response, $args) {
    $mysql = init();

    $limit = intval($request->getQueryParam('limit', 10000));
    $query = strlen($request->getQueryParam('query')) > 0 ? "%".$request->getQueryParam('query')."%" : null;

    $stmt = $mysql->prepare(
      "SELECT c.*, u.username, q.question, q.exam_id, e.user_id_added, (
        SELECT u2.username
        FROM users u2
        WHERE u2.user_id = e.user_id_added) AS 'username_added'
        FROM comments c
        INNER JOIN users u ON u.user_id = c.user_id
        INNER JOIN questions q ON q.question_id = c.question_id
        INNER JOIN exams e ON e.exam_id = q.exam_id
        WHERE u.user_id = IFNULL(:user_id, u.user_id)
        AND c.question_id = IFNULL(:question_id, c.question_id)
        AND e.user_id_added = IFNULL(:author_id, e.user_id_added)
        AND ( c.comment LIKE IFNULL(:query, c.comment)
        OR q.question LIKE IFNULL(:query, q.question)
        OR q.question_id LIKE IFNULL(:query, q.question_id)
        OR u.username LIKE IFNULL(:query, u.username) )
        ORDER BY c.comment_id DESC
        LIMIT :limit"
      );
      $stmt->bindValue(':user_id', $request->getQueryParam('user_id'), PDO::PARAM_INT);
      $stmt->bindValue(':question_id', $request->getQueryParam('question_id'), PDO::PARAM_INT);
      $stmt->bindValue(':author_id', $request->getQueryParam('author_id'), PDO::PARAM_INT);
      $stmt->bindValue(':query', $query);
      $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

      $data['comments'] = getAll($stmt);
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });

    $this->get('/distinct/users', function($request, $response, $args) {
      $mysql = init();

      $stmt = $mysql->prepare(
        "SELECT DISTINCT u.*
        FROM comments c
        INNER JOIN users u ON u.user_id = c.user_id
        ORDER BY u.user_id ASC"
      );

      $data['authors'] = getAll($stmt);
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });

    $this->get('/distinct/authors', function($request, $response, $args) {
      $mysql = init();

      $stmt = $mysql->prepare(
        "SELECT DISTINCT u.*
        FROM comments c
        INNER JOIN questions q ON q.question_id = c.question_id
        INNER JOIN exams e ON e.exam_id = q.exam_id
        INNER JOIN users u ON u.user_id = e.user_id_added
        ORDER BY u.user_id ASC"
      );

      $data['authors'] = getAll($stmt);
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });

    $this->post('/{user_id}', function($request, $response, $args) {
      $mysql = init();
      $body = $request->getParsedBody();

      $stmt = $mysql->prepare(
        "INSERT INTO comments (user_id, date, comment, question_id, reply_to)
        VALUES (:user_id, :time, :comment, :question_id, :reply_to)"
      );
      $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);
      $stmt->bindValue(':time', time());
      $stmt->bindValue(':comment', $body['comment']);
      $stmt->bindValue(':question_id', $body['question_id'], PDO::PARAM_INT);
      $stmt->bindValue(':reply_to', $body['reply_to']);

      $data['status'] = $stmt->execute();
      $data['comment_id'] = $mysql->lastInsertId();
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });

    $this->post('/{comment_id}/user/{user_id}', function($request, $response, $args) {
      $mysql = init();
      $body = $request->getParsedBody();

      $stmt = $mysql->prepare(
        "INSERT INTO user_comments_data (user_id, comment_id, user_voting, subscription)
        VALUES (:user_id, :comment_id, :user_voting, '0')
        ON DUPLICATE KEY UPDATE user_voting = :user_voting"
      );
      $stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);
      $stmt->bindValue(':comment_id', $args['comment_id'], PDO::PARAM_INT);
      $stmt->bindValue(':user_voting', $body['user_voting']);

      $data['status'] = $stmt->execute();
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });

    $this->delete('/{comment_id}', function($request, $response, $args) {
      $mysql = init();

      $stmt = $mysql->prepare(
        "DELETE
        FROM comments
        WHERE comment_id = :comment_id"
      );
      $stmt->bindValue(':comment_id', $args['comment_id'], PDO::PARAM_INT);

      $data['status'] = $stmt->execute();
      return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
    });
  });

  ?>
