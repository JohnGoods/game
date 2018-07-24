 var SHADOW_PATH = "ui/image/map/shadow.png"

class ActorCmdComponent_Visual extends ActorCmdComponent implements core.TextureCallback{

    mShadowNode: egret.Bitmap;
    textureRes:core.ResItem;

	public initObj(...params:any[]):void{
        this.addCommandHandler(ActorCommand.SetShadowVisible, this.onHandleCommand_SetShadowVisible)
    }
    
    //子类复写 析构函数
    protected destory(): void{
        this.clearShadow();
    }

    onAsynTextureSucceed( key:string, texture:egret.Texture, res:core.ResItem){
        if(key == SHADOW_PATH){
            this.textureRes = res;
            this.textureRes.retain();

            this.createShadow();
        }
    }

    clearShadow(){
        core.TextureManager.getInstance().cancelTextureAsyn(SHADOW_PATH, this)

        if(this.mShadowNode){
            this.realActor.removeDisplayeNode(this.mShadowNode);
            this.mShadowNode.$setBitmapData(null);
            this.mShadowNode = null;
        }

        if(this.textureRes){
            this.textureRes.release();
            this.textureRes = null;
        }
    }

    createShadow(){
        if(this.textureRes == null){
            core.TextureManager.getInstance().loadTextureAsyn(SHADOW_PATH, this);
            return;
        }

        if(this.mShadowNode == null){
            this.mShadowNode = new egret.Bitmap;
            this.realActor.addDisplayeNode(map.SpriteDisplayNodeType.eDisplayNode_Shadow, this.mShadowNode);
        }

        this.mShadowNode.$setBitmapData(this.textureRes.getData());
        this.mShadowNode.anchorOffsetX = this.mShadowNode.width/2;
        this.mShadowNode.anchorOffsetY = this.mShadowNode.height/2;
    }

    onHandleCommand_SetShadowVisible(param1, param2){
        var visible = param1;
        
        if(visible){
            this.createShadow();
        }else{
            this.clearShadow();
        }
    }
}