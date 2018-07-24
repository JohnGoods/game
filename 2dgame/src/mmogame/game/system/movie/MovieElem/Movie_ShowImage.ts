/* 
作者: 
lintianfeng

创建时间： 
2014.2.18(周二) 

意图： 
	显示图片

公共接口： 

*/
/*
class Movie_ShowImage extends Movie_Elem {
    max_time
    time
    imageName
    clear
    isBG
    ImgMoveType
    ImgMoveTime
    ImgEffectID
    public initObj(...args: any[]): void {
        this.max_time = args[0].time || 3000
        this.time = 0
        this.imageName = args[0].image
        this.clear = args[0].clear || false
        this.isBG = args[0].bOnce || false
        this.ImgMoveType = args[0].ImgMoveType || null
        this.ImgMoveTime = args[0].ImgMoveTime || 1000
        this.ImgEffectID = args[0].ImgEffectID || null

        //modify:yangguiming暂时不支持场景图
        this.isBG = false

    }

    onBegin() {

        //TLog.Debug("Movie_ShowImage onBegin ",this.isBG)
        if (this.isBG == true) {
            SceneManager.getInstance().setBgImage(null)
            SceneManager.getInstance().setBgImage("data/ui/image/movie/" + this.imageName + ".jpg")
        } else {
            let wnd = WngMrg.getInstance().getWindow("FullImageFrame")
            //TLog.Debug("afdfa",this.ImgEffectID)
            let effectList = splitString(this.ImgEffectID, ',')
            //TLog.Debug_r(effectList)
            //io.read()

            wnd.setImageName(this.imageName, this.ImgMoveType, this.ImgMoveTime, effectList)
            if (wnd.isVisible() && wnd.isLoadComplete()) {
                wnd.refreshFrame()
            } else {
                wnd.showWnd()
            }
        }
        if (this.max_time == 0) {
            this.finish()
        }
    }

    onTick(delay) {
        this.time = this.time + delay
        if (this.time > this.max_time) {
            this.finish()
        }
    }

    destory() {

        if (this.isBG == true) {
            SceneManager.getInstance().setBgImage(null)
        } else {
            WngMrg.getInstance().hideWindow("FullImageFrame")
        }

    }

    onFinish() {
        this.hideImage()
    }
    hideImage() {
        if (this.clear == true) {
            if (this.isBG == true) {
                SceneManager.getInstance().setBgImage(null)
            } else {
                WngMrg.getInstance().hideWindow("FullImageFrame")
            }
        }
    }
}*/