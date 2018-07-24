/*
作者:
    panjunhua
	
创建时间：
   2014.9.5(周五)

意图：
 	export class Message_C2G_ROLE_NEWBIE_SETTING_RECORD extends MessageBase{  //指引记录  

公共接口：   
*/

//指引记录
//////-发包

module MessageLogic{

export class Message_C2G_ROLE_NEWBIE_SETTING_RECORD extends MessageBase {  //指引记录
	errantry
	public initObj(...args: any[]): void {
		this.errantry = 0
	}
	pack(writer) {
		writer.writeString(this.errantry)
	}
	unpack(reader) {

	}

}

export class Message_G2C_ROLE_NEWBIE_SETTING_RECORD extends MessageBase {  //功能开启
	errantry
	public initObj(...args: any[]): void {
		this.errantry = 0
	}
	pack(writer) {

	}
	unpack(reader) {
		this.errantry = reader.readString()
	}

}

export class Message_C2G_ROLE_NEWBIE_CHANGE extends MessageBase {  //指引功能记录（改变）.
	errantry
	changeType
	public initObj(...args: any[]): void {
		this.errantry = 0
		this.changeType = 0
	}
	pack(writer) {
		writer.writeUInt(this.errantry)
		writer.writeChar(this.changeType)
	}
	unpack(reader) {

	}

}

export class Message_C2G_ROLE_NEWBIE_SAVE_RECORD extends MessageBase {  //指引记录
	record
	public initObj(...args: any[]): void {
		this.record = null
	}
	pack(writer) {
		let sendData = table_save(this.record)
		writer.writeString(sendData)
	}
	unpack(reader) {

	}

	//性别设置
}

// export class Message_C2G_SET_SEX extends MessageBase {
// 	sexId
// 	public initObj(...args: any[]): void {
// 		this.sexId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.sexId)
// 	}

// 	unpack(reader) {

// 	}
// }

}