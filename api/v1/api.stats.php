<?php

$app->group('/stats', function() {

	$this->get('/general', function($request, $response, $args) {
		$mysql = init();

		$time = time();
		$stats['time'] = $time;

		$stats['user_count'] = getCount($mysql, 'users');
		$stats['user_count_register_today'] = getCount($mysql, 'users WHERE sign_up_date > ?', [$time - 24*60*60]);
		$stats['user_count_login_today'] = getCount($mysql, 'users WHERE last_sign_in > ?', [$time - 24*60*60]);

		$stats['exam_count'] = getCount($mysql, 'exams');
		$stats['visible_exam_count'] = getCount($mysql, 'exams WHERE visibility = 1');
		$stats['question_count'] = getCount($mysql, 'questions');
		$stats['question_explanation_count'] = getCount($mysql, "questions WHERE explanation != ''");
		$stats['question_free_count'] = getCount($mysql, 'questions WHERE type = 1');
		$stats['question_without_answer_count'] = getCount($mysql, 'questions WHERE correct_answer < 1 AND type > 1');
		$stats['question_topic_count'] = getCount($mysql, "questions WHERE topic != '' AND topic != 'Sonstiges'");
		$stats['visible_question_count'] = getCount($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");
		$stats['question_worked_count'] = getCountWithPre($mysql, "COUNT(DISTINCT question_id)", "results");
		$stats['question_worked_count_today'] = getCountWithPre($mysql, "COUNT(DISTINCT question_id)", "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_count'] = getCount($mysql, 'results');
		$stats['result_count_hour'] = getCount($mysql, 'results WHERE date > ?', [$time - 60*60]);
		$stats['result_count_week'] = getCount($mysql, 'results WHERE date > ?', [$time - 7*24*60*60]);
		$stats['result_count_today'] = getCount($mysql, 'results WHERE date > ?', [$time - 24*60*60]);

		$stats['result_per_minute'] = (getCount($mysql, 'results WHERE date > ?', [$time - 30*60])) / (30.); // Last Half Hour

		$stats['comment_count'] = getCount($mysql, 'comments');
		$stats['tag_count'] = getCount($mysql, 'tags');
		$stats['search_count'] = getCount($mysql, 'search_queries');

		$user_count_semester = [];
		$exam_count_semester = [];
		$result_count_semester = [];
		for ($i = 1; $i < 7; $i++) {
			$user_count_semester[] = getCount($mysql, 'users WHERE semester = ?', [$i]);
			$exam_count_semester[] = getCount($mysql, 'exams WHERE semester = ?', [$i]);
		}
		$user_count_semester[] = getCount($mysql, 'users WHERE semester > 6');
		$exam_count_semester[] = getCount($mysql, 'exams WHERE semester > 6');
		$result_count_semester[] = getCount($mysql, 'results WHERE semester > 6');
		$stats['user_count_semester'] = $user_count_semester;
		$stats['exam_count_semester'] = $exam_count_semester;

		$resolution = 1.5 * 60;
		$days = 2;
		$result_dep_time_today = [];
		for ($i = $days * round(24*60/$resolution); $i >= 0; $i--) {
			$result_dep_time_today_label[] = (($time % (24*60*60) - ($time % (60*60)))/(60*60) - ($resolution/60)*$i + $days*24 + 1) % 24;
			$result_dep_time_today[] = round( 60 * getCount($mysql, 'results WHERE date > ? AND date < ?', [$time - ($i+1)*$resolution*60, $time - ($i)*$resolution*60]) / ($resolution) );
		}
		$stats['result_dep_time_today_label'] = $result_dep_time_today_label;
		$stats['result_dep_time_today'] = $result_dep_time_today;

		$data['stats'] = $stats;
		return createResponse($response, $data);
	});

	$this->get('/search-queries', function($request, $response, $args) {
		$mysql = init();

        $stmt = $mysql->prepare(
            'SELECT s.*, u.username FROM search_queries s, users u WHERE s.user_id = u.user_id ORDER BY s.date DESC LIMIT 100'
        );

		$data['search_queries'] = getAll($stmt);
		return createResponse($response, $data);
	});

	$this->get('/results-dep-time', function($request, $response, $args) {
		$mysql = init();

		$results_dep_time = [];
		for ($i = 0; $i<48; $i++) {
			$results_dep_time[] = getCount($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
        }

		$data['results_dep_time'] = $results_dep_time;
		return createResponse($response, $data);
	});

	$this->post('/activities', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$activities = [];

		if (!$body->search_query) {
    		$stmt = $mysql->prepare(
        		"SELECT 'search_query' activity, s.*, u.username
        		FROM search_queries s, users u WHERE s.user_id = u.user_id ORDER BY s.date DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if (!$body->result) {
    		$stmt = $mysql->prepare(
        		"SELECT 'result' activity, r.*, q.*, u.username
        		FROM results r, users u, questions q
        		WHERE r.user_id = u.user_id AND r.question_id = q.question_id
        		ORDER BY r.date DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if (!$body->register) {
    		$stmt = $mysql->prepare(
        		"SELECT 'register' activity, u.*, u.sign_up_date as date
        		FROM users u
        		ORDER BY u.sign_up_date DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if (!$body->login) {
    		$stmt = $mysql->prepare(
        		"SELECT 'login' activity, u.*, u.last_sign_in as date
        		FROM users u
        		ORDER BY u.last_sign_in DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if (!$body->comment) {
    		$stmt = $mysql->prepare(
        		"SELECT 'comment' activity, c.*, u.username
        		FROM comments c, users u
        		WHERE c.user_id = u.user_id
        		ORDER BY c.date DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if (!$body->exam_new) {
    		$stmt = $mysql->prepare(
        		"SELECT 'exam_new' activity, e.*, e.date as year, e.date_added as date, u.username
        		FROM exams e, users u
        		WHERE e.user_id_added = u.user_id
        		ORDER BY e.date_added DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if (!$body->exam_update) {
    		$stmt = $mysql->prepare(
        		"SELECT 'exam_update' activity, e.*, e.date as year, e.date_updated as date, u.username
        		FROM exams e, users u
        		WHERE e.user_id_added = u.user_id
        		ORDER BY e.date_updated DESC LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		usort($activities, function($a, $b) {
		    return $b['date'] - $a['date'];
		});

		$data['activities'] = array_slice($activities, 0, 101);
		return createResponse($response, $data);
	});
});

?>