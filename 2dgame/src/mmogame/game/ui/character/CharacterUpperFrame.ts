class CharacterUpperFrame extends BaseWnd {

	autoHideHpTimer: number;
	bShowHpSlotTimer: boolean;
	challengeHideHpTimer
	bShowChallengeTimer: boolean;

	Namecolor: string
	Namefont: string;
	timer: number;
	EndTime: number;
	bottoming: boolean;
	timerList: any
	challengeId: number;

	public initObj(...params: any[]) {
		//this.mLayoutPaths = ["resource/layouts/mainmenu/MainMenuLayout.exml"]
		this.bShowHpSlotTimer = false;
		this.bShowChallengeTimer = false
		this.timerList = {}
	}

	public onLoad(): void {



		var width = 250, height = 120;
		// // this.mLayoutNode.percentWidth = 100;
		// // this.mLayoutNode.percentHeight = 100;
		// UiUtil.setWH(this.mLayoutNode, width, height);
		// this.mLayoutNode.horizontalCenter = 0;
		// this.mLayoutNode.top = -height;

		this.mLayoutNode.percentWidth = 100;
		this.mLayoutNode.percentHeight = 100;

		this.mLayoutNode.touchChildren = true;
		this.mLayoutNode.touchEnabled = false;

		// var elemInfo = [
		// 	//对齐布局
		// 	//{ ["index_type"]: eui.Group, ["name"]: "layout", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null, ["touchEnabled"]:false},

		// 	{ ["index_type"]: gui.BatchImage, ["name"]: "hp_prgress", ["title"]: "", ["parent"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["top"]: -20, ["w"]: 100, ["h"]: 20, ["event_name"]: null, ["fun_index"]: null, },
		// 	{ ["index_type"]: eui.Label, ["name"]: "name", ["title"]: "", ["parent"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["bottom"]: -20, ["event_name"]: null, ["fun_index"]: null },
		// ]
		// UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this)



		let info: any = [
			{ ["index_type"]: eui.Group, ["name"]: "group_up", ["title"]: "", ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["top"]: -height, ["w"]: width, ["h"]: height, ["touchEnabled"]: false, ["touchChildren"]: false },

			{ ["index_type"]: gui.RichDisplayer, ["name"]: "name", ["title"]: null, ["font"]: "ht_24_cc_stroke", ["image"]: "", ["color"]: gui.Color.goldenrod, ["horizontalCenter"]: 0, ["bottom"]: -40, ["w"]: 500, ["h"]: 30, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "faction_name", ["title"]: null, ["font"]: "ht_24_cc_stroke", ["image"]: "", ["color"]: gui.Color.goldenrod, ["horizontalCenter"]: 0, ["bottom"]: -60, ["w"]: 250, ["h"]: 30, ["messageFlag"]: true },


			//{ ["index_type"]: eui.Group, ["name"]: "fightInfo_bg", 	  ["parent"]: "group_up",	["title"]: "", ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["x"]: 65, ["bottom"]: 30, ["w"]: 95, ["h"]: 80 },
			{ ["index_type"]: eui.Image, ["name"]: "fightState_icon", ["parent"]: "group_up", ["title"]: "", ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["bottom"]: 0, ["w"]: 65, ["h"]: 36, ["messageFlag"]: true },
			{ ["index_type"]: eui.Image, ["name"]: "state_icon", ["parent"]: "group_up", ["title"]: null, ["font"]: "", ["color"]: gui.Color.goldenrod, ["image"]: "", ["horizontalCenter"]: 0, ["bottom"]: 40, ["messageFlag"]: true },
			{ ["index_type"]: eui.Image, ["name"]: "combat_mark", ["parent"]: "group_up", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["bottom"]: 40, ["w"]: 49, ["h"]: 49, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

			{ ["index_type"]: gui.ProgressBar, ["name"]: "hp_prgress", ["parent"]: "group_up", ["font"]: null, ["image"]: "zd_xueTiaodi", ["thumbImage"]: "zd_xueTiao01", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["bottom"]: -10, ["w"]: 51, ["h"]: 12, ["messageFlag"]: true },


			{ ["index_type"]: eui.Image, ["name"]: "chengHao", ["parent"]: "group_up", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["bottom"]: 0, ["messageFlag"]: true },
			{ ["index_type"]: eui.Image, ["name"]: "baZhu", ["parent"]: "group_up", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "chengHao_icon44", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["bottom"]: 0, ["messageFlag"]: true },
			// { ["index_type"]: eui.Group, ["name"]: "group_challenge",["parent"]: "group_up", ["title"]: "", ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["top"]:  -height, ["w"]: width, ["h"]: height,},

			{ ["index_type"]: eui.Group, ["name"]: "group_challenge", ["title"]: "", ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["top"]: -height, ["w"]: width, ["h"]: height, },
			{ ["index_type"]: gui.Button, ["name"]: "challenge_btn", ["parent"]: "group_challenge", ["image"]: "ty_tongYongBt7", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 180, ["w"]: 60, ["h"]: 60, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChallengeClick },
			{ ["index_type"]: eui.Label, ["name"]: "challenge_btn_text", ["parent"]: "challenge_btn", ["title"]: Localize_cns("WULIN_TXT9"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 60, ["h"]: 60, ["messageFlag"]: true },
			{ ["index_type"]: gui.Button, ["name"]: "no_challenge_btn", ["parent"]: "group_challenge", ["image"]: "ty_tongYongBt7", ["color"]: gui.Color.white, ["x"]: 180, ["y"]: 180, ["w"]: 60, ["h"]: 60, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onNoChallengeClick },
			{ ["index_type"]: eui.Label, ["name"]: "no_challenge_btn_text", ["parent"]: "no_challenge_btn", ["title"]: Localize_cns("WULIN_TXT10"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 60, ["h"]: 60, ["messageFlag"]: true },

			{ ["index_type"]: eui.Group, ["name"]: "group_strongholdKey", ["horizontalCenter"]: 0, ["top"]: -height, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
			{ ["index_type"]: eui.Image, ["name"]: "strongholdkeyIcon", ["parent"]: "group_strongholdKey", ["image"]: "pf_yaoShi02", ["horizontalCenter"]: 0, ["bottom"]: -22, ["messageFlag"]: true },
			{ ["index_type"]: eui.Label, ["name"]: "strongholdkeyTime", ["parent"]: "group_strongholdKey", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.lime, ["horizontalCenter"]: 0, ["bottom"]: -48, ["w"]: 100, ["h"]: 35, ["messageFlag"]: true },
		]
		UiUtil.createElem(info, this.mLayoutNode, this.mElemList, this)


		//组队图标		
		// for (let i = 1; i <= 4; i++) {
		// 	let info: any = [
		// 		{ ["index_type"]: eui.Image, ["name"]: "icon" + i, ["title"]: "", ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 65, ["y"]: 0 + this.offset, ["w"]: 42, ["h"]: 42 },
		// 	]
		// 	UiUtil.createElem(info, this.mLayoutNode, this.mElemList, this)
		// 	//ui_util.CreateDrawRectPtr(this.mElemList["icon"..i], gui.Color32Half.orange)
		// }
		//全部默认隐藏
		this.onReset()

		if (TEST_UI_RECT) {
			UiUtil.forTestDrawBg(this.mLayoutNode);
		}
	}


	onReset(){
		for (let i in this.mElemList) {
			let v = this.mElemList[i]

			v.visible = (false)
			// v.visible = (true)
			// if(v.addChild)
			// 	UiUtil.forTestDrawBg(v);
		}

		this.mElemList["group_up"].visible = true;
		this.mElemList["group_challenge"].visible = true;
	}

	onChallengeClick(args) {
		let roleId = this.challengeId
		if (roleId < 0) {
			MsgSystem.addTagTips(Localize_cns("WULIN_TXT13"))
			return
		}
		let level = ActivitySystem.getInstance().getWulinLevel()
		let info = []
		info[0] = 2
		info[1] = roleId
		info[2] = level
		RpcProxy.call("C2G_WuLinMengZhuFight", info)
	}

	onNoChallengeClick(args) {
		this.mElemList["group_challenge"].visible = false
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		if (this.autoHideHpTimer != null) {
			KillTimer(this.autoHideHpTimer);
			this.autoHideHpTimer = null;
		}

		if (this.challengeHideHpTimer != null) {
			KillTimer(this.challengeHideHpTimer);
			this.challengeHideHpTimer = null;
		}



		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
			this.EndTime = 0
		}

		for (let k in this.timerList) {
			let timer = this.timerList[k]
			KillTimer(timer)
		}
		this.timerList = {}
	}



	setHpSlotVisible(visible) {
		this.mElemList["hp_prgress"].visible = visible;
		//UiUtil.forTestDrawBg(this.mElemList["hp_prgress"])
	}

	_setHpSlot(percent, pro_imagename) {
		var batchImage: gui.ProgressBar = this.mElemList["hp_prgress"];
		batchImage.thumbImage = pro_imagename
		UiUtil.updateProgress(batchImage, percent * 100, 100)
	}

	showCombatAutoHpSlot(percent, side) {
		let pro_image = "zd_xueTiao02"
		if (side == fightSide.FIGHT_RIGHT) {
			pro_image = "zd_xueTiao01"
		}
		this._setHpSlot(percent, pro_image)
		this.setHpSlotVisible(true)
		this.bShowHpSlotTimer = (this.autoHideHpTimer != null)

		if (!this.autoHideHpTimer) {
			var hideHpCallback = function (dt) {
				if (this.bShowHpSlotTimer == false) {
					KillTimer(this.autoHideHpTimer)
					this.autoHideHpTimer = null
					// this.setHpSlotVisible(false)
				}

				this.bShowHpSlotTimer = false//XX毫秒后检查，如果没有再次调用就隐藏了
			}
			this.autoHideHpTimer = SetTimer(hideHpCallback, this, 1000)
		}
	}


	updateChallengeTick(visible, roleId?) {
		this.challengeId = -1
		if (roleId) {
			this.challengeId = roleId
		}
		if (visible == true) {
			if (this.mElemList["group_challenge"]) {
				this.mElemList["group_challenge"].visible = true
				this.mElemList["challenge_btn"].visible = true;
				this.mElemList["challenge_btn_text"].visible = true;
				this.mElemList["no_challenge_btn"].visible = true;
				this.mElemList["no_challenge_btn_text"].visible = true;
			}
		} else {
			if (this.mElemList["group_challenge"]) {
				this.mElemList["group_challenge"].visible = false
			}
		}

		// this.bShowChallengeTimer = (this.challengeHideHpTimer != null)

		// if (!this.challengeHideHpTimer) {
		// 	var hideCallback = function (dt) {
		// 		// if (this.bShowChallengeTimer == false) {
		// 			KillTimer(this.challengeHideHpTimer)
		// 			this.challengeHideHpTimer = null
		// 			this.mElemList["group_challenge"].visible = false
		// 		// }
		// 		// this.bShowChallengeTimer = false//
		// 	}
		// 	this.challengeHideHpTimer = SetTimer(hideCallback, this, 1000 * 5)
		// }
	}





	setFightStateVisible(visible, imageName?, remainTime?) {
		if (this.timerList["fightState"]) {
			KillTimer(this.timerList["fightState"])
			delete this.timerList["fightState"]
		}

		this.mElemList["fightState_icon"].visible = (visible)
		this.mElemList["fightState_icon"].source = (imageName)

		if (visible == true && remainTime != null && remainTime > 0) {
			let tick = function (delay) {
				this.mElemList["fightState_icon"].visible = false

				if (this.timerList["fightState"]) {
					KillTimer(this.timerList["fightState"])
					delete this.timerList["fightState"]
				}
			}
			this.timerList["fightState"] = SetTimer(tick, this, remainTime)
		}
	}



	//令牌、队长、战斗、暴徒
	setMoreIcon(visible, playinfo) {
		//TLog.Debug("CharacterUpperFrame.setMoreIcon",playinfo.status )
		// for (let i = 1; i <= 4; i++) {
		// 	//this.mElemList["icon"+i].enabled = (true)			
		// 	this.mElemList["icon" + i].visible = (false)
		// }
		// if (!visible) {
		// 	this.updateIconRDPos()
		// 	return
		// }

		// let x = 0
		// let count = 0
		// let IconIndex: any = {}
		// let width = this.mLayoutNode.width
		// let oddMIdX = (width - 50) / 2
		// let list = {
		// 	[1]: [oddMIdX],
		// 	[2]: [1 * (width / 4), 2 * (width / 4)],
		// 	[3]: [oddMIdX - 50, oddMIdX, oddMIdX + 50],
		// 	[4]: [0, 1 * (width / 4), 2 * (width / 4), 3 * (width / 4)],
		// }

		this.mElemList["chengHao"].visible = true
		this.mElemList["baZhu"].visible = false
		let playinfo1 = playinfo
		if (playinfo.status) {
			// if (playinfo.status == 16) {
			// 	this.mElemList["baZhu"].visible = true
			// 	this.mElemList["chengHao"].visible = false
			// }
			if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_MENGZHU) == opStatusType.STATUS_TYPE_MENGZHU) {
				this.mElemList["baZhu"].visible = true
				this.mElemList["chengHao"].visible = false
			}
			// if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_FIGHT) == opStatusType.STATUS_TYPE_FIGHT) {
			// 	count = count + 1
			// 	IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_FIGHT]
			// }
		}

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_TICKET) == opStatusType.STATUS_TYPE_TICKET) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_TICKET]
		// 	}

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_TEAM) == opStatusType.STATUS_TYPE_TEAM) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_TEAM]			
		// 	} else if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_TEAMMATE) == opStatusType.STATUS_TYPE_TEAMMATE) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_TEAMMATE]
		// 		//this.mElemList["icon"..count].enabled = (false)
		// 	}

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_EREN) == opStatusType.STATUS_TYPE_EREN) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_EREN]
		// 	} else if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_BAOTU) == opStatusType.STATUS_TYPE_BAOTU) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_BAOTU]
		// 	} else if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_MOTOU) == opStatusType.STATUS_TYPE_MOTOU) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_MOTOU]
		// 	}

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_NORMAL_FLAG) == opStatusType.STATUS_TYPE_NORMAL_FLAG) {
		// 		count = count + 1
		// 		IconIndex[count] = "TB_qiZhi02"
		// 	} else if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_SENIOR_FLAG) == opStatusType.STATUS_TYPE_SENIOR_FLAG) {
		// 		count = count + 1
		// 		IconIndex[count] = "TB_qiZhi01"
		// 	} 

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_EMPTY_FIGHT) == opStatusType.STATUS_TYPE_EMPTY_FIGHT) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_EMPTY_FIGHT]
		// 	}

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_ROBBER_BBOX) == opStatusType.STATUS_TYPE_ROBBER_BBOX) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_ROBBER_BBOX]
		// 	}

		// 	if (bit.band(playinfo.status, opStatusType.STATUS_TYPE_FACT_WAR) == opStatusType.STATUS_TYPE_FACT_WAR) {
		// 		count = count + 1
		// 		IconIndex[count] =  PlayerStatusToImage[opStatusType.STATUS_TYPE_FACT_WAR]
		// 	}


		// }

		// if(count > 4){
		// 	count = 4
		// }

		// //TLog.Assert(count <= 4)
		// let set_y = 40 + this.offset
		// if (this.mElemList["faction_name"].visible) {
		// 	set_y = set_y - 30
		// }
		// if (this.timer) {
		// 	set_y = set_y - 20
		// }
		// //TLog.Debug("CharacterUpperFrame.setMoreIcon",set_y)
		// for (let i = 1; i <= count; i++) {
		// 	this.mElemList["icon" + i].visible = (visible)
		// 	this.mElemList["icon" + i].source = (IconIndex[i])

		// 	UiUtil.setXY(this.mElemList["icon" + i], list[count][i - 1], set_y + this.getChengHaoOffsetY())
		// }
		// this.updateIconRDPos()
	}


	setCombatMaikVisible(visible) {
		this.mElemList["combat_mark"].visible = (visible)
	}



	//文字
	setNameTitle(name, level, color) {
		if (!name || name == "") {
			this.mElemList["name"].visible = (false)
		} else {
			this.mElemList["name"].visible = (true)
			//this.mElemList["name"].text = (name)
			let rd = this.mElemList["name"]
			let fontInfo: any = {}
			let text
			if (level && level != "") {
				text = level + "#rf" + name
			} else {
				text = name
			}
			//TLog.Debug("setNameTitle( name, level, color){",this.Namecolor)
			if (!this.Namecolor) {
				this.Namecolor = "aquamarine"
			}

			if (!this.Namefont) {
				this.Namefont = "ht_18_cc_stroke"
			}
			//UiUtil.setXY(rd, -125, 80 + this.offset)
			UiUtil.setWH(rd, 500, 30)

			rd.source = ("")
			//TLog.Debug("setNameTitle", rd.y,this.mElemList["faction_name"]:y)
			fontInfo.default_color = this.Namecolor
			fontInfo.defalut_font = this.Namefont
			fontInfo.no_change_font = true
			//fontInfo.no_change_color = true
			rd.setAlignFlag(gui.Flag.H_CENTER)
			rd.clear()
			rd.addXmlString(XmlConverter.parseText(text, fontInfo))
			//rd.showLastRow()
			//TLog.Debug("22222222222222222222222", this.Namefont, this.Namecolor, text)
			//ui_util.CreateDrawRectPtr(this.mLayoutNode, gui.Color32Half.green)
			//

		}
	}

	setNameColor(color, bottoming) {
		//this.mElemList["name"].textColor = (color)
		this.Namecolor = color
		this.bottoming = bottoming
	}

	setNameFont(font) {
		//this.mElemList["name"]:SetFontName(font)
		this.Namefont = font
	}

	//图标
	setStateIcon(imageName, visible) {
		this.mElemList["state_icon"].source = (imageName)
		this.mElemList["state_icon"].visible = (visible)
	}


	//////////////////////////////////////////////////////////////////////////////////////-
	////头顶倒计时
	setTimeCountDown(visible, Time) {

	}


	//////////////////////////////////////////////////////////////////////////////////////-
	////////////////-军团信息////////////-
	setFactionNameTitle(str, font, color) {
		let rd = this.mElemList["faction_name"]
		if (!str || str == "") {
			rd.visible = (false)
		} else {
			let fontInfo: any = {}
			fontInfo.default_color = color || "aquamarine"
			fontInfo.defalut_font = font || "ht_18_cc_stroke"
			fontInfo.no_change_font = true
			rd.visible = (true)
			rd.setAlignFlag(gui.Flag.H_CENTER)
			rd.clear()
			rd.addXmlString(XmlConverter.parseText(str, fontInfo))
			//rd.showLastRow()

			//UiUtil.setWH(rd, 0, 60 + this.offset)//设置军团信息坐标
			UiUtil.setWH(rd, 250, 30)
		}

	}


	setChengHaoTitle(chengHaoId) {
		if (chengHaoId == 0) {
			this.mElemList["chengHao"].visible = (false)
			return
		}

		let imagetName = GetShapeImage(chengHaoId)
		this.mElemList["chengHao"].visible = (true)
		this.mElemList["chengHao"].source = imagetName

	}


	setStrongholdKeyVisible(playerId, status) {
		if (this.timerList["strongholdKeyState"]) {
			KillTimer(this.timerList["strongholdKeyState"])
			delete this.timerList["strongholdKeyState"]
		}
		if (bit.band(status, opStatusType.STATUS_TYPE_FIGHT) == opStatusType.STATUS_TYPE_FIGHT) {
			this.mElemList["group_strongholdKey"].visible = false
			return
		}

		this.mElemList["strongholdkeyTime"].visible = false
		if (bit.band(status, opStatusType.STATUS_TYPE_TICKET) == opStatusType.STATUS_TYPE_TICKET) {
			this.mElemList["group_strongholdKey"].visible = true
			this.mElemList["strongholdkeyIcon"].visible = true
		} else {
			this.mElemList["group_strongholdKey"].visible = false
			return
		}

		if (playerId == GetHeroProperty("id")) {
			let info = getSaveRecord(opSaveRecordKey.robberTicket) || []
			let stime = info[1] ? info[1] : 0
			if (stime > 0 && this.mElemList["group_strongholdKey"].visible == true) {
				this.mElemList["strongholdkeyTime"].visible = true
				let tick = function (delay) {
					let leftTime = stime + 120 - GetServerTime()
					if (leftTime > 0) {
						let mins = Math.floor(leftTime / 60)
						let secs = leftTime - mins * 60
						this.mElemList["strongholdkeyTime"].text = String.format("%02d:%02d", mins, secs)//Localize_cns("STRONGHOLD_TEXT29") + String.format("%02d:%02d", mins, secs)
					} else {
						//this.mElemList["strongholdkeyTime"].text = Localize_cns("STRONGHOLD_TEXT29")
						this.mElemList["strongholdkeyTime"].visible = false
						if (this.timerList["strongholdKeyState"]) {
							KillTimer(this.timerList["strongholdKeyState"])
							delete this.timerList["strongholdKeyState"]
						}
					}
				}
				this.timerList["strongholdKeyState"] = SetTimer(tick, this, 1000, true)
			}
		}
	}







}