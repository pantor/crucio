<!DOCTYPE html>
<html ng-app="crucioApp2">
	<head>
		<title>Stats | Crucio </title>
		<?php include '../parts/header.php'; ?>

		<script>
			var crucioApp2 = angular.module('crucioApp2', ['ui.bootstrap', 'angles']);
			crucioApp2.controller('StatsController', function($scope, $http, $interval) {
				$scope.update_activity = false;
				$scope.show_activity = {search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true};

				var first = true;

				var reloadData = function() {
					$http.get('api/v1/stats/general').success(function(data) {
						$scope.stats = data.stats;

						if (first) {
							$scope.chart_users = [{value: parseInt($scope.stats.user_count_semester[0]), color: "#e74c3c", label: "1. Semester"},
								{value: parseInt($scope.stats.user_count_semester[1]), color: "#e67e22", label: "2. Semester"},
								{value: parseInt($scope.stats.user_count_semester[2]), color: "#f1c40f", label: "3. Semester"},
								{value: parseInt($scope.stats.user_count_semester[3]), color: "#2ecc71", label: "4. Semester"},
								{value: parseInt($scope.stats.user_count_semester[4]), color: "#1abc9c", label: "5. Semester"},
								{value: parseInt($scope.stats.user_count_semester[5]), color: "#3498db", label: "6. Semester"},
								{value: parseInt($scope.stats.user_count_semester[6]), color: "#34495e", label: ">6. Semester"}];

							$scope.chart_exams = [{value: parseInt($scope.stats.exam_count_semester[0]), color: "#e74c3c", label: "1. Semester"},
								{value: parseInt($scope.stats.exam_count_semester[1]), color: "#e67e22", label: "2. Semester"},
								{value: parseInt($scope.stats.exam_count_semester[2]), color: "#f1c40f", label: "3. Semester"},
								{value: parseInt($scope.stats.exam_count_semester[3]), color: "#2ecc71", label: "4. Semester"},
								{value: parseInt($scope.stats.exam_count_semester[4]), color: "#1abc9c", label: "5. Semester"},
								{value: parseInt($scope.stats.exam_count_semester[5]), color: "#3498db", label: "6. Semester"},
								{value: parseInt($scope.stats.exam_count_semester[6]), color: "#34495e", label: ">6. Semester"}];

							$scope.chart_questions = {
							    labels: ["Gesamt", "Sichtbar", "Mit Lösung", "Mit Erklärung", "Mit Kategorie", "Freie Frage"],
							    datasets: [{
							        data: [$scope.stats.question_count, $scope.stats.visible_question_count, $scope.stats.question_count-$scope.stats.question_without_answer_count, $scope.stats.question_explanation_count, $scope.stats.question_topic_count, $scope.stats.question_free_count]
							    }]
							};

							$scope.chart_time_result_today = {
								labels: $scope.stats.result_dep_time_today_label,
								datasets: [
								    {
								        label: "My Second dataset",
								        fillColor: "rgba(151,187,205,0.2)",
								        strokeColor: "rgba(151,187,205,1)",
								        pointColor: "rgba(151,187,205,1)",
								        pointStrokeColor: "#fff",
								        pointHighlightFill: "#fff",
								        pointHighlightStroke: "rgba(151,187,205,1)",
								        data: $scope.stats.result_dep_time_today
								    }
								]
							};

							first = false;
						}
					});
					$http.get('api/v1/stats/search-queries').success(function(data) {
					   $scope.search_queries = data.search_queries;
					});

					$http.post('api/v1/stats/activities', $scope.show_activity).success(function(data) {
					   $scope.activities = data.activities;
					   console.log(data.activities);
					});
				};
				
				reloadData();
				var timerData = $interval(function () {
					if ($scope.update_activity)
				    	reloadData();
				}, 2400);
			})

			.directive('timeago', function() {
				var strings = {
					prefixAgo: "vor",
					prefixFromNow: "in",
					suffixAgo: "",
					suffixFromNow: "",
					seconds: "wenigen Sekunden",
					seconds_2: "einigen Sekunden",
					minute_2: "unter einer Minute",
					minute: "etwa einer Minute",
					minute_3: "über einer Minute",
					minutes: "%d Minuten",
					hour: "etwa einer Stunde",
					hours: "%d Stunden",
					day: "etwa einem Tag",
					days: "%d Tagen",
					month: "etwa einem Monat",
					months: "%d Monaten",
					year: "etwa einem Jahr",
					years: "%d Jahren",
					wordSeparator: " ",
					numbers: []
				};

				return {
			    	restrict:'A',
					link: function(scope, element, attrs){
						attrs.$observe("timeago", function(){
							var given = parseInt(attrs.timeago);
							var current = new Date().getTime();

							var distance_millis = Math.abs(current - given);
							var seconds = distance_millis / 1000;
							var minutes = seconds / 60;
							var hours = minutes / 60;
							var days = hours / 24;
							var years = days / 365;

							var prefix = strings.prefixAgo;
							var suffix = strings.suffixAgo;

							function is_function(functionToCheck) {
								var getType = {};
								return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
							}

							function substitute(stringOrFunction, number) {
								var string = is_function(stringOrFunction) ? stringOrFunction(number, distance_millis) : stringOrFunction;
								var value = (strings.numbers && strings.numbers[number]) || number;
								return string.replace(/%d/i, value);
							}

							var words = seconds < 10 && substitute(strings.seconds, Math.round(seconds)) ||
							  seconds < 30 && substitute(strings.seconds_2, Math.round(seconds)) ||
							  seconds < 50 && substitute(strings.minute_2, 1) ||
							  seconds < 70 && substitute(strings.minute, 1) ||
							  seconds < 90 && substitute(strings.minute_3, 1) ||
							  minutes < 55 && substitute(strings.minutes, Math.round(minutes)) ||
							  minutes < 90 && substitute(strings.hour, 1) ||
							  hours < 24 && substitute(strings.hours, Math.round(hours)) ||
							  hours < 42 && substitute(strings.day, 1) ||
							  days < 30 && substitute(strings.days, Math.round(days)) ||
							  days < 45 && substitute(strings.month, 1) ||
							  days < 365 && substitute(strings.months, Math.round(days / 30)) ||
							  years < 1.5 && substitute(strings.year, 1) ||
							  substitute(strings.years, Math.round(years));

							var separator = strings.wordSeparator;

							String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
							var result = [prefix, words, suffix].join(separator).trim();
							element.text(result);
						});
					}
				};
			});
		</script>
	</head>

	<body class="body">

		<div class="wrap">
			<div class="container-white">
    			<div class="container container-top-bar">
	    			<div class="row">
			    		<div class="col-md-9 col-md-offset-1 col-sm-7 col-sm-offset-1">
							<h1><a href="/" target="_self"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-xs-6 col-md-2 col-sm-3">
				    		<a class="btn btn-block btn-index-top" href="admin">
					        	<i class="fa fa-sign-in fa-fw hidden-xs"></i> Admin
							</a>
			    		</div>
	    			</div>
    			</div>
    		</div>

			<div class="top-bottom-padding container-back-image" style="margin-top:2px;">
				<div class="container container-center-text-light">
    				<i class="fa fa-bar-chart fa-5x"></i>
    				<h3>Live Statistik</h3>
    			</div>
			</div>

			<div class="container" ng-controller="StatsController">
				<div class="row mtop-navbar-row">
				    <div class="col-md-3 sidebar">
				    	<ul class="nav nav-pills nav-stacked mbottom-2x">
							<li class="active"><a showtab="" data-target="#stats" data-toggle="tab"><i class="fa fa-bar-chart fa-fw"></i>  Übersicht</a></li>
							<hr>
							<li><a showtab="" data-target="#users" data-toggle="tab"><i class="fa fa-users fa-fw"></i>  Nutzer</a></li>
							<li><a showtab="" data-target="#questions" data-toggle="tab"><i class="fa fa-question-circle fa-fw"></i>  Fragen</a></li>
							<li><a showtab="" data-target="#results" data-toggle="tab"><i class="fa fa-exclamation-triangle fa-fw"></i>  Antworten</a></li>
							<li><a showtab="" data-target="#activity" data-toggle="tab"><i class="fa fa-bicycle fa-fw"></i>  Aktivität</a></li>
							<li><a showtab="" data-target="#queries" data-toggle="tab"><i class="fa fa-search fa-fw"></i>  Suchanfragen</a></li>
						</ul>
						<hr class="visible-xs visible-sm">
				    </div>

				    <div class="col-md-9">
				    	<div class="tab-content">
				    		<div class="tab-pane active" id="stats">
					    		<h4>Antworten</h4>
								<div class="row">
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.result_count }}</h5>
											<p><i class="fa fa-exclamation-triangle fa-fw"></i> Insgesamt | {{ stats.result_count / stats.user_count | number:0  }} pro Nutzer</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.result_count_today }}</h5>
											<p><i class="fa fa-exclamation-triangle fa-fw"></i> 24 Stunden</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.result_per_minute | number : 2 }}</h5>
											<p><i class="fa fa-exclamation-triangle fa-fw"></i> pro Minute</p>
										</div>
									</div>
								</div>

								<hr>

								<h4>Nutzer</h4>
								<div class="row">
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.user_count }}</h5>
											<p><i class="fa fa-users fa-fw"></i> Insgesamt</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.user_count_login_today }}</h5>
											<p><i class="fa fa-users fa-fw"></i> Angemeldet 24 Stunden</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.user_count_register_today }}</h5>
											<p><i class="fa fa-users fa-fw"></i> Registriert 24 Stunden</p>
										</div>
									</div>
								</div>

								<hr>

								<div class="row">
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.question_count }}</h5>
											<p> <i class="fa fa-question-circle fa-fw"></i> Fragen | {{ stats.visible_question_count }} sichtbar</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.exam_count }}</h5>
											<p> <i class="fa fa-list fa-fw"></i> Klausuren | {{ stats.visible_exam_count }} sichtbar</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.comment_count }}</h5>
											<p> <i class="fa fa-comments fa-fw"></i> Kommentare</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.tag_count }}</h5>
											<p> <i class="fa fa-tags fa-fw"></i> Markierungen</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.search_count }}</h5>
											<p> <i class="fa fa-search fa-fw"></i> Suchanfragen</p>
										</div>
									</div>
								</div>

								<br><br><br>
							</div>

				    		<div class="tab-pane" id="users">
								<div class="row">
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.user_count }}</h5>
											<p><i class="fa fa-users fa-fw"></i> Insgesamt</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.user_count_login_today }}</h5>
											<p><i class="fa fa-users fa-fw"></i> Angemeldet 24 Stunden</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.user_count_register_today }}</h5>
											<p><i class="fa fa-users fa-fw"></i> Registriert 24 Stunden</p>
										</div>
									</div>
								</div>

								<hr>

								<h4>Semester</h4>
								<div class="row">
									<div class="col-xs-6 col-sm-4">
										<center>
											<canvas doughnutchart data="::chart_users" width="200" height="200"></canvas>
											<p>Nutzer</p>
										</center>
									</div>

									<div class="col-xs-12 col-sm-4">
										<div style="line-height: 24px; margin-top: 20px;">
											<div class="dot pull-left" style="background-color: #e74c3c; margin-top:3px; margin-right: 14px;"></div> 1. Semester<br>
											<div class="dot pull-left" style="background-color: #e67e22; margin-top:3px; margin-right: 14px;"></div> 2. Semester<br>
											<div class="dot pull-left" style="background-color: #f1c40f; margin-top:3px; margin-right: 14px;"></div> 3. Semester<br>
											<div class="dot pull-left" style="background-color: #2ecc71; margin-top:3px; margin-right: 14px;"></div> 4. Semester<br>
											<div class="dot pull-left" style="background-color: #1abc9c; margin-top:3px; margin-right: 14px;"></div> 5. Semester<br>
											<div class="dot pull-left" style="background-color: #3498db; margin-top:3px; margin-right: 14px;"></div> 6. Semester<br>
											<div class="dot pull-left" style="background-color: #34495e; margin-top:3px; margin-right: 14px;"></div> >6. Semester<br>
										</div>
									</div>
								</div>

								<center>
									<h5>Nutzer</h5>
									<canvas linechart data="::chart_time_user" width="600" height="300"></canvas>
								</center>

								<br><br><br>
							</div>

				    		<div class="tab-pane" id="questions">
					    		<div class="row">
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.question_count }}</h5>
											<p> <i class="fa fa-question-circle fa-fw"></i> {{ stats.visible_question_count }} sichtbar</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.question_worked_count }}</h5>
											<p> <i class="fa fa-question-circle fa-fw"></i> Insgesamt Gelöst</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.question_worked_count_today }}</h5>
											<p> <i class="fa fa-question-circle fa-fw"></i> 24 Stunden Gelöst</p>
										</div>
									</div>

								</div>

								<hr>

								<div class="row mbottom-2x">
									<center>
										<canvas barchart data="::chart_questions" width="600" height="400"></canvas>
									</center>
								</div>
							</div>

				    		<div class="tab-pane" id="results">
					    		<h4>Antworten</h4>
								<div class="row">
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.result_count }}</h5>
											<p>
												<i class="fa fa-exclamation-triangle fa-fw"></i>
												Insgesamt | {{ stats.result_count / stats.user_count | number:0  }} pro Nutzer
											</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.result_count_today }}</h5>
											<p><i class="fa fa-exclamation-triangle fa-fw"></i> 24 Stunden</p>
										</div>
									</div>
									<div class="col-xs-12 col-sm-4">
										<div class="stats-box">
											<h5>{{ stats.result_per_minute | number : 2 }}</h5>
											<p><i class="fa fa-exclamation-triangle fa-fw"></i> pro Minute</p>
										</div>
									</div>
								</div>

								<hr>

								<center>
									<canvas linechart data="::chart_time_result_today" width="800" height="400"></canvas>
								</center>
								<h6>Antworten pro Stunde im Verlauf der letzten Stunden</h6>

								<br><br><br>
							</div>

				    		<div class="tab-pane" id="activity">
					    		<h4>Aktivität <small>Aktualisieren braucht immer etwas...</small></h4>
					    		<div class="btn-toolbar">
					    			<div class="btn-group">
									    <label class="btn btn-danger" ng-model="update_activity" btn-checkbox>LIVE</label>
									</div>

					    			<div class="btn-group mbottom-2x">
									    <label class="btn btn-default" ng-model="show_activity.result" ng-disabled="!update_activity" btn-checkbox>Antworten</label>
									    <label class="btn btn-default" ng-model="show_activity.register" ng-disabled="!update_activity" btn-checkbox>Registrierungen</label>
									    <label class="btn btn-default" ng-model="show_activity.login" ng-disabled="!update_activity" btn-checkbox>Anmeldungen</label>
									    <label class="btn btn-default" ng-model="show_activity.search_query" ng-disabled="!update_activity" btn-checkbox>Suchen</label>
									    <label class="btn btn-default" ng-model="show_activity.comment" ng-disabled="!update_activity" btn-checkbox>Kommentare</label>
									    <label class="btn btn-default" ng-model="show_activity.exam_new" ng-disabled="!update_activity" btn-checkbox>Neue...</label>
									    <label class="btn btn-default" ng-model="show_activity.exam_update" ng-disabled="!update_activity" btn-checkbox>Veränderte Klausuren</label>
									</div>
								</div>

								<table class="table">
									<tbody>
										<tr ng-repeat="act in activities">
											<td>
												<span class="text-muted"><i class="fa fa-clock-o fa-fw"></i> <span timeago="{{act.date * 1000}}"></span></span>
											</td>
											<td ng-if="act.activity == 'search_query'">
												<strong>{{ act.username }}</strong> hat nach {{ act.query }} gesucht</td>
											<td ng-if="act.activity == 'result'">
												<strong>{{ act.username }}</strong> hat Frage #{{ act.question_id }}
												<span ng-show="act.correct==0"><strong class="text-danger">falsch</strong></span>
												<span ng-show="act.correct==1"><strong class="text-success">richtig</strong></span>
												beantwortet
											</td>
											<td ng-if="act.activity == 'register'">
												<strong>{{ act.username }}</strong> hat sich registriert
											</td>
											<td ng-if="act.activity == 'login'">
												<strong>{{ act.username }}</strong> hat sich angemeldet
											</td>
											<td ng-if="act.activity == 'comment'">
												<strong>{{ act.username }}</strong> hat einen Kommentar zur Frage #{{ act.question_id }} geschrieben
											</td>
											<td ng-if="act.activity == 'exam_new'">
												<strong>{{ act.username }}</strong> hat Klausur #{{ act.exam_id }} hinzugefügt
											</td>
											<td ng-if="act.activity == 'exam_update'">
												<strong>{{ act.username }}</strong> hat Klausur #{{ act.exam_id }} verändert
											</td>
										</tr>
									</tbody>
								</table>
							</div>

				    		<div class="tab-pane" id="queries">
								<h4>Alle Suchanfragen</h4>
								<table class="table">
									<thead>
										<th><i class="fa fa-user fa-fw"></i> Name</th>
									    <th>Suche</th>
									    <th><i class="fa fa-clock-o fa-fw"></i> Datum</th>
									</thead>

									<tbody>
										<tr ng-repeat="query in search_queries">
											<td>{{ query.username }}</td>
											<td>{{ query.query }}</td>
											<td><span timeago="{{query.date * 1000}}"></td>
										</tr>
									</tbody>
								</table>
							</div>
				    	</div>
				    </div>
				</div>
			</div>
		</div>

		<?php require_once('parts/footer.html'); ?>
	</body>
</html>