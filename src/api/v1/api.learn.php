<?php

$app->group('/learn', function() {

  $this->post('/number-questions', function($request, $response, $args) {
    $mysql = startMysql();
    $body =  $request->getParsedBody();

    $subject_list = $body['selection_subject_list'];
    $result = 0;

    foreach ($subject_list as $key => $value) {
      if (count($value) == 0) {
        $result += get_count($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id", [$key]);
      } else {
        foreach ($subject_list[$key] as $cat) {
          $result += get_count($mysql, "questions q, exams e WHERE e.subject = ? AND q.exam_id = e.exam_id AND q.topic = ?", [$key, $cat]);
          $a = $key;
          $b = $subject_list;
        }
      }
    }

    $data['number_questions'] = $result;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->post('/prepare', function($request, $response, $args) {
    $mysql = startMysql();
    $body = $request->getParsedBody();

    $subject_list = $body['selection_subject_list'];
    $selection_number_questions = $body['selection_number_questions'];

    $list = [];

    foreach ($subject_list as $key => $value) {
      if (count($value) == 0) {
        $result = executeMysql($mysql,
        "SELECT DISTINCT q.*
        FROM questions q
        INNER JOIN exams e ON e.exam_id = q.exam_id
        WHERE e.subject = ?",
        [$key], function($stmt, $mysql) {
          $data['stmt'] = $stmt;
          return $data;
        });
        while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
          $row['answers'] = unserialize($row['answers']);
          $list[] = $row;
        }

      } else {
        foreach ($subject_list[$key] as $cat) {
          $result = executeMysql($mysql,
          "SELECT DISTINCT q.*
          FROM questions q
          INNER JOIN exams e ON e.exam_id = q.exam_id
          WHERE e.subject = ? AND q.topic = ?",
          [$key, $cat], function($stmt, $mysql) {
            $data['stmt'] = $stmt;
            return $data;
          });
          while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
            $row['answers'] = unserialize($row['answers']);
            $list[] = $row;
          }
        }
      }
    }

    shuffle($list);

    if ($selection_number_questions > 0) {
      $list = array_slice($list, 0, $selection_number_questions);
    }

    $data['list'] = $list;
    $data['selection_subject_list'] = $subject_list;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
