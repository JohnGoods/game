module tool {


	export class FightTriggerFrame extends BaseWnd{
		mFightEditor:FightEditor;

		skillShow:any;
		curActionList:any[]
		curAction:any;


		saveButtonList:gui.Button[];
		saveLabelList:eui.Label[];
		action2BtnMap:any;

		public initObj(...params:any[]){
			this.mLayoutPaths = ["resource/layouts/tool/FightTriggerLayout.exml"]
			this.mFightEditor = params[0];

			this.skillShow = {};
			this.curActionList = [];

			this.saveButtonList = []
			this.saveLabelList = []
			this.action2BtnMap = {}
		}

		public onLoad():void{
			this.mLayoutNode.skinName = this.mLayoutPaths[0];
			this.mLayoutNode.left = 0;
			this.mLayoutNode.bottom = 0;
			this.mLayoutNode.setCanDrag(true)


			var elemInfo =[
				{["name"] : "edit_skillid",  ["title"] : null,  ["color"] : gui.Color.black, ["prompt"]: "技能ID", ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				{["name"] : "combox_skill",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onSelectIdDrop},
				{["name"] : "btn_load",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onClickLoad},

				{["name"] : "edit_skillname",  ["title"] : null, ["color"] : gui.Color.black, ["prompt"]: "技能名", ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				{["name"] : "edit_time",  ["title"] : null, ["color"] : gui.Color.black, ["prompt"]:MaxShowTime+" ms", ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},

				{["name"] : "btn_action_1",  ["title"] : null,  ["event_name"] : egret.Event.CHANGE, ["fun_index"] : this.onCheckActionList, ["groupName"] : "action_group"},
				{["name"] : "btn_action_2",  ["title"] : null,  ["event_name"] : egret.Event.CHANGE, ["fun_index"] : this.onCheckActionList, ["groupName"] : "action_group"},
				{["name"] : "btn_action_3",  ["title"] : null,  ["event_name"] : egret.Event.CHANGE, ["fun_index"] : this.onCheckActionList, ["groupName"] : "action_group"},

				{["name"] : "btn_play",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onClickPlay},
				{["name"] : "btn_save",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onClickSave},

				{["name"] : "btn_add",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onAddAction},
				{["name"] : "btn_remove",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onRemoveAction},


				{["name"] : "group_scroller",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				
				
			];
			UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

			this.mElemList["btn_action_1"].selected = true;

			this.initCombox(this.mElemList["combox_skill"])
			this.initSelectIdDrop();
		}

		initCombox( cb:gui.ComboBox ){
			//设置标题
			cb.setTitleHeight(20)
			cb.setTitleBackground("titleBackground");
			cb.setTitleFontSize(20)

			cb.setItemWidth(cb.width);
			cb.setItemHeight(25)
			cb.setItemFontSize(18)
			cb.setTitle("");
		}


		initSelectIdDrop(){
			var data = [];
			var sort_keys = Object.keys(GameConfig.FightActionConfig).sort((a, b)=>{
				return tonumber(a) - tonumber(b);
			})


			sort_keys.forEach(key=>{
				var v = GameConfig.FightActionConfig[key];
				data.push({bg:"itemBg4",content:v.index+"_"+v.name} );
			})


			var cb:gui.ComboBox = this.mElemList["combox_skill"];
			cb.data = data;
		}

		public onUnLoad():void{

		}

		public onShow():void{
			this.mLayoutNode.visible = true;

			this.refreshBySkillIndex(-1);
		}

		public onHide():void{
			this.mLayoutNode.visible = false;
		}


		initAction(new_action){
			new_action.action = ""
			new_action.name = ""
			new_action.during = 0
			new_action.startTime = -1
			new_action.startEvent = null //{"action1", "attack"}
			new_action.finishEvent = null //{"action1", "attack"}
			
			for(var i = 1 ; i <= ACTION_PARAM_COUNT; i++){
				new_action["param"+i] = null
			}
		}



		initSkillShow(skillShow, index?, name?, maxTime?){
			skillShow.index = index
			skillShow.name = name
			skillShow.maxTime = maxTime
			skillShow.action_1 = []
			skillShow.action_2 = []
			skillShow.action_3 = []
		}


		refreshBySkillIndex(index:number){

			if(index < 0){
				this.skillShow = {}
				this.initSkillShow(this.skillShow)
			}else{
				var skillShowConfig = GameConfig.FightActionConfig[index]
				if(skillShowConfig == null){
					MsgSystem.addTagTips(String.format("技能 :%s 不存在！", tostring(index)))
					return
				}
				//拷贝一份出来
				this.skillShow = JsUtil.objectCopy(skillShowConfig)
			}

			this.mElemList["edit_skillname"].text = this.skillShow.name || ""
			this.mElemList["edit_skillid"].text =  checkNull(this.skillShow.index, "") + "";
			this.mElemList["edit_time"].text = this.skillShow.maxTime || ""
			
			this.curActionList = this.skillShow.action_1 //当前actionList
			this.curAction = null //当前选中Action
			this.refresh(false)
		}


		getSaveButton():gui.Button{
			for(var i = 0; i < this.saveButtonList.length;i++){
				var v = this.saveButtonList[i]
				if(v.visible == false){
					//clear Event
					v.labelColor = gui.Color.white;
					v.visible = true;
					return v;
				}
			}

			var mElemList = {}
			var elemInfo = [
				{["index_type"] : gui.Button, ["name"] : "button", ["title"] : "", ["image"]:"countbutton_default", ["font"] : "ht_20_cc", ["color"] : gui.Color.white,  ["x"] : 0, ["y"] : 0,	["w"] : 0,  ["h"] : 0, ["event_name"] : null, ["fun_index"] : null},
			]
			UiUtil.createElem(elemInfo, this.mLayoutNode, mElemList, this)
			
			var newBtn  = mElemList["button"];
			this.saveButtonList.push(newBtn);
			return newBtn;
		}


		getSaveLabel():eui.Label{
			for(var i = 0; i < this.saveLabelList.length;i++){
				var v = this.saveLabelList[i]
				if(v.visible == false){
					v.visible = true;
					return v;
				}
			}

			var mElemList = {}
			var elemInfo = [
				{["index_type"] : eui.Label, ["name"] : "label", ["title"] : "", ["image"]:"", ["font"] : "ht_20_cc", ["color"] : gui.Color.white,  ["x"] : 0, ["y"] : 0,	["w"] : 0,  ["h"] : 0, ["event_name"] : null, ["fun_index"] : null}
			]
			UiUtil.createElem(elemInfo, this.mLayoutNode, mElemList, this)
			
			var newLabel  = mElemList["label"]
			this.saveLabelList.push(newLabel);
			return newLabel
		}

		refresh(reorder?){
			if(reorder == null)
				reorder = true;

			for(var i = 0; i < this.saveButtonList.length;i++){
				var btn = this.saveButtonList[i]
				btn.visible = false;
			}

			for(var i = 0; i < this.saveLabelList.length;i++){
				var label = this.saveLabelList[i]
				label.visible = false;
			}

			this.action2BtnMap = {}


			if(reorder){
				SortFightActionList(this.curActionList)
			}


			var timeStamp = -999
			var startY = 0
			var itemH = 30
			
			//如果没有所选，则取第一个
			if(this.curAction == null){
				this.curAction = this.curActionList[0]
			}

			var scrollView:eui.Group = this.mElemList["group_scroller"]

			for(var i = 0; i < this.curActionList.length;i++){
				var action = this.curActionList[i]

				if(action.startTime != timeStamp ){
					timeStamp = action.startTime
					var label = this.getSaveLabel()
					label.text = timeStamp + "ms"
					label.x = 0
					label.y = i* itemH;
					label.width = 80
					label.height = itemH;
					scrollView.addChild(label)
				}


				var actionTitle = GetActionTitleByType(action.action)
				if(!StringUtil.isEmpty(action.name)){
					actionTitle = action.name + actionTitle
				}
				
				var button = this.getSaveButton()
				button.name = "action_"+i
				button.label = actionTitle;
				button.x = 75
				button.y = i* itemH;
				button.width = 130
				button.height = itemH;
				
				button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickAction, this)
				scrollView.addChild(button)
				
				if(this.curAction == action){
					button.labelColor =gui.Color.red
				}


				
				
				this.action2BtnMap[action] = button
			}


			// var w, h = scrollView:GetWidth(), scrollView:GetHeight()	
			// scrollView:SetViewWH(w, itemH * #this.curActionList)
			
			// if this.curAction then
			// 	var button = this.action2BtnMap[this.curAction]
			// 	scrollView:ScrollToXY(0, button:GetY(), true)
			// end
			
			
			if(this.curAction){
				this.mFightEditor.actionEditor.showWnd();
				this.mFightEditor.actionEditor.doCommand("refreshWithData", this.curAction);//当前action

			}else{
				this.mFightEditor.actionEditor.hideWnd();
			}

			
		}


		createSkillShow(index){
			var maxTime = tonumber(this.mElemList["edit_time"].text) || MaxShowTime;
			var name = this.mElemList["edit_skillname"].text

			
			var skillShow:any = {}	
			this.initSkillShow(skillShow, index, name, maxTime)
			skillShow.name = name
			
			var bExsitPropertyAction = false

			for(var i = 0; i < this.skillShow.action_1.length; i++){
				var v = this.skillShow.action_1[i];
				if(! StringUtil.isEmpty(v.action ) ){
					skillShow.action_1.push(v)
				}
				
				if(v.action == "POWER"){
						bExsitPropertyAction = true
				}
			}

			for(var i = 0; i < this.skillShow.action_2.length; i++){
				var v = this.skillShow.action_2[i];
				if(! StringUtil.isEmpty(v.action ) ){
					skillShow.action_2.push(v)
				}
				
				if(v.action == "POWER"){
						bExsitPropertyAction = true
				}
			}

			for(var i = 0; i < this.skillShow.action_3.length; i++){
				var v = this.skillShow.action_3[i];
				if(! StringUtil.isEmpty(v.action ) ){
					skillShow.action_3.push(v)
				}
				
				if(v.action == "POWER"){
						bExsitPropertyAction = true
				}
			}
			
			if(skillShow.action_1.length == 0 &&
				skillShow.action_2.length == 0 &&
				skillShow.action_3.length == 0){
				MsgSystem.addTagTips("技能表现没有动作!")
				return null
			}
			
			if(bExsitPropertyAction == false){
				MsgSystem.addTagTips("技能没有#yellow响应属性!")
				return null
			}
	
			return skillShow
		}


		////////////////////////////////////////



		onSelectIdDrop(event:egret.Event){
			var cb:gui.ComboBox = this.mElemList["combox_skill"];
			var data = cb.data;
			//cb.setTitle(data[event.data.itemIndex].content ) ;
			//cb.hide();
			var value = data[event.data.itemIndex].content


			var index = StringUtil.stringMatch(value, /(\d+)_.+/)[0];

			this.refreshBySkillIndex(tonumber(index)|| 0);

			
			
		}
		

		onClickLoad(event:egret.TouchEvent){
			var str = this.mElemList["edit_skillid"].text
			if(str == ""){
				this.refreshBySkillIndex(-1)
				return
			}

			var index = tonumber(str )
			if(index == null){
				MsgSystem.addTagTips("请输入技能ID")
				return
			}
			this.refreshBySkillIndex(index)
		}
		

		onClickPlay(event:egret.TouchEvent){
			var skillShow = this.createSkillShow(0)
			if(skillShow == null){
				return
			}
			
			if (this.skillShow && this.skillShow.index != null) {
				skillShow.index = this.skillShow.index
			}
			this.mFightEditor.testSkillShow(skillShow)
		}


		

		onClickSave(event:egret.TouchEvent){
			var index = tonumber(this.mElemList["edit_skillid"].text)
			if(index == null){
				MsgSystem.addTagTips("请输入技能ID")
				return 
			}
			
			var skillShow = this.createSkillShow(index)
			if(skillShow == null){
				return
			}
			//var skillShow = {}
			//skillShow[index] = skillShow
			//skillShow[89999] = skillShow
			GameConfig.FightActionConfig[index] = skillShow

			
			//var jsonStr = JsUtil.JsonEncode(GameConfig.FightActionConfig);
			var jsonStr = tooljson.encode(GameConfig.FightActionConfig);

			//保存操作
			var blob = new Blob([jsonStr], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "fightAction.json", true);



			MsgSystem.confirmDialog_YES("保存成功!")
			this.initSelectIdDrop()
			//检查冗余
			this.checkSkillList()
		}

		isSkillClientNotExsit(skillId){
			//return ServerSkillInfo[skillId] and not FightActionConfig[skillId]
		}

		checkSkillList(){
			// local list = {}
			// for _, v in pairs(ServerMonster) do
			// 	for i, skillId in pairs(v.SkillList) do
			// 		if self:isSkillClientNotExsit(skillId) then
			// 			table.insert(list, {v.Id, skillId})
			// 		end
			// 	end
				
			// 	if self:isSkillClientNotExsit(skillId) then
			// 		table.insert(list, {v.Id, v.OrdinarySkillId})
			// 	end
			// end
			
			// for _, v in pairs(PetConfig) do
			// 	for i, skillId in pairs(v.SkillList) do
			// 		if self:isSkillClientNotExsit(skillId) then
			// 			table.insert(list, {v.Id, skillId})
			// 		end
			// 	end
			// end
			
			// for _, v in pairs(list) do
			// 	Log.Warning(string.format(Localize_cns("FIGHT_NOT_EXSIT_SKILL_EDIT"), v[2], v[1]))
			// end
		}

		onCheckActionList(event:egret.TouchEvent){
			var windowName = event.target.name;
	
			if(windowName == "btn_action_1"){
				this.curActionList = this.skillShow.action_1
			}else if(windowName == "btn_action_2"){
				this.curActionList = this.skillShow.action_2
			}else if(windowName == "btn_action_3"){
				this.curActionList = this.skillShow.action_3
			}
			
			this.curAction = null
			this.refresh(false)
		}



		onClickAction(event:egret.TouchEvent){
			var name = event.target.name;
			

			var index = tonumber(StringUtil.stringMatch(name, /action_(\d+)/)[0])
			
			
			var curAction = this.curActionList[index]
			TLog.Assert(curAction)
			
			if(this.curAction){
				this.action2BtnMap[this.curAction].labelColor = gui.Color.white
			}
			
			this.curAction = curAction
			this.refresh(false)
		}



		onAddAction(event:egret.TouchEvent){
			var new_action = {}
			this.initAction(new_action)
			this.curActionList.push(new_action);
			
			this.curAction = new_action
			this.refresh()

		}

		onRemoveAction(event:egret.TouchEvent){
			if(this.curAction == null){
				//Log.Error("onRemoveAction this.curAction == null")
				return
			}
			
			//删除了当前所选，会以上一个action做新的当前所选
			var lastAction = null
			this.curActionList.forEach((v, i)=>{
				if(v == this.curAction){
					this.curActionList.splice(i, 1);
					return true;
				}
				lastAction = v
			})

			if(lastAction == null){
				lastAction = this.curActionList[0]
			}
			this.curAction = lastAction
			
			this.refresh()
		}
		
	}
}