// TypeScript file
class UIMainFastChat extends TClass {
    mRootWnd: BaseWnd;
    mLayoutNode: gui.LayoutNode;
    
    mElemList: any;


    mParent:egret.DisplayObjectContainer

    name:string;


    public initObj(...params: any[]) {
        this.mRootWnd = params[0]
        this.mLayoutNode = params[1]
        this.name = params[2]
        let x = params[3] || 0
        let y = params[4] || 0
        this.mParent = params[5]
		this.mElemList = this.mRootWnd.mElemList
        let mElemInfo: any = [
            // { ["index_type"]: eui.Group, ["name"]: this.name, ["title"]: null, ["x"]: x, ["y"]: y, ["event_name"]: null, ["fun_index"]: null, ["touchEnabled"]: false },
            // { ["index_type"]: gui.Grid9Image, ["name"]: "UIchat_bg", ["parent"]: this.name, ["title"]: null, ["font"]: null, ["image"]: "zjm_shuRuDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 640, ["h"]: 220,  ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this,  this.mParent)

        var elemInfo = []


        // elemInfo.push({ ["name"]: "btn_send", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSendMsg })
		 let list: eui.List = this.mElemList["list_chat_fast"]
      
        list.itemRenderer = itemRender.FastChatItem


		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		this.initFrame()
    }

    initFrame() {
		let config = GameConfig.GuideChatConfig
		let fastChatList = []
		for(let _ in config){
			let v = config[_]
			table_insert(fastChatList,v)
		}
		let list: eui.List = this.mElemList["list_chat_fast"]
        UiUtil.updateList(list, fastChatList);
    }

	setVisible(visible){
		this.mElemList[this.name].visible = visible
	}

}

module itemRender {
    export class FastChatItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = this.name
            let w = 450
            let h = 30

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: "_bg", ["bAdapteWindow"]: true,["title"]: "",["autoScale"]:true, ["font"]: null, ["image"]: "ty_kuaiJieDi01", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClick },
                // { ["index_type"]: eui.Image, ["name"]: "emailicon", ["bAdapteWindow"]: true,["title"]: "", ["image"]: "yj_youJianIcon01", ["x"]: 10, ["y"]: 8, ["w"]: 90, ["h"]: 90, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "fast_chat_text", ["parent"]: "_bg", ["title"]: "", ["font"]: "ht_24_lc", ["image"]: null, ["color"]: gui.Color.saddlebrown, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                // { ["index_type"]: eui.Label, ["name"]: "emaildate", ["title"]: "", ["font"]: "ht_24_lc", ["image"]: null, ["color"]: gui.Color.ublack, ["x"]: 112, ["y"]: 52, ["w"]: 200, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
        }

        protected dataChanged(): void {
            let v = this.data;
            this.mElemList["fast_chat_text"].text = v.content
        }

        onClick(args) {
           let v = this.data;
		   let wnd = WngMrg.getInstance().getWindow("MainFrame")
		   wnd.setChatContent(v.content)
		   wnd.setFastChatIsVisible(false)
        }

    }
}