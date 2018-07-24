class ActorControl_LineMoveTime extends ActorControlBase{

	m_from_x:number;
	m_from_y:number;
	m_to_x:number;
	m_to_y:number;

	m_x_speed:number;
	m_y_speed:number;
	m_cur_x:number;
	m_cur_y:number;

	public initObj(...args:any[]):void{
		var time_ = args[0]
		this.m_from_x = args[1]
		this.m_from_y = args[2]
		this.m_to_x = args[3]
		this.m_to_y = args[4]
		
		this.m_x_speed = (this.m_to_x - this.m_from_x) / time_
		this.m_y_speed = (this.m_to_y - this.m_from_y) / time_
		this.m_cur_x = this.m_from_x
		this.m_cur_y = this.m_from_y
		
		this.setMaxTime(time_)
	}

	destory(){

	}


	onBegin(actor:Actor){
		if(actor.isMoveAutoRotate()){
			var rotateAngle = MathUtil.pGetAngle(newPos(this.m_x_speed, 0), newPos(this.m_x_speed, this.m_y_speed))
			actor.rotateAngle(rotateAngle)
		}
	}

	onUpdate(actor:Actor, delay:number){
		this.m_cur_x = this.m_from_x + this.m_x_speed * this.delayTime
		this.m_cur_y = this.m_from_y + this.m_y_speed * this.delayTime 
		
		actor.setMapXY(this.m_cur_x, this.m_cur_y)
		return false
	}

	onFinish(actor:Actor){
		this.m_cur_x = this.m_to_x
		this.m_cur_y = this.m_to_y
		actor.setMapXY(this.m_cur_x, this.m_cur_y)
	}
}