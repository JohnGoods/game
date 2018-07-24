/*
作者:
    yangguiming
	
创建时间：
   2013.9.24(周二)

意图：
   冒泡聊天

公共接口：
   
*/
class ChatBubbleFrame extends BaseWnd {
    playerOwner: Player;
    content
    showTime
    holdTime
    width
    
    mTimeId:number
    tick:number
    isXml:boolean
    owner: Player;

    public initObj(...args: any[]): void {
        this.playerOwner = null
        this.content = null
        this.showTime = 6000
        this.holdTime = 5500
    }

    onLoad() {
        this.createFrame()
    }

    onUnLoad() {
        this.closeFrame()
        //this.mRootWindow.ReleaseFrame(this.mLayoutNode)
        //this.mLayoutNode = null
    }

    onShow() {
        //if(this.content ){
        //	//RegisterEvent(EventDefine.MAP_VIEWPORTCHANGE, this.onMapViewportChange, this)
        //	//RegisterEvent(EventDefine.PLAYER_MOVE, this.onPlayerMove, this)
        //	
        this.mLayoutNode.visible = true
        //	this.showMsg(this.content)
        //}
    }

    onHide() {
        this.closeFrame()
        //UnRegisterEvent(EventDefine.MAP_VIEWPORTCHANGE, this.onMapViewportChange, this)
        //UnRegisterEvent(EventDefine.PLAYER_MOVE, this.onPlayerMove, this)
        //this.mLayoutNode.visible = (false)
    }

    onReset() {
        this.hideWnd()
    }

    createFrame() {
        

        let width = 141, height = 90
        UiUtil.setWH(this.mLayoutNode, width, height);
        this.mLayoutNode.horizontalCenter = 0;
        this.mLayoutNode.bottom = height;
        this.mLayoutNode.touchChildren = false;
        this.mLayoutNode.touchEnabled = false;


        this.width = width - 15
        
        this.mElemList = {}
        let elemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "zd_duiHuaDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null, },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "displayer", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 15, ["y"]: 10, ["w"]: this.width, ["h"]: height - 50, ["event_name"]: gui.RichDisplayer.RichDisplayerTranslateEvent, ["fun_index"]: this.OnDialogTranslateWord, }
        ]
        UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this)

    }


    showMsg(msg) {
        //if(this.mTimeId ){
        //	return
        //}
        let rd:gui.RichDisplayer = this.mElemList["displayer"]
        this.setFrameAlpha(1)
        if (!this.mTimeId) {
            this.mTimeId = SetTimer(this.onVpTickEvent, this, 0)
        }
        this.tick = 0
        UiUtil.setWH(rd, this.width - 10, rd.height)
        
        rd.clear()
        //	rd.SetDisplayRect(0, 0, 220, 200)
        let font: any = {}
        font.default_color = "white"
        font.defalut_font = "ht_20_cc"

        if (this.isXml) {
            rd.addXmlString(msg)
        } else {
            let parseLinkHandler = function (linkContent) {
                return null
            }
            font.link_parser = parseLinkHandler
            rd.addXmlString(XmlConverter.parseText(msg, font))
        }
        //rd.AddXmlString(msg)
        let height = rd.getLogicHeight()
        height = height < 30 && 30 || height

        let width = rd.getLogicWidth()
        if (width == 0) {
            return this.hideWnd()
        }

        UiUtil.setWH(this.mLayoutNode, 141, height + 40)
        UiUtil.setWH(rd, width, height + 10)
        UiUtil.setWH(this.mElemList["bg"], this.mLayoutNode.width, this.mLayoutNode.height)
        

        //this.mLayoutNode.SetAlignMode(Core.Flag.CENTER_BOTTOM, 0, -200)
        this.mLayoutNode.bottom = 110;

        this.mLayoutNode.horizontalCenter = 0
        if (FightSystem.getInstance().isFight() == true) {
            let mapPos = this.owner.getMapXY()
            let screenPos = SceneManager.getInstance().mapXYtoScreenXY(mapPos.x, mapPos.y)
            let sw = this.mLayoutNode.width
            if (screenPos.x + sw / 2 > 640) {
                //this.mLayoutNode.SetAlignMode(Core.Flag.CENTER_BOTTOM, 640 - screenPos.x - sw / 2, -200)
                this.mLayoutNode.horizontalCenter =  640 - screenPos.x - sw / 2
                //this.mLayoutNode.bottom = 200
            }
        }
    }

    setShowMsg(content, obj, isXml, showTime) {
        if (content == "") {
            return this.hideWnd()
        }

        this.content = content
        this.owner = obj
        this.isXml = checkNull(isXml , false)

        this.showTime = showTime || 6000
        this.holdTime = this.showTime * 11 / 12

        this.showWnd()
        this.showMsg(content)
    }

    onVpTickEvent(delayTime) {
        this.tick = this.tick + delayTime
        if (this.tick >= this.showTime) {
            this.hideWnd()
        } else if (this.tick >= this.holdTime) {
            this.setFrameAlpha(1 - (this.tick - this.holdTime) / (this.showTime - this.holdTime))
        }
    }

    setFrameAlpha(alpha) {
        //this.mLayoutNode.SetFrameAlphaColor(255 * alpha, 255, 255, 255)
        this.mLayoutNode.alpha = alpha
    }

    closeFrame() {
        if (this.mTimeId) {
            KillTimer(this.mTimeId)
        }
        this.mTimeId = null
        this.tick = 0
        this.content = null
        this.mLayoutNode.visible = (false)
    }

    //onMapViewportChange( args){
    //	if(! this.mLayoutNode ){
    //		return
    //	}
    //	this.setFramePos()
    //}


    OnDialogTranslateWord(args:gui.GUITranslateWordEvent) {
        
        let word = args.getTranslateWord()
        args.setTranslateWord(TaskExecutor.getInstance().executeGetReplaceWord(word, 0))
    }

}