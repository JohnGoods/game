// TypeScript file
class RoleSkillsSettingFrame extends BaseWnd {
    scroll :UIScrollList;
    levelList ;

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/RoleSkillsSettingLayout.exml"]
       
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        
        let group: eui.Group = this.mElemList["group_skills"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)	
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this);
		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
		this.onRefresh();
		
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this);
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);
	}
    
   
     onRefresh(){
        let list = RoleSystem.getInstance().getRoleInfo("skillorderlist")
		if(size_t(list) == 0) return;
		let entryId =  RoleSystem.getInstance().getRoleInfo("entryid")
		let skillList = GameConfig.ActorRoleConfig[entryId].skill
		let count = size_t(list);
		if(count == 0) return;
        let scroll = this.scroll
        
        scroll.clearItemList()
        
        for(let k = 1; k <= count; k++){

			let id = skillList[list[k-1]-1];
			
            let level = this.levelList[list[k-1]-1]
			let [window, flag] = scroll.getItemWindow(list[k-1], 510, 140 , 0, 0)
			if (flag == true) {
            	this.initItemWindow(window)
			}
            this.refreshItemWindow(window, id , level)
        }
        
        scroll.refreshScroll(true, true)

	}	
     initItemWindow(window) {
        let name = window.name
        let mElemInfo: any = [
         { ["index_type"]: gui.Grid9Image,["name"] : name +"_bg",  ["image"]: "ty_uiDi03", ["autoScale"] :true, ["x"] : 0, ["y"] : 0,["w"] :510 ,["h"] : 140},	
		 { ["index_type"]: eui.Group, ["name"]: name + "_skill", ["parent"]:name + "_bg", ["title"]:"", ["x"]: 9, ["y"]: 24, ["w"]: 80, ["h"]: 80, ["messageFlag"]: true },
		 { ["index_type"]: eui.Image, ["name"]: name + "_name_bg" ,["parent"]:name + "_bg", ["title"]:"", ["font"]: "", ["image"]: "hb_textDi02", ["color"]: null, ["x"]: 122, ["y"]: 10, ["w"]: 0, ["h"]: 0,["messageFlag"]: true },
		 { ["index_type"]: eui.Label, ["name"]: name + "_name" ,["parent"]:name + "_name_bg", ["title"]:"", ["font"]: "ht_24_cc", ["image"]: "", ["color"]: "ublack", ["x"]: 20, ["y"]: 10, ["w"]: 186, ["h"]: 30, ["messageFlag"]: true },
		 { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_instruct" ,["parent"]:name + "_bg", ["title"]:"", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: "ublack", ["x"]: 122, ["y"]: 60, ["w"]: 270, ["h"]: 70, ["messageFlag"]: true },
		 { ["index_type"]: gui.Button, ["name"]: name + "_btnUp" ,["parent"]:name + "_bg", ["title"]:Localize_cns("ROLE_TXT35"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 53, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]:this.onBtnUpClick },
		];
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window );     

	//	if(!this.mElemList[name + "_skilbox"]){
			this.mElemList[name + "_skilbox"] = UISkillBox.newObj(this.mLayoutNode, name + "_skilbox", 0, 0, this.mElemList[name + "_skill"])
	//	}  
		this.mElemList[ name + "_instruct"].setAlignFlag(gui.Flag.LEFT_TOP)      
    }

    refreshItemWindow(window, id, level) {
		let config = GameConfig.ActorRoleSkillConfig[id];
        let name = window.name;
		let str = String.format(Localize_cns("ROLE_TXT34"),level)
		let skillName = SkillSystem.getInstance().getSkillName(id) + str;
        this.mElemList[ name + "_name"].text = skillName;

		//let type = config.effects[0][0];
	   // if(type == "demage")  {
			//let str = String.format(Localize_cns("ROLE_TXT32"),config.effects[0][1]);
		let desStr = String.format(SkillSystem.getInstance().getRoleSkillDes(id, level))	
		AddRdContent(this.mElemList[ name + "_instruct"], desStr, "ht_20_cc", "ublack")
		//.text = desStr
		//}
		 
		this.mElemList[name + "_skilbox"].updateRoleSkill(id)
    }

	onBtnUpClick(event : egret.Event){
	   let name = event.target.name;
	   let index  = name.replace(/[^0-9]/ig, "");
	   RpcProxy.call("C2G_ACTOR_ROLE_SKILL_ORDER_UP", tonumber(index))
	}
	onShowWnd(list){
		this.levelList = list;
		this.showWnd();
	}
}