class Fight_ScreenImageAction extends Fight_BaseAction {
    imageName: string;
    public initObj(...args: any[]): void {
        //this.shakeType = this.elemInfo.param1 || 0
        this.imageName = this.elemInfo.param1 || "xingkongbeijing"
    }

    onPlay() {
        // let path = String.format("data/ui/image/combat/%s.jpg", this.imageName)
        // SceneManager.getInstance().setFgImage(path)
    }

    onFinish() {
        //SceneManager.getInstance().setFgImage("")
    }
}