<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
	<head>
		<title>Account Aktivierung | Crucio </title>
		<?php include 'parts/header.php'; ?>
	</head>

	<body class="body" ng-controller="activateCtrl">
		<div class="wrap">
			<div class="container-white container-top-bar">
	    		<div class="container">
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
				<div class="container container-text- container-text-light">
	    			<i class="fa fa-user fa-5x"></i>
	    			<h3>Account Aktivieren</h3>
	    		</div>
			</div>

			<div class="container">
			    <div class="row">
			    	<div class="col-sm-10 col-sm-offset-1">
			    		<div ng-if="error_no_token || error_unknown" class="container-center-align-sm" style="padding: 60px;">
						    <h3>Fehler bei der Aktivierung.</h3>

						    <hr>

						    <div ng-if="error_no_token" class="alert alert-danger">
						    	Der Schlüssel konnte deinen Account nicht aktivieren. Wir haben einfach keinen Schlüssel gefunden.
						    </div>

						    <div ng-if="error_unknown" class="alert alert-danger">
						    	Der Schlüssel konnte deinen Account nicht aktivieren. <br> Entweder passt der Schlüssel nicht oder dein Account ist bereits aktiviert.
						    </div>
						</div>

						<div ng-if="success" class="container-center-align-sm" style="padding: 60px;">
						    <div class="alert alert-success">
						    	Dein Account ist aktiviert und deine E-Mail-Adresse bestätigt. Willkommen bei Crucio!
						    </div>

						    <a class="btn btn-success" target="_self" href="/">Zur Anmeldung</a>
						</div>
			    	</div>
			    </div>
			</div>
		</div>

	    <?php include 'parts/footer.html'; ?>
	</body>
</html>