ImportType(PayActivityIndex)



//C for Client，客户端信息
PayActivityIndex.C_MONTHCARD = 100 //月卡
PayActivityIndex.C_Welfare = 101 //福利
PayActivityIndex.C_LUCKY_A = 102 //寻宝
PayActivityIndex.C_RELATIVE_OPENSERVER = 103 //开服活动相关的活动
PayActivityIndex.C_CARNIVAL = 104 //开服活动
PayActivityIndex.C_LUCKY = 105 //幸运转盘
PayActivityIndex.C_WONDER = 106 //精彩活动
PayActivityIndex.C_LUCKY_PRIZE = 107 //幸运好礼
PayActivityIndex.C_SHOP_SHENMI = 108 //神秘商店


class PayActivityHandler {

    public static onHandleUI(wndName) {
        if (wndName == "")
            return
        WngMrg.getInstance().showWindow(wndName);
    }

    public static onTouziUI(param) {
        let wnd: TouZiFrame = WngMrg.getInstance().getWindow("TouZiFrame")
        wnd.showWithIndex(param)
    }

    public static onWelfareUI(param) {
        let wnd = WngMrg.getInstance().getWindow("WelfareFrame")
        wnd.showWndWithTabName(param)
    }

    public static onCarnivalUI(param) {
        let wnd: CarnivalFrame = WngMrg.getInstance().getWindow("CarnivalFrame")
        wnd.showActFrame(param)
    }

    public static onHandleOther(param) {
    }

    public static onOpenServerUI(param) {
        let wnd = WngMrg.getInstance().getWindow("OpenServerMainFrame")
        wnd.showActFrame(param)
    }

    public static onHandleLuckyUI(param) {
        let wnd = WngMrg.getInstance().getWindow("LuckyFrame")
        wnd.showWithIndex(param)
    }

    public static onHandleWonderUI(param) {
        let wnd = WngMrg.getInstance().getWindow("WonderFrame")
        wnd.showWithIndex(0)
    }

    public static onHandleGodPetUI(param) {
        let wnd = WngMrg.getInstance().getWindow("WonderFrame")
        wnd.showWithIndex(0)
    }

    public static onHandleLuckyPrizeUI(param) {
        let wnd: LuckyPrizeFrame = WngMrg.getInstance().getWindow("LuckyPrizeFrame")
        wnd.showWithIndex(0)
    }

    public static updateNorInstZonesConfig(srcConfig) {
        let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NORMAL_INST_ZONES)
        if (info != null && size_t(info) != 0) {
            let typeIndex = info[0]
            if (GameConfig.NormalInstZonesConfig[typeIndex]) {
                let config = table_copy(srcConfig)
                config.image = GameConfig.NormalInstZonesConfig[typeIndex][0].mainIcon
                return [true, config]
            }
        }
        return [false, srcConfig]
    }

    public static onHandleShopShenMi(param) {
        // let wnd : ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
        // wnd.onShowWnd(ShopSystem.SHOP_ZHUANGBAN)
        let wnd : ShopShenChongFrame = WngMrg.getInstance().getWindow("ShopShenChongFrame")
        wnd.showWithIndex(0)
    }

    public static onHandleShenChongMiLu(param) {
        let level = GetHeroProperty("level")
        if(level < 25){
            MsgSystem.addTagTips(Localize_cns("ACTIVITY_TXT33"))
            return
        }
        WngMrg.getInstance().showWindow("MiLuFrame");
    }
    
}


//充值活动界面布局
let PayActivityUiGroup = {

    ["Main"]: [//主界面
        { index: PayActivityIndex.ACCUM_PAY_PRIZE, image: "zjm_Bt34", handle: PayActivityHandler.onTouziUI, param: PayActivityIndex.ACCUM_PAY_PRIZE, timer: false },//累充
        { index: PayActivityIndex.FIRST_PAY, image: "zjm_Bt27", handle: PayActivityHandler.onTouziUI, param: PayActivityIndex.FIRST_PAY, timer: false },//首冲
        { index: PayActivityIndex.DAILY_LOGIN, image: "zjm_Bt11", handle: PayActivityHandler.onHandleUI, param: "DailyLoginFrame", timer: false },//每日登陆送元宝
        { index: PayActivityIndex.C_MONTHCARD, image: "zjm_Bt28", handle: PayActivityHandler.onWelfareUI, param: 2, timer: false },//月卡
        { index: PayActivityIndex.TEN_YUAN_GIFT, image: "zjm_Bt30", handle: PayActivityHandler.onHandleUI, param: "TenGiftFrame", timer: true },//十元购
    ],


    ["MainCity"]: [//主城界面
        { index: PayActivityIndex.EVERY_MIXACCU_RECHARGE, image: "zjm_Bt01", handle: PayActivityHandler.onHandleUI, param: "DailyPayFrame", timer: true },//每日充值
        { index: PayActivityIndex.DAILY_EXPENSIVE_GIFT, image: "zjm_Bt35", handle: PayActivityHandler.onHandleUI, param: "TodayGiftsFrame", timer: true },//今日豪礼
        { index: PayActivityIndex.STAGE_UP, image: "zjm_Bt03", handle: PayActivityHandler.onHandleUI, param: "PayStageUpFrame", timer: true },//直升一阶
        { index: PayActivityIndex.LEVEL_FUNDS, image: "zjm_Bt04", handle: PayActivityHandler.onTouziUI, param: PayActivityIndex.LEVEL_FUNDS, timer: false },//成长基金
        { index: PayActivityIndex.INVEST_PLAN, image: "zjm_Bt05", handle: PayActivityHandler.onTouziUI, param: PayActivityIndex.INVEST_PLAN, timer: false },//投资计划
        { index: PayActivityIndex.C_Welfare, image: "zjm_Bt08", handle: PayActivityHandler.onHandleUI, param: "WelfareFrame", timer: false },//福利大厅
        { index: PayActivityIndex.C_LUCKY_A, image: "zjm_Bt02", handle: PayActivityHandler.onHandleLuckyUI, param: PayActivityIndex.PET_LOTTERY_A, timer: false },//寻宝
        { index: PayActivityIndex.C_LUCKY, image: "zjm_Bt02", handle: PayActivityHandler.onHandleLuckyUI, param: PayActivityIndex.PET_LOTTERY, timer: true },//幸运转盘
        { index: PayActivityIndex.C_RELATIVE_OPENSERVER, image: "zjm_Bt06", handle: PayActivityHandler.onOpenServerUI, param: null, timer: false },//开服活动
        { index: PayActivityIndex.NEW_SERVER_INST_ZONES, image: "zjm_Bt07", handle: PayActivityHandler.onOpenServerUI, param: PayActivityIndex.NEW_SERVER_INST_ZONES, timer: true },//?
        { index: PayActivityIndex.C_CARNIVAL, image: "zjm_Bt39", handle: PayActivityHandler.onCarnivalUI, param: null, timer: false },//?
        { index: PayActivityIndex.C_WONDER, image: "zjm_Bt52", handle: PayActivityHandler.onHandleWonderUI, param: PayActivityIndex.C_WONDER, timer: false },
        { index: PayActivityIndex.GOD_PET_INCOME, image: "zjm_Bt51", handle: PayActivityHandler.onTouziUI, param: PayActivityIndex.GOD_PET_INCOME, timer: true },//神宠来袭
        { index: PayActivityIndex.C_LUCKY_PRIZE, image: "zjm_Bt50", handle: PayActivityHandler.onHandleLuckyPrizeUI, param: "LuckyPrizeFrame", timer: false },//?
        { index: PayActivityIndex.NORMAL_INST_ZONES, image: "zjm_Bt07", handle: PayActivityHandler.onCarnivalUI, param: PayActivityIndex.NORMAL_INST_ZONES, timer: true, dynamicConfig: PayActivityHandler.updateNorInstZonesConfig },//?
        { index: PayActivityIndex.C_SHOP_SHENMI, image: "zjm_Bt63", handle: PayActivityHandler.onHandleShopShenMi, param: PayActivityIndex.C_SHOP_SHENMI, timer: true, },//?
    
        { index: PayActivityIndex.GOD_PET_TURN, image: "zjm_Bt65", handle: PayActivityHandler.onHandleShenChongMiLu, param: PayActivityIndex.GOD_PET_TURN, timer: false, },
    ],
}


//返回所有活动列表索引
function GetOpenOperateActivityList() {
    let list: number[] = []

    if (!GetHeroPropertyInfo()) {
        return list
    }

    //首冲
    let vipLevel = VipSystem.getInstance().GetVipLevel()
    if (vipLevel == 0) {
        JsUtil.arrayInstert(list, PayActivityIndex.FIRST_PAY)
    }


    let isMonCard = PaySystem.getInstance().isMonthCardActive()
    if (isMonCard == false) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_MONTHCARD)
    }

    let isWelfare = true
    if (isWelfare) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_Welfare)
    }

    let isLucky = (GetServerDay() >= 9)
    if (!isLucky) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_LUCKY_A)
    } else {
        JsUtil.arrayInstert(list, PayActivityIndex.C_LUCKY) //幸运转盘
    }

    let curTime = GetServerTime()
    let allTime = 7 * 24 * 60 * 60
    let creatTime = RoleSystem.getInstance().getRoleCreateTime()
    let outSevenDay = ((curTime - creatTime) > allTime)
    //创角每日充值
    if (outSevenDay == false) {
        JsUtil.arrayInstert(list, PayActivityIndex.CREATE_ROLE_SEVEN_DAY)
    }

    //开服活动相关
    let actList = GetActivity(ActivityDefine.OpenServer).getOpenServerOpenActivity()
    if (size_t(actList) != 0) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_RELATIVE_OPENSERVER)
    }

    let carnivalList = GetActivity(ActivityDefine.Carnival).getCarnivalOpenActivity()
    if (size_t(carnivalList) != 0) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_CARNIVAL)
    }

    //精彩活动
    if (GetServerDay() >= 20) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_WONDER)
    }

    let luckPrizeList = GetActivity(ActivityDefine.LuckyPrize).getLuckyPrizeOpenActivity()
    if (size_t(luckPrizeList) != 0) {
        JsUtil.arrayInstert(list, PayActivityIndex.C_LUCKY_PRIZE)
    }

    //常驻
    JsUtil.arrayInstert(list, PayActivityIndex.C_SHOP_SHENMI)

    let operateActivityOpenList: number[] = ActivitySystem.getInstance().getOperateActivityOpenList()
    for (let _ in operateActivityOpenList) {
        let index = operateActivityOpenList[_]
        //审核版本,成长基金不开放
        if (g_isExaming == true && index == PayActivityIndex.LEVEL_FUNDS){
            continue;
        }
        JsUtil.arrayInstert(list, index)
    }


    return list
}





function GetPayActivityUiConfig(name: string) {
    let configList = PayActivityUiGroup[name]
    if (configList == null)
        return []
    return configList
}

//传入groupName,返回正在开启的活动的配置列表（顺序按PayActivityGroup定义）
function GetOpenActivityUiConfig(groupName: string) {
    let groupConfigList = PayActivityUiGroup[groupName]
    if (groupConfigList == null || groupConfigList.length == 0)
        return

    let retOpenConfigList = []

    let openList = GetOpenOperateActivityList()
    for (let config of groupConfigList) {

        if (table_isExist(openList, config.index)) {
            retOpenConfigList.push(config)
        }
    }

    return retOpenConfigList
}


function ExecuteActivityIndex(index: number) {
    for (let k in PayActivityUiGroup) {
        let configList = PayActivityUiGroup[k]

        for (let config of configList) {
            if (config.index == index) {
                let func: Function = config.handle
                if (func) {
                    func.call(PayActivityHandler, config.param)
                }
                return true
            }
        }
    }

    return false
}

function CheckActivityState(actIndex?) {
    let curIndex = ActivitySystem.getInstance().getCurActIndex()
    actIndex = checkNull(actIndex, OrdinaryActivityIndex.NULL)
    if (curIndex != actIndex) {
        let txt = ""
        if (OrdinaryActivityName[curIndex]) {
            txt = String.format(Localize_cns("ACTIVITY_TXT31"), "#red" + Localize_cns(OrdinaryActivityName[curIndex]) + "#rf") + Localize_cns("DOUHAO")
        }
        txt = txt + Localize_cns("ACTIVITY_TXT17")
        MsgSystem.addTagTips(txt)
        return false
    }
    return true
}