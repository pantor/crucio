<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
	<head>
		<?php include 'parts/header.php'; ?>

		<title ng-controller="titleCtrl" ng-bind="Page.title()"></title>
	</head>

	<body class="body-padding" data-spy="scroll" data-target=".admin-nav" data-offset="90">
		<div class="wrap">
			<?php include 'parts/navbar.html'; ?>

			<div ng-view class="external-ctrl"></div>
		</div>

		<?php include 'parts/footer.html'; ?>
	</body>
</html>