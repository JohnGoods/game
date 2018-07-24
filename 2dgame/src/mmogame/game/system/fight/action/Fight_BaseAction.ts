class Fight_BaseAction extends Fight_BaseElem{

	fightResult:FightResult;
	elemConfig:any;
	elemInfo:any;
	elemName:any;
	elemStartCondition:any[];
	elemFinishCondition:any[];

	bAutoSendAttack:boolean;
	bAttackFrame:boolean;

	casterActor:FightActor;

	bLastFrameDelay:boolean;
	bLastFrameLoop:boolean;

	actionConfig:any;


	//子类复写 初始化函数
    public initObj(...args:any[]):void{
		//因为action由result托管，可以在构造函数中获取实例
		this.fightResult = 	args[0]
		var elemConfig = args[1]
		this.actionConfig = elemConfig
		
		this.elemInfo = 		elemConfig.content
		this.elemName = 		elemConfig.name
		this.elemStartCondition=	elemConfig.startCondition
		this.elemFinishCondition=	elemConfig.finishCondition
		
		this.bAutoSendAttack = false
		//var targetName = 		elemConfig.content.param1
		//this.targetList = this.fightResult.getActorIdListFromResult(targetName)
		
		this.casterActor = this.fightResult.getActionObjectByName("caster")[0]
		
		this.setTimeStamp(elemConfig.startTime, elemConfig.during || MaxActionTime)//设置时间轴
		
		this.bLastFrameDelay = false//末帧静止
		this.bLastFrameLoop = false//末帧循环

		this.bAttackFrame = false;
        
    }
    //子类复写 析构函数
    protected destory():void{
        
    }


	getCasterActor(){
		//调用这函数的，要保证actor存在
		TLog.Assert(this.casterActor != null)
		return this.casterActor
	}

	getTargetActor(){
		var targetId = this.fightResult.result.target
		return GetFightActor(targetId)	
	}


	play(){
		var ret =super.play()
		if(ret){
			this.bAttackFrame = false
			this.sendEvent("begin")
			
			if(this.casterActor == null){
				this.finish()
				return ret
			}
		}
		return ret
	}


	finish(){
		var ret = super.finish()
		if(ret){
			
			if(this.bAutoSendAttack){
				if(! this.bAttackFrame){
					this.sendEvent("attack")
					this.bAttackFrame = true
				}
			}
			
			this.sendEvent("finish")
		}
		
		return ret
	}


	reset(){
		super.reset()
		if(this.elemStartCondition){
			JsUtil.objectForEach(this.elemStartCondition, v=>{
				v.finish = false
			});
		}
		
		if(this.elemFinishCondition){
			JsUtil.objectForEach(this.elemFinishCondition, v=>{
				v.finish = false
			})
		}
	}


	sendEvent(event_name){
		if(StringUtil.isEmpty(this.elemName) == false){
			this.sendEventBase(this.elemName, event_name)
		}
	}


	recElemResult(event){
		if(! this.bBegin && this.checkBegin(event)){
			this.play()
		}
		
		if(! this.bFinish && this.checkFinish(event)){
			this.finish()
		}
	}



	checkBegin(event){
		if(this.elemStartCondition.length == 0){
			return false
		}

		this.elemStartCondition.forEach(v=>{
			if(v.elem_name == null || v.elem_name == event.elem_name){
				if(v.event_name == null || v.event_name == event.event_name){
					v.finish = true
				}
			}
		})
		

		for(var i = 0; i < this.elemStartCondition.length; i++){
			var v = this.elemStartCondition[i];
			if(v.finish == null || v.finish == false){ //遍历条件表检查是否已经满足所有条件
					return false
			}
		}

		return true
	}



	checkFinish(event){

		if(this.elemFinishCondition.length == 0){
			return false
		}

		this.elemFinishCondition.forEach(v=>{
			if(v.elem_name == null || v.elem_name == event.elem_name){
				if(v.event_name == null || v.event_name == event.event_name){
					v.finish = true
				}
			}
		})
		

		for(var i = 0; i < this.elemFinishCondition.length; i++){
			var v = this.elemFinishCondition[i];
			if(v.finish == null || v.finish == false){ //遍历条件表检查是否已经满足所有条件
					return false
			}
		}

		return true
	}


	getActionObjectList(targetNameList:string[]):any[]{
		var objList = []
		
		for(var i =0; i < targetNameList.length; i++){
			var name = targetNameList[i]
			var l = this.fightResult.getActionObjectByName(name)
			objList = objList.concat(l)
		}
		return objList.concat();
	}


	iteratorActorList(callback, targetNameList:string[]){
		var objectList = this.getActionObjectList(targetNameList)
		if(objectList.length == 0){
			return false
		}
		
		for(var i = 0; i < objectList.length; i++){
			var object = objectList[i]
			callback.call(this, object, i)
		}
		
		return true
	}

	setAutoSendAttack(b){
		this.bAutoSendAttack = b
	}


	handleAnimNotify(notify, actor:FightActor){
		if(notify == "end"){
			if(! this.bLastFrameDelay && ! this.bLastFrameLoop){
				this.finish()
				return
			}
		}
		
		if(notify == "attack"){
			this.bAttackFrame = true
			this.sendEvent("attack")
		}
		
		this.sendEvent(notify)
	}

	//根据施法者面向，获得相对位置	
	getOffsetByCaster(offsetx, offsety, dir?):{x:any, y:any}{
		//编辑器以左边为准，右边的话要翻转，dir为0或1，0表示y值不用随站位取相反数
		if(this.casterActor == null || this.casterActor.getSide() == fightSide.FIGHT_RIGHT){
			return newPos(offsetx, offsety)
		}else{
			dir = dir || 0
			if (dir) {
				return newPos(-offsetx, -offsety)
			}
			return newPos(-offsetx, offsety)
		}
	}


	getRotateByCaster(angle):number{
		//编辑器以左边为准，右边的话要翻转
		if(this.casterActor == null||  this.casterActor.getSide() == fightSide.FIGHT_RIGHT){
			return angle
		}else{
			return -angle
		}
	}


	getAbsoluteXYByCaster(x,y):{x:any, y:any}{

		var viewSize = SceneManager.getInstance().getCameraViewSize();

		var centerX = FIGHT_CENTER_X
		var centerY = FIGHT_CENTER_Y
		//编辑器以左边为准，右边的话要翻转
		if(this.casterActor == null || this.casterActor.getSide() == fightSide.FIGHT_RIGHT){
			return newPos(x, y)
		}else{
			var point = MathUtil.fliplr(FIGHT_MAP_ANGLE, centerX, centerY, x, y)
			return point
		}
	}

}