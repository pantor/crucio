<!DOCTYPE html>
<html>
    <head>
        <title>Account Aktivierung | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body">
        <div class="wrap">
            <?php include('parts/container-top-bar.php'); ?>

            <?php
                $param = ["fa" => "fa-user", "h4" => "Account Aktivieren", "p" => ""];
                include('parts/container-title.php');
            ?>

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

        <script>
            $(document).ready(function() {
                var token = $location.search().token;

                if (!token) {
                    var success = false;
                    var errorNoToken = true;
                } else {
                  var data = { token: token };
                  $.put('api/v1/users/activate', $('form').serialize(), function(data) {
                    var success = data.status;
                    var errorNoToken = (data.error === 'error_no_token');
                    var errorUnknown = (data.error === 'error_unknown');
                  });
                }
            });
        </script>
    </body>
</html>
