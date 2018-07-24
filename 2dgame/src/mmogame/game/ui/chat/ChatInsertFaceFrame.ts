class ChatInsertFaceFrame extends BaseWnd {

	showX: number;
	showY: number;
	faceList: any[];

	selectCallBack: Function;
	selfObj: any;

	faceNameInfo:any;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/ChatInsertFaceLayout.exml"]
		this.faceNameInfo = {}
	}


	initFaceList() {
		this.faceList = []
		let tempConfig = GameConfig.xmlKeyWordConfig
		for (let i in tempConfig) {
			let v = tempConfig[i]

			let numKey = tonumber(v.key, -1)
			if (numKey > 0 && numKey < 40 && v.value && v.value["type"] == 2) {
				JsUtil.arrayInstert(this.faceList, v)
			}
		}


	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.setDoModal(true);

		this.initFaceList();

		this.mLayoutNode.addEventListener(egret.TouchEvent.TOUCH_END, this.hideWnd, this)

		this.mElemList = {};
		var elemInfo: any[] = [
			{ ["name"]: "group_face", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		elemInfo = []
		for (let vconfig of this.faceList) {
			let key = vconfig.key
			let v = vconfig.value
			elemInfo.push({ ["index_type"]: eui.Image, ["name"]: "face_" + key, ["title"]: null,["image"]: v.name,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAnim })


			this.faceNameInfo["face_" + key] = key
		}
		UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this, this.mElemList["group_face"]);

		

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		UiUtil.registerTouchOutsideEvent(this.onClickOutSide, this, [this.mLayoutNode])
		this.mLayoutNode.visible = true;


		let showX = 0
		let showY = 0;
		if(this.showY){
			showY = this.showY - this.mLayoutNode.height - 10;
		}
		
		//this.mLayoutNode.x = 0;
		this.mLayoutNode.horizontalCenter = 0;
		this.mLayoutNode.y = showY;
	}

	public onHide(): void {
		UiUtil.unRegisterTouchOutsideEvent(this.onClickOutSide, this)
		this.mLayoutNode.visible = false;
	}

	onClickAnim(args:egret.TouchEvent) {

		//let key = args.window.GetTitleUtf8()
		let name = args.target.name;
		let key = this.faceNameInfo[name]

		if (key != null && this.selectCallBack) {
			this.selectCallBack.call(this.selfObj, tonumber(key))
			this.hideWnd()
		}
	}


	showFaceTable(selectCallBack, obj, event:egret.Event) {
		this.selectCallBack = selectCallBack
		this.selfObj = obj

		this.showX = null;
		this.showY = null;

		if(event){

			let outPoint = new egret.Point;
			let obj:egret.DisplayObject = event.target;
			var m = obj.$getConcatenatedMatrix();
			m.transformPoint(obj.x, obj.y, outPoint)

			this.showX = outPoint.x;
			this.showY = outPoint.y ;
		}


		this.showWnd();
	}

	onClickOutSide(event:egret.TouchEvent){
		this.hideWnd()
	}



}