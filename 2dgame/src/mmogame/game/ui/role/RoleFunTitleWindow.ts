// TypeScript file
class RoleFunTitleWindow extends BaseCtrlWnd {
    mElemList;
    jiHuoList;
    select;
    unreal;
    type;
    stage;
    controlList;
    actor: UIActorView


    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        let parent = this.mParentWnd
        this.mElemList = parent.mElemList;
        this.actor = parent.actor

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.updateWnd, this)
        this.onRefresh();
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.updateWnd, this)
        this.stage = null
        this.select = null
        this.jiHuoList = []
        this.controlList = []
    }

    updateWnd() {

        let index = this.mParentWnd.tabWndList.getTabIndex()
        let info = RoleSystem.getInstance().getRecvList()
        if (size_t(info) == 0) return

        let jiHuoList = info.unlockfashionlist
        let unreal = info.fashionindex
        if (index == 1) {
            jiHuoList = info.unlocktitlelist
            unreal = info.titleindex
        }
        if (size_t(jiHuoList) != size_t(this.jiHuoList) || this.unreal != unreal) {
            this.stage = null
            this.select = null
            this.onRefresh()
        }
    }

    onInitData() {
        let index = this.mParentWnd.tabWndList.getTabIndex()
        let info = RoleSystem.getInstance().getRecvList()
        if (size_t(info) == 0) return
        let titleText = Localize_cns("ROLE_TXT42")

        this.jiHuoList = info.unlockfashionlist
        this.unreal = info.fashionindex
        this.type = cellOptionsIndex.HeroEquip
        if (index == 1) {
            this.jiHuoList = info.unlocktitlelist
            this.unreal = info.titleindex
            this.type = cellOptionsIndex.Hero
            titleText = Localize_cns("ROLE_TXT43")
        }
        this.mElemList["title"].text = titleText
        //战力
        let length = size_t(this.jiHuoList);
        let totolConfig = GetSumFashionAndTitleProperty(cellOptionsName[this.type - 1])
        let zhanLi = GetForceMath(totolConfig)
        let str = String.format(Localize_cns("ROLE_SKIN_TXT3"), titleText, zhanLi, titleText, length);
        AddRdContent(this.mElemList["rd_3"], str, "ht_22_lc", "ublack");

        let arr = GameConfig.FunSkinConfig[cellOptionsName[this.type - 1]]
        let enoughList = []
        for (let k in arr) {
            let skinInfo = arr[k]
            let had = ItemSystem.getInstance().getItemCount(skinInfo.itemid)
            if (had >= skinInfo.itemnum && table_isExist(this.jiHuoList, skinInfo.Index) == false) {
                table_insert(enoughList, skinInfo.Index)
            }
        }

        this.controlList = []
        for (let k in enoughList) {
            let index = enoughList[k]
            table_insert(this.controlList, arr[index])
        }
        if (this.unreal != 0) JsUtil.arrayInstert(this.controlList, arr[this.unreal])
        for (let k in this.jiHuoList) {
            let v = this.jiHuoList[k]
            if (v != this.unreal) {
                JsUtil.arrayInstert(this.controlList, arr[v])
            }
        }
        for (let k in arr) {
            let dataKey = tonumber(k)
            if (!table_isExist(this.jiHuoList, dataKey) && !table_isExist(enoughList, dataKey)) {
                JsUtil.arrayInstert(this.controlList, arr[k])
            }
        }

        let skinIndex = this.mParentWnd.skinIndex
        if (skinIndex && skinIndex != -1) {
            let pos = 0
            this.stage = 1
            this.select = 0
            for (let k in this.controlList) {
                let skinInfo = this.controlList[k]
                if (skinInfo.Index == skinIndex) {
                    pos = tonumber(k) + 1
                    break
                }
            }
            while (pos > 5) {
                pos -= 5
                this.stage += 1
            }
            this.select = pos
        }
    }

    onRefresh() {
        this.onInitData()
        this.stage = this.stage || 1
        this.select = this.select || 1
        this.onRefreshGroup(this.stage)
        this.onShowSelect(this.select)

        //自定义红点
        this.mParentWnd.refreshDotTips()
    }

    onShowSelect(index) {
        for (let i = 1; i <= 5; i++) {
            if (i == index) {
                this.mElemList["select" + i].visible = true;
            } else {
                this.mElemList["select" + i].visible = false
            }
        }
        this.onRefreshDes(index);

    }
    onRefreshDes(index) {
        //common
        index = index + (this.stage - 1) * 5
        let list = this.controlList[index - 1]
        if (list == null) return
        let str = ""
        let arr = list.effects;
        let skinIndex = list.Index
        //let typename = cellOptionsName[this.type - 1]

        let attrList = table_effect(list.effects)

        for (let k in attrList) {
            str += GetPropertyName(lastAbilityNameToIdOptions[k]) + attrList[k] + "#br"
        }

        if (JsUtil.arrayExsit(this.jiHuoList, skinIndex)) {
            str = "#lime" + str
        } else {
            str = "#oldlace" + str
        }
        let desStr = String.format(Localize_cns("ROLE_SKIN_TXT1"), str);
        AddRdContent(this.mElemList["rd_1"], desStr, "ht_22_lc", "white");

        let skinid = list.skin
        let playerInfo = GetHeroPropertyInfo()
        //更新模型
        if (this.mParentWnd.tabWndList.getTabIndex() == 0) {
            // this.mElemList["actor"].visible = true
            this.mElemList["title_icon"].visible = false
            let modelList = {}
            modelList["vocation"] = playerInfo.vocation
            modelList["sexId"] = playerInfo.sexId
            modelList["rideShapeId"] = playerInfo.rideShapeId
            modelList["heroShapeId"] = skinid
            this.actor.updateByPlayerAppearInfo(modelList)
        } else {
            //this.mElemList["actor"].visible = false
            this.mElemList["title_icon"].visible = true
            let image = GetShapeImage(skinid)
            this.mElemList["title_icon"].source = image
            let modelList = {}
            modelList["vocation"] = playerInfo.vocation
            modelList["sexId"] = playerInfo.sexId
            modelList["rideShapeId"] = playerInfo.rideShapeId
            modelList["heroShapeId"] = playerInfo.heroShapeId
            this.actor.updateByPlayerAppearInfo(modelList)
        }


        //战力
        let force = GetForceMath(attrList)
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

        //已幻化
        if (list["Index"] == this.unreal) {
            this.mElemList["group_rd2"].visible = false;
            this.mElemList["btn_unreal"].visible = false;
            return
        }
        //已激活
        let k = list["Index"]
        this.mElemList["link_view"].setVisible(false)
        if (JsUtil.arrayExsit(this.jiHuoList, k)) {
            this.mElemList["group_rd2"].visible = false;
            this.mElemList["btn_unreal"].name = "btn_unreal"
            this.mElemList["btn_unreal"].text = Localize_cns("PET_TURN")
            this.mElemList["btn_unreal"].visible = true;
        } else {
            let had = ItemSystem.getInstance().getItemCount(list["itemid"])
            let need = list.itemnum;
            if (had >= need) {
                this.mElemList["group_rd2"].visible = false;
                this.mElemList["btn_unreal"].name = "btn_jiHuo"
                this.mElemList["btn_unreal"].text = Localize_cns("ROLE_TXT20")
                this.mElemList["btn_unreal"].visible = true;
            } else {
                this.mElemList["group_rd2"].visible = true;
                this.mElemList["btn_unreal"].visible = false;
                let name = list.nameStr;
                let nameStr = String.format(Localize_cns("ROLE_SKIN_TXT2"), name, had, need);
                AddRdContent(this.mElemList["rd_2"], nameStr, "ht_22_lc", "ublack");
                this.mElemList["itemBox"].updateByEntry(list["itemid"]);
                // this.mElemList["rd_4"] 获取途径
                let tipInfo = GameConfig.FunTipsConfig[list.itemid]
                if (tipInfo && tipInfo[1]) {
                    this.mElemList["link_view"].setVisible(true)
                    this.mElemList["link_view"].updateByEntry(list.itemid)
                    this.mElemList["link_view"].setLeft()
                }
            }
        }
    }

    onRefreshGroup(stage) {
        let arr = this.controlList

        for (let i = 1; i <= 5; i++) {
            let index = (stage - 1) * 5 + (i - 1);
            let skinInfo = arr[index]
            if (skinInfo) {
                /*if(!this.mElemList["skin_label"+i]){
                    let info = [
                   { ["index_type"]: eui.Label, ["name"]: "skin_label" + i, ["title"]:"", ["font"]: "ht_30_cc", ["image"]: "", ["color"]: "white", ["x"]: 34, ["y"]: 64, ["w"]: 48, ["h"]: 171, },
                ]
                UiUtil.createElem(info, this.mLayoutNode,this.mElemList,this, this.mElemList["group"+i])
                }
                this.mElemList["skin_label"+ i].text = this.controlList[index].nameStr*/
                let nameIcon = skinInfo.icon
                this.mElemList["select" + i].visible = false
                this.mElemList["unreal" + i].visible = false
                this.mElemList["group" + i].visible = true;
                if (arr[index]["Index"] == this.unreal) {
                    this.mElemList["unreal" + i].visible = true
                }

                if (table_isExist(this.jiHuoList, arr[index]["Index"])) {
                    this.mElemList["bg" + i].source = "zq_piFu02"
                    this.mElemList["name" + i].source = nameIcon + "_1"
                } else {
                    this.mElemList["bg" + i].source = "zq_piFu01"
                    this.mElemList["name" + i].source = nameIcon + "_2"
                }

            } else {
                this.mElemList["group" + i].visible = false;
                // this.mElemList["group" + i].enabled = false

            }
        }
        this.mElemList["btn_left"].visible = true
        this.mElemList["btn_right"].visible = true
        if (this.stage == 1) {
            this.mElemList["btn_left"].visible = false
        }
        if (this.stage == Math.ceil(size_t(this.controlList) / 5)) {
            this.mElemList["btn_right"].visible = false
        }
    }

    //btn响应事件
    onLeftClick() {
        if (this.stage == 1) return
        this.stage = this.stage - 1
        this.onRefreshGroup(this.stage)
    }
    onRightClick() {
        let arr = this.controlList
        let maxLengh = Math.ceil(size_t(arr) / 5)
        if (this.stage == maxLengh) return
        this.stage = this.stage + 1;
        this.onRefreshGroup(this.stage)
    }

    onSearchClick() {
        let temp = <string>this.mElemList["title"].text
        let name = temp.substring(0, 2)
        name = name + Localize_cns("ROLE_SKIN_TXT9")
        let pos = (this.stage - 1) * 5 + (this.select - 1)
        let list = this.controlList[pos]
        let skinIndex = list.Index
        let cellIndex = 0
        if (this.mParentWnd.tabWndList.getTabIndex() == 0) {
            cellIndex = cellOptionsIndex.HeroEquip
        } else {
            cellIndex = cellOptionsIndex.Hero
        }
        let wnd = WngMrg.getInstance().getWindow("CommonSkinPropertyFrame")
        wnd.onShowWnd(cellIndex, skinIndex, name)
    }


    onUnrealClick(event: egret.TouchEvent) {
        let name = event.target.name
        let pos = (this.select - 1) + (this.stage - 1) * 5
        let skinInfo = this.controlList[pos]
        if (skinInfo == null) return
        let index = skinInfo.Index
        if (name == "btn_unreal") {
            if (skinInfo.fashionIndex != 0) {
                MsgSystem.addTagTips(Localize_cns("ROLE_SUIT_TXT3"))
                return
            }
            if (this.mParentWnd.tabWndList.getTabIndex() == 0) {
                RpcProxy.call("C2G_ACTOR_ROLE_FASHION_SET", tonumber(index))
            } else {
                RpcProxy.call("C2G_ACTOR_ROLE_TITLE_SET", tonumber(index))
            }
        } else if (name == "btn_jiHuo") {

            if (this.mParentWnd.tabWndList.getTabIndex() == 0) {
                RpcProxy.call("C2G_ACTOR_ROLE_FASHION_UNLOCK", tonumber(index))
            } else {
                RpcProxy.call("C2G_ACTOR_ROLE_TITLE_UNLOCK", tonumber(index))
            }
            if (skinInfo.fashionIndex != 0) {
                //如果套装界面打开， 刷新一次
                let wnd: RoleSuitFrame = WngMrg.getInstance().getWindow("RoleSuitFrame")
                if (wnd.isVisible()) {
                    RpcProxy.call("C2G_FashionSuit_Info")
                }
            }
        }
    }

    onClickSkin(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");
        //this.onRefreshDes(index);
        this.select = tonumber(index);
        this.onShowSelect(this.select);
    }

    refreshIconDot() {
        let controlList = this.controlList
        if (controlList == null) return
        for (let k = 1; k <= 5; k++) {
            let pos = (k - 1) + (this.stage - 1) * 5
            let title = this.controlList[pos]
            if (title == null) continue
            let index = this.mParentWnd.tabWndList.getTabIndex()
            let typeName = index == 0 ? "unlockfashionlist" : "unlocktitlelist"
            let unLockList = RoleSystem.getInstance().getRoleInfo(typeName)
            if (table_isExist(unLockList, title.Index)) continue
            let check = GuideFuncSystem.getInstance().checkHeroTitle(title)
            if (check) {
                this.mParentWnd.createDotTipsUI(this.mElemList["group" + k])
            }
        }

    }

    //按钮的红点
    refreshBtnDot() {
        let controlList = this.controlList
        if (controlList == null) return
        for (let k in controlList) {
            let title = this.controlList[k]
            if (title == null) continue
            let index = this.mParentWnd.tabWndList.getTabIndex()
            let typeName = index == 0 ? "unlockfashionlist" : "unlocktitlelist"
            let unLockList = RoleSystem.getInstance().getRoleInfo(typeName)
            if (table_isExist(unLockList, title.Index)) continue
            let check = GuideFuncSystem.getInstance().checkHeroTitle(title)
            if (check) {
                let pos = tonumber(k) + 1
                let stage = 1
                while (pos > 5) {
                    pos -= 5
                    stage += 1
                }
                if (stage > this.stage) {
                    this.mParentWnd.createDotTipsUI(this.mElemList["btn_right"])
                }

                if (stage < this.stage) {
                    this.mParentWnd.createDotTipsUI(this.mElemList["btn_left"])
                }
            }
        }
    }
}