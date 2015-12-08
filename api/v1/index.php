<?php

require '../../vendor/autoload.php';

require 'helper.php';


$app = new \Slim\App();

$host_name = $_SERVER['HTTP_HOST'];
$protocol = strtolower(substr($_SERVER['SERVER_PROTOCOL'], 0, 5)) == 'https://' ? 'https://' : 'http://';
$website_url = $protocol.$host_name.'/';


require 'api.admin.php';
require 'api.comments.php';
require 'api.contact.php';
require 'api.exams.php';
require 'api.file.php';
require 'api.learn.php';
require 'api.pdf.php';
require 'api.questions.php';
require 'api.results.php';
require 'api.stats.php';
require 'api.tags.php';
require 'api.users.php';
require 'api.whitelist.php';

$app->run();

?>