module tool {
	export class FightActionFrame extends BaseWnd{
		mFightEditor:FightEditor;


		curAction:any;
		curTabActionName:string;


		lableList:any;
		editList:any;
		dropList:any;
		buttonList:any;

		actionWindowStartY:number;


		public initObj(...params:any[]){
			this.mFightEditor = params[0];
			this.mLayoutPaths = ["resource/layouts/tool/FightActionLayout.exml"]


			this.curAction = null;

			this.lableList = {};
			this.editList = {};
			this.dropList = {};
			this.buttonList = {};
		}

		public onLoad():void{
			this.mLayoutNode.skinName = this.mLayoutPaths[0];
			this.mLayoutNode.right = 0
			this.mLayoutNode.bottom = 0;
			this.mLayoutNode.setCanDrag(true)

			var elemInfo =[
				{["name"] : "list_actionList",  ["title"] : null,  ["event_name"] : eui.ItemTapEvent.ITEM_TAP, ["fun_index"] : this.onListBoxClick},
				{["name"] : "group_scroller",  ["title"] : null,  ["event_name"] : eui.ItemTapEvent.ITEM_TAP, ["fun_index"] : null},
				
				{["name"] : "btn_play",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onClickPlay},
				{["name"] : "btn_ok",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onClickOk},

				//通用属性
				{["name"] : "edit_startTime",  ["title"] : null,  ["color"] : gui.Color.black, ["prompt"]:"开始时间",["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				{["name"] : "edit_during",  ["title"] : null,  ["color"] : gui.Color.black, ["prompt"]:MaxActionTime+" ms",["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				{["name"] : "edit_name",  ["title"] : null,  ["color"] : gui.Color.black, ["prompt"]:"事件名",["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				//开始事件
				{["name"] : "edit_startevent_action",  ["title"] : null,  ["color"] : gui.Color.black, ["prompt"]:"动作名",["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				{["name"] : "edit_startevent_event",  ["title"] : null,  ["color"] : gui.Color.black, ["prompt"]:"事件名",["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				//结束事件
				{["name"] : "edit_finishevent_action",  ["title"] : null,["color"] : gui.Color.black,  ["prompt"]:"动作名", ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},
				{["name"] : "edit_finishevent_event",  ["title"] : null, ["color"] : gui.Color.black, ["prompt"]:"事件名", ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null},

				
			];
			UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

			this.initListBox();

			this.actionWindowStartY = 215
		}
		

		public onUnLoad():void{

		}

		public onShow():void{
			this.mLayoutNode.visible = true;
		}

		public onHide():void{
			this.mLayoutNode.visible = false;

			this.curAction = null
		}

		initListBox(){
			var list:eui.List = this.mElemList["list_actionList"];
			var data = []
			FIGHT_ACTION_TYPE.forEach(v=>{
				data.push(v[0]);
			})
			UiUtil.updateList(list, data);
		}

		//----------------------------------------------------------------------

		refreshWithData(actionData){
			if(this.curAction == actionData){
				return
			}
			//this.effectViewer:hide()

			this.curAction = actionData
			this.curTabActionName = null
			
			if(actionData){
				this.curTabActionName = actionData.action
			}

			this.refresh()
		}

		resetElem(){

			JsUtil.objectForEach(this.lableList, v=>{
				v.visible = false;
			})

			JsUtil.objectForEach(this.editList, v=>{
				v.visible = false;
			})

			JsUtil.objectForEach(this.dropList, v=>{
				v.visible = false;
			})

			JsUtil.objectForEach(this.buttonList, v=>{
				v.visible = false;
			})

		}


		resetCommonProperty(){
			this.mElemList["edit_startTime"].text = "";
			this.mElemList["edit_during"].text = "";
			this.mElemList["edit_name"].text = "";
			this.mElemList["edit_startevent_action"].text = "";
			this.mElemList["edit_startevent_event"].text = "";
			this.mElemList["edit_finishevent_action"].text = "";
			this.mElemList["edit_finishevent_event"].text = "";
		}



		showLableElem(index, name){
			var elem = this.lableList[index]
			if(! elem){
				var elemInfo = 
				[
					{["index_type"] :eui.Label, ["name"] : index, ["title"] : name, ["font"] : "ht_20_lc", ["color"] : gui.Color.white, ["x"] : 0, ["y"] : this.actionWindowStartY + 40*index,["w"] : 90, ["h"] : 30,["event_name"] : null, ["fun_index"] : null,},
				]
				UiUtil.createElem(elemInfo, this.mLayoutNode, this.lableList, this, this.mElemList["group_scroller"])
				elem = this.lableList[index]
			}

			elem.text = name+"";
			elem.visible = true;
		}

		showButtonElem(index, data){
			var elem = this.buttonList[index]
			if(! elem){
				var elemInfo = 
				[
					{["index_type"] : gui.Grid9Image, ["name"] : "bg_"+index, ["title"] : null, ["image"]: "titleBackground",["font"] : "ht_20_cc", ["color"] : gui.Color.black, ["x"] : 85, ["y"] : this.actionWindowStartY+40*index,["w"] : 100, ["h"] : 30,["event_name"] : null, ["fun_index"] : null,},
					{["index_type"] : eui.EditableText, ["name"] : "show_"+index, ["title"] : "", ["prompt"]:"特效输入", ["font"] : "ht_20_cc", ["scale_image"] : "frame_bg", ["color"] : gui.Color.black, ["x"] : 85, ["y"] : this.actionWindowStartY+40*index,["w"] : 100, ["h"] : 30,["event_name"] : null,["fun_index"] : null,},
					{["index_type"] : gui.Button, ["name"] : index, ["title"] : "选择", ["font"] : "ht_20_cc", ["color"] : gui.Color.black,["image"] : "countbutton_default", ["x"] : 145, ["y"] : this.actionWindowStartY+40*index,["w"] : 60, ["h"] : 30,["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onElemButtonClick,},
				]
				UiUtil.createElem(elemInfo, this.mLayoutNode, this.buttonList, this, this.mElemList["group_scroller"])
				elem = this.buttonList[index]
			}
			this.buttonList["bg_"+index].visible = true;
			this.buttonList["show_"+index].visible = true;
			this.buttonList["show_"+index].text = checkNull(data , "")+"";
			elem.visible = true;
		}


		showEditElem(index, data){
			var elem = this.editList[index]
			if(! elem){
				var elemInfo = 
				[
					{["index_type"] : gui.Grid9Image, ["name"] : "bg_"+index, ["title"] : null, ["image"]: "titleBackground",["font"] : "ht_20_cc", ["color"] : gui.Color.black, ["x"] : 85, ["y"] : this.actionWindowStartY+40*index,["w"] : 100, ["h"] : 20,["event_name"] : null, ["fun_index"] : null,},
					{["index_type"] : eui.EditableText, ["name"] : index, ["title"] : null, ["prompt"]:"请输入", ["font"] : "ht_20_lc", ["color"] : gui.Color.black, ["x"] : 85, ["y"] : this.actionWindowStartY+40*index,["w"] : 100, ["h"] : 30,["event_name"] : null, ["fun_index"] : null,},
				]
				UiUtil.createElem(elemInfo, this.mLayoutNode, this.editList, this, this.mElemList["group_scroller"])
				//ui_util.CreateCrossScaleImagePtr(this.editList["bg_"+index], "frame_bg", true)
				//this.editList["bg_"+index].SetMoveFrontPass(true)
				elem = this.editList[index]
			}
			this.editList["bg_"+index].visible = true
			elem.visible = true
			this.editList[index].text = checkNull(data , "") + "";
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

		showDropElem = function(index, elems, title){
			var elem:gui.ComboBox = this.dropList[index]
			if(! elem){
				var elemInfo = 
				[
					{["index_type"] : gui.ComboBox, ["name"] : index, ["title"] : "",  ["color"] : gui.Color.black, ["x"] : 85, ["y"] : this.actionWindowStartY+40*index,["w"] : 110, ["h"] : 30,["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onElemDropClick,},
					{["index_type"] : eui.EditableText, ["name"] : "show_"+index, ["title"] : null, ["prompt"]:"右击下拉", ["font"] : "ht_20_cc", ["color"] : gui.Color.black, ["x"] : 85, ["y"] : this.actionWindowStartY+40*index ,["w"] : 80, ["h"] : 30,["event_name"] : null, ["fun_index"] : null,},
				]
				UiUtil.createElem(elemInfo, this.mLayoutNode, this.dropList, this, this.mElemList["group_scroller"])
				elem = this.dropList[index]
			}
			
			this.initCombox(elem);
			elem.visible = true;
			//elem.setTitle(title || "");

			this.dropList["show_"+index].visible = true;


			this.dropList["show_"+index].text = checkNull(title, "") + "";
			

			var data = [];
			JsUtil.objectForEach(elems, v=>{
				data.push({bg:"itemBg4",content:v[0]} );
			})
			elem.data = data;
		}



		refresh(byClick?){
			
			this.resetElem()
			this.resetCommonProperty()

			var list:eui.List = this.mElemList["list_actionList"];
			
			if(this.curTabActionName == null || this.curTabActionName == ""){
				
				list.selectedIndex = -1
				return
			}

			//设置通用属性
			if(this.curAction && this.curTabActionName == this.curAction.action){
				this.mElemList["edit_name"].text = (this.curAction.name)
				this.mElemList["edit_during"].text = (this.curAction.during  || MaxActionTime)
				this.mElemList["edit_startTime"].text = (this.curAction.startTime +"")
				
				if(this.curAction.startEvent){
					this.mElemList["edit_startevent_action"].text = (this.curAction.startEvent[0])
					this.mElemList["edit_startevent_event"].text = (this.curAction.startEvent[1])
				}
				
				if(this.curAction.finishEvent){
					this.mElemList["edit_finishevent_action"].text = (this.curAction.finishEvent[0])
					this.mElemList["edit_finishevent_event"].text = (this.curAction.finishEvent[1])
				}
			}

			var index = -1;
			for(var k = 0; k < FIGHT_ACTION_TYPE.length; k++){
				var v = FIGHT_ACTION_TYPE[k];
				if(v[1] == this.curTabActionName){
					index = k;
					break;
				}
			}


			var actionTypeInfo = FIGHT_ACTION_TYPE[index]
			var elemName = actionTypeInfo[0]
			
			var actionElems:any[] = FIGHT_ACTION_ELEM[this.curTabActionName] || []
			var dropElems = FIGHT_ACTION_DROPMENU[this.curTabActionName]
			var buttonElems = FIGHT_ACTION_BUTTON[this.curTabActionName]


			for(var i = 0; i < actionElems.length; i++){
				let v = actionElems[i];
				
				var data = null;
				if(this.curAction && this.curTabActionName == this.curAction.action){
					data = this.curAction["param"+(i+1)]
				}
				data = tonumber(data) || data
				
				//显示前缀
				this.showLableElem(i, v)
				
				//显示下拉框，或者编辑框
				if(dropElems && dropElems[i]){

					for(let k = 0;k < dropElems[i].length; k++){
						let v = dropElems[i][k]
						if(v[1] == data){
							data = v[0]
							break
						}
					}

					this.showDropElem(i, dropElems[i], data)
					
				}else if(buttonElems && buttonElems[i]){

					for(let k = 0;k < buttonElems[i][0].length; k++){
						let v = buttonElems[i][0][k]
						if(v[1] == data){
							data = v[0]
							break
						}
					}

					this.showButtonElem(i, data)
					
				}else{
					this.showEditElem(i, data)
				}
			}


			//刷新scrollview
			if(! byClick){
				var index = list.dataProvider.getItemIndex(elemName);//显示内容
				list.selectedIndex = index;
			}

		}

	

		getReallyData(list:any[],data){
			for(var i = 0; i < list.length; i++){
				var  v = list[i]
				if(v[0] == data){
					return v[1]
				}
			}
			
			return data
		}

		//根据类型，下标获取控件数据
		getData(index, elemType){
			if(this.editList[index] && this.editList[index].visible){
				return this.editList[index].text
				
			}else if(this.dropList[index] && this.dropList[index].visible){
				//获取dropMenu数据
				var set = FIGHT_ACTION_DROPMENU[elemType]
				if(! set || ! set[index]){
					return ""
				}
				
				let data = this.dropList["show_"+index].text;
				return this.getReallyData(set[index], data)
			
			}else if(this.buttonList["show_"+index] && this.buttonList["show_"+index].visible ){
				var info = FIGHT_ACTION_BUTTON[elemType]
				if(! info || ! info[index]){
					return ""
				}
				var elemInfo = info[index]
				var set = elemInfo[0]
				var type = elemInfo[1]
				
				let data = this.buttonList["show_"+index].text
				var realData = this.getReallyData(set, data)
				return realData
			}else{
				return ""
			}
		}


		checkActionData(testAction){
			if(testAction == null){
				return false
			}
			
			if(StringUtil.isEmpty(this.curTabActionName)){
				MsgSystem.addTagTips("请选择动作类型")
				return false
			}
			
			var startTime = tonumber(this.mElemList["edit_startTime"].text, -1) ;
			var startActionName = this.mElemList["edit_startevent_action"].text
			var startEventName = this.mElemList["edit_startevent_event"].text

			// if(startTime== null){
			// 	startTime = -1;
			// }
			
			if(startTime < 0 && StringUtil.isEmpty(startActionName) && StringUtil.isEmpty(startEventName)){
				MsgSystem.addTagTips("请输入开始时间或者触发事件")
				return false
			}
			
			var during = tonumber(this.mElemList["edit_during"].text ) || MaxActionTime
			if(during <= 0){
				MsgSystem.addTagTips("时长必须大于0！")
				return false
			}
			
			var finishActionName = this.mElemList["edit_finishevent_action"].text
			var finishEventName = this.mElemList["edit_finishevent_event"].text
			
			testAction.action = this.curTabActionName
			testAction.name =  this.mElemList["edit_name"].text
			testAction.during = during
			testAction.startTime = startTime
			
			testAction.startEvent = null
			if(startActionName != "" && startEventName != ""){
				testAction.startEvent =  [startActionName, startEventName ]
			}
			
			testAction.finishEvent = null
			if(finishActionName != "" && finishEventName != ""){
				testAction.finishEvent = [ finishActionName, finishEventName ]
			}
			
			for(var i = 1; i <= ACTION_PARAM_COUNT;i++){
				testAction["param"+i] = this.getData(i-1, this.curTabActionName) || ""
			}
			
			return true
		}

		//////////////////////////////////////////////////////////////////////////////
		onListBoxClick(e:eui.ItemTapEvent){
			//egret.log(e.item, e.itemRenderer, e.itemIndex)

			var selectedIndex = e.itemIndex;
			
			if(selectedIndex >= 0){
				
				var info = FIGHT_ACTION_TYPE[selectedIndex]
				this.curTabActionName = info[1]
				this.refresh(true)	
			}

		}




		onElemButtonClick(event:egret.TouchEvent){
			var num = event.target.name;
			num = tonumber(num)
			if(null == num){
				return
			}
			
			var buttonTypeInfo = FIGHT_ACTION_BUTTON[this.curTabActionName]
			if(buttonTypeInfo == null || buttonTypeInfo[num] == null){
				return
			}
		
			var type = buttonTypeInfo[num][1]
			var effectName = this.buttonList["show_"+ num].text
			
			//执行特效相应 
			if(type == FIGHT_ACTION_BUTTON_TYPE.EFFECTVIEW){

				if(this.mFightEditor.effectEditor.isVisible() == false){
					this.mFightEditor.effectEditor.showWnd();
					//this.mFightEditor.effectEditor.doCommand("setCallback", this, this.onEffectViewCallback, num);
					this.mFightEditor.effectEditor.setCallback( this, this.onEffectViewCallback, num);
					this.mFightEditor.effectEditor.doCommand("refreshWithEffectName", effectName);
				}else{
					this.mFightEditor.effectEditor.hideWnd();
				}

				// if(this.effectViewer.visible == false){
				// 		this.effectViewer.show()
				// 		this.effectViewer.setCallback(this, this.onEffectViewCallback, num)
				// 		this.effectViewer.refreshWithEffectName(effectName)
				// 	}else{
				// 		this.effectViewer.hide()
				// 	}
			}
		}

		onEffectViewCallback(effectId, index){
			var name = ""
			var effectRef = GameConfig.EffectConfig[effectId]
			if(effectRef){
				name = effectRef.Name
			}
			this.buttonList["show_"+index].text = name + "";
		}


		onClickPlay(){
			var testAction = {}
			if(! this.checkActionData(testAction)){
				return
			}
			
			//测试
			
			var during = tonumber(this.mElemList["edit_during"].text ) || MaxActionTime
			
			var skillShow:any = {}

			this.mFightEditor.triggerEditor.initSkillShow(skillShow, 0, "", during);
			skillShow.action_1.push(testAction) 
			
			this.mFightEditor.testSkillShow(skillShow)
		}

		onClickOk(){
			if(this.checkActionData(this.curAction) == false){
				return
			}
			
			this.mFightEditor.triggerEditor.refresh()
			MsgSystem.addTagTips("更新成功，注意保存！")
		}


		onElemDropClick(event:egret.Event){

			var cb:gui.ComboBox = event.currentTarget;
			//cb.hide();

			var data = cb.data;
			var str = data[event.data.itemIndex].content

			var num = tonumber(cb.name);
			if(null == num){
				return
			}
			this.dropList["show_"+num].text = str + "";
		}
		
	}
}