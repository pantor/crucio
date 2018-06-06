<?php

$app->group('/file', function() {

  $this->post('/upload', function($request, $response, $args) {
    $name = basename($_FILES['file']['name']);
    $tmp_dir = $_FILES['file']['tmp_name'];
    $upload_base = '../../files/';
    $upload_name = ''.(microtime(true) * 10000).'';

    $file_type = '';
    if ($_FILES['file']['type'] == 'image/png') {
      $file_type = 'png';
    } else if ($_FILES['file']['type'] == 'image/jpeg') {
      $file_type = 'jpg';
    } else if ($_FILES['file']['type'] == 'image/gif') {
      $file_type = 'gif';
    } else if ($_FILES['file']['type'] == 'application/pdf') {
      $file_type = 'pdf';
    }

    $upload_name = $upload_name.'.'.$file_type;
    $upload_dir = $upload_base.$upload_name;
    $data['upload_name'] = $upload_name;

    $error = !move_uploaded_file($tmp_dir, $upload_dir);
    $data['status'] = 'success';
    $data['filename'] = $upload_name;
    if ($error) {
      $data['status'] = 'error';
    }
    return $response->withJson($data, 200, JSON_NUMERIC_CHECK);
  });

});

?>
