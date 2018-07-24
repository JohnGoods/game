class StrongholdInfoFrame extends BaseWnd {

	public initObj(...params: any[]) {

	}

	public onLoad(): void {
		this.mLayoutNode.percentWidth = 100
		this.mLayoutNode.percentHeight = 100
		this.mLayoutNode.touchChildren = true
		this.mLayoutNode.touchEnabled = false

		let info: any = [
			{ ["index_type"]: eui.Image, ["name"]: "snameBg", ["image"]: "pf_kuangMingDi", ["horizontalCenter"]: -54, ["bottom"]: 43, ["w"]: 31, ["h"]: 89, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "sname", ["horizontalCenter"]: -51, ["bottom"]: 47, ["w"]: 23, ["h"]: 81, ["messageFlag"]: true },
			{ ["index_type"]: eui.Image, ["name"]: "occupying", ["image"]: "pf_zhanLingZhong", ["horizontalCenter"]: 0, ["bottom"]: 20, ["w"]: 105, ["h"]: 34, ["messageFlag"]: true },

			{ ["index_type"]: eui.Group, ["name"]: "occupyNumGroup", ["horizontalCenter"]: 0, ["bottom"]: -15, ["w"]: 110, ["h"]: 30, ["messageFlag"]: true },
			{ ["index_type"]: gui.Grid9Image, ["name"]: "occupyNumBg", ["parent"]: "occupyNumGroup", ["image"]: "ty_textDi01", ["horizontalCenter"]: 0, ["y"]: 0, ["w"]: 110, ["h"]: 30, ["messageFlag"]: true },
			//{ ["index_type"]: gui.RichDisplayer, ["name"]: "occupyNum", ["parent"]: "occupyNumGroup", ["horizontalCenter"]: 0, ["y"]: 3, ["w"]: 200, ["h"]: 24, ["messageFlag"]: true },
			{ ["index_type"]: eui.Label, ["name"]: "occupyNum", ["parent"]: "occupyNumGroup", ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 3, ["w"]: 110, ["h"]: 24, ["messageFlag"]: true }
		]
		UiUtil.createElem(info, this.mLayoutNode, this.mElemList, this)

		//全部默认隐藏
		this.onReset()

		if (TEST_UI_RECT) {
			UiUtil.forTestDrawBg(this.mLayoutNode)
		}
	}
	

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true
	}

	public onHide(): void {
		this.mLayoutNode.visible = false
	}

	onReset(){
		for (let i in this.mElemList) {
			let v = this.mElemList[i]
			v.visible = false
		}
		//this.mElemList["occupyNum"].setAlignFlag(gui.Flag.CENTER_CENTER)
	}

	setStrongholdName(name) {
		if (!name || name == "") {
			this.mElemList["snameBg"].visible = false
			this.mElemList["sname"].visible = false
		} else {
			this.mElemList["snameBg"].visible = true
			this.mElemList["sname"].visible = true
			AddRdContent(this.mElemList["sname"], name, "ht_18_cc", "white")
		}
	}

	setStrongholdState(isOccupying: boolean) {
		this.mElemList["occupying"].visible = isOccupying
	}

	setStrongholdOccupyNum(curNum: number, maxNum: number) {
		if (maxNum > 0) {
			this.mElemList["occupyNumGroup"].visible = true
			this.mElemList["occupyNumBg"].visible = true
			this.mElemList["occupyNum"].visible = true
		} else {
			this.mElemList["occupyNumGroup"].visible = false
			return
		}

		this.mElemList["occupyNum"].text = Localize_cns("STRONGHOLD_TEXT53") + curNum + "/" + maxNum

		// let w = (maxNum > 5 ? 5 : maxNum) * 22 + 4//54
		// let bgh = Math.ceil(maxNum / 5) * 24 + 6
		// let rdh = Math.ceil(maxNum / 5) * 24
		// //UiUtil.setWH(this.mElemList["occupyNumGroup"], w, bgh)
		// UiUtil.setWH(this.mElemList["occupyNumBg"], w, bgh)
		// UiUtil.setWH(this.mElemList["occupyNum"], w, rdh)
		// //this.mElemList["occupyNumBg"].width = this.mElemList["occupyNum"].width = w
		// let str = ""//Localize_cns("STRONGHOLD_TEXT9")
		// for (let i = 1; i <= maxNum; i++) {
		// 	if (i <= curNum) {
		// 		str += "#JUDIAN_ZL_ICON2"
		// 	} else {
		// 		str += "#JUDIAN_ZL_ICON1"
		// 	}
		// 	if (i % 5 == 0 && i != maxNum) {
		// 		str += "#br"
		// 	}
		// }
		// AddRdContent(this.mElemList["occupyNum"], str, "ht_20_cc_stroke", "white")
	}

}