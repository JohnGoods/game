import * as fs from 'fs';
import * as path from 'path';
export class WxgamePlugin implements plugins.Command {
    
    mbDat2Bin:boolean;
    constructor() {
        this.mbDat2Bin = false;
    }
    async onFile(file: plugins.File) {
        if(file.extname == ".dat"){
            this.mbDat2Bin = true
            file.path = file.path.replace(".dat", ".bin");
            return file;
        }
        
        if (file.extname == '.js') {
            const filename = file.origin;
            if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                return null;
            }
            if (filename == "libs/FileSaver/FileSaver.js" || filename == 'libs/FileSaver/FileSaver.min.js') {
                return null;
            }
            if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                let content = file.contents.toString();
                content += `;window.egret = egret;`;
                content = content.replace(/definition = __global/, "definition = window");
                file.contents = new Buffer(content);
            }
            else {
                let content = file.contents.toString();
                if (
                    filename == "libs/modules/res/res.js" ||
                    filename == 'libs/modules/res/res.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.js'
                ) {
                    content += ";window.RES = RES;"
                }
                if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                    content += ";window.eui = eui;window.EXML=EXML;"
                }
                if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                    content += ';window.dragonBones = dragonBones';
                }
                if (filename == 'libs/modules/engine2d/engine2d.js' || filename == 'libs/modules/engine2d/engine2d.min.js') {
                    content = "var eui = window.eui;var RES = window.RES;" + content;
                    content += ';window.core = core; window.map = map; window.gui = gui;';
                    content += ';window.TClass = TClass; window.TLog = TLog; window.ImportType = ImportType; window.CastType = CastType; window.JsUtil = JsUtil';
                    content += ';window.TXML = TXML;window.Application = Application; window.UserSetting = UserSetting;'

                    if(this.mbDat2Bin){
                        content = content.replace(/\"\.dat"/g, "\".bin\"");
                    }
                    
                }
                content = "var egret = window.egret;" + content;
                if (filename == 'main.js') {
                    let header = "var eui = window.eui;var RES = window.RES;"
                    header += "var core = window.core;var map = window.map;var gui = window.gui; var eui = window.eui;"
                    content =  header + content;
                    content += ";window.Main = Main;window.g_LaunchInit = g_LaunchInit; window.MessageLogic = MessageLogic"
                }
                file.contents = new Buffer(content);
            }
        }
        return file;
    }
    async onFinish(pluginContext: plugins.CommandContext) {
        //同步 index.html 配置到 game.js
        const gameJSPath = path.join(pluginContext.outputDir, "game.js");
        let gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
        const projectConfig = pluginContext.buildConfig.projectConfig;
        const optionStr =
            `entryClassName: ${projectConfig.entryClassName},\n\t\t` +
            `orientation: ${projectConfig.orientation},\n\t\t` +
            `frameRate: ${projectConfig.frameRate},\n\t\t` +
            `scaleMode: ${projectConfig.scaleMode},\n\t\t` +
            `contentWidth: ${projectConfig.contentWidth},\n\t\t` +
            `contentHeight: ${projectConfig.contentHeight},\n\t\t` +
            `showFPS: ${projectConfig.showFPS},\n\t\t` +
            `fpsStyles: ${projectConfig.fpsStyles},\n\t\t` +
            `showLog: ${projectConfig.showLog},\n\t\t` +
            `maxTouches: ${projectConfig.maxTouches},`;
        const reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        const replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        gameJSContent = gameJSContent.replace(reg, replaceStr);
        fs.writeFileSync(gameJSPath, gameJSContent);

        //修改横竖屏
        let orientation;
        if (projectConfig.orientation == '"landscape"') {
            orientation = "landscape";
        }
        else {
            orientation = "portrait";
        }
        const gameJSONPath = path.join(pluginContext.outputDir, "game.json");
        let gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
        gameJSONContent.deviceOrientation = orientation;
        fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
    }
}






//生成min之前：压缩js，删除不必要的代码
export class SimplifyJSPlugin implements plugins.Command {
    constructor() {
        
    }

    //匹配_a["title"]=null
    private pattern_keyValue(key:string, value:string):RegExp{
        var pattern = "[_\w]+\[\""+ key + "\"\]\s*=\s*" + value +",?"
        var reg = new RegExp(pattern, "g");
        return reg
    }



    private replaceWord(word_list, content:string):string{
        for(let v of word_list){
            let p = v.pattern
            if(p == null)
                p = v.src
            var reg = new RegExp(p, "g");
            content = content.replace(reg, v.dst)
        }
        return content
    }

    //ui
    private compressUICode(content:string):string{
        content = content.replace(this.pattern_keyValue("color", "null"), "");
        content = content.replace(this.pattern_keyValue("font", "null"), "");
        content = content.replace(this.pattern_keyValue("font", "\"\""), "");
        content = content.replace(this.pattern_keyValue("title", "null"), "");
        content = content.replace(this.pattern_keyValue("title", "\"\""), "");
        content = content.replace(this.pattern_keyValue("event_name", "null"), "");
        content = content.replace(this.pattern_keyValue("fun_index", "null"), "");
        content = content.replace(this.pattern_keyValue("image", "null"), "");
        content = content.replace(this.pattern_keyValue("image", "\"\""), "");

        return content
    }


    //只替换长词条
    private compressLongWordOnly(content:string):string{

        let word_list = [
            //全局变量
            {src:"Localize_cns",  dst:"$k", pattern:null},
            {src:"GameConfig",  dst:"$l", pattern:null},
            {src:"EventDefine",  dst:"$m", pattern:null},
            {src:"AddRdContent",  dst:"$n", pattern:null},
            {src:"ExecuteMainFrameFunction",  dst:"$o", pattern:null},
            {src:"GuideFuncCheckDefine",  dst:"$q", pattern:null},
            {src:"ActivitySystem",  dst:"$r", pattern:null},
            {src:"ItemSystem",  dst:"$s", pattern:null},
            {src:"RegisterEvent",  dst:"$t", pattern:null},
            {src:"taskFinishId",  dst:"$u", pattern:null},
            
            
            //局部变量
            {src:"mElemList",  dst:"$z1", pattern:null},
            {src:"mLayoutPaths",  dst:"$z2", pattern:null},
            {src:"mLayoutNode",  dst:"$z3", pattern:null},
            {src:"getItemWindow",  dst:"$z4", pattern:null},
            {src:"initItemWindow",  dst:"$z5", pattern:null},
            {src:"refreshItemWindow",  dst:"$z6", pattern:null},
            {src:"initSkinElemList",  dst:"$z7", pattern:null},

            
            
        ]

        return this.replaceWord(word_list, content)
    }

    //替换长词条，并且声明全局
    private compressLongWordGlobal(content:string):string{
        let word_list = [
            {src:"egret.TouchEvent.TOUCH_TAP",  dst:"$a", pattern:null}, 
            {src:"gui.Color.ublack",            dst:"$b" , pattern:null},
            {src:"gui.Color.white",             dst:"$c", pattern:null},
            {src:"\"ht_20_cc\"",             dst:"$f1", pattern:null},
            {src:"\"ht_20_cc_stroke\"",      dst:"$f2", pattern:null},
            {src:"\"ht_22_cc\"",             dst:"$f3", pattern:null},
            {src:"\"ht_22_cc_stroke\"",      dst:"$f4", pattern:null},
            {src:"\"ht_24_cc\"",             dst:"$f5", pattern:null},
            {src:"\"ht_24_cc_stroke\"",      dst:"$f6", pattern:null},
            
            {src:"eui.Label",  dst:"$eL", pattern:null},
            {src:"eui.Group",  dst:"$eG", pattern:null},
            {src:"eui.Image",  dst:"$eI", pattern:null},
            {src:"gui.Button",  dst:"$gB", pattern:null},
            {src:"gui.RichDisplayer",  dst:"$gR", pattern:null},
            {src:"gui.Grid9Image",  dst:"$gG", pattern:null},

        ]
        content = this.replaceWord(word_list, content)

        let header = ""
        for(let v of word_list){
            header += "window."+ v.dst + "=" + v.src + ";"
        }
        content = header + content;
        return content
    }

    //$p保留
    private compressOther(content:string):string{
        //prototype替换
        content = content.replace(/\.prototype/g, "[$p]")
        content = "window.$p=\"prototype\";" + content;

        //getInstance
        content = content.replace(/getInstance/g, "$gt")

        return content
    }

    //删除打印
    private compressLog(content:string):string{
        content = content.replace(/TLog.Debug\(.+?\r?\n/g, "\n")
        content = content.replace(/TLog.Warn\(.+?\r?\n/g, "\n")
        content = content.replace(/TLog.Error\(.+?\r?\n/g, "\n")
        return content
    }

    async onFile(file: plugins.File) {
        if (file.extname == '.js') {
            const filename = file.origin;
            let content = file.contents.toString();
            if (filename == 'main.js') {
                content = this.compressLog(content)
                content = this.compressUICode(content)
                content = this.compressLongWordOnly(content)
                content = this.compressLongWordGlobal(content)
                content = this.compressOther(content) 
            }
            
            //引擎替换getInstance
            if (filename == 'libs/modules/engine2d/engine2d.js' || filename == 'libs/modules/engine2d/engine2d.min.js') {
                 content = this.compressOther(content)
            }

            file.contents = new Buffer(content);
        }

        return file;
    }

    async onFinish(pluginContext: plugins.CommandContext) {

    }
}

