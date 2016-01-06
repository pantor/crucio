<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
    <head>
        <title>Account Aktivierung | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body" ng-controller="ActivateController as ctrl">
        <div class="wrap">
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
                    <i class="fa fa-user fa-5x"></i>
                    <h4>Account Aktivieren</h4>
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-sm-10 col-sm-offset-1">
                        <div ng-if="ctrl.errorNoToken || ctrl.errorUnknown" class="container-center-align-sm" style="padding: 60px;">
                            <h3>Fehler bei der Aktivierung.</h3>

                            <hr>

                            <div ng-if="ctrl.errorNoToken" class="alert alert-danger">
                                Der Schl&uuml;ssel konnte deinen Account nicht aktivieren. Wir haben einfach keinen Schl&uuml;ssel gefunden.
                            </div>

                            <div ng-if="ctrl.errorUnknown" class="alert alert-danger">
                                Der Schl&uuml;ssel konnte deinen Account nicht aktivieren. <br> Entweder passt der Schl&uuml;ssel nicht oder dein Account ist bereits aktiviert.
                            </div>
                        </div>

                        <div ng-if="ctrl.success" class="container-center-align-sm" style="padding: 60px;">
                            <div class="alert alert-success">
                                Dein Account ist aktiviert und deine E-Mail-Adresse best&auml;tigt. Willkommen bei Crucio!
                            </div>

                            <a class="btn btn-success" target="_self" href="/">Zur Anmeldung</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>
        <?php include('parts/scripts.php'); ?>
    </body>
</html>