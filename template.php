<!DOCTYPE html>
<html ng-app="crucioApp">
    <head>
        <?php include('parts/header.php'); ?>

        <title>Crucio</title>
    </head>

    <body class="body-padding">
        <div class="wrap">
            <navbar></navbar>

            <ui-view></ui-view>
        </div>

        <div class="footer">
            <div class="container">
                <p class="left hidden-xs">
                    <a href="<?php echo $info['website']; ?>"><?php echo $info['organisation']; ?></a>
                </p>

                <p class="right">
                    <a href="help">Hilfe</a>
                </p>

                <p class="center">
                    <a><i class="fa fa-check-square-o"></i></a>
                </p>
            </div>
        </div>

        <script src="public/js/crucio.js"></script>
    </body>
</html>
