<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
    <head>
        <title>Registrieren | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body" ng-controller="RegisterController as ctrl">
        <form class="wrap" name="form" ng-submit="ctrl.register()">
            <div class="container-top-bar">
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
                <div class="container container-text container-text-light">
                    <i class="fa fa-pencil-square-o fa-5x"></i>
                    <h4>Registrieren</h4>
                </div>
            </div>

            <div class="container container-register">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Name</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="username" ng-model="ctrl.username" type="text" placeholder="Vorname Nachname" ng-minlength="3" required />
                        </div>
                        <div ng-messages="form.username.$error" ng-show="form.username.$touched" ng-cloak>
                            <span class="label validation-error label-danger" ng-message="required">Kein Name</span>
                            <span class="label validation-error label-danger" ng-message="minlength">Zu kurzer Name</span>
                            <span class="label validation-error label-danger" ng-message="duplicate">Wird bereits verwendet</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">E-Mail</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="email" ng-model="ctrl.email" type="email" placeholder="________@studserv.uni-leipzig.de" ng-change="ctrl.formChanged()" required />
                        </div>
                        <div ng-messages="form.email.$error" ng-show="form.email.$touched" ng-cloak>
                            <span class="label validation-error label-danger" ng-message="required">Keine E-Mail-Adresse</span>
                            <span class="label validation-error label-danger" ng-message="email || studserv">Ung&uuml;ltige E-Mail-Adresse</span>
                            <span class="label validation-error label-danger" ng-message="duplicate">Wird bereits verwendet</span>
                        </div>
                    </div>

                    <hr>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Studienfach</label>
                        <div class="col-sm-3">
                            <div class="btn-group">
                                <label class="btn btn-default" ng-model="ctrl.course" uib-btn-radio="1">Humanmedizin</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Fachsemester</label>
                        <div class="col-sm-2">
                            <input class="form-control" name="semester" ng-model="ctrl.semester" type="number" min="1" max="50" required />
                        </div>
                        <div ng-messages="form.semester.$error" ng-show="form.semester.$touched" ng-cloak>
                            <span class="label validation-error label-danger" ng-message="required || min || max">Kein Semester</span>
                        </div>
                    </div>

                    <hr>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Passwort</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="password" ng-model="ctrl.password" ng-change="ctrl.formChanged()" type="password" required />
                        </div>
                        <div ng-messages="form.password.$error" ng-show="form.password.$touched" ng-cloak>
                            <span class="label validation-error label-danger" ng-message="required">Kein Passwort</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Passwort best&auml;tigen</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="passwordc" ng-model="ctrl.passwordc" ng-change="ctrl.formChanged()" type="password" required />
                        </div>
                        <div ng-messages="form.passwordc.$error" ng-show="form.passwordc.$touched" ng-cloak>
                            <span class="label validation-error label-danger" ng-message="confirm">Passw&ouml;rter nicht gleich</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-light-grey container-padding-4">
                <div class="container container-text container-text-dark">
                    <i class="fa fa-legal fa-5x"></i>
                    <h4>Warte! Was ist mit den AGB?</h4>
                    <p>
                        Na, heute sind wir mal nicht so. Einfach nett zueinander sein und nichts b&ouml;ses machen. Ihr seid selbst f&uuml;r Fragen und Klausuren verantwortlich, die ihr hochladet. Und es w&auml;r cool, wenn wir deine Antworten dazu verwenden k&ouml;nnten besonders schwierige Fragen herauszufinden. Die k&ouml;nnen wir dir dann gesondert vorschlagen, so wird das Lernen noch effektiver. Falls du diese Auswertung deiner Daten nicht willst, kannst du sie unter deinen Einstellungen abschalten.
                    </p>

                    <button class="btn btn-success btn-lg btn-green" type="submit" ng-disabled="form.$invalid">
                        <i ng-show="ctrl.isWorking" class="fa fa-circle-o-notch fa-spin" style="color:white;"></i> Registrieren
                    </button>
                 </div>
            </div>
        </form>

        <?php include('parts/footer.php'); ?>
        <?php include('parts/scripts.php'); ?>

        <script type="text/ng-template" id="registerModalContent.html">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Registrierung</h4>
            </div>

            <div class="modal-body">
                <p><i class="fa fa-check"></i> Du hast dich erfolgreich registriert. Schau mal in deinen Mail Account.</p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" ng-click="$close()">Zur&uuml;ck</button>
            </div>
        </script>
    </body>
</html>