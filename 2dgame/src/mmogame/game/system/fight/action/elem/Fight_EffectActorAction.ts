class Fight_EffectActorAction extends Fight_BaseAction{
	varName:string;
	targetName:string;

	effectId:number;
	speed:number;
	boneName:string;
	offset_x:number;
	offset_y:number;
	layerType:string;

	spellPre:boolean;

	effectList:Effect[];
	

	 public initObj(...args:any[]):void{
		this.varName = checkNull(this.elemInfo.param1 , "") //定义变量
		this.targetName = checkNull(this.elemInfo.param2 , "targetList")
		this.effectId = this.elemInfo.param3
		this.speed = checkNull(this.elemInfo.param4 , 1)
		this.boneName = this.elemInfo.param5 || "";
		this.offset_x = checkNull(this.elemInfo.param6 , 0)
		this.offset_y = checkNull(this.elemInfo.param7 , 0)
		this.bLastFrameDelay = checkNull(this.elemInfo.param8 , false)
		this.bLastFrameLoop = checkNull(this.elemInfo.param9 , false)
		this.layerType = checkNull(this.elemInfo.param10 , "fg")
		
		var point = this.getOffsetByCaster(this.offset_x, this.offset_y);
		this.offset_x = point.x
		this.offset_y = point.y;
		this.setAutoSendAttack(true)
		
		var autoRepeat = true
		if(this.elemInfo.param11 != null){
			autoRepeat = this.elemInfo.param11
		}
		this.spellPre = this.fightResult.isSpellPrepare() && autoRepeat
		
		if(this.fightResult){
			this.speed	= this.fightResult.getActionSpeed(this.speed)
		}
	 }

	 destory(){
		 //非重复播放则返回，避免重复重复操作
		if(this.spellPre == false || this.effectList == null){
			return
		}
		
		this.spellPre = false
		this.onFinish()
	 }


	 onPlay(){
		 //标识着吟唱result以执行过一次
		if(this.spellPre == true && this.effectList != null){
			return
		}
		
		TLog.Assert(this.effectList == null)
		this.effectList = []
		var bFinish = false 
		
		function callback(actor, index){
			//一次性特效，自动删除，不用保存监听器实例
			var boneParam:any = {}
			boneParam.name = this.boneName
			boneParam.order = 1
			if(this.layerType == "bg"){
				boneParam.order = -1
			}
			
			var effect:Effect = EffectManager.getInstance().createBindEffect(this.effectId, actor, boneParam, ! this.bLastFrameDelay)
			effect.setAutoBindDelete(false)
			effect.setAnimSpeed(this.speed)
			//effect.setDir(actor.getDir())
			effect.setPositionXY(this.offset_x, this.offset_y)

			//不绑定骨骼，设置方向才有效
			if(this.boneName == "")
				effect.setDir(this.casterActor.getDir() ) //人物特效需要根据人物面向设置
			effect.setCaster(this.casterActor)
			
			if(index == 0){
				let listener = {this_index : this, function_index : this.handleAnimNotify}
				effect.addAnimListener(listener);
				bFinish = effect.isLoadError();
			}
			
			if(this.varName != ""){
				this.fightResult.addActionObject(this.varName, effect)//用于其他action使用
			}

			this.effectList.push(effect);
			
		}
		
		if(this.iteratorActorList(callback, [this.targetName]) == false){
			this.finish()
		}else{
			if(bFinish){
				this.finish()
			}
		}
	 }


	 onFinish(){
		if(this.effectList == null ||
			(this.spellPre == true && this.effectList != null)){
			return
		}


		this.effectList.forEach(v=>{
			if(this.varName != ""){
				this.fightResult.removeActionObject(this.varName, v)
			}
			v.clearAnimListener();
			v.deleteObj()
		})
		this.effectList = null;
		
	 }


	 onTick(delay){

		 this.effectList.forEach(v=>{
			 v.update(delay);
		 })

	 }
}