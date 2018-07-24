// TypeScript file
//龙王宝藏结算界面
class FightDragonPrizeFrame extends FightPrizeFrame {
    
    public initObj(...params: any[]) {
        
    }

    public onLoad(): void {
        super.onLoad()

        for (let i = 0; i < 3; i++) {
            this.mElemList["starBg" + i].visible = true
        }
    }

    refreshFrame() {
        super.refreshFrame()
        //param/commonPrize
        // local commonPrize = {}
        // commonPrize.funds = 0                        现银
        // commonPrize.bindCurrency = 0                 绑定元宝
        // commonPrize.currency = 0                     元宝
        // commonPrize.plrExp = 0                       经验
        // commonPrize.itemList = {}                    {entryId, count}
        // commonPrize.star = 0
        // commonPrize.campaignId = 0

        for (let i = 0; i < 3; i++) {
            this.mElemList["star" + i].visible = i < this.param.commonPrize.star
        }
    }
}