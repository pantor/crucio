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
    	      <p><i class="fa fa-check"></i> Danke für deine Nachricht. Wir k&uuml;mmern uns so schnell es geht.</p>
    	    </div>
    	    <div class="modal-footer">
    	      <button type="button" class="btn btn-success" ng-click="$close()">Schließen</button>
    	    </div>
		</script>
	</head>

	<body class="body" ng-controller="ContactController as ctrl">
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

	    	<div class="container-back-image container-padding-4">
				<div class="container container-text container-text-light">
	    			<i class="fa fa-bullhorn fa-5x"></i>
	    			<h4>Kontakt</h4>
	    		</div>
			</div>

			<div class="container-light-grey container-padding-4">
				<div class="container container-text container-text-dark">
	    			<p style="margin-top: 0;">
		    			Bei Angelegenheiten wie z.B. Problemen bei der Registrierung, einer anderen E-Mail-Adresse oder weiteren Klausuren k&ouml;nnt ihr euch hier an uns wenden.
	    			</p>
	    		</div>
			</div>

			<div class="container container-register">
				<div class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2">Name</label>
						<div class="col-sm-6">
							<input ng-model="ctrl.name" type="text" class="form-control">
						</div>
						<span class="label validation-error label-danger" ng-show="ctrl.error_no_name">Kein Name</span>
					</div>

					<div class="form-group">
                        <label class="col-sm-2">E-Mail-Adresse</label>
                        <div class="col-sm-6">
                            <input ng-model="ctrl.email" type="text" class="form-control">
					    </div>
                        <span class="label validation-error label-danger" ng-show="ctrl.error_no_email">Keine g&uuml;ltige E-Mail-Adresse</span>
					</div>

					<div class="form-group">
						<label class="col-sm-2">Nachricht</label>
						<div class="col-sm-6">
							<textarea ng-model="ctrl.text" class="form-control" rows="4"></textarea>
						</div>
						<span class="label validation-error label-danger"></span>
					</div>

					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button class="btn btn-primary" ng-click="ctrl.send_mail()">
								<i ng-show="ctrl.is_working" class="fa fa-circle-o-notch fa-spin"></i>
								<span ng-show="!ctrl.email_send">Senden</span>
								<span ng-show="ctrl.email_send">Gesendet</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<?php require_once('parts/footer.php'); ?>
	</body>
</html>