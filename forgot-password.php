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
                $param = ["fa" => "fa-unlock", "h4" => "Passwort vergessen"];
                include('parts/container-title.php');
            ?>

            <div class="container-light-grey container-padding-2">
                <div class="container container-text container-text-dark">
                    <p>Du kannst hier deine E-Mail-Adresse eintragen, wir schicken dir dann ein neues Passwort zu.</p>
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
                            <button class="btn btn-primary" type="submit" id="submitbutton" data-loading-text="Zur&uuml;cksetzen...">
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

                        if (data.error === 'error_email') {
                            validator.showErrors({"email": "Wir konnten deine E-Mail-Adresse nicht finden."});

                        } else if (data.error === 'error_already_requested') {
                            validator.showErrors({"email": "F&uuml;r die E-Mail-Adresse wurde bereits das Passwort zur&uuml;ckgesetzt."});
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
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Passwort zur&uuml;cksetzen</h4>
                    </div>

                    <div class="modal-body">
                        <p><i class="fa fa-check"></i> Wir werden dir einen Link schicken, auf dem du ein neues Passwort eingeben kannst. Schau mal in deinen Mail Account.</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
