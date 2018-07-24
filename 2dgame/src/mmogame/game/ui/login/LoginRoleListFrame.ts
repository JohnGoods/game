// TypeScript file


class LoginRoleListFrame extends BaseWnd {
    scroll: UIScrollList
    lastRoleInfo: LoginRole;
    controlDataTable: any;


    autoLoginTimer: any;
    autoTime: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/login/LoginRoleListLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreenRaw(true)
        this.initSkinElemList();
        

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            //{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let parentWnd:eui.Group = this.mElemList["role_list_wnd"]

        let window = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, parentWnd.width, parentWnd.height - 10, parentWnd)

        this.scroll = window
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.resetAutoLoginTimer, this)
        this.mLayoutNode.visible = true;
        this.refreshUI()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.resetAutoLoginTimer, this)
        this.mLayoutNode.visible = false;
        this.resetAutoLoginTimer()
    }

    initItemWindow(wnd) {
        let name = wnd.name

        let mElemInfo1: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "bg", ["title"]: "", ["font"]: null, ["image"]: "ty_UIBg11", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: wnd.width, ["h"]: wnd.height, ["event_name"]: null, ["fun_index"]: null },

            { ["index_type"]: eui.Label, ["name"]: name + "roleInfo", ["title"]: "name", ["font"]: "ht_24_lc", ["image"]: "", ["color"]: null, ["x"]: 25, ["y"]: 30, ["w"]: 200, ["h"]: 40, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
            { ["index_type"]: eui.Label, ["name"]: name + "lastLogin", ["title"]: Localize_cns("LAST_LOGIN_ROLE"), ["font"]: "ht_24_rc", ["image"]: "", ["color"]: gui.Color.red, ["x"]: 220, ["y"]: 30, ["w"]: 180, ["h"]: 40, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

            { ["index_type"]: gui.Button, ["name"]: name + "sure_btn", ["title"]: Localize_cns("LOGIN_INFO"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 430, ["y"]: 20, ["w"]: 120, ["h"]: 70, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSure },

        ]
        UiUtil.createElem(mElemInfo1, this.mLayoutNode, this.mElemList, this, wnd)
        return wnd
    }

    refreshItemWindow(wnd, info, lastRoleId) {
        let name = wnd.name

        this.controlDataTable[name + "sure_btn"] = info

        let roleStr = String.format("Lv.%d %s", info.level, info.name)

        this.mElemList[name + "roleInfo"].text = (roleStr)

        this.mElemList[name + "lastLogin"].visible = (info.id == lastRoleId)
    }

    refreshUI() {
        let list = LoginSystem.getInstance().getRoleInfoList()
        let lastRoleID = LoginSystem.getInstance().getLastLoginRoleID()

        // let list:any = {}
        // let lastRoleID = -1
        // for(let i = 1; i <=  2;i++){
        // 	let info = LoginRole.newObj()
        // 	info.id = i
        // 	info.name = "test" ..i 
        // 	info.level = i
        // 	info.body = 0
        // 	JsUtil.arrayInstert(list, info)
        // }


        this.lastRoleInfo = null

        let scroll = this.scroll
        scroll.clearItemList()
        this.controlDataTable = {}
        for (let k = 0; k < list.length; k++) {
            let v = list[k]

            let [window, flag] = scroll.getItemWindow(k, 570, 110, 0, 5, 5)

            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v, lastRoleID)

            if (lastRoleID == v.id) {
                this.lastRoleInfo = v
            }
        }
        scroll.refreshScroll()


        //TLog.Debug("LoginRoleListFrame.refreshUI",totalHeight)
        if (this.lastRoleInfo) {  //找到上次登陆角色
            this.startAutoLoginTimer()
        }
    }


    onClickSure(args: egret.TouchEvent) {

        let wnd = args.target
        let name = wnd.name

        let info = this.controlDataTable[name]
        LoginSystem.getInstance().startGameConnection(info)
        this.resetAutoLoginTimer()

    }


    resetAutoLoginTimer() {
        if (this.autoLoginTimer) {
            KillTimer(this.autoLoginTimer)
            this.autoLoginTimer = null
        }
        
        if (this.mElemList["group_tips"]) {
            this.mElemList["group_tips"].visible = (false)
        }
    }
    startAutoLoginTimer() {
        this.resetAutoLoginTimer()
        this.autoTime = 4
        this.mElemList["group_tips"].visible = (true)
        this.autoLoginTimer = SetTimer(this.autoTimerFunc, this, 1000, true)

    }
    autoTimerFunc(dt) {
        if (this.autoTime == 1) {
            if (this.lastRoleInfo) {
                LoginSystem.getInstance().startGameConnection(this.lastRoleInfo)
            }
            this.resetAutoLoginTimer()
            return
        } else {
            this.autoTime = this.autoTime - 1
            if (this.mElemList["group_tips"].visible) {
                let str = String.format(Localize_cns("AUTO_LOGIN_ROLE1"), this.autoTime)
                this.mElemList["tips_title"].text = (str)
            }
        }
    }



}

