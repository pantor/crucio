<?php

$app->group('/stats', function() {

  $this->get('/summary', function($request, $response, $args) {
    $mysql = init();

    $time = time();
    $stats['time'] = $time;

    $stmt = $mysql->prepare("SELECT COUNT(*) AS 'count' FROM users WHERE visibility = 1");

    $stats['user_count'] = getCount($mysql, 'users');
    $stats['exam_count'] = getCount($mysql, 'exams');
    $stats['oral_exam_count'] = getCount($mysql, 'oral_exams');
    $stats['visible_exam_count'] = getCount($mysql, 'exams WHERE visibility = 1');
    $stats['question_count'] = getCount($mysql, 'questions');
    $stats['visible_question_count'] = getCount($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");

    $stats['result_count'] = getCount($mysql, 'results');
    $stats['result_count_today'] = getCount($mysql, 'results WHERE date > ?', [$time - 24*60*60]);
    $stats['result_per_minute'] = getCount($mysql, 'results WHERE date > ?', [$time - 30*60]) / (30.); // Last Half Hour

    $stats['comment_count'] = getCount($mysql, 'comments');
    $stats['tag_count'] = getCount($mysql, 'tags');
    $stats['collection_count'] = getCount($mysql, 'collections');


    $data['stats'] = $stats;
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

  $this->get('/activities', function($request, $response, $args) {
    $mysql = init();

    $activities = [];

    if (filter_var($request->getQueryParam('result'), FILTER_VALIDATE_BOOLEAN)) {
      $stmt = $mysql->prepare(
        "SELECT 'result' activity, r.*, q.*, u.username
        FROM results r
        INNER JOIN users u ON u.user_id = r.user_id
        INNER JOIN questions q ON q.question_id = r.question_id
        ORDER BY r.date DESC
        LIMIT 100"
      );
      $activities = array_merge( $activities, getAll($stmt) );
    }

    if (filter_var($request->getQueryParam('register'), FILTER_VALIDATE_BOOLEAN)) {
      $stmt = $mysql->prepare(
        "SELECT 'register' activity, u.*, u.sign_up_date as date
        FROM users u
        ORDER BY u.sign_up_date DESC
        LIMIT 100"
      );
      $activities = array_merge( $activities, getAll($stmt) );
    }

    if (filter_var($request->getQueryParam('login'), FILTER_VALIDATE_BOOLEAN)) {
      $stmt = $mysql->prepare(
        "SELECT 'login' activity, u.*, u.last_sign_in as date
        FROM users u
        ORDER BY u.last_sign_in DESC
        LIMIT 100"
      );
      $activities = array_merge( $activities, getAll($stmt) );
    }

    if (filter_var($request->getQueryParam('comment'), FILTER_VALIDATE_BOOLEAN)) {
      $stmt = $mysql->prepare(
        "SELECT 'comment' activity, c.*, u.username
        FROM comments c
        INNER JOIN users u ON u.user_id = c.user_id
        ORDER BY c.date DESC
        LIMIT 100"
      );
      $activities = array_merge( $activities, getAll($stmt) );
    }

    if (filter_var($request->getQueryParam('examNew'), FILTER_VALIDATE_BOOLEAN)) {
      $stmt = $mysql->prepare(
        "SELECT 'exam_new' activity, e.*, e.date as year, e.date_added as date, u.username
        FROM exams e
        INNER JOIN users u ON u.user_id = e.user_id_added
        ORDER BY e.date_added DESC
        LIMIT 100"
      );
      $activities = array_merge( $activities, getAll($stmt) );
    }

    if (filter_var($request->getQueryParam('examUpdate'), FILTER_VALIDATE_BOOLEAN)) {
      $stmt = $mysql->prepare(
        "SELECT 'exam_update' activity, e.*, e.date as year, e.date_updated as date, u.username
        FROM exams e
        INNER JOIN users u ON u.user_id = e.user_id_added
        ORDER BY e.date_updated DESC
        LIMIT 100"
      );
      $activities = array_merge( $activities, getAll($stmt) );
    }

    usort($activities, function($a, $b) {
      return $b['date'] - $a['date'];
    });

    $data['activities'] = array_slice($activities, 0, 101);
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });
});

?>
