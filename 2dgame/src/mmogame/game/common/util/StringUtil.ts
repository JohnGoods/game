class StringUtil {
	

	public static splitString(str:string, sep:string){
		return str.split(sep);
	}

	static isEmpty(str:string):boolean{
		return str.trim() == "";
	}


    static isAlphaNumber(str:string):boolean{
        let result = this.stringMatch(str, /\w+/)
        if(result == null)
            return false;
        return result[0] == str
    }

    static isNumber(str:string):boolean{
        let result = this.stringMatch(str, /\d+/)
        if(result == null)
            return false;
        return result[0] == str
	}


    static lower(str:string):string{
        return str.toLowerCase();
    }

	 //指定开始位置，使用正则表达式搜索
    public static stringSeach(str:string, pattern:string, pos?:number):number{
        if(!pos){
            pos = 0;
        }

        var reg = new RegExp(pattern, "g");
        reg.lastIndex = pos;
        var result = reg.exec(str);
        if(result){
            return result.index;
        }
        // var str="target12"
        // str.match(/target(\d+\)/)
        return -1;
    }

    public static stringMatch(str:string, pattern:RegExp):string[]{
         //该数组的第 0 个元素存放的是匹配文本，而其余的元素存放的是与正则表达式的子表达式匹配的文本。返回的数组还含有两个对象属性:
         //index 属性声明的是匹配文本的起始字符在 stringObject 中的位置
         //input 属性声明的是对 stringObject 的引用
         var result = str.match(pattern);
         if(result){
             if(result.length == 1){
                 return result;
             }
             result.splice(0, 1); //第一个匹配文本不用保存
             return result;
         }

         return null;
    }

    public static stringReplace(str:string, pattern:string, replaceVal:string):string{
           var reg = new RegExp(pattern, "g");
           return str.replace(reg, replaceVal)
    }


    public static stringReplaceWithReg(str:string, reg:RegExp, replace:(word:string)=>string | string):string{
           //var reg = new RegExp(pattern, "g");
           return str.replace(reg, replace)
    }


    public static isEmptyContent(str:string){
        return str.match(/^\s*$/) != null;
    }



    //bit是1开始
    public static getBit(num:string, _bit:number):string{
        let bit = _bit - 1;

        let n = num.charAt(bit);
        if(n == ""){
            return "0"
        }
        return n;
    }

    //字符串式整型，逻辑上位数自左至右递增，例如整型1010，的字符串式为"0101"  bit是1开始
    public static changeBit( num:string, _bit:number, cs:string):string{			//num字符串，bit第几位
        let reNum = ""
        let bit = _bit - 1;

        let n = num.charAt(bit)
        
        if(n == "" || n == null ){
            for(let i = 0; i <=  bit;i++){
                let n = num.charAt(i)
                if(n == "" || n == null ){
                    n = "0"
                }
                
                if(bit == i ){
                    n = cs
                }
                
                reNum = reNum +n
            }
        }else{
            for(let i = 0; i < num.length;i++){
                let n = num.charAt(i)
                if(i == bit ){
                    n = cs
                }
                reNum = reNum +n
            }
        }
        //TLog.Debug("2222222222222222", reNum)
        return reNum
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    
    //将时间字符串转成秒数,格式：xxxx-xx-xx xx:xx:xx
    public static getTimeFromString(str:string) :any{
        if(str == null || str == ""){
            return null;
        }
        let ret = this.stringMatch(str, /(\d+)-(\d+)-(\d+) ?(\d*):?(\d*):?(\d*)/);
        
		let year		= tonumber(ret[0]) || 0
		let month	    = tonumber(ret[1]) || 0
		let day		= tonumber(ret[2]) || 0

		let hour		= tonumber(ret[3]) || 0
		let min		= tonumber(ret[4]) || 0
		let sec		= tonumber(ret[5]) || 0


        let d = new Date();
        d.setFullYear(year, month - 1, day);
        d.setHours(hour, min, sec, 0);      

        return d.getTime() / 1000;
    }
}