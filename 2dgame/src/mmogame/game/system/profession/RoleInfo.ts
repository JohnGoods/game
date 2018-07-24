/*
作者:
		panjunhua
   
	
创建时间：
   2015.3.30(周一)

意图：
   玩家信息

公共接口：
	 //消息包解析 read(reader){

*/
class RoleInfo extends TClass {
	id:number;
	name:string;
	vocation:number;
	sexId:number;
	VipLevel:number;

	public initObj(...args: any[]): void {
		this.id = null
		this.name = null
		this.vocation = null
		this.sexId = null
		this.VipLevel = null
	}


	read(reader) {   //消息包解析
		this.id = reader.readUInt()						//ID
		this.name = reader.readString()			//名字
		this.vocation = reader.readUInt()				//职业
		this.sexId = reader.readUChar()			//性别
		this.VipLevel = reader.readUChar()			//Vip等级
	}
	// getRoleInfo():any[]{
	// 	return [this.id, this.name, this.vocation, this.VipLevel, this.sexId]
	// }
}