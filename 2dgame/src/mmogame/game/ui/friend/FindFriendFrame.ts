
class FindFriendFrame extends BaseWnd {

	ID_CURRENT_PROPERTY = 1;
	ID_NEXT_PROPERTY = 2;

	public initObj(...params: any[]) {
		
	}

	public onLoad(): void {
		UiUtil.setWH(this.mLayoutNode, 560, 400)
		this.setAlignCenter(true, true)

		let mElemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "_bg", ["image"]: "ty_uiDi01", ["title"]: null, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
            { ["index_type"]: eui.Image, ["name"]: "bgtitle", ["title"]: null, ["font"]: null, ["image"]: "ty_uiBiaoTiDi01", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["y"]: 0,  ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Label, ["name"]: "title", ["parent"]: "bgtitle", ["title"]: Localize_cns("CHAT_TXT5"), ["font"]: "ht_28_cc_stroke", ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["y"]: 16, ["event_name"]: null, ["fun_index"]: null },

            {["index_type"] : gui.Grid9Image,  ["name"] : "searchTool",  ["image"] : "ty_uiDi03",  ["x"] : 30, ["y"] : 110,  ["w"] : 500, ["h"] : 130, ["event_name"] : null, ["fun_index"] : null},
            {["index_type"] : gui.Grid9Image,   ["name"] : "input_bg",    ["parent"] : "searchTool",  ["image"] : "ty_uiDi02", 	["x"] : 20, 	["y"] : 40,   ["w"] : 360, 	["h"] : 50, ["event_name"] : null,["fun_index"] : null},
            {["index_type"] : eui.EditableText,    ["name"] : "input_edit",  ["parent"] : "input_bg",  ["prompt"] : Localize_cns("INPUT_FRIEND_NAME_OR_ID"),    ["font"] : "ht_22_lc", ["color"] : gui.Color.white,   	["x"] : 10, 	["y"] : 5,   ["w"] : 340, 	["h"] : 50, ["event_name"] : null,["fun_index"] : null},
            {["index_type"] : gui.Button,  ["name"] : "searchBtn",   ["parent"] : "searchTool", ["image"] : "lt_bt_shuRu01", ["x"] : 390, ["y"] : 40,	["event_name"] :egret.TouchEvent.TOUCH_TAP , ["fun_index"] : this.onClickSearchFriend},


            { ["index_type"]: gui.Button, ["name"]: "btn_close", ["title"]: null, ["font"]: null, ["image"]: "ty_bt_back01", ["color"]: gui.Color.white, ["right"]: 0, ["bottom"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd, },
            { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null, ["font"]: null, ["image"]: "ty_bt_back02", ["color"]: gui.Color.white, ["right"]: 0, ["top"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd, },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        let edit:eui.EditableText = this.mElemList["input_edit"]
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.SEARCH_PLAYER_RESULT, this.hideWnd, this)
		this.mLayoutNode.visible = true;
		this.mElemList["input_edit"].text = ("")
	}

	public onHide(): void {
		this.mLayoutNode.visible = (false)
	    UnRegisterEvent(EventDefine.SEARCH_PLAYER_RESULT, this.hideWnd, this)
	}


    onClickSearchFriend( args){
        let edit:eui.EditableText = this.mElemList["input_edit"]	
        let content = edit.text;
        if(StringUtil.isEmpty(content)){
            return
        }else{
            FriendSystem.getInstance().searchPlayerByName(content)
        }
    }
}