// TypeScript file



class XmlConverter{
    static s_init:boolean = false;
    static XmlKeyWord = {};
    static XmlKeyWordLenList:number[] = []

    //static LinkSign = String.fromCharCode(3);
    static LinkSign = String.fromCharCode(8);
    static KeyWordSign = "#";

    static replaceArr:any[] = [];


    static FIELD_CHANNEL_KEYWORD = 
    {
        ["STYLE"] : 1,//样式
        ["IMAGE"] : 2,//样式
        ["FACE"] : 3,//表情
        
        ["SAVE_FONT"] : 6,//保存字体和颜色
        ["RESTORE_FONT"] : 7,//回复字体和颜色   
        ["BR"] : 8,//换行
        ["SPACE"] : 9,//空格
    }

    private static _init(){
        JsUtil.objectForEach(GameConfig.xmlKeyWordConfig, (v,k)=>{
            this.XmlKeyWord[v.key] = v.value;
        });

        let key_len:number[] = [];
        for(let k in this.XmlKeyWord ){
            let len = k.length;

            let badd = true;
            for(let i = 0; i < key_len.length; i++){
                if(len == key_len[i]){
                    badd = false;
                    break;
                }
            }

            if(badd){
                key_len.push(len);
            }
        }

        key_len.sort((a,b)=>{
            return b - a; //大到小排序
        });

        this.XmlKeyWordLenList = key_len;

        this.replaceArr = [];
        this.replaceArr.push([/</g, "&lt;"]);
        this.replaceArr.push([/>/g, "&gt;"]);
        this.replaceArr.push([/&/g, "&amp;"]);
        this.replaceArr.push([/\"/g, "&quot;"]);
        this.replaceArr.push([/\'/g, "&apos;"]);
    }


    private static add_content(content:string, rd:any):string{
        let str = null
        if(rd._linkcontent){
            str = String.format("<text name=\"%s\" color=\"%s\" link=\"%s\">%s</text>", rd.defalut_font, rd.default_color, rd._linkcontent, content)
            rd._linkcontent = null
        }else{
            str = String.format("<text name=\"%s\" color=\"%s\">%s</text>", rd.defalut_font, rd.default_color,  content)
        }
        return str
    }

    private static add_breakline(rd:any){
        return "<br/>"
    }

    private static add_keyword(content:string, rd:any):string{
        let keyInfo = this.XmlKeyWord[content]//得到内容      

        if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.STYLE){ //字体样式
            if(!rd.no_change_font){ //需要改变字体，设置了就不会改变
                if(keyInfo.font){ rd.defalut_font = keyInfo.font	}  //默认字体
            }
            if(!rd.no_change_color){
                if(keyInfo.color){	rd.default_color = keyInfo.color } //默认颜色
            }
            return null
            
        }else if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.IMAGE){ //图片
            let img_txt = String.format("<image name=\"%s\"/>", keyInfo.name);
            return img_txt

        }else if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.FACE){ //动画样式
            //let anim_txt = "<anim name=" .. keyInfo.anim_name .. " %s>#"..content.."</anim>"
            let anim_txt = String.format("<anim name=\"%s\">%s</anim>", keyInfo.anim_name, content);;
            return anim_txt

        }else if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.SAVE_FONT){ //保存字体
            rd._save_color = rd.default_color
            rd._save_font = rd.defalut_font
            return null
            
        }else if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.RESTORE_FONT){ //回复字体
            rd.default_color = rd._save_color
            rd.defalut_font = rd._save_font
            return null
            
        }else if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.BR){ //换行
            let br_txt = "<br />"
            return br_txt
            
        }else if(keyInfo.type == this.FIELD_CHANNEL_KEYWORD.SPACE){ //空格
            if(keyInfo.style == null){
                return String.format("<hor_blank value=\"%d\" />", keyInfo.hor_blank)
            } 
        }

        return this.add_content("#"+content, rd)//没有找到响应内容，则当普通文本
    }

    private static add_link(content:string, rd:any):string{
        if(!rd.link_parser){
            return null
        }
        
        let info = rd.link_parser(content, rd.showColor)
        
        if(!info || !info.link || !info.name){
            return null
        }
        let link = info.link
        let name = info.name 
        let color = info.color || rd.default_color
        
        rd.link_name = name
        
        return String.format("<text name=\"%s\" color=\"%s\" link=\"%s\" >[%s]</text>",rd.defalut_font,  color, link,  name)
    }

    private static filter_xml_content(content:string):string{
        for (let i = 0; i < this.replaceArr.length; i++) {
            let k = this.replaceArr[i][0];
            let v = this.replaceArr[i][1];
            content = content.replace(k, v);
        }
        return content;
    }


    public static parseText(content:string, rd?:any):string{
        if(this.s_init == false){
            this.s_init = true;
            this._init()
        }

        rd = rd || {}
        let xml = ""
        let planetxt = ""

        try{
            content = this.filter_xml_content(content);

            rd.default_color 	= rd.default_color || "ublack"
            rd.defalut_font 	= rd.defalut_font || "ht_20_lc"
            rd._save_color 		= rd.default_color
            rd._save_font 		= rd.defalut_font
            rd.no_change_font = (rd.no_change_font == true)  
            rd.no_planetex	 	= (rd.no_planetex == true)
            rd.no_break_line 	= (rd.no_break_line == true)
            rd.getplanetxt		= rd.getplanetxt || false
            rd.no_change_color  = (rd.no_change_color == true)  

            let findbegin = 0
            let wordbegin = 0

            

            let pattern = String.format("[%s%s\r\n]", this.KeyWordSign, this.LinkSign);

            while(true){
                let b = StringUtil.stringSeach(content, pattern, findbegin);
                if(b == -1){
                    let word = content.substring(wordbegin);
                    if(word != ""){
                        xml = xml + this.add_content(word, rd)
                        planetxt = planetxt + word
                    }
                    if(!rd.no_break_line){
                        xml = xml + this.add_breakline(rd)
                        planetxt = planetxt + "\n"
                    }
                    break
                }

                let sign = content.charAt(b);
                if(sign == "\n" || sign == '\r'){ //回车

                    let word = content.substring(wordbegin, b);
                    if(word != ""){
                        xml = xml + this.add_content(word, rd)
                        planetxt = planetxt + word
                    }

                    if((xml != "" || b == 0) && b != content.length - 1 ){
                        xml = xml + this.add_breakline(rd)
                        planetxt = planetxt + "\n"
                    }

                    if(sign == "\r"){
                        let newline = content.charAt(b+1);
                        if(newline == "\n"){
                            b = b + 1
                        }
                    }
                    
                    wordbegin = b + 1
                    findbegin = wordbegin
                }else if(sign == this.KeyWordSign){
                    let key_len = -1   //关键字长度
                    let keyword = null	//井号后的关键字
                    let keyInfo = null	//关键字信息

                    for(let i = 0; i < this.XmlKeyWordLenList.length; i++){
                        let len = this.XmlKeyWordLenList[i];
                        keyword = content.substring(b+1, b+len+1);
                        keyInfo = this.XmlKeyWord[keyword]
                        if(keyInfo != null){
                            key_len = len
                            keyword = keyword
                            break
                        }
                    }

                    if(key_len > 0){
                        let word = content.substring(wordbegin, b); 
                        if(word != ""){
                            xml = xml + this.add_content(word, rd)
                            planetxt = planetxt + word
                        }

                        //类型是STYLE而且关键字紧接符号“|”。如:#nor|'10007;1;云中子'|带有超链接的
                        let ret = this.add_keyword(keyword, rd)
                        if(ret){
                            xml = xml + ret 
                        }

                        let link_sign = "|"
                        let lsign = content.charAt(b+key_len+1);
                        if(link_sign == lsign){
                            let tb = StringUtil.stringSeach(content, "["+link_sign+"]", b + key_len + 2);//一定要是一对的
                            if(tb == -1){//找不到|就当文本
                                wordbegin = b + key_len + 1
                            }else{
                                let linkcontent = content.substring(b + key_len + 2, tb );
                                if(linkcontent != ""){
                                    rd._linkcontent = linkcontent; //记录超链接信息
                                }
                                wordbegin = tb + 1; //另一端的'|'开始算
                            }

                            findbegin = wordbegin
                        }else{//找不到超链接
                            wordbegin = b + key_len + 1
                            findbegin = wordbegin
                        }

                    }else{
                        //找不到关键字
                        findbegin = findbegin + 1
                    }
                }else if(this.LinkSign == sign){//找到匹配的另一个控制字符，一定是一对的
                    let word = content.substring(wordbegin, b); 
                    if(word != ""){
                        xml = xml + this.add_content(word, rd)
                        planetxt = planetxt + word
                    }

                    let ob = StringUtil.stringSeach(content, "["+this.LinkSign+"]", b + 1);//一定要是一对的
                    if(ob == -1){
                        ob = b;
                    }else{
                        let word = content.substring(b+1, ob); 
                        let link = this.add_link(word, rd)
                        if(link){
                            xml = xml + link
                            if(rd.link_name){
                                planetxt = planetxt + String.format("[%s]",rd.link_name)
                                rd.link_name = null
                            }
                        }
                    }

                    wordbegin =ob + 1
                    findbegin = wordbegin

                }else{
                    findbegin = findbegin + 1
                } 
            }

        }catch(e){
            TLog.Error("XmlConverter.parseText: Error:%s", content)
        }

        

        if(rd.getplanetxt){
            return planetxt
        }else{
            return xml
        }
    }


    public static getLinkXml(link:string, content:string, color?:string, font?:string):string{
        color = color || "white"
        font = font || "ht_20_lc"
        link = this.LinkSign+ link + this.LinkSign
        return String.format("<text name=\"%s\" color=\"%s\" link=\"%s\" >[%s]</text>",font, color, link, content )
    }


    public static convertDynamicWord(text:string){
        let pos = text.indexOf("##")
        if(pos < 0){
            return text;
        }

        let strList = text.split("##");
        if (strList.length <= 2) {
            return text;
        }

        let length = strList.length;

        //双数的最后一条，拼接##
        if (length % 2 == 0) {
            let str = strList[length - 1]
            strList[length - 1] = "##" + str;
        }

        for (let i = 0; i < length; i++) {
            let str = strList[i]
            if (i % 2 == 1 && i != length - 1) {
                if (str != "") {
                    // let event = new GUITranslateWordEvent(RichDisplayer.RichDisplayerTranslateEvent, this);
                    // event.setTranslateWord(str);
                    // this.dispatchEvent(event);
                    // let transStr = event.getTranslateWord();
                    let transStr = TaskExecutor.getInstance().executeGetReplaceWord(str, 0)
                    if (transStr == "") {
                        //strList[i] = transStr;
                        return text;
                    } else {
                        strList[i] = transStr;
                    }
                }
            }
        }


        return strList.join("");
    }

}