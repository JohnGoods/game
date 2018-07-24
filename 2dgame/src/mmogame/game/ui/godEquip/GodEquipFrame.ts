// TypeScript file
class GodEquipFrame extends BaseWnd {

    emptyView: UIEmptyView;
    tabWndList: UITabWndList;
    tabIndex: number;
    selectIndex: number;
    godEquipFirstEntryIDList;
    equipdresslist;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/godEquip/GodEquipLayout.exml"]
        this.tabIndex = -1;
        this.selectIndex = 0

        this.godEquipFirstEntryIDList = [
            15052, 15045, 15047, 15050, 15049, 15041, 15043, 15048, 15044, 15046
        ]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setFullScreen(true)
        //this.setAlignCenter(true, true)
        this.mElemList["upgrade_group"].visible = false;
        this.mElemList["xilian_group"].visible = false;
        this.mElemList["cuilian_group"].visible = false;

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ]

        for (let i = 0; i < 10; i++) {
            let listInfo = { ["name"]: "item_btn" + i, ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick }
            table_insert(elemInfo, listInfo)
        }

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let tabInfoList = [
            { name: "tab0", wnd: GodEquipLevelWindow.newObj(this.mLayoutNode, this), ["check"]: this.onTab1Click },
            { name: "tab1", wnd: GodEquipXiLianWindow.newObj(this.mLayoutNode, this), ["check"]: this.onTab2Click },
            { name: "tab2", wnd: GodEquipCuilianWindow.newObj(this.mLayoutNode, this), ["check"]: this.onTab3Click },
        ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

        this.onInitEquip(this.mElemList["equip"]);

        for (let i = 0; i < 10; i++) {
            let btn = this.mElemList["equip_dress_btn" + i]
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ondressGodEquip, this)
        }

    }


    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.tabWndList.setWndVisible(true);
        // RegisterEvent(EventDefine.EQUIP_XILIAN, this.onRefresh, this)
        if (this.tabIndex != -1) {
            this.tabWndList.changeTabWithIndex(this.tabIndex)
        }
        // this.onRefresh()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false);
        // UnRegisterEvent(EventDefine.EQUIP_XILIAN, this.onRefresh, this)
    }

    onRefresh() {
        this.onRefreshEquip()
    }

    onInitEquip(window) {
        window = this
        let name = "equip"
        for (let i = 0; i < 10; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 0, 0, this.mElemList[name + "_item_group" + i]);
            this.mElemList[name + "itemBox" + i].setItemHintEnable(false)
            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "red_point" + i, ["image"]: "zjm_hongDian01", ["x"]: 40, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true },
            ]
            this.mElemList[name + "itemBox" + i].createElem(mElemInfo, this.mElemList, this)
            this.mElemList["item_select" + i].visible = false
            this.mElemList[name + "red_point" + i].visible = false
        }
    }

    onRefreshEquip() {
        let arr = RoleSystem.getInstance().getRoleEquipItemList()
        //let count = size_t(arr)
        let name = "equip"
        let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
        this.equipdresslist = []
        for (let i = 0; i < 10; i++) {
            let subtype = subtypeList[i]
            let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)

            this.mElemList["item_select" + i].visible = (this.selectIndex == i)
            this.mElemList[name + "red_point" + i].visible = false
            if (roleItem && roleItem.propertyInfo.quality >= 6) {
                this.mElemList[name + "_bg" + i].visible = false
                this.mElemList[name + "_lv" + i].visible = true
                this.mElemList[name + "_dress_btn" + i].visible = false
                this.mElemList[name + "itemBox" + i].setVisible(true);
                this.mElemList[name + "itemBox" + i].updateByItem(roleItem);
                let level = roleItem.getRefProperty("uselevel")
                let str = String.format(Localize_cns("ROLE_TXT34"), level)
                this.mElemList[name + "_lv" + i].text = str;

            } else {
                this.mElemList[name + "_bg" + i].visible = true
                this.mElemList[name + "_lv" + i].visible = false;
                this.mElemList[name + "itemBox" + i].setVisible(false)
                let canGodEquipDress = false
                let item = RoleSystem.getInstance().getRoleGodEquipItemBySubtype(subtype)
                if (item != null) {
                    this.equipdresslist[name + "_dress_btn" + i] = item
                    canGodEquipDress = true
                }
                this.mElemList[name + "_dress_btn" + i].visible = canGodEquipDress
            }
        }

    }

    // let stage = RoleSystem.getInstance().getRoleInfo("stage")
    // 	let equiplist = RoleSystem.getInstance().getRoleEquipList(stage)
    // 	if (size_t(equiplist) == 0) return
    // 	let gidList = []
    // 	for (let k in equiplist) {
    // 		let item = <Item>equiplist[k]
    // 		JsUtil.arrayInstert(gidList, item.id)
    // 	}
    // 	RpcProxy.call("C2G_ACTOR_ROLE_INFO_EQUIP_SET", gidList)


    onRefreshEquipRedPoint() {
        let wndName = this.tabWndList.getTabName()
        let name = "equip"
        if (wndName == "tab0") {
            let heroLevel = GetHeroProperty("level") || 0
            if (heroLevel < playerOptions.shenzhuang) return 
            //神装升级
            let arr = RoleSystem.getInstance().getRoleEquipItemList()
            let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
            for (let i = 0; i < 10; i++) {
                let subtype = subtypeList[i]
                if (subtype) {
                    let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
                    //有神装
                    if (roleItem && roleItem.propertyInfo.quality >= 6) {
                        let suit = roleItem.refPropertyInfo.suit
                        //神装没满级
                        if (GameConfig.RoleEquipSuit && GameConfig.RoleEquipSuit[suit]) {
                            //下阶装备
                            let nextRoleItem = RoleSystem.getInstance().getRoleEquipNextItem(roleItem)
                            if (nextRoleItem.refPropertyInfo == null) continue //没有下一阶
                            let toLevel = roleItem.getRefProperty("level") + 20
                            if (heroLevel < toLevel) continue //角色等级小于下一阶等级
                            let consumeConfig = GameConfig.RoleEquipUpConfig
                            let configInfo = consumeConfig[suit]
                            let curConsume = null
                            for (let _ in configInfo) {
                                let type = tonumber(_)
                                if (type == subtype) {
                                    curConsume = configInfo[type]
                                    break
                                }
                            }
                            if (curConsume) {
                                let need = curConsume.fragment
                                let itemId = curConsume.entryId
                                let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
                                let needMoney = curConsume.funds
                                let ownMoney = GetHeroProperty("funds")
                                if (ownItemCount >= need && ownMoney >= needMoney) {
                                    this.mElemList[name + "red_point" + i].visible = true
                                }
                            }
                        }
                    }
                }
            }
        } else {
            //洗炼
        }
    }

    onEquipClick(args) {
        let name = args.target.name
        let index = tonumber(name.replace(/[^0-9]/ig, ""))
        if (this.selectIndex == index) {
            return
        }

        let wndName = this.tabWndList.getTabName()
        if (wndName == "tab1") {  //要判断神装是否为空
            let arr = RoleSystem.getInstance().getRoleEquipItemList()
            let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
            let subtype = subtypeList[index]
            let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
            if (roleItem == null || roleItem.propertyInfo == null || roleItem.propertyInfo.quality == null
                || roleItem.propertyInfo.quality < 6) {
                MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT3"))
                return
            }
        }

        this.selectIndex = index
        this.onRefresh()
        let wnd = this.tabWndList.getCurrentWnd()
        wnd.onResetData()
        wnd.onRefresh()
    }


    onTab1Click() {
        return true
    }

    onTab2Click() {
        let arr = RoleSystem.getInstance().getRoleEquipItemList()
        let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
        for (let i = 0; i < 10; i++) {
            let subtype = subtypeList[i]
            let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
            if (roleItem && roleItem.propertyInfo.quality >= 6) {
                return true
            }
        }
        MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT6"))
        return false
    }

    onTab3Click() {
        return true
    }

    ondressGodEquip(args) {
        let name = args.target.name
        if (this.equipdresslist[name] == null) {
            return
        }
        let item = this.equipdresslist[name]
        let idList = []
        table_insert(idList, item.id)
        RpcProxy.call("C2G_ACTOR_ROLE_INFO_EQUIP_SET", idList)
    }

    ////////////////////////////////////////////////////////////////////////////////////
    //以0开头，0是第一个标签
    showWithIndex(index?) {
        if (index == null) {
            index = 0
        }
        this.tabIndex = index;
        this.showWnd();
    }

}