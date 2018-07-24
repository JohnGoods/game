// TypeScript file

class SocialBlackListWindow extends BaseCtrlWnd {
    scroll: UIScrollList;
    list: any[]

    public initObj(...params: any[]): void {
        this.list = []
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        let group = <eui.Group>this.mElemList["black_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "black_scroll", 0, 0, group.width, group.height, group)
    }


    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.BLACK_INFO_LIST, this.refresh, this)
        this.mElemList["black_wnd"].visible = true
        let message = GetMessage(opCodes.C2G_ROLE_REQUEST_BLACK_ROLE)
		SendGameMessage(message)
        this.refresh();
    }
    public onHide(): void {
        UnRegisterEvent(EventDefine.BLACK_INFO_LIST, this.refresh, this)
        this.mElemList["black_wnd"].visible = false
    }

    refresh() {
        let list = FriendSystem.getInstance().getBlackList()

        let show_list = []

        for (let index in list) {
            let info = list[index]
            show_list.push(info);
        }
        this.list = show_list

        this.scroll.clearItemList()

        let group = <eui.Group>this.mElemList["black_wnd"]
        for (let i = 0; i < size_t(show_list); i++) {
            let v = show_list[i]
            let [window, flag] = this.scroll.getItemWindow(i, group.width, 80, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }
        this.scroll.refreshScroll()
    }

    initItemWindow(window) {
        let name = window.name
        let w = window.width
        let h = window.height

        let Info = [
            //背景
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            //玩家
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_rd", ["x"]: 20, ["y"]: 30, ["w"]: w - 170, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null },
            //按钮
            { ["index_type"]: gui.Button, ["name"]: name + "_btn", ["title"]: Localize_cns("RENAME_TXT5"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: w - 120, ["y"]: 15, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBlackRemove },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

        
    }

    refreshItemWindow(window, data) {
        let name = window.name
        let str = String.format(Localize_cns("FRIENDS_TXT12"),data[1])
        AddRdContent(this.mElemList[name + "_rd"], str, "ht_24_cc", "ublack")
    }

    onClickBlackRemove(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "")

        let info = this.list[index]
        if (info) {
            FriendSystem.getInstance().removePlayerBlackList(info[0])
        }
    }
}