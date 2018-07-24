// TypeScript file
class FightCopyDragonWindow extends BaseCtrlWnd {
    controlDataTable: any;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
			// { ["name"]: "round_bam",     ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceend },
            { ["name"]: "round_pro",     ["image"]: "fb_loadingDi02", ["thumbImage"]: "fb_loading02",}
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
		RegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList["copy_longwang_group"].visible = true
        this.refreshFrame()

        this.mParentWnd.showStarAnim()
    }

    public onHide(): void {
		UnRegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList["copy_longwang_group"].visible = false
    }

    refreshFrame() {
        let list = table_copy(opDragonBossBaseConfig.starConfig)
        table_sort(list, function(a, b) {return a[2] - b[2]})

        let minStar = list[0][1] - 1
        for (let i = 0; i < 3; i++) {
            let v = list[i]
            this.mElemList["starStage_group" + i].x = this.mElemList["round_pro"].width - this.mElemList["round_pro"].width / minStar * (v[1] - 1)// + this.mElemList["starStage_group" + i].width / 2
            this.mElemList["star_num" + i].text = v[1]
        }

        let [curRound, maxRound] = FightSystem.getInstance().getCurShowFightRound()

        let imb = this.mElemList["round_pro"]
        UiUtil.updateProgress(imb, minStar - curRound + 1, minStar)

        let [_, index] = FightSystem.getInstance().getCurFightType()
        let config = GameConfig.CopyDragonConfig[index]
        if (!config) {
            this.mElemList["copy_name"].text = ""
        } else {
            let list = []
            for (let _ in GameConfig.CopyDragonConfig) {
                let con = GameConfig.CopyDragonConfig[_]
                if (con.chapter == config.chapter) {
                    table_insert(list, con)
                }
            }
            table_sort(list, function(a, b) {return a.index - b.index})
            let j = 0
            for (let i = 0; i < list.length; i++) {
                let v = list[i]
                if (v.index == index) {
                    j = i
                    break
                }
            }

            this.mElemList["copy_name"].text = String.format(Localize_cns("COPY_TXT22"), (config.chapter - 10) + "-" + (j + 1))
        }
    }

    onFightRoundUpdate(args) {
        this.refreshFrame()
    }

    ////////////////////////////////////////////////
}