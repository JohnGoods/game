class TaskInfo extends TClass {

  public initObj(...args: any[]): void {

  }

  read(reader) {
    let this_:any = this;
    this_.taskId = reader.readUInt() //任务ID
    this_.Type = reader.readUChar()//任务类型
    this_.hoop = reader.readUInt() //环【大】
    this_.segment = reader.readUInt() //段【小】
    this_.init = table_load(reader.readString()) //初始数据
    this_.finish = table_load(reader.readString()) //完成任务的数据
    this_.prize = table_load(reader.readString()) //任务奖励
    this_.data = table_load(reader.readString()) //当前任务进行的数据
    this_.time = reader.readUInt()
  }
}