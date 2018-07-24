/*
作者:
    yangguiming
	
创建时间：
   2017.03.02(周四)

意图：
   贵族答题
公共接口：
   
*/

module MessageLogic{

//查询当前答题状态
export class Message_C2G_WORLDQUESTION_QUERY extends MessageBase {

    public initObj(...args: any[]): void {
    }

    pack(writer) {
    }

    unpack(reader) {
    }


    //答题状态
}

export class Message_G2C_WORLDQUESTION_QUERY extends MessageBase {
    state
    public initObj(...args: any[]): void {
        this.state = 0
    }

    pack(writer) {

    }

    unpack(reader) {
        this.state = reader.readUInt()
        TLog.Debug("Message_G2C_WORLDQUESTION_QUERY", this.state)
    }



    //答题信息
}

export class Message_G2C_WORLDQUESTION_INFO extends MessageBase {
    score
    rank
    followTimes
    doubleScoreTimes

    public initObj(...args: any[]): void {
        this.score = 0
        this.rank = 0
        this.followTimes = 0
        this.doubleScoreTimes = 0
    }

    pack(writer) {
    }

    unpack(reader) {
        this.score = reader.readUInt()
        this.rank = reader.readUInt()
        this.followTimes = reader.readUInt()
        this.doubleScoreTimes = reader.readUInt()
    }

    //进入确认
}

export class Message_G2C_WORLDQUESTION_ENTER extends MessageBase {

    public initObj(...args: any[]): void {
    }

    pack(writer) {
    }

    unpack(reader) {
    }

    //退出确认
}

export class Message_G2C_WORLDQUESTION_LEAVE extends MessageBase {

    public initObj(...args: any[]): void {
    }

    pack(writer) {
    }

    unpack(reader) {
    }

    //答案返回
}

export class Message_G2C_WORLDQUESTION_ANSWER extends MessageBase {
    isCorrect
    //0:fail 1:success
    public initObj(...args: any[]): void {
        this.isCorrect = 0
    }

    pack(writer) {
    }

    unpack(reader) {
        this.isCorrect = reader.readUInt()
    }

    //题目信息
}

export class Message_G2C_WORLDQUESTION_QUESTION extends MessageBase {
    questionIndex
    questionTime
    index
    leftAnswer
    rightAnswer
    correctAnswer

    public initObj(...args: any[]): void {
        this.questionIndex = 0 //当前第几题
        this.questionTime = 0	 //开始时间
        this.index = 0				 //题目索引号
        this.leftAnswer = ""   //选项A
        this.rightAnswer = ""  //选项B
        this.correctAnswer = "" //正确答案
    }

    pack(writer) {
    }

    unpack(reader) {
        this.questionIndex = reader.readUInt()
        this.questionTime = reader.readUInt()
        this.index = reader.readUInt()
        this.leftAnswer = reader.readString()
        this.rightAnswer = reader.readString()
        this.correctAnswer = reader.readString()
    }



    //C2G
    //答题进入
}

export class Message_C2G_WORLDQUESTION_ENTER extends MessageBase {

    public initObj(...args: any[]): void {
    }

    pack(writer) {
    }

    unpack(reader) {
    }

    //答题退出
}

export class Message_C2G_WORLDQUESTION_LEAVE extends MessageBase {

    public initObj(...args: any[]): void {
    }

    pack(writer) {
    }

    unpack(reader) {
    }

    //答题 0左边 1右边
}

export class Message_C2G_WORLDQUESTION_ANSWER extends MessageBase {
    side
    public initObj(...args: any[]): void {
        this.side = 0
    }

    pack(writer) {
        writer.writeUInt(this.side)
    }

    unpack(reader) {
    }

    //世界答题 "follow"跟随 "double"
}

export class Message_C2G_WORLDQUESTION_SKILL extends MessageBase {
    skillToUse
    public initObj(...args: any[]): void {
        this.skillToUse = ""
    }

    pack(writer) {
        writer.writeString(this.skillToUse)
    }

    unpack(reader) {
    }
}
}