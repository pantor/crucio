<?php

require_once('../api/config.php');

$name = basename($_FILES['file']['name']);
$tmp_dir = $_FILES['file']['tmp_name'];
$upload_base = '../files/';
$upload_name = ''.(microtime(true) * 10000).'';

$file_type = '';
if ($_FILES['file']['type'] == 'image/png') {
    $file_type = 'png';
} else if ($_FILES['file']['type'] == 'image/jpg') {
    $file_type = 'jpg';
} else if ($_FILES['file']['type'] == 'image/gif') {
    $file_type = 'gif';
} else if ($_FILES['file']['type'] == 'application/pdf') {
    $file_type = 'pdf';
}

$upload_name = $upload_name.'.'.$file_type;
$upload_dir = $upload_base.$upload_name;
$response['upload_name'] = $upload_name;


$error = !move_uploaded_file($tmp_dir, $upload_dir);

$response['status'] = 'success';
if ($error) {
	$response['status'] = 'error';
}

header('Content-type: application/json');
echo json_encode($response);

?>