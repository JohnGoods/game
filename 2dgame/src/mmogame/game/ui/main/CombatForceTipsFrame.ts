/*
作者:
    ChenPeng
	
创建时间：
    2017.06.05(星期一) 

意图：
  	战力变化
	
公共接口：
	
*/

class CombatForceTipsFrame extends BaseWnd {
    queue: any[];
    list: any[];

    exeTimer: number;

    timer: number;

    fadeOut: AlphaAction;

    public initObj(...args: any[]): void {
        this.queue = []
        this.list = []

        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.showCombatForceChange, this)
    }

    destory() {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.showCombatForceChange, this)
    }

    showCombatForceChange(args) {
        let newForce = args.newProperty.force
        let oldForce = args.oldProperty.force

        if (newForce > oldForce) {
            let t: any = {}
            t.new = newForce
            t.old = oldForce
            table_insert(this.queue, t)

            if (this.exeTimer) {
                KillTimer(this.exeTimer)
                this.exeTimer = null
            }

            let startFunc = function () {
                if (!this.isVisible()) {
                    this.list = this.queue
                    this.queue = []
                    this.showWnd()
                }

                KillTimer(this.exeTimer)
                this.exeTimer = null
            }
            this.exeTimer = SetTimer(startFunc, this, 500)
        }
    }

    onLoad() {
        let width = 351, height = 58

        UiUtil.setWH(this.mLayoutNode, width, height)
        this.mLayoutNode.touchEnabled = false
        this.mLayoutNode.touchChildren = false
        this.mLayoutNode.setLayer(gui.GuiLayer.Top)
        this.setAlignCenter(true, false)

        this.mElemList = {}
        let mElemInfo: any = [
            { ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height },
            { ["index_type"]: gui.Grid9Image, ["name"]: "bgImage", ["parent"]: "group", ["title"]: null, ["font"]: null, ["image"]: "ty_zhanLiDi02", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
            { ["index_type"]: gui.BatchImage, ["name"]: "combatForceChanged", ["parent"]: "group", ["x"]: 50, ["y"]: -2, ["w"]: width - 50, ["h"]: 30, ["messageFlag"]: true },
            { ["index_type"]: gui.BatchImage, ["name"]: "forceAddRd", ["parent"]: "group", ["x"]: 50, ["y"]: 0, ["w"]: width - 50, ["h"]: 30, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["forceAddRd"].visible = (false)

        this.mLayoutNode.alpha = 1
        let data: any = { ["alpha"]: 0 }
        this.fadeOut = AlphaAction.newObj(this.mLayoutNode, 300, data, this.endFadeOutAnim, this)
    }

    onUnLoad() {

    }

    onShow() {
        this.mLayoutNode.visible = (true)
        this.mLayoutNode.alpha = 1
        this.refreshFrame()
    }

    onHide() {
        this.mLayoutNode.visible = (false)
        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

        this.mElemList["forceAddRd"].visible = (false)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////-
    refreshFrame() {
        let batchImage: gui.BatchImage = this.mElemList["combatForceChanged"]

        let forceList = this.getQueueData()
        if (!forceList) {
            this.hideWnd()
            return
        }

        let newtestnumber = forceList[1]
        let oldtestnumber = forceList[0]

        let newLong = tostring(newtestnumber).length
        let newList = this.splitNumberToArray(newtestnumber, newLong)
        let changeList = table_copy(newList)

        let dvalue = newtestnumber - oldtestnumber

        let index = tostring(dvalue).length
        for (let i = 0; i < index; i++) {
            changeList[newLong - i - 1] = 0
        }

        let str = this.mergeAttryToNumber(changeList)
        batchImage.beginDraw();
        batchImage.drawNumberString("daZhanLi_", "l" + str, 0, 0, 0);
        batchImage.endDraw();

        let post = newLong - index//当前动画第几位 0开始

        let delay = 0
        let daWidth = 0
        let onTimerCallback = function (dt) {
            if (changeList[post] == newList[post]) {
                post++;
            } else {
                changeList[post] = (changeList[post] + 1) % 10

                let str = this.mergeAttryToNumber(changeList)
                batchImage.beginDraw();
                daWidth = batchImage.drawNumberString("daZhanLi_", "l" + str, 0, 0, 0);
                batchImage.endDraw();
            }

            if (post >= newLong) {
                this.mElemList["forceAddRd"].visible = (true)
                let imb: gui.BatchImage = this.mElemList["forceAddRd"]
                imb.beginDraw();
                imb.drawNumberString("daZhanLi02_", "+" + dvalue, 0, 0, 0);
                imb.endDraw();
                UiUtil.setXY(imb, (batchImage.x + daWidth + 10), 16)

                delay = delay + dt

                if (delay > 1000) {
                    this.startFadeOutAnim()
                }
            }
        }

        this.timer = SetTimer(onTimerCallback, this, 0);
    }

    //队列数据
    getQueueData() {
        if (this.list && size_t(this.list) > 0) {
            let oldForce = this.list[0].old
            let newForce = this.list[size_t(this.list) - 1].new

            return [oldForce, newForce]
        }

        return null
    }

    startFadeOutAnim() {
        this.fadeOut.run()
    }

    endFadeOutAnim() {
        //检查是否有后续数据
        if (size_t(this.queue) > 0) {
            if (this.exeTimer) {
                KillTimer(this.exeTimer)
                this.exeTimer = null
            }

            let startFunc = function () {
                if (!this.isVisible()) {
                    this.list = this.queue
                    this.queue = []
                    this.showWnd()
                }

                KillTimer(this.exeTimer)
                this.exeTimer = null
            }
            this.exeTimer = SetTimer(startFunc, this, 500)
        }

        this.list = []

        KillTimer(this.timer);
        this.timer = null
        this.hideWnd()
    }

    splitNumberToArray(value, count) {
        let t: any[] = []
        for (let i = 0; i < count; i++) {
            let v = value % 10
            table_insert(t, v)
            value = Math.floor(value / 10)
        }

        return t.reverse()
    }

    mergeAttryToNumber(list: any[]) {
        let str: string = ""
        for (let i in list) {
            str = str + tostring(list[i])
        }
        return str
    }

    ////////////////////////////////
}