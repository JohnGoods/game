// TypeScript file

class RpcProxy {
    //布尔
    public static TYPE_BOOLEAN = "bool"
    //带符号的和不带符号的整型
    public static TYPE_UINT8 = "uint8"
    public static TYPE_UINT16 = "uint16"
    public static TYPE_UINT32 = "uint32"
    public static TYPE_INT8 = "int8"
    public static TYPE_INT16 = "int16"
    public static TYPE_INT32 = "int32"
    public static TYPE_INTBIG = "intbig"
    //浮点
    public static TYPE_FLOAT = "float"
    public static TYPE_DOUBLE = "double"
    //字符串
    public static TYPE_STRING = "string"
    public static TYPE_TABLE = "table"


    private static dataMethodMap: any = null;
    private static dataTypeMap: any = null;
    private static typeVaryMap: any = null;
    

    private static writeValueHanlder: any = {};
    private static readValueHanlder: any = {};

    private static isdump:boolean = false;

    private static bSendEnable:boolean = true;

    public static initProxy(jsonData: any) {
        this.dataMethodMap = jsonData["method"]
        this.dataTypeMap = jsonData["type"]
        this.typeVaryMap = jsonData["typeVary"] || {}

         //继承RPC类型
        let inheritInfo = jsonData["typeInherit"]
        if(inheritInfo ){
            
            
            for(let child in inheritInfo){
                let parent = inheritInfo[child]
            
                //可能A继承B，B继承C，找出继承顺序链
                let orderInheritList = []
                JsUtil.arrayInstert(orderInheritList, parent)
                while( inheritInfo[parent] ){
                    parent = inheritInfo[parent]
                    JsUtil.arrayInstert(orderInheritList, parent)
                }
                
                //向child插入parent的变量
                let childTypeList = this.dataTypeMap[child]
                for(let parent of orderInheritList){            
                    let parentTypeList = this.dataTypeMap[parent]
                    for(let _ = 0; _ < parentTypeList.length; _++){
                        let dataType = parentTypeList[_]
                        JsUtil.arrayInstert(childTypeList, dataType)
                    }
                }
                
            }
        }

        this.initWriteValueHandler()
        this.initReadValueHandler()

        this.isdump = GAME_DEBUG && IGlobal.config.getBoolean("dumpmsg", true);
    }

    private static initWriteValueHandler() {
        this.writeValueHanlder[RpcProxy.TYPE_BOOLEAN] = function (writer: BinaryStream, value: boolean) {
            writer.writeBoolean(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_UINT8] = function (writer: BinaryStream, value: number) {
            writer.writeUChar(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_UINT16] = function (writer: BinaryStream, value: number) {
            writer.writeUShort(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_UINT32] = function (writer: BinaryStream, value: number) {
            writer.writeUInt(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_INT8] = function (writer: BinaryStream, value: number) {
            writer.writeChar(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_INT16] = function (writer: BinaryStream, value: number) {
            writer.writeShort(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_INT32] = function (writer: BinaryStream, value: number) {
            writer.writeInt(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_INTBIG] = function (writer: BinaryStream, value: number){
                writer.writeString(tostring(value))
        }

        this.writeValueHanlder[RpcProxy.TYPE_FLOAT] = function (writer: BinaryStream, value: number) {
            writer.writeFloat(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_DOUBLE] = function (writer: BinaryStream, value: number) {
            writer.writeDouble(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_STRING] = function (writer: BinaryStream, value: string) {
            writer.writeString(value)
        }

        this.writeValueHanlder[RpcProxy.TYPE_TABLE] = function (writer: BinaryStream, value: any) {
            writer.writeString(table_save(value))
        }


    }

     private static initReadValueHandler(){
        this.readValueHanlder[RpcProxy.TYPE_BOOLEAN] = function(reader:BinaryStream){
            return reader.readBoolean()
        }

        this.readValueHanlder[RpcProxy.TYPE_UINT8] = function(reader:BinaryStream){
            return reader.readChar()
        }

        this.readValueHanlder[RpcProxy.TYPE_UINT16] = function(reader:BinaryStream){
            return reader.readUShort()
        }

        this.readValueHanlder[RpcProxy.TYPE_UINT32] = function(reader:BinaryStream){
            return reader.readUInt()
        }

        this.readValueHanlder[RpcProxy.TYPE_INT8] = function(reader:BinaryStream){
            return reader.readChar()
        }

        this.readValueHanlder[RpcProxy.TYPE_INT16] = function(reader:BinaryStream){
            return reader.readShort()
        }

        this.readValueHanlder[RpcProxy.TYPE_INT32] = function(reader:BinaryStream){
            return reader.readInt()
        }

        this.readValueHanlder[RpcProxy.TYPE_INTBIG] = function(reader:BinaryStream){
            return tonumber(reader.readString())
        }

        this.readValueHanlder[RpcProxy.TYPE_FLOAT] = function(reader:BinaryStream){
            return reader.readFloat()
        }

        this.readValueHanlder[RpcProxy.TYPE_DOUBLE] = function(reader:BinaryStream){
             return reader.readDouble()
        }

        this.readValueHanlder[RpcProxy.TYPE_STRING] = function(reader:BinaryStream){
             return reader.readString()
        }

        this.readValueHanlder[RpcProxy.TYPE_TABLE] = function (reader: BinaryStream) {
            let tableStr = reader.readString()
            return table_load(tableStr)
        }

    }


    public static setSendEnable(b:boolean){
        this.bSendEnable = b;
    }

    public static isSendEnable(){
        return this.bSendEnable;
    }


    public static call(method: string, ...args: any[]) {
        if(this.bSendEnable == false)
            return;
            
        let methodSign: string = this.dataMethodMap[method]
        TLog.Assert(methodSign != null, "RpcProxy.call %s not exsit", method)
        //console.log("call=======================>");
        let paramTypes: string[] = splitString(methodSign, ";")
        
        // if (paramTypes.length != args.length) {
        //     TLog.Error("RpcProxy.call params error: %s, %s", paramTypes.toString(), args.toString());
        //     return;
        // }
        //如果是debug，检查参数是否规范
        if(GAME_DEBUG){
             for (let i = 0; i < paramTypes.length; i++) {
                let type = paramTypes[i]
                 TLog.Assert(this.checkParamType(type, args[i]), "RpcProxy.call method:%s param%d:%s error", method, i+1, this.paramToString(args[i]))
            }
        }

        let dispatcher: GameNetDispatcher = GameNetDispatcher.getInstance()
        dispatcher.sendPacketCallback(this.packMessage, this, [method, paramTypes, args])
    }

    //返回序列化字节流
    public static callForStream( method: string, ...args: any[]) {
        let methodSign: string = this.dataMethodMap[method]
        TLog.Assert(methodSign != null, "RpcProxy.call %s not exsit", method)

        let paramTypes: string[] = splitString(methodSign, ";")
        // if (paramTypes.length != args.length) {
        //     TLog.Error("RpcProxy.call params error: %s, %s", paramTypes.toString(), args.toString());
        //     return;
        // }
        //如果是debug，检查参数是否规范
        if(GAME_DEBUG){
             for (let i = 0; i < paramTypes.length; i++) {
                let type = paramTypes[i]
                 TLog.Assert(this.checkParamType(type, args[i]), "RpcProxy.call method:%s param%d:%s error", method, i+1, this.paramToString(args[i]))
            }
        }


        let stream = new BinaryStream;
        this.packMessage(stream, [method, paramTypes, args])
        return stream;
    }


    public static unpackMessage(reader: BinaryStream) {
        let method: string = reader.readString()
        let methodSign: string = this.dataMethodMap[method]
        if(methodSign == null){
            TLog.Error("RpcProxy.unpackMessage %s not exsit", method)
            return
        }
        //TLog.Assert(methodSign != null, "RpcProxy.unpackMessage %s not exsit", method)

        let paramTypes: string[] = splitString(methodSign, ";")
        let retArgs = []
        this.readArgs(paramTypes, reader, retArgs)


         if(this.isdump){
            TLog.Debug("======dump Rpc recv:%s beign======", method)
            TLog.Debug(JsUtil.JsonEncode(retArgs));
            TLog.Debug("======dump Rpc recv:%s end======", method)
        }

        if(RpcLogic[method] == null){
            TLog.Error("unpackMessage method:%s not exsit", method)
            return
        }

        let hanlder = RpcLogic[method]
        hanlder.apply(this, retArgs)
    }

    public static unpackUpdateMessage(reader: BinaryStream) {
        let method: string = reader.readString()
        let methodSign: string = this.dataMethodMap[method]
        TLog.Assert(methodSign != null, "RpcProxy.unpackMessage %s not exsit", method)

        let dataTypeList:any[] = this.dataTypeMap[methodSign] //自定义类型
        
        //自定义类
        //let paramTypes = []
        //let nameParams = []
        let retArgs = []
        let gid = reader.readUInt()
        let count = reader.readUShort()
        for (let i = 0; i < count; i++) {
            let index = reader.readUShort() - 1//lua 
            let dataType: string = dataTypeList[index] //id:unit或者names:string[]
            let paramSign = dataType.split(":")
            TLog.Assert(paramSign.length == 2)
            let value = this.readSingleArg(paramSign[1], reader)
            retArgs[paramSign[0]] = value
            //nameParams.push(paramSign[0])
            //paramTypes.push(paramSign[1])  //参数类型
        }
        //this.readArgs(paramTypes, reader, retArgs)
        //let args = {}
        //for(let i = 0; i < nameParams.length; i ++){
        //    let name = nameParams[i]
        //    args[name] = retArgs[i]
        //}
        //let paramTypes: string[] = splitString(methodSign, ";")
        //let retArgs = []
        //this.readArgs(paramTypes, reader, retArgs)


         if(this.isdump){
            TLog.Debug("======dump RpcUpdate recv:%s beign======", method)
            TLog.Debug(JsUtil.JsonEncode(retArgs));
            TLog.Debug("======dump RpcUpdate recv:%s end======", method)
        }

        if(RpcLogic[method] == null){
            TLog.Error("unpackUpdateMessage method:%s not exsit", method)
            return
        }

        let hanlder = RpcLogic[method]
        hanlder.apply(this, [gid, retArgs])
    }

    private static packMessage(writer: BinaryStream, userData: any[]) {
        let method: string = userData[0]
        let paramTypes: string[] = userData[1]
        let args: any[] = userData[2]

        writer.writeUnsignedShort(opCodes.C2G_RPC_CALL);//rpc code
        writer.writeString(method)
        this.writeArgs(paramTypes, args, writer)

        if(this.isdump){
            TLog.Debug("======dump Rpc send:%s beign======", method)
            TLog.Debug(JsUtil.JsonEncode(args));
            TLog.Debug("======dump Rpc send:%s end======", method)
        }

    }


    //=====================================================================================
    //检查参数类型
    private static paramToString(param:any){
        if(typeof param == "object"){
            return JsUtil.JsonEncode(param)
        }
        return param + ""
    }

    private static checkParamType(type:string, value:any):boolean{
        if(value == null)
            return false;

        let pos = type.indexOf("[]")
        if (pos != -1) {
            type = type.substring(0, pos)
            let valArray:any[] = value
            TLog.Assert(Array.isArray(valArray))
            if(valArray.length > 0) //检查第一个参数的参数类型
                return this.checkParamType(type, valArray[0])
            else 
                return true;
        }

        let dataTypeList:any[] = this.dataTypeMap[type] //自定义类型
        if(dataTypeList != null){
           let bVaryType = this.typeVaryMap[type] != null
        
            for(let i = 0; i < dataTypeList.length; i++){
                let dataType: string = dataTypeList[i] //id:unit或者names:string[]
        
                let paramSign = splitString(dataType, ":")
                TLog.Assert(paramSign.length == 2)
                
                if(bVaryType ){
                    let argsVal = value[i] //索引取值
                    if(argsVal ){
                        if(this.checkParamType(paramSign[2], argsVal) == false ){
                            TLog.Error("===checkParamType error name:%s value:%s===", paramSign[1], tostring(argsVal))
                            return false;
                        }
                    }
                
                }else{
                    let argsVal = value[paramSign[0]] //变量取值
                    if(this.checkParamType(paramSign[1], argsVal) == false ){
                        TLog.Error("===checkParamType error name:%s value:%s===", paramSign[1], tostring(argsVal))
                        return false;
                    }
                    
                }
            }

        }else if(type == RpcProxy.TYPE_BOOLEAN){
            return typeof(value) == "boolean"
        }else if(type == RpcProxy.TYPE_STRING){
            return typeof(value) == "string"
        }

        return true
    }



    //=====================================================================================
    //写入消息
    private static writeSingleArg(type: string, value: any, writer: BinaryStream) {
        //原子类型
        let packFunc: Function = this.writeValueHanlder[type]
        if (packFunc) {
            packFunc.call(this, writer, value)
        } else {
           //自定义类
            let dataTypeList = this.dataTypeMap[type]
            TLog.Assert(dataTypeList != null, "RpcProxy:writeSingleArg type:%s ! exsit", type) //找不到类型，表示没有配置type字段，就报错吧
            
            
            if(this.typeVaryMap[type] == null ){
                    let args:any[] = []
                    let paramTypes:any[] = []
                    
                    for(let i = 0; i < dataTypeList.length; i++){
                        let dataType = dataTypeList[i] //id:unit或者names:string[]
                        let paramSign = splitString(dataType, ":")
                        TLog.Assert(paramSign.length == 2)
                        
                        JsUtil.arrayInstert(args, value[paramSign[0]])//参数值
                        JsUtil.arrayInstert(paramTypes,paramSign[1])//参数类型
                    }
                    this.writeArgs(paramTypes, args, writer)
                    
            }else{
                //不定参数类型，传入{key:value}
                let count = size_t(value)
                writer.writeUShort(count)
                
                for(let k in value){
                    let v = value[k]
            
                    let dataType = dataTypeList[k] //id:unit或者names:string[]
                    let paramSign = splitString(dataType, ":")
                    TLog.Assert(paramSign.length == 2)
                    
                    writer.writeUInt(tonumber(k) + 1) //索引(lua从1开始)
                    
                    let packFunc = this.writeValueHanlder[paramSign[1]]
                    TLog.Assert(packFunc != null)
                    packFunc.call(this, writer, v) //原子类型
                }
            }

        }

    }


    private static writeArgs(paramTypes: string[], args: any[], writer: BinaryStream) {
        for (let i = 0; i < paramTypes.length; i++) {
            let type = paramTypes[i]

            let pos = type.indexOf("[]")
            if (pos != -1) {
                type = type.substring(0, pos)

                let valArray = args[i]
                TLog.Assert(Array.isArray(valArray))

                //写入数组
                writer.writeUShort(valArray.length)
                for (let j = 0; j < valArray.length; j++) {
                    this.writeSingleArg(type, valArray[j], writer)
                }
            } else {
                this.writeSingleArg(type, args[i], writer)
            }
        }

    }

    //=====================================================================================
    //读取消息
    private static readSingleArg(type:string, reader:BinaryStream):any{
         //原子类型
        let readFunc: Function = this.readValueHanlder[type]
        if (readFunc) {
            return readFunc.call(this, reader)
        } else {
           //自定义类
            let dataTypeList = this.dataTypeMap[type]
            TLog.Assert(dataTypeList != null, "RpcProxy:readSingleArg type:%s ! exsit", type) //找不到类型，表示没有配置type字段，就报错吧
            
            let retClass:any = {}
            
            if(this.typeVaryMap[type] == null ){
                let paramTypes = []
                let nameParams = []
                let retArgs = []
            
                for(let i = 0; i < dataTypeList.length; i++){
                	let dataType: string = dataTypeList[i] //id:unit或者names:string[]
        
                    let paramSign = splitString(dataType, ":")
                    TLog.Assert(paramSign.length == 2)
                    
                    JsUtil.arrayInstert(nameParams,paramSign[0])//参数值
                    JsUtil.arrayInstert(paramTypes,paramSign[1])//参数类型
                    
                }
                this.readArgs(paramTypes, reader, retArgs)
                
                
	            for(let i = 0; i < nameParams.length; i ++){
	                let name = nameParams[i]
	                retClass[name] = retArgs[i]
	            }
            }else{
                    let count = reader.readUShort();
                    
                    for(let i = 0; i <  count;i++){
                        let k = reader.readUInt()
                        TLog.Assert(k <= dataTypeList.length)
                        let dataType = dataTypeList[k - 1]
                        let paramSign = splitString(dataType, ":")
                        TLog.Assert(paramSign.length == 2)
                        
                        let readFunc = this.readValueHanlder[ paramSign[1] ]
                        retClass[paramSign[0]] = readFunc.call(this, reader)
                    }
                
            }
            return retClass
        }
    }

    private static readArgs(paramTypes: string[], reader: BinaryStream, retArgs: any[]) {
        for (let i = 0; i < paramTypes.length; i++) {
            let type = paramTypes[i]

            let pos = type.indexOf("[]")
            if (pos != -1) {
                type = type.substring(0, pos)

                let arrLen = reader.readUShort();
                let arr = []
                if (arrLen > 0) {
                    for (let j = 0; j < arrLen; j++) {
                        let ret = this.readSingleArg(type, reader)
                        arr.push(ret)
                    }
                }
                retArgs.push(arr)

            } else {
                retArgs.push(this.readSingleArg(type, reader))
            }
        }
    }

    public static getDataTypeMap() {
        return RpcProxy.dataTypeMap
    }
   


}