// TypeScript file
class MailListFrame extends BaseWnd {
    mail_list: any[];
    emptyView: UIEmptyView;
    
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/MailListLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "getAllBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGetAllBtn },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        
        
        let list: eui.List = this.mElemList["list_email"]
      
        list.itemRenderer = itemRender.MailListItem

        this.emptyView = UIEmptyView.newObj(this.mLayoutNode, 110, 240)
        this.emptyView.setDescText(Localize_cns("EMPTY_EMAIL_TEXT"))
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.MAIL_LIST, this.onRefresh, this)
        RegisterEvent(EventDefine.MAIL_READ, this.onRefresh, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true) ;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.MAIL_LIST, this.onRefresh, this)
        UnRegisterEvent(EventDefine.MAIL_READ, this.onRefresh, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false) ;
    }


    onRefresh() {
        this.mail_list = MailSystem.getInstance().getMailList()
        //TLog.Debug("================this.mail_list==============")
        //TLog.Debug_r(this.mail_list)
        // if (!this.mail_list) {
        //     return
        // }
        if (size_t(this.mail_list) == 0) {
            this.emptyView.setVisible(true)
            this.mElemList["getAllBtn"].enabled = (false)
        } else {
            this.emptyView.setVisible(false)
            this.mElemList["getAllBtn"].enabled = (true)
        }

        //对邮件未读取排序
        table_sort(this.mail_list, function (a, b) {
            if (a.status != b.status) {
                return b.status - a.status
            } else {
                return b.send_time - a.send_time
            }
        })


        let list: eui.List = this.mElemList["list_email"]
        UiUtil.updateList(list, this.mail_list);
    }

    onClickGetAllBtn() {
        //this.scroll.clearItemList()
        let mailList = MailSystem.getInstance().getMailList()
        if (size_t(mailList) > 0) {
            let message = GetMessage(opCodes.C2G_EMAIL_ALL)
            SendGameMessage(message)
        } else {
            MsgSystem.addTagTips(Localize_cns("EMAIL_IS_NULL"))
        }
    }


}


module itemRender {
    export class MailListItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = this.name
            let w = 500
            let h = 106

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: "emailbg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickEmail },
                { ["index_type"]: eui.Image, ["name"]: "emailicon", ["bAdapteWindow"]: true,["title"]: "", ["image"]: "yj_youJianIcon01", ["x"]: 10, ["y"]: 8, ["w"]: 90, ["h"]: 90, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "emailsender", ["title"]: "", ["font"]: "ht_24_lc", ["image"]: null, ["color"]: gui.Color.saddlebrown, ["x"]: 112, ["y"]: 8, ["w"]: 300, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "emaildate", ["title"]: "", ["font"]: "ht_24_lc", ["image"]: null, ["color"]: gui.Color.ublack, ["x"]: 112, ["y"]: 52, ["w"]: 200, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
        }

        protected dataChanged(): void {
            let v = this.data;

            let name = String.format(Localize_cns("EMAIL_SENDER"), v.name)
            //let time = String.format("%d-%d-%d", os.date("%Y", v.send_time), os.date("%m", v.send_time), os.date("%d", v.send_time))
            let time = getFormatTime(v.send_time)
            this.mElemList["emailsender"].text = (name)
            if (v.name == "") {
                this.mElemList["emailsender"].text = (Localize_cns("EMAIL_SENDER_SYSTEM"))
            }
            this.mElemList["emaildate"].text = (time)

            if (v.status == opEmailStatus.UnReadNoGet) {
                this.mElemList["emailicon"].source = ("yj_youJianIcon01")
            } else {
                this.mElemList["emailicon"].source = ("yj_youJianIcon02")
            }
        }

        onClickEmail(args) {
            let v = this.data;

            this.mElemList["emailicon"].source = ("yj_youJianIcon02")

            let wnd = WngMrg.getInstance().getWindow("MailFrame")
            wnd.showWithMailInfo(v)
            //发送已读信息
            if (v["status"] == opEmailStatus.UnReadNoGet) {
                let message = GetMessage(opCodes.C2G_EMAIL_READ)
                message.id = v["id"]
                SendGameMessage(message, true)
            }
        }

    }
}