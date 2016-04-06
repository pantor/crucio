<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
    <head>
        <?php include('parts/header.php'); ?>

        <title>Crucio</title>
    </head>

    <body class="body-padding">
        <div class="wrap">
            <navbar></navbar>

            <div ng-view class="external-ctrl"></div>
        </div>

        <div class="footer">
            <div class="container">
                <p class="left hidden-xs">
                    <a href="http://www.sturamed-leipzig.de">StuRaMed</a>
                </p>

                <p class="right">
                    <a href="help">Hilfe</a>
                </p>

                <p class="center">
                    <a><i class="fa fa-check-square-o"></i></a>
                </p>
            </div>
        </div>

        <script src="public/js/vendor.js"></script>
        <script src="public/js/crucio.js"></script>
    </body>
</html>
