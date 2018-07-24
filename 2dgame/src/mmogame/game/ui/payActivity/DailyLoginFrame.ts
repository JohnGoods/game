// TypeScript file
//登录送元宝
class DailyLoginFrame extends BaseWnd {

    scroll: UIScrollList;
    controlDataTable: any;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/payActivity/DailyLoginLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        //this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["group_list"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "prize_scroll", 0, 0, group.width, group.height, group)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {

        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)

        this.mLayoutNode.visible = true;
        this.refreshFrame()

        RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.DAILY_LOGIN)
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
    }


    initItemWindow(window) {
        let name = window.name

        let mElemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_daybg", ["image"]: "sc_biaoTiDi01", ["color"]: gui.Color.white, ["x"]: 385, ["y"]: 5, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
            { ["index_type"]: eui.Label, ["name"]: name + "_day", ["title"]: "", ["font"]: "ht_22_cc", ["color"]: gui.Color.ublack, ["x"]: 385, ["y"]: 10, ["w"]: 160, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },

            { ["index_type"]: gui.Button, ["name"]: name + "_btn", ["title"]: Localize_cns("ACTIVITY_PAY_TXT6"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 405, ["y"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGetPrize, },
            { ["index_type"]: eui.Label, ["name"]: name + "_status", ["title"]: "", ["font"]: "ht_22_cc", ["color"]: gui.Color.ublack, ["x"]: 405, ["y"]: 50, ["w"]: 120, ["h"]: 50, ["fun_index"]: null, ["messageFlag"]: true, },
            { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "_btn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

        for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mElemList, name + "itemBox" + i, 20 + 86 * i, 20, window)
            //this.mElemList[name + "itemBox" + i].updateByEntry(SpecailItemId.FUNDS, 1000)
        }

    }

    refreshItemWindow(window, config, playerInfo) {
        
        let day = config.day - 1 //playerInfo是数组，从0开始
        let state = config.state

        //let loginDays = size_t(playerInfo)
        let prize_list = AnalyPrizeFormat(config.prize)
        let name = window.name
        for (let i = 0; i < 4; i++) {
            let itemBox: UIItemBox = this.mElemList[name + "itemBox" + i]

            let prize = prize_list[i]
            if (prize) {
                itemBox.setVisible(true)
                itemBox.updateByEntry(prize[0], prize[1])
            } else {
                itemBox.setVisible(false)
            }
        }

        if (state == 1) {//未达成
            this.mElemList[name + "_btn"].visible = false
            this.mElemList[name + "_status"].visible = true
            this.mElemList[name + "_status"].text = Localize_cns("ACTIVITY_PAY_TXT70")
            this.mElemList[name + "_status"].textColor = gui.Color.ublack
        } else if (state == 2) {//可领取
            this.mElemList[name + "_btn"].visible = true
            this.mElemList[name + "_status"].visible = false
        } else if (state == 3) {//已领取
            this.mElemList[name + "_btn"].visible = false
            this.mElemList[name + "_status"].visible = true
            this.mElemList[name + "_status"].text = Localize_cns("ACTIVITY_PAY_TXT7")
            this.mElemList[name + "_status"].textColor = gui.Color.green
        }


         this.mElemList[name + "_day"].text = String.format(Localize_cns("ACTIVITY_PAY_TXT4"), config.day)


         this.controlDataTable[name + "_btn"] = config
    }

    refreshFrame() {
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.DAILY_LOGIN)
        if(playerInfo == null)
            return

        let list = [] 
        let list1 = []
        let list2 = []
        let loginDays = 0
        let count = size_t(GameConfig.DailyLoginConfig)
        for (let i = 1; i <= count; i++) {
            let info = GameConfig.DailyLoginConfig[i]
            let day = info.day - 1
            let state = 0
            if(playerInfo[day] == null || playerInfo[day] == 0){
                state = 1   //未达成
            }else if (playerInfo[day] == 1){
                loginDays ++
                state = 2   //可领取
            }else if (playerInfo[day] == 2) {
                loginDays ++
                state = 3   //已领取
            }
            info.state = state

            if(state == 3){
                list2.push(info)
            }else{
                list1.push(info)
            }
        }

        for(let i = 0; i <size_t(list1); i++){
            list.push(list1[i])
        }

        for(let i = 0; i <size_t(list2); i++){
            list.push(list2[i])
        }

        let group = <eui.Group>this.mElemList["group_list"]
        let scroll = this.scroll
        scroll.clearItemList();
        this.controlDataTable = {}
        let hasNum = list.length
        for (let k = 0; k < list.length; k++) {
            let v = list[k]
            let [window, flag] = scroll.getItemWindow(k, 550, 120, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v, playerInfo)
        }

        this.mElemList["img_ad"].source = loginDays < 2 ? "syb_biaoTiTu01" : "syb_biaoTiTu02"
    }

    onClickGetPrize(args:egret.TouchEvent) {
        let name = args.target.name
        let config = this.controlDataTable[name]

        let rpcArgs:any = {}
        rpcArgs[1] = config.day
        RpcProxy.call("C2G_GetOperateActivityPrize", PayActivityIndex.DAILY_LOGIN, rpcArgs)
    }



}