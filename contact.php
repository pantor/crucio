<!DOCTYPE html>
<html>
    <head>
        <title>Kontakt | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body">
        <div class="wrap">
            <?php include('parts/container-top-bar.php'); ?>

            <?php
                $param = ["fa" => "fa-bullhorn", "h4" => "Kontakt", "p" => ""];
                include('parts/container-title.php');
            ?>

            <div class="container-light-grey container-padding-2">
                <div class="container container-text container-text-dark">
                    <p>Bei Angelegenheiten wie z.B. Problemen bei der Registrierung, einer anderen E-Mail-Adresse oder weiteren Klausuren k&ouml;nnt ihr euch hier an uns wenden.</p>
                </div>
            </div>

            <div class="container container-register">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2">Name</label>
                        <div class="col-sm-6">
                            <input class="form-control" name="name" type="text" data-msg="Kein Name" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2">E-Mail-Adresse</label>
                        <div class="col-sm-6">
                            <input class="form-control" name="email" type="email" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2">Nachricht</label>
                        <div class="col-sm-6">
                            <textarea class="form-control" name="text" rows="4" required></textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button class="btn btn-primary" type="submit" id="submitbutton" data-loading-text="Senden...">
                                Senden
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>

        <script>
            $('form').validate({
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
                    $.post('api/v1/contact/send-mail', $('form').serialize(), function(data) {
                        if (data.status) {
                            $('#successModal').modal();
                        }
                        $('#submitbutton').button('reset');
                    });
                    return false;
                },
                messages: {
                    name: "Kein Name",
                    email: {
                        required: "Keine E-Mail-Adresse",
                        email: "Keine g&uuml;tige E-Mail-Adresse"
                    },
                    text: "Keine Nachricht",
                }
            });
        </script>

        <!-- Modal -->
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Nachricht gesendet!</h4>
                    </div>
                    <div class="modal-body">
                        <p><i class="fa fa-check"></i> Danke f&uuml;r deine Nachricht. Wir k&uuml;mmern uns so schnell es geht...</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
