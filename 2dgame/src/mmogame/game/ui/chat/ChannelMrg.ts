/*
作者:
    liuziming
	
创建时间：
   2013.12.24(周二)

意图：
   处理发送频道的显示和条件判断

公共接口：
 	
*/


let RECORD_MAX = 5
let PET_MAX = 2
let ITEM_MAX = 3
let CONTENT_MAX = 60

// function getLinkCount(content) {
//     let list: any = {}
//     let count = 0
//     let findbegin = 1
//     let wordbegin = 1
//     let signB = string.char(3)
//     let signE = string.char(3)

//     while (true) {
//         let _, f = string.find(content, signB, findbegin)
//         if (f == null) {
//             break
//         }

//         wordbegin = f + 1
//         findbegin = f + 1
//         f = string.find(content, signE, findbegin)

//         let link = string.sub(content, wordbegin, f - 1)
//         let linkType, _, _, _ = string.match(link, "(%d);(%d+);(%d+);(.+)")
//         list[linkType] = (list[linkType] || 0) + 1
//         findbegin = f + 1
//     }
//     return list
// }

class ChannelConBase extends TClass {
    channelType: number;
    consume: number;
    record: any[];
    lastTime: number;

    MAX_PACKET: number;
    packetList: any[];
    typeName: string;
    timeInterval: number;

    curTime: number;

    autoApplyRecord:boolean



    public initObj(...args: any[]): void {
        this.channelType = args[0]
        this.consume = args[1] || 0
        this.timeInterval = args[2] || 0
        this.autoApplyRecord = checkNull(args[3] , false)
        

        this.record = []
        this.lastTime = null

        this.MAX_PACKET = 50							//每个频道默认最多保存50条记录（packet-record-msg）
        this.packetList = []

        this.typeName = Localize_cns("DANGQIAN")
    }

    checkSendCondition(content) {

        // let cnCount = (string.len(content) - Core.GetUtf8TextLen(content)) / 2
        // let enCount = Core.GetUtf8TextLen(content) - cnCount
        // let textLen = cnCount * 2 + enCount
        let textLen = content.length;

        let [flag, param] = this.onCheckSendCondition()

        let tips = null;
        if (!flag) {
            tips = param;
            // } else if (this.getTimeInterval() == false) {
            //     flag = false
            //     tips = String.format(Localize_cns("CHAT_SEND_TOO_FAST"), this.timeInterval)
            // 
        }else if(this.checkPersonalCharm() == false ){
            //每分钟获得3点
            let charmPerMin = opHomePageConfig.AutoRecoverCharm
            let charm = GetHeroMoney(opItemUnit.HOME_PAGE_CHARM) 
            let str = String.format(Localize_cns("CHAT_SEND_NO_CHARM"), charm, charmPerMin, Math.ceil(-charm/charmPerMin))
            MsgSystem.confirmDialog_YES(str)
            return false
        } else if (textLen > CONTENT_MAX) {
            flag = false
            tips = String.format(Localize_cns("CHAT_ERROR_ZIFUSHANGXIAN"), CONTENT_MAX)
        }

        if (!flag && tips != null && tips != "") {
            MsgSystem.addTagTips(tips);
        }

        return flag
    }

    getTimeInterval() {
        this.curTime = GetServerTime()
        if (this.lastTime && this.curTime - this.lastTime - this.timeInterval < 0) {
            return false
        } else {
            this.lastTime = this.curTime
            return true
        }
    }

    setRecordMessage(data) {
        JsUtil.arrayInstert(this.record, 0, data)
        while (size_t(this.record) > RECORD_MAX) {
            JsUtil.arrayRemove(this.record)
        }
    }

    getRecordMessage() {
        return this.record
    }

    checkPersonalCharm(){
        return true
    }

    getEnableState() {
        return [true, ""]
    }

    onCheckSendCondition() {
        return [true, ""]
    }

    checkChannelCondition() {
        let flag = this.onCheckChannelCondition()

        return flag && true
    }

    onCheckChannelCondition() {
        return true
    }

    isExceedLinkCount(linkType, content, MAX) {
        // let countList = getLinkCount(content)
        // if (linkType == channelOption.ITEM) {
        //     let Max = MAX || ITEM_MAX
        //     return (countList[linkType] || 0) > Max
        // } else if (linkType == channelOption.PET) {
        //     let Max = MAX || PET_MAX
        //     return (countList[linkType] || 0) > Max
        // }

        return false
    }

    isPacketSuccess(packet) {
        return true
    }

    addPacket(packet) {
        let flag = false
        flag = this.isPacketSuccess(packet)
        if (flag == false) {
            return false
        }

        if (this.packetList.length >= this.MAX_PACKET) {
            JsUtil.arrayRemove(this.packetList, 0)
        }
        JsUtil.arrayInstert(this.packetList, packet)

        return true
    }

    findMsgPacket( playerId){
        //ChannelMsgPacket
        for(let _ = 0; _ < this.packetList.length; _++){
                let packet = this.packetList[_]
        
            if(packet.roleId == playerId ){
                return packet
            }
        }
        return 
    }

    getPacketList() {
        return this.packetList
    }

    clearPacketList() {
        this.packetList = []
    }

    getChannelName() {
        return this.typeName || "ERROR"
    }

    applyChatRecord(){
        if(! this.autoApplyRecord ){
            return
        }
        let message = GetMessage(opCodes.C2G_CHANNEL_RECARD_SEND)	
        message.channelId = this.channelType
        SendGameMessage(message)
    }

}

//系统频道
//////////////////////////////////////////////////////////////////////////////
class ChannelSystem extends ChannelConBase {
    minLevel: number;
    public initObj(...args: any[]): void {
        //ChannelConBase.init(this, args)
        this.minLevel = args[3] || 0

        this.typeName = Localize_cns("XITONG")
    }

    onCheckSendCondition() {
        if (GetHeroProperty("level") < this.minLevel) {
            return [false, String.format(Localize_cns("CHAT_ERROR_DENGJI"), this.minLevel)]
        } else {
            return [true, ""]
        }
    }

    //世界频道
    //////////////////////////////////////////////////////////////////////////////
}

class ChannelWorld extends ChannelConBase {
    minLevel: number
    public initObj(...args: any[]): void {
        //ChannelConBase.init(this, args)
        this.minLevel = args[3] || 0

        this.typeName = Localize_cns("SHIJIE")
    }

    checkPersonalCharm(){
        let charm = GetHeroMoney(opItemUnit.HOME_PAGE_CHARM)
        return (charm || 0) >= 0
    }

}



//队伍频道
//////////////////////////////////////////////////////////////////////////////
class ChannelTeam extends ChannelConBase {

    public initObj(...args: any[]): void {
        //ChannelConBase.init(this, args)

        this.typeName = Localize_cns("DUIWU")
    }

    getEnableState() {
        return [HeroIsInTeam(), Localize_cns("CHAT_VOICE_TIPS8")]//
    }

    onCheckChannelCondition() {
        if (!TeamSystem.getInstance().isHaveTeam()) {
            MsgSystem.addTagTips(Localize_cns("NOT_IN_ANY_TEAMS"))
            return false
        }
        return true
    }

    //帮派频道
    //////////////////////////////////////////////////////////////////////////////
}

class ChannelFaction extends ChannelConBase {

    public initObj(...args: any[]): void {
        //ChannelConBase.init(this, args)

        this.typeName = Localize_cns("BANGPAI")
    }

    getEnableState() {
        return [GetHeroProperty("faction") != 0, Localize_cns("CHAT_VOICE_TIPS7")]
    }

    //私聊频道
    //////////////////////////////////////////////////////////////////////////////
}

class ChannelChat extends ChannelConBase {

    public initObj(...args: any[]): void {
        //ChannelConBase.init(this, args)

        this.typeName = Localize_cns("SILIAO")
    }

    //当前（附近）频道
    //////////////////////////////////////////////////////////////////////////////
}

class ChannelNearBy extends ChannelConBase {

    public initObj(...args: any[]): void {
        //ChannelConBase.init(this, args)
    }

    //管理器
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-
}

class ChannelMrg extends TClass {

    channelList: any;
    curChannel: number;
    packets: any[];
    chatPackets:any[];
    unlockBubbleList:any[];
    delayTime;
    timerList;
    saveChatHistory1;
   

    public initObj(...args: any[]): void {
        RegisterEvent(EventDefine.PRECEDURE_DEACTIVE, this.onPrecedureDeactive, this)
        //RegisterEvent(EventDefine.CHAT_RECV_CHANNEL_MSG, this.onRecvWorldMsg, this)
        RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)
        this.channelList = {}
        this.curChannel = 0
        //this.bPublicNoticeIsOn = false
        

        this.registerChannel(ChannelSystem.newObj(channelType.SYSTEM, 0,  6))										//系统频道
        this.registerChannel(ChannelWorld.newObj(channelType.WORLD, 0, 6, true))											//世界频道
        //this.registerChannel(ChannelSchool.newObj(channelType.SCHOOL, 3, 20))										//门派频道
        this.registerChannel(ChannelTeam.newObj(channelType.TEAM, 0, 5))														//队伍频道
        this.registerChannel(ChannelFaction.newObj(channelType.FACTION, 0, 5, true))											//帮派频道
        this.registerChannel(ChannelChat.newObj(channelType.CHAT, 0, 5))													//私聊频道
        //this.registerChannel(ChannelNearBy.newObj(channelType.NEARBY, 0, 0))//5))								//当前频道

        this.packets = []
        this.chatPackets = []
	    this.unlockBubbleList = []

        this.delayTime = {}
        this.timerList = {}
        this.saveChatHistory1 = {}
    }

    // IsPublicNoticeOn() {
    //     return this.bPublicNoticeIsOn
    // }

    // setPublicNoticeIsOn(bIsOn) {
    //     this.bPublicNoticeIsOn = bIsOn
    // }

    registerChannel(channelObj) {
        let cType = channelObj.channelType
        if (this.channelList[cType]) {
            TLog.Warn("ChannelMrg.registerChannel %d alreadey exsit", cType)
        }

        this.channelList[cType] = channelObj
    }

    getRegisteredChannelList() {
        let sortChannel = [
            channelType.SYSTEM,
            channelType.WORLD,
            channelType.FACTION,
            //channelType.TEAM,
            //channelType.UNION,
            //channelType.SERVER,
            //channelType.CHAT,
        ]

        let list = []
        for (let _ = 0; _ < sortChannel.length; _++) {
            let cType = sortChannel[_]

            if (this.channelList[cType]) {
                JsUtil.arrayInstert(list, cType)
            }
        }

        return list
    }

     getRegisteredAllChannelList() {
        let sortChannel = [
            channelType.SYSTEM,
            channelType.WORLD,
            channelType.FACTION,
            //channelType.TEAM,
            //channelType.UNION,
            //channelType.SERVER,
            channelType.CHAT,
        ]

        let list = []
        for (let _ = 0; _ < sortChannel.length; _++) {
            let cType = sortChannel[_]

            if (this.channelList[cType]) {
                JsUtil.arrayInstert(list, cType)
            }
        }

        return list
    }

    getRegisteredChat() {
        let sortChannel = [
            channelType.CHAT,
        ]

        let list = []
        for (let _ = 0; _ < sortChannel.length; _++) {
            let cType = sortChannel[_]

            if (this.channelList[cType]) {
                JsUtil.arrayInstert(list, cType)
            }
        }

        return list
    }

    getChannelState() {												//可用状态，true为可用，false为不可用
        let stateList: any = {}
        for (let cType in this.channelList) {
            let channelObj = this.channelList[cType]

            stateList[cType] = channelObj.getEnableState()
        }

        return stateList
    }

    setCurChannel(cType) {
        if (!this.channelList[cType]) {
            TLog.Error("ChannelMrg.setCurChannel channel:%d", cType)
            return
        }

        this.curChannel = cType
    }

    getCurChannel() {
        if (!this.channelList[this.curChannel]) {
            //TLog.Error("ChannelMrg.setCurChannel channel:%d", this.curChannel)
            this.curChannel = channelType.SYSTEM											//默认是当前频道
        }

        return this.curChannel
    }

    checkSendCondition(content) {
        let channelObj = this.channelList[this.curChannel]
        return channelObj.checkSendCondition(content)
    }

    setCurChannelRecord(content) {
        let channelObj = this.channelList[this.getCurChannel()]
        channelObj.setRecordMessage(content)
    }

    getCurChannelRecord() {
        let channelObj = this.channelList[this.getCurChannel()]
        return channelObj.getRecordMessage()
    }

    isExceedLink(linkType, content, MAX) {
        let channelObj = this.channelList[this.getCurChannel()]
        return channelObj.isExceedLinkCount(linkType, content, MAX)
    }

    //超链位置信息
    openLinkWindow(linkType, obj) {

        if (linkType == channelOption.ITEM) {
            // let dataList: any = { ["logicItem"]: obj, ["spaceX"]: this.lastX, ["spaceY"]: this.lastY, ["superFrame"]: this }
            // ItemSystem.getInstance().showItemHint(dataList)
            ItemSystem.getInstance().showItemTips(obj);
        } else if (linkType == channelOption.PET) {
            let window = WngMrg.getInstance().getWindow("PetInfoFrame")
            window.setPetInfo(obj)
        } else if (linkType == channelOption.PLAYER) {
            if (obj != null) {
                TLog.Debug("player is ! online")
            } else {
                let window = WngMrg.getInstance().getWindow("ClickActorFrame")
                window.setFrameData(obj, "chat")//, x + 250, y + 250, true)
            }
        }
    }

    // setWindowSpaceXY(spaceX, spaceY) {
    //     this.lastX = spaceX
    //     this.lastY = spaceY
    // }

    onPrecedureDeactive(args) {
        this.packets = []
        this.chatPackets = []

        for (let _ in this.channelList) {
            let channelObj = this.channelList[_]

            channelObj.clearPacketList()
        }

        if(this.fakeChatTimer ){
            KillTimer(this.fakeChatTimer)
            this.fakeChatTimer = null
        }
        this.saveChatHistory = []

        this.delayTime = {}
        this.saveChatHistory1 = {}

        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}
    }

    onRecvWorldMsg(packet) {
        let arg: any = {}
        arg.packet = table_copy(packet)

        if (this.packets.length == 10) {
            JsUtil.arrayRemove(this.packets, 0)
        }
        JsUtil.arrayInstert(this.packets, arg)

        // if(arg.packet["channel"] != channelType.SYSTEM ){
            if(this.chatPackets.length == 10 ){
                JsUtil.arrayRemove(this.chatPackets, 0)
            }
            JsUtil.arrayInstert(this.chatPackets, arg)
        // }
    }

    getMsgPacket() {
        return this.packets
    }

    getMsgChatPacket(){
        return this.chatPackets
    }


    getChannelObj(cType) {
        return this.channelList[cType]
    }

    getAllChannelObj() {
        return this.channelList
    }

    addChannelMsg(cType, packet) {
        if (channelType.CHAT == cType) {
            this.onRecvWorldMsg(packet)
            FireEvent(EventDefine.CHAT_RECV_CHANNEL_MSG, ChatRecvChannelMsgEvent.newObj(packet))
            return
        }

        let channelObj = this.getChannelObj(cType)
        
        if (!channelObj) {
            TLog.Error("ChannelMrg.addChannelMsg channel %s is null", cType)
            return false															//表示不符合记录条件
        } 

        if (channelObj.addPacket(packet) == true) {
            this.onRecvWorldMsg(packet)
            FireEvent(EventDefine.CHAT_RECV_CHANNEL_MSG, ChatRecvChannelMsgEvent.newObj(packet))
        }   
    }

    getChannelPacketList(cType) {
        let channelObj = this.getChannelObj(cType)
        if (!channelObj) {
            TLog.Error("ChannelMrg.getChannelPacketList %s is null", cType)
            return []
        }

        // let list = []
        // if(cType == channelType.SYSTEM){
        //     channelObj = this.getAllChannelObj()    //获取全部聊天
        //     for(let _ in channelObj){
        //         let obj = channelObj[_]
        //         let packList = obj.getPacketList()
        //         for(let i = 0;i<size_t(packList);i++){
        //             let info = packList[i]
        //             table_insert(list,info)
        //         }
        //     }
        //     table_sort(list, function (a, b) {
		// 	    let aTimestamp = a.timestamp
		// 	    let bTimestamp = b.timestamp
		// 	    return aTimestamp - bTimestamp
		//     })
        //     return list
        // }
        return channelObj.getPacketList()
    }

    checkChannelCondition(cType) {
        let channelObj = this.getChannelObj(cType)
        if (!channelObj) {
            TLog.Error("ChannelConBase.checkChannelCondition channel %s is null", cType)
            return false																//表示不符合记录条件
        }

        return channelObj.checkChannelCondition()
    }

    getChannelName(cType) {
        //只有注册了的频道才会有返回
        let channel = this.getChannelObj(cType)
        let cName = "ERROR"

        if (channel) {
            cName = channel.getChannelName()
        }

        return cName
    }


    fakeChatTimer: number;
    saveChatHistory: any[]

    onHeroEnterGame(args) {
        if (this.fakeChatTimer) {
            KillTimer(this.fakeChatTimer)
            this.fakeChatTimer = null
        }

        let [flag, _] = CheckClientFuncLimit("fakeChat")
        if (flag == false) {
            this.fakeChatTimer = SetTimer(this.runFakeChat, this, 90*1000, false)
        }

        //申请聊天记录
        for(let _ in this.channelList){
             let v = this.channelList[_]
        
            v.applyChatRecord()
        }
    }

    runFakeChat() {
        //Math.randomseed(GetServerTime())
        // let [flag, _] = CheckClientFuncLimit("fakeChat")
        // if (flag == true) {
        //     if (this.fakeChatTimer) {
        //         KillTimer(this.fakeChatTimer)
        //         this.fakeChatTimer = null
        //     }
        // }

        let level = GetHeroProperty("level") || 0
        if(level>=50){
            if (this.fakeChatTimer) {
                KillTimer(this.fakeChatTimer)
                this.fakeChatTimer = null
                return
            }
        }

        this.saveChatHistory = this.saveChatHistory || []
        let index = MathUtil.random(size_t(GameConfig.FakeChatConfig)) - 1
        let vocationList = []
        for (let k in GameConfig.ProfessionModelConfig) {
            let v = GameConfig.ProfessionModelConfig[k]

            JsUtil.arrayInstert(vocationList, v.entryId)
        }
        let goToFake = MathUtil.random(3)
        if (goToFake == 3) {
            return
        }

        let indexAvailableList = []//可用的索引

        if (size_t(this.saveChatHistory) == size_t(GameConfig.FakeChatConfig)) {
            return
        } else {
            for (let k in GameConfig.FakeChatConfig) {
                let v = GameConfig.FakeChatConfig[k]

                if (!table_isExist(this.saveChatHistory, v.chatId)) {
                    JsUtil.arrayInstert(indexAvailableList, v.chatId)
                }
            }
            if (size_t(indexAvailableList) == 0) {
                return
            }

            index = MathUtil.random(indexAvailableList.length) - 1

            if (!indexAvailableList[index]) {
                return
            }

            JsUtil.arrayInstert(this.saveChatHistory, indexAvailableList[index])
            //Config.getInstance().setRoleSetting("string","indexHistory",table_save(indexHistory))
        }

        let content = "..."

        if (GameConfig.FakeChatConfig[(indexAvailableList[index])] != null) {
            content = GameConfig.FakeChatConfig[(indexAvailableList[index])].content
        }

        let iconlist = ["1", "2"]
        let packet = MessageLogic.ChannelMsgPacket.newObj()
        packet.roleId = 1
        packet.name = ""//name
        packet.channel = channelType.WORLD
        packet.sexId = MathUtil.random(1,2)
        packet.data = content
        packet.vocation = vocationList[MathUtil.random(size_t(vocationList)) - 1] || 40000
        packet.icon = iconlist[MathUtil.random(1, size_t(iconlist))]

        packet.name = RandomRobotName()
        packet.timestamp = GetServerTime()
        this.addChannelMsg(channelType.WORLD, packet)
        this.addChannelMsg(channelType.SYSTEM, packet)
    }

    //已解锁气泡列表
    setUnlockBubbleList( args){
        this.unlockBubbleList = args
    }

    getUnlockBubbleList(){
        return this.unlockBubbleList || []
    }


    findMsgPacket( playerId){
        for(let i in this.channelList){
            let v = this.channelList[i]
        
            let packet = v.findMsgPacket(playerId)
            if(packet ){
                return packet
            }
        }
        
        return null
    }

    /*
    机器人私聊
    */
    creatfakeChat(){
        if (!this.timerList["fakeChat"]) {
            this.timerList["fakeChat"] = SetTimer(this.fakeBoxChat, this, 200, false)
            this.delayTime = {}
        }
    }

    fakeBoxChat(delay) {
        this.delayTime["max"] = (this.delayTime["max"] || 0) + delay
        if (this.delayTime["max"] > 4 * 60 * 1000) {
            if (this.timerList["fakeChat"]) {
                KillTimer(this.timerList["fakeChat"])
                delete this.timerList["fakeChat"]
                this.delayTime = {}
                this.saveChatHistory1 = {}
            }
        } else {
            //世界频道
            // this.refreshFakeBoxWorldChat(delay)
            //私聊
            this.refreshFakeBoxChat(delay)
        }
    }

    // refreshFakeBoxWorldChat(delay) {
    //     this.delayTime["world"] = this.delayTime["world"] || 0
    //     this.delayTime["world"] = this.delayTime["world"] + delay
    //     this.delayTime["worldMax"] = (this.delayTime["worldMax"] || 0) + delay

    //     if (this.delayTime["worldMax"] > 60 * 1000) {

    //     } else {
    //         if (this.delayTime["world"] > 5000 + 1000) {
    //             this.delayTime["world"] = 5000
    //             if (!this.saveChatHistory1["world"]) {
    //                 this.saveChatHistory1["world"] = []
    //                 this.saveChatHistory1["worldPlayer"] = []//{{vocation, name}}

    //                 let chatCount = MathUtil.random(4, 6)//Math.random(4, 6)
    //                 for (let i = 1; i <= chatCount; i++) {
    //                     this.genRandomChat("world", GameConfig.FakeBoxWorldChatConfig)//4~6条对白
    //                 }

    //                 let vocationList = []
    //                 for (let k in GameConfig.ProfessionModelConfig) {
    //                     let v = GameConfig.ProfessionModelConfig[k]

    //                     JsUtil.arrayInstert(vocationList, k)
    //                 }
    //                 let playerCount = 30//30个人说话
    //                 for (let i = 1; i <= playerCount; i++) {
    //                     let vocation = vocationList[MathUtil.random(size_t(vocationList)) - 1] || 40000//vocationList[Math.random(size_t(vocationList))] || 40000
    //                     let name = RandomRobotName()
    //                     JsUtil.arrayInstert(this.saveChatHistory1["worldPlayer"], [vocation, name])
    //                 }
    //             }

    //             let goToFake = MathUtil.random(2)//Math.random(2)
    //             if (goToFake != 2) {
    //                 return
    //             }

    //             let sum = this.saveChatHistory1["world"].length
    //             if (sum == 0) {
    //                 return
    //             }
    //             let index = JsUtil.arrayRemove(this.saveChatHistory1["world"], MathUtil.random(sum) - 1)//Math.random(sum))
    //             if (!index) {
    //                 return
    //             }
    //             let content = "..."

    //             if (GameConfig.FakeBoxWorldChatConfig[Number(index)] != null) {
    //                 content = GameConfig.FakeBoxWorldChatConfig[Number(index)].content

    //                 let args: any = {}
    //                 let form = GameConfig.FakeBoxWorldChatConfig[Number(index)].transform || {}
    //                 for (let k in form) {
    //                     let v = form[k]

    //                     args[k] = ""
    //                 }
    //                 let config = table_copy(GameConfig.FakeBoxWorldChatConfig[Number(index)])
    //                 config.msg = config.content
    //                 content = MsgSystem.analyzeMsg(null, args, config)
    //             }
    //             let playerConfig = this.saveChatHistory1["worldPlayer"][MathUtil.random(this.saveChatHistory1["worldPlayer"].length) - 1]
    //             let iconlist: any = ["1", "2"]
    //             let packet = MessageLogic.ChannelMsgPacket.newObj()
    //             packet.roleId = 0
    //             packet.name = playerConfig[1] || ""
    //             packet.channel = channelType.WORLD
    //             packet.sexId = MathUtil.random(2)//Math.random(2)
    //             packet.data = content
    //             packet.vocation = playerConfig[0] || 40000
    //             packet.icon = iconlist[MathUtil.random(size_t(iconlist)) - 1] || "1"//iconlist[Math.random(size_t(iconlist))] || "1"

    //             ChannelMrg.getInstance().addChannelMsg(channelType.WORLD, packet)
    //         }
    //     }
    // }

    refreshFakeBoxChat(delay) {
        this.delayTime["chat"] = this.delayTime["chat"] || 100000
        this.delayTime["chat"] = this.delayTime["chat"] + delay
        this.delayTime["chatMax"] = (this.delayTime["chatMax"] || 0) + delay

        if (this.delayTime["chatMax"] > 3 * 60 * 1000) {

        } else {
            if (this.delayTime["chat"] > 10000+1000) {
                this.delayTime["chat"] = 1000
                if (!this.saveChatHistory1["chat"]) {
                    this.saveChatHistory1["chat"] = []
                    this.saveChatHistory1["chatPlayer"] = []						//{{vocation, name, roleId}}
                    this.saveChatHistory1["chatedPlayer"] = []					//已发过言的玩家

                    let chatCount = MathUtil.random(3, 4)
                    for (let i = 1; i <= chatCount; i++) {
                        this.genRandomChat("chat", GameConfig.EasterEggChatConfig)									//4~6条对白
                    }

                    let vocationList = []
                    for (let k in GameConfig.ProfessionModelConfig) {
                        let v = GameConfig.ProfessionModelConfig[k]

                        JsUtil.arrayInstert(vocationList, k)
                    }
                    let playerCount = MathUtil.random(3, 4)																								//3~4个人说话
                    for (let i = 1; i <= playerCount; i++) {
                        let vocation = vocationList[MathUtil.random(size_t(vocationList)) - 1] || 40000
                        let name = RandomRobotName()

                        let roleId = null
                        let roleList = []
                        let list = this.saveChatHistory1["chatPlayer"]
                        for (let _ in list) {
                            let v = list[_]

                            JsUtil.arrayInstert(roleList, v[2])
                        }
                        for (let i = 1; i <= 1000; i++) {
                            let id = MathUtil.random(100)
                            if (!table_isExist(roleList, id)) {
                                roleId = id
                                break
                            }
                        }
                        if (roleId) {
                            JsUtil.arrayInstert(this.saveChatHistory1["chatPlayer"], [ vocation, name, roleId ])
                        }
                    }
                }

                // let goToFake = MathUtil.random(8)
                // if (goToFake != 8) {
                //     return
                // }

                let playerConfig = this.saveChatHistory1["chatPlayer"][MathUtil.random(this.saveChatHistory1["chatPlayer"].length) - 1]
                if (table_isExist(this.saveChatHistory1["chatedPlayer"], playerConfig[2])) {
                    return
                } else {
                    JsUtil.arrayInstert(this.saveChatHistory1["chatedPlayer"], playerConfig[2])
                }

                let sum = this.saveChatHistory1["chat"].length
                if (sum == 0) {
                    return
                }
                let index = JsUtil.arrayRemove(this.saveChatHistory1["chat"], MathUtil.random(sum)-1)
                if (!index) {
                    return
                }

                let content = "..."

                if (GameConfig.EasterEggChatConfig[Number(index)] != null) {
                    content = GameConfig.EasterEggChatConfig[Number(index)].content

                    let args: any = {}
                    let form = GameConfig.EasterEggChatConfig[Number(index)].transform || {}
                    for (let k in form) {
                        let v = form[k]

                        args[k] = ""
                    }
                    let config = table_copy(GameConfig.EasterEggChatConfig[Number(index)])
                    config.msg = config.content
                    content = MsgSystem.analyzeMsg(null, args, config)
                }

                let iconlist: any = ["1", "2"]
                let packet = MessageLogic.ChannelMsgPacket.newObj()
                packet.roleId = playerConfig[2] || 0
                packet.name = playerConfig[1] || ""
                packet.channel = channelType.CHAT
                packet.sexId = MathUtil.random(2)
                packet.data = content
                packet.vocation = playerConfig[0] || 40000
                packet.icon = iconlist[MathUtil.random(size_t(iconlist))] || "1"

                // this.onRecvWorldMsg(packet)
                // FireEvent(EventDefine.CHAT_RECV_CHANNEL_MSG, ChatRecvChannelMsgEvent.newObj(packet))

                ChannelMrg.getInstance().addChannelMsg(channelType.CHAT, packet)
            }
        }
    }

    genRandomChat(name, list) {
        let index =0

        let indexAvailableList = []//可用的索引

        if (size_t(this.saveChatHistory1[name]) == size_t(list)) {
            return
        } else {
            for (let k in list) {
                let v = list[k]

                if (!table_isExist(this.saveChatHistory1[name], k)) {
                    JsUtil.arrayInstert(indexAvailableList, k)
                }
            }
            if (size_t(indexAvailableList) == 0) {
                return
            }

            index = MathUtil.random(size_t(indexAvailableList)) - 1

            if (!indexAvailableList[index]) {
                return
            }

            JsUtil.arrayInstert(this.saveChatHistory1[name], indexAvailableList[index])
        }
    }
}