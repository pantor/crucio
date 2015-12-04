<?php
  
$app->group('/tags', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$user_id = $app->request()->params('user_id');
		$user_id_sql_where = "";
		if ($user_id) {
    		$user_id_sql_where = "AND t.user_id = $user_id ";
		}
		
		$question_id = $app->request()->params('question_id');
		$question_id_sql_where = "";
		if ($question_id) {
    		$question_id_sql_where = "AND t.question_id = $question_id ";
		}
		
		$response = get_all($mysql, 
		    "SELECT DISTINCT t.*, q.question, q.exam_id, e.subject, u.username 
            FROM tags t
            INNER JOIN questions q ON q.question_id = t.question_id 
            INNER JOIN exams e ON e.exam_id = q.exam_id 
            INNER JOIN users u ON u.user_id = t.user_id
            WHERE t.tags != '' "
                .$user_id_sql_where
                .$question_id_sql_where
            ."ORDER BY t.question_id ASC", 
		[], 'tags');
		print_response($app, $response);
	});

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		if ($data->tags == '') {
			$response = execute_mysql($mysql, "DELETE FROM tags WHERE question_id = ? AND user_id = ?", [$data->question_id, $data->user_id]);
		} else {
			$response = execute_mysql($mysql, "INSERT INTO tags (question_id, user_id, tags) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tags = ?", [$data->question_id, $data->user_id, $data->tags, $data->tags]);
        }
		print_response($app, $response);
	});
});

?>