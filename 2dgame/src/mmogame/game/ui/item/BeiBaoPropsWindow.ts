// TypeScript file
class BeiBaoPropsWindow extends BaseCtrlWnd {
    mElemList;
    propItemList;
    mLayoutNode;
    //scroll:UIScrollList;

    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        this.mLayoutNode = this.mParentWnd.mLayoutNode;


        // let group: eui.Group = this.mElemList["scroll_Prop"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "PropScroll", 0, 0, group.width, group.height, group)	   

        let list: eui.List = this.mElemList["scroll_PropList"]
        list.itemRenderer = itemRender.BeiBaoPropsItem

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mElemList["group_prop"].visible = true;
        this.mElemList["label_wndName"].text = Localize_cns("BEIBAO_PROP");
        this.onRefresh();
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mElemList["group_prop"].visible = false;
    }


    onRefresh() {

        let itemType = opItemType.ITEM_TYPE_GOODS
        let propItemList = ItemSystem.getInstance().getItemLogicInfoByType(itemType)
        let splitlist = splitListByCount(propItemList, 5)

        let list: eui.List = this.mElemList["scroll_PropList"]
        UiUtil.updateList(list, splitlist);


    }


}

module itemRender {
    export class BeiBaoPropsItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}


            for (let i = 1; i <= 5; i++) {
                let x = 3 + 107 * (i - 1);
                let y = 2;

                let mElemInfo: any = [

                    { ["index_type"]: eui.Group, ["name"]: "prop_bg" + i, ["image"]: "", ["x"]: x, ["y"]: y, ["w"]: 100, ["h"]: 110, },
                    { ["index_type"]: eui.Group, ["name"]: "prop" + i, ["parent"]: "prop_bg" + i, ["image"]: "", ["x"]: 10, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
                    { ["index_type"]: eui.Image, ["name"]: "image" + i, ["parent"]: "prop_bg" + i, ["image"]: "zjm_hongDian01", ["x"]: 50, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true },
                    { ["index_type"]: eui.Label, ["name"]: "name" + i, ["parent"]: "prop_bg" + i, ["title"]: "", ["font"]: "ht_16_cc", ["image"]: null, ["color"]: gui.Color.white, ["x"]: -20, ["y"]: 85, ["w"]: 140, ["h"]: 20, ["messageFlag"]: true },
                ];
                UiUtil.createElem(mElemInfo, this, this.mElemList, this);

                this.mElemList["propBox" + i] = UIItemBox.newObj(this, "propBox" + i, 0, 0, this.mElemList["prop" + i])


            }
        }

        protected dataChanged(): void {
            let config = this.data

            for (let i = 1; i <= 5; i++) {
                let item: Item = config[i - 1]
                if (item) {
                    let entryId = item.entryId
                    this.mElemList["name" + i].text = item.getName()
                    this.mElemList["name" + i].textColor = GetItemFontGUIColor(entryId, false)
                    let count = ItemSystem.getInstance().getItemCount(entryId)
                    this.mElemList["propBox" + i].updateByItem(item)//updateByEntry(entryId, count, item.getRefProperty("quality") || opEquipQuality.gray)
                    this.mElemList["prop_bg" + i].visible = true

                    let need = item.getRefProperty("isbag")

                    if (item.getRefProperty("isbag") != 0 && count >= need) {
                        this.mElemList["image" + i].visible = true
                    } else {
                        this.mElemList["image" + i].visible = false
                    }

                } else {
                    this.mElemList["prop_bg" + i].visible = false
                }
            }
        }

    }


}