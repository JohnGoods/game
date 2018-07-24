class PeerlessStakeFrame extends BaseWnd {

    playerInfoList
    select
    controlData

    isThisStake: boolean

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/champion/PeerlessStakeLayout.exml"]
        this.isThisStake = false
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 550
        this.mLayoutNode.height = 728
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btn_low", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onStageClick },
            { ["name"]: "btn_middle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onStageClick },
            { ["name"]: "btn_height", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onStageClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        for (let k = 1; k <= 2; k++) {
            let x = 49 + (k - 1) * 252
            let elemList = [

                { ["index_type"]: eui.Group, ["name"]: "group_" + k, ["image"]: "", ["x"]: x, ["y"]: 0, ["w"]: 200, ["h"]: 264, },
                { ["index_type"]: gui.Grid9Image, ["name"]: "bg_" + k, ["parent"]: "group_" + k, ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 200, ["h"]: 264, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSelectClick },
                { ["index_type"]: eui.Image, ["name"]: "kuang_" + k, ["parent"]: "group_" + k, ["title"]: "", ["image"]: "wjxq_renWuDi01", ["x"]: 35, ["y"]: 21, ["w"]: 260 * 0.5, ["h"]: 248 * 0.5, ["messageFlag"]: true },
                { ["index_type"]: eui.Group, ["name"]: "actor_" + k, ["parent"]: "group_" + k, ["title"]: "", ["image"]: "wjxq_renWuDi01", ["x"]: 100, ["y"]: 140, ["w"]: 1, ["h"]: 1, ["messageFlag"]: true },
                { ["index_type"]: eui.Image, ["name"]: "staked_" + k, ["parent"]: "group_" + k, ["title"]: "", ["image"]: "txdy_ya", ["x"]: 122, ["y"]: 155, ["w"]: 71, ["h"]: 71, ["messageFlag"]: true },

                { ["index_type"]: eui.Image, ["name"]: "bg_name_" + k, ["parent"]: "group_" + k, ["title"]: "", ["x"]: 17, ["y"]: 154, ["w"]: 167, ["h"]: 28, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "label_name_" + k, ["parent"]: "group_" + k, ["title"]: "", ["image"]: null, ["font"]: "ht_20_lc_stroke", ["color"]: gui.Color.aliceblue, ["x"]: 36, ["y"]: 158, ["w"]: 200, ["h"]: 20, ["messageFlag"]: true },

                { ["index_type"]: eui.Image, ["name"]: "bg_level_" + k, ["parent"]: "group_" + k, ["title"]: "", ["x"]: 17, ["y"]: 185, ["w"]: 167, ["h"]: 28, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_lv_" + k, ["parent"]: "group_" + k, ["title"]: "", ["image"]: null, ["x"]: 36, ["y"]: 189, ["w"]: 200, ["h"]: 20, ["messageFlag"]: true },

                { ["index_type"]: eui.Image, ["name"]: "bg_force_" + k, ["parent"]: "group_" + k, ["title"]: "", ["x"]: 17, ["y"]: 218, ["w"]: 167, ["h"]: 28, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_force_" + k, ["parent"]: "group_" + k, ["title"]: "", ["image"]: null, ["x"]: 36, ["y"]: 222, ["w"]: 200, ["h"]: 20, ["messageFlag"]: true },
            ];
            UiUtil.createElem(elemList, this.mLayoutNode, this.mElemList, this, this.mElemList["group_contain"]);

            this.mElemList["actor_view_" + k] = UIActorView.newObj(this.mLayoutNode, "actor_view_" + k, 0, 0, this.mElemList["actor_" + k])
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.select = null
        this.playerInfoList = null
        this.isThisStake = false
    }

    onRefresh() {

        if (this.playerInfoList == null || size_t(this.playerInfoList) < 2) return

        let stakeInfo: any = GetActivity(ActivityDefine.Champion).getStakeInfo()
        let staked = 0
        if (stakeInfo[0] != null) {
            staked = stakeInfo[0]
            for (let k in this.playerInfoList) {
                let v = this.playerInfoList[k]
                if (v.index == staked) {
                    this.select = tonumber(k) + 1
                    this.isThisStake = true
                }
            }
        }
        if (this.select == null || this.select <= 0) {
            this.select = this.playerInfoList[0].playerInfo.force >= this.playerInfoList[1].playerInfo.force ? 1 : 2
        }

        for (let k = 1; k <= 2; k++) {
            let bg: eui.Image = this.mElemList["bg_" + k]
            let stage_icon: eui.Image = this.mElemList["staked_" + k]
            let name = this.mElemList["label_name_" + k]
            let lv: gui.RichDisplayer = this.mElemList["rd_lv_" + k]
            let force: gui.RichDisplayer = this.mElemList["rd_force_" + k]

            let v = this.playerInfoList[k - 1]
            let icon = "ty_uiDi03"
            let isShow = v.index == staked
            if (k == this.select) {
                icon = "ty_uiDi04"
            }

            bg.source = icon
            stage_icon.visible = isShow

            let player = v.playerInfo
            name.text = GetServerPlayerName(v.serverId, v.serverGroupId, player.name)
            let forceStr = RoleSystem.getInstance().getExpStr(player.force)
            AddRdContent(lv, Localize_cns("BOSS_TXT37") + "#lime" + player.level, "ht_20_lc_stroke")
            AddRdContent(force, Localize_cns("BOSS_TXT38") + "#lime" + forceStr, "ht_20_lc_stroke")

            //更新模型
            let modelList: any = {}
            modelList["vocation"] = player.vocation
            modelList["sexId"] = player.sex

            this.mElemList["actor_view_" + k].updateByPlayerAppearInfo(modelList)
        }
        //押注
        this.checkStaked()
    }


    checkStaked() {
        let stakeInfo = GetActivity(ActivityDefine.Champion).getStakeInfo()
        let staked = 4
        if (stakeInfo[1]) {
            staked = stakeInfo[1]
        }
        let check = staked == 4
        let nameList = ["low", "middle", "height"]
        let yzConfig = GameConfig.WolrdOneBetPrizeConfig
        let reduce_key = 0
        for (let k in yzConfig) {
            if (reduce_key == 0) {
                reduce_key = tonumber(k)
                break
            }
        }
        this.controlData = {}
        // let moneyCostList = [1000, 2000, 3000]
        for (let k = 0; k < 3; k++) {
            let name = nameList[k]
            let btn: gui.Button = this.mElemList["btn_" + name]
            let rd: gui.RichDisplayer = this.mElemList["rd_" + name]
            let image: eui.Image = this.mElemList["ya_" + name]

            btn.visible = check
            this.mElemList["bottom_" + name].visible = check

            image.visible = ((reduce_key + k) == staked && this.isThisStake)
            let tempConfig = yzConfig[reduce_key + k]
            if (!tempConfig) continue
            if (check) {
                rd.setAlignFlag(gui.Flag.CENTER_CENTER)

                let moneyunit = tempConfig.unit
                let tempMoney = tempConfig.price
                this.controlData["btn_" + name] = tempConfig
                AddRdContent(rd, GetMoneyIcon(moneyunit) + tempMoney, "ht_20_cc_stroke", "yellow")
            }

            let winPrize = AnalyPrizeFormat(tempConfig.winPrize)
            let losePrize = AnalyPrizeFormat(tempConfig.losePrize)
            if (this.mElemList["itemBox_" + name] == null) {
                this.mElemList["itemBox_" + name] = UIItemBox.newObj(this.mLayoutNode, "itemBox_" + name, 0, 0, this.mElemList["item_" + name])
                this.mElemList["itemBox_" + name].updateByEntry(60099)
                this.mElemList["itemBox_" + name].setItemTipsListner(this.itemClick, this, [winPrize, losePrize])
            }
        }
        this.mElemList["label_hadStake"].visible = !check


    }

    ////////////------响应事件
    onSelectClick(args) {
        let stakeInfo: any = GetActivity(ActivityDefine.Champion).getStakeInfo()
        if (size_t(stakeInfo) != 0) return
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        this.select = tonumber(index)
        this.onRefresh()
    }

    onStageClick(args) {

        let osDate = GetServerDate()
        if (osDate.hour >= 21 || (osDate.hour == 20 && osDate.min >= 55)) {
            MsgSystem.addTagTips(Localize_cns("JJC_TXT31"))
            return
        }

        let stakeInfo = GetActivity(ActivityDefine.Champion).getStakeInfo()
        if (size_t(stakeInfo) != 0) return
        let name = args.target.name
        let config = this.controlData[name]
        if (!config) return
        let unit = config.unit
        let costMoney = config.price
        let formatStr = String.format(Localize_cns("JJC_TXT18"), costMoney + Localize_cns(ItemUnitName[unit]))

        let playerIndex = this.playerInfoList[this.select - 1].index

        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    let money = GetHeroMoney(unit)
                    if (money < costMoney) {
                        let formatStr = Localize_cns(ItemUnitName[unit])
                        MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                        return
                    }
                    RpcProxy.call("C2G_WorldOne_BetMoney", playerIndex, config.typeIndex)
                }
            }
        }
        MsgSystem.confirmDialog(formatStr, t, null)
    }

    itemClick(logicItem, userdata) {

        let prizeWin = userdata[0]
        let prizelose = userdata[1]
        if (!prizeWin || !prizelose) return true
        let wnd: PeerlessStakeTipsFrame = WngMrg.getInstance().getWindow("PeerlessStakeTipsFrame")
        wnd.onShowWnd(prizeWin, prizelose)

        return true
    }

    ///--------
    onShowWnd(playerInfoList) {
        this.playerInfoList = playerInfoList
        this.showWnd()
    }
}