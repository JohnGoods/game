class RoleSkillsWindow extends BaseCtrlWnd {
	mElemList;
	levelList;
    select;
	isLock;
	skillList;
	
	actorList : any
	isShow

	public initObj(...params: any[]) {
		this.actorList = []
		this.isShow = false
	}
    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		
		var elemInfo = [
		 	{ ["name"]: "btn_S_onekeyUp", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyClick },
			{ ["name"]: "btn_S_Up", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },
			{ ["name"]: "btn_skillSetting", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSkillsSettingClick },
			];
			
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		this.select = -1;

		this.mElemList["rd_S_lvUp"].setAlignFlag(gui.Flag.H_CENTER);
		this.mElemList["rd_S_upGrade"].setAlignFlag(gui.Flag.H_CENTER);
		this.mElemList["label_skillname"].textColor = "ublack"
		this.mElemList["label_skillInstruction"].textColor = "ublack"

		for(let k = 1; k <= 5; k++){
			this.actorList[k] = UIActorView.newObj(this.mLayoutNode, "upgrade_effect_" + k, 0, 0, this.mElemList["skill_actor_" + k])
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		//RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this);
		RegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this);
		this.mElemList["group_skills"].visible = true;
		this.mElemList["label_wndName"].text = Localize_cns("ROLE_TXT12");
		
		this.onRefresh();
	}

	public onHide(): void {
		//UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onShowItemDes, this);
		UnRegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this);
		this.mElemList["group_skills"].visible = false;
		
		for(let k = 1; k <= 5; k++){
			let actor : UIActorView = this.actorList[k]
			actor.clearView()
		}

		this.select = -1
	}
	
	updateWnd(){
		
	}

	onRefresh(){
		let info = RoleSystem.getInstance().getRecvList()
		if(size_t(info) == 0) return;
		this.levelList = info["skilllevellist"]
		let oldlevelList = RoleSystem.getInstance().getOldLevelList()
		
		let posList = []
		if(size_t(oldlevelList) != 0){
			for(let k = 0; k < size_t(this.levelList);k++){
				/*if(oldlevelList[k] == null){
					table_insert(posList, k + 1)
				}*/
				if(this.levelList[k] != oldlevelList[k] && oldlevelList[k] != null){
					table_insert(posList, k + 1)
				}
			}
			RoleSystem.getInstance().setOldLevelList()
		}
		
		for(let k = 0; k < size_t(posList); k++){
			let v = posList[k]
			let actor : UIActorView = this.actorList[v]
			actor.updateByOnceEffect(effectIndex.QiangHua)
		}
		

		let entryId =  RoleSystem.getInstance().getRoleInfo("entryid")  //10001
		this.skillList = GameConfig.ActorRoleConfig[entryId].skill
		this.onInitSkillItem();

 		if(this.select == -1) this.select = 1;
		this.onShowItemDes(this.skillList[this.select - 1], this.levelList[this.select-1], this.select);

		let count = this.onCountList(this.levelList)
		let manji = true
		let level = RoleSystem.getInstance().getRoleInfo("stage")
		let toMoney = 0;

		for(let i = 0 ;i < count;i++){
			let temp = this.levelList[i]
			if(temp < level){
				manji = false
			}
			toMoney = toMoney + GameConfig.FunSpendMoneyItemConfig["HeroSkill"][temp].money
		}

		let unitType = GameConfig.FunSpendMoneyItemConfig["HeroSkill"][1].moneyunit
		let str1 = GetMoneyIcon(unitType) + String.format(Localize_cns("ROLE_TXT30"),toMoney)
		if(manji == true){
			str1 = GetMoneyIcon(unitType) + Localize_cns("ROLE_TXT31")
		}
		AddRdContent(this.mElemList["rd_S_upGrade"],str1,"ht_24_cc", "ublack");
	}
   

   onInitSkillItem(){
	   let list = GameConfig.ActorRoleSkillConfig;
	   let count = size_t(this.levelList)
	   
	   let skillList = this.skillList;
	   for(let i = 1; i <= 8;i++){
		   
		   
		   let skillName = Localize_cns("ROLE_TXT21")
		
		   let name = "skillItem";

		   if(!this.mElemList[ name + "skillBox" + i]) {
			   this.mElemList[name + "skillBox" + i] = UISkillBox.newObj(this.mLayoutNode, name + "skillBox" + i, 17, 17, this.mElemList["skill" + i])
			   let mElemInfo: any = [
                // { ["index_type"]: eui.Image, ["name"]: name + "_bg" + i, ["image"]: bgImage, ["x"]: 17, ["y"]: 17, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				 { ["index_type"]: eui.Image, ["name"]:name + "name_bg" + i, ["image"]: "ty_textDi05", ["x"]: 3, ["y"]: 116, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				// { ["index_type"]: eui.Image, ["name"]: name + "_sprite" + i, ["image"]: "", ["x"]: 17, ["y"]: 17, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				// { ["index_type"]: eui.Image, ["name"]: name + "_select" + i, ["image"]: "hb_jiNengXuanZhong", ["x"]: 0, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				 { ["index_type"]: eui.Label, ["name"]: name + "_name" + i, ["parent"]:name + "name_bg" + i,["title"]:skillName, ["font"]: "ht_24_cc_stroke", ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 127, ["h"]: 40,  ["messageFlag"]: true },
				 { ["index_type"]: gui.Grid9Image, ["name"]: name + "_lv_bg" + i, ["parent"]: name + "_bg" + i,["title"]:"",  ["image"]: "ty_textDi01", ["color"]: gui.Color.white, ["x"]: 36, ["y"]: 100, ["w"]: 60, ["h"]: 20, ["messageFlag"]: true },
				 { ["index_type"]: eui.Label, ["name"]: name + "_lv" + i, ["parent"]: name + "_lv_bg" + i,["title"]: "", ["font"]: "ht_20_cc", ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 60, ["h"]: 20, ["messageFlag"]: true },
				 ];
        		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this,this.mElemList["skill" + i] );
		   	//	this.mElemList[name + "_select" + i].visible = false;
		
		   }
		   let skillId = skillList[i-1]
		   let level = this.levelList[i-1]
		   if(skillId != null && level != null && level != 0){		 
			   this.mElemList[name + "skillBox" + i].updateRoleSkill(skillId, level)
			   this.mElemList[name + "skillBox" + i].setTipsListner(this.onShowItemDes, this, i)
			   this.mElemList[name + "_lv" + i].text = tostring(level)
			   this.mElemList[name + "_lv_bg" + i].visible = true
			   this.mElemList[name + "_lv" + i].visible = true
			   skillName= SkillSystem.getInstance().getSkillName(skillId)
			   this.mElemList[name + "_name"  + i].text = skillName

		   }else{
			   this.mElemList[name + "skillBox" + i].lock()
			   this.mElemList[name + "_lv_bg" + i].visible = false
			   this.mElemList[name + "_lv" + i].visible = false

			   if(skillList[i-1]) {
				   let config = elemSkillLoopOptions[cellOptionsIndex.HeroSkill]["UnlockLevel"]
			   	   this.mElemList[name + "_name"  + i].text = config[i-1] + Localize_cns("ROLE_LEVEL_OPEN")
			   }
			   
		   }
	   }
	   
   }

  
   onShowItemDes(skillId, skillLv, index){
		let id = skillId;
		let list = GameConfig.ActorRoleSkillConfig[id];
		this.select = index
		
	    if(list){
            //label_skillname   label_skillInstruction
			let str = String.format(Localize_cns("ROLE_TXT34"),this.levelList[index - 1])
			let name = SkillSystem.getInstance().getSkillName(skillId) + " " + str;
			this.mElemList["label_skillname"].text = name ;
			let skillDes = SkillSystem.getInstance().getRoleSkillDes(skillId, skillLv)
			this.mElemList["label_skillInstruction"].text = skillDes
			
	    }
        let name = "skillItem";
		for(let i = 1; i <= size_t(this.levelList); i++){
			this.mElemList[name + "skillBox" + i].select(false);
		}
		this.mElemList[name + "skillBox" + index].select(true);

	   	let upSpend = GameConfig.FunSpendMoneyItemConfig["HeroSkill"];
		let money = upSpend[skillLv].money;
		let unitType = upSpend[skillLv].moneyunit
		let str = GetMoneyIcon(unitType) + String.format(Localize_cns("ROLE_TXT30"),money)
		AddRdContent(this.mElemList["rd_S_lvUp"],str,"ht_24_cc");	
   }

  onCountList(list){
	  let count = 0;
	  for(let i = 0; i< size_t(list); i++){
		  if(list[i] != 0) {
			  count++;
		  }    
	  }
	return count;
  }


  public onOneKeyClick():void{
	  	let show = true
		let level = RoleSystem.getInstance().getRoleInfo("stage")
		let minLevel = 0
		for(let k in this.levelList){
			let tempLevel = this.levelList[k]
			if(tempLevel < level){
				show = false
			}
			if(minLevel == 0){
				minLevel = tempLevel
			}
			if(tempLevel < minLevel){
				minLevel = tempLevel
			}
		}
		if(show == true){
			MsgSystem.addTagTips(Localize_cns("ROLE_ADD_tips_2"))
			return 
		}

	  	let ownMoney = GetHeroProperty("funds")
		let costMoney = GameConfig.FunSpendMoneyItemConfig["HeroSkill"][minLevel].money
		if(ownMoney < costMoney) {
			MsgSystem.addTagTips(Localize_cns("ROLE_ADD_tips_1"))
			return 
		}
	  	RpcProxy.call("C2G_ACTOR_ROLE_SKILL_UPGRADE_MUCH", 0)
   }
   
   public onUpClick():void{
	   	let thislevel = this.levelList[this.select - 1]
		let herolevel = RoleSystem.getInstance().getRoleInfo("stage")
		if(thislevel >= herolevel){
			MsgSystem.addTagTips(Localize_cns("ROLE_ADD_tips_3"))
			return 
		}
	   	let ownMoney = GetHeroProperty("funds")
		let upSpend = GameConfig.FunSpendMoneyItemConfig["HeroSkill"];
		let money = upSpend[this.levelList[this.select-1]].money;
		if(ownMoney < money) {
			MsgSystem.addTagTips(Localize_cns("ROLE_ADD_tips_1"))
			return 
		}
	    RpcProxy.call("C2G_ACTOR_ROLE_SKILL_UPGRADE_ONE", this.select)
   }

   public onSkillsSettingClick():void{
        let wnd = WngMrg.getInstance().getWindow("RoleSkillsSettingFrame");
		wnd.onShowWnd(this.levelList);
   }
}