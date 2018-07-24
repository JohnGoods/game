/*
作者:
    panyuxiong
	
创建时间：
    2014.09.01(星期一) 

意图：
  		邮件信息处理
	
公共接口：
	
*/

class MailMessageHandler extends MessageHandler {

    public initObj(...args: any[]): void {
        this.register(opCodes.G2C_EMAIL_RECV, this.onRecvG2C_EMAIL_RECV, this)		//邮件列表
        this.register(opCodes.G2C_EMAIL_READ, this.onRecvG2C_EMAIL_READ, this)		//邮件已读	
        this.register(opCodes.G2C_EMAIL_REMOVE, this.onRecvG2C_EMAIL_REMOVE, this)	//邮件删除	

    }

    onRecvG2C_EMAIL_RECV(dispatcher, message) {
        let mailCount = 0
        for (let _i in message.mail_list) {
            let _v = message.mail_list[_i]

            mailCount = mailCount + 1
        }
        //TLog.Debug("shou mail icon   count = ",mailCount )
        if (mailCount <= 0) {
            return
        }

        MailSystem.getInstance().setMailList(message.mail_list)
        FireEvent(EventDefine.MAIL_LIST, null)

        let cbObj: IIconMsgCallBack = {
             onIconMsgCallBack(id:number, userData):boolean{
                 WngMrg.getInstance().showWindow("MailListFrame")
                 return false;
            }
        }

        if(MsgSystem.isIconTypeExsit(IconMsgType.EMAIL_LIST) == false){
           MsgSystem.addIconMsg(cbObj, null, IconMsgType.EMAIL_LIST)
        }

    }

    onRecvG2C_EMAIL_READ(dispatcher, message) {

        MailSystem.getInstance().setReadMail(message.id, message.staust)
        FireEvent(EventDefine.MAIL_READ, null)
    }

    onRecvG2C_EMAIL_REMOVE(dispatcher, message) {
        MailSystem.getInstance().removeEmailById(message.mailId)

        FireEvent(EventDefine.MAIL_READ, null)
    }

}