<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
	<head>
		<title>Kontakt | Crucio</title>
		<?php include 'parts/header.php'; ?>

		<script type="text/ng-template" id="myModalContent.html">
	    <div class="modal-header">
	      <h4 class="modal-title" id="myModalLabel">Nachricht abgeschickt.</h4>
	    </div>
	    <div class="modal-body">
	      <p><i class="fa fa-check"></i> Danke für deine Nachricht. Wir kümmern uns so schnell es geht.</p>
	    </div>
	    <div class="modal-footer">
	      <button type="button" class="btn btn-success" ng-click="$close()">Schließen</button>
	    </div>
		</script>
	</head>

	<body class="body-padding" ng-controller="contactCtrl">
		<div ng-include="'parts/navbar.html'"></div>

		<div class="wrap">
			<div class="container container-text container-text-dark container-padding-4">
    		<i class="fa fa-bullhorn fa-5x"></i>
    		<h4>Kontakt</h4>
    		<p>
	    		Bei Angelegenheiten wie z.B. Rechtschreibfehler in Fragen, falschen Antworten, unverständlichen Erklärungen, Klausurwünschen oder Bugs, könnt ihr euch natürlich hier an uns wenden.
    		</p>
			</div>

			<div class="container-light-grey container-padding-2">
				<div class="container form-horizontal">
					<div class="form-group">
						<label class="col-sm-2">Name</label>
						<div class="col-sm-6">
							<input ng-model="name" type="text" class="form-control">
						</div>
						<span class="label validation-error label-danger" ng-show="error_no_name">Kein Name</span>
					</div>

					<div class="form-group">
                        <label class="col-sm-2">E-Mail-Adresse</label>
                        <div class="col-sm-6">
                            <input ng-model="email" type="text" class="form-control">
					    </div>
                        <span class="label validation-error label-danger" ng-show="error_no_email">Keine gültige E-Mail-Adresse</span>
					</div>

					<div ng-if="question_id" class="form-group">
						<label class="col-sm-2">Frage</label>
						<div class="col-sm-6">
							<span ng-bind-html="question.question"></span>
						</div>
					</div>

					<div ng-if="question_id" class="form-group">
						<label class="col-sm-2">Klausur</label>
						<div class="col-sm-6">
							{{ question.subject }}, {{ question.date }}
						</div>
					</div>

					<div ng-if="subject" class="form-group">
						<label class="col-sm-2">Anliegen</label>
						<div class="col-sm-6">
							{{ subject }}
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-2">Bemerkungen</label>
						<div class="col-sm-6">
							<textarea ng-model="text" class="form-control" rows="4"></textarea>
						</div>
						<span class="label validation-error label-danger"></span>
					</div>

					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button class="btn btn-primary" ng-click="send_mail()">
								<i ng-show="is_working" class="fa fa-circle-o-notch fa-spin"></i> Senden
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<?php require_once('parts/footer.html'); ?>
	</body>
</html>