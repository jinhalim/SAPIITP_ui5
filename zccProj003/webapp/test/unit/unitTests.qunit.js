/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/traning/zccProj003/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});