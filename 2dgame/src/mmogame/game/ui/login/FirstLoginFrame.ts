class FirstLoginFrame extends BaseWnd {
	actorView : UIActorView
	moveTime
	closeFlag:boolean
	curEnableIndex
	curDisableIndex
	nodeList
	singleTicker

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/login/FirstLoginLayout.exml"];
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)
		var elemInfo = [
            { ["name"]: "play_game_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPlayAnimation },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_actorview"])
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.moveTime = 1.5 * 1000
		this.closeFlag = false
		this.curDisableIndex = 0
		this.curEnableIndex = 0
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.actorView.clearView()
		if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }

		for(let i =0;i<11;i++){
			let node = this.mElemList["node"+i]
			egret.Tween.removeTweens(node);
			if(node.parent){
				node.parent.removeChild(node)
			}
		}
	}

	onRefresh(){
		let model = GetPetModel(20001)
		let actorView:UIActorView = this.actorView	
		actorView.updateByPlayer(model)
		this.nodeList = []
		for(let i =0;i<11;i++){
			let node = this.mElemList["node"+i]
			node.visible = false
			table_insert(this.nodeList,node)
		}
	}

	onPlayAnimation(){
		RpcProxy.call("C2G_CREATE_ROLE_GIFTS")
		this.mLayoutNode.setDoModal(false)
		this.actorView.setVisible(false)
		this.actorView.clearView()
		this.mElemList["bg"].visible = false
		this.mElemList["play_game_btn"].visible = false	

		let tick = function (delay) {
            if (this.closeFlag == false) {
				let node = this.nodeList[this.curEnableIndex]
				if(this.curEnablaInde > size_t(this.nodeList)){	//防空
					this.autoHideTick()
				}
				if(node){
					node.visible = true
					let closeFlag = false
					if(this.curEnablaInde == 10){
						closeFlag = true
					}
					this.playAnim(node,closeFlag)
					this.curEnableIndex = this.curEnableIndex +1
				}	
            } else {
                 this.autoHideTick()
            }
        }
        this.singleTicker = SetTimer(tick, this, 100, true)
	}

	playAnim(node,flag){
		this.closeFlag = flag
		 //开始位置
        let startPos = null
        if(gui.GuiManager.getInstance().isRootNode(node.parent) == true){//移动过程中，父节点是rootNode
            startPos = new egret.Point(node.x, node.y)
        }else{
            startPos = core.EgretUtil.nodeToStageXY(node, 0, 0)
        }
        
        if(node.parent){
            node.parent.removeChild(node)
            gui.GuiManager.getInstance().setNodeLayer(node, gui.GuiLayer.Top);
        }

        egret.Tween.removeTweens(node);
		egret.Tween.get(node).set({x: startPos.x, y: startPos.y}).to({x: 215, y:-6}, this.moveTime).call(this.onMoveToComplete, this, []);
	}

	onMoveToComplete(){
		let index = this.curDisableIndex
		let node = this.nodeList[index]
		node.visible = false
		this.curDisableIndex = this.curDisableIndex + 1
		if(this.curDisableIndex >= 10){
			this.hideWnd()
		}
	}

	autoHideTick(){
		if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
	}
}