module tool {
	export class ToolColor extends ToolUnit {

		onStart(): void {

			WngMrg.getInstance().setShowStateWindow(false);
			RegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onGameLoadComplete, this);
			PrecedureManager.getInstance().changePrecedure(PRECEDURE_GAME);

		}

		onExit(): void {

		}



		onGameLoadComplete(event: PrecedureEvent) {
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			let rootGroup = new eui.Group()
			var tLayout:eui.TileLayout = new eui.TileLayout();
			tLayout.paddingTop = 0;
			tLayout.paddingLeft = 10;
			tLayout.paddingRight = 10;
			tLayout.paddingBottom = 0;
			tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_GAP;
        	tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_GAP;
			tLayout.requestedColumnCount = 6
			rootGroup.layout = tLayout;


			let scoller = new eui.Scroller;
			scoller.percentWidth = 100
			scoller.percentHeight = 100
			scoller.viewport = rootGroup;			
			layer.addChild(scoller)


			gui.InitColorTable()
			let keys = Object.keys(gui.ColorNameIndexMap).sort()
			let index = 1
			let mElemList = {};
			var elemInfo = []
			for(let colorName of keys){
				let colorId = gui.GetColorFromName(colorName)

				elemInfo.push( { ["index_type"]: eui.Group, ["name"]: "group_color" + index,  ["w"]: 80, ["h"]: 80,   ["event_name"]: null, ["fun_index"]: null} )
				elemInfo.push( { ["index_type"]: eui.Rect,  ["name"]: "color" + index,   ["parent"]: "group_color" + index, ["w"]: 60, ["h"]: 60,  ["horizontalCenter"]:0, ["top"]:0, ["color"]: colorId, ["alpha"]: 1, ["event_name"]: null, ["fun_index"]: null} )
				elemInfo.push( { ["index_type"] : eui.Label,["name"] : "color_name" + index,	["parent"]: "group_color" + index, ["title"]: colorName,   		["font"] : "ht_13_cc",   ["color"] : gui.Color.white,		["horizontalCenter"] : 0, ["top"] : 60,		 ["fun_index"] : null,} )	

				index ++
			}
			UiUtil.createElem(elemInfo, rootGroup, mElemList, this)
		}



	}

}
