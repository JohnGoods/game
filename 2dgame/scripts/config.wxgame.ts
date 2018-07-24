/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin, ResSplitPlugin } from 'built-in';
import { WxgamePlugin, SimplifyJSPlugin } from './wxgame/wxgame';
import { MergeJsPlugin, ExmlAfterPlugin, ExcludeResPlugin} from './myplugin';
import * as defaultConfig from './config';

const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `wxproject/game`;
        if (command == 'build') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    //new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new ManifestPlugin({ output: 'manifest.js' })
                ]
            }
        }
        else if (command == 'publish') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["../remote"] }),//相对于outPutDir
                    new CleanPlugin({ matchers: ["js"] }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin('commonjs2'), // 非 EUI 项目关闭此设置
                    new ExmlAfterPlugin(),
                    new ExcludeResPlugin(["resource/launch.json","resource/sdkconfig.json"] ),

                    new SimplifyJSPlugin(),
                    new WxgamePlugin(),
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    },{
                        sources: ["resource/ui/ui_theme.thm.js"],
                        target: "ui_theme.thm.min.js"
                    }]),
                    //new MergeJsPlugin(),
                    new ManifestPlugin({ output: 'manifest.js' }),
                    new ResSplitPlugin({
                        matchers:[
                            {from:"resource/**", to: "wxproject/remote"}//相对于projectDir
                        ]
                    })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
