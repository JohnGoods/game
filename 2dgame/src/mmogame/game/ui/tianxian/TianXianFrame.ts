// TypeScript file
class TianXianFrame extends BaseWnd {
    emptyView: UIEmptyView;
    tabWndList: UITabWndList;
    tabIndex: number;
    actor : UIActorView


    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/tianxian/TianXianLayout.exml"]
        this.tabIndex = -1;
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setFullScreen(true)

        var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
            { ["name"]: "anim_wnd", ["messageFlag"]: true }
				];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let tabInfoList = [
            { name: "tianxian", wnd: TianXian_GoddessWnd.newObj(this.mLayoutNode, this) },
            { name: "shenbing", wnd: TianXian_ArtifactWnd.newObj(this.mLayoutNode, this) },
            { name: "danyao", wnd: TianXian_PelletWnd.newObj(this.mLayoutNode, this) },
            { name: "jingmai", wnd: TianXian_MeridianWnd.newObj(this.mLayoutNode, this) },
        ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

        this.tabWndList.setSelectedCallback(this.refreshDotTips, this)

        this.actor  = <UIActorView>UIActorView.newObj(this.mLayoutNode, "actorView", 0, 0, this.mElemList["actor"])

    }


    public onUnLoad(): void {
        
    }

    public onShow(): void {
        RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
        //RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		//RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = true;
        this.tabWndList.setWndVisible(true);
        if (this.tabIndex != -1) {
            this.tabWndList.changeTabWithIndex(this.tabIndex)
        }

    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
        //UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		//UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false);

        let funActor:UIActorView = this.mElemList["fun_model"]
		if(funActor){
			funActor.clearView()
		}
		
		let actorView:UIActorView = this.mElemList["actorview"]
		if(actorView){
			actorView.clearView()
		}
		FunUITools.clearActorData(this)
    }

    /*onRefresh(){
        let wnd = this.tabWndList.getCurrentWnd()
        if (wnd) {
            wnd.onRefresh()
        }
    }*/
    ////////////////////红点提示/////////////////////
    //自定义红点继承实现
	refreshDotTipsImp() {
        FunUITools.refreshDanDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshEquipDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
        FunUITools.refreshSkillDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshUpgradeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
        FunUITools.refreshSkinDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
        FunUITools.refreshShootUpDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
        FunUITools.refreshFunPrizeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
        this.onRefreshDyDotTios()
    }

	getDotTipsArgsImp(checkParam) {
		let args: any = {}
		args.index = this.tabWndList.getTabIndex()
		args.type = this.tabWndList.getCurrentWnd().type
		return args
	}

    //动态红点
    onRefreshDyDotTios(){
        let danConfig = GameConfig.FunTianXianDanYaoConfig["TianXianDanYao"]
        for(let k in danConfig){
            let danInfo = danConfig[k]
            let check = GuideFuncSystem.getInstance().checkTianXianDanYao(danInfo)
            if(check){
                this.createDotTipsUI(this.mElemList["group_" + k])
            }
        }
        
    }
    
    ////////////////////////////////////////////////////////////////////////////////////
    //以0开头，0是第一个标签
    showWithIndex(index?) {
        if (index == null) {
            index = 0
        }
        this.tabIndex = index;
        this.showWnd();
    }


    ////////////////////----------
    onTipsClick(){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onTipsClick()
        }
    }
}