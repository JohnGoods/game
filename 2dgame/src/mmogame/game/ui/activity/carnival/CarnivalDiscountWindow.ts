// TypeScript file
class CarnivalDiscountWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: UIScrollList

    activityIndex 
    timer
    cellIndex 

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "discount"                  //折扣商店
        this.mLayoutPath = params[3]
        this.activityIndex = PayActivityIndex.SHOP_DISCOUNT_A
        this.cellIndex = -1
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

        var elemInfo = [
            // {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        
        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
		// RegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()
        RpcProxy.call("C2G_SendOperateAndPlayerData", this.activityIndex)

        if(this.timer == null){
            this.timer = SetTimer(this.onTick, this, 1000, true)
        }
    }

    public onHide(): void {
		// UnRegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList[this.name].visible = false
        if(this.timer != null){
            KillTimer(this.timer)
            this.timer = null
        }
        this.cellIndex = -1
    }

    onRefresh() {
        let tempList = GetActivity(ActivityDefine.Carnival).getCarnivalShopList(this.activityIndex, GameConfig.ShopDiscountAConfig)
        if(tempList == null) return
        let list = splitListByCount(tempList, 2)
        
        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		this.controlDataTable = {}
		let hasNum = list.length
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 180, 3, 0, 0)

			if (flag == true) {
                this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v, k)
		}
        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()
    }

    initItemWindow(window) {
        let name = window.name
        let wndName = "discount_"
        name += wndName

		let mElemInfo: any = [
            //左边
			{ ["index_type"]: eui.Group,        ["name"]: name + "_group0",     ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg0",        ["parent"]: name + "_group0", ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 5, ["w"]: window.width / 2 - 5, ["h"]: window.height - 5, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Group,        ["name"]: name + "_itemGroup0", ["parent"]: name + "_group0", ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 50, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_tlbg0",      ["parent"]: name + "_group0", ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 250, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_tl0",        ["parent"]: name + "_group0", ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 250, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_jgbg0",      ["parent"]: name + "_group0", ["image"]: "ty_zheKouDi", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 0, ["w"]: 43, ["h"]: 80, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_jg_num0",      ["parent"]: name + "_jgbg0",["title"] : "", ["image"]: "ty_zheKouDi", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.aliceblue, ["x"]: 10, ["y"]: 0, ["w"]: 24, ["h"]: 80, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Button,       ["name"]: name + "_buy0",       ["parent"]: name + "_group0", ["title"]: Localize_cns("OPENSERVER_TXT15"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt6",  ["color"]: gui.Color.white, ["x"]: 120, ["y"]: 129, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon0_old",     ["parent"]: name + "_group0", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon0_new",     ["parent"]: name + "_group0", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 80, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price_old0",    ["parent"]: name + "_group0", ["title"]: String.format(Localize_cns("OPENSERVER_TXT16"), 4000), ["font"]: "ht_22_rc", ["color"]: gui.Color.ublack, ["x"]: 90, ["y"]: 55, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price_new0",    ["parent"]: name + "_group0", ["title"]: String.format(Localize_cns("OPENSERVER_TXT17"), 3000), ["font"]: "ht_22_rc", ["color"]: gui.Color.orange, ["x"]: 90, ["y"]: 81, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_unlocktl0",  ["parent"]: name + "_group0", ["title"]: Localize_cns("OPENSERVER_TXT20"), ["font"]: "ht_22_cc", ["color"]: gui.Color.red, ["x"]: 0, ["y"]: 135, ["w"]: window.width / 2 - 5, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_line0",      ["parent"]: name + "_group0", ["image"]: "cz_uiLine02", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 110, ["y"]: 70, ["w"]: 125, ["h"]: 1, ["event_name"]: null, ["fun_index"]: null},
            
            //右边
            { ["index_type"]: eui.Group,        ["name"]: name + "_group1",     ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: window.width / 2 + 5, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg1",        ["parent"]: name + "_group1", ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 5, ["w"]: window.width / 2 - 5, ["h"]: window.height - 5, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Group,        ["name"]: name + "_itemGroup1", ["parent"]: name + "_group1", ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 50, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_tlbg1",      ["parent"]: name + "_group1", ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 250, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_tl1",        ["parent"]: name + "_group1", ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 250, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_jgbg1",      ["parent"]: name + "_group1", ["image"]: "ty_zheKouDi", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 0, ["w"]: 43, ["h"]: 80, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_jg_num1",      ["parent"]: name + "_jgbg1",["title"] : "", ["image"]: "ty_zheKouDi", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.aliceblue, ["x"]: 10, ["y"]: 0, ["w"]: 24, ["h"]: 80, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Button,       ["name"]: name + "_buy1",       ["parent"]: name + "_group1", ["title"]: Localize_cns("OPENSERVER_TXT15"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt6",  ["color"]: gui.Color.white, ["x"]: 120, ["y"]: 129, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon1_old",     ["parent"]: name + "_group1", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon1_new",     ["parent"]: name + "_group1", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 80, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price_old1",    ["parent"]: name + "_group1", ["title"]: String.format(Localize_cns("OPENSERVER_TXT16"), 4000), ["font"]: "ht_22_rc", ["color"]: gui.Color.ublack, ["x"]: 90, ["y"]: 55, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price_new1",    ["parent"]: name + "_group1", ["title"]: String.format(Localize_cns("OPENSERVER_TXT17"), 3000), ["font"]: "ht_22_rc", ["color"]: gui.Color.orange, ["x"]: 90, ["y"]: 81, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_unlocktl1",  ["parent"]: name + "_group1", ["title"]: Localize_cns("OPENSERVER_TXT20"), ["font"]: "ht_22_cc", ["color"]: gui.Color.red, ["x"]: 0, ["y"]: 135, ["w"]: window.width / 2 - 5, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_line1",      ["parent"]: name + "_group1", ["image"]: "cz_uiLine02", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 110, ["y"]: 70, ["w"]: 125, ["h"]: 1, ["event_name"]: null, ["fun_index"]: null},
            
		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
        for (let i = 0; i < 2; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 0, 0, this.mElemList[name + "_itemGroup" + i])

            let mElemInfo1: any = [
                { ["index_type"]: eui.Label,        ["name"]: name + "_xianshi" + i,       ["title"]: Localize_cns("OPENSERVER_TXT18"), ["font"]: "ht_18_cc", ["color"]: gui.Color.red, ["x"]: 5, ["y"]: 25, ["w"]: 20, ["h"]: 60, ["messageFlag"]: true},
                { ["index_type"]: gui.RichDisplayer,        ["name"]: name + "_xiangou" + i,       ["title"]: "", ["font"]: "ht_16_cc", ["color"]: gui.Color.ublack, ["x"]: -20, ["y"]: 85, ["w"]: 120, ["h"]: 28, ["messageFlag"]: true},
                
            ]
            this.mElemList[name + "itemBox" + i].createElem(mElemInfo1, this.mElemList, this)
            this.mElemList[name + "_xiangou" + i].setAlignFlag(gui.Flag.CENTER_CENTER)
        }
    }

    refreshItemWindow(window, configList, index) {
        let name = window.name
        let wndName = "discount_"
        name += wndName
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)

        for(let k = 0 ; k < 2; k++){
            let  config = configList[k]
            if(config){
                let dataKey = tostring(index) + k
                this.controlDataTable[dataKey] = config
                this.mElemList[name + "_group" + k].visible = true
                let prize = AnalyPrizeFormat(config.item)
                let id = prize[0][0]
                let itemConfig = GameConfig.itemConfig[id] 
                let quality = itemConfig.quality || opEquipQuality.gray
                let fontColor = GetItemFontGUIColor(id, false)
                this.mElemList[name + "_tl" + k].textColor = fontColor
                this.mElemList[name + "_tl" + k].text = itemConfig.name
                this.mElemList[name + "itemBox" + k].updateByEntry(id, prize[0][1],  quality)
                let ratio = FormatNumberInt((config.newPrice/config.oldPrice) * 10)
                this.mElemList[name + "_jg_num" + k].text = ratio + Localize_cns("CARNIVAL_DISCOUNT")
                if(config.limitTime != 0){
                    this.mElemList[name + "_xianshi" + k].visible = false
                }else{
                    this.mElemList[name + "_xianshi" + k].visible = true
                }
                let funType = cellOptionsIndex[config.stageUp]
                if(this.cellIndex == -1){
                    this.cellIndex = funType
                }
                let nowStage = 0
                let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
                if(funInfo != null){
                    nowStage = funInfo.stage
                }
                if(nowStage < config.cond){
                    this.mElemList[name + "_unlocktl" + k].visible = true
                    this.mElemList[name + "_buy" + k].visible = false
                    this.mElemList[name + "_xiangou" +  k].visible = false
                    this.mElemList[name + "_unlocktl" + k].text = String.format(Localize_cns("CARNIVAL_UNLOCK_TIANXIAN_ENOUGH"), Localize_cns(cellOptionsName[funType - 1]),config.cond)
                }else{
                    this.mElemList[name + "_unlocktl" + k].visible = false
                    this.mElemList[name + "_buy" + k].visible = true
                    this.mElemList[name + "_xiangou" +  k].visible = true
                    let count = playerInfo[config.index] || 0
                    let text = String.format(Localize_cns("OPENSERVER_TXT19"), count , config.limitCount)
                    if(count >= config.limitCount){
                        //count = config.limitCount
                        text = Localize_cns("SHOP_TXT3")
                        this.mElemList[name + "_buy" + k].visible = false
                    }
                    AddRdContent(this.mElemList[name + "_xiangou" +  k], text, "ht_16_cc" ,"ublack")
                }

                this.mElemList[name + "_price_old" + k].text = String.format(Localize_cns("OPENSERVER_TXT16"), config.oldPrice)
                this.mElemList[name + "_price_new" + k].text = String.format(Localize_cns("OPENSERVER_TXT17"), config.newPrice)
            }else{
                this.mElemList[name + "_group" + k].visible = false
            }
        }
    }

    ////////////////////////////////////////////////
    onClickGo(args) {
        let name = args.target.name
        let index  = name.replace(/[^0-9]/ig, "");
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        if(playerInfo == null) return
        let config = this.controlDataTable[index]
        if(config == null) return
        if(playerInfo[config.index] >= config.limitCount) return 
        if(GetHeroMoney(config.unit) < config.newPrice){
            let formatStr = Localize_cns(ItemUnitName[config.unit]) 
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"),formatStr))
            return 
        }
        RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [config.index, 1])

    }

    
    ////-----------定时器
    onTick(){
        let osTime = GetServerTime()
        let tomorrowTime = GetTomorrowTime(osTime)
        let diffTime = getFormatDiffTime(tomorrowTime - osTime)
        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + diffTime), "ht_20_lc")
    }
}