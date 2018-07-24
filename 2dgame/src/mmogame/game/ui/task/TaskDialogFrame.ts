// TypeScript file


class TaskDialogFrame extends BaseWnd {

	actorView: UIActorView;
	dialogData: any;

	name2Data: any;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/TaskDialogLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.setAlignCenter(true, true)
		this.initSkinElemList();
		//this.mLayoutNode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickOption, this)

		var elemInfo = [
			//{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);


		this.actorView = UIActorView.newObj(this.mLayoutNode, "actorView", 0, 0, this.mElemList["group_actorview"])
		this.actorView.setActorScale(1.2)

		// let player = this.actorView.updateByPlayer(3012)
		// player.setDir(ActorDirMap.Right);
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;

		RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
		this.mLayoutNode.visible = false;
		this.actorView.clearView();
	}


	updateDialog(sayerId, content, list, npcId, functionRef, obj) {
		TLog.Assert(list && list.length >= 1)
		//获得
		let data = { sayerId, content, list, npcId, functionRef, obj }
		this.dialogData = data;
		this.showWnd();
		this.doCommand("refreshFrame")
	}

	refreshFrame() {
		let sayerId = this.dialogData.sayerId;
		let content = this.dialogData.content;
		let list: any[] = this.dialogData.list;
		let npcId = this.dialogData.npcId;


		if (sayerId == DIALOG_OBJECT_SELF) {
			this.mLayoutNode.currentState = "my"

			let player = this.actorView.updateByPlayer(GetHeroModel())
			player.setDir(ActorDirMap.Left)

		} else {

			let model = -1
			let npc:Npc = ActorManager.getInstance().getNpc(npcId)
			if(npc){
				model = npc.getProperty("image")
			}else{
				let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(sayerId)
				if (npcRef == null) {
					TLog.Error("TaskDialogFrame.refreshFrame npcRef == null id:%s", tostring(sayerId))
					return
				}
				model = npcRef.model
			}

			let player = this.actorView.updateByPlayer(model)
			player.setDir(ActorDirMap.Right)


			this.mLayoutNode.currentState = list.length > 1 ? "option" : "other";
		}
		this.updateOption(list)
		let rd: gui.RichDisplayer = this.mElemList["rd_content"]
		AddRdContent(rd, content, "ht_24_cc", "ublack", 2)

		// let rd: gui.RichDisplayer = this.mElemList["rd_content"]
		// AddRdContent(rd, content, "ht_30_cc", "ublack", 5)

		// //调整字体大小
		// let h = rd.getLogicHeight()
		// if (h > rd.height) {
		// 	AddRdContent(rd, content, "ht_24_cc", "ublack", 2)
		// }

		let h = rd.getLogicHeight()
		if (h > rd.height) {
			AddRdContent(rd, content, "ht_20_cc", "ublack", 2)
		}


	}


	initItemWindow( group:eui.Group){
		let name = group.name
		let w = group.width;
		let h = group.height

		let mElemInfo = [
			{ ["index_type"]: gui.Button, ["name"]:  name + "_btn", ["title"]: null, ["font"]: null, ["image"]: "rwdh_duiHuaAnNiu", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOption },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "_rd", ["parent"]: name + "_btn", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: w - 20, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, group)

		this.mElemList[name + "_rd"].setAlignFlag(gui.Flag.H_CENTER)
	}

	refreshItemWindow(group, config){
		let name = group.name
	
		let content = XmlConverter.convertDynamicWord(config.title)
		AddRdContent(this.mElemList[name +"_rd"], content, "ht_24_cc_stroke", "white", 5)

		this.name2Data[name +"_btn"] = config.args;
	}


	updateOption(list: any[]) {

		this.name2Data = {}


		let length = list.length;
		if (length == 1) {
			this.name2Data[this.mLayoutNode.name] = list[0].args;
		} else if (length >= 1) {

			let w = 260,h = 50

			let group: eui.Group = this.mElemList["group_btnlist"]
			group.removeChildren();

			for (let i = 0; i < list.length; i++) {
				let data = list[i]
				let subGroup = UiUtil.createGroup("group_option" + i, 270, 50, group)
				this.initItemWindow(subGroup)
				this.refreshItemWindow(subGroup, data)
			}


		}
	}


	clickOption(args){
		if (this.dialogData == null || this.dialogData.functionRef == null) {
			return;
		}

		let functionRef: Function = this.dialogData.functionRef
		return functionRef.call(this.dialogData.obj, args)

	}

	onClickOption(event:egret.TouchEvent) {

		let args = this.name2Data[event.target.name]
		this.clickOption(args)
	}


	onMouseDown(event:GameTouchEvent){
		let args = this.name2Data[this.mLayoutNode.name]
		if(args == null)
			return;

		let target = event.touchEvent.target;
		let isExclude = UiUtil.isExcludeChild(target, [this.mElemList["group_btnlist"]])
		if(!isExclude){
			return	
		}

		
		this.clickOption(args)
	}

}
