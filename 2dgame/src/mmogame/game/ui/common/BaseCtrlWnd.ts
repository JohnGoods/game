/*
	用于内嵌控件的window基类

	class TemplateWnd extends BaseCtrlWnd{
		public initObj(...params:any[]):void{
		}
		public onLoad():void{
		}
		public onUnLoad():void{
		}
		public onShow():void{
		}
		public onHide():void{
		}
	}
}
*/


//控件内的loadWnd，不能用layoutPath

class BaseCtrlWnd extends TClass{

	mbLoad:boolean;
	mVisible:boolean;

	mLayoutNode:gui.LayoutNode;
	mElemList:any;
	mParentWnd:any;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
		this.mVisible = false;
		this.mbLoad = false;
		this.mLayoutNode = params[0];
		this.mParentWnd = params[1];
    }
    //子类复写 析构函数
    protected destory(): void{
       
		this.unLoadWnd();
    }

	public onLoad():void{
		
	}

	public onUnLoad():void{

	}

	public onShow():void{
		
	}

	public onHide():void{
		
	}

	loadWnd(){
		if(this.mbLoad == false){
			this.mbLoad = true
			this.mElemList = {};
			this.onLoad()
		}
	}

	unLoadWnd(){
		 this.hideWnd();
		if(this.mbLoad){
			this.mbLoad = false
			this.onUnLoad()
			this.mElemList = null;
		}
	}

	showWnd(){
		this.loadWnd();

		if(this.mVisible == false){
			this.mVisible = true
			this.loadWnd()
			this.onShow()

			FireEvent(EventDefine.UI_CTRL_SHOW, UIShowEvent.newObj(this))
		}
	}

	hideWnd(){
		if(this.mbLoad && this.isVisible()){
			this.mVisible = false
			this.onHide()
			FireEvent(EventDefine.UI_CTRL_HIDE, UIShowEvent.newObj(this))
		}
	}

	isVisible():boolean{
		return this.mVisible
	}

}