// TypeScript file
class FightGlobalBossWindow extends FightPrizePrevieWindow {
    actInfo: any

    public initObj(...params: any[]) {
        // this.controlDataTable = {};
        // this.name = params[2] || ""
        // this.bShowStar = checkNull(params[3], true)
        this.actInfo = null
    }

    public onLoad(): void {
        super.onLoad()

        // this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mParentWnd.mLayoutPaths[2], this.mLayoutNode, this.mElemList, this)
        let root:eui.Component = this.mElemList[this.name]
        root.bottom = 335
        root.horizontalCenter = 0;
        root.percentWidth = 100;

        var elemInfo = [
			// {["name"]: "btn_captrue",     ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCaptrue },
            {["name"]: this.name + "hp_pro", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "dl_jiaZaiDi01", ["thumbImage"]: "dl_jiaZai02", ["color"]: gui.Color.white, },
        ]
        UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let imb = this.mElemList[this.name + "hp_pro"]
        // UiUtil.updateProgress(imb, 50, 100)
        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "rank_rd"].setAlignFlag(gui.Flag.H_CENTER)
        // this.mElemList["campBoss_fight_view"] = UIActorView.newObj(this.mLayoutNode, name + "_icon", 90, 150, this.mElemList[name + "_iconGroup"])
        // let txt = ""
        // for (let i = 0; i < 5; i++) {
        //     txt = txt + (i + 1) + "#space_ten" + Localize_cns("GLOBAL_TXT1") + "#space_ten" + "#lime" + 888999 + "#rf#br"
        // }
        // AddRdContent(this.mElemList[this.name + "rank_rd"], txt, "ht_20_cc_stroke", "white", 3)
        // AddRdContent(this.mElemList[this.name + "myRank_rd"], 3 + "#space_ten" + Localize_cns("GLOBAL_TXT1") + "#space_ten" + "#lime" + 888999 + "#br", "ht_20_cc_stroke", "white")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
		RegisterEvent(EventDefine.COMBAT_POINT_CHANGE, this.onFightPointChange, this)
        super.onShow()

        this.mElemList[this.name].visible = true

        let delayFunc = function() {                    //因为活动信息在战斗协议后来，延后执行保证数据存在
            this.actInfo = FightSystem.getInstance().getFightActivityInfo(OrdinaryActivityIndex.WorldPlayerBoss)
            //{
                // bossEntryId: ,      bossEntryId
                // totallMonsterHp: ,  总血量
                // recordHP: ,         当前血量
                // rankList: ,         排名[id, name, damageValue]
                // damageValue: ,      我的伤害
            // }

            this.onRefreshBossInfo()
        }
        DelayEvecuteFunc(0, delayFunc, this)
    }

    public onHide(): void {
		UnRegisterEvent(EventDefine.COMBAT_POINT_CHANGE, this.onFightPointChange, this)
        super.onHide()

        this.mElemList[this.name].visible = false
    }

    onRefreshBossInfo() {
        if (this.actInfo == null) {
            this.mElemList[this.name].visible = false
            return
        } else {
            this.mElemList[this.name].visible = true
        }

        let actInfo = table_copy(this.actInfo)
        let rankList = actInfo.rankList || []
        table_sort(rankList, function(a, b) {return b[2] - a[2]})

        let txt = ""
        let myRank = -1
        for (let i = 0; i < rankList.length; i++) {
            let v = rankList[i]
            txt = txt + (i + 1) + "#space_ten" + v[1] + "#space_ten" + "#lime" + MakeLongNumberShort(v[2]) + "#rf#br"

            if (v[0] == GetHeroProperty("id")) {
                myRank = i + 1
            }
        }
        AddRdContent(this.mElemList[this.name + "rank_rd"], txt, "ht_18_cc_stroke", "white", 3)

        if (actInfo.totallMonsterHp) {
            if (myRank < 0) {
                AddRdContent(this.mElemList[this.name + "myRank_rd"], Localize_cns("BOSS_TXT69") + "#space_ten" + GetHeroProperty("name") + "#space_ten" + "#lime" + MakeLongNumberShort(actInfo.damageValue) + "#br", "ht_18_cc_stroke", "white")
            } else {
                AddRdContent(this.mElemList[this.name + "myRank_rd"], myRank + "#space_ten" + GetHeroProperty("name") + "#space_ten" + "#lime" + MakeLongNumberShort(actInfo.damageValue) + "#br", "ht_18_cc_stroke", "white")
            }
        } else {
            AddRdContent(this.mElemList[this.name + "myRank_rd"], "", "white")
        }

        let imb = this.mElemList[this.name + "hp_pro"]
        UiUtil.updateProgress(imb, actInfo.recordHP, actInfo.totallMonsterHp)
    }

    onFightPointChange(args) {
        if (this.actInfo == null) {
            this.actInfo = FightSystem.getInstance().getFightActivityInfo(OrdinaryActivityIndex.WorldPlayerBoss)
            if (this.actInfo == null) {
                return
            }
        }

        if (args.combatType == "hp") {
            let actor = GetFightActor(args.combatId)
            if (actor && actor.getProperty("entry") == this.actInfo.bossEntryId) {
                this.actInfo.recordHP = this.actInfo.recordHP + args.changePoint
            }

            if (args.changePoint < 0 && actor.getSide() == fightSide.FIGHT_LEFT) {
                this.actInfo.damageValue = this.actInfo.damageValue - args.changePoint

                for (let i = 0; i < this.actInfo.rankList.length; i++) {
                    let v = this.actInfo.rankList[i]
                    if (v[0] == GetHeroProperty("id")) {
                        v[2] = v[2] - args.changePoint
                        break
                    }
                }
            }

            this.onRefreshBossInfo()
        }
    }
    ////////////////////////////////////////////////
}