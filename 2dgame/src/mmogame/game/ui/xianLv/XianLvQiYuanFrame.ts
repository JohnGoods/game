// TypeScript file
class XianLvQiYuanFrame extends BaseWnd {

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/xianlv/XianLvQiYuanLayout.exml"]
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 470
        this.mLayoutNode.height = 430
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        this.mElemList["rd_1"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_3"].setAlignFlag(gui.Flag.LEFT_TOP)


    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
        this.mLayoutNode.visible = true;
        // this.mLayoutNode.setDoModal(true);
        this.onRefresh();
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false);
    }
    onRefresh() {
        //rd_1
        let jihuolist = XianLvSystem.getInstance().getJiHuoList()
        let jie = 0
        for (let i = 0; i < jihuolist.length; i++) {
            jie += XianLvSystem.getInstance().getLevel(jihuolist[i])
        }

        
        let qiyuanConfig = GameConfig.ActorXianLvQiYuanConfig
        let nowConfig : any 
        let nextConfig : any

        for(let k in qiyuanConfig){
            let qiYuanInfo = qiyuanConfig[k]

            if(qiYuanInfo.allLevel > jie){
                nextConfig = qiYuanInfo
                break
            }else{
                nowConfig = qiYuanInfo
            }
        }

        
        let jieStr = ""
        
        this.mElemList["group_top"].visible = true
        this.mElemList["group_bottom"].visible = true
       // this.mElemList["image_jihuo"].visible = false
        if (nowConfig == null) { //未激活
            this.mLayoutNode.height = 300

            this.mElemList["group_top"].visible = false
            //this.mElemList["image_jihuo"].visibel = true

            jieStr = Localize_cns("XIANLV_QIYUAN_TXT1") + "#lime" + Localize_cns("PET_TXT37")

            let str = Localize_cns("XIANLV_QIYUAN_TXT3") + "#br#br#gray"

            let effect = table_effect(nextConfig.effects)
            for(let k in effect){
                str += "#space_55" + GetPropertyName(k) + effect[k] + "#br#br"
            }

            str += "#rf" + String.format(Localize_cns("XIANLV_QIYUAN_NEXTlEVEL"), nextConfig.allLevel || 0) + "#br#br" + Localize_cns("XIANLV_QIYUAN_NOWLEVEL") + "#lime" + jie

            AddRdContent(this.mElemList["rd_3"], str, "ht_24_lc_stroke")

        } else if (nextConfig == null) {    //满级
            this.mLayoutNode.height = 300

            this.mElemList["group_top"].visible = false

            jieStr = Localize_cns("XIANLV_QIYUAN_TXT1") + "#lime" + Localize_cns("ROLE_TXT31")

            let str = Localize_cns("XIANLV_QIYUAN_TXT2") + "#br#br"

            let effect = table_effect(nowConfig.effects)
            for(let k in effect){
                str += "#space_55" + GetPropertyName(k) + effect[k] + "#br#br"
            }

            str += "#lime" + Localize_cns("ROLE_TXT31")

            AddRdContent(this.mElemList["rd_3"], str, "ht_24_lc_stroke")

        } else {
            this.mLayoutNode.height = 430
            jieStr = Localize_cns("XIANLV_QIYUAN_TXT1") + "#lime" + nowConfig.allLevel + Localize_cns("XIANLV_QIYUAN_JI")
            //rd_2
            let str2 = Localize_cns("XIANLV_QIYUAN_TXT2") + "#br#br"

            let noweffect = table_effect(nowConfig.effects)
            for(let k in noweffect){
                str2 += "#space_55" + GetPropertyName(k) + noweffect[k] + "#br#br"
            }
            AddRdContent(this.mElemList["rd_2"], str2, "ht_24_lc_stroke")
            //rd_3
            let str3 = Localize_cns("XIANLV_QIYUAN_TXT3") + "#br#br#gray"

            let nexteffect = table_effect(nextConfig.effects)
            for(let k in nexteffect){
                str3 += "#space_55" + GetPropertyName(k) + nexteffect[k] + "#br#br"
            }

            str3 += "#rf" + String.format(Localize_cns("XIANLV_QIYUAN_NEXTlEVEL"), nextConfig.allLevel || 0) + "#br#br" + Localize_cns("XIANLV_QIYUAN_NOWLEVEL") + "#lime" + jie

            AddRdContent(this.mElemList["rd_3"], str3, "ht_24_lc_stroke")
        }

        AddRdContent(this.mElemList["rd_1"], jieStr, "ht_24_lc_stroke")
    }

}
