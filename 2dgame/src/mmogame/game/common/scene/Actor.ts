class Actor extends TClass {

	realActor: map.LogicSprite;
	bEnterMap: boolean;
	layerTag: number;
	modelId: number;
	actorType: number;
	bAnimPause: boolean;

	mbTouchEnable: boolean;

	m_anim_listener_list: any[];
	commandComponentList: ActorCmdComponent[];


	controlList: ActorControlBase[];
	bMoveAutoRotate: boolean;

	bEnterViewer: boolean;
	bMirror: boolean;

	//子类复写 初始化函数
	public initObj(...params: any[]): void {
		this.bEnterMap = false;
		this.modelId = -1;

		this.mbTouchEnable = true;
		this.bEnterMap = false;

		this.bAnimPause = false;
		this.bEnterViewer = false;


		//this.realActor = IGlobal.spriteMangaer.createSprite(map.SpriteType.TYPE_BONE_SPRITE);
		this.realActor = IGlobal.spriteMangaer.createSprite(map.SpriteType.TYPE_FRMAE_SPRITE);
		this.realActor.retain();
		this.actorType = actor_Type.ACTOR_TYPE_BASE;


		this.m_anim_listener_list = [];
		this.commandComponentList = [];


		this.controlList = [];
		this.bMoveAutoRotate = false;
		this.bMirror = false

		this.realActor.addEventListener(map.SpriteAnimEvent.AnimEvent, this.onAnimEvent, this)
		this.realActor.addEventListener(map.SpriteEvent.BoundSizeEvent, this.onAppearChange, this);

	}
	//子类复写 析构函数
	protected destory(): void {

		TLog.Assert(this.realActor != null, "%s has beend deleted", this.classname);


		TLog.Assert(this.bEnterViewer == false)

		if (this.bEnterMap) {
			this.leaveMap()//离开地图
		}

		this.commandComponentList.forEach(v => {
			v.deleteObj();
		});
		this.commandComponentList = null;

		this.flushAnimEvent();


		this.controlList.forEach(v => {
			v.deleteObj();
		});
		this.controlList = null;

		if (this.realActor) {
			this.realActor.clearEvent();
			this.realActor.releaseLater();
			this.realActor = null;
		}
	}

	flushAnimEvent() {
		if (this.m_anim_listener_list.length == 0) {
			return
		}

		var listener_list = this.m_anim_listener_list.concat();

		listener_list.forEach(l => {
			l.function_index.call(l.this_index, "end", this);
		})
	}

	getActorType(): number {
		return this.actorType;
	}


	getMapLayer(): number {
		return this.layerTag;
	}

	setMapLayer(layer: number): void {
		this.layerTag = layer;
	}

	setAnimNotifyEnable(enable: boolean) {
		if (enable) {
			this.realActor.addReportFlag(map.AnimReportFlag.ANIM_NOTIFY)
		} else {
			this.realActor.removeReportFlag(map.AnimReportFlag.ANIM_NOTIFY)
		}
	}

	setBoundNotifyEnable(enable: boolean) {
		if (enable) {
			this.realActor.addReportFlag(map.AnimReportFlag.BOUND_NOTIFY)
		} else {
			this.realActor.removeReportFlag(map.AnimReportFlag.BOUND_NOTIFY)
		}
	}

	enterMap(layer?: number): void {
		if (this.bEnterMap == false) {
			layer = layer || eMapLayerTag.Sprite;
			this.setMapLayer(layer);
			SceneManager.getInstance().enterMap(this, this.layerTag);
		}
	}

	leaveMap(): void {
		SceneManager.getInstance().leaveMap(this);
	}

	isEnterMap(): boolean {
		return this.bEnterMap;
	}

	changeMapLayer(layer: number) {
		this.setMapLayer(layer);
		SceneManager.getInstance().changeMapLayer(this, this.layerTag);
	}

	changeTopMapLayer() {
		this.changeMapLayer(eMapLayerTag.Sprite_Top)
	}

	changeNormalMapLayer() {
		this.changeMapLayer(eMapLayerTag.Sprite)
	}

	changeBottomMapLayer() {
		this.changeMapLayer(eMapLayerTag.Sprite_Bottom)
	}


	loadModel(modelId: number) {
		if (this.modelId == modelId) {
			return;
		}

		if (ActorManager.getInstance().loadModel(this, modelId)) {
			this.modelId = modelId;
		}
	}

	setModelId(id: number) {
		this.modelId = id;
	}

	getModelId(): number {
		return this.modelId;
	}

	loadModelByName(name: string): void {
		this.realActor.loadModel(name);
	}

	getModelName(): string {
		return this.realActor.getModelName();
	}

	setVisible(visible) {
		visible = !!visible
		this.realActor.setVisible(visible);
	}

	setVisibleRaw(visible) {
		visible = !!visible;
		this.realActor.setVisibleRaw(visible)
	}

	isVisible(): boolean {
		return this.realActor.isVisible();
	}

	setPositionXY(x, y) {
		TLog.Assert(isNaN(x) == false && isNaN(y) == false)
		this.realActor.setPosition(x, y);
	}

	getPositionXY() {
		var x = this.realActor.getPositionX();
		var y = this.realActor.getPositionY();
		return { x: x, y: y };
	}

	setMapXY(x, y) {
		this.setPositionXY(x, y);
	}

	getMapXY() {
		return this.getPositionXY();
	}

	setCellXY(x, y) {
		this.realActor.setPositionCellXY(x, y);
	}

	getCellX() {
		return this.realActor.getPositionCellX();
	}
	getCellY() {
		return this.realActor.getPositionCellY();
	}
	getCellXY() {
		var cx = this.realActor.getPositionCellX();
		var cy = this.realActor.getPositionCellY();
		return { x: cx, y: cy };
	}


	setPositionOffset(x, y){
		this.realActor.setPositionOffset(x, y)
	}

	// setAngle(angle:number){
	// 	this.
	// }

	// getAngle():number{

	// }

	setDir(dir) {
		if(dir == null)
			dir = 0;
		this.realActor.setDir(dir);
	}

	getDir(): number {
		return this.realActor.getDir();
	}


	setAnimPause(pause) {
		this.realActor.setPause(pause);
		this.bAnimPause = pause
	}

	isAnimPause(): boolean {
		return this.bAnimPause;
	}

	isPause(): boolean {
		return false;
	}


	changeAction(name?: string, speed?: number, loop?: boolean): void {

		if (speed == null) {
			speed = this.realActor.getAnimSpeed();
		}
		if (loop == null) {
			loop = true;
		}

		this.realActor.changeAction(name, loop ? 0 : 1);
		this.realActor.setAnimSpeed(speed);
	}

	//如果某些action不存在，会以aliasName去替换动作
	addAliasAction(name: string, aliasName:string): void {
		this.realActor.addAliasAction(name, aliasName);
	}

	clearAliasAction(){
		this.realActor.clearAliasAction()
	}

	getActionId(){
		return this.realActor.getActionId();
	}

	// getActionName():string{
	// 	return this.realActor.get
	// }

	setAnimSpeed(speed: number) {
		this.realActor.setAnimSpeed(speed);
	}

	getAnimSpeed(): number {
		return this.realActor.getAnimSpeed();
	}


	setAlpha(alpha) {
		this.realActor.setAlpha(alpha);
	}


	setColor(r, g, b) {
		this.realActor.setColor(r, g, b);
	}


	getAlphaColor() {
		let color: any = {}
		let [a, r, g, b] = [255, 255, 255, 255]
		color.a = a;
		color.r = r;
		color.g = g;
		color.b = b;
		return color;
	}


	setRotate(r: number) {
		this.realActor.setRotate(r);
	}

	getRotate(): number {
		return this.realActor.getRotate();
	}

	rotateAngle(dxAngle: number) {
		var angle = this.getRotate();
		this.setRotate(angle + dxAngle)
	}

	setScale(scale) {
		this.realActor.setScale(scale);
	}

	getScale() {
		return this.realActor.getScale();
	}

	//模型的场景缩放比例
	setPersScale(scale) {
		this.realActor.setPersScale(scale)
	}

	getPersScale(scale) {
		return this.realActor.getPersScale();
	}

	setAutoPerspectEnable(b) {

	}


	setFlipXY(bFlipX: boolean, bFlipY: boolean) {
		this.realActor.setFlipXY(bFlipX, bFlipY);
	}

	isFlipX(): boolean {
		return this.realActor.isFlipX();
	}

	isFlipY(): boolean {
		return this.realActor.isFlipY();
	}

	setMirror(bMirror: boolean) {
		this.bMirror = bMirror
		this.realActor.setMirror(bMirror);
	}
	
	getMirror(){
		return this.bMirror
	}

	getContentSize() {
		let actorContent = this.realActor.getBoundRect();
		let size = { width: actorContent.width, height: actorContent.height };
		return size
	}

	getBoundRect() {
		return this.realActor.getBoundRect();
	}

	updateBoundRect() {

	}

	//一直更新动画（默认只是可见时才更新动画）
	setUpdateAnimAlways(b:boolean){
		this.realActor.setUpdateAnimAlways(b);
	}

	//指定action作为包围盒 （一个模型又多套动作，不同动作的包围盒不一样，一般设置idle作为默认包围盒）
	setBoundActionId(actionId:string){
		this.realActor.setBoundActionId(actionId)
	}

	isTouchEnable(): boolean {
		return this.mbTouchEnable;
	}

	setTouchEnable(enable: boolean) {
		this.mbTouchEnable = enable;
	}


	changeShader(type) {

	}

	changePartSkin(slotName:string, replaceSkinPath:string){
		this.realActor.changePartSkin(slotName, replaceSkinPath);
	}

	changeSkin(skinName:string){ //传入骨架名
		this.realActor.changeSkin(skinName);
	}


	hasActionId(actionId:string):boolean{
		return this.realActor.hasActionId(actionId)
	}

	onEnterMap() {
		this.bEnterMap = true
	}

	onLeaveMap() {
		this.bEnterMap = false
	}


	// addAnimListener(func:(notify:string, actor?:Actor)=>void, thisObj:any, notify?:string){

	// 	for(var i = 0; i < this.m_anim_listener_list.length; i++){
	// 		var ll = this.m_anim_listener_list[i];
	// 		if(ll.func == func && ll.thisObj == thisObj){
	// 			TLog.Error("addAnimListener", thisObj);
	// 			return;
	// 		}
	// 	}

	// 	var listener:any = {};
	// 	listener.function_index = func;
	// 	listener.this_index = thisObj;
	// 	listener.notify_name = notify;
	// 	this.m_anim_listener_list.push(listener);
	// }

	// removeAnimListener(func:(notify:string, actor?:Actor)=>void, thisObj:any){
	// 	for(var i = 0; i < this.m_anim_listener_list.length; i++){
	// 		var ll = this.m_anim_listener_list[i];
	// 		if(ll.function_index == func && ll.this_index == thisObj){
	// 			this.m_anim_listener_list.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// }

	// clearAnimListener(){
	// 	this.m_anim_listener_list.length = 0;
	// }
	addAnimListener(listener) {
		if (listener.this_index == null || listener.function_index == null) {
			TLog.Throw("listener.this_index == null || listener.function_index == null")
			return;
		}

		if (table_isExist(this.m_anim_listener_list, listener)) {
			return
		}
		JsUtil.arrayInstert(this.m_anim_listener_list, listener)
	}

	removeAnimListener(listener) {
		return table_remove(this.m_anim_listener_list, listener)
	}

	clearAnimListener() {
		this.m_anim_listener_list = []
	}


	onAnimOneCycle(actionId: string) {

	}


	onAnimEvent(args: map.SpriteAnimEvent): void {
		if (this.m_anim_listener_list.length > 0) {
			var listener_list = this.m_anim_listener_list.concat();
			var count = 0
			listener_list.forEach(anim_listener => {
				if (anim_listener.notify_name != null) {

					if (args.notify == anim_listener.notify_name) {
						anim_listener.function_index.call(anim_listener.this_index, args.notify, this)
					}
				} else {
					anim_listener.function_index.call(anim_listener.this_index, args.notify, this)
				}
				count = count + 1
			});
		}
		//PROFILE_STOP(this.classname..".onAnimEvent m_anim_listener_list")
		if (args.notify == "end") {//一次动画循环结束
			this.onAnimOneCycle(args.actionId)
		}
	}




	addCommandComponent(handle: ActorCmdComponent) {
		JsUtil.arrayPush(this.commandComponentList, handle);
	}


	removeCommandComponent(handle: ActorCmdComponent) {
		JsUtil.arrayRemoveVal(this.commandComponentList, handle);
	}

	doCommand(cmdId: number, param1?: any, param2?: any) {
		this.commandComponentList.forEach(v => {
			v.onCommand(cmdId, param1, param2);
		});
	}

	onAppearChange() {
		this.commandComponentList.forEach(v => {
			v.onAppearChange();
		});
	}


	addControl(control: ActorControlBase) {
		if (JsUtil.arrayPush(this.controlList, control)) {
			control.begin(this);
		}
	}

	removeControl(control: ActorControlBase) {
		JsUtil.arrayRemoveVal(this.controlList, control);
	}

	isExsitControl(control: ActorControlBase) {
		return JsUtil.arrayExsit(this.controlList, control);
	}


	update(delay) {
		if (this.bAnimPause) {
			return
		}

		this.controlList.forEach(control => {
			control.update(this, delay)
		})

	}

	createFade(interval_time, alive_interval, max_count) {
		//todo:yangguiming
		// self.realActor:SetFadeEnable(true)
		// assert(interval_time > 0 and alive_interval > 0 and max_count > 0)

		// self.realActor:SetFadeEnable(true)
		// self.realActor:SetFadeParam(interval_time,alive_interval,  max_count)
	}

	clearFade() {
		//self.realActor:SetFadeEnable(false)
	}


	setMoveAutoRotate(bAutoRotate: boolean) {
		this.bMoveAutoRotate = bAutoRotate
	}

	isMoveAutoRotate() {
		return this.bMoveAutoRotate
	}




	enterViewer(viewer: gui.ActorView) {
		if (this.bEnterMap) {
			TLog.Error("Actor.enterViewer actor has EnterMap")
			return
		}

		if (this.bEnterViewer == false) {
			viewer.addActor(this.realActor)
			//this.realActor:release()
			//this.realActor:retain()
			this.bEnterViewer = true
		}
	}


	leaveViewer(viewer: gui.ActorView) {
		
		if (viewer.removeActor(this.realActor)) {
			//this.realActor:retain()
			//viewer.setActor(null)
			this.bEnterViewer = false
		}
	}
}