<?php

$app->group('/stats', function() {

    $this->get('/summary', function($request, $response, $args) {
		$mysql = init();

		$time = time();
		$stats['time'] = $time;

		$stmt = $mysql->prepare("SELECT COUNT(*) AS 'count' FROM users WHERE visibility = 1");

		$stats['user_count'] = getCount($mysql, 'users');
		$stats['exam_count'] = getCount($mysql, 'exams');
		$stats['visible_exam_count'] = getCount($mysql, 'exams WHERE visibility = 1');
		$stats['question_count'] = getCount($mysql, 'questions');
		$stats['visible_question_count'] = getCount($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");

		$stats['result_count'] = getCount($mysql, 'results');
		$stats['result_count_today'] = getCount($mysql, 'results WHERE date > ?', [$time - 24*60*60]);
		$stats['result_per_minute'] = getCount($mysql, 'results WHERE date > ?', [$time - 30*60]) / (30.); // Last Half Hour

		$stats['comment_count'] = getCount($mysql, 'comments');
		$stats['tag_count'] = getCount($mysql, 'tags');


		$data['stats'] = $stats;
		return createResponse($response, $data);
	});

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
		$stats['question_category_count'] = getCount($mysql, "questions WHERE category_id > 0");
		$stats['visible_question_count'] = getCount($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");

		$stats['result_count'] = getCount($mysql, 'results');
		$stats['result_count_hour'] = getCount($mysql, 'results WHERE date > ?', [$time - 60*60]);
		$stats['result_count_week'] = getCount($mysql, 'results WHERE date > ?', [$time - 7*24*60*60]);
		$stats['result_count_today'] = getCount($mysql, 'results WHERE date > ?', [$time - 24*60*60]);

		$stats['result_per_minute'] = (getCount($mysql, 'results WHERE date > ?', [$time - 30*60])) / (30.); // Last Half Hour

		$stats['comment_count'] = getCount($mysql, 'comments');
		$stats['tag_count'] = getCount($mysql, 'tags');

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

	$this->get('/activities', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$activities = [];

		if ($query_params['result']) {
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

		if ($query_params['register']) {
    		$stmt = $mysql->prepare(
        		"SELECT 'register' activity, u.*, u.sign_up_date as date
        		FROM users u
        		ORDER BY u.sign_up_date DESC
        		LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if ($query_params['login']) {
    		$stmt = $mysql->prepare(
        		"SELECT 'login' activity, u.*, u.last_sign_in as date
        		FROM users u
        		ORDER BY u.last_sign_in DESC
        		LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if ($query_params['comment']) {
    		$stmt = $mysql->prepare(
        		"SELECT 'comment' activity, c.*, u.username
        		FROM comments c
        		INNER JOIN users u ON u.user_id = c.user_id
        		ORDER BY c.date DESC
        		LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if ($query_params['examNew']) {
    		$stmt = $mysql->prepare(
        		"SELECT 'exam_new' activity, e.*, e.date as year, e.date_added as date, u.username
        		FROM exams e
        		INNER JOIN users u ON u.user_id = e.user_id_added
        		ORDER BY e.date_added DESC
        		LIMIT 100"
            );
			$activities = array_merge( $activities, getAll($stmt) );
		}

		if ($query_params['examUpdate']) {
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
		return createResponse($response, $data);
	});
});

?>