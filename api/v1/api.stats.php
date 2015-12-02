<?php

$app->group('/stats', function () use ($app) {

	$app->get('/general', function() use ($app) {
		$mysql = start_mysql();
		$stats['time'] = time();

		$stats['user_count'] = get_count($mysql, "users");
		$stats['user_count_register_today'] = get_count($mysql, "users WHERE sign_up_date > ?", [time() - 1*24*60*60]);
		$stats['user_count_login_today'] = get_count($mysql, "users WHERE last_sign_in > ?", [time() - 1*24*60*60]);

		$stats['exam_count'] = get_count($mysql, "exams");
		$stats['visible_exam_count'] = get_count($mysql, "exams WHERE visibility = 1");
		$stats['question_count'] = get_count($mysql, "questions");
		$stats['question_explanation_count'] = get_count($mysql, "questions WHERE explanation != ''");
		$stats['question_free_count'] = get_count($mysql, "questions WHERE type = 1");
		$stats['question_without_answer_count'] = get_count($mysql, "questions WHERE correct_answer < 1 AND type > 1");
		$stats['question_topic_count'] = get_count($mysql, "questions WHERE topic != '' AND topic != 'Sonstiges'");
		$stats['visible_question_count'] = get_count($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");
		$stats['question_worked_count'] = get_count_with_pre($mysql, "COUNT(DISTINCT question_id)", "results");
		$stats['question_worked_count_today'] = get_count_with_pre($mysql, "COUNT(DISTINCT question_id)", "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_count'] = get_count($mysql, "results");
		$stats['result_count_hour'] = get_count($mysql, "results WHERE date > ?", [time() - 60*60]);
		$stats['result_count_week'] = get_count($mysql, "results WHERE date > ?", [time() - 7*24*60*60]);
		$stats['result_count_today'] = get_count($mysql, "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_per_minute'] = (get_count($mysql, "results WHERE date > ?", [time() - 30*60])) / (30.); // Last Half Hour

		$stats['comment_count'] = get_count($mysql, "comments");
		$stats['tag_count'] = get_count($mysql, "tags");
		$stats['search_count'] = get_count($mysql, "search_queries");

		$user_count_semester = [];
		$exam_count_semester = [];
		$result_count_semester = [];
		for ($i = 1; $i < 7; $i++) {
			$user_count_semester[] = get_count($mysql, "users WHERE semester = ?", [$i]);
			$exam_count_semester[] = get_count($mysql, "exams WHERE semester = ?", [$i]);
			// $result_count_semester[] = get_count($mysql, "results r, users WHERE semester = ?", [$i]);
		}
		$user_count_semester[] = get_count($mysql, "users WHERE semester > 6");
		$exam_count_semester[] = get_count($mysql, "exams WHERE semester > 6");
		$result_count_semester[] = get_count($mysql, "results WHERE semester > 6");
		$stats['user_count_semester'] = $user_count_semester;
		$stats['exam_count_semester'] = $exam_count_semester;
		// $stats['result_count_semester'] = $result_count_semester;


		/* $result_dep_time = [];
		for ($i = 0; $i < 48; $i++) {
			$result_dep_time[] = get_count($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
		}
		$stats['result_dep_time'] = $result_dep_time; */


		$resolution = 1.5 * 60;
		$days = 2;
		$result_dep_time_today = [];
		for ($i = $days*round(24*60/$resolution); $i>=0; $i--) {
			$result_dep_time_today_label[] = ((time() % (24*60*60) - (time() % (60*60)))/(60*60) - ($resolution/60)*$i + $days*24 + 1) % 24;
			$result_dep_time_today[] = round( 60 * get_count($mysql, "results WHERE date > ? AND date < ?", [time() - ($i+1)*$resolution*60, time() - ($i)*$resolution*60]) / ($resolution) );
		}
		$stats['result_dep_time_today_label'] = $result_dep_time_today_label;
		$stats['result_dep_time_today'] = $result_dep_time_today;


		$response['stats'] = $stats;
		print_response($app, $response);
	});

	$app->get('/search-queries', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT s.*, u.username FROM search_queries s, users u WHERE s.user_id = u.user_id ORDER BY s.date DESC LIMIT 100", [], 'search_queries');
		print_response($app, $response);
	});

	$app->get('/results-dep-time', function() use ($app) {
		$mysql = start_mysql();

		$results_dep_time = [];
		for($i = 0; $i<48; $i++)
			$results_dep_time[] = get_count($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
		$response['results_dep_time'] = $results_dep_time;

		print_response($app, $response);
	});

	$app->post('/activities', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$activities = [];

		if (!$data->search_query) {
			$result = get_all($mysql, "SELECT 'search_query' activity, s.*, u.username FROM search_queries s, users u WHERE s.user_id = u.user_id ORDER BY s.date DESC LIMIT 100", [], 'search_query');
			$activities = array_merge($activities, $result['search_query']);
		}

		if (!$data->result) {
			$result = get_all($mysql, "SELECT 'result' activity, r.*, q.*, u.username FROM results r, users u, questions q WHERE r.user_id = u.user_id AND r.question_id = q.question_id ORDER BY r.date DESC LIMIT 100", [], 'result');
			$activities = array_merge($activities, $result['result']);
		}

		if (!$data->register) {
			$result = get_all($mysql, "SELECT 'register' activity, u.*, u.sign_up_date as date FROM users u ORDER BY u.sign_up_date DESC LIMIT 100", [], 'register');
			$activities = array_merge($activities, $result['register']);
		}

		if (!$data->login) {
			$result = get_all($mysql, "SELECT 'login' activity, u.*, u.last_sign_in as date FROM users u ORDER BY u.last_sign_in DESC LIMIT 100", [], 'login');
			$activities = array_merge($activities, $result['login']);
		}

		if (!$data->comment) {
			$result = get_all($mysql, "SELECT 'comment' activity, c.*, u.username FROM comments c, users u WHERE c.user_id = u.user_id ORDER BY c.date DESC LIMIT 100", [], 'comment');
			$activities = array_merge($activities, $result['comment']);
		}

		if (!$data->exam_new) {
			$result = get_all($mysql, "SELECT 'exam_new' activity, e.*, e.date as year, e.date_added as date, u.username FROM exams e, users u WHERE e.user_id_added = u.user_id ORDER BY e.date_added DESC LIMIT 100", [], 'exam_new');
			$activities = array_merge($activities, $result['exam_new']);
		}

		if (!$data->exam_update) {
			$result = get_all($mysql, "SELECT 'exam_update' activity, e.*, e.date as year, e.date_updated as date, u.username FROM exams e, users u WHERE e.user_id_added = u.user_id ORDER BY e.date_updated DESC LIMIT 100", [], 'exam_update');
			$activities = array_merge($activities, $result['exam_update']);
		}

		usort($activities, function($a, $b) {
		    return $b['date'] - $a['date'];
		});

		$response['activities'] = array_slice($activities, 0, 101);
		print_response($app, $response);
	});
});

?>