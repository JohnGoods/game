class FunInfo extends TClass {

    public initObj(...args: any[]): void {

    }

    read(reader) {
        let this_: any = this
        this_.showIndex = reader.readUShort() //0表示没有开，然后就结束协议，没有后面的数据
        if (this_.showIndex == 0) {
            return
        }

        this_.level = reader.readUShort() //等级
        this_.exp = reader.readUInt() //经验

        let skillnum = reader.readChar() //技能数量
        this_.skillList = []
        for (let i = 0; i < skillnum; i++) {
            JsUtil.arrayInstert(this_.skillList, reader.readUShort())
        }

        let equipNum = reader.readChar() //装备数量
        this_.equipList = []
        for (let i = 0; i < equipNum; i++) {
            JsUtil.arrayInstert(this_.equipList, reader.readUInt())
        }

        this_.drugNum = reader.readUShort() //使用属性丹
        this_.curSkin = reader.readUShort() //当前皮肤

        let skinnum = reader.readUShort() //皮肤列表
        this_.skinList = []
        for (let i = 0; i < skinnum; i++) {
            JsUtil.arrayInstert(this_.skinList, reader.readUShort())
        }

        this_.curShare = reader.readUShort() //当前外形(外形是每一阶段的，需要等级满足才会开启)
				//"entryid:uint32",
				//"showindex:uint32",
				//"stage:uint16",
				//"stageexp:uint32",
				//"skilllevellist:table",
				//"equiplist:table",
				//"drugnum:uint16",
				//"curskin:uint16",
				//"skinlist:table",
				//"curshape:uint16"
    }
}