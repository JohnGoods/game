
/////////////////////////////////////////////////////////
//战力榜
class RankPlrForcelWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	onItemExtraUpdate(data, mElemList) {
		let str =  String.format(Localize_cns("RANK_TXT4"), data[1])
        AddRdContent(mElemList["extraRd"], str, "ht_24_cc_stroke", "lime")

		mElemList["forceTitle"].text = String.format(Localize_cns("RANK_TXT3"), MakeLongNumberShort(data[0]))//战力
		// forceTitle
	}

	//外观更新
	// onAppearUpdate(appearInfo) {

	// }
}

/////////////////////////////////////////////////////////
//等级榜
class RankPlrLevelWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	onItemExtraUpdate(data, mElemList) {
		let str =  String.format(Localize_cns("RANK_TXT4"), data[0])
         AddRdContent(mElemList["extraRd"], str, "ht_24_cc_stroke", "lime")

		 mElemList["forceTitle"].text = String.format(Localize_cns("RANK_TXT3"), MakeLongNumberShort(data[1]))//战力
	}

	//外观更新
	// onAppearUpdate(appearInfo) {

	// }
}


/////////////////////////////////////////////////////////
//宠物战力榜
class RankPetWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	onItemExtraUpdate(data, mElemList) {
		let str =  String.format(Localize_cns("RANK_TXT4"), data[1])
        AddRdContent(mElemList["extraRd"], str, "ht_24_cc_stroke", "lime")

		mElemList["forceTitle"].text = String.format(Localize_cns("RANK_TXT3"), MakeLongNumberShort(data[0]))//战力
	}

	//外观更新
	onAppearUpdate(appearInfo) {
		let model = GetPetModel(appearInfo.petShapeId)
		let actorView:UIActorView = this.mElemList["actorview"]	
		actorView.updateByPlayer(model)
		actorView.setXY(0,0)
	}
}


/////////////////////////////////////////////////////////
//仙侣战力榜
class RankXianlvlWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}

	// //重载
	onItemExtraUpdate(data, mElemList) {
		let str =  String.format(Localize_cns("RANK_TXT4"), data[0])
        AddRdContent(mElemList["extraRd"], str, "ht_24_cc_stroke", "lime")
		mElemList["forceTitle"].text = String.format(Localize_cns("RANK_TXT3"), MakeLongNumberShort(data[1]))//战力
	}

	//外观更新
	onAppearUpdate(appearInfo) {
		let model = GetXianlvModel(appearInfo.xianlvShapeId)
		let actorView:UIActorView = this.mElemList["actorview"]	
		actorView.updateByPlayer(model)
		actorView.setXY(0,20)
	}
}


/////////////////////////////////////////////////////////
//坐骑榜
class RankRidelWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let effectId = GetShapeEffectId(appearInfo.rideShapeId)
		let actorView:UIActorView = this.mElemList["actorview"]	
		let effect:Effect = actorView.updateByEffect(effectId)
		effect.changeAction("idle")
		actorView.setXY(0,0)
	}
}


/////////////////////////////////////////////////////////
//翅膀榜
class RankWingWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	// onAppearUpdate(appearInfo) {

	// }
}


/////////////////////////////////////////////////////////
//天仙榜
class RankTianxianWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}

	//外观更新
	onAppearUpdate(appearInfo) {
		let model = GetShapeModelId(appearInfo.tianxianShapeId)
		let actorView:UIActorView = this.mElemList["actorview"]	
		actorView.updateByPlayer(model)
		actorView.setXY(0,60)
	}
}


/////////////////////////////////////////////////////////
//神兵榜
class RankImmortalsWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	// onAppearUpdate(appearInfo) {

	// }
}

/////////////////////////////////////////////////////////
//法阵榜
class RankFaZhenWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let actorView:UIActorView = this.mElemList["actorview"]	
		let effectId = GetShapeEffectId(appearInfo.xlFZShapeId)
		let effect:Effect = actorView.updateByEffect(effectId)
		effect.changeAction("idle")
		actorView.setXY(0,0)
	}
}

/////////////////////////////////////////////////////////
//仙位榜
class RankXianWeiWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let icon = GetShapeImage(appearInfo.xlXWShapeId)
		this.mElemList["xianwei_icon"].visible = true
		this.mElemList["xianwei_icon"].source = icon
	}
}

/////////////////////////////////////////////////////////
//通灵榜
class RankTongLingWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let actorView:UIActorView = this.mElemList["actorview"]	
		let effectId = GetShapeEffectId(appearInfo.petTLShapeId)
		let effect:Effect = actorView.updateByEffect(effectId)
		effect.changeAction("idle")
		actorView.setXY(0,0)
	}
}

/////////////////////////////////////////////////////////
//兽魂榜
class RankShouHunWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let actorView:UIActorView = this.mElemList["actorview"]	
		let effectId = GetShapeEffectId(appearInfo.petSHShapeId)
		let effect:Effect = actorView.updateByEffect(effectId)
		effect.changeAction("idle")
		actorView.setXY(20,60)
	}
}

/////////////////////////////////////////////////////////
//天女榜
class RankTianNvWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		// let effectId = GetShapeEffectId(appearInfo.tiannvShapeId)
		let actorView:UIActorView = this.mElemList["actorview"]	
		let tiannvShapeId = appearInfo.tiannvShapeId || 70001
		actorView.updateByPlayer(tiannvShapeId)
		actorView.setXY(0,40)
	}
}

/////////////////////////////////////////////////////////
//仙器榜
class RankXianQiWnd extends RankBaseWnd {
	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let actorView:UIActorView = this.mElemList["actorview"]	
		let tiannvShapeId = appearInfo.tiannvShapeId || 70001
		actorView.updateByPlayer(tiannvShapeId)
		actorView.setXY(0,40)
	}
}

/////////////////////////////////////////////////////////
//花辇榜
class RankHuaNianWnd extends RankBaseWnd {
	

	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let actorView:UIActorView = this.mElemList["actorview"]	
		let tiannvShapeId = appearInfo.tiannvShapeId || 70001
		actorView.updateByPlayer(tiannvShapeId)
		actorView.setXY(0,40)
	}
}

/////////////////////////////////////////////////////////
//灵气榜
class RankLingQigWnd extends RankBaseWnd {
	

	public initObj(...params: any[]) {

	}


	//重载
	// onItemExtraUpdate(data, mElemList) {

	// }

	//外观更新
	onAppearUpdate(appearInfo) {
		let actorView:UIActorView = this.mElemList["actorview"]	
		let tiannvShapeId = appearInfo.tiannvShapeId || 70001
		actorView.updateByPlayer(tiannvShapeId)
		actorView.setXY(0,40)
	}
}