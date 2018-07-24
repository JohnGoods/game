//宠物列表
module itemRender {
    export class PetUnionBoxList extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}

            let mElemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 120 },
                { ["index_type"]: eui.Label, ["name"]: "name", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: -10, ["y"]: 90, ["w"]: 120, ["h"]: 20, ["messageFlag"]: true }
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)

            this.mElemList["pet_box"] = UIPetBox.newObj(this, "pet_box", 10, 5, this.mElemList["group"])
            this.mElemList["pet_box"].setClickListner(this.onSelectPet, this)
            this.mElemList["pet_box"].clear()
            this.mElemList["pet_box"].setFightFlag(false)

            this.mElemList["pet_box"].setLock(true)
        }

        protected dataChanged(): void {
            let config = this.data.data
            let self = this.data.self

            this.mElemList["pet_box"].clear()

            this.mElemList["name"].text = PetSystem.getInstance().getPetName(config.Id)
            let petConfig = GameConfig.PetConfig[config.Id]
            if (petConfig) {
                this.mElemList["name"].textColor = GetQualityColorGui(petConfig.quality, true)
            }
            this.mElemList["pet_box"].updateByEntry(config.Id)

            //是否解锁
            let lockState = CheckPetIsUnLock(config.Id) || 0
            this.mElemList["pet_box"].setEnable(lockState == 2)
            this.mElemList["pet_box"].setLock(lockState)

            if (self.selectId == config.Id) {
                this.mElemList["pet_box"].select(true)
            }

            this.mElemList["pet_box"].setFightFlag(false)
        }

        onSelectPet() {
            let config = this.data.data
            let self = this.data.self

            self.selectId = config.Id
            self.clearSelectItemList()
            self.refreshFrame()

            RpcProxy.call("C2G_ActorPetCompound_Formula", config.Id)

            return true
        }
    }
}

//合成记录
module itemRender {
    export class PetUnionRecordList extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}

            let mElemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 570, ["h"]: 70 },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "detail_rd", ["parent"]: "group", ["x"]: 10, ["y"]: 5, ["w"]: 550, ["h"]: 60, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: "line", ["parent"]: "group", ["image"]: "cz_uiLine03", ["x"]: 0, ["y"]: 0, ["bottom"]: 0, ["w"]: 570, ["h"]: 16, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
        }

        protected dataChanged(): void {
            let entryId = this.data.Id
            let record = this.data.data || []
            let self = this.data.self

            if (size_t(record) == 0) {
                return
            }

            let playerName = record[0] || ""
            let rate = record[1] || 0
            let materialList = record[2] || []

            let itemStr = ""
            for (let i in materialList) {
                let itemId = materialList[i]
                let itemName = ItemSystem.getInstance().getItemName(itemId)
                itemStr = itemStr + itemName + "#space_10"
            }
            let str = String.format(Localize_cns("PET_UNION_TXT4"), playerName, rate * 100, itemStr)

            AddRdContent(this.mElemList["detail_rd"], str, "ht_20_cc_stroke", "white", 6)
        }
    }
}

//可选材料
class PetUnionMaterialWindow extends BaseCtrlWnd {
    dataList: any[]

    public initObj(...params: any[]) {
        this.dataList = []
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mElemList["material_wnd"].visible = true
    }

    public onHide(): void {
        this.mElemList["material_wnd"].visible = false
    }

    updateMaterialItemList(dataList) {
        if (size_t(dataList) <= 0) {
            return
        }

        this.dataList = dataList

        let wnd: eui.Group = this.mElemList["item_list"]
        let row = Math.ceil(size_t(dataList) / 2)
        UiUtil.setWH(wnd, wnd.width, row * 100)
        wnd.removeChildren()

        let ElemInfo = []
        for (let i in dataList) {
            table_insert(ElemInfo, { ["index_type"]: eui.Group, ["name"]: "item_group" + i, ["parent"]: "item_list", ["x"]: 0, ["y"]: 0, ["w"]: 90, ["h"]: 90 })
        }
        UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this)

        ElemInfo = []
        for (let i in dataList) {
            this.mElemList["choice_item" + i] = UIItemBox.newObj(this.mLayoutNode, "choice_item" + i, 0, 10, this.mElemList["item_group" + i])
            let entryId = dataList[i]
            this.mElemList["choice_item" + i].updateByEntry(entryId, ItemSystem.getInstance().getItemCount(entryId))
            if (ItemSystem.getInstance().getItemCount(entryId) <= 0) { //物品不足
                this.mElemList["choice_item" + i].setIconImageGray(true)
                this.mElemList["choice_item" + i].setItemTipsListner(function (logicItem) {
                    GetItemFastJump(logicItem.entryId)
                    return true
                }, this, entryId)
            }

            table_insert(ElemInfo, { ["index_type"]: eui.CheckBox, ["name"]: "item_check" + i, ["parent"]: "item_group" + i, ["image"]: "ty_xuanZheDi01", ["image_down"]: "ty_xuanZhe01", ["x"]: 45, ["y"]: -8, ["w"]: 45, ["h"]: 46, ["event_name"]: egret.TouchEvent.CHANGE, ["fun_index"]: this.onSelectItem })
        }
        UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this)

        for (let i in dataList) {
            this.mElemList["item_check" + i].selected = false
        }
    }

    onSelectItem(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");

        let entryId = this.dataList[index]
        if (entryId) {
            if (this.mParentWnd.checkItemSelect(entryId) && event.target.selected == false) { //选过了,第二次点击取消
                MsgSystem.addTagTips(Localize_cns("PET_UNION_TXT7") + ItemSystem.getInstance().getItemName(entryId))
                this.mParentWnd.outMaterial(entryId)
                return
            }

            //材料不足
            if (ItemSystem.getInstance().getItemCount(entryId) <= 0) {
                MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT8"))
                event.target.selected = false
                return
            }

            if (this.mParentWnd.checkItemFull()) { //满了
                MsgSystem.addTagTips(Localize_cns("PET_UNION_TXT5"))

                event.target.selected = false
                return
            }

            MsgSystem.addTagTips(Localize_cns("PET_UNION_TXT6") + ItemSystem.getInstance().getItemName(entryId))
            this.mParentWnd.inMaterial(entryId)
        }
    }
}