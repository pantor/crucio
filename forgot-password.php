<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
	<head>
		<title>Passwort vergessen | Crucio </title>
		<?php include 'parts/head-inc.html'; ?>
	</head>

	<div class="modal fade" id="forgotSucessModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
	    	<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">Passwort zurücksetzen</h4>
				</div>

				<div class="modal-body">
					<p><i class="fa fa-check"></i> Wir werden dein Passwort zurücksetzen. Schau mal in deinen Mail Account.</p>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Zurück</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="forgotConfirmModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
	    	<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">Neues Passwort</h4>
				</div>

				<div class="modal-body">
					<p ng-show="status == 'success'">
						<i class="fa fa-check"></i> Wir haben dir ein neues Passwort zugeschickt. Schau mal in deinen Mail Account.
					</p>

					<p ng-show="status == 'error_token'">
						<i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist da nicht der richtige Schlüssel.
					</p>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Zurück</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="forgotDenyModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
	    	<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">Doch kein neues Passwort...</h4>
				</div>

				<div class="modal-body">
					<p ng-show="status == 'success'">
						<i class="fa fa-check"></i> Du hast die Anfage abgebrochen. Kein Problem.
					</p>

					<p ng-show="status == 'error_token'">
						<i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist da nicht der richtige Schlüssel.
					</p>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Zurück</button>
				</div>
			</div>
		</div>
	</div>

	<body class="body" ng-controller="forgotPasswordCtrl">
		<div class="wrap">
			<div class="container-white container-top-bar">
	    		<div class="container ">
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

	    	<div class="container-back-image top-bottom-padding">
				<div class="container container-center-text-light">
	    			<i class="fa fa-question fa-5x"></i>
	    			<h3>Passwort vergessen</h3>
	    		</div>
			</div>

			<div class="container-light-grey top-bottom-padding">
				<div class="container container-center-text-dark">
	    			<p>
		    			Du kannst hier deine E-Mail-Adresse eintragen, wir schicken dir dann ein neues Passwort zu.<br>
		    			Bei Fragen kannst du uns gerne schreiben.
	    			</p>
	    		</div>
			</div>

			<div class="container container-register">
				<form class="form-horizontal" ng-submit="reset_password()">
					<div class="form-group">
					    <label class="col-sm-3 control-label">E-Mail-Adresse</label>
				        <div class="col-sm-4">
				      		<input class="form-control" type="text" ng-model="user.email" placeholder=""/>
				        </div>
				        <span ng-show="error_email" class="label validation-error label-danger">Keine gültige E-Mail-Adresse</span>
				        <span ng-show="error_already_requested" class="label validation-error label-danger">
				        	Für die E-Mail-Adresse wurde bereits das Passwort zurückgesetzt.
				        </span>
				    </div>

					<div class="form-group">
					    <div class="col-sm-3 col-sm-offset-3">
					    	<button class="btn btn-primary">
					    		<i ng-show="is_working" class="fa fa-circle-o-notch fa-spin"></i> Zurücksetzen
					    	</button>
					    </div>
					</div>
		    	</form>
			</div>
		</div>

		<?php include 'parts/footer.html'; ?>
	</body>
</html>