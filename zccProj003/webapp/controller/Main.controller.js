sap.ui.define(['sap/ui/core/mvc/Controller','sap/ui/model/Sorter','sap/m/MessageToast','sap/m/Button','sap/ui/model/Filter','sap/m/Dialog','sap/m/Text','sap/ui/layout/HorizontalLayout','sap/m/ButtonType','sap/ui/layout/VerticalLayout','sap/m/Label'], 
function (Controller,Sorter, MessageToast,Button,Filter,Dialog,Text,HorizontalLayout, ButtonType,VerticalLayout,Label) {
	"use strict";
	
	return Controller.extend("sap.traning.zccProj003.controller.Main", {
		_allFilter: [],
		onInit: function () {
			var oView = this.getView().getId();
			var oTable = this.byId(oView + "--ZCCMMV003");
				// sColumnCount = oView.byId("inputColumn").getValue() || 0,
				// sRowCount = oView.byId("inputRow").getValue() || 0,
				// sBottomRowCount = oView.byId("inputButtomRow").getValue() || 0,
			var iColumnCount = 5;
				// iRowCount = parseInt(sRowCount),
				// iBottomRowCount = parseInt(sBottomRowCount),
			var iTotalColumnCount = oTable.getColumns().length;
				// iTotalRowCount = oTable.getRows().length;

			// Fixed column count exceeds the total column count
			if (iColumnCount > iTotalColumnCount) {
				iColumnCount = iTotalColumnCount;
				oView.byId("inputColumn").setValue(iTotalColumnCount);
				MessageToast.show("Fixed column count exceeds the total column count. Value in column count input got updated.");
			}

			oTable.setFixedColumnCount(iColumnCount);
		},
		onSearch: function (oEvent) {
			
			var sViewId = this.getView().getId();
			var item = [];
			item[0] = this.getView().byId(sViewId + "--field1").getValue();
			item[1] = this.getView().byId(sViewId + "--field2").getValue();
			item[2] = this.getView().byId(sViewId + "--field3").getValue();
			item[3] = this.getView().byId(sViewId + "--DP1").getValue();
			item[4] = this.getView().byId(sViewId + "--DP2").getValue();
			var itemName = ["EBELN","MATNR","LIFNR","BEDAT","EINDT"];
			
			var btnGroup = this.getView().byId(sViewId + "--GroupA").getSelectedButton().getText();
			// MessageToast.show(btnGroup);
			
			
			var btnFilterName = ["ELIKZ","EREKZ","WEPOS","REPOS","LOEKZ"];
			
			var filterList1 = [];
			var filterList2 = [];
			var subFilters = [];
			var lastFilters = [];
			
			
			/*----------Filter---------*/
			// var aFilters = [];
			
			for(var i = 0; i<5;i++){
				var sQuery = item[i];
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter(itemName[i], sap.ui.model.FilterOperator.Contains, item[i]);
					filterList1.push(filter);
				}
			}
			/*--------PO 구분-------*/
			if(btnGroup === "Open PO"){ //Open PO
				filter = new Filter(btnFilterName[0], sap.ui.model.FilterOperator.NotContains,"X");
				filterList2.push(filter);
				filter = new Filter(btnFilterName[1], sap.ui.model.FilterOperator.NotContains,"X");
				filterList2.push(filter);
				filter = new Filter(btnFilterName[2], sap.ui.model.FilterOperator.NotContains,"X");
				filterList2.push(filter);
				filter = new Filter(btnFilterName[3], sap.ui.model.FilterOperator.NotContains,"X");
				filterList2.push(filter);
				subFilters = new Filter(filterList2,false); //or

				// filterList2 = [];
				filterList1.push(subFilters);
				filter = new Filter(btnFilterName[4], sap.ui.model.FilterOperator.NotContains,"X");
				filterList1.push(filter);
				// lastFilters = new Filter(filterList+this._allFilter, true);
				// MessageToast.show(btnList);
			}	
			else if(btnGroup === "납품완료표시"){ //납품완료표시
				filter = new Filter(btnFilterName[0], sap.ui.model.FilterOperator.Contains,"X");
				filterList2.push(filter);
				filter = new Filter(btnFilterName[2], sap.ui.model.FilterOperator.Contains,"X");
				filterList2.push(filter);
				subFilters = new Filter(filterList2,false); //or
				filterList1.push(subFilters);
				filter = new Filter(btnFilterName[4], sap.ui.model.FilterOperator.NotContains,"X");
				filterList1.push(filter);
			}
			lastFilters = new Filter(filterList1, true);
			var table = this.getView().byId(sViewId + "--ZCCMMV003");
			var oBinding = table.getBinding("rows");
			oBinding.filter(lastFilters);
		},
		clearAllSortings : function(oEvent) {
			var sViewId = this.getView().getId();
			var oTable = this.byId(sViewId + "--ZCCMMV003");
			oTable.getBinding("rows").sort(null);
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
		},
		onClear: function (oEvent) {
			this.oFilterBar = null;
			var sViewId = this.getView().getId();
			this.oFilterBar = sap.ui.getCore().byId(sViewId + "--filterBar");
			var oItems = this.oFilterBar.getAllFilterItems(true);
			for (var i = 0; i < oItems.length; i++) {
				var oControl = this.oFilterBar.determineControlByFilterItem(oItems[i]);
				if (oControl) {
					oControl.setValue("");
				}
			}
			this.onSearch();
		},
		onSuggest: function (oEvent) {
			var sViewId = this.getView().getId();
			this.oSF = this.getView().byId(sViewId + "--field1");
			var value = oEvent.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("EBELN", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}

			this.oSF.getBinding("suggestionItems").filter(filters);
			this.oSF.suggest();
		},
		onRow: function (oEvent) {
			var sView = this.getView().getId();
			var oIndex = oEvent["mParameters"].rowIndex;
			var oTable = this.byId(sView + "--ZCCMMV003");
			var cxt = oTable.getContextByIndex(oIndex);
			var path = cxt.sPath;
        	var obj = oTable.getModel().getProperty(path);
        	// console.log(obj);

			var dialog = new Dialog({
				title: 'Detail',
				type: 'Message',
				showCloseButton: "true",
				content: [
					new VerticalLayout({
						// width: '250 px',
						content: [
							new HorizontalLayout({
							content: [new Label({ design:"Bold", text: 'PO Number: '}), new Label({ text: obj.EBELN}) ]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '자재번호:' }), new Label({ text: obj.MATNR})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '공급업체번호: ' }),new Label({ text: obj.LIFNR})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매오더생성일자:' }),new Label({ text: obj.BEDAT})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '납품입고일자: ' }), new Label({ text: obj.ELDAT})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'Delivery Completed indicator:' }), new Label({ text: obj.ELIKZ})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'Final Invoice: ' }), new Label({ text: obj.EREKZ})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'G/R:' }), new Label({ text: obj.WEPOS})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'I/R: ' }), new Label({ text: obj.REPOS})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'PO 삭제여부:' }), new Label({ text: obj.LOEKZ})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '자재명: ' }), new Label({ text: obj.TXZ01})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매오더품목항번:' }),new Label({ text: obj.EBELP}) ]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'Delivery Schedule Line Counter: ' }),new Label({ text: obj.ETENR}) ]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '회사코드:' }), new Label({ text: obj.BUKRS})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '플랜트: ' }), new Label({ text: obj.WERKS})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '저장위치:' }), new Label({ text: obj.LGORT})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'PO Ref 유형: ' }), new Label({ text: obj.BSTYP})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'Purchasing doc type: ' }),new Label({ text: obj.BSART})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매오더변경일자:' }), new Label({ text: obj.AEDAT})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'PO 발행인: ' }),new Label({ text: obj.ERNAM}) ]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매조직:' }), new Label({ text: obj.EKORG})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매그룹: ' }),new Label({ text: obj.EKGRP})]}),
							new HorizontalLayout({
							content: [new Label({design:"Bold", text: '자재유형:' }), new Label({ text: obj.EMATN}) ]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '자재그룹: ' }), new Label({ text: obj.MATKL})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '발주수량:' }), new Label({ text: obj.MENGE})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '수량단위: ' }), new Label({ text: obj.MEINS})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '단가:' }), new Label({ text: obj.NETPR})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '총구매금액: ' }),new Label({ text: obj.BRTWR})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '순 발주금액: ' }), new Label({ text: obj.NETWR})]}),
							new HorizontalLayout({
							content: [new Label({design:"Bold", text: '통화단위: ' }),new Label({ text: obj.WAERS})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매 Info record: ' }),new Label({ text: obj.INFNR})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매요청번호: ' }),new Label({ text: obj.BANFN})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'PR 품목 항번: ' }),new Label({ text: obj.BNFPO})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '구매 거래 유형: ' }),new Label({ text: obj.VGABE})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: 'Material doc. 번호: ' }),new Label({ text: obj.BELNR})]}),
							new HorizontalLayout({
							content: [new Label({ design:"Bold",text: '납품예정일자: ' }),new Label({ text: obj.EINDT})]}),
							new HorizontalLayout({
							content: [new Label({ text: '납품입고수량: ' }),new Label({ text: obj.WEMNG})]})
						]
					})
				],
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				})
			});
			
			dialog.open();
		}
	});
});