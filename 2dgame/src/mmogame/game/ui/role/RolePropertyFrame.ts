// TypeScript file
class RolePropertyFrame extends BaseWnd {
    
    public initObj(...params: any[]) {
	
	}
    public onLoad(): void {
	
		this.mLayoutNode.width = 500
        this.mLayoutNode.height = 660
        this.setAlignCenter(true, true)
		
		let mElemInfo: any = [

            { ["index_type"]: eui.Group, ["name"]: "group_", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 500, ["h"] : 660 },
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_tipsDi", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 500, ["h"] : 660},
            { ["index_type"]: gui.Grid9Image, ["name"]: "label_bg", ["title"]: null, ["font"]: null, ["image"]: "hb_textDi02", ["color"]: gui.Color.white, ["x"]: 142, ["y"]: 25, ["w"] : 217, ["h"] : 50},
            { ["index_type"]: eui.Label, ["name"]: "label_des", ["title"]: Localize_cns("ROLE_PROPERTY"), ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.ublack, ["x"]: 142, ["y"]: 35, ["w"] : 217, ["h"] : 24},
            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_1", ["title"]: null, ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 60, ["y"]: 100, ["w"]: 200, ["h"]: 508, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_2", ["title"]: null, ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 280, ["y"]: 100, ["w"]: 200, ["h"]: 508, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: gui.Button, ["name"]: "btn_close", ["title"]: null,  ["image"]: "ty_bt_back01", ["color"]: gui.Color.white, ["x"]: 417, ["y"]: 576, ["w"]: 83, ["h"]: 84, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)
        
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this);
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		this.mLayoutNode.visible = true;
		this.onRefresh();
		RpcProxy.call("C2G_ACTOR_ROLE_PlayerAbility")
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this);
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		this.mLayoutNode.visible = false;
    }

    onRefresh(){
        let info = RoleSystem.getInstance().getRoleProperty()
        if(size_t(info) == 0) return 

        let rd_1_str = ""
        let rd_2_str = ""
        let count = 0
        for(let k in info){
            count += 1
            let v = info[k]
            let vStr = tostring(v)
            if(abilityNameToIndex[k] >= objectField.UNIT_FIELD_ATT_INC){
                //let temp = parseFloat(v)
                if(v == 0){
                    vStr = "0.00%"
                }else{
                    vStr = FormatNumber2f(v * 100) + "%"
                }
            }
            let name = GetPropertyName(k) + "#space_ten" +vStr + "#br#br#br"
            if(count % 2 == 0){
                rd_2_str += name
            }else{
                rd_1_str += name
            }
           
        }

        AddRdContent(this.mElemList["rd_1"], rd_1_str, "ht_22_lc")
        AddRdContent(this.mElemList["rd_2"], rd_2_str, "ht_22_lc")
    }
}