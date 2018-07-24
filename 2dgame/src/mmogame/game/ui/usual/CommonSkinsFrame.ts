// TypeScript file
class CommonSkinsFrame extends BaseWnd {
    jiHuoList;
    select;
    unreal;
    type;
    stage;
    controlList;
    skinIndex


    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/usual/CommonSkinsLayout.exml"]
        this.jiHuoList = {};

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        this.controlList = []

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
            { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
            { ["name"]: "btn_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSearchClick },
            { ["name"]: "btn_unreal", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUnrealClick },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        this.select = 0;

        this.mElemList["rd_1"].setAlignFlag(gui.Flag.H_CENTER);
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.LEFT_CENTER);
        this.mElemList["rd_3"].setAlignFlag(gui.Flag.LEFT_CENTER);
        //this.mElemList["rd_4"].setAlignFlag(gui.Flag.LEFT_CENTER);

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 0, -2, this.mElemList["group_rd2"])

        this.mElemList["link_view"] = UILinkView.newObj(this.mLayoutNode, "link_view", 0, 0, this.mElemList["link_group"])
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateWnd, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);

        this.onRefresh();
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateWnd, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false);
        this.jiHuoList = {};
        this.controlList = {}
        this.select = 1
        this.stage = 1


        let actor_tianxian: UIActorView = this.mElemList["actor_tianxian"]
        actor_tianxian.clearView()

        let actorView: UIActorView = this.mElemList["actorview"]
        actorView.clearView()

    }

    public onChargeClick(): void {

    }

    updateWnd() {
        this.select = null
        this.stage = null
        this.onRefresh()
    }

    onRefresh() {
        let skinName = cellOptionsName[this.type - 1]
        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.type)
        this.unreal = funInfo.curskin; //当前皮肤

        this.jiHuoList = funInfo.skinlist;
        if (funInfo == null || this.jiHuoList == null)
            return;
        let arr = GameConfig.FunSkinConfig[skinName];
        /*let wndName = {
            ["HeroRide"]: Localize_cns("HeroRide"), ["HeroWing"]: Localize_cns("HeroWing"),
            ["TianNv"]: Localize_cns("TianNv"), ["TianXianWeapon"]: Localize_cns("TianXianWeapon"),
            ["TianXian"]: Localize_cns("TianXian"),
        }*/
        this.mElemList["title"].text = Localize_cns(skinName) + Localize_cns("ROLE_TXT37")
        // if(size_t(this.controlList) == 0){
        this.controlList = []
        if (this.unreal != 0) JsUtil.arrayInstert(this.controlList, arr[this.unreal])
        for (let k in this.jiHuoList) {
            let v = this.jiHuoList[k]
            if (v != this.unreal) {
                JsUtil.arrayInstert(this.controlList, arr[v])
            }
        }
        //let count = size_t(this.controlList);
        for (let k in arr) {
            if (!JsUtil.arrayExsit(this.jiHuoList, k)) {
                JsUtil.arrayInstert(this.controlList, arr[tonumber(k)])
            }
        }
        //   }

        let skinIndex = this.skinIndex
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

        //战力
        let config = GetSumSkinProperty(this.type)
        let zhanLi = GetForceMath(config)
        let type_cns_name = Localize_cns(cellOptionsName[this.type - 1])
        let str = String.format(Localize_cns("ROLE_SKIN_TXT3"), type_cns_name, zhanLi, type_cns_name, size_t(this.jiHuoList));
        AddRdContent(this.mElemList["rd_3"], str, "ht_22_lc", "ublack");

        this.select = this.select || 1
        this.stage = this.stage || 1
        this.onRefreshGroup(this.stage)
        this.onShowSelect(this.select);

        this.refreshDotTips()
    }


    onRefreshGroup(stage) {
        let arr = this.controlList

        for (let i = 1; i <= 5; i++) {
            let index = (stage - 1) * 5 + (i - 1);
            let skinInfo = arr[index]
            if (skinInfo) {
                /* if (!this.mElemList["skin_label" + i]) {
                     let info = [
                         { ["index_type"]: eui.Label, ["name"]: "skin_label" + i, ["title"]: "", ["font"]: "ht_30_cc", ["image"]: "", ["color"]: "white", ["x"]: 34, ["y"]: 64, ["w"]: 48, ["h"]: 171, },
                     ]
                     UiUtil.createElem(info, this.mLayoutNode, this.mElemList, this, this.mElemList["group" + i])
                 }*/
                //this.mElemList["skin_label" + i].text = this.controlList[index].nameStr
                let nameIcon = skinInfo.icon
                this.mElemList["select" + i].visible = false
                this.mElemList["unreal" + i].visible = false
                this.mElemList["group" + i].visible = true;
                if (arr[index]["Index"] == this.unreal) {
                    this.mElemList["unreal" + i].visible = true
                }
                if (table_isExist(this.jiHuoList, skinInfo.Index)) {
                    this.mElemList["bg" + i].source = "zq_piFu02"
                    this.mElemList["name" + i].source = nameIcon + "_1"
                } else {
                    this.mElemList["bg" + i].source = "zq_piFu01"
                    this.mElemList["name" + i].source = nameIcon + "_2"
                }
                let elem = <eui.Group>this.mElemList["group" + i]
                elem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSkin, this)
            } else {
                this.mElemList["group" + i].visible = false;
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

    onClickSkin(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");
        //this.onRefreshDes(index);
        this.select = tonumber(index);
        this.onShowSelect(this.select);
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
        if (!list) return
        let str = ""
        let skinIndex = list.Index
        let arr = list.effects;
        let attrList = table_effect(arr)

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

        ////更新模型
        let skinid = list.skin
        if (this.mElemList["actor_tianxian"] == null) {
            this.mElemList["actor_tianxian"] = UIActorView.newObj(this.mLayoutNode, "actor_tianxian", 0, 0, this.mElemList["actor_wnd"])
        }

        if (this.mElemList["actorview"] == null) {
            this.mElemList["actorview"] = <UIActorView>UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["actor"])
        }

        let lodelRide = false
        let playerInfo = GetHeroPropertyInfo()
        let typeList = {
            [cellOptionsIndex.TianXian]: {
                rideShapeId: playerInfo.rideShapeId,
                wingShapeId: skinid,
            },
            [cellOptionsIndex.HeroWing]: {
                rideShapeId: playerInfo.rideShapeId,
                wingShapeId: skinid,
            },
            [cellOptionsIndex.TianXianWeapon]: {
                rideShapeId: playerInfo.rideShapeId,
                weaponShapeId: skinid,
            }
        }

        for (let k in typeList) {
            if (tonumber(k) == this.type) {
                lodelRide = true
                break
            }
        }

        if (lodelRide == true) {
            this.mElemList["actor"].visible = true
            let modelList = typeList[this.type]
            if (this.type == cellOptionsIndex.HeroWing || this.type == cellOptionsIndex.TianXianWeapon) {
                this.mElemList["actor_wnd"].visible = false
            } else {
                this.mElemList["actor_wnd"].visible = true
            }
            modelList["vocation"] = playerInfo.vocation
            modelList["sexId"] = playerInfo.sexId
            this.mElemList["actorview"].updateByPlayerAppearInfo(modelList)
            UiUtil.setXY(this.mElemList["actor_wnd"], 127, 154)
        } else {
            UiUtil.setXY(this.mElemList["actor_wnd"], 169, 180)
            if (this.type == cellOptionsIndex.HeroRide) {
                UiUtil.setXY(this.mElemList["actor_wnd"], 169, 154)
            }
            this.mElemList["actor"].visible = false
        }

        this.mElemList["actor_tianxian"].updateByPlayer(skinid)


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


    ////////////////////////响应事件
    onLeftClick() {

        if (this.stage == 1) return
        this.stage = this.stage - 1
        // console.log(this.stage)
        this.onRefreshGroup(this.stage)
        this.refreshDotTips()
    }
    onRightClick() {

        let arr = this.controlList
        let maxLengh = Math.ceil(size_t(arr) / 5)
        if (this.stage == maxLengh) return
        this.stage = this.stage + 1;
        //console.log(this.stage)
        this.onRefreshGroup(this.stage)
        this.refreshDotTips()
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
            RpcProxy.call("C2G_TEMPCELLFUN_SKIN_SET", this.type, index)
        } else if (name == "btn_jiHuo") {
            RpcProxy.call("C2G_TEMPCELLFUN_SKIN_UNLOCK", this.type, index)
            if (skinInfo.fashionIndex != 0) {
                //如果套装界面打开， 刷新一次
                let wnd: RoleSuitFrame = WngMrg.getInstance().getWindow("RoleSuitFrame")
                if (wnd.isVisible()) {
                    RpcProxy.call("C2G_FashionSuit_Info")
                }
            }

        } else {

        }
    }
    onSearchClick() {

        let temp = <string>this.mElemList["title"].text
        let name = temp.substring(0, 2)
        name = name + Localize_cns("ROLE_SKIN_TXT9")
        let pos = (this.stage - 1) * 5 + (this.select - 1)
        let list = this.controlList[pos]
        if (list == null) return
        let skinIndex = list.Index
        /*let str = ""
        let attrList = GetSingleSkinProperty(cellOptionsName[this.type - 1], skinIndex)
        let zhanLi = GetForceMath(attrList)
        for (let k in attrList) {
            str += GetPropertyName(lastAbilityNameToIdOptions[k]) + "#darkgreen" + attrList[k] + "#rf#space"
        }*/
        let wnd: CommonSkinPropertyFrame = WngMrg.getInstance().getWindow("CommonSkinPropertyFrame")
        wnd.onShowWnd(this.type, skinIndex, name)
    }



    /////////////------------
    public onShowWnd(cellOptionsIndex, skinIndex?) {
        this.type = cellOptionsIndex
        this.skinIndex = skinIndex || -1
        this.showWnd();
    }

    ////////////////////红点提示/////////////////////
    //自定义红点继承实现
    refreshDotTipsImp() {
        this.refreshIconDot()
        this.refreshBtnDot()
    }

    refreshIconDot() {
        let controlList = this.controlList
        if (controlList == null) return
        for (let k = 1; k <= 5; k++) {
            let pos = (k - 1) + (this.stage - 1) * 5
            let title = this.controlList[pos]
            if (title == null) continue
            if (table_isExist(this.jiHuoList, title.Index)) continue
            let check = GuideFuncSystem.getInstance().checkHeroTitle(title)
            if (check) {
                this.createDotTipsUI(this.mElemList["group" + k])
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
            if (table_isExist(this.jiHuoList, title.Index)) continue
            let check = GuideFuncSystem.getInstance().checkHeroTitle(title)
            if (check) {
                let pos = tonumber(k) + 1
                let stage = 1
                while (pos > 5) {
                    pos -= 5
                    stage += 1
                }
                if (stage > this.stage) {
                    this.createDotTipsUI(this.mElemList["btn_right"])
                }

                if (stage < this.stage) {
                    this.createDotTipsUI(this.mElemList["btn_left"])
                }
            }
        }
    }
}