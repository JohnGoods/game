// TypeScript file
class CarnivalInstZonesWindow extends OpenXMWindow {
    public onShow(): void {
        this.initActGameConfig()

        super.onShow()
    }

    onActivityUpdate(args) {
        if (args.actIndex == this.actIndex) {
            this.initActGameConfig()
        }

        super.onActivityUpdate(args)
    }

    //////////////////////////////////////////////////
    initActGameConfig() {
        let gameConfig = {}
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex)
		if (info != null && size_t(info) != 0) {
            let typeIndex = info[0]
            if (GameConfig.NormalInstZonesConfig[typeIndex]) {
                gameConfig = table_copy(GameConfig.NormalInstZonesConfig[typeIndex])
            }
        }

        this.actConfigTable = gameConfig
    }
}