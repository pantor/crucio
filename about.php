<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
    <head>
        <title>Impressum | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body" ng-controller="AboutController as ctrl">
        <div class="wrap">
            <div class="container-top-bar">
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
                    <i class="fa fa-info-circle fa-5x"></i>
                    <h4>Impressum</h4>
                    <p>
                        Alles Rechtliche & Wichtige...
                    </p>
                </div>
            </div>

            <div class="container-light-grey container-padding-2">
                <div class="container container-text">
                    <center>
                        <address>
                            <strong>StuRaMed Leipzig</strong><br>
                            Liebigstra&szlig;e 27<br>
                            04103 Leipzig<br>
                        </address>

                        <p>Crucio wurde entwickelt von Pantorix. <strong>&copy; 2015 Pantorix.</strong></p>
                    </center>
                </div>
            </div>

            <div class="container container-padding-4">
                <dl class="dl-horizontal">
                    <dt>Version</dt>
                    <dd>
                        <address>
                            Crucio ist noch in der <strong><span class="text-danger">0.8-Beta</span></strong>-Version, daher werdet ihr sicherlich einige Fehler entdecken. Die k&ouml;nnt ihr in <a href="https://github.com/crucioproject/Crucio/issues">Github</a> eintragen; und zwar m&ouml;glichst so, dass wir den Fehler reproduzieren k&ouml;nnen. Oder euch einfach bei uns melden...
                        </address>
                    </dd>

                    <dt>Disclaimer</dt>
                    <dd>
                        <p> Sofern auf Verweisziele ("Links") direkt oder indirekt verwiesen wird, die au&szlig;erhalb des Verantwortungsbereiches des Autors liegen, haftet dieser nur dann, wenn er von den Inhalten Kenntnis hat und es ihm technisch m&ouml;glich und zumutbar w&auml;re, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. F&uuml;r dar&uuml;ber hinausgehende Inhalte und insbesondere f&uuml;r Sch&auml;den, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der &uuml;ber Links auf die jeweilige Ver&ouml;ffentlichung lediglich verweist. Diese Einschr&auml;nkung gilt gleicherma&szlig;en auch f&uuml;r Fremdeintr&auml;ge in vom Autor eingerichteten G&auml;steb&uuml;chern, Diskussionsforen und Mailinglisten. </p>
                    </dd>

                    <dt>Datenschutz</dt>
                    <dd>
                        <p> Diese Website nutzt Google Analytics, dabei werden Daten &uuml;ber den verwendeten Browsertyp/ -version, Betriebssystem, Referrer URL (die zuvor besuchte Seite), Hostname des zugreifenden Rechners (IP Adresse) und der Uhrzeit der Serveranfrage erhoben und verarbeitet. Diese Daten sind nicht bestimmten Personen zuordbar. Eine Zusammenf&uuml;hrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. </p>
                    </dd>
                </dl>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>
        <?php include('parts/scripts.php'); ?>
    </body>
</html>