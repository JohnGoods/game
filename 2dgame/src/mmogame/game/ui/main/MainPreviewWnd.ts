class MainPreviewWnd extends BaseCtrlWnd {
	controlDataList: any;

	public initObj(...params: any[]): void {
		this.controlDataList = {}
	}
	public onLoad(): void {
		this.createFrame()
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.GUIDE_FUNC_LIST_UPDATE, this.refreshFrame, this)

		RegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.refreshFrame, this)

		RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)

		//this.requestMeiri = false;
		this.mElemList["preview_wnd"].visible = true
		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.GUIDE_FUNC_LIST_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)

		this.mElemList["preview_wnd"].visible = false
		this.mElemList["preview_view"].clearView()
	}

	refreshFrame() {
		this.controlDataList = {}
		let list = []
		for (let _ in GameConfig.FuncPreviewConfig) {
			let v = GameConfig.FuncPreviewConfig[_]
			table_insert(list, v)
		}
		table_sort(list, function (a, b) { return a.funcIndex - b.funcIndex })

		let flag = false
		let config = null
		for (let i = 0; i < list.length; i++) {
			let v = list[i]
			if (GuideSystem.getInstance().isFuncOpen(v.funcName, true) == false) {				//未开启
				flag = true
				config = v
				break
			}
		}

		if (flag == false) {
			this.mElemList["preview_wnd"].visible = false
		} else {
			this.mElemList["preview_wnd"].visible = true

			this.mElemList["preview_name"].text = config.name

			let actorElem = <UIActorView>this.mElemList["preview_view"]
			actorElem.clearView()
			let modelID = config.monModelId

			this.mElemList["preview_anim_box"].visible = false

			if (modelID) {
				actorElem.setActorScale(config.scale)
				actorElem.setXY(config.pos[0][0] || 0, config.pos[0][1] || 0)

				let modelShape = ""
				let modelType = ""
				if (config.shape && size_t(config.shape) > 0) {
					modelType = config.shape[0][0]
					modelShape = config.shape[0][1]

					if (modelType == "role") {
						let playerInfo = GetHeroPropertyInfo()
						let modelList: any = {}
						modelList["vocation"] = playerInfo.vocation
						modelList["sexId"] = playerInfo.sexId
						modelList["rideShapeId"] = playerInfo.rideShapeId
						modelList["weaponShapeId"] = playerInfo.weaponShapeId
						modelList["wingShapeId"] = playerInfo.wingShapeId
						modelList[modelShape] = modelID

						actorElem.updateByPlayerAppearInfo(modelList)
					} else if (modelType == "xianlv") {
						let modelList: any = {}
						modelList[modelShape] = modelID

						let xlId = XianLvSystem.getInstance().getFirstFightId()
						actorElem.updateByXianLvAppearInfo(xlId, modelList)
					} else if (modelType == "pet") {
						let modelList: any = {}
						modelList[modelShape] = modelID

						let activeList = PetSystem.getInstance().getPetActiveList()
						actorElem.updateByPetAppearInfo(activeList[0], modelList)
					}
				} else {
					let actor = actorElem.updateByPlayer(modelID)
					actor.doCommand(ActorCommand.SetShadowVisible, false, null)
				}
			} else {
				actorElem.clearView()
				let info = IGlobal.animSet.getAnimInfo(config.effect)
				UiUtil.setWH(this.mElemList["preview_anim_box"], info.w, info.h)
				this.mElemList["preview_anim_box"].setAnimName(config.effect)
				this.mElemList["preview_anim_box"].visible = true
				UiUtil.setXY(this.mElemList["preview_anim_box"], config.pos[0][0] || 0, config.pos[0][1] || 0)
			}

			AddRdContent(this.mElemList["open_level"], config.conditionDes, "ht_20_cc_stroke", "white")

			this.controlDataList["preview_btn"] = config.funcName
		}
	}

	createFrame() {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "preview_anim_box", ["messageFlag"]: true },
			{ ["name"]: "preview_view_group", ["messageFlag"]: true },
			{ ["name"]: "open_level", ["messageFlag"]: true },
			{ ["name"]: "preview_name_pic", ["messageFlag"]: true },
			{ ["name"]: "preview_name", ["messageFlag"]: true },
			{ ["name"]: "preview_view_group", ["messageFlag"]: true },
			{ ["name"]: "preview_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPreview },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mElemList["preview_view"] = UIActorView.newObj(this.mLayoutNode, "preview_view", 0, 0, this.mElemList["preview_view_group"])
		//this.mElemList["preview_view"].updateByPlayer(20001)

		this.mElemList["open_level"].setAlignFlag(gui.Flag.CENTER_CENTER)

		this.mElemList["preview_anim_box"].visible = false
	}

	//////////////////////////////////////////////////
	onClickPreview(args) {
		let name = args.target.name
		if (!this.controlDataList[name]) {
			return
		}

		let funcIndex = this.controlDataList[name]
		let wnd = WngMrg.getInstance().getWindow("FuncPreviewFrame")
		wnd.showFuncPreviewFrame(funcIndex)
	}
}