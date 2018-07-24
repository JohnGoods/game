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
//闪屏图片
class SplashSreenUI extends eui.UILayer {

    static view:SplashSreenUI;

    splashImg:string;

    public constructor( ) {
        super();
        this.createView();
    }

    textField:egret.TextField;

    private createView():void {
        // var rect = new eui.Rect;
		// rect.percentWidth = 100
		// rect.percentHeight = 100;
		// rect.fillColor = color;

        var sky:eui.Image = new eui.Image;
        sky.source = g_SplashImage;
        sky.horizontalCenter = 0;
        sky.verticalCenter = 0;
        this.addChild(sky)

        if(typeof g_SplashLogo != "undefined"){

            var logo:eui.Image = new eui.Image;
            logo.source = g_SplashLogo;
            logo.horizontalCenter = 0;
            logo.bottom = 85;
            this.addChild(logo)
        }

       
    }


    public static show(){
        if(this.view == null){
            this.view = new SplashSreenUI();
		    IGlobal.stage.addChild(this.view);
        }        
    }

    public static hide(){
        if(this.view != null){
            IGlobal.stage.removeChild(this.view);
		    this.view = null;   
        }
    }
}
