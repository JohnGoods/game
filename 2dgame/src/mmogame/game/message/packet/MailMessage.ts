/*
作者:
    panyuxiong
	
创建时间：
    2014.07.15(星期二) 

意图：
  		处理活动的消息

公共接口：
	
*/
module MessageLogic{
//邮件列表
export class Message_G2C_EMAIL_RECV extends MessageBase {
    mail_list: any[]
    public initObj(...args: any[]): void {
        this.mail_list = []
        this.fireEvent = true
    }

    pack(writer) {

    }

    unpack(reader) {
        this.mail_list = []
        let count = reader.readUInt()
        for (let i = 1; i <= count; i++) {
            let mail: any = {}
            mail.id = reader.readUInt()												//邮件ID
            mail.title = reader.readUInt() 									//邮件标题
            mail.name = reader.readString()								//邮件名称
            mail.send_time = reader.readUInt()								//邮件发送时间
            mail.valid_time = reader.readUInt()								//邮件的有效时间
            mail.context = reader.readString()						//邮件的内容
            mail.mail_type = reader.readUInt()								//邮件类型
            mail.status = reader.readUInt()										//邮件状态
            mail.item = table_load(reader.readString())		//奖励物品
            mail.momey = table_load(reader.readString())	//奖励金钱
            mail.pet = table_load(reader.readString())		//奖励宠物
            //this.mail_list[i] = mail
            this.mail_list.push(mail)
        }
    }

    //发送已读
}

export class Message_C2G_EMAIL_READ extends MessageBase {
    id
    public initObj(...args: any[]): void {
        this.id = 0
    }

    pack(writer) {
        writer.writeUInt(this.id)
    }

    unpack(reader) {

    }

    //邮件已读
}

export class Message_G2C_EMAIL_READ extends MessageBase {
    id
    staust
    public initObj(...args: any[]): void {
        this.id = 0
        this.staust = 0
    }

    pack(writer) {

    }

    unpack(reader) {
        this.id = reader.readUInt()
        this.staust = reader.readUInt()
       
    }

    //领取邮件物品
}

export class Message_C2G_EMAIL_GET_ANNEX extends MessageBase {
    id
    public initObj(...args: any[]): void {
        this.id = 0
    }

    pack(writer) {
        writer.writeUInt(this.id)
    }

    unpack(reader) {

    }

    //删除邮件
}

export class Message_C2G_EMAIL_REMOVE extends MessageBase {
    mailId
    public initObj(...args: any[]): void {
        this.mailId = 0
    }

    pack(writer) {
        writer.writeUInt(this.mailId)
    }

    unpack(reader) {

    }

    //删除邮件
}

export class Message_G2C_EMAIL_REMOVE extends MessageBase {
    mailId
    public initObj(...args: any[]): void {
        this.mailId = null
    }

    pack(writer) {

    }

    unpack(reader) {
        this.mailId = reader.readUInt()
    }
    //一键领取邮件
}

export class Message_C2G_EMAIL_ALL extends MessageBase {
    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {

    }

}
}