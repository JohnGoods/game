
class CharacterAwardFrame extends BaseWnd {

	content: string;
	fontColor: number;
	owner: Actor;

	public initObj(...params: any[]) {

	}

	public onLoad(): void {

		let width = 350
		let height = 60

		this.mLayoutNode.width = width
		this.mLayoutNode.height = height
		this.mLayoutNode.touchChildren = false;
		this.mLayoutNode.touchEnabled = false;
		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom);

		var elemInfo = [
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "content", ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null },
		]
		UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let rd: gui.RichDisplayer = this.mElemList["content"]
		rd.setAlignFlag(gui.Flag.H_CENTER)

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.refreshFrame()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		let rd = this.mElemList["content"]
		let width= this.mLayoutNode.width, height = this.mLayoutNode.height;

		//rd.SetWH(width, height)

		rd.clear()
		let font: any = {}
		font.default_color = this.fontColor
		font.defalut_font = "ht_20_cc_stroke"
		rd.addXmlString(XmlConverter.parseText(this.content, font))

		//height = rd.GetAllRowHeight()
		//height = height < 60 && 60 || height

		//let width = rd.GetLogicWidth()

		//rd.SetWH(width + 5, height + 10)
		//this.drawPtr1.targetArea.SetAbsoluteLTWH(0, 0, this.mRootFrame.GetWidth(), this.mRootFrame.GetHeight() - 5)
		//this.drawPtr2.targetArea.SetAbsoluteLTWH(this.mRootFrame.GetWidth() / 2 - 16, this.mRootFrame.GetHeight() - 9, 33, 9)
		//this.mRootFrame.setAlignFlag(Core.Flag.CENTER_BOTTOM, 0, -200)
		//this.mRootFrame.SetChanged()

		//rd.ShowLastRow()
		//TLog.Debug("11111111111111111")
		//
		//let frame = this.mRootFrame

		let layoutNode = this.mLayoutNode;

		let mapXY = this.owner.getMapXY()
		let mapPos = SceneManager.getInstance().mapXYtoScreenXY(mapXY.x, mapXY.y)
		let x = mapPos.x, y = mapPos.y
		let ax = x - this.mLayoutNode.width/2, ay = y - 40
		// layoutNode.x = ax;
		// layoutNode.y = ay;
		// layoutNode.scaleX = 1
		// layoutNode.scaleY = 1


		var showTime = 150
		var holdTime = 300
		//var hideTime = 100
		var offx = 0
		let offy = -30;


		egret.Tween.get(layoutNode ).set({x:ax, y:ay}).
									to({x:ax + offx, y:ay+offy}, showTime).
									wait(holdTime).
									to({x:ax+offx, y:ay+offy-60}, showTime).
									call(this.onCombatFrameFinishMove, this, [layoutNode]);
		// let scaleControler = ui_util.CreateControllerScale(frame, 1, 200, false, false)
		// let timeController1 = ui_util.CreateGuiControllerTime(frame, 500, false)
		// let alphaContrller = ui_util.CreateControllerAlpha(frame, 0, 400, false)
		// let controller1 = ui_util.GuiControllerSequence(frame, scaleControler, timeController1, alphaContrller)

		// let positionController = ui_util.CreateControllerPosition(frame,
		// 	gui.eGuiControllerMoveType_Inertional,
		// 	200, ax, ay, ax, ay - 30,
		// 	gui.eGuiControllerMoveXYType_Frame, false)
		// let timeController = ui_util.CreateGuiControllerTime(frame, 500, false)
		// let moveController = ui_util.CreateControllerPosition(frame, gui.eGuiControllerMoveType_Inertional, 500, ax, ay - 30, ax, ay - 30 - 40, gui.eGuiControllerMoveXYType_Frame, false)

		// let controller = ui_util.GuiControllerSequence(frame, positionController, timeController, moveController)
		// controller.SubscribeEvent(gui.IGuiController.FinishEvent, this.onCombatFrameFinishMove, this)

	}


	onCombatFrameFinishMove(args) {
		return this.hideWnd()
	}


	////////////////////////////////////////////////////////////////////
	showAwardInfo(content, color, awardActor) {
		if (!awardActor || !content || content == "") {
			return
		}

		this.content = content
		this.fontColor = color
		this.owner = awardActor
		return this.showWnd()
	}
}