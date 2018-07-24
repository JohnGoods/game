class CopyMaterialWindow extends BaseCtrlWnd {
    //controlDataTable: any;
    //scroll: UIScrollList;

    public initObj(...params: any[]) {
        //this.controlDataTable = {};
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        // var elemInfo = [
        //     { ["name"]: "ug_pokedex_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPokedex }, //图鉴
        //     { ["name"]: "ug_force_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceBtn },
        //     { ["name"]: "ug_btn_show", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShow },
        //     { ["name"]: "ug_btn_embattle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEmbattle },
        //     { ["name"]: "ug_btn_natural", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNatural },
        //     { ["name"]: "ug_btn_changename", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChangeName },
        //     { ["name"]: "up_add_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddition },
        //     { ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
        //     { ["name"]: "auto_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade }, //自动升级
        //     { ["name"]: "active_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickActive },
        // ];

        // UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        let list: eui.List = this.mElemList["cailiao_scroll_list"]
        list.itemRenderer = itemRender.CopyMaterialItem

        //let group = <eui.Group>this.mElemList["cailiao_scroll_group"]
        //this.scroll = UIScrollList.newObj(this.mLayoutNode, "cailiao_scroll", 0, 0, group.width, group.height, group)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroUpdate, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["cailiao_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("COPY_TXT1")

        this.applyActInfo()
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroUpdate, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["cailiao_group"].visible = false
    }

    refreshFrame() {
        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let notOpenList = []
        let heroLevel = GetHeroProperty("level")
        for (let k in GameConfig.CopyMaterialConfig) {
            let v = GameConfig.CopyMaterialConfig[k]
            if (heroLevel >= v.level) {
                table_insert(list, v)
            } else {
                if (notOpenList.length <= 0) {
                    table_insert(notOpenList, v)
                }
            }
        }
        table_sort(list, function (a, b) { return a.level - b.level })
        table_merge(list, notOpenList)

        let scroll_list: eui.List = this.mElemList["cailiao_scroll_list"]
        UiUtil.updateList(scroll_list, list);

    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.MaterialBoss)
    }

    updateWnd() {
        return this.refreshFrame()
    }

    onHeroUpdate(args) {
        if (args.newProperty.VIP_level == null || args.newProperty.gold == null) {
            return
        }

        return this.refreshFrame()
    }

    //红点提示
    refreshDotTipsImp() {
        // let list = []
        // for (let k in GameConfig.CopyMaterialConfig) {
        //     let v = GameConfig.CopyMaterialConfig[k]
        //     table_insert(list, v)
        // }
        // table_sort(list, function (a, b) { return a.level - b.level })

        // let group = <eui.Group>this.mElemList["cailiao_scroll_group"]
        // for (let i = 0; i < size_t(list); i++) {
        //     let window = this.scroll.getItemWindow(i, group.width - 3, 150, 0, 5, 0)
        //     let name = window.name
        //     let data = this.controlDataTable[name + "_sweap"]
        //     if (data && data[0] == 1) { //1表示免费扫荡
        //         this.mParentWnd.createDotTipsUI(this.mElemList[name + "_sweap"])
        //     }
        // }
        this.refreshFrame()
    }


}


module itemRender {
    export class CopyMaterialItem extends eui.ItemRenderer {
        mElemList: any;
        controlDataTable:any;
        constructor() {
            super();
            this.mElemList = {}
            this.controlDataTable = {}

            this.width = 500
            this.height = 150

            let name = "item"


            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Image, ["name"]: name + "_namebg", ["title"]: null, ["font"]: null, ["image"]: "fb_biaoTiDi01", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 5, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Label, ["name"]: name + "_name", ["title"]: Localize_cns("ROLE_TXT32"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 10, ["w"]: 263, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },
                { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_leftTime", ["font"]: "ht_20_rc", ["color"]: gui.Color.brown, ["x"]: 300, ["y"]: 15, ["w"]: 240, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },
                { ["index_type"]: gui.Button, ["name"]: name + "_enter", ["title"]: Localize_cns("COPY_TXT6"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt3", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 350, ["y"]: 60, ["w"]: 150, ["h"]: 60, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight, },

                //扫荡
                { ["index_type"]: eui.Image, ["name"]: name + "_consumIcon", ["image"]: "ty_zuanShiIcon01", ["x"]: 390, ["y"]: 40, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null, ["autoScale"]: true },
                { ["index_type"]: eui.Label, ["name"]: name + "_consum", ["title"]: "X30", ["font"]: "ht_20_lc", ["color"]: gui.Color.ublack, ["x"]: 425, ["y"]: 45, ["w"]: 200, ["h"]: 25, ["fun_index"]: null, },

                { ["index_type"]: gui.Button, ["name"]: name + "_sweap", ["title"]: Localize_cns("COPY_TXT7"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt3", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 350, ["y"]: 75, ["w"]: 150, ["h"]: 60, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSweap, },

                { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 470, ["y"]: 60, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)


            //ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
            this.mElemList[name + "_leftTime"].setAlignFlag(gui.Flag.CENTER_CENTER)
            AddRdContent(this.mElemList[name + "_leftTime"], String.format(Localize_cns("COPY_TXT5"), "#red" + 90), "ht_22_cc", "ublack")
            this.mElemList[name + "_enter"].visible = false
            this.mElemList[name + "_sweap"].enabled = false

            for (let i = 0; i < 3; i++) {
                this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this, name + "itemBox" + i, 25 + 85 * i, 50)
            }

        }

        protected dataChanged(): void {
            this.controlDataTable = {}

            let config = this.data;
            let heroLevel = GetHeroProperty("level") || 0
            //let name = window.name
            let name = "item"
            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.MaterialBoss)
            // {
            //         prizeRecord: {[npcIndex]:count 挑战/扫荡过的次数},
            //         totallCount: 总挑战/扫荡次数,
            //         npcList: {[npcIndex]:1/null/0 历史是否通过关}
            // }
            let count = 0
            if (actInfo) {
                if (actInfo.prizeRecord[config.index]) {
                    count = actInfo.prizeRecord[config.index]
                }
            }
            this.mElemList[name + "_enter"].visible = false
            this.mElemList[name + "_enter"].enabled = true
            this.mElemList[name + "_sweap"].visible = false
            this.mElemList[name + "_sweap"].enabled = true
            this.mElemList[name + "_consumIcon"].visible = false
            this.mElemList[name + "_consum"].visible = false

            this.mElemList[name + "_name"].text = config.title// + "(" + config.level + ")"
            let list = AnalyPrizeFormat(config.itemShow || [])
            for (let i = 0; i < 3; i++) {
                if (!list[i]) {
                    this.mElemList[name + "itemBox" + i].setVisible(false)
                } else {
                    let [entryId, count] = list[i]
                    this.mElemList[name + "itemBox" + i].setVisible(true)
                    this.mElemList[name + "itemBox" + i].updateByEntry(entryId, count)
                }
            }
            this.controlDataTable[name + "_enter"] = config.index

            if (heroLevel < config.level) {
                this.mElemList[name + "_enter"].enabled = false
                this.mElemList[name + "_enter"].visible = true

                AddRdContent(this.mElemList[name + "_leftTime"], String.format(Localize_cns("BOSS_TXT39"), config.level), "ht_18_cc", "ublack")
            } else {
                AddRdContent(this.mElemList[name + "_leftTime"], "", "ht_18_cc", "ublack")

                if (count < config.chance) {            //一次也没打过
                    if (actInfo && actInfo.npcList[config.index]) {                                         //历史通过关
                        if (heroLevel - config.level < config.sweepLevel) {                  //挑战
                            this.mElemList[name + "_enter"].visible = true
                        } else {                                                                            //超过可以直接扫荡的等级差要求
                            this.mElemList[name + "_sweap"].visible = true
                            this.mElemList[name + "_sweap"].text = Localize_cns("COPY_TXT13")

                            this.controlDataTable[name + "_sweap"] = [1, config.index]                      //1表示免费扫荡
                        }
                    } else {
                        this.mElemList[name + "_enter"].visible = true                                      //未通过
                    }
                } else {                                                                                //需要购买
                    count = count - config.chance

                    //[0]=1,[5]=1,[6]=2     表示达到指定vip等级后当天可购买次数+x (1 2)
                    let enableCount = 0
                    let nextVip = -1
                    let nextAddCount = -1

                    this.mElemList[name + "_consumIcon"].visible = true
                    this.mElemList[name + "_consum"].visible = true
                    this.mElemList[name + "_consum"].text = "X" + config.rmb

                    for (let i = 0; i <= defaultValue.DEFALUT_VIP_MAX_LEVEL; i++) {
                        if (i <= GetHeroProperty("VIP_level")) {
                            enableCount = enableCount + checkNull(config.vipCount[i], 0)
                        } else {                                                                        //未达到的下一vip等级
                            if (config.vipCount[i]) {
                                nextVip = i
                                nextAddCount = config.vipCount[i]
                                break
                            }
                        }
                    }

                    if (count < enableCount) {                                                          //当天还可以购买扫荡的次数
                        AddRdContent(this.mElemList[name + "_leftTime"], String.format(Localize_cns("COPY_TXT5"), enableCount - count), "ht_18_cc", "ublack")

                        this.mElemList[name + "_sweap"].visible = true
                        this.mElemList[name + "_sweap"].text = Localize_cns("COPY_TXT7")

                        this.controlDataTable[name + "_sweap"] = [2, config.index]                      //2表示购买扫荡
                    } else {
                        if (nextVip >= 0) {
                            AddRdContent(this.mElemList[name + "_leftTime"], String.format(Localize_cns("COPY_TXT14"), nextVip, nextAddCount), "ht_18_cc", "ublack")

                            this.mElemList[name + "_sweap"].visible = true
                            this.mElemList[name + "_sweap"].enabled = false
                            this.mElemList[name + "_sweap"].text = Localize_cns("COPY_TXT7")
                        } else {
                            AddRdContent(this.mElemList[name + "_leftTime"], Localize_cns("COPY_TXT15"), "ht_18_cc", "ublack")

                            this.mElemList[name + "_sweap"].visible = true
                            this.mElemList[name + "_sweap"].enabled = false
                            this.mElemList[name + "_sweap"].text = Localize_cns("COPY_TXT7")
                        }
                    }
                }
            }

            //红点提示
            //今日可挑战次数
            this.mElemList[name +"btnTips"].visible = false
            if(heroLevel >= config.level){
                let count = 0
                //扫荡过的次数
                if (actInfo && actInfo.prizeRecord[config.index]) {
                    count = actInfo.prizeRecord[config.index]
                }

                if (count < config.chance)
                   this.mElemList[name +"btnTips"].visible = true
            }

        }


        //////////////////////////////////////////////////////////////////////////
        onClickFight(args) {
            // let name = args.target.name

            // if (this.controlDataTable[name] == null) {
            //     return
            // }
            let config = this.data;
            let index = config.index

            if (CheckActivityState() == false) {
                return
            }
            
            if (CheckBeiBaoEquipWillFull()) {
                return
            }

            if (CheckFightState() == true) {
                return
            }

            //let index = this.controlDataTable[name]
            RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.MaterialBoss, index)
        }

        onClickSweap(args) {
            // let name = args.target.name

            // if (this.controlDataTable[name] == null) {
            //     return
            // }
            let name = "item"
            if(this.controlDataTable[name + "_sweap"] == null)
                return;

            if (CheckActivityState() == false) {
                return
            }
            
            if (CheckFightState() == true) {
                return
            }
            
            if (CheckBeiBaoEquipWillFull()) {
                return
            }

            let [sType, index] = this.controlDataTable[name + "_sweap"]
            if (sType == 2) {
                if (!GameConfig.CopyMaterialConfig[index]) {
                    return
                }

                if (GetHeroProperty("gold") < GameConfig.CopyMaterialConfig[index].rmb) {
                    ExecuteMainFrameFunction("chongzhi")
                    return MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
                }
            }
            RpcProxy.call("C2G_SweepBossActivity", OrdinaryActivityIndex.MaterialBoss, index)
        }



    }
}