// TypeScript file
/*
作者:
	lqx

创建时间：
	2017.03.17(星期五)

意图：
	空提示

公共接口：

*/

class UIEmptyView extends TClass {
	mLayoutNode: gui.LayoutNode;
	mParent: BaseWnd;
	mElemList: any;
	maxRow: number;
	x: number;
	y: number;
	visible: boolean;
	scale:number
	public initObj(...args: any[]): void {
		this.mLayoutNode = args[0]
		this.x = args[1] || 0
		this.y = args[2] || 0
		this.mParent = args[3] || null

		let scale = args[4] || 1
		this.scale = scale

		this.mElemList = {};
		this.visible = false;
		var elemInfo = [
		{ ["index_type"]: eui.Image, ["name"]: "Empty_Bg", ["image"]: "", ["x"]: this.x, ["y"]: this.y, ["w"]: 416 * scale, ["h"]: 421* scale, ["touchEnabled"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "Rd_Empty_Talk", ["x"]: this.x + 36* scale, ["y"]: this.y + 26* scale, ["w"]: 340* scale, ["h"]: 80* scale, ["touchEnabled"]: true },
		]
		UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this.mParent)
		let rd = this.mElemList["Rd_Empty_Talk"]
		rd.setAlignFlag(gui.Flag.H_CENTER)
		//this.setDescText()
		//this.rootWnd.SetVisible(false)
	}

	destory() {

	}

	//-设置文本//////////////////////////////////////////////////////////
	setDescText(_text, _font?, _color?) {
		let text = _text || Localize_cns("EMPTY_DEFAULT_TEXT")
		let font = _font || "ht_24_lc"
		let color = _color || "ublack"
		AddRdContent(this.mElemList["Rd_Empty_Talk"], text, font, color, 2)

		//let rd = this.mElemList["Rd_Empty_Talk"]
		//rd.SetXY(36, 66-rd.GetAllRowHeight()/2)
		//rd.setAlignFlag(Core.Flag.H_CENTER)
	}

	setVisible(b) {
		this.mElemList["Empty_Bg"].visible = b
		this.mElemList["Rd_Empty_Talk"].visible = b
	}

}