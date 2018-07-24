// TypeScript file
class Activity_HuSong extends ActivityBase {
    husongInfo: any
    husongList: any
    robberList: any
    prizeInfo: any

    isGetHusongPrice: boolean

    public initObj(...args: any[]): void {
        this.onClear()
    }

    destory() {
        // UnRegisterEvent(EventDefine.UPDATE_WELFARE, this.onAutoShow, this)
        // UnRegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onAutoShow, this)
    }

    onPrepareResource() {
        // RegisterEvent(EventDefine.UPDATE_WELFARE, this.onAutoShow, this)
        // RegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onAutoShow, this)

        this.messageWndHandleIndex =
            {
                ["G2C_EnterEscortActivity"]: [this.onRecvHuSong, [["EscortFrame", "updateWnd"], ["OdysseyEscortFrame", "updateWnd"], ["ActivityListFrame", "updateWnd"]], true],
                ["G2C_EscortList"]: [this.onRecvHuSongList, [["EscortFrame", "updateWnd"]], true],
                ["G2C_RandEscortIndex"]: [this.onRecvHuSongIndex, [["OdysseyEscortFrame", "updateWnd"]], true],
                ["G2C_RobberEscortRecordList"]: [this.onRecvRobberRecordList, [["InterceptRecordFrame", "updateWnd"]], true],
                ["G2C_PutEscortPrizeInfo"]: [this.onRecvPrize, [["EscortFrame", "onShowPrize"]], true],
            }
    }

    onClear() {
        this.husongInfo = {}
        this.husongList = []
        this.robberList = []
        this.prizeInfo = {}

        this.isGetHusongPrice = false
    }

    onRecvHuSong(message) {
        this.husongInfo = {}
        this.husongInfo = message
        FireEvent(EventDefine.ESCORT_UPDATE, null)
        return true
    }

    onRecvHuSongList(message) {
        this.husongList = []
        for (let k in message) {
            let v = message[k]
            let tempConfig = {}
            tempConfig["id"] = v[0]
            tempConfig["name"] = v[1]
            tempConfig["time"] = v[2]
            tempConfig["index"] = v[3]
            tempConfig["banghui"] = v[4]
            tempConfig["force"] = v[5]
            tempConfig["robbered"] = v[6]

            table_insert(this.husongList, tempConfig)
        }
        FireEvent(EventDefine.ESCORT_UPDATE, null)
        return true
    }

    onRecvRobberRecordList(message) {
        this.robberList = []
        for (let k in message) {
            let v = message[k]
            let tempConfig = {}
            tempConfig["id"] = v[0]
            tempConfig["name"] = v[1]
            tempConfig["time"] = v[2]
            tempConfig["index"] = v[3]
            tempConfig["winFlag"] = v[4]

            tempConfig["revengeFlag"] = v[5]
            tempConfig["faction"] = v[6]
            tempConfig["force"] = v[7]
            tempConfig["revengIndex"] = tonumber(k) + 1
            table_insert(this.robberList, tempConfig)
        }
        return true
    }

    onRecvHuSongIndex(message) {
        let isShow = (this.husongInfo["index"] || 0) == message ? true : false
        this.husongInfo["index"] = message
        if (isShow) {
            MsgSystem.addTagTips(String.format(Localize_cns("ESCORT_RANDINDEX"), "#" + GetQualityColorStr(message, true) + GameConfig.EscortConfig[message].tip))
        }
        return true
    }

    onRecvPrize(message) {
        this.prizeInfo = {}

        this.prizeInfo["recordList"] = []
        let recordList = message.robberedList
        for (let k = 0; k < size_t(recordList); k++) {
            let record = recordList[k]
            let tempConfig = {}
            tempConfig["name"] = record[0]
            tempConfig["winFlag"] = record[1]

            table_insert(this.prizeInfo["recordList"], tempConfig)
        }
        this.prizeInfo["isDouble"] = message.isDouble || 1
        this.isGetHusongPrice = true
        FireEvent(EventDefine.ESCORT_UPDATE, null)
        return true
    }


    ///------------- 取数据
    getActInfo() {
        return this.husongInfo
    }

    getHuSongList() {
        return this.husongList
    }

    getRobberRecordList() {
        return this.robberList
    }

    getHusongPrize() {
        return this.prizeInfo
    }

    //护送橙镖的次数
    getConvoyNum() {
        return this.husongInfo.chengTwice
    }

    ///--------
    getIsPrize() {
        return this.isGetHusongPrice || false
    }

    setIsPrize(b: boolean) {
        this.isGetHusongPrice = b || false
    }
}