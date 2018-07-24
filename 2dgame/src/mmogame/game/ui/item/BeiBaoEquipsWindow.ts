// TypeScript file
class BeiBaoEquipsWindow extends BaseCtrlWnd {
    mElemList;
    equipItemList;
    mLayoutNode;
    //scroll:UIScrollList;
    // cacheEventUpdate;
    // hasEventUpdateCome;

    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        this.mLayoutNode = this.mParentWnd.mLayoutNode;


        var elemInfo = [
            { ["name"]: "btn_add", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },
            { ["name"]: "btn_smelte", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSmelteClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        //let group: eui.Group = this.mElemList["scroll_Equip"]

        //this.scroll = UIScrollList.newObj(this.mLayoutNode, "EquipScroll", 0, 0, group.width, group.height, group)
        let list: eui.List = this.mElemList["scroll_EquipList"]
        list.itemRenderer = itemRender.BeiBaoEquipsItem


    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onEventUpdate, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onEventUpdate, this)
        this.mElemList["group_equip"].visible = true;
        this.mElemList["label_wndName"].text = Localize_cns("BEIBAO_EQUIP");
        this.onRefresh();
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onEventUpdate, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onEventUpdate, this)
        this.mElemList["group_equip"].visible = false;
    }

    public onEventUpdate(): void {
        // if (this.cacheEventUpdate == true) {
        //     this.hasEventUpdateCome = true
        //     return
        // }
        this.onRefresh()
    }

    public onAddClick(): void {
        let wnd = WngMrg.getInstance().getWindow("BeiBaoAddCapacityFrame");

        wnd.showWnd();

    }
    public onSmelteClick(): void {
        let wnd: BeiBaoSmelteFrame = WngMrg.getInstance().getWindow("BeiBaoSmelteFrame");
        //wnd.setHideCallback(this.onSmelteFrameHide, this)
        wnd.showWnd();
        //打开溶解界面时 背包界面不需要更新 更新消息缓存起来
        //this.cacheEventUpdate = true
        //this.mParentWnd.hideWnd();
    }

    // public onSmelteFrameHide(): void {
    //     //当溶解界面关闭时，如果有缓存到更新消息，则刷新一次
    //     this.cacheEventUpdate = null
    //     if (this.hasEventUpdateCome == true) {
    //         this.hasEventUpdateCome = true
    //         this.onRefresh()
    //     }
    // }

    onRefresh() {

        let itemType1 = opItemType.ROLE_EQUIP//角色装备
        let equipItemList = ItemSystem.getInstance().getItemLogicInfoByType(itemType1)


        let sortEqupFun = function (a: Item, b: Item) {
            let aQuality = a.getProperty("quality")
            let bQuality = b.getProperty("quality")
            if (aQuality == bQuality) {
                let aLevel = a.getRefProperty("level")
                let bLevel = b.getRefProperty("level")
                if (aLevel == bLevel) {
                    return a.hashCode - b.hashCode
                }
                return aLevel - bLevel
            }

            return aQuality - bQuality
        }

        table_sort(equipItemList, sortEqupFun)
        //let level = RoleSystem.getInstance().getRoleInfo("stage")
        //equipItemList = ItemSystem.getInstance().getSortEquipList(equipItemList,level )
        let itemType2 = opItemType.COMMON_EQUIP//通用装备
        let equipItemList2 = ItemSystem.getInstance().getItemLogicInfoByType(itemType2)
        table_sort(equipItemList2, sortEqupFun)
        for (let i in equipItemList2) {
            let item = equipItemList2[i]
            JsUtil.arrayInstert(equipItemList, item)
        }


        let splitlist = splitListByCount(equipItemList, 5)

        let list: eui.List = this.mElemList["scroll_EquipList"]
        UiUtil.updateList(list, splitlist);


        let had = size_t(equipItemList)
        let maxCapacity = GetHeroProperty("equipMax")
        this.mElemList["lable_capacity"].text = had + "/" + maxCapacity
        //lable_capacity


    }

}



module itemRender {
    export class BeiBaoEquipsItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}

            //let name = this.name
            for (let i = 1; i <= 5; i++) {
                let x = 107 * (i - 1);
                let y = 2;

                let mElemInfo: any = [

                    { ["index_type"]: eui.Group, ["name"]: "equip_bg" + i, ["image"]: "", ["x"]: x, ["y"]: y, ["w"]: 100, ["h"]: 110, },
                    { ["index_type"]: eui.Group, ["name"]: "equip" + i, ["parent"]: "equip_bg" + i, ["image"]: "", ["x"]: 10, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
                    { ["index_type"]: eui.Label, ["name"]: "equip_lv" + i, ["parent"]: "equip_bg" + i, ["title"]: "", ["font"]: "ht_18_cc", ["image"]: null, ["color"]: "ublack", ["x"]: 0, ["y"]: 85, ["w"]: 100, ["h"]: 20, ["messageFlag"]: true },

                ];
                UiUtil.createElem(mElemInfo, this, this.mElemList, this);

                this.mElemList["equipBox" + i] = UIItemBox.newObj(this, "equipBox" + i, 0, 0, this.mElemList["equip" + i])


            }
        }

        protected dataChanged(): void {
            let config = this.data


            for (let i = 1; i <= 5; i++) {
                let item = config[i - 1]
                if (item) {
                    let entryId = item.entryId
                    let type = item.getRefProperty("type")
                    let level = item.getRefProperty("level")
                    if (type == opItemType.ROLE_EQUIP) {
                        this.mElemList["equip_lv" + i].text = "LV." + level
                    } else if (type == opItemType.COMMON_EQUIP) {
                        this.mElemList["equip_lv" + i].text = level + Localize_cns("PET_TXT10")
                    }

                    this.mElemList["equipBox" + i].updateByItem(item)
                    this.mElemList["equip_bg" + i].visible = true
                } else {
                    this.mElemList["equip_bg" + i].visible = false
                }
            }
        }

    }
}