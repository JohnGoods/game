/*
作者:
    liuziming
	
创建时间：
   2017.02.24(周五)

意图：
   全屏界面底图
公共接口：
   
*/
class FullScreenBgFrame extends BaseWnd {
    public initObj(...args: any[]): void {
       
        RegisterEvent(EventDefine.UI_SHOW, this.onWndUIShow, this)
		RegisterEvent(EventDefine.UI_HIDE, this.onWndUIHide, this)
    }

    destory(){
        UnRegisterEvent(EventDefine.UI_SHOW, this.onWndUIShow, this)
		UnRegisterEvent(EventDefine.UI_HIDE, this.onWndUIHide, this)
    }

    onLoad() {
        this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
        this.setFullScreenRaw(true)
        
        var mElemInfo = [
				{ ["index_type"]: eui.Image, ["name"]: "_bg_", ["title"]: null, ["image"]: "ty_ztUiDi01", ["x"]: 0, ["y"]: 0, ["percentWidth"]:100, ["percentHeight"]:100, ["fillMode"]:egret.BitmapFillMode.SCALE},
			]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)
    }

    onUnLoad() {

    }

    onShow() {
        this.mLayoutNode.visible = (true)
        this.mLayoutNode.moveToBack()

        //暂时写死这两个
        let backFrameList = BackToFullScreenUI
        for( let name of backFrameList){
            let wnd = WngMrg.getInstance().getWindow(name)
            wnd.moveToBack();
        }

        if(MsgSystem.s_iconMsgFrame){
            MsgSystem.s_iconMsgFrame.moveToBack()
        }
    }

    onHide() {
        this.mLayoutNode.visible = (false)
    }

    ////////////////////////////////////////////////////////////////////-

    onWndUIShow( args){
        let className = args.window.classname
        if(g_FullScreenRegisterMap[className]){
          
            this.showWnd()
          
        }
    }

    onWndUIHide( args){
        let className = args.window.classname
        if(g_FullScreenRegisterMap[className]){
            let wngMrg:WngMrg = WngMrg.getInstance()

            let bHide = true
            for(let wndName in g_FullScreenRegisterMap){
                if(className != wndName){
                    if(wngMrg.isVisible(wndName)){
                        bHide = false
                        break
                    }
                }
            }

           if(bHide){
               this.hideWnd()
           }
        }
    }


}