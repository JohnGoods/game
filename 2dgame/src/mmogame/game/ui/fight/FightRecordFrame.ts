/*
作者:
    liuziming
	
创建时间：
   2015.10.20(周二)

意图：
   
公共接口：
   
*/
class FightRecordFrame extends BaseWnd {

    scroll: UIScrollList;

    public initObj(...args: any[]): void {
        //this.controlDataTable = {}
    }

    onLoad() {
        this.createFrame()
    }

    onUnLoad() {

    }

    onShow() {
        //if(CampaignSystem.getInstance().isCampaignPass(1036) == false ){
        //	MsgSystem.AddTagTips(Localize_cns("RECORD_OPEN_TIPS"))
        //	return this.hideWnd()
        //}

        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    onHide() {
        this.mLayoutNode.visible = (false)
    }

    ////////////////////////////////////////////////////////////////////-
    createFrame() {
        UiUtil.setWH(this.mLayoutNode, 640, 900)
        this.setFullScreen(true)
        this.mLayoutNode.setLayer(gui.GuiLayer.Top)


        let mElemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "_bg", ["image"]: "ty_uiDi01", ["title"]: null, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
            { ["index_type"]: eui.Image, ["name"]: "bgtitle", ["title"]: null, ["font"]: null, ["image"]: "ty_uiBiaoTiDi01", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["y"]: 0,  ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Label, ["name"]: "title", ["parent"]: "bgtitle", ["title"]: Localize_cns("FIGHT_TXT2"), ["font"]: "ht_28_cc_stroke", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["y"]: 6, ["event_name"]: null, ["fun_index"]: null },

            { ["index_type"]: gui.Grid9Image, ["name"]: "scroll_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi02", ["color"]: gui.Color.navajowhite, ["x"]: 40, ["y"]: 70, ["w"]: 560, ["h"]: 785, ["event_name"]: null, ["fun_index"]: null },

            { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null, ["font"]: null, ["image"]: "ty_bt_back02", ["color"]: gui.Color.white, ["right"]: 0, ["top"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd, },
            { ["index_type"]: gui.Button, ["name"]: "btn_close", ["title"]: null, ["font"]: null, ["image"]: "ty_bt_back04", ["color"]: gui.Color.white, ["right"]: 0, ["bottom"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd, },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        let name = "scroll"
        let window = UIScrollList.newObj(this.mLayoutNode, "scroll", 5, 10, 550, 765, this.mElemList["scroll_bg"])
        this.scroll = window

    }

    refreshFrame() {
        let content:string[] = table_copy(FightSystem.getInstance().getFightRecord())
        //let content = Localize_cns("FIGHT_CHANGE_POSTION2")
        //for(let i = 1; i <=  20;i++){
        //	content = content +Localize_cns("FIGHT_CHANGE_POSTION2")
        //}

        //
        let [leftDamage, rightDamage] = FightSystem.getInstance().getFightDamage()
        let side = FightSystem.getInstance().getSelfFightSide()
        if (side == fightSide.FIGHT_RIGHT) {
            rightDamage = leftDamage, leftDamage = rightDamage
        }
        //敌方
        JsUtil.arrayInstert(content, 0, "#cyan " + Localize_cns("RECORD_BATTLE_TXT2") + "#br" + rightDamage + "#rf#br")
        //我方
        JsUtil.arrayInstert(content, 0, "#navajowhite " + Localize_cns("RECORD_BATTLE_TXT1") + "#br" + leftDamage + "#rf#br")


        let scroll = this.scroll
        scroll.clearItemList()
        for (let index = 0; index < content.length; index++) {
            let xml = content[index]

             let [window, flag] = scroll.getItemWindow(index, scroll.getWidth(), 100, 0, 0)
             if (flag == true) {
                this.refreshItemWindow(window, xml, index)
             }
        }

    }

    refreshItemWindow(window, xml, index) {
        let name = window.name

        let mElemInfo: any = [
            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd" + name, ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.navajowhite, ["x"]: 0, ["y"]: 0, ["w"]: 550, ["h"]: 240, ["event_name"]: null, ["fun_index"]: null },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

        let rd:gui.RichDisplayer = this.mElemList["rd" + name]
        rd.setRowDistance(5)
        //ui_util.CreateDrawRectPtr(rd, gui.Color32Half.green)

        rd.clear()
        let font: any = {}
        font.no_change_font = true
        font.defalut_font = "ht_24_cc_stroke"
        font.default_color = "oldlace"
        xml = XmlConverter.parseText(xml, font)
        rd.addXmlString(xml)
        

        let height = rd.getLogicHeight() + 5
        //height = Math_util.clamp(height, 50, 620)
        rd.height = height;
        window.height = height;
    }

    ////////////////////////////////-响应函数////////////////////////////////-
    onReturn(args) {
        return this.hideWnd()
    }

}