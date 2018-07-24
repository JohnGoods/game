import * as fs from 'fs';
import * as path from 'path';

export class MergeJsPlugin implements plugins.Command {
    
    //mergeList: { filename: string, contents: string }[] = [];
    mergeCodeList:string[] = []
    constructor() {
       
    }

    // onStart(commandContext: plugins.CommandContext) {
    //      let list = file.search(commandContext.projectRoot, "js")
    //      console.log("MergeJsPlugin.onStart", commandContext.projectRoot)
    //      console.log(list)
    // }

    async onFile(file: plugins.File) {
       

        const filename = file.origin;
        if (file.extname == ".js" 
            && filename.indexOf('main.js') == -1 && filename.indexOf('main.min.js') == -1 
            && filename.indexOf('thm.js') == -1 && filename.indexOf('thm.min.js') == -1) {
            const contents = file.contents.toString()
            //this.mergeList.push({ filename, contents })
            this.mergeCodeList.push(contents)
            //console.log("MergeJsPlugin.onFile", file.path)
            return null;
        }
           
        // console.log("file.base", file.base)
        // console.log("file.relative", file.relative)
        // console.log("file.dirname", file.dirname)
        // console.log("file.basename", file.basename)
        // console.log("file.extname", file.extname)
        // console.log("file.origin", file.origin)
       
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        if (this.mergeCodeList.length == 0) {
            return;
        }

        let jsCode = this.mergeCodeList.join("\n")
        
        let outPath = path.join("libs", "mergeJs.js")
        commandContext.createFile(outPath, new Buffer(jsCode))
        console.log("============MergeJsPlugin.onFinish count:", this.mergeCodeList.length)
        //  console.log("MergeJsPlugin.onFinish")
        //  console.log("commandContext.projectRoot", commandContext.projectRoot)
        //  console.log("commandContext.outputDir", commandContext.outputDir)
    }
}

export class ExcludeResPlugin implements plugins.Command {  
    excludeFileList:string[];  
    constructor(fileList) {
      this.excludeFileList = fileList
    }

    async onFile(file: plugins.File) {
       for(let path of this.excludeFileList){
          if(file.origin.indexOf(path) != -1)
            return null;
       }
       return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
    }
}


//处理完exml后的自定义处理
export class ExmlAfterPlugin implements plugins.Command {    
    themeFileList:{path:string, content:string}[];
    constructor() {
       this.themeFileList = []
    }

    async onFile(file: plugins.File) {
       if (file.extname == ".exml" ){
           return null
       }

       //theme.json文件，exmls不需要生成列表
       if(file.origin.indexOf(".thm.json") != -1){
           let content = file.contents.toString();
           this.themeFileList.push({path:file.origin, content:content})
       }
       return file
    }

    async onFinish(commandContext: plugins.CommandContext) {
       for(let v of this.themeFileList){
            let theme = JSON.parse(v.content)
           theme.exmls = []
           if(theme.path){
               delete theme.path
           }
           let content = JSON.stringify(theme, null, '\t')
           commandContext.createFile(commandContext.projectRoot + v.path, new Buffer(content));
       }
    }
}
