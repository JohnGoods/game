/*
作者:
    panyuxiong
	
创建时间：
    2014.09.01(星期一) 

意图：
  	邮件管理系统

公共接口：

		getMailList(){																	//-获取邮件列表

		setMailList(list){														//-设置邮件列表
	
*/

class MailSystem extends BaseSystem {

    mail_list: any[];
    //IconMsgList: any[];

    public initObj(...args: any[]): void {
        this.onClear()
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    destory() {

    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    prepareResource(workQueue) {

    }

    onClear() {
        this.mail_list = []				//邮件列表
        //this.IconMsgList = []
    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //-设置邮件列表
    setMailList(list) {
        for (let _ in list) {
            let v = list[_]

            let falg = true
            for (let i in this.mail_list) {
                let value = this.mail_list[i]

                if (v["id"] == value["id"]) {
                    falg = false
                }
            }
            if (falg) {
                JsUtil.arrayInstert(this.mail_list, v)
            }
        }
        this._onUpdate()
    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //-获取邮件列表
    getMailList() {
        let returnMail = this.mail_list
        if (this.mail_list.length > defaultValue.DEFALUT_EMAIL_MAX) {
            returnMail = []
            for (let i = 0; i < defaultValue.DEFALUT_EMAIL_MAX; i++) {
                JsUtil.arrayInstert(returnMail, this.mail_list[i])
            }
        }
        return returnMail
    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //-邮件已读
    setReadMail(id, status) {
        for (let i in this.mail_list) {
            let v = this.mail_list[i]

            if (v["id"] == id) {
                v["status"] = status
            }
        }
        this._onUpdate()
    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //-获取邮件数量
    getEmailCount() {
        let emailList = []
        for (let i in this.mail_list) {
            let v = this.mail_list[i]

            JsUtil.arrayInstert(emailList, v)
        }
        return emailList.length
    }

    //-删除邮件
    removeEmailById(id) {
        //TLog.Debug("MailSystem.removeEmailById", id)
        // if (this.mail_list[id]) {
        //     if (this.mail_list[id].id == id) {
        //         //TLog.Debug("removeEmailById 1 ")
        //         JsUtil.arrayRemove(this.mail_list, id)
        //         return
        //     }
        // }
        let removeIndex = null
        //for (let _i in this.mail_list) {
        for(let _i = 0; _i < this.mail_list.length; _i++){
            let _v = this.mail_list[_i]

            if (_v.id == id) {
                removeIndex = _i
                break
            }
        }
        if (removeIndex != null) {
            //TLog.Debug("removeEmailById 2 ")
            JsUtil.arrayRemove(this.mail_list, removeIndex)
            //return
        }
        this._onUpdate()
    }

    _onUpdate(){
        if( this.getUnReadEmailCount() <= 0 ){
            //this.removeAllIconMsgInfo();
            MsgSystem.removeIconMsgByType(IconMsgType.EMAIL_LIST)
        }
    }

    // removeAllIconMsgInfo() {
    //     for (let _i in this.IconMsgList) {
    //         let _info = this.IconMsgList[_i]

    //         MsgSystem.removeIconMsg(_info.iconID)
    //     }
    //     this.IconMsgList = []
    // }

    // addIconMsgInfo(info) {
    //     JsUtil.arrayInstert(this.IconMsgList, info)
    // }

    // getIconMsgList() {
    //     return this.IconMsgList
    // }


    getUnReadEmailCount() {
        let count = 0
        for (let i in this.mail_list) {
            let v = this.mail_list[i]

            if (v.status == opEmailStatus.UnReadNoGet) {
                count = count + 1
            }
        }
        return count
    }
}