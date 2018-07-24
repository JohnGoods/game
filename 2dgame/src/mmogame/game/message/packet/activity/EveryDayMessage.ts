/*
作者:
    
	
创建时间：
   2013.8.26(周一)

意图：
   

公共接口：
 
   
*/

module MessageLogic{
    
//请求竞技场信息
export class Message_C2G_FIGHT_CHAMPION_REFRESH extends MessageBase {

    public initObj(...args: any[]): void {

    }
    pack(writer) {

    }
    unpack(reader) {

    }
}

//竞技场信息
export class Message_G2C_FIGHT_CHAMPION_REFRESH extends MessageBase {
    force:number
    rank:number
    times:number
    maxTimes:number
    time:number
    winStreak:number
    enemyList: any[]

    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {
        this.force = tonumber(reader.readString()) || 0//战力
        this.rank = reader.readUInt()//名次
        this.times = reader.readUInt()//剩下多少次
        this.maxTimes = reader.readUInt()//最多多少次
        this.time = reader.readUInt()//多长时间后可以再挑战
        this.winStreak = reader.readUInt()//连胜次数
        let num = reader.readUShort()//多少个对手
        this.enemyList = []
        for (let i = 1; i <= num; i++) {
            let enemy = ReadChampionEnemy(reader)
            JsUtil.arrayInstert(this.enemyList, enemy)
        }
    }
}

function ReadChampionEnemy(reader){
	let ret:any = {}
	ret.id	 = reader.readUInt()
	ret.name = reader.readString()
	ret.vocation = reader.readUInt()
	ret.rank = reader.readUInt()
	ret.wins = reader.readUInt()
	ret.force = reader.readUInt()
	ret.level = reader.readUInt()
	ret.sex = reader.readUInt()
	ret.queue = table_load(reader.readString())								//{entryId, uid, state}
	ret.breakList = table_load(reader.readString()) || {}			//{[pos] : breakLevel}
	ret.qualityList = table_load(reader.readString()) || {}			//{[pos] : qualityLevel}
	//for(let i = 1; i <= 18;i++){
	//	let id = reader.readUInt()
	//	JsUtil.arrayInstert(ret.queue, id)
	//}

	return ret
}

//排名
export class Message_C2G_FIGHT_CHAMPION_TOP_RANK extends MessageBase {

    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {

    }
}

//排名
export class Message_G2C_FIGHT_CHAMPION_TOP_RANK extends MessageBase {
    enemyList:any[]

    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {
        let num = reader.readUShort()//多少个对手
        this.enemyList = []
        for (let i = 1; i <= num; i++) {
            let enemy = ReadChampionEnemy(reader)
            JsUtil.arrayInstert(this.enemyList, enemy)
        }
    }


    //请求挑战
}

export class Message_C2G_FIGHT_CHAMPION_BATTLE extends MessageBase {
    rank:number
    name:string
    playerID:number

    public initObj(...args: any[]): void {
        this.rank = 0
        this.name = ""
        this.playerID = null
    }

    pack(writer) {
        writer.writeUInt(this.rank)
        writer.writeString(this.name)
        writer.writeUInt(this.playerID)
    }

    unpack(reader) {

    }

    //对战记录
}

export class Message_C2G_FIGHT_CHAMPION_RECORD extends MessageBase {
    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {

    }

}

export class Message_G2C_FIGHT_CHAMPION_RECORD extends MessageBase {
    championRecordList:any[]
    
    public initObj(...args: any[]): void {
        this.championRecordList = []
    }

    pack(writer) {

    }

    unpack(reader) {
        this.championRecordList = []
        let count = reader.readChar()			//记录数量
        for (let i = 1; i <= count; i++) {
            let recordInfo: any = {}
            recordInfo.result = reader.readChar()			//结果
            recordInfo.id = reader.readUInt()		//录像ID
            recordInfo.ownerID = reader.readUInt()		//拥有者ID
            recordInfo.playerInfo = {}
            recordInfo.playerInfo.id = reader.readUInt()						//id
            recordInfo.playerInfo.name = reader.readString()		//名字
            recordInfo.playerInfo.vocation = reader.readUShort()				//职业
            recordInfo.playerInfo.level = reader.readUShort()			//等级
            recordInfo.playerInfo.force = reader.readUInt()				//战力
            recordInfo.playerInfo.sex = reader.readChar()				  //性别
            recordInfo.selfInfo = {}
            recordInfo.selfInfo.id = reader.readUInt()						//id
            recordInfo.selfInfo.name = reader.readString()		//名字
            recordInfo.selfInfo.vocation = reader.readUShort()	  //职业
            recordInfo.selfInfo.level = reader.readUShort()			//等级
            recordInfo.selfInfo.force = reader.readUInt()				//战力
            recordInfo.selfInfo.sex = reader.readChar()				  //性别
            JsUtil.arrayInstert(this.championRecordList, recordInfo)
        }
    }
}

//观看录像
export class Message_C2G_FIGHT_CHAMPION_VIEDO extends MessageBase {
    viedoID:number
    roleId:number

    public initObj(...args: any[]): void {
        this.viedoID = null
        this.roleId = 0
    }

    pack(writer) {
        writer.writeUInt(this.viedoID)
        writer.writeUInt(this.roleId)
    }

    unpack(reader) {

    }
}

//观看全局录像
export class Message_C2G_FIGHT_GLOBAL_VIEDO extends MessageBase {
    viedoID:number
    roleId:number

    public initObj(...args: any[]): void {
        this.viedoID = null
        this.roleId = 0
    }

    pack(writer) {
        writer.writeUInt(this.viedoID)
        writer.writeUInt(this.roleId)
    }

    unpack(reader) {

    }
}

//清除等待时间
export class Message_C2G_FIGHT_CHAMPION_CLEAR extends MessageBase {
    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {

    }
}

//竞技场刷新
export class Message_C2G_FIGHT_CHAMPION_REFRESH_EX extends MessageBase{
public initObj(...args:any[]):void {
	
}

pack( writer){
	
}

unpack( reader){
	
}


}

//竞技场刷新返回
export class Message_G2C_FIGHT_CHAMPION_REFRESH_EX extends MessageBase {
    times:number
    maxTimes:number
    time:number
    winStreak:number
    force:number
    //topList:any

    public initObj(...args: any[]): void {
        this.times = null //剩下多少次
        this.maxTimes = null //最多多少次
        this.time = null  //多长时间后可以再挑战
        this.winStreak = null //连胜次数
        this.force = null //战力
    }

    pack(writer) {

    }

    unpack(reader) {
        this.times = reader.readUInt()//剩下多少次
        this.maxTimes = reader.readUInt()//最多多少次
        this.time = reader.readUInt()//多长时间后可以再挑战	
        this.winStreak = reader.readUInt()//连胜次数
        this.force =  tonumber(reader.readString()) || 0//战力
        //this.topList = table_load(reader.readString())
    }

}

export class Message_G2C_FIGHT_CHAMPION_EX_PRIZE extends MessageBase {
    bestRank:number
    plrRank:number
    rankUp:number

    public initObj(...args: any[]): void {
        this.bestRank = null //最高排名
        this.plrRank = null //当前排名
        this.rankUp = null //上升排名
        //this.prizeList = null //奖励
    }

    pack(writer) {

    }

    unpack(reader) {
        this.bestRank = reader.readUInt() //最高排名
        this.plrRank = reader.readUInt() //当前排名
        this.rankUp = reader.readUInt() //上升排名
        //this.prizeList = table_load(reader.readString()) //奖励
    }

    //购买竞技场次数
}

export class Message_C2G_FIGHT_CHAMPION_INCREASE extends MessageBase {
    buyTime:number

    public initObj(...args: any[]): void {
        this.buyTime = 1
    }

    pack(writer) {
        writer.writeUInt(this.buyTime)
    }

    unpack(reader) {

    }
}
}