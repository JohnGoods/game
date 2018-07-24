// TypeScript file

class WuLinMapFrame extends BaseWnd {
	time:number
	overtimer

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/wulinmengzhu/WuLinMapLayout.exml"]
		this.overtimer = null
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreenRaw(true)
		this.initSkinElemList();

		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
		this.mLayoutNode.touchEnabled = false;

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.leaveMap },

			{ ["name"]: "rule_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.showRule },
			{ ["name"]: "rank_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.showRank },
		
			{ ["name"]: "task_pic", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.getReward },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		this.mElemList["task_rd"].setRowDistance(4)

		this.mElemList["autoAnim"].setAnimName("xinShouKuang")
	}

	public onUnLoad(): void {
		// this.resetClubMap()
	}

	public onShow(): void {
		RegisterEvent(EventDefine.WULIN_INFO_UPDATE, this.refreshFrame, this)
		this.refreshFrame();
		this.mLayoutNode.visible = true;
		this.mLayoutNode.moveToBack()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.WULIN_INFO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		if (this.overtimer) {
			KillTimer(this.overtimer)
			this.overtimer = null
		}
	}

	refreshFrame(){
		let level = ActivitySystem.getInstance().getWulinLevel() || 1
		if(level < 1){
			return
		}
		// if(this.mElemList["cur_level"]){
			let levelStr = String.format(Localize_cns("WULIN_TXT7"),level)
			this.mElemList["cur_level"].text = levelStr
		// }

		let isShowTip =  ActivitySystem.getInstance().getWuLinShowTip()
		if(isShowTip){
			MsgSystem.addTagTips(String.format(Localize_cns("WULIN_TXT11"),level))
			 ActivitySystem.getInstance().setWuLinShowTip(false)
		}

		if(this.overtimer == null){
			this.overtimer = SetTimer(this.creatTime, this, 1000, true)
		}
		
		

		let jifenInfo = ActivitySystem.getInstance().getWulinJinFenInfo()
		if(jifenInfo == null){
			return
		}
		let score = jifenInfo.score || 0
		let curIndex = jifenInfo.takeScoreIndex || 0
		let config = GameConfig.WuLinMengZhuScorePrizeConfig
		let info = config[curIndex+1]	//当前目标任务

		this.mElemList["autoAnim"].visible = false
		AddRdContent(this.mElemList["task_rd"], String.format(Localize_cns("WULIN_TXT21"),score), "ht_20_cc", "lime")

		if(info == null){
			return
		}

		let needScore = info.needScore
		let str = String.format(Localize_cns("WULIN_TXT5"),score,needScore)

		AddRdContent(this.mElemList["task_rd"], str, "ht_20_cc", "white")
		
		this.mElemList["autoAnim"].visible = (score>=needScore)
	}

	creatTime(){
		let curTime = GetServerTime()
		let overTime = this.time

		let time = overTime - curTime
		if(time< 0){
			time = 0
		}
		let timeStr = getFormatDiffTimeSimple(time)
		let str= String.format(Localize_cns("WULIN_TXT6"),timeStr)
		this.mElemList["time_text"].text = str
		
		if(time<=0){
			// let a = GetActivity(ActivityDefine.WuLin)
			// a.requestStop()
		}
	}

	leaveMap() {
		let msg = Localize_cns("WULIN_TXT20")
		var callback: IDialogCallback = {
		onDialogCallback(result: boolean, userData): void {
				if (result) {
                	let a = GetActivity(ActivityDefine.WuLin)
					a.requestStop()
				}
	    	}
        }
        MsgSystem.confirmDialog(msg, callback, null)
		
	}

	showRule(){
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("wulinRule")
	}

	showRank(){
		WngMrg.getInstance().showWindow("WuLinRankFrame")
	}	

	getReward(){
		let jifenInfo = ActivitySystem.getInstance().getWulinJinFenInfo()
		if(jifenInfo == null){
			return
		}
		let score = jifenInfo.score
		let curIndex = jifenInfo.takeScoreIndex || 0
		let config = GameConfig.WuLinMengZhuScorePrizeConfig
		let info = config[curIndex+1]	//当前目标任务
		if(info == null){
			return
		}

		let needScore = info.needScore
		if(score>=needScore){
			RpcProxy.call("C2G_GetWuLinMengZhuScorePrize",curIndex+1)
		}else{
			MsgSystem.addTagTips(Localize_cns("WULIN_TXT4"))
		}
	}

	setDataAndshowWnd(time){
		this.time = time
		this.showWnd()
	}	
}