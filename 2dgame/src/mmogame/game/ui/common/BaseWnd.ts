// TypeScript file
/*
作者:
    yangguiming
	
创建时间：
   2016.12.23(周五)

意图：
   1.窗口加载onLoad不是同步的，需要等待布局文件下载并解析后才执行。
   2.窗口不要额外添加接口，统一使用doCommand，此函数会在窗口加载完成后才执行

公共接口：
	------------------------------------------------
	--BaseWnd接口
	--BaseWnd.showWnd = function(self)
	--BaseWnd.hideWnd = function(self)
	--BaseWnd.loadWnd = function(self)
	--BaseWnd.unLoadWnd = function(self)
	--BaseWnd.isVisible = function(self)
	--BaseWnd.isLoadComplete = function(self)
	
	--必须继承
	public initObj(...params:any[]){
	public onLoad():void{
	public onUnLoad():void{
	public onShow():void{
	public onHide():void{
	
	
*/

/*模版类
class TemplateFrame extends BaseWnd{
	public initObj(...params:any[]){
		this.mLayoutPaths = ["resource/layouts/MainMenuLayout.exml"]
	}

	public onLoad():void{
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
	}

	public onUnLoad():void{

	}

	public onShow():void{
		this.mLayoutNode.visible = true;
	}

	public onHide():void{
		this.mLayoutNode.visible = false;
	}
}






//使用标签分页 UITabWndList模版
class TemplateTabFrame extends BaseWnd {

    emptyView: UIEmptyView;
    tabWndList: UITabWndList;
    tabIndex: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/EquipFactoryLayout.exml"]
        this.tabIndex = -1;
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        let tabInfoList = [
            { name: "tab1", wnd: EquipFactory_EnhanceWnd.newObj(this.mLayoutNode, this) },
            { name: "tab2", wnd: EquipFactory_IdentWnd.newObj(this.mLayoutNode, this) },
            { name: "tab3", wnd: EquipFactory_ChongSuoWnd.newObj(this.mLayoutNode, this) },
            { name: "tab4", wnd: EquipFactory_InhertWnd.newObj(this.mLayoutNode, this) },
        ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
    }


    public onUnLoad(): void {

    }

    public onShow(): void {
      
        this.mLayoutNode.visible = true;
        this.tabWndList.setWndVisible(true);
        if (this.tabIndex != -1) {
            this.tabWndList.changeTabWithIndex(this.tabIndex)
        }

    }

    public onHide(): void {
       
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false);
    }


    ////////////////////////////////////////////////////////////////////////////////////
	//以0开头，0是第一个标签
    showWithIndex(index?) {
        if (index == null) {
            index = 0
        }
        this.tabIndex = index;
        this.showWnd();
    }
}

*/




var ORDER_SEED = 100;
var g_WndList: BaseWnd[] = [];
let g_FullScreenRegisterMap = {}
let g_PhoneXReserveH = 54

class BaseWnd extends TClass {
	info: any = null;//

	mbLoad: boolean;//开始加载
	mbLoadComplete: boolean;//加载完成
	mLayoutPaths: string[]; //布局文件列表，需要在构造函数重写
	mCommandList: any[];

	mVisible: boolean;
	mShowOrder: number;

	mParentLayer: egret.DisplayObjectContainer;
	mLayoutNodeList: gui.LayoutNode[];
	mElemList: {};

	mLayoutNode: gui.LayoutNode;

	mbModal: boolean;

	mParentWnd: BaseWnd;
	relateWndList: BaseWnd[];
	bHideRelateWnd: boolean;
	bAutoReshow: boolean

	frameName: any;

	mLoadedCallbackList: { callback: Function, thisObj: any }[];

	mAnimTipsWndList: gui.AnimBox[]
	mDotTipsWndList: eui.Image[]


	listenWndName:string;

	mbFireUIEvent:boolean;
	checkDotTipsTimer:any;

	// public constructor(){
	// 	super();
	// }

	public initObj(...params: any[]) {
		this.info = params[0];
		//this.mParentLayer = IGlobal.guiManager.getLayerNode();
		this.mParentLayer = null;
		this.mbLoad = false;
		this.mbLoadComplete = false;
		this.mCommandList = null;
		this.mVisible = false;
		this.mLayoutNodeList = null;
		this.mShowOrder = -1;
		this.mLayoutNode = null;

		//子类需要重载的变量
		this.mLayoutPaths = null;
		this.mElemList = null;

		this.mbModal = false;

		this.mParentWnd = null;
		this.relateWndList = []
		this.bHideRelateWnd = true;
		this.bAutoReshow = true;

		this.mLoadedCallbackList = [];

		this.mAnimTipsWndList = []
		this.mDotTipsWndList = []


		this.mbFireUIEvent = true;

		if(this.info){
			if(this.info.uievent != null){
				this.mbFireUIEvent = !!this.info.uievent
			}
		}
	}

	protected destory() {
		// if (this.mLayoutNode) {
		// 	this.mLayoutNode.removeFromtParent();
		// 	this.mLayoutNode = null;
		// }
		this.hideWnd();
		this.unLoadWnd();
		
	}

	//-------------------begin 覆盖函数----------------
	public onLoad(): void {

	}

	public onUnLoad(): void {

	}

	// public onLoadComplete():void{

	// }

	public onShow(): void {

	}

	public onHide(): void {

	}
	//-------------------end 覆盖函数----------------

	public loadWnd(): void {
		if (this.mbLoad == false) {
			this.mbLoad = true;

			TLog.Assert(this.mLayoutNode == null);
			this.mElemList = {};
			this.mLayoutNodeList = [];
			this.mDotTipsWndList = []
			this.mAnimTipsWndList = []

			this.mLayoutNode = this.createLayoutNode(this.classname);
			this.mLayoutNode.name = this.frameName || this.classname;


			if (this.mLayoutPaths == null || this.mLayoutPaths.length == 0) {
				this.loadComplete();
			} else {
				IGlobal.guiManager.loadLayoutAsyn(this.mLayoutPaths, this.loadComplete, this);
			}
		}
	}

	public loadComplete(): void {
		if (!this.mbLoad) {
			return;
		}

		if (this.mbLoadComplete)
			return;
		this.mbLoadComplete = true;
		this.onLoad();

		//微信小程序，隐藏右上角按钮
		if(egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME){
			if(this.mElemList["btn_close_top"]){
				this.mElemList["btn_close_top"].visible = false;
			}
		}

		if (this.mVisible)
			this._onShow();

		this.updateCommandList();

		for (let info of this.mLoadedCallbackList) {
			info.callback.call(info.thisObj, this)
		}
		this.mLoadedCallbackList = [];
	}

	public unLoadWnd(): void {
		if (this.mbLoad) {
			this.mbLoad = false;
			this.mbLoadComplete = false;

			this.onUnLoad()
			this.mElemList = null;
			this.mDotTipsWndList = []
			this.mAnimTipsWndList = []

			this.mLoadedCallbackList = [];

			this.clearLayoutNodes()

		}

	}

	private clearLayoutNodes() {
		if (this.mLayoutNodeList != null) {
			this.mLayoutNodeList.forEach(node => {
				egret.Tween.removeTweens(node);
				node.removeFromtParent();
			})
			this.mLayoutNode = null;
			this.mLayoutNodeList = null;
		}
	}


	setUiEventEnable(b:boolean){
		this.mbFireUIEvent = b;
	}

	_fireUiEvent(eventname:string){
		if(this.mbFireUIEvent){
			FireEvent(eventname, UIShowEvent.newObj(this))
		}
	}

	_onShow() {
		this._fireUiEvent(EventDefine.UI_SHOW_START)
		this.onShow()
		//可能在刷新的时候调用了this.hideWnd
		if (this.mVisible == true) {
			this.switchDotTipsEvent(true)
			this.refreshDotTips()			
			this._fireUiEvent(EventDefine.UI_SHOW)
		}
	}

	showWnd(parentWnd?) {
		//TLog.Debug("BaseWnd.showWnd",this.classname)
		if (this.mVisible == false) {
			//TLog.Debug("BaseWnd.showWnd",this.classname)
			this.mShowOrder = ORDER_SEED
			ORDER_SEED = ORDER_SEED + 1

			this.loadWnd()
			JsUtil.arrayInstert(g_WndList, this);
			this.mVisible = true
			if (this.mbLoadComplete){
				this._onShow();
			}
		}

		//当前界面于显示状态才进行关联子、父界面的处理
		if (this.mVisible == true) {
			if (this.mParentWnd != parentWnd) {

				if (this.mParentWnd) {
					this.mParentWnd.removeRelateChild(this)
				}

				this.mParentWnd = parentWnd

				if (this.mParentWnd) {
					this.mParentWnd.addRelateChild(this)
				}

			}

			//检查是不是存在循环
			if (parentWnd) {
				let parent = this.getRelateParent()
				while (parent) {
					if (parent == this) {
						TLog.Error("% showWnd loop", this.classname)
						TLog.Throw()
					}
					parent = parent.getRelateParent()
				}
			}
		}
	}


	public _hideWnd(): void {
		if (this.mbLoad && this.isVisible()) {
			this.mVisible = false
			JsUtil.arrayRemoveVal(g_WndList, this);

			this.clearCommand();

			if (this.mbLoadComplete) {
				this._fireUiEvent(EventDefine.UI_HIDE_START)
				this.onHide()
				this.switchDotTipsEvent(false)
				if(this.checkDotTipsTimer){
					KillTimer(this.checkDotTipsTimer)
					this.checkDotTipsTimer = null
				}
				this._fireUiEvent(EventDefine.UI_HIDE)
			}

			// 如果是用一次的
			if (this.info && this.info.mode == LOAD_RECYCLE) {
				this.unLoadWnd()
			}
		}
	}

	public hideWnd() {
		//TLog.Debug("BaseWnd.hideWnd",this.classname,this.mbLoad,this.isVisible(),this.mVisible)
		if (this.mbLoad && this.isVisible()) {
			//隐藏自己
			this._hideWnd()

			if (this.bHideRelateWnd) {
				//相关父窗口隐藏
				let parent = this.getRelateParent()
				if (parent) {
					parent.hideWnd()
				}

				//所有相关子窗口都隐藏
				for (let _ = 0; _ < this.relateWndList.length; _++) {
					let wnd = this.relateWndList[_]

					wnd.hideWnd()
				}
			}

		}
	}

	pushShowWnd(name, bHideSelf?) {
		if (bHideSelf) {
			this.hideWnd()
		}
		WngMrg.getInstance().showWindow(name, this.classname)
	}

	popShowWnd() {
		if (this.mbLoad && this.isVisible()) {
			this._hideWnd()

			let parent = this.getRelateParent()
			if (parent) {
				parent.showWnd(parent.getRelateParent())
			}
		}
	}


	getRelateParent() {
		return this.mParentWnd
	}

	setHideRelateWnd(b: boolean) {
		this.bHideRelateWnd = b
	}

	addRelateChild(wnd) {
		if (table_isExist(this.relateWndList, wnd) == false) {
			table_insert(this.relateWndList, wnd)
		}
	}

	removeRelateChild(wnd) {
		table_remove(this.relateWndList, wnd)
	}

	isAutoStackReshow() {
		return this.bAutoReshow
	}

	getShowOrder() {
		return this.mShowOrder
	}

	public isVisible(): boolean {
		return this.mVisible;
	}

	public isLoadComplete(): boolean {
		return this.mbLoadComplete;
	}

	public createLayoutNode(name?: string) {
		var node = new gui.LayoutNode;
		if (name != null) {
			node.name = name;
		}
		if (this.mParentLayer != null)
			this.mParentLayer.addChild(node);

		this.mLayoutNodeList.push(node);
		return node;
	}


	//////////////////////////////红点提示//////////////////////////////////////////////
	////红点提示，如果参数是动态的，这里则需要返回具体的（例如当前伙伴，当前物品等等）
	getDotTipsOffsetImp(parentWnd):{x:number, y:number}{
		return null;
	}

	getDotTipsArgsImp(checkParam) {
		return null
	}

	//自定义红点继承实现
	refreshDotTipsImp() {
	}


	switchDotTipsEvent(register) {
		let pathsToConfigList = GuideFuncSystem.getInstance().getConfigList(this.classname)
		if (pathsToConfigList == null) {
			return
		}

		let eventMap: any = {}
		for (let path in pathsToConfigList) {
			let confgList = pathsToConfigList[path]

			for (let _ = 0; _ < confgList.length; _++) {
				let config = confgList[_]

				let eventList = GuideFuncSpace.GuideFuncEvent[config.checkEvent]
				if (eventList) {
					for (let _ = 0; _ < eventList.length; _++) {
						let eventName = eventList[_]

						eventMap[eventName] = true //事件登记是唯一的
					}
				}
			}
		}

		if (register) {
			for (let eventName in eventMap) {
				let _ = eventMap[eventName]

				RegisterEvent(eventName, this.refreshDotTipsEvent, this)
			}
			RegisterEvent(EventDefine.GUIDE_FUNC_REFRESH, this.refreshDotTipsEvent, this)

		} else {
			for (let eventName in eventMap) {
				let _ = eventMap[eventName]

				UnRegisterEvent(eventName, this.refreshDotTipsEvent, this)
			}
			UnRegisterEvent(EventDefine.GUIDE_FUNC_REFRESH, this.refreshDotTipsEvent, this)
		}

	}

	//刷新红点
	refreshDotTipsEvent(event) {
		if(this.checkDotTipsTimer != null)
			return;

		//let timerId = 0;
        let onTimerCallback = function(dt){
            KillTimer(this.checkDotTipsTimer);
			this.checkDotTipsTimer = null
             
			this.refreshDotTips(event)
        }

        this.checkDotTipsTimer = SetTimer(onTimerCallback, this, 200);
	}


	//刷新红点
	refreshDotTips(event?) {
		if (this.mLayoutNode == null || GAME_MODE != GAME_NORMAL) {
			return
		}

		//游戏登陆会有大量重复刷新操作，这里先延迟统一处理
		// if(WngMrg.getInstance().isRefreshDotTipsLater() ){
		// 	return
		// }

		this.hideAllDotTipsUI()

		// if (!GuideSystem.getInstance().isFinishGuideClient()) {
		// 	return false
		// }

		this.refreshDotTipsImp()

		let pathsToConfigList = GuideFuncSystem.getInstance().getConfigList(this.classname)
		if (pathsToConfigList == null) {
			return false
		}

		for (let path in pathsToConfigList) {
			let confgList = pathsToConfigList[path]

			//顶层窗口的，不处理，子类覆盖处理
			if (path != this.classname) {
				for (let _ = 0; _ < confgList.length; _++) {
					let config = confgList[_]

					let args = this.getDotTipsArgsImp(config.checkParam)
					let bCheck = GuideFuncSystem.getInstance().checkFunc(config, args, event)
					if (bCheck) {
						let parentWnd = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(path)
						if (this.createAnimTipsUI(parentWnd, config) == false) {
							this.createDotTipsUI(parentWnd, true, config)//有一个开启红点就够
						}
						break
					}
				}
			}
		}
	}


	createDotTipsUI(parentWnd:egret.DisplayObjectContainer|egret.DisplayObject , autoDelete?:boolean, config?) {
		if (parentWnd == null) {
			return
		}
		if(autoDelete == null)
			autoDelete = true

		let imageName = "zjm_hongDian01"
		if(config && config.show && config.show.image){
			imageName = config.show.image
		}

		//let dotWnd = parentWnd.getChildByName("btnTips")  //this.getBtnTipsFrame(addName)
		let dotWnd = parentWnd["btnTips"]
		let elemList: any = {}

		if (!dotWnd) {
			let elemInfo: any = [
				{ ["index_type"]: eui.Image, ["name"]: "btnTips", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: imageName, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
			]
			UiUtil.createElem(elemInfo, this.mLayoutNode, elemList, this, parentWnd)
			dotWnd = elemList["btnTips"]
			dotWnd._autoDelete = autoDelete
			parentWnd["btnTips"] = dotWnd;
			JsUtil.arrayInstert(this.mDotTipsWndList, dotWnd)
		}
		let offx = 0
		let offy = -5;

		let offpos = this.getDotTipsOffsetImp(parentWnd)
		if(offpos){
			offx = offpos.x;
			offy = offpos.y;
		}

		//某些控件不是继承egret.DisplayObjectContainer
		if(dotWnd.parent == parentWnd){
			dotWnd.right = -offx
			dotWnd.top = offy
			//UiUtil.setXY(animWnd, offsetX, offsetY)
		}else{
			let parentW = parentWnd.width
			let parentH = parentWnd.height
			UiUtil.setXY(dotWnd, parentWnd.x + parentW - dotWnd.width + offx, parentWnd.y + offy)
		}
		dotWnd.source = imageName
		dotWnd.visible = (true)
		

	}

	createAnimTipsUI(parentWnd:egret.DisplayObjectContainer|egret.DisplayObject, config) {
		let showConfig = config.show
		if (parentWnd == null || showConfig == null) {
			return false
		}

		let animName = showConfig.animbox
		if(animName == null)
			return false;
		//TLog.Assert(animName != null)


		let info = IGlobal.animSet.getAnimSize(animName)
		let animW = info.w, animH = info.h
		TLog.Assert(animW != 0 && animH != 0)

		let offsetX = showConfig.offsetX || 0
		let offsetY = showConfig.offsetY || 0

		let width = showConfig.width || 0
		let height = showConfig.height || 0

		let badp = showConfig.adp

		let animSpeed = checkNull(showConfig.animSpeed , -1)

		//let animWnd: gui.AnimBox = <gui.AnimBox>parentWnd.getChildByName("btnAnimTips")  //this.getBtnTipsFrame(addName)
		let animWnd: gui.AnimBox = <gui.AnimBox>parentWnd["btnAnimTips"]  //this.getBtnTipsFrame(addName)
		let elemList: any = {}

		if (!animWnd) {
			let elemInfo: any = [
				{ ["index_type"]: gui.AnimBox, ["name"]: "btnAnimTips", ["title"]: null, ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null, ["messageFlag"]: true },
			]
			UiUtil.createElem(elemInfo, this.mLayoutNode, elemList, this, parentWnd)
			animWnd = elemList["btnAnimTips"]

			parentWnd["btnAnimTips"] = animWnd;
			JsUtil.arrayInstert(this.mAnimTipsWndList, animWnd)
			animWnd.play()
		}
		animWnd.setAnimName(animName)
		
		if(animSpeed != -1){
			animWnd.setAnimInterval(animSpeed)
		}

		let offpos = this.getDotTipsOffsetImp(parentWnd)
		if(offpos){
			offsetX = offpos.x;
			offsetY = offpos.y;
		}

		if(animWnd.parent == parentWnd){
			UiUtil.setXY(animWnd, offsetX, offsetY)
		}else{
			UiUtil.setXY(animWnd, parentWnd.x + offsetX, parentWnd.y + offsetY)
		}
		
		if (badp) {
			let parentW = parentWnd.width
			let parentH = parentWnd.height
			UiUtil.setWH(animWnd, parentW, parentH)
		} else {
			if (width == 0 || height == 0) {
				UiUtil.setWH(animWnd, animW, animH)
			} else {
				UiUtil.setWH(animWnd, width, height)
			}
		}

		animWnd.visible = (true)
		return true
	}


	//createDotTipsUIByPath( path){
	//	let parentWnd = this.mRootWindow.GetChildFromPath(path, string.len(path))
	//	this.createDotTipsUI(parentWnd)
	//}

	//隐藏红点
	hideAllDotTipsUI() {
		for (let _ in this.mDotTipsWndList) {
			let dotWnd = <any>this.mDotTipsWndList[_]
			if(dotWnd._autoDelete == true)
				dotWnd.visible = (false)
		}

		for (let _ in this.mAnimTipsWndList) {
			let dotWnd = this.mAnimTipsWndList[_]

			dotWnd.visible = (false)
		}

	}

	hideDotTipsUI( parentWnd){
		if(parentWnd == null ){
			return
		}
		
		let dotWnd = parentWnd["btnTips"]  //this.getBtnTipsFrame(addName)
		if(dotWnd ){
			dotWnd.visible = (false)
		}
		
		let animWnd = parentWnd["btnAnimTips"]  //this.getBtnTipsFrame(addName)
		if(animWnd ){
			animWnd.visible = (false)
		}
	}




	////////////////////////////////////////////////////////////////-


	setRootFrameName(frameName) {
		this.frameName = frameName
	}


	setRootLayer(node: egret.DisplayObjectContainer) {
		this.mParentLayer = node;
	}


	//游戏内全屏，保留上下边
	setFullScreen(b: boolean, image?:boolean) {
		if(image == null)
			image = true

		if (b) {
			this.mLayoutNode.top = 50;
			this.mLayoutNode.bottom =115

			if(IGlobal.stage.scaleMode == egret.StageScaleMode.FIXED_HEIGHT){
				this.mLayoutNode.width = IGlobal.contentWidth;
				this.mLayoutNode.horizontalCenter = 0;
			}

			//如果超长屏幕，则显示最大的适配宽高
			if(IGlobal.stageHeight / IGlobal.stageWidth > 2){
				let newtop = 165
				if(g_isIPhoneX())
					newtop = newtop + g_PhoneXReserveH;
				this.mLayoutNode.top = newtop;
				this.mLayoutNode.bottom = 115;				
			}

			if(image)
				g_FullScreenRegisterMap[this.classname] = true
		} else {
			this.mLayoutNode.percentWidth = NaN;
			this.mLayoutNode.percentHeight = NaN;
			delete g_FullScreenRegisterMap[this.classname] 
		}


		

	}

	//真正的全屏
	setFullScreenRaw(b: boolean) {
		if (b) {
			this.mLayoutNode.top = 0;
			this.mLayoutNode.bottom = 0

			this.mLayoutNode.percentWidth = 100;
			this.mLayoutNode.percentHeight = 100;

			if(g_isIPhoneX()){
				this.mLayoutNode.top = g_PhoneXReserveH;	
				if(this.mElemList["_bg_"] == null){
					let elemInfo: any = [
						{ ["index_type"]: eui.Rect, ["name"]: "_bg_", ["color"]: 0x303030, ["alpha"]: 1, ["x"]: 0, ["y"]: -g_PhoneXReserveH, ["percentWidth"]: 100, ["h"]: g_PhoneXReserveH, ["event_name"]: null, ["fun_index"]: null,  },
					]
					UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this)
				}
			}			
			
		} else {
			this.mLayoutNode.percentWidth = NaN;
			this.mLayoutNode.percentHeight = NaN;
		}
	}
	

	//居中对齐
	setAlignCenter(b: boolean, modal: boolean) {
		if (b) {
			this.mLayoutNode.horizontalCenter = 0
			this.mLayoutNode.verticalCenter = 0;
		} else {
			this.mLayoutNode.horizontalCenter = NaN;
			this.mLayoutNode.verticalCenter = NaN;
		}

		if (modal == true) {
			this.mLayoutNode.setDoModal(true)
		} else {
			this.mLayoutNode.setDoModal(false)
		}
	}


	initSkinElemList() {

		// let skin = this.mLayoutNode.skin;
		// if(skin){
		// 	var elemInfo:any[] =[]
		// 	for(let name of skin.skinParts){
		// 		elemInfo.push({ ["name"]: name, ["event_name"]: null, ["fun_index"]: null })
		// 	}
		// 	UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		// }

		//初始化皮肤，把所有的id控件存储在elemList里
		UiUtil.initElemWithComponent(this.mLayoutNode, this.mElemList, this)
	}


	//-------------------因为界面布局延迟，需要命令队列延迟执行----------------

	public doCommand(funcname: string, param1?: any, param2?: any): void {
		if (this.mVisible == false || this.mbLoad == false)//没有显示或者没加载，就不处理
			return;

		if (this.mbLoadComplete) {
			this.doCommandFunction(funcname, param1, param2);
			return;
		}

		if (!this.mCommandList)
			this.mCommandList = [];

		var commandObj: any = {};
		commandObj.funcname = funcname;
		commandObj.param1 = param1;
		commandObj.param2 = param2;
		this.mCommandList.push(commandObj);
	}

	private clearCommand() {
		this.mCommandList = null;
	}


	private updateCommandList(): void {
		if (this.mCommandList == null)
			return;

		var commandList = this.mCommandList;
		commandList.forEach(commandObj => {
			this.doCommandFunction(commandObj.funcname, commandObj.param1, commandObj.param2);
		});
		this.mCommandList.length = 0;//清空命令列表
	}

	private doCommandFunction(funcname: string, param1: any, param2: any): void {
		var fun = this[funcname];
		if (fun) {
			TLog.Assert(typeof fun == "function");//一定是函数名
			fun.call(this, param1, param2);
		}
	}


	//加载成功后的回调
	public addLoadCallback(cb: Function, obj: any) {
		this.mLoadedCallbackList.push({ callback: cb, thisObj: obj })
	}

	

	//监听listenWndName关闭时候，重新打开自己窗口
	setReopenListenWnd( listenWndName){
		if(listenWndName == null ){
			if(this.listenWndName ){
				this.listenWndName = null
				UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
			}
		}else{
			if(this.listenWndName == null ){
				RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
			}
			this.listenWndName = listenWndName
		}
	}

	onUIHideEvent( args){
		if(this.listenWndName == null ){
			return
		}
		
		//自身是关闭状态，才会监听
		if(this.isVisible() ){
			return
		}
		
		//正在活动中，不处理
		let wngMgr = WngMrg.getInstance()
		if(wngMgr.stackList != null ){
			this.setReopenListenWnd(null)
			return
		}
		
		//不是游戏流程状态
		if(PrecedureManager.getInstance().getCurrentPrecedureId() != PRECEDURE_GAME ){
			this.setReopenListenWnd(null)
			return 
		}
		
		if(this.listenWndName == args.window.classname ){
			this.setReopenListenWnd(null)
			this.showWnd()
		}
	}

	moveToBack(){
		if(this.isVisible() )
			this.mLayoutNode.moveToBack()
	}

	moveToFront(){
		if(this.isVisible() )
			this.mLayoutNode.moveToFront()
	}
}

