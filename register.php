<!DOCTYPE html>
<html>
    <head>
        <title>Registrieren | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body" ng-controller="RegisterController as ctrl">
        <form class="wrap" name="form">
            <?php include('parts/container-top-bar.php'); ?>

            <?php
                $param = ["fa" => "fa-pencil-square-o", "h4" => "Registrieren"];
                include('parts/container-title.php');
            ?>

            <div class="container container-register">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Name</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="username" type="text" placeholder="Vorname Nachname" minlength="3" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">E-Mail</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="email" type="email" placeholder="________@studserv.uni-leipzig.de" required />
                        </div>
                    </div>

                    <hr>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Studienfach</label>
                        <div class="col-sm-3">
                            <div class="btn-group" data-toggle="buttons">
                                <label class="btn btn-default active">
                                    <input type="radio" name="options" id="option1" checked>Humanmedizin
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Fachsemester</label>
                        <div class="col-sm-2">
                            <input class="form-control" name="semester" type="number" min="1" max="50" value="1" required />
                        </div>
                    </div>

                    <hr>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Passwort</label>
                        <div class="col-sm-4">
                            <input class="form-control" id="password" name="password" type="password" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">Passwort best&auml;tigen</label>
                        <div class="col-sm-4">
                            <input class="form-control" name="passwordc" equalTo="#password" type="password" required />
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

                    <button class="btn btn-success btn-lg btn-green" type="submit" id="submitbutton" data-loading-text="Registrieren...">
                        Registrieren
                    </button>
                 </div>
            </div>
        </form>

        <?php include('parts/footer.php'); ?>

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
                    $.post('api/v1/users', $('form').serialize(), function(data) {
                        if (data.status) {
                            $('#successModal').modal();
                        }

                        if (data.error === 'error_username_taken') {
                            validator.showErrors({"username": "Wird bereits verwendet"});
                        }

                        if (data.error === 'error_email_taken') {
                            validator.showErrors({"email": "Wird bereits verwendet"});
                        }
                        $('#submitbutton').button('reset');
                    });
                },
                messages: {
                    username: {
                        required: "Kein Name",
                        minlength: "Zu kurzer Name"
                    },
                    email: {
                        required: "Keine E-Mail-Adresse",
                        email: "Keine g&uuml;tige E-Mail-Adresse"
                    },
                    text: "Keine Nachricht",
                    semester: "Kein Semester",
                    password: "Kein Passwort",
                    passwordc: "Passw&ouml;rter nicht gleich",
                }
            });
        </script>

        <!-- Modal -->
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Registrierung</h4>
                    </div>

                    <div class="modal-body">
                        <p><i class="fa fa-check"></i> Du hast dich erfolgreich registriert. Schau mal in deinen Mail Account.</p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" ng-click="$close()">Zur&uuml;ck</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
