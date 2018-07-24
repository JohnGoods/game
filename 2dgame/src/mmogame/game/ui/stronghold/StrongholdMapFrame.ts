// TypeScript file

class StrongholdMapFrame extends BaseWnd {
	thumbnailW: number
	thumbnailH: number
	actorList: any

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/stronghold/StrongholdMapLayout.exml"]
		this.thumbnailW = 1536
		this.thumbnailH = 918//918 + 21 + 21 963
		this.actorList = {}
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0]
		this.initSkinElemList()
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.initMapThumbnail()
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.STRONGHOLD_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true
		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.STRONGHOLD_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false
		for (let i in this.actorList) {
			let view: UIActorView = this.actorList[i]
			view.clearView()
		}
	}

	initMapThumbnail() {
		let mapId = MapSystem.getInstance().getMapId()
		let mapRef = MapSystem.getInstance().getMapRefProperty(mapId)
		if (mapRef == null) {
			return
		}
		let mapW = mapRef.W
		let mapH = mapRef.H

		let elemInfo = []
		for (let i in GameConfig.StrongholdConfig) {
			let v = GameConfig.StrongholdConfig[i]

			let mapXY = SceneManager.getInstance().cellXYtoMapXY(v.x, v.y)
			let x = mapXY.x / mapW * this.thumbnailW
			let y = mapXY.y / mapH * this.thumbnailH

			JsUtil.arrayInstert(elemInfo, { ["index_type"]: eui.Group, ["name"]: "actorGroup" + i, ["parent"]: "group_map", ["x"]: x - 40, ["y"]: y - 50, ["w"]: 80, ["h"]: 90, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickStronghold })
			JsUtil.arrayInstert(elemInfo, { ["index_type"]: eui.Image, ["name"]: "snameBg" + i, ["parent"]: "group_map", ["bAdapteWindow"]: true, ["image"]: "pf_kuangMingDi", ["x"]: x - 50, ["y"]: y - 30, ["w"]: 22, ["h"]: 68, ["messageFlag"]: true })
			JsUtil.arrayInstert(elemInfo, { ["index_type"]: gui.RichDisplayer, ["name"]: "sname" + i, ["parent"]: "group_map", ["x"]: x - 50, ["y"]: y - 30, ["w"]: 22, ["h"]: 68, ["messageFlag"]: true })

			JsUtil.arrayInstert(elemInfo, { ["index_type"]: eui.Image, ["name"]: "occupyingImg" + i, ["parent"]: "group_map", ["bAdapteWindow"]: true, ["image"]: "pf_zhanLingZhong", ["x"]: x - 36, ["y"]: y + 10, ["w"]: 74, ["h"]: 24, ["messageFlag"]: true })

			JsUtil.arrayInstert(elemInfo, { ["index_type"]: eui.Group, ["name"]: "numGroup" + i, ["parent"]: "group_map", ["x"]: x - 45, ["y"]: y + 40, ["w"]: 90, ["h"]: 24, ["messageFlag"]: true })
			JsUtil.arrayInstert(elemInfo, { ["index_type"]: gui.Grid9Image, ["name"]: "numBg" + i, ["parent"]: "numGroup" + i, ["image"]: "ty_textDi01", ["x"]: 0, ["y"]: 0, ["w"]: 90, ["h"]: 24, ["messageFlag"]: true })
			JsUtil.arrayInstert(elemInfo, { ["index_type"]: eui.Label, ["name"]: "numText" + i, ["parent"]: "numGroup" + i, ["title"]: "", ["font"]: "ht_16_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 90, ["h"]: 24, ["messageFlag"]: true })
		}
		UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		for (let i in GameConfig.StrongholdConfig) {
			let v = GameConfig.StrongholdConfig[i]

			this.actorList[i] = UIActorView.newObj(this.mLayoutNode, "actorView" + i, 40, 90, this.mElemList["actorGroup" + i])
			this.actorList[i].setActorScale(0.48)
			let modelId = GameConfig.npcConfig[v.npcEntryId].model
			this.actorList[i].updateByPlayer(modelId)

			this.mElemList["sname" + i].setAlignFlag(gui.Flag.CENTER_CENTER)
			AddRdContent(this.mElemList["sname" + i], v.name, "ht_16_cc", "white")
			this.mElemList["occupyingImg" + i].visible = false
			this.mElemList["numText" + i].text = Localize_cns("STRONGHOLD_TEXT53") + "0/" + v.occuCount
			//UiUtil.forTestDrawBg(this.mElemList["actorGroup" + i])
		}
	}

	refreshFrame() {
		let list = GetActivity(ActivityDefine.Stronghold).getStrongholdInfoList()
		for (let index in list) {
			let info = list[index]

			this.mElemList["occupyingImg" + index].visible = (info[2] == 1)

			let curNum = info[1]
			let maxNum = GameConfig.StrongholdConfig[index].occuCount
			this.mElemList["numText" + index].text = Localize_cns("STRONGHOLD_TEXT53") + curNum + "/" + maxNum
		}
	}

	onClickStronghold(args: egret.Event) {
		let index = args.target.name.replace(/\D/ig, "")

		let npcId = GetActivity(ActivityDefine.Stronghold).getNpcIdByIndex(index)
		if (npcId) {
			let mapId = MapSystem.getInstance().getMapId()
			let cellX = GameConfig.StrongholdConfig[index].x
			let cellY = GameConfig.StrongholdConfig[index].y
			let npcEntryId = GameConfig.StrongholdConfig[index].npcEntryId

			Command_FindWayToTalkNpc(mapId, cellX, cellY, 3, npcEntryId, npcId)
			this.hideWnd()
		}

	}
}