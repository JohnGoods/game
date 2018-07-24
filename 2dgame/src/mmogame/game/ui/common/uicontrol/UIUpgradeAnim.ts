// TypeScript file
/*
作者:
    chenpeng
	
创建时间：

意图：
   升级+N动画
   
公共接口：
   
*/

class UIUpgradeAnim extends TClass {
    mParentNode: eui.Component;
    name: string;

    mElemList: any;

    moveAnim: MoveAction;

    public initObj(...args: any[]): void {
        this.mParentNode = args[0]
        this.name = args[1]
        let x = args[2]
        let y = args[3]

        let parentWnd = args[4]

        this.mElemList = {}

        let mElemInfo: any = [
            { ["index_type"]: eui.Label, ["name"]: this.name, ["title"]: "", ["font"]: "ht_16_cc", ["color"]: gui.Color.green, ["x"]: x, ["y"]: y, ["w"]: 50, ["h"]: 20, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

        var data: any = { ["startX"]: x, ["startY"]: y, ["endX"]: x, ["endY"]: y - 50, ["moveType"]: "inertional", }
        this.moveAnim = MoveAction.newObj(this.mElemList[this.name], 300, data, this.endAnim, this)
    }

    protected destory(): void{
        this.moveAnim.deleteObj()

        let l:eui.Label = this.mElemList[this.name]
        UiUtil.removeFromParent(l)
        
    }

    startAnim(number) {
        this.setContent(number)
        this.moveAnim.run()
    }

    endAnim() {
        this.moveAnim.stop()

        let _this = this
        let timer = SetTimer(function () {
            _this.deleteObj()

            KillTimer(timer)
            timer = null
        }, this, 150)
    }

    setContent(number) {
        this.mElemList[this.name].text = "+" + number
    }

    // setVisible(b: boolean) {
    //     this.mElemList[this.name].visible = b
    // }
}