module test {
	export class TestComponent extends TestUnit{

		textfield : egret.TextField;

	
		

		onStart():void{
			

			WngMrg.getInstance().setShowStateWindow(false);
			RegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onGameLoadComplete, this);
			PrecedureManager.getInstance().changePrecedure(PRECEDURE_GAME);

			
		}

		onExit():void{

		}

		onGameLoadComplete(event: PrecedureEvent) {
			if (event.state != PRECEDURE_GAME)
				return;
			//this.testRichDisplayer();
			//this.testLuaParser()
			//this.testAnimBox();

			//this.testToggleButton();

			//this.testGrayComponent();
			//this.testGridImage();
			//this.testDriveEvent();
			//this.testScroller();
			//this.testPgrogressbar()
			//this.testBatchImage()
		}

		testLuaParser():void{
			//let str = "{[\"window\"]=\"FunctionMenu1Frame/jitan\",[\"offsetX\"]=0 , [\"offsetY\"]=0, [\"width\"]=0, [\"height\"]=0,[\"ImageType\"]=false}"
        	//["window"]="FunctionMenu1Frame/jitan",["offsetX"]=0 , ["offsetY"]=0, ["width"]=0, ["height"]=0,["ImageType"]=false

			//let str = "{[\'window\']=\"FunctionMenu1Frame/jitan\",[\"offsetX\"]=0 , [\"offsetY\"]=0, [\"width\"]=0, [\"height\"]=0,[\"ImageType\"]=false}"
			//let str = "{1.3,2,3,4,{['test']=5,100,101,102,{5,6,7}}}"
			//let str = "{1,{2,3}}"
			let str = "{heroLevel=10,{true, false ,-90}}"
			let obj = LuaParser.parse(str);
			console.debug(obj);
		}

		testRichDisplayer():void{
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			
			let rd:gui.RichDisplayer = new gui.RichDisplayer;
			// rd.width = 200;
			// rd.height = 200;
			rd.width = 200;
			rd.height = 200;
			rd.left = 0;
			rd.verticalCenter = 0;
			layer.addChild(rd);
			rd.addEventListener(gui.RichDisplayer.RichDisplayerTranslateEvent, this.onRdTranslateWord, this);
			rd.addEventListener(gui.RichDisplayer.RichDisplayerLinkCmdEvent, this.onRdLinkCmd, this);
			rd.setRowDistance(10)
			
			// var myScroller = new eui.Scroller();
			// myScroller.width = 200;
        	// myScroller.height = 200;
			// myScroller.viewport = rd;
			// myScroller.left = 0;
			// myScroller.verticalCenter = 0;
			// layer.addChild(myScroller);
			UiUtil.forTestDrawBg(rd);


			rd.setAlignFlag(gui.Flag.H_CENTER);

			let xmlStr = XmlConverter.parseText("#red啊啊 啊你    好#br哈喽")
			rd.addXmlString(xmlStr);

			
			//1.原始XML
			//let xmlStr:string = '<image name="ty_EXPIcon01" /><ver_blank value="5"/><text name="ht_18_lc" color="yellow">##aa##bb##cc##dd重置，所有角色可以再次使用，并且当前dddddddd层数变成 第一层</text><br/><text name="ht_30_lc" color="red" link="1234">你好</text>';

			//2.XmlConverter关键字
			//let xmlStr = XmlConverter.parseText("#red|123|你好#ty_EXPIcon01#yellow|456|哈喽")

			//3.XmlConverter换行
			// let xmlStr = "line1\r\nline2\r\nline3\r\n";
			// xmlStr = XmlConverter.parseText(xmlStr)

			//4.XmlConverter 超链接
			// let linkSign = XmlConverter.LinkSign
			// let xmlStr = linkSign+"3;1000045;267;波塞冬"+linkSign;
			// let rdInfo:any = {}
			// rdInfo.link_parser = function(linkContent){
			// 	let resultList = StringUtil.stringMatch(linkContent, /(\d+);(\d+);(\d+);(.+)/);
			// 	let linkType = resultList[0];
			// 	let playerId = resultList[1];
			// 	let targetId = resultList[2]; 
			// 	let content  = resultList[3]; 
			// 	if(linkType == null || playerId == null || targetId == null || content == null){
			// 		return null;
			// 	}
			// 	let info:any = {}
			// 	info.name = content;
			// 	info.link = linkContent;
			// 	info.color = "orange"
			// 	return info
			// 	//return null;
			// }
			// xmlStr = XmlConverter.parseText(xmlStr, rdInfo)

			//动画
			//let rdInfo:any = {}
			//let xmlStr = XmlConverter.parseText("#aixin123", rdInfo)

			//let xmlStr = XmlConverter.parseText("#red|123|<你\"好>#ty_EXPIcon01#yellow|456|哈喽")
			//rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			// rd.addXmlString(xmlStr);
			//rd.showLastRow();


			// let rd2:gui.RichDisplayer = new gui.RichDisplayer;
			// // rd.width = 200;
			// // rd.height = 200;
			// rd2.width= 100;
			// rd2.height = 50;
			// rd2.right = 0;
			// rd2.top = 0;
			// rd.addChild(rd2);

			// rd2.addXmlString(xmlStr);
			// rd2.addXmlString(xmlStr);
			// rd2.addXmlString(xmlStr);
			// rd2.addXmlString(xmlStr);
			// rd2.addXmlString(xmlStr);
			// rd2.addXmlString(xmlStr);

		}

		onRdTranslateWord(event:gui.GUITranslateWordEvent):void{
			let str = event.getTranslateWord()
			event.setTranslateWord(str + "!!");
		}

		onRdLinkCmd(event:gui.GUIHyperlinkEvent):void{
			//event.window
			TLog.Debug("onRdLinkCmd", event.getHyperlink() );
		}


		testAnimBox(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);


			let animBox = new gui.AnimBox;
			animBox.horizontalCenter = 0
			animBox.verticalCenter = 0;
			layer.addChild(animBox);
			
			animBox.setAnimName("aixin")
			animBox.play();
		}




		testToggleButton(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			let mElemList = {};

			var elemInfo = [
				{ ["index_type"]: eui.ToggleButton, ["name"]: "content", ["image"]:"zjm_bt_gengDuo01", ["image_down"]:"zjm_bt_gengDuo02", ["event_name"]: null, ["fun_index"]: null },
			]
			UiUtil.createElem(elemInfo, layer, mElemList, this)


		}

		testGrayComponent(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			let mElemList = {};
			var elemInfo = [
				{ ["index_type"]: gui.Button, ["x"]: 100, ["y"]: 100,["name"]: "btn", ["image"]:"ty_tongYongBt01",  ["event_name"]: null, ["fun_index"]: null , ["enabled"]: false},
				{ ["index_type"]: eui.Image, ["x"]: 300, ["y"]: 100, ["name"]: "img", ["image"]:"item_21006",  ["event_name"]: null, ["fun_index"]: null, ["enabled"]: false },
			]
			UiUtil.createElem(elemInfo, layer, mElemList, this)
			

			let img = mElemList["img"]
			img.enabled = false;
		}

		testGridImage(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			let mElemList = {};
			var elemInfo = [
				{ ["index_type"]: gui.Grid9Image,  ["x"]: 300, ["y"]: 100, ["w"]: 300, ["h"]: 100, ["name"]: "img", ["image"]:"ty_UIDi04",  ["event_name"]: null, ["fun_index"]: null},
			]
			UiUtil.createElem(elemInfo, layer, mElemList, this)
			// let image:gui.Grid9Image = mElemList["img"]
			// image.scale9Grid = new egret.Rectangle(120, 120, 1, 1)
			
		}



		testDriveEvent(){

			let layer = IGlobal.guiManager.getLayerNode(gui.GuiLayer.Normal)
			let mElemList = {};
			var elemInfo = [
				{ ["index_type"]: gui.Grid9Image,  ["x"]: 300, ["y"]: 100, ["w"]: 300, ["h"]: 100, ["name"]: "img", ["image"]:"ty_UIDi04",  ["event_name"]: null, ["fun_index"]: null},
			]
			UiUtil.createElem(elemInfo, <any>layer, mElemList, this)

			let img:gui.Grid9Image = mElemList["img"]
			img.addEventListener(gui.GUIDriveEvent.BeginDriveEvent, this.onBeginDrive, this);
			img.addEventListener(gui.GUIDriveEvent.EndDriveEvent, this.onEndDrive, this);
		}

		onBeginDrive(event:gui.GUIDriveEvent){
			event.setDriveBegin(true);

		 	TLog.Debug("onBeginDrive", event.hoverTarget.name)	
		}

		onEndDrive(event:gui.GUIDriveEvent){
			TLog.Debug("onEndDrive", event.hoverTarget.name)

			let layer = IGlobal.guiManager.getLayerNode(gui.GuiLayer.Normal)
			let point = core.EgretUtil.stageToNodeXY(layer, event.stageX - event.driveOffStageX, event.stageY - event.driveOffStageY)
			event.target.x = point.x;
			event.target.y = point.y;
			
		}

		controlDataTable:any
		scroll:UIScrollList;
		scrollIndex:number;
		testScroller(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);
			let mElemList = {}
			let scroll:UIScrollList = UIScrollList.newObj(layer, "scroll", 30, 12, 490, 100, null, UIScrollList.DIR_HORIZON)

			UiUtil.forTestDrawBg(scroll.contentGroup);


			this.controlDataTable = {}

			let list = [0, 1,2,3,4,5,6, 7,8,9,10]
			this.scrollIndex = 5
			scroll.clearItemList()
			for (let i = 0; i < list.length; i++) {
				let v = list[i]
				let window = scroll.getItemWindow(i, 100, 100, 10, 0, 0)
				this.initItemWindow(window, i, mElemList, layer)
				//this.refreshItemWindow(window, i, v)
			}

			scroll.refreshScroll()
			scroll.moveToScrollIndex(this.scrollIndex)
			this.scroll = scroll;
		}

		 initItemWindow( window, i, mElemList, layer){
			let name = window.name
			mElemList[name+"roleImg"] = UIPetBox.newObj(layer, name+"roleImg", 0, 0, window, 0.8)
			mElemList[name+"roleImg"].setPetHintEnable(false)
			
			let mElemInfo:any = [
				{["index_type"] : gui.Button, ["name"] : name+"clickSelect", ["x"] : 0, ["y"] : 0, ["w"] : 100, ["h"] : 100, ["event_name"] : gui.TouchEvent.TOUCH_SHORT, ["fun_index"] : this.onClickRoleImg},
				{["index_type"] : eui.Image, ["name"] : name+"clickSelectImg", ["image"] : "ty_xuanZhongKuang01", ["x"] : 0, ["y"] : 0, ["w"] : 100, ["h"] : 100, ["messageFlag"] : true},
				
				
				{["index_type"] : gui.Grid9Image, ["name"] : name+"embattlebg", ["image"] : "ty_skillIcon01", ["x"] : 0, ["y"] : 0, ["w"] : 80, ["h"] : 34, ["messageFlag"] : true},
				{["index_type"] : eui.Label,	["name"] : name +"embattle",		["parent"] : name+"embattlebg",			["title"] : Localize_cns("CAMPAIGN_TXT53"),   		["font"] : "ht_18_cc_stroke",   ["color"] : gui.Color.white,		["x"] : 0, ["y"] : 0,		["w"] : 80,["h"] : 24,	["messageFlag"] : true},
				
			]
			UiUtil.createElem(mElemInfo, layer, mElemList, this, window)


			this.controlDataTable[name+"clickSelect"] = i;

			mElemList[name+"roleImg"].updateByEntry(18000 + i)

			mElemList[name+"clickSelectImg"].visible = (false);
		}

		 onClickRoleImg( args : egret.TouchEvent){
			let name = args.target.name;

			let scrollIndex = this.controlDataTable[name]
			TLog.Debug("onClickRoleImg", scrollIndex)
			this.scroll.moveToScrollIndex(scrollIndex, true)
			
		}



		testPgrogressbar(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			let mElemList = {};
			
			var elemInfo = [
				{ ["index_type"]: gui.ProgressBar, ["name"]: "bar", ["title"]: "", ["font"]: null, ["image"]: "hd_loadingDi01", ["thumbImage"]: "hd_loading01", ["color"]: gui.Color.white, ["x"]: 145, ["y"]: 75, ["w"]: 195, ["h"]: 30 },
			]
			UiUtil.createElem(elemInfo, layer, mElemList, this)

			


			let timerId = 0;
			let onTimerCallback = function(dt){
				KillTimer(timerId);
				UiUtil.updateProgress(mElemList["bar"], 50, 100, null, 1000)
			}

			timerId = SetTimer(onTimerCallback, this, 1000);

		}


		testBatchImage(){
			let layer:eui.UILayer = new eui.UILayer;
			IGlobal.rootNode.addChild(layer);

			let mElemList = {};
			let width = 351, height = 58
			var elemInfo = [
				{ ["index_type"]: gui.BatchImage, ["name"]: "forceAddRd", ["parent"]: "group", ["x"]: 50, ["y"]: 0, ["w"]: width - 50, ["h"]: 30, ["messageFlag"]: true },
			]
			UiUtil.createElem(elemInfo, layer, mElemList, this)

			let batchImage:gui.BatchImage = mElemList["forceAddRd"]
			batchImage.beginDraw();
			batchImage.drawNumberString("daZhanLi02_", "+" + "1000", 0, 0, 0);
			batchImage.endDraw();

			let timerId = 0;
			let delay = 0
			let index = 0
			let onTimerCallback = function(dt){
				delay = delay + dt
				if(delay < 1000){
					return
				}
				else if(delay > 1000 && delay < 2000){
					batchImage.visible = false
					return
				}else if(delay > 10000){
					// KillTimer(timerId);
					// return;
				}

				batchImage.visible =true

				
				index++;
				
				batchImage.beginDraw();
				batchImage.drawNumberString("daZhanLi02_", "+" + (39200+index), 0, 0, 0);
				batchImage.endDraw();
			}

			timerId = SetTimer(onTimerCallback, this, 0);

		}

		
	}

}