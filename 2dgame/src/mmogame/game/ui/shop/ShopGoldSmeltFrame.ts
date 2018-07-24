class ShopGoldSmeltFrame extends BaseWnd {
    mElemList;
    select: any;
    controlData

    static GOLD_EQUIP_FENJIE_ITEM = 60019
    //static GOLD_EQUIP_ITEM_QUALITY = 5

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/ShopGoldSmeltLayout.exml"]
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 600
        this.mLayoutNode.height = 728
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["item_list"]
        list.itemRenderer = itemRender.ShopGoldSmeltItem

        this.select = -1

        this.mElemList["rd_had"].setAlignFlag(gui.Flag.RIGHT_CENTER)

        let approachList = [
            ["mat_copy", 2], ["boss", 2], ["lucky", 0]
        ]

        for (let k = 1; k <= 3; k++) {
            let tipInfo: any = {}
            tipInfo.showTips = Localize_cns("SHOP_GOLD_ACCESS_TXT" + k)
            tipInfo.approach = approachList[k - 1] || []
            let linkView: UILinkView = UILinkView.newObj(this.mLayoutNode, "linkView" + k, 0, 0, this.mElemList["grouo_access"])
            this.mElemList["linkView" + k] = linkView
            linkView.updateByTips(tipInfo)
            linkView.setCallBack(this.onAccessClick, this, tipInfo)
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true)
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
    }

    onRefresh() {

        let hadStr = GetTagIcon(ShopGoldSmeltFrame.GOLD_EQUIP_FENJIE_ITEM) + ItemSystem.getInstance().getItemCount(ShopGoldSmeltFrame.GOLD_EQUIP_FENJIE_ITEM)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")

        let showList = ItemSystem.getInstance().getGoldEquipSmeltList(opEquipQuality.gold)
        let item_list: eui.List = this.mElemList["item_list"]
        UiUtil.updateList(item_list, showList);


    }



    ///////---------------------
    onAccessClick(userData) {
        let approach = userData.approach
        if (approach && size_t(approach) != 0) {
            let check = FastJumpSystem.getInstance().checkQuickAccess(approach[0], approach[1] || 0)
            if (check[0] == false) {
                if (check[1] === "") return
                MsgSystem.addTagTips(check[1])
            } else {
                FastJumpSystem.getInstance().doQuickAccess(approach[0], approach[1] || 0)
                this.hideWnd()
            }
        }
    }

}


module itemRender {
    export class ShopGoldSmeltItem extends eui.ItemRenderer {
        mElemList: any;
        controlData: any
        constructor() {
            super();
            this.mElemList = {}
            this.controlData = {}
            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: "_bg", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_uiDi03", ["color"]: gui.Color.ublack, ["x"]: 0, ["y"]: 0, ["w"]: 490, ["h"]: 100, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "_name", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: null, ["color"]: gui.Color.ublack, ["x"]: 129, ["y"]: 20, ["w"]: 202, ["h"]: 20, ["messageFlag"]: true },

                { ["index_type"]: gui.Grid9Image, ["name"]: "_bg_fenjie", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_textDi01", ["color"]: gui.Color.ublack, ["x"]: 123, ["y"]: 50, ["w"]: 220, ["h"]: 30, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "_fenjie", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: null, ["color"]: gui.Color.ublack, ["x"]: 129, ["y"]: 55, ["w"]: 202, ["h"]: 20, ["messageFlag"]: true },

                { ["index_type"]: gui.Button, ["name"]: "_btn_fenjie", ["title"]: Localize_cns("FABAO_TITLE_TXT4"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 360, ["y"]: 26, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFenjieClick },
            ];
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)

            this.mElemList["_fenjie"].setAlignFlag(gui.Flag.CENTER_CENTER)
            this.mElemList["_itemBox"] = UIItemBox.newObj(this, "_itemBox", 28, 10, this)
        }

        protected dataChanged(): void {
            let config = this.data
            //this.controlData 
            this.mElemList["_itemBox"].updateByItem(config)

            let itemName = config.getName()
            let itemLevel = config.getRefProperty("level")
            let suit = config.getRefProperty("suit")
            let quality = config.getProperty("quality")

            let meltConfig = GameConfig.RoleEquipMelt[suit][quality]
            let formatStr = GetTagIcon(meltConfig.itemid) + meltConfig.itemnum
            this.mElemList["_name"].text = itemName + Localize_cns("ITEM_TXT34") + itemLevel
            let content = String.format(Localize_cns("SHOP_GOLD_TXT4"), formatStr)
            AddRdContent(this.mElemList["_fenjie"], content, "ht_20_cc")
        }

        onFenjieClick(args: egret.TouchEvent) {

            let item: Item = this.data//this.controlData[index]
            if (item == null) return
            RpcProxy.call("C2G_GoldEquipMelt", [item.id])
        }
    }

}