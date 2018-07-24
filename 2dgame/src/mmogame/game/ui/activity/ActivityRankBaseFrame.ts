// TypeScript file
//排行界面的通用基类，主要实现genConfigList refreshItemWindow refreshHeroRank三个接口，如果有特殊调整，可以在子类先调用super.initItemWindow再创建子类适用的控件等
class ActivityRankBaseFrame extends BaseWnd {
    controlDataTable: any;
    scroll: UIScrollList;
    myRank: number
    myConfig: any

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/ActivityRankBaseLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true);
        this.initSkinElemList();

        let mElemInfo: any = [

            { ["name"]: "btn_close_top",    ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back",     ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)

        this.mElemList["reward_rd"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
    }

	initItemWindow(window) {
		let name = window.name

		let mElemInfo: any = [
			{ ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

            { ["index_type"] : eui.Label,		["name"] : name +"_rank",	["title"]: "",   		["font"] : "ht_22_cc",   ["color"] : gui.Color.ublack,		["x"] : 0,     ["y"] : 15,		["w"] : 80,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
			{ ["index_type"] : eui.Label,		["name"] : name +"_name",	["title"]: Localize_cns("BOSS_TXT12"),   		["font"] : "ht_22_cc",   ["color"] : gui.Color.ublack,		["x"] : 80,     ["y"] : 15,		["w"] : 140,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
			{ ["index_type"] : eui.Label,		["name"] : name +"_force",	["title"]: "",   		["font"] : "ht_22_cc",   ["color"] : gui.Color.orange,		["x"] : 220,    ["y"] : 15,		["w"] : 120,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
            { ["index_type"] : eui.Label,		["name"] : name +"_star",	["title"]: "",   		["font"] : "ht_22_cc",          ["color"] : gui.Color.saddlebrown,		["x"] : 370, ["y"] : 15,		["w"] : 160,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
            { ["index_type"] : gui.RichDisplayer,	["name"] : name +"reward_rd",	["font"] : "ht_20_cc",          ["color"] : gui.Color.white,		["x"] : 370, ["y"] : 15,		["w"] : 180,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
			
		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name + "reward_rd"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList[name + "reward_rd"].visible = false
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
	}

	refreshItemWindow(window, config, index?) {
		// let name = window.name

		// let [enable, des, str] = FastJumpSystem.getInstance().checkFastJump(config[0], config[1])
		// this.mElemList[name + "_option"].enabled = (enable)
		// AddRdContent(this.mElemList[name + "_dec"], des, "ht_24_cc", "zongse")
		// this.controlDataTable[name + "_option"] = config

		// this.mElemList[name + "_block"].visible = (!enable)
		// if (enable == false) {
		// 	this.controlDataTable[name + "_block"] = str
		// }
	}

    refreshFrame() {
        let list = this.genConfigList()//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let group = <eui.Group>this.mElemList["scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		this.controlDataTable = {}
		this.myConfig = null
        this.myRank = 0
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
            let [window, flag] = scroll.getItemWindow(k, group.width - 3, 60, 3, 5, 0)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v, k)
		}

        this.refreshHeroRank()
    }

    /////////////////////////////////////////////////////////////////
    genConfigList() {
        return [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
    }

    refreshHeroRank() {

    }
     //////////////////////////////////////////
     
}