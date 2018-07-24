/*
作者:
    lintianfeng
	
创建时间：
   2013.8.14(周三)

意图：
   确认提示框

公共接口：
 	setMsgText( msgText){
 	setOkText( text){
 	setOkImage( ImageName){
 	setOkWH(width,height){ 	
  setOkXY(x,y){
	setCancelText( text){
 	setCancelImage( ImageName){
 	setCancelWH(width,height){ 	
  setCancelXY(x,y){
	

 
*/

class ConfirmFrame extends BaseWnd {
	msgData
	timerList
	public initObj(...args: any[]): void {
		this.msgData = null

	}

	onLoad() {
		this.timerList = {}
		this.createLayout()
	}

	onUnLoad() {

	}

	onShow() {
		this.mLayoutNode.visible = true;
		this.refreshUI()

		let callbackObject = this.msgData.callbackData.ret
		let callbackUserData = this.msgData.callbackData.userData

		//给个机会自定义窗口内容
		// if (callbackObject && callbackObject.DialogShowCallBack) {
		// 	callbackObject.DialogShowCallBack.call(this, callbackUserData)
		// }

	}

	onHide() {
		this.mLayoutNode.visible = false;

		for (let _ in this.timerList) {
			let timer = this.timerList[_]

			KillTimer(timer)
		}
		this.timerList = {}
	}

	createLayout() {
		this.mLayoutNode.percentWidth = 100;
		this.mLayoutNode.percentHeight = 100;


		this.mElemList = {}

		
		let ElemInfo: any = [



			//{["index_type"] : gui.ControlType.Label,  					["name"] : "wnd1", 			["scale_image"] : "ty_UIBg01", ["x"] : 0, 	["y"] : 0, 	 ["w"] : 640,  ["h"] : 960,  ["event_name"] : null, ["fun_index"] : null,},  						
			{ ["index_type"]: eui.Rect, ["name"]: "bg",  ["color"]: gui.Color.black, ["alpha"]: 0.5, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null, ["touchChildren"]:true,},
			//{ ["index_type"]: gui.Button, ["name"]: "close_btn", ["parent"]: "wnd", ["title"]: Localize_cns("SURE"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 260, ["y"]: 540,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.OnClose, },


			{ ["index_type"]: eui.Group, ["name"]: "wnd",  ["horizontalCenter"]: 0, ["verticalCenter"]: 0, ["w"]: 510, ["h"]: 320, ["event_name"]: null, ["fun_index"]: null, },
			{ ["index_type"]: gui.Grid9Image, ["name"]: "bgimg", ["parent"]: "wnd", ["image"]: "ty_uiDi01", ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null, },
			{ ["index_type"]: eui.Image, ["name"]: "bgtitle", ["parent"]: "wnd", ["title"]: null, ["font"]: null, ["image"]: "ty_uiBiaoTiDi01", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["y"]: 0,  ["event_name"]: null, ["fun_index"]: null },
			{ ["index_type"]: gui.Grid9Image, ["name"]: "bgimg2", ["parent"]: "wnd", ["image"]: "ty_uiDi02", ["left"]: 40, ["top"]: 55, ["right"]: 45, ["bottom"]: 100, ["event_name"]: null, ["fun_index"]: null, },
			{ ["index_type"]: eui.Label, ["name"]: "wnd_title", ["parent"]: "wnd", ["title"]: Localize_cns("CONFIRM_TITLE"), ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 3, ["w"]: 510, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null },

			{ ["index_type"]: gui.RichDisplayer, ["name"]: "text", ["parent"]: "wnd", ["title"]: null, ["font"]: "ht_24_lc", ["color"]: gui.Color.yellow, ["x"]: 60, ["y"]: 80, ["w"]: 400, ["h"]: 105, ["messageFlag"]: true, },

			{ ["index_type"]: gui.Button, ["name"]: "cancel", ["parent"]: "wnd", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["title"]: Localize_cns("CANCEL"), ["image"]: "ty_tongYongBt1", ["right"]: 70, ["bottom"]: 32,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.OnClickCancel },
			{ ["index_type"]: gui.Button, ["name"]: "ok", ["parent"]: "wnd", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["title"]: Localize_cns("SURE"), ["image"]: "ty_tongYongBt1", ["left"]: 70, ["bottom"]: 32,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.OnClickOK },
			{ ["index_type"]: gui.Button, ["name"]: "okYes", ["parent"]: "wnd", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["title"]: Localize_cns("SURE"), ["image"]: "ty_tongYongBt1", ["horizontalCenter"]: 0, ["bottom"]: 32,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.OnClose },


			{ ["index_type"]: eui.Group, ["name"]: "doNotAskToday", ["parent"]: "wnd",  ["horizontalCenter"]: 0, ["bottom"]: -60, ["w"]: 240, ["h"]: 55, ["event_name"]: null, ["fun_index"]: null },
			{ ["index_type"]: gui.Grid9Image, ["name"]: "doNotAskTodaybg",  ["parent"]: "doNotAskToday", ["image"]: "ty_tipsDi", ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null },
			{ ["index_type"]: eui.CheckBox, ["name"]: "gouXuan", ["parent"]: "doNotAskToday", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_xuanZheDi01", ["image_down"]: "ty_xuanZhe01",  ["color"]: gui.Color.white, ["x"]: 5, ["y"]: 2, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
			{ ["index_type"]: eui.Label, ["name"]: "toDayTips", ["parent"]: "doNotAskToday", ["title"]: Localize_cns("COMMON_TXT4"), ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 60, ["y"]: 0, ["w"]: 150, ["h"]: 49, ["event_name"]: null, ["fun_index"]: null },

		]

		UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this)
		
		this.mElemList["text"].setAlignFlag(gui.Flag.CENTER_CENTER)
		this.mLayoutNode.setLayer(gui.GuiLayer.Top)
	}

    setTitle(text) {
		this.mElemList["wnd_title"].text = text
	}

	setMsgData(msgData) {
		this.msgData = msgData
	}


	setMsgText(msgText) {
		AddRdContent(this.mElemList["text"], msgText, "ht_24_cc_stroke_zongse", "white", 3)
	}

	setOkText(text) {
		this.mElemList["ok"].text = (text)
	}

	setOkImage(ImageName) {
		this.mElemList["ok"].source = (ImageName)
	}

	setOkWH(width, height) {
		UiUtil.setWH(this.mElemList["ok"], width, height)
	}

	setOkXY(x, y) {
		UiUtil.setXY(this.mElemList["ok"], x, y)
	}

	setCancelText(text) {
		this.mElemList["cancel"].text = (text)
	}

	setCancelImage(ImageName) {
		this.mElemList["cancel"].source = (ImageName)
	}

	setCancelWH(width, height) {
		UiUtil.setWH(this.mElemList["cancel"], width, height)
	}

	setCancelXY(x, y) {
		UiUtil.setXY(this.mElemList["cancel"], x, y)
	}

	refreshUI() {
		this.setMsgText(this.msgData.msg)

		let baseH = 100				//rd的基本高度
		let rdH = AdjustRdContentViewH(this.mElemList["text"], baseH)

		UiUtil.setWH(this.mElemList["wnd"], 510, 315 + rdH - baseH)
		//UiUtil.setXY(this.mElemList["bg"], 0, 420 - rdH + baseH)
		//UiUtil.setXY(this.mElemList["countDownTime"], 200, 350 - rdH + baseH)


		let userData = this.msgData.callbackData.userData
		if (userData == null || !table_isExist(ConfirmFrom, userData)) {
			this.mElemList["doNotAskToday"].visible = (false)
		}

		if (userData && table_isExist(ConfirmFrom, userData)) {
			this.mElemList["doNotAskToday"].visible = (true)
			this.mElemList["gouXuan"].selected = (false)
		}

		//this.refreshCheckBox()
		if (this.msgData.dialogType == CONFIRM_DIALOG_YES_OR_NO) {
			this.mElemList["cancel"].visible = (true)
			this.mElemList["ok"].visible = (true)
			this.mElemList["okYes"].visible = (false)
		} else if (this.msgData.dialogType == CONFIRM_DIALOG_YES) {
			this.mElemList["cancel"].visible = (false)
			this.mElemList["ok"].visible = (false)
			this.mElemList["okYes"].visible = (true)
		}

		//倒计时
		// if (this.timerList["countDownTime"]) {
		// 	KillTimer(this.timerList["countDownTime"])
		// 	delete this.timerList["countDownTime"]
		// }

		// if (this.msgData.callbackData.ret && this.msgData.callbackData.ret.countDownTime && this.msgData.callbackData.ret.countDownTime > 0) {
		// 	this.mElemList["countDownTime"].visible = (true)

		// 	let leftTime = this.msgData.callbackData.ret.countDownTime
		// 	let tick =function (delay) {
		// 		leftTime = leftTime - delay / 1000

		// 		let lTime = Math.ceil(leftTime)					//Math.ceil(0.5)=-0
		// 		if (leftTime < 0 && leftTime > -1) {
		// 			lTime = 0
		// 		}

		// 		if (lTime < 0) {
		// 			if (this.timerList["countDownTime"]) {
		// 				KillTimer(this.timerList["countDownTime"])
		// 				delete this.timerList["countDownTime"]
		// 			}
		// 			this.mElemList["countDownTime"].visible = (false)
		// 		}

		// 		this.mElemList["countDownTime"].text = getFormatDiffTime(lTime)

		// 		//更新描述文字
		// 		if (this.msgData.callbackData.ret.updateMsg) {
		// 			let msg = this.msgData.callbackData.ret.updateMsg(leftTime)
		// 			this.setMsgText(msg)
		// 		}
		// 	}
		// 	this.timerList["countDownTime"] = SetTimer(tick, this, 100, true)
		// } else {
		// 	this.mElemList["countDownTime"].visible = (false)
		// }
	}

	// refreshCheckBox() {
	// 	if (this.mElemList["gouXuan"]:GetCheck() == true ){
	// 		this.mElemList["gouXuan_tick"].visible = (true)
	// 		this.mElemList["gouXuan"].source = ("ty_tipsXuanZhe01")
	// 	}else{
	// 		this.mElemList["gouXuan_tick"].visible = (false)
	// 		this.mElemList["gouXuan"].source = ("ty_tipsXuanZhe02")
	// 	}
	// }

	OnClickCancel(args) {
		this.hideWnd()
		if(this.msgData.callback ){
		if(table_isExist(ConfirmFrom, this.msgData.callbackData.userData) ){
			//选中,记录当前提示框今天内不在出现
			let todayNoTips = this.mElemList["gouXuan"].selected
				//更新今天不再提示的提示框
				if(todayNoTips ){
					let todayNoNotifyStr = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING, "todayNoNotify", table_save({}) )

					let todayNoNotify = table_load(todayNoNotifyStr)
					todayNoNotify[this.msgData.callbackData.userData] = GetServerTime()
					IGlobal.setting.setRoleSetting(UserSetting.TYPE_STRING, "todayNoNotify", table_save(todayNoNotify))
				}
			}
			
			this.msgData.callback.onDialogCallback(false,this.msgData.callbackData)
		}
	}


	OnClickOK(args) {
		this.hideWnd()
		if(this.msgData.callback ){
			if (table_isExist(ConfirmFrom, this.msgData.callbackData.userData)) {
				//选中,记录当前提示框今天内不在出现
				let todayNoTips = this.mElemList["gouXuan"].selected
				//更新今天不再提示的提示框
				if (todayNoTips) {

					let todayNoNotifyStr = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING, "todayNoNotify", table_save({}) )

					let todayNoNotify = table_load(todayNoNotifyStr)
					todayNoNotify[this.msgData.callbackData.userData] = GetServerTime()
					IGlobal.setting.setRoleSetting(UserSetting.TYPE_STRING, "todayNoNotify", table_save(todayNoNotify))
				}
			}
			this.msgData.callback.onDialogCallback(true,this.msgData.callbackData)
		}
	}


	OnClose() {
		this.hideWnd()
		if(this.msgData.callback ){
			this.msgData.callback.onDialogCallback(true,this.msgData.callbackData)
		}
	}

}