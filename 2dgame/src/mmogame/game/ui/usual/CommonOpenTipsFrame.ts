// TypeScript file
class CommonOpenTipsFrame extends BaseWnd {
    xPos 
    yPos
    index
    public initObj(...params: any[]) {
        this.xPos = 0
        this.yPos = 0
    }

    public onLoad(): void {

        UiUtil.setWH(this.mLayoutNode, 216, 107)
      //  this.setAlignCenter(true, true)

        let mElemInfo: any = [
            { ["index_type"]: eui.Group, ["name"]: "group", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 216 , ["h"]: 107 },
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg_", ["title"]: null, ["font"]: null, ["image"]: "ty_tipsDi", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 216 , ["h"]: 107, },
            { ["index_type"]: eui.Group, ["name"]: "group_btn", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 216 , ["h"]: 107 },
          
            { ["index_type"]: gui.Button, ["name"]: "btn_xianlv", ["title"]: null,  ["image"]: "zjm_Bt23", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 108 , ["h"]: 107, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onXianLvClick },
            { ["index_type"]: gui.Button, ["name"]: "btn_tiannv", ["title"]: null,  ["image"]: "zjm_Bt37", ["color"]: gui.Color.white,["x"]: 108, ["y"]: 0, ["w"] : 108 , ["h"]: 107, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTianNvClick },

            { ["index_type"]: eui.Group, ["name"]: "touch_group", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 90, ["y"]: 110, ["w"] : 110 , ["h"]: 110,["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd  },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.onClickOther, this, [this.mElemList["btn_xianlv"], this.mElemList["btn_tiannv"], this.mElemList["touch_group"]])
        this.mLayoutNode.visible = (true)
        this.onRefresh()
    }

    public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.onClickOther, this)
        this.mLayoutNode.visible = (false)
    }

    onRefresh(){
        let btnList = {
            [4]: [
                this.mElemList["btn_xianlv"], this.mElemList['btn_tiannv']
            ]
        }
        this.mLayoutNode.x = this.xPos
        this.mLayoutNode.y = this.yPos
        let btnGroup = btnList[this.index]

        let top : eui.Group = this.mElemList["group_btn"]
		let childNum = top.numElements
		for(let k = 0; k < top.numElements; k++){
			let child = top.getChildAt(k)
			top.removeChild(child)
		}
        for(let k = 0 ; k < size_t(btnGroup); k++){
            let btn = btnGroup[k]
            top.addChildAt(btn, k)
        }


    }

    hideRegistWnd(name) {
		// if (MainAutoHideUI[name] && WngMrg.getInstance().isVisible(name)) {
		// 	return true
		// }

		let isVisible = WngMrg.getInstance().isVisible(name)


		for (let registname in MainAutoHideUI) {
			WngMrg.getInstance().hideWindow(registname)
		}
		return isVisible
	}

    ////---------响应事件
    onXianLvClick(){
        this.hideWnd()

        if (this.hideRegistWnd("XianLvFrame")) return;
        ExecuteMainFrameFunction("xianlv")
    }

    onTianNvClick(){
        this.hideWnd()
        if (this.hideRegistWnd("TianNvFrame")) return;
        ExecuteMainFrameFunction("tiannv") 
    }
    onShowWnd(index, xPos, yPos){
        this.index = index
        this.xPos = xPos
        this.yPos = yPos
        this.showWnd()
    }

    onClickOther(){
       this.hideWnd()
    }
}