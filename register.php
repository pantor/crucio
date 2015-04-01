<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
	<head>
		<title>Registrieren | Crucio </title>
		<?php include 'parts/header.php'; ?>
	</head>

	<body class="body" ng-controller="registerCtrl">
		<div class="modal fade" id="registerSucessModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
		    	<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" id="myModalLabel">Registrierung</h4>
					</div>

					<div class="modal-body">
						<p><i class="fa fa-check"></i> Du hast dich erfolgreich registriert. Schau mal in deinen Mail Account.</p>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Zurück</button>
					</div>
				</div>
			</div>
		</div>

		<div class="wrap">
			<div class="container-white">
    			<div class="container container-top-bar">
	    			<div class="row">
			    		<div class="col-md-7 col-md-offset-1 col-sm-5 col-sm-offset-1">
							<h1><a href="/" target="_self"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-xs-6 col-md-2 col-sm-3">
				    		<a class="btn btn-block btn-index-top" href="/" target="_self">
					        	<i class="fa fa-sign-in fa-fw hidden-xs"></i> Anmelden
							</a>
			    		</div>

			    		<div class="col-xs-6 col-md-2 col-sm-3">
				    		<a class="btn btn-block btn-index-top" href="/register" target="_self">
					        	<i class="fa fa-pencil-square-o fa-fw hidden-xs"></i> Registrieren
							</a>
			    		</div>
	    			</div>
    			</div>
    		</div>

			<div class="top-bottom-padding container-back-image" style="margin-top:2px;">
				<div class="container container-center-text-light">
    				<i class="fa fa-pencil-square-o fa-5x"></i>
    				<h3>Registrieren</h3>
    			</div>
			</div>

			<div class="container container-register">
				<div class="form-horizontal">
			        <div class="form-group">
			            <label class="col-sm-3 control-label">Name</label>
			            <div class="col-sm-4">
			        		<input class="form-control span5" ng-model="username" type="text" placeholder="Vorname Nachname"/>
			            </div>
			            <span class="label validation-error label-danger" ng-show="error_no_name">Kein Name</span>
			            <span class="label validation-error label-danger" ng-show="error_duplicate_name">Name wird bereits verwendet</span>
			        </div>

			        <div class="form-group">
			            <label class="col-sm-3 control-label">E-Mail</label>
			            <div class="col-sm-4">
			        		<input class="form-control span5" ng-model="email" type="text" placeholder="________@studserv.uni-leipzig.de"/>
			            </div>
			            <span class="label label-danger validation-error" ng-show="error_no_email">Keine gültige E-Mail-Adresse</span>
			            <span class="label label-danger validation-error" ng-show="error_duplicate_email">E-Mail-Adresse wird bereits verwendet</span>
			        </div>

			        <hr>

			        <div class="form-group">
			            <label class="col-sm-3 control-label">Studienfach</label>
			            <div class="col-sm-3">
			            	<div class="btn-group">
				            	<label class="btn btn-default" ng-model="course" btn-radio="1">Humanmedizin</label>
							</div>
			            </div>
			        </div>

			        <div class="form-group">
			            <label class="col-sm-3 control-label">Fachsemester</label>
			            <div class="col-sm-2">
			            	<input class="form-control" ng-model="semester" type="number">
			            </div>
			            <span class="label validation-error label-danger" id="semester-validation-error"></span>
			        </div>

			        <hr>

			        <div class="form-group">
			            <label class="col-sm-3 control-label">Passwort</label>
			            <div class="col-sm-4">
			        		<input class="form-control span5" ng-model="password" type="password"/>
			            </div>
			            <span class="label validation-error label-danger" ng-show="error_no_password">Kein gültiges Passwort</span>
			        </div>

			        <div class="form-group">
			            <label class="col-sm-3 control-label">Passwort bestätigen</label>
			            <div class="col-sm-4">
			        		<input class="form-control span5" ng-model="passwordc" type="password"/>
			            </div>
			            <span ng-show="password != passwordc || error_passwordc" class="label validation-error label-danger" id="passwordc-validation-error">Passwort nicht gleich</span>
			        </div>
				</div>
			</div>

			<div class="top-bottom-padding container-light-grey">
			<div class="container container-center-text-dark">
    			<i class="fa fa-legal fa-5x"></i>
    			<h3>Warte! Was ist mit den AGB?</h3>
    			<p>
	    			Na, heute sind wir mal nicht so. Einfach nett zueinander sein und nichts böses machen. Ihr seid selbst für Fragen und Klausuren verantwortlich, die ihr hochladet. Und es wär cool, wenn wir deine Antworten dazu verwenden könnten besonders schwierige Fragen herauszufinden. Die können wir dir dann gesondert vorschlagen, so wird das Lernen noch effektiver. Falls du diese Auswertung deiner Daten nicht willst, kannst du sie unter deinen Einstellungen abschalten.
    			</p>

				<button class="btn btn-success btn-lg center-block" ng-click="register()"><i ng-show="is_working" class="fa fa-circle-o-notch fa-spin" style="color:#fff;"></i> Registrieren</button>
    		</div>
		</div>
		</div>

		<?php include 'parts/footer.html'; ?>
	</body>
</html>