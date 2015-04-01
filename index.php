<!DOCTYPE html>
<!-- ID NG-App for Internet Explorer Support -->
<html ng-app="crucioApp" id="ng-app">
	<head>
	    <title>Crucio | Fachschaft Medizin Leipzig</title>
		<?php include 'parts/header.php'; ?>
		
		<!-- Smooth Scrollling-->
		<script>
		$(function() { $('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) { $('html,body').animate({ scrollTop: target.offset().top }, 400); return false; }
			}
		}); });
		</script>
	</head>

	<body class="body">
	    <div class="wrap">
	    	<div class="container-white container-top-bar" ng-controller="loginCtrl" style="margin-bottom: 0px;">
	    		<div class="container">
		    		<form class="row" ng-submit="login()">
			    		<div class="col-md-4 col-md-offset-1">
							<h1><a href="/"><i class="fa fa-check-square-o"></i> Crucio </a></h1>
			    		</div>

			    		<div class="col-md-3">
				    		<div class="form-group element has-feedback {{login_error ? 'has-error' : ''}}">
	        		    	    <input class="form-control" ng-model="email" type="email" placeholder="E-Mail-Adresse" autofocus>
	        		    	    <label class="checkbox">
				        			<input type="checkbox" ng-model="remember_me" ng-true-value="1" ng-false-value="0" style="margin-top:2px;">
				        			Angemeldet bleiben
								</label>
								<div style="height:6px;" class="visible-xs visible-sm"></div>
	        		    	</div>
			    		</div>

			    		<div class="col-md-2">
				    		<div class="form-group element has-feedback {{login_error ? 'has-error' : ''}}">
	        		    	    <input class="form-control" ng-model="password" type="password" placeholder="Passwort">
	        		    	    <i class="fa fa-remove form-control-feedback" ng-show="login_error" style="margin-top:9px;"></i>
	        		    	    <label for="passwordInput">
	        		    	    	<a href="forgot-password" target="_self">Passwort vergessen?</a>
	        		    	    </label>
	        		    	</div>
			    		</div>

			    		<div class="col-md-1">
				    		<button class="btn btn-index-top">
					        	<i class="fa fa-sign-in fa-fw hidden-xs"></i> Anmelden
							</button>
			    		</div>
		    		</form>
	    		</div>
	    	</div>

	    	<div class="top-bottom-padding container-back-image">
	    		<div class="container">
	    			<div class="brand">
					    <h1><i class="fa fa-check-square-o"></i> Crucio<span ng-show="is_dev">Dev</span></h1>
					</div>

					<div class="hidden-xs subtitle-bordered">
						<div class="pull-left">
							<p>
								... hilft dir bei der Vorbereitung für Medizinklausuren an der Universität Leipzig.
								Hier werden Übungsfragen aus dem Studium gesammelt, gekreuzt und erklärt.
								<a class="more-a" href="#more">Mehr Infos</a>
							</p>
						</div>

						<a class="btn btn-index btn-lg pull-right" href="register" target="_self">
				            Registrieren
				        </a>
					</div>

					<div class="visible-xs subtitle">
						<p>
							... hilft dir bei der Vorbereitung für Medizinklausuren an der Universität Leipzig.
							Hier werden Übungsfragen aus dem Studium gesammelt, gekreuzt und erklärt.
							<a class="more-a" href="#more">Mehr Infos</a>
						</p>

						<a class="btn btn-index btn-lg center-block" href="register" target="_self">
				            Registrieren
				        </a>
					</div>

					<div class="visible-xs" style="height:70px;"></div>
				</div>

				<img src="public/images/med_3x.png" class="center-block img-responsive image-med-exam">
	    	</div>

	    	<div class="top-bottom-padding container-light-grey">
				<div class="sturamed">
				    <p>Crucio - Ein Projekt eures</p>
				    <a href="http://www.sturamed-leipzig.de"><img src="public/images/sturamed.svg" width="245px"></a>
				</div>

				<a name="more"></a>
			</div>

	    	<div class="top-bottom-padding">
				<div class="container">
					<div class="row">
					    <div class="col-sm-4 info-block-crucio">
					    	<div class="features-box-1-icon"><i class="fa fa-book"></i></div>
					    	<h2>Lernen</h2>
					    	<p>Mit Crucio kannst du Fragen & Übungsklausuren anschauen, lernen, wiederholen und erklären lassen. Hier sind alle Fragen, die bisher an der Uni Leipzig gesammelt wurden, vereint. Damit sind die Fragen mit dem Studium in Leipzig abgestimmt, sodass du perfekt für die nächsten Klausuren vorbereitet bist.</p>
					    </div>

					    <div class="col-sm-4 info-block-crucio">
					    	<div class="features-box-1-icon"><i class="fa fa-inbox"></i></div>
					    	<h2>Übersicht</h2>
					    	<p>Crucio ist ein zentraler Ort für Fragen und Übungsklausuren an & von der Universität Leipzig. Die Übungsklausuren sind automatisch nach deinem Semester sortiert, du kannst aber natürlich nach Fachbereich oder einzelnen Fragen suchen. So kannst du dir deine Zeit und Nerven für Inhalte aufheben.</p>
					    </div>

					    <div class="col-sm-4 info-block-crucio">
					    	<div class="features-box-1-icon"><i class="fa fa-bar-chart-o"></i></div>
					    	<h2>Statistik</h2>
					    	<p>Mit Crucio kannst du genau analysieren, welche Fragen aus welchem Fachbereich du richtig oder falsch gelöst hast. Oder wo deine Schwachpunkte bei einer bestimmten Klausur sind, damit es beim nächsten Mal umso besser klappt. <br><small>Noch nicht verfügbar.</small></p>
					    </div>
					</div>
				</div>
			</div>

	    	<div class="top-bottom-padding container-light-grey">
				<div class="cite">
					<h3>Heureka, Papier ist [...] sowas von gestern!</h3>
					<i class="fa fa-quote-left pull-left"> <a href="http://de.wikipedia.org/wiki/Epikur">Epikuros von Samos</a></i>
				</div>
			</div>

			<div class="top-bottom-padding">
				<div class="container">
					<div class="row">
					    <div class="col-sm-4 info-block-crucio">
					    	<div class="features-box-1-icon"><i class="fa fa-comments-o"></i></div>
					    	<h2>Austauschen</h2>
					    	<p>Wenn du Schwierigkeiten hast und eine Frage nicht verstehst, kannst du einfach die Kommentarfunktion auf Crucio nutzen. Die Autoren oder freundliche Kommilitonen können dann sicher weiterhelfen...</p>
					    </div>

					    <div class="col-sm-4 info-block-crucio">
					    	<div class="features-box-1-icon"><i class="fa fa-car"></i></div>
					    	<h2>Überall</h2>
					    	<p>Du kannst Klausuren und deren Lösungszettel seperat ausdrucken. Außerdem ist Crucio für Smartphones und Tablets angepasst. So kannst du überall entfallende Antworten nachschauen oder unterwegs weiterlernen. Füge doch Crucio zu deinem Startbildschirm als hinzu!</p>
					    </div>

					    <div class="col-sm-4 info-block-crucio">
					    	<div class="features-box-1-icon"><i class="fa fa-pencil"></i></div>
					    	<h2>Mitmachen</h2>
					    	<p>Crucio lebt von deiner Anteilnahme! Wenn du dich engagieren willst, kannst du Fragen & Klausuren eintragen, Fehler korrigieren oder Erklärungen schreiben. Melde dich einfach digital unter 'Kontakt' oder bei uns in der Fachschaft Medizin.</p>
					    </div>
					</div>
				</div>
			</div>

	    	<div class="top-bottom-padding container-dark-orange">
				<div class="container container-center-text-light">
					<i class="fa fa-magic fa-5x"></i>
					<h3>Noch nicht registriert?</h3>
					<p>
						Auf gehts, Crucio ist seit kurzem freigeschaltet! Wenn du gar nicht in Leipzig studierst, dann kannst du uns gerne mal anschreiben, vielleicht können wir dir helfen...
					</p>
				</div>
			</div>
	    </div>

	    <?php include 'parts/footer.html'; ?>
	</body>
</html>