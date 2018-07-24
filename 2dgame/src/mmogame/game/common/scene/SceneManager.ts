enum eMapLayerTag
{
	Sprite_Bottom = 1,
	Sprite ,
	Sprite_Top ,
	//Effect ,
	Count,
};

//场景模型缩放比例
var SCENE_PERS_SCALE = 1

class SceneManager extends TClass{

	mCamera:map.Camera;
	mTileMap:map.TileMap;
	mbMapLoading:boolean;

	mTempPoint:egret.Point;

	ActorList:Actor[];

	mCommandList:any[];


	cameraSeed:number;
	cameraMoveId:number;
	cameraZoomId:number;

	shakeTimer:number;
	shakeDuring:number;
	shakeTime:number;
	shakeViewCenterX:number;
	shakeViewCenterY:number;
	shakeScopeX:number;
	shakeScopeY:number;
	shakeId:number;
	bShakeState:boolean;
	shakeActor:Actor;

	simpleShakeTimer:number;

	callbackId = 100;
	callbackMap:any;

	screenEffectList:Effect[];

	persScale:number;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.mTileMap = IGlobal.mapManager.getTileMap();
		this.mCamera = IGlobal.mapManager.getCamera();

		this.mTempPoint = new egret.Point;
		this.ActorList = [];
		this.mCommandList = [];


		//注册精灵的几个层次
		IGlobal.mapManager.addSpriteLayer(eMapLayerTag.Sprite_Bottom, map.SortSpriteLayer.newObj(this.mTileMap) );
		IGlobal.mapManager.addSpriteLayer(eMapLayerTag.Sprite, map.SortSpriteLayer.newObj(this.mTileMap) );
		IGlobal.mapManager.addSpriteLayer(eMapLayerTag.Sprite_Top, map.SortSpriteLayer.newObj(this.mTileMap) );



		IGlobal.mapManager.addEventListener(map.MapEvent.LOAD_MAP_FINISH, this.onMapLoadFinish, this);
		//IGlobal.mapManager.addSpriteLayer(eMapLayerTag.Effect, map.SortSpriteLayer.newObj(this.mTileMap) );

		this.cameraSeed = 200
		
		//屏幕震动参数
		this.shakeTimer = null //定时器
		this.shakeDuring = 0
		this.shakeTime = 0
		this.shakeViewCenterX = -1
		this.shakeViewCenterY = -1
		this.shakeScopeX = 0
		this.shakeScopeY = 0
		this.shakeId = 0
		this.bShakeState = false;
		

		this.simpleShakeTimer = null;
		
		this.cameraMoveId = 0
		this.cameraZoomId = 0


		this.callbackMap = {};
		this.screenEffectList = []

		this.persScale = 1;
    }
    //子类复写 析构函数
    protected destory(): void{
        this.clearActor()
		this.clearScreenEffect()
    }


	// onMapLoadComplete(){
	// 	this.mbMapLoading = true;
	// 	FireEvent(EventDefine.SceneLoadCompelete, null);
	// 	this.updateCommands();
	// }




	loadMap(mapname:string, callback?:Function, thisObj?:any, userData?:any):SceneManager{
		TLog.Debug("loadmap", mapname);

		//let id = -1;

		if(callback && thisObj){
			let id = this.callbackId++
			
			if(IGlobal.mapManager.loadMap(mapname, id)){
				this.callbackMap[id] = [callback, thisObj, userData];
				this.mbMapLoading = true;
			}else{
				TLog.Error("loadMap failed", mapname)
			}
		}
		
		//IGlobal.mapManager.loadMap(mapname, this.onMapLoadComplete, this);
		
		return this;
	}

	isMapLoading():boolean{
		return this.mbMapLoading;
	}

	setScenePersScale(scale:number){
		TLog.Assert(scale > 0)
		this.persScale = scale;
	}


	enterMap(actor:Actor, layerTag:number){
		if(this.ActorList.indexOf(actor) != -1){
			TLog.Error("SceneManager.enterMap actor exsit");
			return;
		}

		actor.setPersScale(this.persScale)

		IGlobal.mapManager.enterMap(actor.realActor, layerTag);
		this.ActorList.push(actor);
		actor.onEnterMap();
	}

	leaveMap(actor:Actor){

		var ret = JsUtil.arrayRemoveVal(this.ActorList, actor);

		if(ret == false){
			TLog.Error("SceneManager.leaveMap actor not exsit");
		}else{
			
			IGlobal.mapManager.leaveMap(actor.realActor);
			actor.setPersScale(1)
			actor.onLeaveMap();
		}

	}

	changeMapLayer(actor:Actor, layerTag:number){
		IGlobal.mapManager.changeMapLayer(actor.realActor, layerTag);
	}



	setActorsPause(pause:boolean, layer?:number){
		this.ActorList.forEach(actor=>{
			if(layer == null || layer == actor.getMapLayer() ){
				actor.setAnimPause(pause)
			}
		});
	}

	setActorsVisible(visible, layer?:number){
		this.ActorList.forEach(actor=>{
			if(layer == null || layer == actor.getMapLayer() ){
				actor.setVisible(visible)
			}
		});
	}

	// getMapSize(){
	// 	var h = this.mTileMap.getMapHeight();
	// 	var w = this.mTileMap.getMapWidth();
	// 	return {w:w, h:h};
	// }

	//飙血不能挂接到模型节点，会被挡住。需要直接加载camera
	addNodeToCamera(node:egret.DisplayObject){
		this.mCamera.addNodeToCamera(node);
	}

	removeNodeFromCamera(node:egret.DisplayObject){
		this.mCamera.removeNodeFromCamera(node)
	}

	
	screenXYtoMapXY(x, y):any{
		this.mCamera.stageXYToMapXY(x, y, this.mTempPoint);
		return this.mTempPoint.clone();
	}

	mapXYtoScreenXY(x, y):any{
		this.mCamera.mapXYToStageXY(x, y, this.mTempPoint);
		return this.mTempPoint.clone();
	}


	mapXYtoCellXY(x, y):any{
		var cx = map.LogicBlock.getCellX(x);
		var cy = map.LogicBlock.getCellY(y);
		return this.mTempPoint.setTo(cx, cy).clone();
		
	}

	cellXYtoMapXY(x, y):any{
		var mx = map.LogicBlock.getXFromCell(x);
		var my = map.LogicBlock.getYFromCell(y);
		return this.mTempPoint.setTo(mx, my).clone();
	}


	cameraLinkActor(actor:Actor){
		this.mCamera.linkMapSprite(actor.realActor);
	}

	cameraUnLinkActor(){
		this.mCamera.unlinkMapSprite();
	}

	setAdjustViewCenter(b:boolean):void{
		this.mCamera.setAdjustViewCenter(b);
	}

	setZoomScale(scale:number, bResetView?:boolean):void{
		this.mCamera.setZoomScale(scale);
	}

	getZoomScale():number{
		return this.mCamera.getZoomScale();
	}

	lookAtCenter(mapx, mapy):void{
		this.mCamera.setViewCenter(mapx, mapy);
	}

	getCameraXY():any{
		var cx = this.mCamera.getViewCenterX();
		var cy = this.mCamera.getViewCenterY();

		return this.mTempPoint.setTo(cx,cy).clone();
	}


	getCameraViewBeginXY(){
		var cx = this.mCamera.getViewBeginX();
		var cy = this.mCamera.getViewBeginY();
		return this.mTempPoint.setTo(cx,cy).clone();
	}

	getCameraViewSize(){
		return {w:this.mCamera.getViewWidth(), h: this.mCamera.getViewHeight()}
	}


	addScreenEffect( effect){
		if(table_isExist(this.screenEffectList, effect) == false ){
			table_insert(this.screenEffectList, effect)
			this.mCamera.addScreenEffect(effect.realActor, effect.getScreenLayer() )
			effect.onEnterCamera()
		}
	}

	removeScreenEffect( effect){
		if(table_remove(this.screenEffectList, effect) ){
			effect.onLeaveCamera()
			this.mCamera.removeScreenEffect(effect.realActor)
		}
	}

	clearScreenEffect(){
		while( this.screenEffectList.length != 0 ){
			let effect = this.screenEffectList[1]
			effect.deleteObj() //内部调用Character.removeEffect
		}
	}


	clearActor():void{
		for(var i = 0; i < this.ActorList.length; i++){
			var actor = this.ActorList[i];
			actor.deleteObj();
		}
		this.ActorList.length = 0;
	}

	isActorExsit(actor:Actor):boolean{
		var idx = this.ActorList.indexOf(actor);
		return idx != -1;
	}


	isActorHitWithSceenXY(actor, x, y):boolean{
		var result = this.screenXYtoMapXY(x, y);
		return this.isActorHitWithMapXY(actor, result.x, result.y);
	}

	isActorHitWithMapXY(actor:Actor, x , y):boolean{
		return actor.getBoundRect().contains(x, y);
	}

	
	doCommand(func:()=>void, thisObj?:any, userData?:any):SceneManager{
		if(!this.mbMapLoading){
			func.call(thisObj, userData);
		}

		this.mCommandList.push({func:func, thisObj:thisObj, userData:userData});
		return this;
	}

	updateCommands(){
		this.mCommandList.forEach(info=>{
			info.func.call(info.thisObj, info.userData);
		});
		this.mCommandList.length = 0;
	}
	

	setPerspective(b:boolean){

	}


	shakeScreenOnce(dir, scope, rate, during){
		if(this.bShakeState == true || this.simpleShakeTimer != null)
			return;

		let shakeId = 0

		let onSimpleShakeTimer = function(dt){
			if(this.simpleShakeTimer){
				this.stopShakeScreen(shakeId)
				KillTimer(this.simpleShakeTimer)
				this.simpleShakeTimer = null
			}
		}

		this.simpleShakeTimer = SetTimer(onSimpleShakeTimer, this, during)
		shakeId = this.startShakeScreen(dir, scope, rate, null)
	}

	startShakeScreen(dir, scope, rate, actor){
		//以坐标（scope,0）旋转
		//			y
		//			|
		//			|  scope
		//------------->x
		//			|
		//			|
		
		//有震动重叠时，后面震动的不处理
		if(this.bShakeState == true){
			return null
		}
		
		this.setAdjustViewCenter(false)
		
		this.shakeDuring = 1000 / rate
		this.shakeTime = this.shakeDuring
		
		if(this.shakeViewCenterX < 0 || this.shakeViewCenterY < 0){
			//this.lookAtCenter(this.shakeViewCenterX, this.shakeViewCenterY)

			var pos = this.getCameraXY()
			this.shakeViewCenterX = pos.x
			this.shakeViewCenterY = pos.y
		}
		
		//this.shakeViewCenterX, this.shakeViewCenterY= this.getCameraXY()
		this.shakeScopeX = MathUtil.cos(dir) * scope
		this.shakeScopeY = MathUtil.sin(dir) * scope
		this.shakeScopeY = -this.shakeScopeY//地图坐标是向下的
		
		this.cameraSeed = this.cameraSeed + 1
		this.shakeId = this.cameraSeed
		
		this.bShakeState = true
		this.shakeActor = actor || null
		
		if(this.shakeTimer == null){
			this.shakeTimer = SetTimer(this.onTickShake, this, 0, true)
		}
		
		return this.shakeId
	}


	stopShakeScreen(id){
		if(this.shakeId != id){
			return
		}
			
		this.lookAtCenter(this.shakeViewCenterX, this.shakeViewCenterY)

		this.shakeId = 0
		this.shakeViewCenterX = -1
		this.shakeViewCenterY = -1
		this.bShakeState = false
		this.shakeActor = null
		
		if(this.shakeTimer){
			KillTimer(this.shakeTimer)
			this.shakeTimer = null
		}
		
		this.resetCameraLook()
	}

	isShakeState(){
		return this.bShakeState 
	}

	onTickShake(delay){
		if(this.shakeActor){
			if(this.shakeActor.isPause()){
				return
			}
		}

		this.shakeTime = this.shakeTime + delay
		if(this.shakeTime >= this.shakeDuring){
			this.shakeTime = 0
			
			var centerX = this.shakeViewCenterX + this.shakeScopeX
			var centerY = this.shakeViewCenterY + this.shakeScopeY
			
			this.lookAtCenter(centerX, centerY)
			
			this.shakeScopeX = -this.shakeScopeX
			this.shakeScopeY = -this.shakeScopeY
		}
	}

	startCameraMove(){
		this.cameraSeed = this.cameraSeed + 1
		this.cameraMoveId = this.cameraSeed
		this.setAdjustViewCenter(false)
		return this.cameraMoveId
	}

	stopCameraMove(id){
		if(id == 0){
			return
		}
		
		if(id == this.cameraMoveId){
			this.cameraMoveId = 0
			this.resetCameraLook()
		}
	}


	updateCameraMove(id, x, y){
		if(id == this.cameraMoveId){
			this.lookAtCenter(x, y)
			return true
		}
		return false
	}


	startCameraZoom(){
		this.cameraSeed = this.cameraSeed + 1
		this.cameraZoomId = this.cameraSeed
		return this.cameraZoomId
	}

	stopCameraZoom(id){
		if(id == 0){
			return
		}
		
		if(id == this.cameraZoomId){
			this.cameraZoomId = 0
			this.resetCameraZoom()
		}
	}


	updateCameraZoom(id, zoomScale){
		if(id == this.cameraZoomId){
			this.setZoomScale(zoomScale)
			return true
		}
		return false
	}


	resetCameraLook(){
		this.setAdjustViewCenter(true)
		this.mCamera.adjustViewCenter();
		//local realX, realY = this.realMap:GetRealViewCenterX(), this.realMap:GetRealViewCenterY()
		//this.lookAtCenter(realX, realY)
	}

	resetCameraZoom(){
		this.setZoomScale(1)
	}


	setMaskEnable(mask:boolean){
		IGlobal.mapManager.getLogicMask().SetMaskEnable(mask)
	}

	isBlock(x, y){
		return IGlobal.mapManager.getLogicBlock().IsBlock( this.mTempPoint.setTo(x, y) )
	}

	showBgBlendColor(a, r,g, b){
		this.mCamera.setBgBlendColorEnable(true);
		this.mCamera.setBgBlendColor(a, r,g, b);
	}

	updateBgBlendColor(a, r,g, b){
		this.mCamera.setBgBlendColor(a, r,g, b);
	}

	hideBgBlendColor(){
		this.mCamera.setBgBlendColorEnable(false);
	}


	showFgBlendColor(a, r,g, b){
		this.mCamera.setFgBlendColorEnable(true);
		this.mCamera.setFgBlendColor(a, r,g, b);
	}

	hideFgBlendColor(){
		this.mCamera.setFgBlendColorEnable(false);
	}


	setBgImage(imagePath,x, y){
		let image = this.mCamera.setBgImage(imagePath)
		image.x = checkNull(x, 0)
		image.y = checkNull(y, 0)
		return image
	}

	setFgImage(imagePath,x, y){
		let image = this.mCamera.setFgImage(imagePath)
		image.x = checkNull(x, 0)
		image.y = checkNull(y, 0)
		return image
	}

	

	findHitActorWithSceenXY( x, y){
		let hitActor = null
		for(let _ = 0; _ < this.ActorList.length; _++){
				let actor = this.ActorList[_]
		
			if(actor.isVisible() && actor.isTouchEnable() ){
				if(this.isActorHitWithSceenXY(actor, x, y) ){		
					if(! hitActor ){
						hitActor = actor				
					}else{
						let hitActorPos = hitActor.getMapXY()
						let actorPos = actor.getMapXY()
						if(actorPos.y > hitActorPos.y ){
							hitActor = actor
						}
					}
					
				}
			}
		}
		
		return hitActor
	}

	
	findHitActorListWithSceenXY( x, y){
		let actorList = []
		for(let _ = 0; _ < this.ActorList.length; _++){
				let actor = this.ActorList[_]
		
			if(actor.isVisible() && actor.isTouchEnable() ){
				if(this.isActorHitWithSceenXY(actor, x, y) ){		
					table_insert(actorList, actor)
				}
			}
		}
		return actorList
	}

	onMapLoadFinish(event:map.MapEvent){
	 	this.updateCommands();

		 let callbackId = event.userData

		 let callbackInfo = this.callbackMap[callbackId]
		 if(callbackInfo){
			 let func = callbackInfo[0]
			 let thisObj = callbackInfo[1]
			 let userData = callbackInfo[2]
			 func.call(thisObj, userData)

			 delete this.callbackMap[callbackId]
		 }
	}

}