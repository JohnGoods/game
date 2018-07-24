class UiUtil {
	// public constructor() {
	// }

	public static getCnsText(text:string):string{
		return text;
	}

	private static _createLabel(component){
		var label = new eui.Label;
		component.addChild(label);
		label.percentWidth = 100;
		label.percentHeight = 100;
		return label;
	}

	private static _createImage(component, source:string, scale?):gui.Grid9Image{

		if(scale == null){
			scale = false;
		}


		var image:gui.Grid9Image = null;
		if(source != null){

			image = new gui.Grid9Image;
			image.autoScale9Grid = scale;

			image.source = source;
		}

		if(image){
			image.percentWidth = 100;
			image.percentHeight = 100;

			component.addChild(image);
		}

		return image;
	}

	//----------------------------------------------------------------------

	// private static getDefaultSkinName(component:eui.Component):void{
	// 	if(component.skin == null){
	// 		var theme = egret.getImplementation("eui.Theme");
	// 		if (theme) {
	// 			let skinName = theme.getSkinName(component);
	// 			if(skinName){
	// 				component.skinName = skinName;
	// 			}
	// 		}
	// 	}
	// }

	// //搜索皮肤的控件，type为类类型
	// private static getSkinElem(component:eui.Component, type:any):any{

	// 	var children = component.skin.$elementsContent
	// 	if(children){
	// 		//for(var i = children.length - 1; i>=0;i-- ){
	// 		for(var i = 0; i < children.length; i++){
	// 			var child = children[i]
	// 			if(child instanceof type){
	// 				return child;
	// 			}
	// 		}
	// 	}

	// 	return null;
	// }

	private static _setComponetProperty(component, v, prop){
		if(component == null)
			return;

		if(v[prop] != null){
			component[prop] = v[prop];
		}
	}

	private static _setComponetProperty2(component, v, prop1, prop2){
		if(component == null)
			return;

		if(v[prop2] != null){
			component[prop1] = v[prop2];
		}
	}

	
	//需要预加载的控件
	// private static _initDefaultSkin(component:eui.Component){
	// 	if(component instanceof eui.Button){
	// 		this.getDefaultSkinName(component);
	// 	}
	// }
	
	private static _initComponentPosAndSize(component:eui.Component, v:any){

		//position		
		this._setComponetProperty(component, v, "x");
		this._setComponetProperty(component, v, "y");
		this._setComponetProperty(component, v, "bottom");
		this._setComponetProperty(component, v, "top");
		this._setComponetProperty(component, v, "left");
		this._setComponetProperty(component, v, "right");
		this._setComponetProperty(component, v, "horizontalCenter");
		this._setComponetProperty(component, v, "verticalCenter");

		//size
		this._setComponetProperty2(component,v, "width", "w");
		this._setComponetProperty2(component,v, "height", "h");
		this._setComponetProperty(component,v, "percentWidth");
		this._setComponetProperty(component,v, "percentHeight");

		if(component && component.width == 0 && component.height == 0 &&
			isNaN(component.percentWidth) && isNaN(component.percentHeight) ){
			let source = ""
			if(component instanceof gui.Button){
				source = component.source
			}
			// else if(component instanceof eui.Image){
			// 	source = <string>component.source
			// }
			if( source != null && source != ""){
				let info = IGlobal.imageSet.getImageInfo(source)
				if(info){
					component.width = info.sourceW
					component.height = info.sourceH
				}
			}
		}


	}

	


	private static _initComponentImage(component:eui.Component, v:any){

		if(component == null || v.image == null )
			return;
		

		//设置皮肤
		this._setComponetProperty(component, v, "skinName");

		//九宫格
		this._setComponetProperty2(component, v, "autoScale9Grid", "autoScale");

		//设置image
		if(component instanceof eui.Image){
			this._setComponetProperty2(component, v, "source", "image");

		 //<p>设置为 <code>BitmapFillMode.CLIP</code>时，位图将在边缘处被截断。</p>
          //<p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
          //<p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
			this._setComponetProperty(component, v, "fillMode");
			
		//设置弹跳按钮
		}else if(component instanceof gui.Button){
			let comp = <gui.Button>(component);
			//背景
			if(comp.backgroupImage == null){
				let img = this._createImage(comp, v.image, false);
				if(v.autoScale){
					img.autoScale9Grid = true;
				}
				comp.backgroupImage = img;
				comp.setChildIndex(comp.backgroupImage, 0);
			}

			this._setComponetProperty(comp.backgroupImage, v, "fillMode");
		
		//设置进度条
		}else if(component instanceof gui.ProgressBar){
			let comp = <gui.ProgressBar>component;
			//背景
			if(comp.backgroupImage == null){
				comp.backgroupImage = this._createImage(comp, v.image, v.autoScale);
				comp.setChildIndex(comp.backgroupImage, 0);
			}
			//进度条
			if(comp.thumb == null){
				comp.thumb = this._createImage(comp, v.thumbImage, v.bScaleThumb);
			}
		}else if(component instanceof eui.ToggleButton){

			let skinName = component.skinName;
			if(skinName == null){
				let toggleSkin = new eui.Skin;
				//底图
				let t = new eui.Image;
				t.percentHeight = 100;
				t.percentWidth = 100;
				t.source = v.image;
				toggleSkin["_Image1"] = t;

				//文本
				var l = new eui.Label();
				l.textColor
				toggleSkin["labelDisplay"] = l;
				l.horizontalCenter = 0;
				l.verticalCenter = 0;

				toggleSkin.elementsContent = [t, l]
				toggleSkin.skinParts = ["labelDisplay"]

				let fontColor = checkNull(v.color, gui.Color.black)
				let fontColorDown = checkNull(v.color_down, fontColor)

				toggleSkin.states =  [
					new eui.State ("up",
						[
							new eui.SetProperty("_Image1","source",v.image),
							new eui.SetProperty("labelDisplay","textColor",fontColor)
						])
					,
					new eui.State ("down",
						[
							new eui.SetProperty("_Image1","source",v.image_down),
							new eui.SetProperty("labelDisplay","textColor",fontColorDown)
						])
					,
					new eui.State ("disabled",
						[
						])
				];
				component.skinName = toggleSkin;
			}


		}
		////设置进度条
		//else if(component instanceof eui.ToggleButton){
		//	let comp = <eui.ToggleButton>component;
		//	comp.
		//	//背景
		//	if(comp.backgroupImage == null){
		//		comp.backgroupImage = this._createImage(comp, v.image, v.autoScale);
		//		comp.setChildIndex(comp.backgroupImage, 0);
		//	}
		//	//进度条
		//	if(comp.thumb == null){
		//		comp.thumb = this._createImage(comp, v.thumbImage, v.bScaleThumb);
		//	}
		//}		
	}


	private static _initComponentTextCns(component:eui.Component, v:any){

		if(component == null)
			return;

		if(component["_init_cns_"] == true)
			return
		component["_init_cns_"] = true;

		if(component instanceof eui.Button){
			var comp = <eui.Button>(component);
			if(comp.labelDisplay != null){
				let text = comp.labelDisplay.text
				comp.labelDisplay.text = this.getCnsText(text)
			}
		}else if(component instanceof eui.TextInput){
			component.prompt = this.getCnsText(component.prompt)
		
		}else if(component instanceof eui.EditableText){
			component.prompt = this.getCnsText(component.prompt)
		}
		
		if(component instanceof egret.TextField){
			component.text = this.getCnsText(component.text)
		}
	}

	private static _initComponentText(component:eui.Component, v:any){

		if(component == null)
			return;

		if(component instanceof eui.Button){
			var comp = <eui.Button>(component);

			if(comp.labelDisplay == null){
				comp.labelDisplay = this._createLabel(comp);
			}
			
			this._initComponentText(<any>comp.labelDisplay, v);

		}else if(component instanceof eui.TextInput){
			this._initComponentText(<any>component.textDisplay, v);
			this._setComponetProperty(component, v, "prompt");
		
		}else if(component instanceof eui.EditableText){
			this._setComponetProperty(component, v, "prompt");

		}else if(component instanceof gui.ProgressBar){
			let comp = <gui.ProgressBar>component;

			if(comp.labelDisplay == null && v.font != null && v.title != null){
				comp.labelDisplay = this._createLabel(comp);
				this._initComponentText(<any>comp.labelDisplay, v);
			}
		}
		
		if(component instanceof egret.TextField){
			//fontname
			if(v.font){
				IGlobal.fontSet.updateTextField(v.font, <any>component);
			}
			//var text:egret.TextField = component;
			this._setComponetProperty2(component, v, "textColor", "color");
			this._setComponetProperty2(component, v, "text", "title");

		}
	}

	
	private static _initComponentMix(component:eui.Component, v:any, elemlist){
		//杂七杂八的初始化
		if(component instanceof eui.RadioButton){
			//设置groupName
			this._setComponetProperty(component, v, "groupName");
			
			//设置group
			this._setComponetProperty(component, v, "group");

			//设置value
			this._setComponetProperty(component, v, "value");

			//true:鼠标移动状态下不响应
			this._setComponetProperty(component, v, "shortSelected");
		}

		if(component instanceof eui.Rect){
			this._setComponetProperty2(component, v, "fillColor", "color");
			this._setComponetProperty2(component, v, "fillAlpha", "alpha");
		}


		if(component instanceof eui.Scroller){

			if(v.viewport && elemlist[v.viewport]){
				component.viewport = elemlist[v.viewport]
			}
		}
	}


	private static _initComponent(component:eui.Component, v:any, elemlist:any, thisObj:any, parentComponent_?:any){
			if(v.w == 0)
				v.w = NaN;
			if(v.h == 0)
				v.h = NaN;

			if (v.name) {
				if (v.preFixName) {
					v.name = checkNull(v.preFixName, "") + v.name
				}
			}

			//设置名字
			this._setComponetProperty(component, v, "name");

			//this._initDefaultSkin(component);

			//初始化图片
			this._initComponentImage(component, v);

			//初始化位置尺寸
			this._initComponentPosAndSize(component, v);

			//初始化字体信息
			this._initComponentTextCns(component, v);//cns
			this._initComponentText(component, v);

			//控件相关的初始化
			this._initComponentMix(component, v, elemlist);

			//事件
			if(v.event_name && v.fun_index){
				component.addEventListener(v.event_name, v.fun_index, thisObj);
			}

			//触摸自己
			this._setComponetProperty(component, v, "touchEnabled");

			//触摸子节点
			this._setComponetProperty(component, v, "touchChildren");

			this._setComponetProperty(component, v, "enabled");

			if(v.messageFlag){
				component.touchEnabled = false;
				component.touchChildren = false;
			}

			this._setComponetProperty(component, v, "visible");
			
			//父节点（通过布局文件初始化的，parentComponent_为null）
			//if(parentComponent_){
			var parent = elemlist[v.parent] != null ? elemlist[v.parent] : parentComponent_;
			if(parent != null){
				if(parent.addChild ){
					parent.addChild(component)
				}else{
					//某些parent（例如eui.Image）没有addChild接口，为了布局方便，以parent的x,y去对位
					let offx = v.x || 0
					let offy = v.y || 0
					if( parent.x != null && parent.y != null){
						this.setXY(component, offx + parent.x, offy + parent.y)
						parent.parent.addChild(component)
						// if(parent.parent == parentComponent_){
						// 	this.setXY(component, v.x + parent.x, v.y + parent.y)
						// }else{
						// 	//如果不是一个坐标系，则先转换到 parentComponent_坐标系下
						// 	let rect:egret.Rectangle = parent.getTransformedBounds(parentComponent_);
						// 	this.setXY(component, v.x + rect.x, v.y + rect.y)
						// }
						// parentComponent_.addChild(component)
					}
				}
			}
			//}

			elemlist[v.name] = component;
	}

	private static createComponent(classDefinition:any):any{
		TLog.Assert(classDefinition != null, "UiUtil.createComponent");
		return new classDefinition;
	}


	public static createElem(infolist:any[], layerNode:eui.UIComponent, elemlist:any, thisObj:any, parent?:any):void{
		var parentComponent = parent? parent : layerNode;

		infolist.forEach(v=>{
			//var component = layerNode.getComponent(v.name); 
			var component = this.createComponent(v.index_type);
			TLog.Assert(component != null, "UiUtil.createElem");
			this._initComponent(component, v, elemlist, thisObj, parentComponent);

		});
	}

	public static initElem(infolist:any[], layerNode:eui.Component, elemlist:any, thisObj:any):void{

		infolist.forEach(v=>{
			var component = layerNode[v.name]; 
			if (component == null){
				TLog.Debug("initElem component error",v.name)
			}
			TLog.Assert(component != null, "UiUtil.initElem");
			if(component != null)
				this._initComponent(component, v, elemlist, thisObj);
		});

	}


	public static initElemWithComponent(layerNode:eui.Component, elemlist:any, thisObj:any, preFixName?:string):void{
		let skin = layerNode.skin;
		if(skin){
			var elemInfo:any[] =[]
			for(let name of skin.skinParts){
				elemInfo.push({ ["name"]: name, ["event_name"]: null, ["fun_index"]: null, ["preFixName"]: preFixName, })
			}
			UiUtil.initElem(elemInfo, layerNode, elemlist, this);
				
			for(let name of skin.skinParts){
				if (layerNode[name] && preFixName) {
					layerNode[preFixName + name] = layerNode[name]
					layerNode[name] = null
				}
			}
		}
	}

	public static initElemWithSkinPath(name:string, mLayoutPath:string, layerNode:eui.Component, elemlist:any, thisObj:any, mParentGroup?:any):void{
		var elemInfo = [
			{ ["index_type"] : eui.Component,		["name"]: name, ["image"]: "", ["skinName"]: mLayoutPath, },

		];
		UiUtil.createElem(elemInfo, layerNode, elemlist, thisObj, mParentGroup);
		UiUtil.initElemWithComponent(elemlist[name], elemlist, thisObj, name)
	}

	//调试用的
	public static forTestDrawBg(component, color?){

		if(color == null){
			color = gui.Color.green;
		}

		var rect = new eui.Rect;
		rect.percentWidth = 100
		rect.percentHeight = 100;
		
		rect.fillColor = color;
		rect.fillAlpha = 0.2;
		component.addChild(rect);

		rect.touchEnabled = false;

	}

	public static updateProgress(p:any, curVal:number, maxVal:number, labelFunction?: (value: number, maximum: number) => string, animTime?:number){
		if(curVal == null || maxVal == null)
			return;

		TLog.Assert(!isNaN(curVal) && !isNaN(maxVal))

		if(maxVal <= 0 )
			return;

		let progress =  CastType<eui.ProgressBar>(p);
		progress.slideDuration = checkNull(animTime, 0); //设置动画时间
		progress.minimum = 0;
		progress.maximum = maxVal;
		progress.value = curVal;
		progress.labelFunction = labelFunction;
		
	}


	public static setXY(w:egret.DisplayObject, x:number, y:number){
		w.x = x;
		w.y = y;
	}

	public static setWH(w:egret.DisplayObject, width:number, height:number){
		w.width = width;
		w.height = height;
	}

	public static setFrameSize(w:egret.DisplayObject, width:number, height:number, x:number, y:number){
		w.x = x;
		w.y = y;
		w.width = width;
		w.height = height;
	}

	public static moveToFront( w:egret.DisplayObject ){
		let parent = w.parent;
		if(parent){
			parent.addChildAt(w, -1);
		}
	}

	public static moveToBack( w:egret.DisplayObject ){
		let parent = w.parent;
		if(parent){
			parent.addChildAt(w, 0);
		}
	}

	public static setLayerIndex(child:egret.DisplayObject, index?:number){
		if(child.parent == null)
			return;
		
		if(index == null){
			index = -1
		}

		child.parent.setChildIndex(child, index);
	}


	//注册点击控件外的响应
	private static touchOutListenerList:any[] = [];
	public static registerTouchOutsideEvent(callback:Function, thisObj:any, excludeList:egret.DisplayObjectContainer[], testRect :boolean= false, delayHandler:boolean = false){
		
		for(let i = 0; i < this.touchOutListenerList.length; i++){
			let info = this.touchOutListenerList[i]
			if(info.callback == callback && info.obj == thisObj){
				TLog.Throw("registerTouchOutsideEvent error")
				return
			}
		}

		let onMouseDown = function(args: GameTouchEvent){
			let isExclude = false;
			if(testRect){
				let stageX = args.touchEvent.stageX
				let stageY = args.touchEvent.stageY
				isExclude = UiUtil.isExcludeChildWithRect(stageX, stageY, excludeList)
			}else{
				let target = args.touchEvent.target;
				isExclude =UiUtil.isExcludeChild(target, excludeList)
			}
			if(isExclude){
				if(delayHandler){
					egret.callLater(callback, thisObj, args)
				}else{
					callback.call(thisObj, args)
				}
			}
		}
		RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, onMouseDown, this)

		let info:any = {}
		info.callback = callback;
		info.obj = thisObj
		info.realCallback = onMouseDown
		this.touchOutListenerList.push(info)
	}
	//注销点击控件外的响应
	public static unRegisterTouchOutsideEvent(callback:Function, thisObj:any){

		for(let i = 0; i < this.touchOutListenerList.length; i++){
			let info = this.touchOutListenerList[i]
			if(info.callback == callback && info.obj == thisObj){
				UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, info.realCallback, this)
				this.touchOutListenerList.splice(i, 1)
				break;
			}
		}

	}


	//列表中不包含child，则返回true
	public static isExcludeChild(child, parentList:egret.DisplayObjectContainer[]){
		for(let p of parentList){
			if(p && p.contains(child))	
				return false;
		}
		return true;
	}

	//列表中不包含child，则返回true（检查的是区域）
	public static isExcludeChildWithRect(stageX:number, stageY:number, parentList:egret.DisplayObjectContainer[]){
		for(let p of parentList){
			if( core.EgretUtil.hitTestRect(p, stageX, stageY) ){
				return false;
			}
		}
		return true;
	}


	public static setVisible(node, visible:boolean, include?:boolean){
		node.visible = visible
		if(include != null){
			node.includeInLayout = include
		}
	}


	public static createGroup(name, w, h, parent){
		let group = new eui.Group;
		group.name = name;
		group.width = w;
		group.height = h;

		if(parent){
			parent.addChild(group)
		}

		return group;
	}

	//灰化按钮，但是还可以点击
	public static grayComponent(component: eui.UIComponent, bGray: boolean){
		gui.GrayComponent(component, bGray)
	}


	public static getListDataSouce(list:eui.List){
		if(list.dataProvider == null)
			return [];

		let arrayColletion = <eui.ArrayCollection>list.dataProvider
		return arrayColletion.source
	}

	public static updateList(list:eui.List, datalist:any[], reset?:boolean){
		reset = !!reset;

		if(list.dataProvider == null){
			list.dataProvider = new eui.ArrayCollection(datalist);
		}

		let arrayColletion = <eui.ArrayCollection>list.dataProvider
		if(datalist.length == 0 || reset == true){
			arrayColletion.source = datalist;
		}else{
			arrayColletion.removeAll()
			arrayColletion.replaceAll(datalist)
		}
		
		if (list.layout instanceof eui.VerticalLayout) {
			list.layout.paddingTop = 3
		} 
		
		if (list.layout instanceof eui.HorizontalLayout) {
			list.layout.paddingLeft = 3
		}
	}


	//垂直滚动
	public static updateScrollerV(scroller:eui.Scroller, pos:number){
		let viewport:eui.Group = <eui.Group>scroller.viewport
		if(viewport == null)
			return;
		viewport.validateNow();
		
		if(pos < 0){
			viewport.scrollV = viewport.contentHeight - scroller.height;
			if(viewport.scrollV < 0)
				viewport.scrollV = 0;
		}else{
			viewport.scrollV = pos;
		}
	}

	//水平滚动
	public static updateScrollerH(scroller:eui.Scroller, pos:number){
		let viewport:eui.Group = <eui.Group>scroller.viewport
		if(viewport == null)
			return;
		viewport.validateNow();
		
		if(pos < 0){
			viewport.scrollH = viewport.contentWidth - scroller.width;
			if(viewport.scrollH < 0)
				viewport.scrollH = 0;
		}else{
			viewport.scrollH = pos;
		}
	}


	public static removeFromParent(obj:egret.DisplayObject){
		if(obj && obj.parent){
			obj.parent.removeChild(obj)
		}
	}

}