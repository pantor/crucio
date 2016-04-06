<!DOCTYPE html>
<?php
    if(isset($_COOKIE["CrucioUser"])) {
        header("Location: /learn");
        exit;
    }
?>

<html>
    <head>
        <title>Crucio | Fachschaft Medizin Leipzig</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body">
        <div class="wrap">
            <div class="container-top-bar" style="margin-bottom: 0;">
                <div class="container">
                    <form class="row">
                        <div class="col-md-4 col-md-offset-1">
                            <h1><a href="/"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group element has-feedback" ng-class="{'has-error': ctrl.loginError}">
                                <input class="form-control" name="email" type="email" placeholder="E-Mail-Adresse" autofocus>
                                <label class="checkbox">
                                    <input type="checkbox" name="remember_me" style="margin-top: 2px;" checked>
                                    Angemeldet bleiben
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <div class="form-group element has-feedback" ng-class="{'has-error': ctrl.loginError}">
                                <input class="form-control" name="password" type="password" placeholder="Passwort">
                                <label for="passwordInput">
                                    <a href="forgot-password" target="_self">Passwort vergessen?</a>
                                </label>
                            </div>
                        </div>

                        <div class="col-md-1">
                            <button class="btn btn-index-top" type="submit">
                                <i class="fa fa-sign-in fa-fw hidden-xs"></i> Anmelden
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="container-back-image container-padding-6">
                <div class="container">
                    <div class="brand">
                        <h1><i class="fa fa-check-square-o"></i> Crucio</h1>

                        <p>
                            ... hilft dir bei der Vorbereitung f&uuml;r Medizinklausuren an der Universit&auml;t Leipzig.
                            Hier werden &Uuml;bungsfragen aus dem Studium gesammelt, gekreuzt und erkl&auml;rt.
                        </p>

                        <a class="btn btn-lg" href="register" target="_self">Registrieren</a>
                        <a class="btn btn-lg" id="moreButton">Mehr Infos</a>
                    </div>
                </div>

                <img src="public/images/med_notepad.png" class="center-block img-responsive image-med-exam" alt="Klausuren lernen">
            </div>

            <div class="container-light-grey container-padding-2">
                <div class="sturamed">
                    <p>Crucio - Ein Projekt eures</p>
                    <a href="http://www.sturamed-leipzig.de">
                        <img src="public/images/sturamed.svg" width="245px" alt="Sturamed Leipzig">
                    </a>
                </div>
            </div>

            <div class="container container-padding-6">
                <div class="row">
                    <div class="col-sm-4 info-block-crucio">
                        <i class="fa fa-book"></i>
                        <h2>Lernen</h2>
                        <p>Mit Crucio kannst du Fragen & &Uuml;bungsklausuren anschauen, lernen, wiederholen und erkl&auml;ren lassen. Hier sind alle Fragen, die bisher an der Uni Leipzig gesammelt wurden, vereint. Damit sind die Fragen mit dem Studium in Leipzig abgestimmt, sodass du perfekt f&uuml;r die n&auml;chsten Klausuren vorbereitet bist.</p>
                    </div>

                    <div class="col-sm-4 info-block-crucio">
                        <i class="fa fa-inbox"></i>
                        <h2>&Uuml;bersicht</h2>
                        <p>Crucio ist ein zentraler Ort f&uuml;r Fragen und &Uuml;bungsklausuren an & von der Universit&auml;t Leipzig. Die &Uuml;bungsklausuren sind automatisch nach deinem Semester sortiert, du kannst aber nat&uuml;rlich nach Fachbereich oder einzelnen Fragen suchen. So kannst du dir deine Zeit und Nerven f&uuml;r Inhalte aufheben.</p>
                    </div>

                    <div class="col-sm-4 info-block-crucio">
                        <i class="fa fa-bar-chart-o"></i>
                        <h2>Statistik</h2>
                        <p>Mit Crucio kannst du genau analysieren, welche Fragen aus welchem Fachbereich du richtig oder falsch gel&ouml;st hast. Oder wo deine Schwachpunkte bei einer bestimmten Klausur sind, damit es beim n&auml;chsten Mal umso besser klappt. <br><small>Noch nicht verf&uuml;gbar.</small></p>
                    </div>
                </div>
            </div>

            <div class="container-light-grey container-padding-2">
                <div class="cite">
                    <h3>Heureka, Papier ist [...] sowas von gestern!</h3>
                    <i class="fa fa-quote-left pull-left"> <a href="http://de.wikipedia.org/wiki/Epikur">Epikuros von Samos</a></i>
                </div>
            </div>

            <div class="container container-padding-6">
                <div class="row">
                    <div class="col-sm-4 info-block-crucio">
                        <i class="fa fa-comments-o"></i>
                        <h2>Austauschen</h2>
                        <p>Wenn du Schwierigkeiten hast und eine Frage nicht verstehst, kannst du einfach die Kommentarfunktion auf Crucio nutzen. Die Autoren oder freundliche Kommilitonen k&ouml;nnen dann sicher weiterhelfen...</p>
                    </div>

                    <div class="col-sm-4 info-block-crucio">
                        <i class="fa fa-car"></i>
                        <h2>&Uuml;berall</h2>
                        <p>Du kannst Klausuren und deren L&ouml;sungszettel seperat ausdrucken. Au&szlig;erdem ist Crucio f&uuml;r Smartphones und Tablets angepasst. So kannst du &uuml;berall entfallende Antworten nachschauen oder unterwegs weiterlernen. F&uuml;ge doch Crucio zu deinem Startbildschirm hinzu!</p>
                    </div>

                    <div class="col-sm-4 info-block-crucio">
                        <i class="fa fa-pencil"></i>
                        <h2>Mitmachen</h2>
                        <p>Crucio lebt von deiner Anteilnahme! Wenn du dich engagieren willst, kannst du Fragen & Klausuren eintragen, Fehler korrigieren oder Erkl&auml;rungen schreiben. Melde dich einfach digital unter 'Kontakt' oder bei uns in der Fachschaft Medizin.</p>
                    </div>
                </div>
            </div>

            <div class="container-dark-orange container-padding-6">
                <div class="container container-text container-text-light">
                    <i class="fa fa-magic fa-5x"></i>
                    <h4>Noch nicht registriert?</h4>
                    <p>Auf gehts, Crucio ist seit kurzem freigeschaltet! Wenn du gar nicht in Leipzig studierst, dann kannst du uns gerne mal anschreiben, vielleicht k&ouml;nnen wir dir helfen...</p>
                </div>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>
        <?php include('parts/scripts.php'); ?>

        <script>
            $("#moreButton").click(function() {
                $('html, body').animate({ scrollTop: 1050 }, 600);
            });

            $('form').validate({
                errorClass: 'fa fa-remove form-control-feedback',
                errorElement: 'i',
                wrapper: 'div',
                highlight: function () {
                    return false;
                },
                unhighlight: function () {
                    return false;
                },
                submitHandler: function() {
                    $.get('api/v1/users/login', $('form').serialize(), function(data) {
                        if (data.status) {
                            // data.logged_in_user.remeber_me = $("[name='remeber_me']").val();
                            Cookies.set('CrucioUser', data.logged_in_user)
                            location.assign('/learn');
                        }
                    });
                    return false;
                },
                messages: {
                    email: "",
                    password: "",
                }
            });
        </script>
    </body>
</html>
