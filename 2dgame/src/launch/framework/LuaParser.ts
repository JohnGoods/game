// TypeScript file


class LuaParser {

    private static lastObjectPos: number = -1;
    // public static decodeObj(str:string, strPos?:number) : any{
    // }

    private static transformWord(str: string) {
        if ("true" == str) {
            return true
        } else if ("false" == str) {
            return false;
        } else if ("nil" == str) {
            return null;
        }

        TLog.Throw("LuaParser.transformWord %s", str);
    }

    private static decodeObj(str: string, strPos: number, obj: any): void {

        let key: string = null;
        let index = 0;
        let isBeginKey = false;
        let checkAssign = false;//检查赋值"="


        for (let pos = strPos; pos < str.length;) {
            let s = str.charAt(pos);
            let code = str.charCodeAt(pos);

            if (s == " " || s == ",") {
                pos++;
                continue;
            }

            if (checkAssign) {
                checkAssign = false;
                TLog.Assert(s == "=", "LuaParser.decodeObj:%s can not =", str);
                pos++;
                continue;
            }

            if (s == "[") {//["level"]=10, [1] = 10
                isBeginKey = true;

            } else if (s == "]") {
                isBeginKey = false;
                checkAssign = true;
            } else if (code >= 48 && code <= 57 || code == 45) {//数字KEY或者value    0-9 .(浮点:46) -(负号:code)
                let b = pos;
                let numStr = s;

                while (true) {
                    b = b + 1;
                    let nextCode = str.charCodeAt(b);
                    if (!(nextCode >= 48 && nextCode <= 57 || nextCode == 46))
                        break;
                    let nextS = str.charAt(b);
                    numStr = numStr + nextS;
                }

                if (isBeginKey) {
                    key = numStr;
                } else {
                    let v = JsUtil.parseFloat(numStr);
                    TLog.Assert(JsUtil.isNaN(v) == false, "LuaParser.decodeObj%s number error", str);

                    if (key) {
                        obj[key] = v;
                        key = null;
                    } else {
                        obj[index] = v;
                        index++;
                    }
                }

                pos = b;
                continue;

            } else if (s == "\"" || s == "\'") {//字符串KEY或者value
                let b = StringUtil.stringSeach(str, s, pos + 1);
                TLog.Assert(b != -1, "LuaParser.decodeObj%s can not find \" ", str);

                let v = str.substring(pos + 1, b);
                //找到另外一个字符串
                if (isBeginKey) {
                    key = v
                } else {
                    if (key) {
                        obj[key] = v;
                        key = null;
                    } else {
                        obj[index] = v;
                        index++;
                    }
                }
                pos = b + 1;
                continue;

            } else if (s == "{") { //新的对象开始
                let v = this.parse(str, pos);
                if (key) {
                    obj[key] = v;
                    key = null;
                } else {
                    obj[index] = v;
                    index++;
                }
                pos = this.lastObjectPos + 1;
                continue;
            } else if (s == "}") {//对象结束
                this.lastObjectPos = pos;
                break;

            } else {

                //指定的几种关键词才能作为value
                let resultWord = null;
                let checkWordList = ["false", "true", "nil"];

                //检查是否作为key
                if (key == null) {
                    let resultPos = StringUtil.stringSeach(str, "\s*=", pos);//查找key

                    if (resultPos != -1) {
                        let resultStr = str.substring(pos, resultPos);
                        if (JsUtil.arrayExsit(checkWordList, resultStr)) {
                            resultWord = resultStr;

                        } else {//level=10
                            key = resultStr;
                            checkAssign = true; //检查等号
                            pos = resultPos;
                            continue;
                        }
                    }

                }

                //检查是否作为value,必须是指定关键字
                if (resultWord == null) {
                    for (let i = 0; i < checkWordList.length; i++) {
                        let word = checkWordList[i];
                        let resultPos = StringUtil.stringSeach(str, word, pos);
                        if (resultPos == pos) {
                            resultWord = word;
                            break;
                        }
                    }
                }


                if (resultWord) {
                    //TLog.Assert(key != null, "LuaParser.decodeObj%s key error ", str)
                    let v = this.transformWord(resultWord);
                    if (key) {
                        obj[key] = v;
                        key = null;
                    } else {
                        obj[index] = v;
                        index++;
                    }
                    pos = pos + resultWord.length; //新的位置查找
                    continue;
                }

                //格式错误了
                TLog.Throw("LuaParser.decodeObj%s error ", str)
            }

            pos++;
        }



    }

    public static parse(str: string, strPos?: number): any {
        if (str == "")
            return null;

        if (strPos == null)
            strPos = 0;

        let obj = {};
        for (let pos = strPos; pos < str.length;) {
            let s = str.charAt(pos);
            let code = str.charCodeAt(pos);

            if (s == " ") {
                pos++;
                continue;
            }

            if (s == "{") {
                this.decodeObj(str, pos + 1, obj);

                //如果有0索引，将数组转成Array
                if (obj[0]) {
                    let isArray = true;
                    let keylist = Object.keys(obj);
                    for (let i = 0; i < keylist.length; i++) {
                        let v = keylist[i];
                        if (isNaN(tonumber(v))) {
                            isArray = false;
                            break;
                        }
                    }

                    if (isArray) {
                        let sortkeylist = keylist.sort((a, b) => {
                            var aVal = Number(a);
                            var bVal = Number(b);
                            //TLog.Assert(!isNaN(aVal) && !isNaN(bVal) && aVal >= 0 && bVal >= 0)
                            return aVal - bVal;
                        });
                        
                        if (sortkeylist.length > 0) {
                            let listObj = []
                            for (let i = 0; i < sortkeylist.length; i++) {
                                let key = sortkeylist[i]
                                listObj[i] = obj[key];
                            }
                            obj = listObj;
                        }
                    }



                }
                //TLog.Assert(lastObjectPos != -1, "LuaParser.decode%s error ", str)
                break
            } else {
                TLog.Throw("LuaParser.parse %s", str);
            }
        }
        return obj;

    }
}