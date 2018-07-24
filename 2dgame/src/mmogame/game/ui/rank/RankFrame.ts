
class RankFrame extends BaseWnd {

    emptyView: UIEmptyView;
    tabWndList: UITabWndList;
    tabIndex: number;
    scroll : UIScrollList
    radio_data;
    typeToIndexList;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/RankLayout.exml"]
        this.tabIndex = -1;
        this.typeToIndexList = {}
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList()
        this.setFullScreen(true)
       
        var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        // 
        let group : eui.Group = this.mElemList["group_tab"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)

        let tabInfoList = [
            {index: configRankType.RANK_PLR_FORCE,funcIndex:"",  wnd: RankPlrForcelWnd.newObj(this.mLayoutNode, this, configRankType.RANK_PLR_FORCE) ,titleText: Localize_cns("RANK_TXT6"),},
            {index: configRankType.RANK_PLR_LEVEL,funcIndex:"",   wnd: RankPlrLevelWnd.newObj(this.mLayoutNode, this, configRankType.RANK_PLR_LEVEL) ,titleText: Localize_cns("RANK_TXT7"),},
            {index: configRankType.RANK_PET_FORCE,funcIndex:"",   wnd: RankPetWnd.newObj(this.mLayoutNode, this, configRankType.RANK_PET_FORCE) ,titleText: Localize_cns("RANK_TXT8"),},
            {index: configRankType.RANK_XIAN_LV,funcIndex:"xianlv",   wnd: RankXianlvlWnd.newObj(this.mLayoutNode, this, configRankType.RANK_XIAN_LV) ,titleText: Localize_cns("RANK_TXT9"),},
            {index: configRankType.RANK_RIDE,funcIndex:"zuoqi",   wnd: RankRidelWnd.newObj(this.mLayoutNode, this, configRankType.RANK_RIDE),titleText: Localize_cns("RANK_TXT10"), },
            {index: configRankType.RANK_WING,funcIndex:"chibang",   wnd: RankWingWnd.newObj(this.mLayoutNode, this, configRankType.RANK_WING) ,titleText: Localize_cns("RANK_TXT11"),},
            {index: configRankType.RANK_TIAN_XIAN,funcIndex:"tianxian",   wnd: RankTianxianWnd.newObj(this.mLayoutNode, this , configRankType.RANK_TIAN_XIAN) ,titleText: Localize_cns("RANK_TXT12"),},
            {index: configRankType.RANK_PLR_IMMORTALS,funcIndex:"shenbing",   wnd: RankImmortalsWnd.newObj(this.mLayoutNode, this, configRankType.RANK_PLR_IMMORTALS) ,titleText: Localize_cns("RANK_TXT13"),}, 
            //法阵、仙位、通灵、兽魂、天女、仙器、花辇、灵气排行
            {index: configRankType.RANK_FA_ZHEN,funcIndex:"fazhen",   wnd: RankFaZhenWnd.newObj(this.mLayoutNode, this, configRankType.RANK_FA_ZHEN) ,titleText: Localize_cns("RANK_TXT14"),},
            {index: configRankType.RANK_XIAN_WEI,funcIndex:"xianwei",   wnd: RankXianWeiWnd.newObj(this.mLayoutNode, this, configRankType.RANK_XIAN_WEI) ,titleText: Localize_cns("RANK_TXT15"),},
            {index: configRankType.RANK_TONG_LING,funcIndex:"tongling",   wnd: RankTongLingWnd.newObj(this.mLayoutNode, this, configRankType.RANK_TONG_LING) ,titleText: Localize_cns("RANK_TXT16"),},
            {index: configRankType.RANK_SHOU_HUN,funcIndex:"shouhun",   wnd: RankShouHunWnd.newObj(this.mLayoutNode, this, configRankType.RANK_SHOU_HUN) ,titleText: Localize_cns("RANK_TXT17"),},
            {index: configRankType.RANK_TIAN_NV,funcIndex:"tiannv",   wnd: RankTianNvWnd.newObj(this.mLayoutNode, this, configRankType.RANK_TIAN_NV),titleText: Localize_cns("RANK_TXT18"), },
            {index: configRankType.RANK_XIAN_QI,funcIndex:"xianqi",   wnd: RankXianQiWnd.newObj(this.mLayoutNode, this, configRankType.RANK_XIAN_QI) ,titleText: Localize_cns("RANK_TXT19"),},
            {index: configRankType.RANK_HUAN_NIAN,funcIndex:"huanian",   wnd: RankHuaNianWnd.newObj(this.mLayoutNode, this , configRankType.RANK_HUAN_NIAN) ,titleText: Localize_cns("RANK_TXT20"),},
            {index: configRankType.RANK_LING_QI,funcIndex:"lingqi",   wnd: RankLingQigWnd.newObj(this.mLayoutNode, this, configRankType.RANK_LING_QI) ,titleText: Localize_cns("RANK_TXT21"),}, 
        ]
       
        this.radio_data = []
        for (let i = 0; i < size_t(tabInfoList); i++) {
            let v = tabInfoList[i]
            let checkInfo = this.checkRankIsOpen(v.funcIndex)
            if(checkInfo[0] == true){
                let [window, flag] = this.scroll.getItemWindow(v.index, 155, 71, 0, 0, 0)
                if (flag == true) {
                    this.initItemWindow(window , v)
                }
                this.refreshItemWindow(window, v)
                
                this.typeToIndexList[v.index] = this.radio_data.length - 1
            }
        }

        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, this.radio_data)
        
        //this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)


        this.mElemList["actorview"] = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_actorview"])
        this.mElemList["actorview2"] = UIActorView.newObj(this.mLayoutNode, "actorview", -40, 0, this.mElemList["group_actorview"])
        //this.mElemList["actorview"].updateByPlayer(20001)

        let list:eui.List = this.mElemList["list_rank"]
        list.itemRenderer = itemRender.RankItem
    }


    public onUnLoad(): void {

    }

    public onShow(): void {
      
        this.mLayoutNode.visible = true;
        this.tabWndList.setWndVisible(true);
        if (this.tabIndex != -1) {
            this.tabWndList.changeTabWithIndex(this.tabIndex)
        }

    }

    public onHide(): void {
       
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false);
    }

    checkRankIsOpen(funcIndex){
        // funcIndex = ""
        if(funcIndex == ""){
            return [true, ""] 
        }
        return CheckMainFrameFunction(funcIndex)
        // configRankType.RANK_PLR_FORCE
        // configRankType.RANK_PLR_LEVEL
        // configRankType.RANK_PET_FORCE
        // configRankType.RANK_XIAN_LV
        // configRankType.RANK_RIDE
        // configRankType.RANK_WING
        // configRankType.RANK_TIAN_XIAN
        // configRankType.RANK_PLR_IMMORTALS
        // //法阵、仙位、通灵、兽魂、天女、仙器、花辇、灵气排行
        // configRankType.RANK_FA_ZHEN
        // configRankType.RANK_XIAN_WEI
        // configRankType.RANK_TONG_LING
        // configRankType.RANK_SHOU_HUN
        // configRankType.RANK_TIAN_NV
        // configRankType.RANK_XIAN_QI
        // configRankType.RANK_HUAN_NIAN
        // configRankType.RANK_LING_QI
    }

    initItemWindow(window,data){
		let name = window.name
		let imageName = "sd_biaoQian02"
		let imageDownName = "sd_biaoQian01"
		let width = 155, height = 71
		let Info: any = [
               //背景
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: eui.RadioButton, ["name"]: name , ["image"]:imageName, ["font"]: "ht_20_cc_stroke",["image_down"]:imageDownName, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null},
			     { ["index_type"]: eui.Label, ["name"]: name + "text", ["parent"]: name, ["title"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
                ]	
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
	}

	refreshItemWindow(window, data){
		let name = window.name
		data.name = name
        this.mElemList[name+"text"].text = data.titleText
		table_insert(this.radio_data,data)
	}

    delayshowWnd = function(typeIndex?) {
        let index = 0
        if (typeIndex != null) {
            if (this.typeToIndexList[typeIndex]) {
                index = this.typeToIndexList[typeIndex]
            }
        }
        this.tabIndex = index;
        this.tabWndList.changeTabWithIndex(this.tabIndex)
        this.tabIndex = -1

        // DelayEvecuteFunc(0, this.showWnd, this)
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

    showWidthTypeIndex(typeIndex?) {
        if (this.isVisible() == false) {
            this.showWnd()
            this.doCommand("delayshowWnd", typeIndex)
        } else {
            this.delayshowWnd(typeIndex)
        }
        // if (this.mbLoad == false && this.mbLoadComplete == false) {
        //     this.doCommand("delayshowWnd", typeIndex)
        //     this.loadWnd()
        // } else {
        //     this.delayshowWnd(typeIndex)
        // }
    }
}
