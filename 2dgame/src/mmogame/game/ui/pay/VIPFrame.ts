// TypeScript file
class VIPFrame extends BaseWnd {
    selectVipLevel: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pay/VIPLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        //this.mLayoutNode.setDoModal(true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btn_charge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRechage },
            { ["name"]: "btn_get", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },
            { ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.selectOnClick },
            { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.selectOnClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["btn_get"].visible = false
        this.mElemList["get_icon"].visible = false

        for (let i = 0; i < 5; i++) {
            this.mElemList["itemBox_" + i] = UIItemBox.newObj(this.mLayoutNode, "itemBox_" + i, 0, 0, this.mElemList["group_prize"])
            this.mElemList["itemBox_" + i].setVisible(false)
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.VIP_PRIZE_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = true;
        this.refreshFrame()

        RpcProxy.call("C2G_RechageRewardInfo")
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.VIP_PRIZE_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        this.refreshVipWnd()

        let initLevel = this.getVipGetPrizeLevel()
        //默认自己的等级
        this.updateVipPower(MathUtil.clamp(initLevel, 0, defaultValue.DEFALUT_VIP_MAX_LEVEL))

        this.selectVipLevel = MathUtil.clamp(initLevel, 0, defaultValue.DEFALUT_VIP_MAX_LEVEL)
        //特权礼包
        this.updateVipPowerPrize()
    }

    getVipGetPrizeLevel() {
        let heroVipLv = GetHeroProperty("VIP_level") || 0
        let vipLv = 0
        for (let i = heroVipLv; i > 0; i--) {
            let record = VipSystem.getInstance().getVipPrizeRecordWithLv(i)
            if (record != 1) {
                vipLv = i
            }
        }

        return (vipLv == 0) ? (heroVipLv + 1) : vipLv
    }

    updateVipPowerPrize() {
        this.refreshDotTips()

        this.mElemList["power_icon"].source = "cz_VIPLiBao" + String.format("%02d", this.selectVipLevel)

        let vipPrize = VipSystem.getInstance().getVipConfigWithLv(this.selectVipLevel)
        if (size_t(vipPrize) == 0) {
            return
        }
        let itemList = AnalyPrizeFormat(vipPrize.item)
        for (let i = 0; i < 5; i++) {
            this.mElemList["itemBox_" + i].setVisible(false)
            let item = itemList[i]
            if (item) {
                this.mElemList["itemBox_" + i].setVisible(true)
                if (size_t(item) == 3) {
                    this.mElemList["itemBox_" + i].updateByEntry(item[0], item[1], item[2])
                } else {
                    this.mElemList["itemBox_" + i].updateByEntry(item[0], item[1])
                }
            }
        }

        //领取记录
        this.mElemList["btn_get"].visible = false
        let record = VipSystem.getInstance().getVipPrizeRecordWithLv(this.selectVipLevel)
        if (record != 1 && GetHeroProperty("VIP_level") >= this.selectVipLevel) {
            this.mElemList["btn_get"].visible = true
        }

        if (record == 1 && GetHeroProperty("VIP_level") >= this.selectVipLevel) {
            this.mElemList["get_icon"].visible = true
        } else {
            this.mElemList["get_icon"].visible = false
        }
    }

    refreshVipWnd() {
        let vip = GetHeroProperty("VIP_level") || 0
        this.mElemList["cur_vip_icon"].source = ("cz_vip" + String.format("%02d", vip))

        let remand = GetRmbFromGold(VipSystem.getInstance().GetVipFeed())
        let needDia = GetRmbFromGold(VipSystem.getInstance().getVipSumDia(vip))

        let tips = ""
        if (vip >= defaultValue.DEFALUT_VIP_MAX_LEVEL) {
            tips = Localize_cns("PAY_TXT3")

            this.mElemList["next_vip_icon"].source = ("cz_vip" + String.format("%02d", vip))
        } else {
            tips = String.format(Localize_cns("PAY_TXT4"), remand, (vip + 1))

            this.mElemList["next_vip_icon"].source = ("cz_vip" + String.format("%02d", vip + 1))
        }
        this.mElemList["tips_rd"].setAlignFlag(gui.Flag.H_CENTER)
        AddRdContent(this.mElemList["tips_rd"], tips, "ht_24_cc", "ublack")

        UiUtil.updateProgress(this.mElemList["exp_imb"], needDia - remand, needDia)
    }

    updateVipPower(level) {
        this.selectVipLevel = level

        if (level > 1 && !this.mElemList["btn_left"].visible) {
            this.mElemList["btn_left"].visible = true
        } 
        
        if (level == 1) {
            this.mElemList["btn_left"].visible = false
        }

        if (level < defaultValue.DEFALUT_VIP_MAX_LEVEL && !this.mElemList["btn_right"].visible) {
            this.mElemList["btn_right"].visible = true
        }

        if (level == defaultValue.DEFALUT_VIP_MAX_LEVEL) {
            this.mElemList["btn_right"].visible = false
        }

        this.mElemList["cur_vip_pic"].source = ("cz_vip" + String.format("%02d", level))

        this.setVIPcontext()

        this.updateVipPowerPrize()
    }

    //-设置VIP特权内容
    setVIPcontext() {
        let num = this.selectVipLevel
        if (!GameConfig.VIPExplain[num]) {
            return
        }
        let rd = this.mElemList["content_rd"]
        let textList = GameConfig.VIPExplain[num]["privilege"]

        //这里num - 1表示vip等级
        let sum = checkNull(GameConfig.VIPExplain[num]["jingshi"], 0)    //VipSystem.getInstance().getVipSumDia(num)
        let longStr: string
        for (let i = 0; i < textList.length; i++) {
            let v = textList[i]

            //第一项是vip晶石额度
            let str = v
            if (i == 0) {
                str = String.format(str, sum)
                longStr = (i + 1) + "." + str
            }
            else {
                longStr = longStr + "#br" + (i + 1) + "." + str
            }
        }
        AddRdContent(rd, longStr, "ht_24_cc", "ublack")

        //重置滚动距离
        rd.scrollV = 0
    }

    onClickGet() {
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        let vipConfig = VipSystem.getInstance().getVipConfigWithLv(this.selectVipLevel)
        RpcProxy.call("C2G_GetRechargeReward", vipConfig.index)
    }

    onClickRechage() {
        ExecuteMainFrameFunction("chongzhi")
        this.hideWnd()
    }


    selectOnClick(args) {
        let btn_name = args.target.name
        if (btn_name == "btn_left") {
            this.selectVipLevel = this.selectVipLevel - 1
            if (this.selectVipLevel <= 1) {
                this.mElemList["btn_left"].visible = false
                this.selectVipLevel = 1
            }
        } else if (btn_name == "btn_right") {
            this.selectVipLevel = this.selectVipLevel + 1

            let vipLv = GetHeroProperty("VIP_level") || 0
            if (this.selectVipLevel - vipLv > 5) {
                this.selectVipLevel = vipLv + 5
                return
            }

            if (this.selectVipLevel >= defaultValue.DEFALUT_VIP_MAX_LEVEL) {
                this.mElemList["btn_right"].visible = false
                this.selectVipLevel = defaultValue.DEFALUT_VIP_MAX_LEVEL
            }
        }

        this.updateVipPower(this.selectVipLevel)
    }

    //红点提示
    refreshDotTipsImp() {
        let record = VipSystem.getInstance().getVipPrizeRecordWithLv(this.selectVipLevel)
        if (record != 1 && GetHeroProperty("VIP_level") >= this.selectVipLevel) {
            this.createDotTipsUI(this.mElemList["btn_get"])
        }

        let vipPrize = VipSystem.getInstance().getVipConfigWithLv(this.selectVipLevel) || []
        if (size_t(vipPrize) == 0) {
            return
        }
        let itemList = AnalyPrizeFormat(vipPrize.item)

        for (let i = this.selectVipLevel - 1; i > 0; i--) {
            let leftRecrod = VipSystem.getInstance().getVipPrizeRecordWithLv(i)
            if (leftRecrod != 1 && GetHeroProperty("VIP_level") >= i) {
                this.createDotTipsUI(this.mElemList["btn_left"])
                break
            }
        }

        for (let i = this.selectVipLevel + 1; i <= GetHeroProperty("VIP_level"); i++) {
            let rightRecord = VipSystem.getInstance().getVipPrizeRecordWithLv(i)
            if (rightRecord != 1 && GetHeroProperty("VIP_level") >= i) {
                this.createDotTipsUI(this.mElemList["btn_right"])
                break
            }
        }
    }
}