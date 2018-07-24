class Fight_DirAction extends Fight_BaseAction{

	targetName:string;
	dirType:string;
	refer:string;
	dirIndex:number

	targetNameList:string[];

	public initObj(...args:any[]):void{
		this.targetName = checkNull(this.elemInfo.param1 , "caster")
		this.dirType = checkNull(this.elemInfo.param2 , "relate")
		
		this.refer	 = checkNull(this.elemInfo.param3 , "caster")
		this.dirIndex = checkNull(this.elemInfo.param4 , null)
		
		this.targetNameList = splitString(this.targetName, ",")
	}


	onFinish(){
		function callback(actor, index){
			if(this.dirType == "relate"){
				var fighter = this.fightResult.getActionObjectByName(this.refer)[0]
				
				if(fighter){
					if(this.dirIndex == 0){	//与参照人物相同
						actor.setDir(fighter.getDir())
					}else if(this.dirIndex == 4){		//与参照人物相反
						actor.setDir((fighter.getDir() + 4) % 8)
					}else{
						var emp = fighter.getMapXY()
						var myp		 = actor.getMapXY()
						if(emp.x < myp.x){			//面向参照人物
							actor.setDir(ActorDirMap.Left)
						}else{
							actor.setDir(ActorDirMap.Right)
						}
					}
				}
			}else{
				actor.setDir(this.dirIndex)
			}
		}
		this.iteratorActorList(callback, this.targetNameList)
	}
}