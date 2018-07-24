// TypeScript file
/*
作者:
    
	
创建时间：
   

意图：
   宠物列表界面
公共接口：
   
*/

class PetListFrame extends BaseWnd {
	tabWndList: UITabWndList;
	tabIndex: number;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/pet/PetListLayout.exml"]

		this.tabIndex = -1
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

			{ ["name"]: "actor_wnd", ["messageFlag"]: true },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let tabInfoList = [
			{ name: "pet_btn1", wnd: PetPokedexWindow.newObj(this.mLayoutNode, this) },
			{ name: "pet_btn2", wnd: PetGodWindow.newObj(this.mLayoutNode, this) },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.tabWndList.setWndVisible(true);

	    this.tabWndList.changeTabWithIndex(0)
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
	}
}