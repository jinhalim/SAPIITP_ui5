function initModel() {
	var sUrl = "/ZCCMMV003/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}