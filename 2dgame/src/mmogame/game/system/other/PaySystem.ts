



function GetYuanTitle() {
    return PaySystem.getInstance().getUnitTitle()
}


class PaySystem extends BaseSystem {

    diamondExRate
    payBackInfo

    timerId
    sdkPayRetCode
    sdkPayRetParams
    itemid
    unitTitle
    paySellRecord
    animalPayCash:boolean
    petSellPayCash:boolean
    monthCardInfo:{}
    weekCardInfo:{}
    isFirstInto:boolean
    isFirstChengZhangInto:boolean

    public initObj(...args: any[]): void {
        RegisterEvent(EventDefine.PAY_FORM_GAME_SERVER, this.onPayReturnFromGameServer, this)
        RegisterEvent(EventDefine.CAMPAIGN_FINISH, this.openFirstPay, this)
        IGlobal.gameSdk.addEventListener(core.GameSdk.PAY_SDK_EVENT, this.payReturnFromSdk, this)

        this.onClear()
       	//星灵升阶是不是直接冲值
	    this.animalPayCash = SdkHelper.getInstance().getBoolConfigDef("AnimalPayCash", true)
	    //卖将是不是直接冲值
	    this.petSellPayCash = SdkHelper.getInstance().getBoolConfigDef("PetSellPayCash", true)

    }

    destory() {

    }

    getAnimalByCash(){
        return this.animalPayCash
    }

    getSellPetByCash(){
        return this.petSellPayCash
    }

    prepareResource(workQueue) {
        GameConfig.initPaySystemCsv(workQueue)
        this.diamondExRate = tonumber(SdkHelper.getInstance().getStringConfigDef("CurrencyToDiamond", "10"), 10)

        //Core.IGameSdk.inst.SubscribeEvent(Core.IGameSdk.PayEvent, this.payReturnFromSdk, this)

        //IGlobal.sdkHelper.addEventListener(EventDefine.PAY_SDK_EVENT, this.payReturnFromSdk, this)
        
    }


    onClear() {
        this.payBackInfo = null
        this.paySellRecord = []
        this.isFirstInto = false
        this.isFirstChengZhangInto = false
    }

    animalByCash(){
	    return this.animalPayCash
    }

    payFromItem(info) {
        let itemid = info.RechargeId
        let title = info.title
        let saveValue = info.Gain//买多少个
        //let saveValue = 1//info.Gain//买一个
        let rechargeAdd = info.ChargeCount//给多少钱
        //let payString = tostring(Math.ceil(rechargeAdd * 10))//1块钱=1q币=10q点 pay的单位为q点
        //let serverinfo = LoginSystem.getInstance().getRecentLoginServerInfo()

                 
        //let zoneId = tostring(Math.ceil(serverinfo.ServerID))//1//tostring(Math.ceil(serverId))//"2"
        let recentGameId = LoginSystem.getInstance().getSelectServerGameID()
        let recentGroupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()    
        let serverInfo = LoginSystem.getInstance().getSelectSeverInfo()
        
        let zoneId = tostring(recentGameId)//真正的哪一个服务器ID
        let groupId = tostring(recentGroupIndex + 1)//在某个服上属于第几个分组 
        let serverId = serverInfo.id + 1// 从玩家角度出发，是第几个服 从1开始 

        let roleId = GetHero().getId()//1002//tostring(GameInfo.getInstance().GetSelfRoleId())
        //let payParams = "title="+title+"&saveValue="+saveValue+"&pay="+payString +"&zoneId="+zoneId +"&app_metadata=" +roleId +"&itemid=" +itemid
        let hero = GetHeroPropertyInfo()
        let roleLevel = hero.level
        let roleName = hero.name

        let accountId = GameAccount.getInstance().getAccountId()

        let isItemShop = 0//是否直接购买物品
        if (itemid == 1000) {//月卡
            isItemShop = 1
        }

        let thirdPayLevel = 20
        // if (isThai()) {
        //     thirdPayLevel = 0
        // }
        let nameUrlEncode = JsUtil.UrlEncode(roleName);
        //let roleNameBase64 = GetBase64EncodeString(roleName, string.len(roleName))
        //let roleNameUrlEncode = UrlEncode(roleNameBase64)
        //TLog.Debug("roleName, roleNameBase64", roleName, roleNameBase64, roleNameUrlEncode)

        let roleMission = CampaignSystem.getInstance().getCurOpenCampaign()
        let payParams = "title="+title+"&acctType="+title+"&saveValue="+saveValue+"&payMoney="+ rechargeAdd + "&roleId=" + roleId  + "&zoneId=" + zoneId + "&groupId="  + groupId+ "&serverId="  + serverId + "&itemId=" + itemid
        payParams = payParams + "&roleName="+ nameUrlEncode + "&roleLevel="+roleLevel + "&roleMission="+roleMission
        payParams = payParams + "&accountId="+accountId
        payParams = payParams + "&thirdPayLevel="+thirdPayLevel //google商店下，开启第三方支付的等级
        payParams = payParams + "&isItemShop="+isItemShop //是否月卡

        TLog.Debug("PaySystem.payFromItem", payParams)
        this.itemid = itemid

        SDKAnalyzer(SdkEventDefine.SDK_PAY_BEGIN, "")
        
        IGlobal.sdkHelper.callPay(payParams)
    }

   

    checkMonthCardTooMuchAndTips() {
        let activity = GetActivity(ActivityDefine.Welfare)
        let warhorn_list = activity.GetWarHorn()
        let tooMach = false
        if (warhorn_list.index > 0) {
            let time = warhorn_list.time / 86400
            if (time > 330) {
                tooMach = true
                MsgSystem.confirmDialog_YES(Localize_cns("SIGN_YUEKA_TEXT7"))
            }
        }
        return tooMach
    }


    payFromId(id) {
        TLog.Debug("PaySystem.payFromId", id)
        let v = GameConfig.RechargeConfig[id]
        if (v) {
            this.payFromItem(v)
        }

    }

    setFirstInto(){
        this.isFirstInto = true
    }

    getFirstInto(){
        return this.isFirstInto
    }

    setChengZhangFirstInto(){
        this.isFirstChengZhangInto = true
    }

    getChengZhangFirstInto(){
        return this.isFirstChengZhangInto
    }
    //冲值星灵(神兽)
    // payFromAnimal(){
    //     let myLevel = GetHeroProperty("Animal_Level")
    //     let payidlist = this.getAnimalPayIdList(myLevel + 1)
    //     if(payidlist.length == 1 ){
    //         this.payFromId(payidlist[0])
    //     }else{
    //         let save_list = GetHeroProperty("Animal_SaveList")
    //         if(save_list == null || save_list.length == 0 ){
    //             this.payFromId(payidlist[0])
    //         }else{
    //             for(let _ in payidlist){
    //             let v = payidlist[_]
        
    //                 if(table_isExist(save_list, v) == false ){
    //                     this.payFromId(v)
    //                 }
    //             }
    //         }
    //     }
    // }

    //冲值买将
    // payFromPet(){
    //     TLog.Debug("PaySystem.payFromPet")
    //     let index = this.getCurOnSellIndex()
    //     TLog.Debug("index", index)
    //     if(index != null ){
    //         let info = GameConfig.PaySellPetConfig[index]
    //         //TLog.Debug_r({"info", info})
    //         if(info != null ){
    //             this.payFromId(info.quota)
    //         }
    //     }
    // }

    payFromCard(){
        this.payFromId(1000)
    }

    tick(delay) {
        if (this.timerId != null) {
            KillTimer(this.timerId)
            this.timerId = null
        }

        this._PayReturn(this.sdkPayRetCode, this.sdkPayRetParams)
        //FireEvent(EventDefine.PAY_RETURN, IdAndInfoEvent.newObj(this.sdkPayRetCode, this.sdkPayRetParams))
    }


    _PayReturn(returnCode, retParams) {
        TLog.Debug("============_PayReturn==============")
        TLog.Debug(returnCode)
        TLog.Debug(retParams)
        if (returnCode == 0 && this.itemid == 1201) {//冲值成功，发给服务器
            let text = Localize_cns("PAY_SUCCESS")
            if(this.itemid != null) {
                text = Localize_cns("BUY_SUCCESS")
            }
            MsgSystem.addTagTips(text)
            let message = GetMessage(opCodes.C2G_PAY)
            message.params = retParams
            SendGameMessage(message)
            FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
            //这里要上传服务器，等待服务器发晶石
        } else if (returnCode == 1) {//未知是不是冲值成功 发给服务器
            MsgSystem.addTagTips(Localize_cns("PAY_UNKNOW"))
            let message = GetMessage(opCodes.C2G_PAY)
            message.params = retParams
            SendGameMessage(message)
            FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
            //这里要上传服务器，等待服务器发晶石  

        } else {//不成功，提示一下
            if (SdkHelper.getInstance().getBoolConfigDef("CheatPay", false) == true) {
                if (this.itemid != null) {
                    let message = GetMessage(opCodes.C2G_PAY_CHEAT)
                    message.params = "itemid="+tostring(this.itemid)
                    SendGameMessage(message)
                    let xl_Config = GameConfig.XingLingConfig
                    if(this.itemid == 1201 || xl_Config[this.itemid]){
                        MsgSystem.addTagTips(Localize_cns("BUY_SUCCESS"))
                    }else{
                        MsgSystem.addTagTips(Localize_cns("PAY_SUCCESS"))
                    }
                    FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
                }
            } else {
                MsgSystem.addTagTips(Localize_cns("PAY_FAIL"))
            }
            //AlertManager.getInstance().showMessageAlert(Local_cns("PAY_ERROR")+retParams)
        }
    }


    nextFrameFireEvent() {
        if (this.timerId != null) {
            KillTimer(this.timerId)
        }
        this.timerId = SetTimer(this.tick, this, 1, false)

    }

    payReturnFromSdk(args) {
        SDKAnalyzer(SdkEventDefine.SDK_PAY_FINISH, "")
        //tolua.cast(args, "Core::SdkReturnArgs")
        this.sdkPayRetCode = args.code//0是正确
        this.sdkPayRetParams = args.params
        TLog.Debug("PaySystem.payReturnFromSdk", this.sdkPayRetCode, this.sdkPayRetParams)
        //let sdkLoginParamsList = SplitUrlParams(sdkLoginRetParams)
        //FireEvent(EventDefine.SHARE_RETURN,IdAndInfoEvent.newObj(this.sdkLoginRetCode, this.sdkLoginRetParams))
        //直接看 sdkLoginRetCode == 0表示分享成功 sdkLoginRetCode == -1表示用户在分享到一半时取消 sdkLoginRetCode == -2表示网络原因分享出错
        this.nextFrameFireEvent()
    }

    onPayReturnFromGameServer(args:NetMessageEvent) {
        FireEvent(EventDefine.MSG_WAIT_END, null)
        //let chargeValue = args.msg.chargeValue//冲了多少钱
        //let gainValue = args.msg.gainValue//得了多少晶石
        //let rebateValue = args.msg.rebateValue//送了多少晶石
        //let firstRebateValue = args.msg.firstRebateValue//首冲送了多少晶石
        //let itemid = args.msg.itemId//
        //let payType = args.msg.payType //冲值渠道
        //let billno = args.msg.billno//冲值订单

        //IGlobal.sdkHelper.callSdk("pay_from_server", tostring(chargeValue))

        let payinfo = {}
        payinfo['itemid'] = args.msg.itemId
        payinfo['paytype'] = args.msg.payType
        payinfo['billno'] = args.msg.billno
        let payMoney = 0
        let info = GameConfig.RechargeConfig[args.msg.itemId]
        if (info != null){
            payMoney = info.ChargeCount//给多少钱 单位元
        }
        payinfo['money'] = payMoney
        payinfo['paypoint'] = args.msg.chargeValue
        let heroInfo = GetHeroPropertyInfo()
        let serverInfo = LoginSystem.getInstance().getSelectSeverInfo()
        IGlobal.gameSdk.reportPayReturn(serverInfo, heroInfo, payinfo);
    }

    //getCurrencyWithDiamond( dia, rate){
    //	rate = rate || this.diamondExRate
    //	
    //	return dia / rate
    //}
    //
    //getDiamondWithCurrency( money, rate){
    //	rate = rate || this.diamondExRate
    //	
    //	return money * rate
    //}
    //
    ////暂时以货币对晶石的汇率为区分（简体、繁体）版本 10为简体、2为繁体
    //isPlatform( index){
    //	return this.diamondExRate == index
    //}

    getYuekaRecharge(index) {

        let yueKaCost = 0
        let v = GameConfig.RechargeConfig[1000]
        if (v) {
            yueKaCost = v.ChargeCount
        }

        return yueKaCost
    }


    setPayBackInfo(info) {
        this.payBackInfo = info
    }

    getPayBackInfo() {
        return this.payBackInfo
    }


    getUnitTitle() {
        let info = GameConfig.RechargeConfig[0]
        if (this.unitTitle == null) {
            this.unitTitle = StringUtil.stringMatch(info.Tips, /\d+[.]?\d*(.+)/)[0]
        }
        return this.unitTitle || "Error"
    }


    openFirstPay( args){
        let config = GameConfig.CampaignConfig[args.campaignId]
        if(! config ){
            return
        }
        
        //通过9关时自动弹出首充界面
        if(args.campaignId == 1009 ){
            let vipLevel = VipSystem.getInstance().GetVipLevel()
            if(vipLevel == 0 ){
            ExecuteMainFrameFunction("shouchong")
            }
        }else if(args.campaignId == 1015 ){ //15关结束，弹出女神直购
            if(PetSystem.getInstance().getPetInfoEntry(18023) == null ){ //克罗诺斯
                //WngMrg.getInstance().showWindow("PaySellPetFrame")
                ExecuteMainFrameFunction("shouchong")
            }
        }else if(args.campaignId == 1013 ){ //通过13关，自动弹出签到界面
            ExecuteMainFrameFunction("qiandao")
        }
    }

    setMonthCardInfo(overTime,isGet){
        this.monthCardInfo = {["overTime"]:overTime,["isGet"]:isGet,}
    }


    getMonthCardInfo(){
        return this.monthCardInfo
    }

    setWeekCardInfo(overTime,isGet){
        this.weekCardInfo = {["overTime"]:overTime,["isGet"]:isGet,}
    }

    getWeekCardInfo(){
        return this.weekCardInfo
    }

    isWeekCardActive(){
        let weekCard = getSaveRecord(opSaveRecordKey.weekCard) || 0
        return weekCard > GetServerTime()
    }


    isMonthCardActive(){
        let moncarCard = getSaveRecord(opSaveRecordKey.monthCard) || 0
        return moncarCard > GetServerTime()
    }

    // getAnimalPayIdList( level){
    //         let payidlist = GameConfig.AnimalConfig[level].ardpayid
    //         //if(! SdkHelper.getInstance().InPlatformAndroid() ){
    //         ////if(SdkHelper.getInstance().InPlatformIOS() ){
    //         //    payidlist = GameConfig.AnimalConfig[level].iospayid
    //         //}
    //         return payidlist
    // }

    //伙伴直购
    // getCurOnSellIndex(){
    //     let paycash = this.getSellPetByCash()
    //     let index = null
    //     for(let k in GameConfig.PaySellPetConfig){
    //         let v = GameConfig.PaySellPetConfig[k]
        
    //         let check = (v.onsell == 1)
    //         if(check ){
    //             if(paycash ){//直接冲值得女神的
    //                 check = (v.paytype == 2)
    //             }else{
    //                 check = (v.paytype == 1)
    //             }
    //         }
    //         if(check){					//上架中
    //             if (this.paySellRecord == null){
    //                 return v
    //             }
    //             let index1 = v.index
    //             if (this.paySellRecord == null || Array.isArray(this.paySellRecord)){
    //                 index1 = tonumber(v.index) - 1
    //             }
    //             //if (table_isExist(this.paySellRecord, v.index)  == false){
    //             if(this.paySellRecord == null || this.paySellRecord[index1] == null){
    //                 if(! index ){
    //                     index = v.index
    //                 }else if(index > v.index ){
    //                     index = v.index
    //                 }
    //             }
    //         }
    //     }
        
    //     return index
    // }


    updatePaySellRecord( record){
        this.paySellRecord = record || {}
    }

    // getAnimalCostTxt( level){
    //     TLog.Debug("PaySystem.getAnimalCostTxt", level)
    //     let payidlist = this.getAnimalPayIdList(level)
    //     let rechargeid = payidlist[0]
    //     //TLog.Debug_r({"payidlist", payidlist})
    //     if(payidlist.length > 1 ){//如果有多个可选的，则找，没有买过的
    //         let myLevel = GetHeroProperty("Animal_Level")
    //         TLog.Debug("myLevel", myLevel)
    //         if(myLevel == level - 1 ){
    //             let save_list = GetHeroProperty("Animal_SaveList")
    //             //TLog.Debug_r({"save_list", save_list})
    //             if(save_list != null && save_list.length > 0 ){
    //                 for(let _ in payidlist){
    //                     let v = payidlist[_]
        
    //                     if(table_isExist(save_list, v) == false ){
    //                         TLog.Debug("rechargeid", rechargeid)
    //                         rechargeid = v
    //                     }
    //                 }					
    //             }
    //         }
    //     }
    //     let info = GameConfig.RechargeConfig[rechargeid]
    //     return info.Tips
    // }

    // getAnimalRuleTxt( level){
    //     let payidlist = this.getAnimalPayIdList(level)
    //     if(payidlist.length <= 1 ){
    //         return Localize_cns("Immortals_TXT39")
    //     }
        
    //     //
    //     let finishlist:any = []
    //     let notfinishlist:any = []
    //     let myLevel = GetHeroProperty("Animal_Level")
    //     if(myLevel != level - 1 ){ 
    //         notfinishlist = payidlist
    //     }else{
    //         let save_list = GetHeroProperty("Animal_SaveList")
    //         if(save_list == null ){
    //             notfinishlist = payidlist
    //         }else{
    //             for(let _ in payidlist){
    //             let v = payidlist[_]
        
    //                 if(table_isExist(save_list, v) == false ){
    //                     JsUtil.arrayInstert(notfinishlist, v)
    //                 }else{
    //                     JsUtil.arrayInstert(finishlist, v)
    //                 }
    //             }
    //         }
    //     }
        
    //     let notfinishtxt = ""
    //     let index = 1
    //     for(let _ in notfinishlist){
    //             let v = notfinishlist[_]
        
    //         let info = GameConfig.RechargeConfig[v]
    //         if(index > 1 ){
    //             notfinishtxt = notfinishtxt +", "
    //         }
    //         notfinishtxt = notfinishtxt +info.Tips
    //         index = index + 1
    //     }	
    //     if(finishlist.length == 0 ){
    //         return String.format(Localize_cns("Immortals_TXT40"), notfinishtxt)
    //     }else{
    //         let finishtxt = ""
    //         let index = 1
    //         for(let _ in finishlist){
    //             let v = finishlist[_]
        
    //             let info = GameConfig.RechargeConfig[v]
    //             if(index > 1 ){
    //                 finishtxt = finishtxt +", "
    //             }
    //             finishtxt = finishtxt +info.Tips
    //             index = index + 1
    //         }			
    //         return String.format(Localize_cns("Immortals_TXT41"), finishtxt, notfinishtxt)
    //     }
    // }
    
}