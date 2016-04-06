<!DOCTYPE html>
<html>
    <head>
        <title>Passwort vergessen | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body" ng-controller="ForgotPasswordController as ctrl">
        <div class="wrap">
            <?php include('parts/container-top-bar.php'); ?>

            <?php
                $param = ["fa" => "fa-unlock", "h4" => "Passwort vergessen", "p" => ""];
                include('parts/container-title.php');
            ?>

            <div class="container-light-grey container-padding-2">
                <div class="container container-text container-text-dark">
                    <p>Du kannst hier deine E-Mail-Adresse eintragen, wir schicken dir dann ein neues Passwort zu.<br>
                        Bei Fragen kannst du uns gerne schreiben.</p>
                </div>
            </div>

            <div class="container container-register">
                <form class="form-horizontal" name="form">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">E-Mail-Adresse</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="email" type="email" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-3 col-sm-offset-3">
                            <button class="btn btn-primary" type="submit" id="submitbutton">
                                Zur&uuml;cksetzen
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>
        <?php include('parts/scripts.php'); ?>

        <script>
            $(document).ready(function() {
                var confirm = $location.search().confirm;
                var deny = $location.search().deny;

                if (confirm) {
                    $.post('api/v1/users/password/confirm', { token: confirm }, function(data) {
                        var status = data.status;
                        this.$uibModal.open({
                          templateUrl: 'forgotConfirmModalContent.html',
                          controller: 'ModalInstanceController',
                          controllerAs: 'ctrl',
                          resolve: {
                            data: () => {
                              return status;
                            },
                          },
                        });
                    });
                }

                if (deny) {
                    $.post('api/v1/users/password/deny', { token: deny }, function(data) {
                        var status = data.status;
                        this.$uibModal.open({
                          templateUrl: 'forgotDenyModalContent.html',
                          controller: 'ModalInstanceController',
                          controllerAs: 'ctrl',
                          resolve: {
                            data: () => {
                              return status;
                            },
                          },
                        });
                    });
                }
            });

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
                    $.post('api/v1/users/password/reset', $('form').serialize(), function(data) {
                        if (data.status) {
                            $('#successModal').modal();
                        }

                        if (data.error === 'error_already_requested') {
                            validator.showErrors({"username": "F&uuml;r die E-Mail-Adresse wurde bereits das Passwort zur&uuml;ckgesetzt."});
                        }

                        $('#submitbutton').button('reset');
                    });
                    return false;
                },
                messages: {
                    email: {
                        required: "Keine E-Mail-Adresse",
                        email: "Keine g&uuml;tige E-Mail-Adresse"
                    }
                }
            });
        </script>

        <!-- Modals -->
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Passwort zur&uuml;cksetzen</h4>
                    </div>

                    <div class="modal-body">
                        <p><i class="fa fa-check"></i> Wir werden dein Passwort zur&uuml;cksetzen. Schau mal in deinen Mail Account.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Neues Passwort</h4>
                    </div>

                    <div class="modal-body">
                        <p ng-show="ctrl.data == 'success'">
                            <i class="fa fa-check"></i> Wir haben dir ein neues Passwort zugeschickt. Schau mal in deinen Mail Account.
                        </p>

                        <p ng-show="ctrl.data == 'error_token'">
                            <i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist das nicht der richtige Schl&uuml;ssel.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="denyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Doch kein neues Passwort...</h4>
                    </div>

                    <div class="modal-body">
                        <p ng-show="ctrl.data == 'success'">
                            <i class="fa fa-check"></i> Du hast die Anfage abgebrochen. Kein Problem.
                        </p>

                        <p ng-show="ctrl.data == 'error_token'">
                            <i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist das nicht der richtige Schl&uuml;ssel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
