class ActorControl_TraceMove extends ActorControlBase{

	speed:number;
	traceActorId:number;

	traceActorFunc:Function;

	toOffx:number;
	toOffy:number;

	lastDirX:number;
	lastDirY:number;


	 //子类复写 初始化函数
    public initObj(...args:any[]):void{
        this.speed = args[0]
	
		TLog.Assert(this.speed > 0)
		
		this.traceActorId = args[1]//获取actor的id
		this.traceActorFunc = args[2]//获取actor的函数
		
		this.toOffx = args[3] || 0
		this.toOffy = args[4] || 0
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	onBegin(actor:Actor){
		var traceTarget = this.traceActorFunc(this.traceActorId)
		if(traceTarget){
			var fromPoint = actor.getMapXY()
			var toPoint = traceTarget.getMapXY()
			var to_x = toPoint.x + this.toOffx
			var to_y = toPoint.y + this.toOffy
			
			this.lastDirX = to_x - fromPoint.x
			this.lastDirY = 0
		}
	}

	onUpdate(actor:Actor, delay:number){
		var traceTarget = this.traceActorFunc(this.traceActorId)
		if(traceTarget == null){
			return true
		}
		
		var fp = actor.getMapXY()
		var tp = traceTarget.getMapXY()
		var to_x = tp.x + this.toOffx
		var to_y = tp.y + this.toOffy
		
		if(MathUtil.checkScope(fp.x, fp.y, to_x, to_y, 10)){
			return true
		}
		
		var vec = newPos(to_x - fp.x , to_y - fp.y)
		var norVec = MathUtil.pNormalize(vec)
		
		var x_speed = norVec.x * this.speed/1000 //毫秒
		var y_speed = norVec.y * this.speed/1000 //毫秒
		
		var cur_x = fp.x + x_speed* delay 
		var cur_y = fp.y + y_speed* delay
		
		if(actor.isMoveAutoRotate()){
			var rotateAngle = MathUtil.pGetAngle(newPos(this.lastDirX, this.lastDirY), newPos(x_speed, y_speed))
			actor.rotateAngle(rotateAngle)
		}
		
		this.lastDirX = x_speed
		this.lastDirY = y_speed
		
		actor.setMapXY(cur_x, cur_y)
		return false
	}

	onFinish(actor:Actor){
		var traceTarget = this.traceActorFunc(this.traceActorId)
		if(traceTarget){
			var cp = traceTarget.getMapXY()
			var cur_x = cp.x + this.toOffx
			var cur_y = cp.y + this.toOffy
			
			actor.setMapXY(cur_x, cur_y)
		}
	}
}