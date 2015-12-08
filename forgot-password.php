<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
    <head>
        <title>Passwort vergessen | Crucio</title>
        <?php include 'parts/header.php'; ?>
    </head>

    <div class="modal fade" id="forgotSucessModal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">Passwort zur&uuml;cksetzen</h4>
                </div>

                <div class="modal-body">
                    <p><i class="fa fa-check"></i> Wir werden dein Passwort zur&uuml;cksetzen. Schau mal in deinen Mail Account.</p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Zur&uuml;ck</button>
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
                    <p ng-show="ctrl.status == 'success'">
                        <i class="fa fa-check"></i> Wir haben dir ein neues Passwort zugeschickt. Schau mal in deinen Mail Account.
                    </p>

                    <p ng-show="ctrl.status == 'error_token'">
                        <i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist das nicht der richtige Schl&uuml;ssel.
                    </p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Zur&uuml;ck</button>
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
                    <p ng-show="ctrl.status == 'success'">
                        <i class="fa fa-check"></i> Du hast die Anfage abgebrochen. Kein Problem.
                    </p>

                    <p ng-show="ctrl.status == 'error_token'">
                        <i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist das nicht der richtige Schl&uuml;ssel.
                    </p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Zur&uuml;ck</button>
                </div>
            </div>
        </div>
    </div>

    <body class="body" ng-controller="ForgotPasswordController as ctrl">
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
                    <i class="fa fa-question fa-5x"></i>
                    <h4>Passwort vergessen</h4>
                </div>
            </div>

            <div class="container-light-grey container-padding-4">
                <div class="container container-text container-text-dark">
                    <p>
                        Du kannst hier deine E-Mail-Adresse eintragen, wir schicken dir dann ein neues Passwort zu.<br>
                        Bei Fragen kannst du uns gerne schreiben.
                    </p>
                </div>
            </div>

            <div class="container container-register">
                <form class="form-horizontal" ng-submit="ctrl.resetPassword()">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">E-Mail-Adresse</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" ng-model="ctrl.user.email" placeholder=""/>
                        </div>
                        <span ng-show="ctrl.error_email" class="label validation-error label-danger">Keine g&uuml;ltige E-Mail-Adresse</span>
                        <span ng-show="ctrl.error_already_requested" class="label validation-error label-danger">
                            F&uuml;r die E-Mail-Adresse wurde bereits das Passwort zur&uuml;ckgesetzt.
                        </span>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-3 col-sm-offset-3">
                            <button class="btn btn-primary">
                                <i ng-show="ctrl.is_working" class="fa fa-circle-o-notch fa-spin"></i> Zur&uuml;cksetzen
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <?php include 'parts/footer.html'; ?>
    </body>
</html>