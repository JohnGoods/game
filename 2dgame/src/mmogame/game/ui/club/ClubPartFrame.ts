// TypeScript file
class ClubPartFrame extends BaseWnd {
    item: Item;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/club/ClubPartLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let list: eui.List = this.mElemList["scroll"]
        list.itemRenderer = itemRender.ClubPartItem
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.CLUB_REPO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.GET_CLUB_MENBER_LIST, this.refreshFrame, this)
        this.mLayoutNode.visible = true;

        RpcProxy.call("C2G_FactionMemberRefresh")

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.CLUB_REPO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.GET_CLUB_MENBER_LIST, this.refreshFrame, this)
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        if (!this.item) {
            return
        }

        let itemList = ClubSystem.getInstance().getClubStoreItemList() || []
        let isExit = false
        for (let _ in itemList) {
            if (this.item.entryId == itemList[_].entryId) {
                this.item = itemList[_]
                isExit = true
            }
        }

        if (!isExit) {
            this.hideWnd() //分配完了
            return
        }

        let infoList = ClubSystem.getInstance().getClubMemberList()
        let dataList = []
        for (let _ in infoList) {
            let t: any = {}
            t.data = infoList[_]
            t.self = this
            table_insert(dataList, t)
        }

        let list: eui.List = this.mElemList["scroll"]
        UiUtil.updateList(list, dataList)

        let myInfo = null
        for (let i = 0; i < size_t(infoList); i++) {
            if (infoList[i].id == GetHeroProperty("id")) {
                myInfo = infoList[i]
            }
        }

        let myJob = ClubSystem.getInstance().getPosName(myInfo.post)
        let colorText = ClubSystem.getInstance().getPosNameColor(myInfo.post)
        let postText = Localize_cns("CLUB_TXT48") + colorText + myJob
        let contributeNum = myInfo.contribute
        let contributeText = Localize_cns("CLUB_TXT49") + "#green" + contributeNum
        AddRdContent(this.mElemList["my_rd"], postText + "#space_10#ublack" + contributeText, "ht_22_cc", "ublack")
    }

    ////////////////////////////////////////////////////////////////////////////
    showWithItem(info) {
        this.item = info
        this.showWnd()
    }
}

module itemRender {
    export class ClubPartItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}

            let mElemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 560, ["h"]: 130 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 560, ["h"]: 130 },

                //头像
                { ["index_type"]: gui.Grid9Image, ["name"]: "icon_bg", ["parent"]: "group", ["image"]: "ty_renWuKuang01", ["x"]: 0, ["y"]: -10, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: "icon", ["parent"]: "icon_bg", ["image"]: "zctx_90001", ["x"]: 0, ["y"]: 0, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },

                //详情
                { ["index_type"]: gui.RichDisplayer, ["name"]: "detail_rd", ["parent"]: "group", ["x"]: 135, ["y"]: 17, ["w"]: 400, ["h"]: 90, ["messageFlag"]: true },

                { ["index_type"]: gui.Button, ["name"]: "part_btn", ["parent"]: "group", ["title"]: Localize_cns("CLUB_STORE_TXT5"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["image"]: "ty_tongYongBt3", ["x"]: 420, ["y"]: 35, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.partItem },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
        }

        protected dataChanged(): void {
            let data = this.data.data
            let self = this.data.self

            let colorText = ClubSystem.getInstance().getPosNameColor(data.post)
            let posName = ClubSystem.getInstance().getPosName(data.post)
            let roleName = data.name

            let contribute = data.contribute
            let force = data.force

            let onLineStr = ""
            if (data.online == 1) {
                onLineStr = Localize_cns("SANSHENG_TXT28")
            } else {
                if (data.logout == 0) {
                    onLineStr = Localize_cns("CLUB_TXT65")
                } else {
                    onLineStr = GetLastLogoutTimeStr(data.logout)
                }
            }

            let str = String.format(Localize_cns("CLUB_STORE_TXT6"), colorText, posName, roleName, contribute, force, onLineStr)
            AddRdContent(this.mElemList["detail_rd"], str, "ht_22_cc", "white", 3)

            this.mElemList["icon"].source = GetProfessionIcon(data.vocation, data.sexId)

        }

        partItem() {
            let data = this.data.data
            let self = this.data.self

            //是否满足分配时间要求
            let item: Item = self.item
            let itemTime = item.getProperty("store_time")
            let joinTime = data.joinTime
            if (joinTime > itemTime) {
                MsgSystem.addTagTips(Localize_cns("CLUB_STORE_TXT8"))
                return
            }

            let wnd = WngMrg.getInstance().getWindow("PartComputeFrame")
            wnd.showWithData(self.item, data)
        }
    }
}