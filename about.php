<!DOCTYPE html>
<html>
    <head>
        <title>Impressum | Crucio</title>
        <?php include('parts/header.php'); ?>
    </head>

    <body class="body">
        <div class="wrap">
            <?php include('parts/container-top-bar.php'); ?>

            <?php
                $param = ["fa" => "fa-info-circle", "h4" => "Impressum"];
                include('parts/container-title.php');
            ?>

            <div class="container-light-grey container-padding-2">
                <div class="container container-text">
                    <center>
                        <address>
                            <strong><?php echo $info['organisation-full']; ?></strong><br>
                            <?php echo $info['address']; ?>
                        </address>

                        <p>Crucio ist ein Open-Source Projekt. <a href="http://crucioproject.github.io">Mehr dazu...</a></p>
                    </center>
                </div>
            </div>

            <div class="container container-padding-4">
                <dl class="dl-horizontal">
                    <dt>Version</dt>
                    <dd>
                        <address>
                            Crucio ist in der <strong><span class="text-danger">0.9-Beta</span></strong>-Version. Falls ihr Fehler entdeckt, k&ouml;nnt ihr sie bei <a href="https://github.com/crucioproject/Crucio/issues">Github</a> eintragen. Oder euch einfach bei uns melden...
                        </address>
                    </dd>

                    <dt>Disclaimer</dt>
                    <dd>
                        <p> Sofern auf Links direkt oder indirekt verwiesen wird, die au&szlig;erhalb des Verantwortungsbereiches des Autors liegen, haftet dieser nur dann, wenn er von den Inhalten Kenntnis hat und es ihm technisch m&ouml;glich und zumutbar w&auml;re, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. F&uuml;r dar&uuml;ber hinausgehende Inhalte und insbesondere f&uuml;r Sch&auml;den, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der &uuml;ber Links auf die jeweilige Ver&ouml;ffentlichung lediglich verweist. Diese Einschr&auml;nkung gilt gleicherma&szlig;en auch f&uuml;r Fremdeintr&auml;ge in vom Autor eingerichteten G&auml;steb&uuml;chern, Diskussionsforen und Mailinglisten. </p>
                    </dd>

                    <dt>Datenschutz</dt>
                    <dd>
                        <p> Diese Website nutzt Google Analytics, dabei werden Daten &uuml;ber den verwendeten Browsertyp/ -version, Betriebssystem, Referrer URL (die zuvor besuchte Seite), Hostname des zugreifenden Rechners (IP Adresse) und der Uhrzeit der Serveranfrage erhoben und verarbeitet. Diese Daten sind nicht bestimmten Personen zuordbar. Eine Zusammenf&uuml;hrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. </p>
                    </dd>
                </dl>
            </div>
        </div>

        <?php include('parts/footer.php'); ?>
    </body>
</html>
