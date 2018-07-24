//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite {

    static loadingView:LoadingUI;

    public constructor() {
        super();
        this.createView();
    }

    textField:egret.TextField;

    private createView():void {

        let stageWidth = IGlobal.stageWidth;
        let stageHeight = IGlobal.stageHeight;


        var sky:eui.Image = new eui.Image;
        sky.source = "ui/image/dengLu/dl_dengLuDi01.jpg"
        sky.x = (stageWidth -  800)/2;
        // sky.width = IGlobal.stageWidth;
        // sky.height = IGlobal.stageHeight;
        this.addChild(sky);

        this.textField = new egret.TextField();
        this.addChild(this.textField);

        this.textField.width = 480;
        this.textField.height = 100;

        this.textField.x = (stageWidth -  this.textField.width)/2;
        this.textField.y = (stageHeight - this.textField.height - 50);
        
        this.textField.textAlign = "center";
        this.textField.fontFamily = IGlobal.guiManager.getDefaultFontName();
        this.textField.size = 24;
        this.textField.stroke = 1;
        this.textField.textColor = gui.Color.lime;

       
    }

    public static setProgress(current:number, total:number):void {
        if(this.loadingView == null || total == 0){
            return;
        }
        this.loadingView.textField.text = String.format("正在加载资源，请耐心等候...(%d%%)", Math.floor( current/ total * 100) );
    }


    public static show(){
        if(this.loadingView == null){
            this.loadingView = new LoadingUI();
		    IGlobal.stage.addChild(this.loadingView);
        }        
    }

    public static hide(){
        if(this.loadingView != null){
            IGlobal.stage.removeChild(this.loadingView);
		    this.loadingView = null;   
        }
    }
}
