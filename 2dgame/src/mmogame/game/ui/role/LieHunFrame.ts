class LieHunFrame extends BaseWnd {
    select

    actor_body: UIActorView
    actor_hand: UIActorView
    actor_deng: UIActorView

    actor_qi: UIActorView
    action_qi: MoveAction

    //animList: UIActorView[]
    actionList: MoveAction[]
    timerList: number[]

    hunList
    posList
    catch_timer

    itemList

    itemActorList

    watting

    MODEL_BODY = 9028
    MODEL_HAND = 9029
    MODEL_DENG = 9030
    MODEL_WUQI = 9036

    // MODEL_HUI = 9037
    // MODEL_QING = 9035
    // MODEL_LAN = 9034
    // MODEL_ZI = 9033
    // MODEL_JIN = 9032

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/LieHunLayout.exml"]
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

        ];

        for (let k = 1; k <= 2; k++) {
            table_insert(elemInfo, { ["name"]: "btn_" + k, ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBtnClick })
            table_insert(elemInfo, { ["name"]: "check_" + k, ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCheckClick })
        }

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["rd_1"].setAlignFlag(gui.Flag.CENTER_CENTER)
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.CENTER_CENTER)

        let list: eui.List = this.mElemList["item_list"]
        list.itemRenderer = itemRender.LieHunItem

        this.actor_body = UIActorView.newObj(this.mLayoutNode, "actor_view_body", 0, 0, this.mElemList["actor_body"])
        this.actor_hand = UIActorView.newObj(this.mLayoutNode, "actor_view_hand", 0, 0, this.mElemList["actor_hand"])
        this.actor_deng = UIActorView.newObj(this.mLayoutNode, "actor_view_deng", 0, 0, this.mElemList["actor_deng"])

        this.actor_qi = UIActorView.newObj(this.mLayoutNode, "actor_view_qi", 0, 0, this.mElemList["actor_qi"])
        this.actor_qi.setActorScale(2.5)

        let y = 83
        let data: any = { ["startX"]: -300, ["startY"]: y, ["endX"]: 900, ["endY"]: y, ["moveType"]: "inertional", }
        let _this = this
        this.action_qi = MoveAction.newObj(this.mElemList["actor_qi"], 2000, data, function () {
            _this.action_qi.run()
        }, this)

        this.hunList = []
        for (let k = 1; k <= 5; k++) {
            let quality = k
            let temp = getShenHunAnimName(quality)
            table_insert(this.hunList, temp)
        }

        let elemInfo_1 = []
        //this.animList = []
        for (let k = 1; k <= this.hunList.length; k++) {
            let v = this.hunList[k - 1]
            // let actort = UIActorView.newObj(this.mLayoutNode, "actor_view_" + k, 0, 0, this.mElemList["actor_" + k])
            // table_insert(this.actorList, actort)
            table_insert(elemInfo_1, { ["index_type"]: gui.AnimBox, ["name"]: "anim_" + k, ["parent"]: "actor_" + k, ["title"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["verticalCenter"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true }, )
        }

        UiUtil.createElem(elemInfo_1, this.mLayoutNode, this.mElemList, this)

        this.posList = []
        for (let k = 1; k <= 5; k++) {
            let group = this.mElemList["actor_" + k]
            table_insert(this.posList, [group.x, group.y])
        }

        this.watting = false
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.costUpdate, this)
        //RegisterEvent(EventDefine.ITEM_UPDATE, this.updateItemList, this)
        this.mLayoutNode.visible = true;
        this.initActionList()
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.costUpdate, this)
        //UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateItemList, this)
        this.mLayoutNode.visible = false;
        this.select = null

        this.actor_body.clearView()
        this.actor_hand.clearView()
        this.actor_deng.clearView()
        this.actor_qi.clearView()
        this.action_qi.stop()

        for (let k in this.itemActorList) {
            let actor: UIActorView = this.itemActorList[k]
            actor.clearView()
        }
        this.clearHun()
    }

    costUpdate() {
        let unit = opItemUnit.HUN_POINT
        let rd: gui.RichDisplayer = this.mElemList["rd_hunbi"]
        AddRdContent(rd, Localize_cns("SHENHUN_TXT17") + GetMoneyStr(unit) + ":" + GetMoneyIcon(unit) + GetHeroMoney(unit), "ht_20_cc_stroke")
    }

    updateWnd(info) {
        if (size_t(info) == 0) return
        this.updateBodyEffect("attack")
        this.catchAction(info)
    }

    onRefresh() {
        if (this.select == null) {
            this.select = 2
            let unit = opItemUnit.CURRENCY
            let hun = opItemUnit.HUN_POINT
            if(GetHeroMoney(unit) >= optionShenHun.costMoney && GetHeroMoney(hun) < optionShenHun.costHunBi){
                this.select = 1
            }
        }
        this.refreshCheck()
        this.itemList = []
        this.itemActorList = []
        this.updateItemList()
        this.updateBodyEffect()
        this.updateEffect()
        this.costUpdate()

        AddRdContent(this.mElemList["rd_tips"], Localize_cns("SHENHUN_TXT16"), "ht_20_lc", "red")
    }

    initActionList() {
        let _this = this
        this.actionList = []
        this.timerList = []
        for (let k in this.hunList) {
            let name = this.hunList[k]
            let pos = this.posList[k]
            let index = tonumber(k) + 1
            let anim: gui.AnimBox = this.mElemList["anim_" + index]
            let group = this.mElemList["actor_" + index]
            let data: any = { ["startX"]: pos[0], ["startY"]: pos[1], ["endX"]: 129, ["endY"]: 225, ["moveType"]: "inertional", }
            let time = (pos[0] - 98) / ((331 - 129) / 4000)
            this.actionList[k] = MoveAction.newObj(group, time, data, function () {
                _this.actionList[k].startX = 331
                _this.actionList[k].startY = 341
                _this.actionList[k].time = 4000
                let timer = _this.timerList[k]
                if (timer != null) {
                    KillTimer(timer)
                    timer = null
                }
                if (timer == null) {
                    let scale = 0.8
                    timer = SetTimer(function () {
                        scale -= 0.0125
                        anim.setAnimName(name)
                        anim.setLoop(true)
                        anim.scaleX = scale
                        anim.scaleY = scale
                        if (scale <= 0.5) {
                            KillTimer(timer)
                            timer = null
                        }
                    }, _this, 100, true)
                }
                _this.actionList[k].run()
            }, this)
            this.actionList[k].stop()
        }
    }

    updateItemList(info?) {
        this.itemList = []
        let newList = info || []
        // for (let k in this.itemList) {
        //     let v = this.itemList[k]
        //     v.new = 0
        // }
        for (let k in newList) {
            let temp: any = {}
            temp.item = newList[k]
            //temp.new = 1
            temp.actorList = this.itemActorList
            table_insert(this.itemList, temp)
        }
        table_sort(this.itemList, function (a, b) {
            //if (a.new == b.new) {
            let a_item = a.item
            let b_item = b.item
            let a_q = a_item.getProperty("quality")
            let b_q = b_item.getProperty("quality")
            if (a_q == b_q) {
                return b_item.getProperty("enhanceLevel") - a_item.getProperty("enhanceLevel")
            } else {
                return b_q - a_q
            }
            // } else {
            //     return b.new - a.new
            // }
        })
        let showList = splitListByCount(this.itemList, 5)
        let list: eui.List = this.mElemList["item_list"]
        UiUtil.updateList(list, showList)
        this.mElemList["label_ps"].visible = size_t(this.itemList) == 0
        this.watting = false
    }

    updateBodyEffect(state?) {
        this.actor_body.updateByPlayer(this.MODEL_BODY, state)
        this.actor_hand.updateByPlayer(this.MODEL_HAND, state)
    }

    updateEffect() {
        this.actor_deng.updateByPlayer(this.MODEL_DENG)
        this.actor_qi.updateByPlayer(this.MODEL_WUQI)
        this.action_qi.run()
        this.timerList = []
        let scaleList = [0.5, 0.5725, 0.655, 0.7275, 0.8]
        for (let k in this.hunList) {
            let v = this.actionList[k]
            let index = tonumber(k) + 1
            let anim: gui.AnimBox = this.mElemList["anim_" + index]
            let name = this.hunList[k]
            v.run()
            let timer = this.timerList[k]
            if (timer == null) {
                let scale = scaleList[k]
                timer = SetTimer(function () {
                    scale -= 0.0125
                    anim.setAnimName(name)
                    anim.setLoop(true)
                    anim.scaleX = scale
                    anim.scaleY = scale
                    if (scale <= 0.5) {
                        KillTimer(timer)
                        timer = null
                    }
                }, this, 100, true)
            }
        }
    }

    catchAction(info) {
        let hunIndex = -1
        let itemList = {}

        for (let k in info) {
            let temp = info[k]
            let item = Item.newObj({ entry: temp.itemId, quality: temp.quality || 1, enhanceLevel: temp.enhanceLevel || 0, equip_exp: temp.upExp || 0 })
            if (hunIndex == -1 || hunIndex < temp.quality) {
                hunIndex = tonumber(k)
            }
            itemList[k] = item
        }
        if (hunIndex == -1) return
        let catchItem: Item = itemList[hunIndex]
        if (catchItem == null) return;
        let quality = catchItem.getProperty("quality")
        let index = quality - 1

        let anim: gui.AnimBox = this.mElemList["anim_" + quality]
        let name = this.hunList[index]
        let action = this.actionList[index]
        let timer = this.timerList[index]
        let id = this.hunList[index]
        if (timer != null) {
            KillTimer(timer)
            timer = null
        }
        let group = this.mElemList["actor_" + quality]
        let data: any = { ["startX"]: group.x, ["startY"]: group.y, ["endX"]: 500, ["endY"]: 200, ["moveType"]: "inertional", }
        let _this = this
        action = MoveAction.newObj(group, 2000, data, function () {
            _this.clearHun()
            _this.initActionList()
            _this.updateBodyEffect()
            _this.updateEffect()
            _this.updateItemList(itemList)

        })
        action.run()
        let scale = anim.scaleX
        let add = (scale * (100 / 2000))
        timer = SetTimer(function () {
            scale += add
            anim.setAnimName(name)
            anim.setLoop(true)
            anim.scaleX = scale
            anim.scaleY = scale
            if (scale >= 1) {
                KillTimer(timer)
                timer = null
            }
        }, this, 100)
    }

    refreshCheck() {
        for (let k = 1; k <= 2; k++) {
            let checkBox: eui.CheckBox = this.mElemList["check_" + k]
            checkBox.selected = k == this.select
        }
        let check = this.select == 2
        let money = check ? opItemUnit.HUN_POINT : opItemUnit.CURRENCY
        let cost = check ? optionShenHun.costHunBi : optionShenHun.costMoney

        AddRdContent(this.mElemList["rd_1"], GetMoneyIcon(money) + cost, "ht_20_cc_stroke")
        AddRdContent(this.mElemList["rd_2"], GetMoneyIcon(money) + cost * 10, "ht_20_cc_stroke")
        this.mElemList["btn_1"].text = String.format(Localize_cns("SHENHUN_TXT3"), 1)
        this.mElemList["btn_2"].text = String.format(Localize_cns("SHENHUN_TXT3"), 10)
    }


    clearHun() {
        // for (let k in this.actorList) {
        //     let v = this.actorList[k]
        //     v.clearView()
        // }

        for (let k in this.actionList) {
            let v = this.actionList[k]
            v.stop()
        }

        for (let k in this.timerList) {
            let timer = this.timerList[k]
            if (timer != null) {
                KillTimer(timer)
                timer = null
            }
        }
    }

    //////////-------------响应
    onBtnClick(args) {
        if (!this.checkBag()) {
            MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT24"))
            return
        }
        if (this.watting == true) return
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let check = this.select == 2
        let money = check ? opItemUnit.HUN_POINT : opItemUnit.CURRENCY
        let key = tonumber(index)
        let sendNum = key == 1 ? 1 : 10
        let cost = (check ? optionShenHun.costHunBi : optionShenHun.costMoney) * sendNum
        if (GetHeroMoney(money) < cost) {
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), GetMoneyStr(money)))
            return
        }
        RpcProxy.call("C2G_ShenHunShouHun", [money, sendNum])
        this.watting = true
    }

    onCheckClick(event) {
        let name = event.target.name;
        let index = name.replace(/[^0-9]/ig, "");
        this.select = tonumber(index)
        this.refreshCheck()
    }


    checkBag() {
        let list = ItemSystem.getInstance().getShenHunItemList()
        let max = defaultValue.MAX_SHENHUN_SIZE
        return size_t(list) < max
    }
}

module itemRender {
    export class LieHunItem extends eui.ItemRenderer {
        mElemList: any;
        //MODEL_JUJI
        constructor() {
            super();
            this.mElemList = {}
            //this.MODEL_JUJI = 90031
            for (let i = 1; i <= 5; i++) {
                let x = 102 * (i - 1);
                let mElemInfo: any = [
                    { ["index_type"]: eui.Group, ["name"]: "group" + i, ["image"]: "", ["x"]: x, ["y"]: 0, ["w"]: 102, ["h"]: 102, },
                    { ["index_type"]: eui.Image, ["name"]: "item_bg" + i, ["parent"]: "group" + i, ["image"]: "fb_faBaoDi01", ["x"]: 0, ["y"]: 0, ["w"]: 102, ["h"]: 102, },
                    { ["index_type"]: eui.Group, ["name"]: "item_" + i, ["parent"]: "group" + i, ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 102, ["h"]: 102, },
                    { ["index_type"]: eui.Label, ["name"]: "name_" + i, ["parent"]: "group" + i, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.red, ["x"]: 0, ["y"]: 70, ["w"]: 102, ["h"]: 20, ["messageFlag"]: true },
                    { ["index_type"]: eui.Image, ["name"]: "actor_" + i, ["parent"]: "group" + i, ["image"]: "fb_faBaoDi01", ["x"]: 50, ["y"]: 100, ["w"]: 1, ["h"]: 1, },
                ];
                UiUtil.createElem(mElemInfo, this, this.mElemList, this);

                this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 11, 11, this.mElemList["item_" + i])
                this.mElemList["actor_view_" + i] = UIActorView.newObj(this, "actor_view_" + i, 0, 0, this.mElemList["actor_" + i])
            }
        }

        protected dataChanged(): void {
            let config = this.data

            for (let k = 1; k <= 5; k++) {
                let v = config[k - 1]
                this.mElemList["actor_view_" + k].visible = false
                this.mElemList["group" + k].visible = v != null
                if (v != null) {
                    let item = v.item
                    let quality = item.getProperty("quality")
                    let fontColor = GetQualityColorGui(quality)
                    this.mElemList["itemBox" + k].updateByItem(item)
                    this.mElemList["name_" + k].textColor = fontColor
                    this.mElemList["name_" + k].text = item.getName()
                    // this.mElemList["itemBox" + k].setItemTipsListner(this.onClickBox, this, k)
                    let actor: UIActorView = this.mElemList["actor_view_" + k]
                    //if (quality == opEquipQuality.gold) {
                        this.mElemList["actor_view_" + k].visible = true
                        let effectId = GetShenHunEffect(quality)
                        actor.updateByOnceEffect(effectId)
                        //v.new = 0
                    //}
                    if (table_isExist(v.actorList, actor)) continue
                    table_insert(v.actorList, actor)
                }
            }
        }

        onClickBox(item, userData) {
            if (item == null) return
            let wnd: ShenHunItemTipsFrame = WngMrg.getInstance().getWindow("ShenHunItemTipsFrame")
            wnd.onShowWnd(item)
            return true
        }
    }


}