class Npc extends Character{
	entryId:number;
	//子类复写 初始化函数
    public initObj(...params:any[]):void{
		 this.setMovementNotifyEnable(true)
		this.actorType = actor_Type.ACTOR_TYPE_NPC;

		this.entryId = 0
       	RegisterEvent(EventDefine.HERO_MOVE, this.refreshVisible, this)
		RegisterEvent(EventDefine.HERO_MOVE_STOP, this.refreshVisible, this)
    }
    //子类复写 析构函数
    protected destory(): void{
       UnRegisterEvent(EventDefine.HERO_MOVE, this.refreshVisible, this)
		UnRegisterEvent(EventDefine.HERO_MOVE_STOP, this.refreshVisible, this)
        
    }

	 onPropertyChange(){
        super.onPropertyChange();
		this.entryId = this.propertyInfo.entryId
    }

	getEntryId():number{
		return this.entryId;
	}

	onEnterMap(){
		super.onEnterMap();
		this.refreshVisible();
	}

	refreshVisible( ){
		let config = GameConfig.npcConfig[this.entryId]
		if(config ){
			let scope = config.showScope || 0
			if(scope > 0 ){
				let p1 = GetHero().getCellXY()
				let p2 = this.getCellXY()
				if(MathUtil.checkNormScope(p1.x, p1.y, p2.x, p2.y, scope) == true ){
					this.setVisible(true)
				}else{
					this.setVisible(false)
				}
			}
		}
	}
}