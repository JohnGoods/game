// TypeScript file


class WordFilter {
    private static mFilterList = null;
    private static mForbidNameList = null;

    static initFilterList(list: string[]) {
        this.mFilterList = list;
    }

    static initForbidName(list: string[]) {
        if (list == null)
            list = [];

        list.push(",")
        list.push("#")
        list.push(";")
        list.push("'")
        list.push("\"")
        this.mForbidNameList = list;
    }

    //表情是非法字符
    static isEmojiCharacter(substring) {
        for ( var i = 0; i < substring.length; i++) {  
            var hs = substring.charCodeAt(i);  
            if (0xd800 <= hs && hs <= 0xdbff) {  
                if (substring.length > 1) {  
                    var ls = substring.charCodeAt(i + 1);  
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                    if (0x1d000 <= uc && uc <= 0x1f77f) {  
                        return true;  
                    }  
                }  
            } else if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                if (ls == 0x20e3) {  
                    return true;  
                }  
            } else {  
                if (0x2100 <= hs && hs <= 0x27ff) {  
                    return true;  
                } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                    return true;  
                } else if (0x2934 <= hs && hs <= 0x2935) {  
                    return true;  
                } else if (0x3297 <= hs && hs <= 0x3299) {  
                    return true;  
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                        || hs == 0x2b50) {  
                    return true;  
                }  
            }  
        }  
    }  

    static checkword(str: string): boolean {

        if(str.toLowerCase().indexOf("null") != -1){
            return false;
        }

        if(this.isEmojiCharacter(str)){
            return false;
        }

        if (this.mForbidNameList == null)
            return true;

        for (let word of this.mForbidNameList) {
            if (str.indexOf(word) != -1)
                return false;
        }

        for (let word of this.mFilterList) {
            if (str.indexOf(word) != -1)
                return false;
        }

        return true;
    }

    static filtWord(str: string): string {
        if (this.mFilterList == null)
            return str;
        //获取文本输入框中的内容  

        //遍历敏感词数组  
        for (var i = 0; i < this.mFilterList.length; i++) {
            let word = this.mFilterList[i];
            //全局替换  

            //判断内容中是否包括敏感词  
            if (str.indexOf(word) != -1) {
                var reg = new RegExp(word, "g");
                var result = str.replace(reg, "*");
                str = result;
            }
        }

        return str;
    }
}