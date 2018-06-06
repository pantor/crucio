<?php

function getQuestionsFromList($mysql, $list) {
  $question_id_list = $list; // json_decode($request->getQueryParam('list'));

  $question_id_list_sql_params = [];

  $question_id_list_sql = '';
  foreach ($question_id_list as $question_id) {
    $count = count($question_id_list_sql_params);
    $question_id_list_sql .= ":sp$count, ";
    array_push($question_id_list_sql_params, $question_id);
  }
  $question_id_list_sql = rtrim($question_id_list_sql, ', ');
  $question_id_list_sql_order = '';
  foreach ($question_id_list as $question_id) {
    $count = count($question_id_list_sql_params);
    $question_id_list_sql_order .= ":sp$count, ";
    array_push($question_id_list_sql_params, $question_id);
  }
  $question_id_list_sql_order = rtrim($question_id_list_sql_order, ', ');

  $stmt = $mysql->prepare(
    "SELECT q.*, e.*, c.name AS 'topic', s.name AS 'subject'
    FROM questions q
    INNER JOIN exams e ON e.exam_id = q.exam_id
    LEFT JOIN categories c ON q.category_id = c.category_id
    INNER JOIN subjects s ON s.subject_id = e.subject_id
    WHERE q.question_id IN ($question_id_list_sql)
    ORDER BY FIELD(q.question_id, $question_id_list_sql_order)"
  );
  for ($i = 0; $i < count($question_id_list_sql_params); $i++) {
    $stmt->bindValue(":sp$i", $question_id_list_sql_params[$i]);
  }

  $result = getAll($stmt);
  foreach ($result as &$question) {
    $question['answers'] = unserialize($question['answers']);
  }

  return $result;
}

$app->group('/questions', function() {

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $subquery_array = explode(' ', $request->getQueryParam('query'));
    $sql_query = "";
    for ($i = 0; $i < count($subquery_array); $i++) {
      $sql_query .= "AND ( q.question LIKE :sub$i
      OR q.answers LIKE :sub$i
      OR q.explanation LIKE :sub$i ) ";
    }
    // $question_id = ( intval($request->getQueryParam('query')) > 0) ? intval($query) : null; // Query is question id
    $limit = intval($request->getQueryParam('limit', 10000));

    $stmt = $mysql->prepare(
      "SELECT q.*, c.name AS 'topic', s.name AS 'subject', e.subject_id, e.semester
      FROM questions q
      INNER JOIN exams e ON q.exam_id = e.exam_id
      INNER JOIN subjects s ON e.subject_id = s.subject_id
      LEFT JOIN categories c ON q.category_id = c.category_id
      WHERE e.visibility = IFNULL(:visibility, e.visibility)
      AND e.semester = IFNULL(:semester, e.semester)
      AND e.subject_id = IFNULL(:subject_id, e.subject_id)
      AND q.category_id = IFNULL(:category_id, q.category_id)
      $sql_query
      AND q.question_id = IFNULL(:question_id, q.question_id)
      LIMIT :limit"
    );
    $stmt->bindValue(':visibility', $request->getQueryParam('visibility'));
    $stmt->bindValue(':semester', $request->getQueryParam('semester'));
    $stmt->bindValue(':subject_id', $request->getQueryParam('subject_id'), PDO::PARAM_INT);
    $stmt->bindValue(':category_id', $request->getQueryParam('category_id'), PDO::PARAM_INT);
    for ($i = 0; $i < count($subquery_array); $i++) {
      $stmt->bindValue(":sub$i", '%'.$subquery_array[$i].'%');
    }
    $stmt->bindValue(':question_id', $question_id, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $list = getAll($stmt);
    foreach ($list as &$question) {
      $question['answers'] = unserialize($question['answers']);
    }

    $data['result'] = $list;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/count', function($request, $response, $args) {
    $mysql = init();

    $selection = json_decode($request->getQueryParam('selection'));

    $sql = '0 = 1 ';
    $sql_params = [];
    foreach ($selection as $subject_id => $entry) {
      if ($entry->subject) {
        $sql .= 'OR e.subject_id = ? ';
        array_push($sql_params, $subject_id);
      }
      foreach ($entry->categories as $category_id => $data_category) {
        if ($data_category) {
          $sql .= 'OR q.category_id = ? ';
          array_push($sql_params, $category_id);
        }
      }
    }

    $stmt = $mysql->prepare(
      "SELECT COUNT(*) as 'c'
      FROM questions q
      INNER JOIN exams e ON e.exam_id = q.exam_id
      WHERE $sql "
    );

    $data['count'] = getFetch($stmt, $sql_params)['c'];
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/prepare-subjects', function($request, $response, $args) {
    $mysql = init();

    $selection = json_decode($request->getQueryParam('selection'));
    $limit = intval($request->getQueryParam('limit', 10000));

    $sql = '0 = 1 ';
    $sql_params = [];
    foreach ($selection as $subject_id => $entry) {
      if ($entry->subject) {
        $count = count($sql_params);
        $sql .= "OR e.subject_id = :sp$count ";
        array_push($sql_params, $subject_id);
      }
      foreach ($entry->categories as $category_id => $data_category) {
        if ($data_category) {
          $count = count($sql_params);
          $sql .= "OR q.category_id = :sp$count ";
          array_push($sql_params, $category_id);
        }
      }
    }

    $stmt = $mysql->prepare(
      "SELECT q.question_id
      FROM questions q
      INNER JOIN exams e ON e.exam_id = q.exam_id
      LEFT JOIN categories c ON q.category_id = c.category_id
      WHERE $sql
      ORDER BY rand()
      LIMIT :limit"
    );
    for ($i = 0; $i < count($sql_params); $i++) {
      $stmt->bindValue(":sp$i", $sql_params[$i]);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $collection['list'] = getAll($stmt);
    // $collection['questions'] = [];
    $collection['type'] = 'subjects';
    $collection['selection'] = $selection;

    $data['collection'] = $collection;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/prepare-query', function($request, $response, $args) {
    $mysql = init();

    $subquery_array = explode(' ', $request->getQueryParam('query'));
    $sql_query = "";
    for ($i = 0; $i < count($subquery_array); $i++) {
      $sql_query .= "AND ( q.question LIKE :sub$i
      OR q.answers LIKE :sub$i
      OR q.explanation LIKE :sub$i ) ";
    }
    $limit = intval($request->getQueryParam('limit', 10000));

    $stmt = $mysql->prepare(
      "SELECT q.question_id
      FROM questions q
      INNER JOIN exams e ON q.exam_id = e.exam_id
      INNER JOIN subjects s ON e.subject_id = s.subject_id
      WHERE e.visibility = 1
      AND e.semester = IFNULL(:semester, e.semester)
      AND e.subject_id = IFNULL(:subject_id, e.subject_id)
      $sql_query
      LIMIT :limit"
    );
    $stmt->bindValue(':semester', $request->getQueryParam('semester'));
    $stmt->bindValue(':subject_id', $request->getQueryParam('subject_id'), PDO::PARAM_INT);
    for ($i = 0; $i < count($subquery_array); $i++) {
      $stmt->bindValue(":sub$i", '%'.$subquery_array[$i].'%');
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $collection['list'] = getAll($stmt);
    // $collection['questions'] = [];
    $collection['type'] = 'query';
    $questionSearch['query'] = $request->getQueryParam('query');
    $questionSearch['semester'] = $request->getQueryParam('semester');
    $questionSearch['subject_id'] = $request->getQueryParam('subject_id');
    $collection['questionSearch'] = $questionSearch;

    $data['collection'] = $collection;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/list', function($request, $response, $args) {
    $mysql = init();

    $list = json_decode($request->getQueryParam('list'));

    $data['list'] = getQuestionsFromList($mysql, $list);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/{question_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt_question = $mysql->prepare(
      "SELECT q.*, e.*, u.email, u.username, c.name AS 'topic', s.name AS 'subject'
      FROM questions q
      INNER JOIN exams e ON e.exam_id = q.exam_id
      INNER JOIN users u ON u.user_id = e.user_id_added
      INNER JOIN subjects s ON s.subject_id = e.subject_id
      LEFT JOIN categories c ON q.category_id = c.category_id
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
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/{question_id}/user/{user_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt_question = $mysql->prepare(
      "SELECT q.*, e.*, c.name AS 'topic', s.name AS 'subject'
      FROM questions q
      INNER JOIN exams e ON e.exam_id = q.exam_id
      INNER JOIN subjects s ON s.subject_id = e.subject_id
      LEFT JOIN categories c ON q.category_id = c.category_id
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
      "SELECT c.*, u.username, SUM(IF(uc.user_id != :user_id, uc.user_voting, 0)) as 'voting', SUM(IF(uc.user_id = :user_id, uc.user_voting, 0)) as 'user_voting'
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      LEFT JOIN user_comments_data uc ON uc.comment_id = c.comment_id
      WHERE c.question_id = :question_id
      GROUP BY c.comment_id
      ORDER BY c.comment_id ASC"
    );
    $stmt_comments->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);
    $stmt_comments->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);
    $comments = getAll($stmt_comments);

    $data['question'] = $question;
    $data['tags'] = $tags['tags'];
    $data['comments'] = $comments;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->delete('/{question_id}', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "DELETE
      FROM questions
      WHERE question_id = :question_id"
    );
    $stmt->bindValue(':question_id', $args['question_id'], PDO::PARAM_INT);

    $data['status'] = $stmt->execute();
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
