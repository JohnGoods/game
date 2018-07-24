class NoticeListFrame extends BaseWnd implements core.IHttpCallback {
    bEnterGameShow: boolean;
    readStateList: any;
    dataList: any[];
    //CREATED_COUNT: number;
    indexToTitle: any;
    indexToId: any;

    scroll: UIScrollList;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/NoticeListLayout.exml"]

        this.bEnterGameShow = false

        this.readStateList = {}

        this.dataList = []

        //this.CREATED_COUNT = 0

        this.indexToTitle = {}

        this.indexToId = {}

        RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.setDoModal(true)
        this.setAlignCenter(true, true)
        this.initSkinElemList();



        var elemInfo = [
            //{ ["name"]: "title", ["font"]: "ht_30_cc_stroke", ["color"]: gui.Color.white },
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let name = "scroll"
        let group: eui.Group = this.mElemList["scroll_bg"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, name, 0, 0, 560, 535, group)
    }

    public onUnLoad(): void {
        this.mLayoutNode.setDoModal(false)
    }

    public onShow(): void {

        this.mLayoutNode.visible = true;
        this.refreshFrame()
    }

    public onHide(): void {

        this.mLayoutNode.visible = false;
    }

    onHeroEnterGame(args) {
        this.readStateList = {}

        if (IsCrossServer()) {
            return
        }

        this.bEnterGameShow = true
        this.onCheckPublicNotice()
    }

    onCheckPublicNotice() {
        let qd_key = SdkHelper.getInstance().getStringConfigDef("QD_Key")
        let urlMap: any = {
            //["openxlive"] : "http://center.wp.nwzr.net/nwzr/common/get_notice_info.php",
            //["tongios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["haimaios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["xyzsios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["aisiios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["downjoyios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["itoolios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["kyios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["bdios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",
            //["baijinios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_info.php",		
            ////台湾IOS临时写死
            //["flyfishios"]:"http://61.219.16.40/nwzr/common/get_notice_info.php",		
        }
        let http_url = urlMap[qd_key] || ""
        if (http_url == "") {
            http_url = SdkHelper.getInstance().getStringConfigDef("PublicNoticeUrl")
        }

        if (http_url == "") {
            return
        }

        //let serverinfo = LoginSystem.getInstance().getRecentLoginServerInfo()
        //if (serverinfo == null) {
        //    return
        //}
        //let zoneId = serverinfo.ServerID
        let gameId = LoginSystem.getInstance().getSelectServerGameID()
        let zoneId = gameId

        let allUrl = http_url + "?platform=" + qd_key + "&zoneid=" + zoneId
        TLog.Debug(allUrl)
        IGlobal.httpClient.send(allUrl, this, 200)
        if (!this.bEnterGameShow) {
            FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
        }
    }

    refreshFrame() {
        let dataList = this.dataList //{1,2,12,58,89,85,62,63,52}
        let curCount = size_t(dataList)
        //let num = curCount
        //curCount = (curCount > this.CREATED_COUNT) ? curCount : this.CREATED_COUNT

        this.indexToTitle = {}
        this.indexToId = {}

        let scroll = this.scroll
        scroll.clearItemList()
        //取已创建的和需求之间的最大值去刷新
        for (let k = 0; k < curCount; k++) {
            let v = dataList[k]

            let [window, flag] = scroll.getItemWindow(k, 560, 110, 0, 0)

            if (flag == true) {
                this.initItemWindow(window)
            }

            //this.CREATED_COUNT = this.CREATED_COUNT + 1

            this.refreshItemWindow(window, v, k)
        }
        scroll.refreshScroll()
    }

    initItemWindow(window) {
        let name = window.name
        let Info = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_UIDi08", ["x"]: 0, ["y"]: 0, ["w"]: 560, ["h"]: 110, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onDetail },
            { ["index_type"]: eui.Label, ["name"]: name + "_noticeTitle", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.maroon, ["x"]: 0, ["y"]: 40, ["w"]: 560, ["h"]: 30, ["messageFlag"]: true },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
    }

    refreshItemWindow(window, data, index) {
        let name = window.name
        this.mElemList[name + "_noticeTitle"].text = (data[2] || "")

        if (data[1] == 1) {
            //重要
        } else if (data[1] == 0) {
            //不重要
        }

        let id = data[0]

        if (this.readStateList[id] == null) {
            //未读
        } else {
            //已读
        }

        this.indexToTitle[name + "_bg"] = data[2]
	    this.indexToId[name + "_bg"] = data[0]
    }

    onDetail(args) {
        let name = args.target.name
        let id = this.indexToId[name]
        let title = this.indexToTitle[name]
        let obj: any = {}
        let self = this
        obj.onHttpResponse = function (url: string, data: any, userData: any) {
            //解析返回数据
            let jsonInfo = JsUtil.JsonDecodeSafeFormat(data);

            FireEvent(EventDefine.MSG_WAIT_END, null)
            let wnd = WngMrg.getInstance().getWindow("NoticeDetailFrame")

            let txt = jsonInfo.txt
            let jsurl = jsonInfo.url
            wnd.showWithTitle(title, txt, jsurl)

            if (!self.readStateList[id]) {
                self.readStateList[id] = true
                //已读
            }
        }

        obj.onHttpError = function (url: string, userData: any) {
            FireEvent(EventDefine.MSG_WAIT_END, null)
        }

        let qd_key = SdkHelper.getInstance().getStringConfigDef("QD_Key")
        let urlMap: any = {
            //["openxlive"] : "http://center.wp.nwzr.net/nwzr/common/get_notice_detail.php",
            //["tongios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["haimaios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["xyzsios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["aisiios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["downjoyios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["itoolios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["kyios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["bdios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",
            //["baijinios"]:"http://center.ios.nwzr.net/nwzr/common/get_notice_detail.php",		
        }
        let http_url = urlMap[qd_key] || ""
        if (http_url == "") {
            http_url = SdkHelper.getInstance().getStringConfigDef("PublicNoticeContentUrl")
        }

        if (http_url == "") {
            return
        }

        let allUrl = http_url + "?platform=" + qd_key + "&id=" + id + "&geturl=1"
        IGlobal.httpClient.send(allUrl, obj, 203)
        FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
    }

    /////////////////////////////////////////////////////////////////////////////////
    onHttpResponse(url: string, data: any, userData: any) {
        //解析返回数据
        FireEvent(EventDefine.MSG_WAIT_END, null)

        let jsonContent = JsUtil.JsonDecode(data);
        this.dataList = jsonContent
        let guideFinished = true
        if (GuideSystem.getInstance().isCanClientAutoUI() == false) {
            guideFinished = false
        }

        //H5屏蔽自动打开公告
        guideFinished = false;

        if (size_t(this.dataList) > 0 && this.bEnterGameShow && guideFinished) {
            if (!this.isVisible()) {
                this.showWnd()
            } else {
                this.refreshFrame()
            }
        } else {
            if (this.isVisible()) {
                this.refreshFrame()
            }
        }

        this.bEnterGameShow = false
    }

    onHttpError(url: string, userData: any) {
        FireEvent(EventDefine.MSG_WAIT_END, null)
    }
}