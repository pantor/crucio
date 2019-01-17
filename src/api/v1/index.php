<?php

require '../../vendor/autoload.php';

require 'helper.php';

if (isTestServer()) {
  $config = include(dirname(__FILE__).'/../config.vagrant.php');
} else {
  $config = include(dirname(__FILE__).'/../config.php');
}

$app = new \Slim\App();

$app->add(new \Slim\Middleware\JwtAuthentication([
  "secret" => $config['secret'],
]));

require 'api.comments.php';
require 'api.contact.php';
require 'api.exams.php';
require 'api.file.php';
require 'api.oral_exams.php';
require 'api.questions.php';
require 'api.results.php';
require 'api.statistics.php';
require 'api.subjects.php';
require 'api.tags.php';
require 'api.users.php';
require 'api.whitelist.php';
require 'api.pdf.php';
require 'api.collections.php';

$app->run();

?>
