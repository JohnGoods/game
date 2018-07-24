class PayFrame extends BaseWnd {
    tabWndList: UITabWndList;
    payIndex: number;
    //scroll: UIScrollList;
    //list: any[];
    controlData:any;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pay/PayLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        //this.mLayoutNode.setDoModal(true)
        //this.setAlignCenter(true, true)
        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btn_power", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickVipPower },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        // let group = <eui.Group>this.mElemList["scroll_wnd"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
        let list: eui.List = this.mElemList["scroll_list"]
        list.itemRenderer = itemRender.PayListItem
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
        RegisterEvent(EventDefine.PAY_ACTIVITY_SELLPET, this.refreshFrame, this)
        this.mLayoutNode.visible = true;
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_SELLPET, this.refreshFrame, this)
        this.mLayoutNode.visible = false;
    }

    refreshVipWnd() {
        let vip = GetHeroProperty("VIP_level") || 0
        this.mElemList["vip_icon"].source = ("cz_vip" + String.format("%02d", vip))

        let remandGold = VipSystem.getInstance().GetVipFeed()
        let needDiaGold = VipSystem.getInstance().getVipSumDia(vip)

        let remand = GetRmbFromGold(remandGold)
        let needDia = GetRmbFromGold(needDiaGold)

        let tips = ""
        if (vip >= defaultValue.DEFALUT_VIP_MAX_LEVEL) {
            tips = Localize_cns("PAY_TXT3")
        } else {
            tips = String.format(Localize_cns("PAY_TXT4"), remand, (vip + 1))
        }

        AddRdContent(this.mElemList["rd_des"], tips, "ht_22_cc", "ublack")

        UiUtil.updateProgress(this.mElemList["exp_imb"], needDia - remand, needDia)
    }

    refreshFrame() {
        this.refreshVipWnd()

        this.onRefresh()
    }

    onRefresh() {
        let list: any[] = []
        let chargelist: any[] = []
        for (let k in GameConfig.RechargeConfig) {
            let v = GameConfig.RechargeConfig[k]

            if (v.Type == 1) {
                JsUtil.arrayInstert(chargelist, v)
            }

            if (v.Type == 2) {
                JsUtil.arrayInstert(list, v)
            }
        }

        table_sort(chargelist, function (a, b) {
            return a.RechargeId - b.RechargeId
        })

        for (let i in chargelist) {
            JsUtil.arrayInstert(list, chargelist[i])
        }

        let scrolllist: eui.List = this.mElemList["scroll_list"]
        UiUtil.updateList(scrolllist, list);

        //this.list = list

        // this.scroll.clearItemList()
        // this.controlData = {}

        // //for (let i in list) {
        // for(let i = 0; i < list.length; i ++){
        //     let index = Math.ceil((i + 1) / 2) - 1
        //     let [window, flag] = this.scroll.getItemWindow(index, 550, 158, 0, 0, 0)
        //     //if (flag == true) {
        //         this.initItemWindow(window, i)
        //     //}
        //     this.refreshItemWindow(window, list[i], i)
        // }

        // this.scroll.refreshScroll()
    }

    // initItemWindow(window, i) {
    //     let name = window.name

    //     let ElemInfo = [
    //         { ["index_type"]: eui.Group, ["name"]: name + "_group" + i, ["x"]: i % 2 * 278, ["y"]: 0, ["w"]: 272, ["h"]: 158 },
    //         { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg" + i, ["parent"]: name + "_group" + i, ["image"]: "cz_chongZhiDi02", ["x"]: 0, ["y"]: 0, ["w"]: 272, ["h"]: 158, ["messageFlag"]: true },
    //         { ["index_type"]: gui.Grid9Image, ["name"]: name + "_tag" + i, ["parent"]: name + "_group" + i, ["image"]: "cz_text02", ["x"]: 0, ["y"]: 0, ["w"]: 65, ["h"]: 61, ["messageFlag"]: true },
    //         { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_yuanbao" + i, ["parent"]: name + "_group" + i, ["x"]: 0, ["y"]: 12, ["w"]: 272, ["h"]: 30 },
    //         { ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon" + i, ["parent"]: name + "_group" + i, ["image"]: "cz_yuanBaoIcon01", ["x"]: -10, ["y"]: 40, ["w"]: 152, ["h"]: 133, ["messageFlag"]: true },

    //         { ["index_type"]: eui.Group, ["name"]: name + "_sp_group" + i, ["parent"]: name + "_group" + i, ["x"]: 99, ["y"]: 47, ["w"]: 173, ["h"]: 32, ["messageFlag"]: true },
    //         { ["index_type"]: gui.Grid9Image, ["name"]: name + "_sp_bg" + i, ["parent"]: name + "_sp_group" + i, ["image"]: "cz_textDi01", ["x"]: 0, ["y"]: 0, ["w"]: 173, ["h"]: 32, ["messageFlag"]: true },
    //         { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_sp_rd" + i, ["parent"]: name + "_sp_group" + i, ["x"]: 0, ["y"]: 8, ["w"]: 173, ["h"]: 30, ["messageFlag"]: true },

    //         { ["index_type"]: gui.Button, ["name"]: name + "_btn" + i, ["parent"]: name + "_group" + i, ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 165, ["y"]: 90, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRecharge },
    //     ]
    //     UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this, window)

    //     this.mElemList[name + "_tag" + i].visible = false
    //     this.mElemList[name + "_sp_group" + i].visible = false

    //     this.mElemList[name + "_yuanbao" + i].setAlignFlag(gui.Flag.H_CENTER)
    //     this.mElemList[name + "_sp_rd" + i].setAlignFlag(gui.Flag.H_CENTER)
    // }

    // refreshItemWindow(window, data, index) {
    //     let name = window.name

    //     this.controlData[name + "_btn" + index] = data

    //     let yuanbao = data.Rebate + data.Gain
    //     AddRdContent(this.mElemList[name + "_yuanbao" + index], yuanbao + data.title, "ht_22_cc_stroke", "white")

    //     this.mElemList[name + "_tag" + index].source = "cz_text0" + (3 - data.Type)

    //     this.mElemList[name + "_btn" + index].text = data.Tips

    //     //月卡
    //     if (data.Type == 2) {
    //         this.mElemList[name + "_icon" + index].source = "cz_yueKaIcon01"
    //         this.mElemList[name + "_sp_group" + index].visible = true
    //         this.mElemList[name + "_tag" + index].visible = true

    //         let monthEndTime = getSaveRecord(opSaveRecordKey.monthCard) || 0
    //         if (monthEndTime > GetServerTime()) {
    //             let times = monthEndTime - GetServerTime()
    //             let str = String.format(Localize_cns("MONTH_ACTIVITY_TIME"), Math.ceil(times / (24 * 3600)))
    //             AddRdContent(this.mElemList[name + "_sp_rd" + index], str, "ht_18_cc_stroke", "white")
    //         } else {
    //             let str = String.format(Localize_cns("PAY_TXT5"), 1000)
    //             AddRdContent(this.mElemList[name + "_sp_rd" + index], str, "ht_18_cc_stroke", "white")
    //         }
    //     } else {
    //         this.mElemList[name + "_icon" + index].source = data.Image || "cz_yuanBaoIcon01"

    //         let recordList = getSaveRecord(opSaveRecordKey.FirstRecharge) || []
    //         let isFirst = false
    //         for (let i in recordList) {
    //             if (recordList[i] == index) {
    //                 isFirst = true
    //             }
    //         }
    //         this.mElemList[name + "_sp_group" + index].visible = !isFirst
    //         this.mElemList[name + "_tag" + index].visible = !isFirst

    //         let str = String.format(Localize_cns("PAY_TXT6"), data.First)
    //         AddRdContent(this.mElemList[name + "_sp_rd" + index], str, "ht_18_cc_stroke", "white")
    //     }
    // }

    // onClickRecharge(event: egret.TouchEvent) {
    //     let name = event.target.name
        
    //     let data = this.controlData[name]

    //     PaySystem.getInstance().payFromId(data.RechargeId)
    // }

    onClickVipPower() {
        ExecuteMainFrameFunction("VIP")
    }
}







module itemRender {
    export class PayListItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = "pay"

            let ElemInfo = [
                { ["index_type"]: eui.Group, ["name"]: name + "_group" , ["x"]: 0, ["y"]: 0, ["w"]: 272, ["h"]: 158 },
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg" , ["parent"]: name + "_group" , ["image"]: "cz_chongZhiDi02", ["x"]: 0, ["y"]: 0, ["w"]: 272, ["h"]: 158, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_tag" , ["parent"]: name + "_group" , ["image"]: "cz_text02", ["x"]: 0, ["y"]: 0, ["w"]: 65, ["h"]: 61, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_yuanbao" , ["parent"]: name + "_group" , ["x"]: 0, ["y"]: 12, ["w"]: 272, ["h"]: 30 },
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon" , ["parent"]: name + "_group" , ["image"]: "cz_yuanBaoIcon01", ["x"]: -10, ["y"]: 40, ["w"]: 152, ["h"]: 133, ["messageFlag"]: true },

                { ["index_type"]: eui.Group, ["name"]: name + "_sp_group" , ["parent"]: name + "_group" , ["x"]: 99, ["y"]: 47, ["w"]: 173, ["h"]: 32, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_sp_bg" , ["parent"]: name + "_sp_group" , ["image"]: "cz_textDi01", ["x"]: 0, ["y"]: 0, ["w"]: 173, ["h"]: 32, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_sp_rd" , ["parent"]: name + "_sp_group" , ["x"]: 0, ["y"]: 8, ["w"]: 173, ["h"]: 30, ["messageFlag"]: true },

                { ["index_type"]: gui.Button, ["name"]: name + "_btn" , ["parent"]: name + "_group" , ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 165, ["y"]: 90, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRecharge },
            ]
            UiUtil.createElem(ElemInfo, this, this.mElemList, this)

            this.mElemList[name + "_tag" ].visible = false
            this.mElemList[name + "_sp_group" ].visible = false

            this.mElemList[name + "_yuanbao" ].setAlignFlag(gui.Flag.H_CENTER)
            this.mElemList[name + "_sp_rd" ].setAlignFlag(gui.Flag.H_CENTER)
        }

        protected dataChanged(): void {
            let data = this.data
            let name = "pay"

            let yuanbao = data.Rebate + data.Gain
            AddRdContent(this.mElemList[name + "_yuanbao" ], yuanbao + data.UnitName, "ht_22_cc_stroke", "white")

            this.mElemList[name + "_tag" ].source = "cz_text0" + (3 - data.Type)

            this.mElemList[name + "_btn" ].text = data.Tips

            //月卡
            if (data.Type == 2) {
                this.mElemList[name + "_icon" ].source = "cz_yueKaIcon01"
                this.mElemList[name + "_sp_group" ].visible = true
                this.mElemList[name + "_tag" ].visible = true

                let monthEndTime = getSaveRecord(opSaveRecordKey.monthCard) || 0
                if (monthEndTime > GetServerTime()) {
                    let times = monthEndTime - GetServerTime()
                    let str = String.format(Localize_cns("MONTH_ACTIVITY_TIME"), Math.ceil(times / (24 * 3600)))
                    AddRdContent(this.mElemList[name + "_sp_rd" ], str, "ht_18_cc_stroke", "white")
                } else {
                    let str = String.format(Localize_cns("PAY_TXT5"), 1000)
                    AddRdContent(this.mElemList[name + "_sp_rd" ], str, "ht_18_cc_stroke", "white")
                }
            } else {
                this.mElemList[name + "_icon" ].source = data.Image || "cz_yuanBaoIcon01"

                let recordList = getSaveRecord(opSaveRecordKey.FirstRecharge) || []
                let isFirst = false
                for (let i in recordList) {
                    if (recordList[i] == data.RechargeId) {
                        isFirst = true
                    }
                }
                this.mElemList[name + "_sp_group" ].visible = !isFirst
                this.mElemList[name + "_tag" ].visible = !isFirst

                let str = String.format(Localize_cns("PAY_TXT6"), data.First)
                AddRdContent(this.mElemList[name + "_sp_rd" ], str, "ht_18_cc_stroke", "white")
            }
        }

        
        onClickRecharge(event: egret.TouchEvent) {
            // let name = event.target.name
            // let data = this.controlData[name]
            let data = this.data

            PaySystem.getInstance().payFromId(data.RechargeId)
        }

    }
}