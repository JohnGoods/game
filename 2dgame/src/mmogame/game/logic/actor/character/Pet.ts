class Pet extends Character {
    showHunid: number;
    shouHunEffect: Effect;

    //子类复写 初始化函数
    public initObj(...params: any[]): void {
        this.setMovementNotifyEnable(true)
        this.actorType = actor_Type.ACTOR_TYPE_PET;
        this.showHunid = -1
        this.setTouchEnable(false);
        this.addAliasAction("run", "idle")
    }
    //子类复写 析构函数
    protected destory(): void {
        this.deleteShouHunEffect()
    }


    loadModel(modelId) {
        let showHunid = this.showHunid
        //let rightWeaponId = this.rightWeaponId

        this.deleteShouHunEffect()
        this.showHunid = -1

        super.loadModel(modelId)
        this.setShouHunEffect(showHunid)

    }

    deleteShouHunEffect() {
        if (this.shouHunEffect) {
            this.shouHunEffect.deleteObj()
            this.shouHunEffect = null
        }
    }


    setShouHunEffect(effectId) {
        effectId = effectId || 0

        if (this.showHunid == effectId) {
            return
        }

        this.deleteShouHunEffect()
        this.showHunid = -1
        if (effectId <= 0) {
            return
        }
        this.showHunid = effectId

        let boneParam: any = {}
        boneParam.name = ""
        boneParam.order = -1
        boneParam.transfrom = true

        this.shouHunEffect = EffectManager.getInstance().createBindEffect(effectId, this, boneParam, true)

        return this.shouHunEffect
    }

}