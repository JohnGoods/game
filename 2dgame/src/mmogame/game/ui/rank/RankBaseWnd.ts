module itemRender {
	export class RankItem extends eui.ItemRenderer {
		mElemList;
		constructor() {
			super()
			this.mElemList = {}
			

			let Info = [
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["image"]: "ty_uiDi04", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 410, ["h"]: 85, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

                { ["index_type"]: eui.Image, ["name"]: "rankbg", ["image"]: "bh_textDi01", ["color"]: gui.Color.white, ["x"]: 15, ["y"]: 15,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Label, ["name"]: "rankTitle", ["parent"]: "rankbg",  ["title"]:"", ["font"]:"ht_24_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 50, ["h"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

                { ["index_type"]: eui.Group, ["name"]: "group_petbox", ["image"]: "ty_uiDi04", ["color"]: gui.Color.white, ["x"]: 60, ["y"]: -10, ["w"]: 80, ["h"]: 80, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                // { ["index_type"]: eui.Image, ["name"]: "vipbg", ["image"]: "ty_textDi05", ["color"]: gui.Color.white, ["x"]: 70, ["y"]: 60, ["w"]: 85, ["h"]: 35,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                // { ["index_type"]: eui.Image, ["name"]: "vipIcon", ["image"]: "vipLv01", ["parent"]: "vipbg", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

                { ["index_type"]: gui.Grid9Image, ["name"]: "plrBg", ["image"]: "phb_textDi", ["color"]: gui.Color.white, ["x"]: 160, ["y"]: 10, ["w"]: 140, ["h"]: 65, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Label, ["name"]: "nameTitle",  ["parent"]: "plrBg", ["title"]:"", ["font"]:"ht_22_lc", ["color"]: gui.Color.ublack, ["x"]: 5, ["y"]: 5, ["w"]: 130, ["h"]: 25, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Label, ["name"]: "forceTitle",  ["parent"]: "plrBg", ["title"]:"", ["font"]:"ht_22_lc", ["color"]: gui.Color.zongse, ["x"]: 5, ["y"]: 35, ["w"]: 150, ["h"]: 25, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

                { ["index_type"]: eui.Image, ["name"]: "extrabg", ["image"]: "phb_textDi02", ["color"]: gui.Color.white, ["x"]: 300, ["y"]: 10,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "extraRd", ["parent"]: "extrabg", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 10, ["w"]: 90, ["h"]: 50,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                
				
			]
			UiUtil.createElem(Info, this, this.mElemList, this)

			this.mElemList["petIcon"] = UIPetBox.newObj(this, "petIcon", 0, 0, this.mElemList["group_petbox"], 0.7)

             this.mElemList["extraRd"].setAlignFlag(gui.Flag.CENTER_CENTER)
		}

		protected dataChanged(): void {
			let wrapData = this.data
            let data = wrapData.data


            if(wrapData.index == 1){
                this.mElemList["bg"].source = "ty_uiDi04"
            }else{
                this.mElemList["bg"].source = "ty_uiDi03"
            }

            //plrLevel, force, plrId, vipLevel,  plrName, plrVocation, plrSex
            this.mElemList["rankTitle"].text = wrapData.index

            // this.mElemList["vipIcon"].source = GetVipIcon(data[3])

            this.mElemList["nameTitle"].text = data[4]//名字
            this.mElemList["forceTitle"].text = String.format(Localize_cns("RANK_TXT3"), MakeLongNumberShort(data[1]))//战力

            this.mElemList["petIcon"].updateRoleInfo(data[5], data[6], data[2])

            //自定义更新
            wrapData.listener.onItemExtraUpdate(data, this.mElemList)
		}
	}
}


class RankBaseWnd extends BaseCtrlWnd {
	mElemList;
	Player: Player;
	rankType:number;

	public initObj(...params: any[]) {
		this.rankType = params[2]
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.getUpdateData, this)
		RegisterEvent(EventDefine.ACTIVITY_RANK_APPEARDATA_UPDATE, this.refreshAppearData, this)
		this.sendRankRequire()

		//测试
		// let list = []
		// list.push([30, GetHeroProperty("force"), GetHeroProperty("id"), 1, GetHeroProperty("name"), GetHeroProperty("vocation"), GetHeroProperty("sexId")])
		// for(let i = 0; i < 40; i++){
		// 	list.push([30, 88888888, 1+i, 8, "玩家aaa"+i, 10001, 1])
		// }

		// let appearInfo:any = {}
		// appearInfo.vocation = GetHeroProperty("vocation")
		// appearInfo.sexId = GetHeroProperty("sexId")
		// appearInfo.heroShapeId = 0
		// appearInfo.rideShapeId = 15001
		// appearInfo.weaponShapeId = 0
		// appearInfo.wingShapeId = 0
		// appearInfo.petShapeId = 0
		// appearInfo.tianxianShapeId = 0
		// this.onRefresh(list, appearInfo)

	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.getUpdateData, this)
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_APPEARDATA_UPDATE, this.refreshAppearData, this)
		let actorView:UIActorView = this.mElemList["actorview"]
		actorView.clearView()

		actorView = this.mElemList["actorview2"]
		actorView.clearView()

		if(this.Player){
			let playerView = this.mElemList["player_view"]
			this.Player.leaveViewer(playerView)
			this.Player.deleteObj()
			this.Player = null
		}
	}

	getUpdateData(args) {
		let getType = args.ranktype
		let getList = args.ranklist
		let appearData = args.firstAppearData

		//刷新
		if (getType == this.rankType) {
			this.onRefresh(getList, appearData)
		}
	}

	refreshAppearData(args){
		let getType = args.ranktype
		let appearData = args.appearData

		if(appearData == null || size_t(appearData[0]) == 0){
			let actorView:UIActorView = this.mElemList["actorview"]
			actorView.clearView()
			if(this.Player){
				let playerView = this.mElemList["player_view"]
				this.Player.leaveViewer(playerView)
				this.Player.deleteObj()
				this.Player = null
			}
		}else{
			this.onAppearUpdate(appearData[0])
			// this.onPlayerUpdate(appearData)
		}
	}

	onRefresh(getList, appearData) {
		let list = []
		for (let i in getList) {
			let data = getList[i]
			let t: any = {}
			t.index = Number(i) + 1
			t.data = data
			t.listener = this; //需要有onListItemUpdate
			JsUtil.arrayInstert(list, t)
		}

		let listbox: eui.List = this.mElemList["list_rank"]
		UiUtil.updateList(listbox, list);

		this.updateMyRank(getList)
		
		this.mElemList["xianwei_icon"].visible = false	
	}

	updateMyRank(list) {
		let myId = GetHeroProperty("id")
		this.mElemList["my_rank"].text = (Localize_cns("RANK_TXT1"))

		for (let i in list) {
			let v = list[i]

			let roleId = v[2]
			if (roleId == myId) {
				this.mElemList["my_rank"].text = String.format(Localize_cns("RANK_TXT2"), Number(i) + 1)
				break
			}
		}

		//this.mElemList["my_rank"].visible = (true)
	}

	//发送协议获取排行数据
	sendRankRequire() {
		RpcProxy.call("C2G_RoleRank", this.rankType,1)
		// let message = GetMessage(opCodes.C2G_ROLE_RANK)
		// message.rankType = this.rankType
		// message.index = 1
		// SendGameMessage(message)
	}




	////////////////////////////////////////////////////////////////////////////////////////////

	//重载
	onItemExtraUpdate(data, mElemList) {
		let str =  String.format(Localize_cns("RANK_TXT5"), data[0])
         AddRdContent(mElemList["extraRd"], str, "ht_24_cc_stroke", "lime")
	}

	//外观更新
	onAppearUpdate(appearInfo) {
		if(appearInfo == null)
			return;
		let actorView:UIActorView = this.mElemList["actorview"]	
		actorView.updateByPlayerAppearInfo(appearInfo)
		actorView.setXY(0,0)
		
		let actorView2:UIActorView = this.mElemList["actorview2"]	
		let model = GetShapeModelId(appearInfo.tianxianShapeId)
		actorView2.updateByPlayer(model)	
	}

	//外观更新2
	onPlayerUpdate(playerInfo) {
		if(playerInfo == null)
			return;
		// let actorview = this.mElemList["player_view"]
		// let actor = this.Player || Player.newObj()
		// let modeID = GetPetModel(20025)
		// actor.loadModel(modeID)
		// actor.changeAction("idle", 1.0, true);
		// actor.setPositionXY(0, 70)
		// actor.enterViewer(actorview)
	}

	
}
