<?php
// error_reporting(E_ALL); ini_set("display_errors", 1);

require dirname(__FILE__).'/../../vendor/autoload.php';

require 'helper.php';

if (getenv('IN_DOCKER')) {
  require dirname(__FILE__).'/../config.docker.php';
} else {
  require dirname(__FILE__).'/../config.php';
}

$app = new \Slim\App([
  'settings' => [
    'displayErrorDetails' => false,
    'debug'               => false,
  ]
]);

$app->add(new \Tuupola\Middleware\JwtAuthentication([
  "path" => ["/"],
  "ignore" => ["/users/login", "/users/register", "/users/activate", "/users/password/token", "/users/password/reset", "/contact/send-mail", "/pdf"],
  "secret" => getenv('secret'),
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