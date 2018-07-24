module tool {
	export class FightEffectFrame extends BaseWnd{
		mFightEditor:FightEditor;

		effectEntry:number;
		effect:Effect;

		callbackObject:any;
		callbackFunc:Function;
		callbackData:any;

		public initObj(...params:any[]){
			this.mFightEditor = params[0];

			this.mLayoutPaths = ["resource/layouts/tool/FightEffectLayout.exml"]
			this.effectEntry = -1
			
		}

		public onLoad():void{
			this.mLayoutNode.skinName = this.mLayoutPaths[0];
			this.mLayoutNode.right = 0
			this.mLayoutNode.bottom = 0;


			var elemInfo =[
				
				
				{["name"] : "btn_cancle",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.hideWnd},
				{["name"] : "btn_ok",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onClickOk},

				
				{["name"] : "combox_selectModel",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onModelDrop},
				{["name"] : "actorview_effect",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : null, ["touchEnabled"]:false},
					
			];
			UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);



			this.initCombox(this.mElemList["combox_selectModel"])
			this.initModelTypeDrop();
		}


		initModelTypeDrop(){
			var data = [];
			var sort_keys = Object.keys(GameConfig.EffectConfig).sort((a, b)=>{
				return tonumber(a) - tonumber(b);
			})


			sort_keys.forEach(key=>{
				var v = GameConfig.EffectConfig[key];

				let modelpath = GameConfig.ModelConfig[v.model].modelpath
				if(modelpath != ""){
					data.push({bg:"itemBg4",content:v.Name} );
				}
			})

			var cb:gui.ComboBox = this.mElemList["combox_selectModel"];
			cb.data = data;
			cb.setTitle("模型选择");
		}

		

		public onUnLoad():void{

		}

		public onShow():void{
			this.mLayoutNode.visible = true;

			if(this.effect == null){
				this.effect = Effect.newObj()
				this.effect.enterViewer(this.mElemList["actorview_effect"])
			}
			//this.effectEntry = 10006
			this.refresh()

			
		}

		public onHide():void{
			this.mLayoutNode.visible = false;
			this.mLayoutNode.setCanDrag(true)

			if(this.effect){
				this.effect.leaveViewer(this.mElemList["actorview_effect"])
				this.effect.deleteObj()
				this.effect = null
			}
			
			this.callbackObject= null
			this.callbackFunc  = null
			this.callbackData  = null	
			this.effectEntry = -1
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
		//---------------------------------------------------------------

		getEffectIdByName(name){
			for(var k in GameConfig.EffectConfig){
					var v = GameConfig.EffectConfig[k];
					if(v.Name == name){
						return v.Id
					}
				}
				return -1;
			}

		refreshWithEffectName(name){
			this.effectEntry = this.getEffectIdByName(name)
			this.refresh()
		}


	refresh(){

		

		var cb:gui.ComboBox = this.mElemList["combox_selectModel"];
		if(this.effectEntry < 0){
			cb.setTitle("模型选择")
			this.mElemList["actorview_effect"].visible = false;
			return
		}
		
		var effectRef = GameConfig.EffectConfig[this.effectEntry]
		if(effectRef == null){
			TLog.Error("FightEffectView %s not exsit", this.effectEntry)
			return
		}
		
		cb.setTitle(effectRef.Name)
		this.effect.loadModel(effectRef.model)
		this.effect.changeAction(null);
		//this.effect.changeActionWithIndex(0, 1.0, true)
		this.mElemList["actorview_effect"].visible = (true)
	}




	//---------------------------------------------------------------
	onModelDrop(event:egret.Event){
		var str = event.data.content
		this.refreshWithEffectName(str)
	}


	onClickOk(){
		if(this.callbackFunc){
			this.callbackFunc.call(this.callbackObject, this.effectEntry, this.callbackData)
		}
		this.hideWnd()
	}

	setCallback(object, func, userdata){
		this.callbackObject =object
		this.callbackFunc = func
		this.callbackData = userdata
	}
	}
}