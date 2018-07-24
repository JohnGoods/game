class CharacterFightFrame extends BaseWnd{

	//战斗艺术字体
	FightFontText = 
	{
		["baoji"] 	: "zd_baoJiDi",
		["mianyi"] 	: "wuDi",//"mianYi",
		["shanbi"] 	: "shanBi",
		["xishou"] 	: "xiShou",
		["break"]	: "beiDaDuan",
		["nagative"]: "wuMuBiao",
	}

	showNumberPos = [
					[0, 0],
					[Math.PI * 1	/ 4, 20],
					[Math.PI * 1	/ 4, 30],
					[Math.PI * 1	/ 4, 40],
					[0, 40],
					[Math.PI * 3	/ 4, 20],
					[Math.PI * 3	/ 4, 30],
					[Math.PI * 3	/ 4, 40],
					[Math.PI * 3	/ 4, 50],

	]

	numberTimerList:any;
	runningGroupList:eui.Group[]

	owner:Actor;


	cacheGroupList:eui.Group[];

	public initObj(...params:any[]){
		//this.mLayoutPaths = ["resource/layouts/MainMenuLayout.exml"]

		this.numberTimerList = {};
		this.runningGroupList = [];

		this.cacheGroupList = null;
	}

	public onLoad():void{
		//this.mLayoutNode.skinName = this.mLayoutPaths[0];

		// var offset = 92

		// var width = 150, height = 120+offset;
		this.mLayoutNode.width = 10;
		this.mLayoutNode.height = 10;
		this.mLayoutNode.horizontalCenter = 0;
		this.mLayoutNode.verticalCenter = 0;

		// this.mLayoutNode.horizontalCenter = 0;
		// this.mLayoutNode.top = -height;

		// if(TEST_UI_RECT){
		// 	UiUtil.forTestDrawBg(this.mLayoutNode);
		// }
		this.cacheGroupList = [];

	}

	public onUnLoad():void{
		for(var k in this.numberTimerList){
			var timer = this.numberTimerList[k];
			KillTimer(timer)
		}
		this.numberTimerList = {}
		this.cacheGroupList = null;
	}

	public onShow():void{
		this.mLayoutNode.visible = true;
	}

	public onHide():void{
		this.mLayoutNode.visible = false;
		this.owner = null;
	}

	setOwner(actor:Actor){
		this.owner = actor;
	}
	
	onReset(){
		for(let i = 0; i < this.runningGroupList.length; i++){
			let group = this.runningGroupList[i]
			egret.Tween.removeTweens(group);
			if(group.parent){
				group.parent.removeChild(group);
			}
			this.cacheGroupList.push(group)
		}
		this.runningGroupList = [];
	}

	
	showFloatText( text_info, all_time ){
		let title = text_info.title
		let color = text_info.color || gui.Color.white
		let font = text_info.font || "ht_24_lc_stroke"
		
		let group = this.createGroup()
		let label:eui.Label = group.mElemList.txt_info
		label.visible = true

		IGlobal.fontSet.updateTextField(font, label)
		label.text = (title)
		label.textColor = (color)		

		label.y = -40;
		
		let ax = label.x, ay = label.y
		egret.Tween.get(label ).to({x:ax, y:ay - 40}, 800).
									call(this.onCombatFrameFinishMove, this, [group]);

		
	}

	showCombatInfo(number_info, all_time){
		TLog.Assert(this.owner!= null);

		var signSymble = number_info.nature
		var point = tostring(number_info.point)

		var imagePrefix = "zd_jiaXue_"
		//var imageStr = ""
		var isDrawNumber = true
		var textList = []

		if(number_info.Type == "hp"){
			if(signSymble == "-"){
				imagePrefix = "zd_kouXue_"
			}else{
				point = "+" + point
			}
			
			if(number_info.flag == powerXPFlag.CRITICAL){
				textList = number_info.textList || []
			}else if(number_info.flag == powerXPFlag.NOT_SHOW){
				return
			}
		}else if( number_info.Type == "mp"){
			return 
		}else if(number_info.Type == "max_hp"){

		}else if(number_info.Type == "rp"){
			return
			
		}else if(number_info.Type == "immunize"){//免疫
			//imageStr = varize_cns("IMMUNIZE")
			textList = number_info.textList || []
			isDrawNumber = false
		}else if(number_info.Type == "resist"){//抵抗
			//imageStr = varize_cns("RESIST")
			textList = number_info.textList || []
			isDrawNumber = false
		}else if(number_info.Type == "dodge" || 
					number_info.Type == "absorb" ||
					number_info.Type == "mianyi" || 
					number_info.Type == "break" ||
					number_info.Type == "nagative"){
			textList = number_info.textList || []
			isDrawNumber = false
		}

		if(number_info.flag == powerXPFlag.CRITICAL){
			imagePrefix = "zd_baoJi"
		}

		if(isDrawNumber){
			this.showCombatNumber(imagePrefix, point, textList)
		}else{
			this.showCombatText( textList)
		}
	}


	createGroup(){

		let group = null;
		if(this.cacheGroupList.length > 0){
			group = this.cacheGroupList.pop()

		}else{
			let width= 150, height = 50

			group = new eui.Group;
			group.mElemList = {};
			group.touchEnabled = false;
			group.touchChildren = false;
			group.anchorOffsetX = width /2;
			group.anchorOffsetY = height /2;
			UiUtil.setWH(group, width, height);

			
			let info: any = [
				{ ["index_type"]: gui.BatchImage, ["name"]: "combat_info", ["parent"]: "fightInfo_bg", ["title"]: "", ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 67, ["h"]: 13 },
				{ ["index_type"]: eui.Label, ["name"]: "txt_info", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["color"]: gui.Color.lime, ["x"] : 0, ["y"] : 0,		["w"] : width,["h"] : 30, },
				{ ["index_type"]: gui.BatchImage, ["name"]: "fighter_charater", ["parent"]: "fightInfo_bg", ["title"]: "", ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["y"]: -100, ["w"]: 65, ["h"]: 36 },
				
			]
			UiUtil.createElem(info, group, group.mElemList, this)
			// UiUtil.forTestDrawBg(group, gui.Color.green);
			// UiUtil.forTestDrawBg(group.mElemList["fighter_charater"], gui.Color.black);
		}

		

		//直接假如到镜头前
		SceneManager.getInstance().addNodeToCamera(group);
		this.runningGroupList.push(group);
		// var batchImage:gui.BatchImage = new gui.BatchImage;
		// this.runningGroupList.push(batchImage);

		var size = this.owner.getContentSize();
		var pos = this.owner.getPositionXY();

		let centerH = size.height /2
		if(centerH > MaxBoundHeight/2){
			centerH = MaxBoundHeight/2 //某些BOSS太大了
		}

		group.x = pos.x ;
		group.y = pos.y - centerH;

		let batchImage = group.mElemList["combat_info"]
		batchImage.scaleX = batchImage.scaleY = 1;
		batchImage.x = batchImage.y = 0;
		batchImage.visible = false

		batchImage = group.mElemList["fighter_charater"]
		batchImage.scaleX = batchImage.scaleY = 1;
		batchImage.horizontalCenter = 0
		batchImage.y = -100;
		batchImage.visible = false

		let label = group.mElemList["txt_info"]
		label.visible = false
		// UiUtil.forTestDrawBg(group);
		// this.mLayoutNode.addChild(batchImage);
		return group;
	}


	showCombatNumber(imagePrefix:string, point:string, textList){

		let group = this.createGroup();

		var batchImage = group.mElemList["combat_info"]
		let imageW = 0
		if(textList.length == 0){
			batchImage.beginDraw();
			imageW = batchImage.drawNumberString(imagePrefix, point);
			batchImage.endDraw();
		}else{
			imageW = this.drawTextList(batchImage, textList, true, imagePrefix, point);
		}

		var offx = 0, offy= 0
		var showTime = 100
		var holdTime = 500
		var hideTime = 100

		for(var k = 0; k < this.showNumberPos.length; k++){
			if(! this.numberTimerList[k]){
				var v = this.showNumberPos[k]
				offx = v[1] * Math.cos(v[0])
				offy = v[1] * Math.sin(v[0])
				
				var time = 0
				var tick = function( delay){
					time = time + delay
					if(time > showTime + holdTime){
						if(this.numberTimerList[k]){
							KillTimer(this.numberTimerList[k])
							delete this.numberTimerList[k]
						}	
					}
				}
				this.numberTimerList[k] = SetTimer(tick, this, 100, false)
				
				//table.insert(this.numberFrameList, frame)
				break
			}
		}

		//之前的窗口变暗
		// for(var i = 0; i < this.runningBatchImageList.length - 1; i++){
		// 	//this.numberFrameList[i].alpha = 128;
		// }

		batchImage.scaleX = batchImage.scaleY = 0.2;


		// let startOffX = 0
		// if(IsFaceLeft(this.owner)){
		// 	startOffX = -40;
		// }else{
		// 	startOffX = -20;
		// }
		batchImage.x = group.width / 2 - imageW / 2;

		var ax = batchImage.x;
		var ay = batchImage.y;
		batchImage.visible = true

		egret.Tween.get(batchImage ).to({scaleX:1.2, scaleY:1.2}, showTime).
									to({x:ax+offx, y:ay+offy}, showTime).
									wait(holdTime).
									to({x:ax+offx, y:ay+offy-60}, showTime).
									call(this.onCombatFrameFinishMove, this, [group]);

		
	}

	onCombatFrameFinishMove(group:eui.Group){
		JsUtil.arrayRemoveVal(this.runningGroupList, group);

		if(group.parent)
			group.parent.removeChild(group);


		if(this.cacheGroupList){
			this.cacheGroupList.push(group);
		}

		if(this.runningGroupList.length == 0){
			this.hideWnd();
		}

		// if(this.mLayoutNode.$children.length == 0){
		// 	this.hideWnd();//没有子节点，则关闭窗口
		// }
	}

	showCombatText( textList:string[]){
		var group = this.createGroup();
		var batchImage = group.mElemList["combat_info"]
		let imageW = this.drawTextList(batchImage, textList);

		var ax = batchImage.x;
		var ay = batchImage.y;
		batchImage.visible = true
		
		batchImage.x = group.width / 2 - imageW / 2;
		egret.Tween.get(batchImage ).to({alpha:1.2}, 100). //缩放
									wait(400).//等待
									to({y:ay-20}, 200).//上升
									call(this.onCombatFrameFinishMove, this, [group]);
	}


	drawTextList(batchImage:gui.BatchImage, textList:string[], includeNumber?:boolean, imagePrefix?:string, point?:string){
		let type = textList[0]
		var textImageName = this.FightFontText[ type ]
		let imageInfo = IGlobal.imageSet.getImageInfo(textImageName)
		if(imageInfo == null){
			TLog.Error("drawTextList %s", textImageName)
			return 0
		}


		batchImage.beginDraw();
			let w = batchImage.drawImage(textImageName, 0, 0);
			if(includeNumber){
				let baisX = imageInfo.w
				if(type == "baoji"){
					baisX = 0
				}
				w = w + batchImage.drawNumberString(imagePrefix, point, baisX, 0);
			}
		batchImage.endDraw()
		return w
	}

	showFighterCharater(imageName:string){
		var group = this.createGroup();
		var batchImage = group.mElemList["fighter_charater"]
		let imageInfo = IGlobal.imageSet.getImageInfo(imageName)
		if(imageInfo == null){
			TLog.Error("drawTextList %s", imageName)
			return 0
		}

		batchImage.beginDraw();
		let imageW = batchImage.drawImage(imageName, 0, 0);
		batchImage.endDraw()

		// batchImage.x = group.width / 2 - imageW / 2;
		var ax = batchImage.x;
		var ay = batchImage.y;
		batchImage.visible = true

		egret.Tween.get(batchImage ).to({alpha:1.2}, 100). //缩放
									wait(400).//等待
									to({y:ay-20}, 200).//上升
									call(this.onCombatFrameFinishMove, this, [group]);
	}

}