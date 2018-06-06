<?php

$app->group('/subjects', function (){

  $this->get('', function($request, $response, $args) {
    $mysql = init();

    $sql_has_questions = "";
    if ($request->getQueryParam('has_questions')) {
      $sql_has_questions = "LEFT JOIN exams e ON e.subject_id = s.subject_id
      WHERE e.subject_id IS NOT NULL";
    }

    $stmt = $mysql->prepare(
      "SELECT c.*, s.subject_id, s.name as 'subject'
      FROM subjects s
      LEFT JOIN categories c ON c.subject_id = s.subject_id
      $sql_has_questions
      GROUP BY s.subject_id, c.category_id
      ORDER BY s.name, c.name ASC"
    );


    $categories = getAll($stmt);

    $subjects = [];
    foreach($categories as $e) {
      if (count($subjects) == 0 || end($subjects)['subject_id'] != $e['subject_id']) {
        $subjects[] = [
          'subject_id' => $e['subject_id'],
          'subject' => $e['subject'],
          'categories' => [],
        ];
      }
      if ($e['category_id']) {
        $subjects[count($subjects) - 1]['categories'][] = [
          'category_id' => $e['category_id'],
          'category' => $e['name'],
        ];
      }
    }

    $data['subjects'] = $subjects;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/categories', function($request, $response, $args) {
    $mysql = init();

    $stmt = $mysql->prepare(
      "SELECT c.*, s.subject_id, s.name as 'subject'
      FROM subjects s
      LEFT JOIN categories c ON c.subject_id = s.subject_id
      WHERE s.subject_id = IFNULL(:subject_id, s.subject_id)
      ORDER BY s.name, c.name ASC"
    );
    $stmt->bindValue(':subject_id', $request->getQueryParam('subject_id'), PDO::PARAM_INT);

    $data['categories'] = getAll($stmt);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
