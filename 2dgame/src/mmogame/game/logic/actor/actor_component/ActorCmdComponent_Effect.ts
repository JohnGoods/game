class ActorCmdComponent_Effect extends ActorCmdComponent{

    bindEffectList:Effect[];
	public initObj(...params:any[]):void{

        this.bindEffectList = [];
        
        this.addCommandHandler(ActorCommand.AddEffect, this.onHandleCommand_AddEffect)
        this.addCommandHandler(ActorCommand.RemoveEffect, this.onHandleCommand_RemoveEffect)
        this.addCommandHandler(ActorCommand.RemoveEffectById, this.onHandleCommand_RemoveEffectById)
        this.addCommandHandler(ActorCommand.RemoveEffectAll, this.removeAllEffect)
        //命名特效
        //this.addCommandHandler(ActorCommand.SetEffect, this.onHandleCommand_SetEffect)
        //this.addCommandHandler(ActorCommand.SetEffectVisible, this.onHandleCommand_SetEffectVisible)
        this.addCommandHandler(ActorCommand.SetEffectVisibleWithCaster, this.onHandleCommand_SetEffectVisibleWidthCaster)
    }
    //子类复写 析构函数
    protected destory(): void{
        this.removeAllEffect()
    }

    onAppearChange() {
        for(let effect of this.bindEffectList){
            this.updateEffectBone(effect)
        }
    }

    removeAllEffect(){
        while(this.bindEffectList.length > 0){
            let effect = this.bindEffectList[0];
            if(effect.isAutoBindDelete() ){
                effect.deleteObj() //内部调用Character.removeEffect
            }else{
                this.onHandleCommand_RemoveEffect(effect, false)
                //effect.setBindCharacter(null)
            }
        }
            
        TLog.Assert(this.bindEffectList.length == 0)
    }


    updateEffectBone(effect:Effect){
       let boneName = effect.getBindBone()
        let boundRect = this.owner.getContentSize();

       if(boneName == "" || boneName == "bottom"){
           effect.setPositionOffset(0, 0)
       }else if(boneName == "center"){
           effect.setPositionOffset(0, -boundRect.height/2)
       }else if(boneName == "up"){
           effect.setPositionOffset(0, -boundRect.height)
       }
        
    }

    onHandleCommand_AddEffect(param1, param2){
        var effect = param1
        var boneParam = param2
        
        if(JsUtil.arrayExsit(this.bindEffectList, effect) ){
            TLog.Warn("Character.addEffect effect%s already exsit", tostring(effect))
            return
        }
        
        if(effect.isEnterMap() ){
            throw Error("onHandleCommand_AddEffect")
        }
        
        var effectId = effect.getEffectId()
     
        var bindBoneName = ""
        var bindOrder = 0
        var bTransfrom = false
        if(boneParam == null ){
            var effectRef = GameConfig.EffectConfig[effectId]
            if(effectRef ){
                bindBoneName = effectRef.bindBone
                bindOrder = effectRef.bindOrder
                
                //以战斗中站在左边的角色方向为基准
                var x = effectRef.offx || 0
                var y = effectRef.offy || 0
                //todo:yangguiming
                // if(this.owner.getSide ){
                //     if(this.owner.getSide() == fightSide.FIGHT_RIGHT ){
                //         x = -1 * x
                //     }
                // }
                effect.setPositionXY(x, y)
            }
        }else{
            bindBoneName = boneParam.name || ""
            bindOrder = boneParam.order || 0
            bTransfrom = boneParam.transfrom || false
        }
        
        //Order保证是所有骨骼之上
        //if(bindBoneName == "" ){
        if(bindOrder > 0 ){
            bindOrder = 10000
        }else if(bindOrder < 0){
            bindOrder = -10000
        }
        
        effect.setBindCharacter(this.owner)
        JsUtil.arrayPush(this.bindEffectList, effect)
        
        effect.setBindBone(bindBoneName)
        this.realActor.addChildSprite(bindBoneName, effect.realActor, bindOrder, bTransfrom)
        this.updateEffectBone(effect)
    }


    onHandleCommand_RemoveEffect(param1, param2){
        var effect = param1
        var bDelete = param2
        if(bDelete == null ){
            bDelete = true
        }
        
        var flag = JsUtil.arrayExsit(this.bindEffectList, effect)
        if(flag ){
            if(bDelete ){
                effect.deleteObj()
            }else{
                this.realActor.removeChildSprite(effect.realActor)
                effect.setBindCharacter(null)
            }
            
        }
        JsUtil.arrayRemoveVal(this.bindEffectList, effect)
    }

    onHandleCommand_RemoveEffectById(param1, param2){
        var effectId = param1
	
        var removeEffect = null
        for(var i =0; i < this.bindEffectList.length; i++){
            var v = this.bindEffectList[i];
            if(v.getEffectId() == effectId ){
                removeEffect = v
                //table_remove(this.bindEffectList, v)
                break;
            }
        }
        
        if(removeEffect ){
            removeEffect.deleteObj()
        }
    }



    onHandleCommand_SetEffectVisible(param1, param2){
        param1 = !!param1;

        this.bindEffectList.forEach(v=>{
            v.setVisible(param1 == true)
        })

    }

    onHandleCommand_SetEffectVisibleWidthCaster(param1, param2){

        this.bindEffectList.forEach(v=>{
            if(v.getCaster() != param2 ){//隐藏非caster施法的特效
                v.setVisible(param1 == true)
            }
        })

    }
}