<?php
    error_reporting(0);
    require 'api/v1/helper.php';
    $token = $_GET['token'];

    $mysql = init();
    $user = fetchUserDetailsByToken($mysql, $token);

    $errorNoToken = (strlen($token) == 0);
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Passwort vergessen | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body">
        <div class="wrap">
            <?php include('parts/container-top-bar.php'); ?>

            <?php
                $param = ["fa" => "fa-key", "h4" => "Neues Passwort"];
                include('parts/container-title.php');
            ?>

            <div class="container-light-grey container-padding-2">
                <div class="container container-text container-text-dark">
                    <p>Du kannst hier dein neues Passwort eintragen.</p>
                </div>
            </div>

            <div class="container container-register">
                <?php if (!$errorNoToken) { ?>
                <form class="form-horizontal" name="form">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Neues Passwort</label>
                        <div class="col-sm-4">
                            <input class="form-control" id="password" name="password" type="password" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Passwort bestätigen</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="passwordc" type="password" equalTo="#password" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-3 col-sm-offset-3">
                            <button class="btn btn-primary" type="submit" id="submitbutton" data-loading-text="&Auml;ndern...">
                                &Auml;ndern
                            </button>
                        </div>
                    </div>
                </form>
                <?php } ?>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>
        <?php include('parts/scripts.php'); ?>

        <script>
            function getURLParameter(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
            }

            var validator = $('form').validate({
                errorClass: 'label label-danger',
                errorElement: 'span',
                wrapper: 'div',
                highlight: function () {
                    return false;
                },
                unhighlight: function () {
                    return false;
                },
                submitHandler: function() {
                    $('#submitbutton').button('loading');
                    var data = $('form').serialize() + "&token=" + getURLParameter('token');
                    $.post('api/v1/users/password/token', data, function(data) {
                        if (data.status) {
                            $('#successModal').modal();
                        }

                        if (data.error === 'error_token') {
                            validator.showErrors({"password": "Konnte das Passwort nicht zuordnen."});
                        }

                        $('#submitbutton').button('reset');
                    });
                    return false;
                },
                messages: {
                    password: "Kein Passwort",
                    passwordc: "Passw&ouml;rter nicht gleich",
                }
            });
        </script>

        <!-- Modals -->
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Passwort &auml;ndern</h4>
                    </div>

                    <div class="modal-body">
                        <p><i class="fa fa-check"></i> Alles klar, dein Passwort ist ge&auml;ndert.</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
