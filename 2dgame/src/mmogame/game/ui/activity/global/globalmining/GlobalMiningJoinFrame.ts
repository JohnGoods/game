// TypeScript file
class GlobalMiningJoinFrame extends BaseWnd {
    
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/global/globalmining/GlobalMiningJoinLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        // this.setFullScreen(true)
        this.initSkinElemList();
        // this.setAlignCenter(true, true);
        this.mLayoutNode.horizontalCenter = 0
        // this.mLayoutNode.verticalCenter = 0;
        this.mLayoutNode.top = 50;
		this.mLayoutNode.bottom = 115
        this.mLayoutNode.setDoModal(true)

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            
            { ["name"]: "create_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCreate },
            { ["name"]: "refresh_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRefresh },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["label_wndName"].text = Localize_cns("GLOBAL_MINING_TXT20")
        let list: eui.List = this.mElemList["teamList_list"]
        list.itemRenderer = itemRender.GlobalMiningJoinListItem
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        // this.refreshFrame();

        this.onClickRefresh(null)
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        if (GetActivity(ActivityDefine.GlobalMining).isInMiningTeam() == true) {
            return this.hideWnd()
        }

        let tempList = GetActivity(ActivityDefine.GlobalMining).getActTeamInfoList() || []//[1, 1, 1, 1, 1, 1, 1, 1, 1]
        let list = splitListByCount(tempList, 3)

        let eList: eui.List = this.mElemList["teamList_list"]
        UiUtil.updateList(eList, list);
    }

    /////////////////////////////////////////////////
    onClickCreate(args) {        
        RpcProxy.call("C2G_MineCreateActTeam")
        //
    }

    onClickRefresh(args) {        
        RpcProxy.call("C2G_MinePreActTeamList")
        //
    }
}

module itemRender {
    export class GlobalMiningJoinListItem extends eui.ItemRenderer {
        mElemList: any;
        contrlDataTable: any;

        constructor() {
            super();
            this.mElemList = null
            this.contrlDataTable = {}

            this.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
			this.skinName = "resource/layouts/activity/global/globalmining/GlobalMiningJoinItemRender.exml"
		}

		onComplete() {
			this.mElemList = {};
			UiUtil.initElemWithComponent(this, this.mElemList, this)
            
            var elemInfo = [
                { ["name"]: "join_btn0", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickJoin },
                { ["name"]: "join_btn1", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickJoin },
                { ["name"]: "join_btn2", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickJoin },
            ];
            UiUtil.initElem(elemInfo, this, this.mElemList, this);

            for (let i = 0; i < 3; i++) {
                this.mElemList["teamCount" + i].setAlignFlag(gui.Flag.H_CENTER)
            }
            
			this.dataChanged();
		}

        protected dataChanged(): void {
            if (this.mElemList == null || this.data == null) {
				return;
			}
            
            let list = this.data
            for (let i = 0; i < 3; i++) {
                let v = list[i]
                if (v) {
                    this.mElemList["team_group" + i].visible = true
                    this.mElemList["leader" + i].text = v.name
                    
                    AddRdContent(this.mElemList["teamCount" + i], String.format(Localize_cns("GLOBAL_MINING_TXT38"), "#lime" + v.membersCount + "/" + 3), "ht_20_cc_stroke", "white")
                    if (v.membersCount >= 3) {
                        this.mElemList["join_btn" + i].visible = false
                        this.mElemList["force" + i].visible = false

                        this.mElemList["full" + i].visible = true
                    } else {
                        this.mElemList["join_btn" + i].visible = true
                        this.mElemList["force" + i].visible = true
                        this.mElemList["force" + i].text = String.format(Localize_cns("GLOBAL_MINING_TXT26"), MakeLongNumberShort(v.needForce))
                        this.contrlDataTable["join_btn" + i] = v

                        this.mElemList["full" + i].visible = false
                    }
                    
                } else {
                    this.mElemList["team_group" + i].visible = false
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////
        onClickJoin(args) {
            let name = args.target.name
            if (this.contrlDataTable[name] == null) {
                return
            }

            let config = this.contrlDataTable[name]
            if (config.needForce > (GetHeroProperty("force") || 0)) {
                return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT44"))
            }

            let teamId = config.actTeamId
            RpcProxy.call("C2G_MineApplyActTeam", teamId)
        }
    }
}