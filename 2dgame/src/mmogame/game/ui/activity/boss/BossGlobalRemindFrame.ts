// TypeScript file
class BossGlobalRemindFrame extends BaseWnd {
    controlDataTable: any;
    checkIndexList: any;

    public initObj(...params: any[]) {
        this.checkIndexList = null
        this.mLayoutPaths = ["resource/layouts/boss/BossGlobalRemindLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true);
        this.initSkinElemList();

        let mElemInfo: any = [

        //     { ["index_type"]: gui.Grid9Image, ["name"]: "bg_", ["title"]: null, ["font"]: null, ["image"]: "ty_UIDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_UIBg02", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 30, ["w"]: 540, ["h"]: 376, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.RichDisplayer, ["name"]: "emailMsg", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 44, ["y"]: 40, ["w"]: 480, ["h"]: 200, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.RichDisplayer, ["name"]: "prizePoint_rd", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 64, ["y"]: 260, ["w"]: 522, ["h"]: 60, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.Button, ["name"]: "confirmBtn", ["title"]: Localize_cns("SURE"), ["font"]: "ht_24_cc_stroke_saddlebrown", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 215, ["y"]: 432, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickConfirmBtn },
                { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null,  ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
                { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,  ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickClose },
         ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        let list: eui.List = this.mElemList["remind_list"]
        list.itemRenderer = itemRender.BossGlobalRemindListItem

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

        this.checkIndexList = null
    }

    refreshFrame() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
        // {
        //         npcList: {[npcIndex]:{refreshTime: 123 否则为0, plrCount: 123 争夺人数, hpPercent: 0.5 boss血量百分比}},
        //         fightCount: 总战斗次数,
        //         refreshTime: 我的次数刷新时间,
        //         remainCount: 我的剩余战斗次数,
        //         remindTimeList: [npcIndex, npcIndex]
        // }
        let npcList = {}
        if (actInfo && actInfo.npcList) {
            npcList = actInfo.npcList

            if (this.checkIndexList == null) {
                this.checkIndexList = table_copy(actInfo.remindTimeList) || []
            }
        }

        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let heroLevel = GetHeroProperty("level")
        for (let k in GameConfig.BossGlobalConfig){
            let v = GameConfig.BossGlobalConfig[k]
            if(heroLevel >= v.level - 10) {
                if (heroLevel >= v.level) {
                    table_insert(list, [this, v])
                }
            }
        }
        table_sort(list, function(a, b) {return b[1].level - a[1].level})

        let eList: eui.List = this.mElemList["remind_list"]
        UiUtil.updateList(eList, list);
    }

     //////////////////////////////////////////
     onClickClose(args) {
         RpcProxy.call("C2G_SetActivityInfo", OrdinaryActivityIndex.WorldPlayerBoss, this.checkIndexList)

         this.hideWnd()
     }
}

module itemRender {
    export class BossGlobalRemindListItem extends eui.ItemRenderer {
        mElemList: any;

        constructor() {
            super();
            this.mElemList = {}
            let w = 553
            let h = 60

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

                { ["index_type"] : eui.Label,		["name"] : "_name",	["title"]: Localize_cns("BOSS_TXT12"),   		["font"] : "ht_22_lc",   ["color"] : gui.Color.ublack,		["x"] : 30,     ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_level",	["title"]: 356,   		["font"] : "ht_22_lc",   ["color"] : gui.Color.ublack,		["x"] : 250,    ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.CheckBox,    ["name"]: "_remind", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_xuanZheDi01", ["image_down"]: "ty_xuanZhe01",  ["color"]: gui.Color.white, ["x"]: 350, ["y"]: 5, ["event_name"]: egret.Event.CHANGE, ["fun_index"]: this.onCheckChange },
                { ["index_type"] : eui.Label,		["name"] : "_tips",	["title"]: Localize_cns("BOSS_TXT26"),   		["font"] : "ht_22_lc",          ["color"] : gui.Color.saddlebrown,		["x"] : 400, ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)

            this.height = h + 7
        }

        protected dataChanged(): void {
            let self = this.data[0]
            let config = this.data[1]
                
            let monName = GetMonsterName(config.entryId)
            this.mElemList["_name"].text = monName
            this.mElemList["_level"].text = config.level
            this.mElemList["_remind"].selected = table_isExist(self.checkIndexList, config.index)
        }
        ////////////////////////////////////////////////////////////////////////////////////
        onCheckChange(args) {
            let self = this.data[0]
            let index = this.data[1].index

            let state = args.target.selected
            if (state == false) {
                table_remove(self.checkIndexList, index)
            } else {
                if (table_isExist(self.checkIndexList, index) == false) {
                    table_insert(self.checkIndexList, index)
                }
            }
        }
    }
}