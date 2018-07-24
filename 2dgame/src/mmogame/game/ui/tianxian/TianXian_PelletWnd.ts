// TypeScript file
class TianXian_PelletWnd extends BaseCtrlWnd {
    mElemList;
    select
    type

    public initObj(...params: any[]) {
        this.select = -1
        this.type = cellOptionsIndex.TianXianDanYao
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        var elemInfo = [
			{ ["name"]: "btn_use", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUseClick },
			
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.onInitWindow()
        this.mElemList["petlletBox"] = UIItemBox.newObj(this.mLayoutNode, "petlletBox", 80, 5 , this.mElemList["group_bottom"])
        
        this.mElemList["rd_1"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_3"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_4"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_zhanli"].setAlignFlag(gui.Flag.CENTER_TOP)
        this.mElemList["rd_des"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["rd_used"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.TIANXIAN_UPDATE, this.onRefresh, this)
        this.mElemList["pellet_group"].visible = true
        this.mElemList["btn_tips"].visible = false
        this.mElemList["title"].text = Localize_cns("TianXianDanYao")
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.TIANXIAN_UPDATE, this.onRefresh, this)
        this.mElemList["pellet_group"].visible = false
    }

    //初始界面
    onInitWindow(){
	  
	   for(let i = 1; i <= 8;i++){
		   let danConfig = GameConfig.FunTianXianDanYaoConfig["TianXianDanYao"][i]
		   let icon = GetItemIcon(danConfig.itemid)
		   let danName = danConfig.itemname
	
		   let name = "pellet";

		   if(!this.mElemList[ name + "_sprite" + i]) {
			//   this.mElemList[name + "skillBox" + i] = UISkillBox.newObj(this.mLayoutNode, name + "skillBox" + i, 17, 17, this.mElemList["skill" + i])
			   let mElemInfo: any = [

              //   { ["index_type"]: eui.Group, ["name"]: name + "_bg" + i, ["image"]: "", ["x"]: 17, ["y"]: 17, ["w"]: 0, ["h"]: 0, },
                 { ["index_type"]: eui.Image, ["name"]: name + "_sprite" + i, ["image"]: icon, ["x"]: 10, ["y"]: 10, ["w"]: 0, ["h"]: 0,  },
				 { ["index_type"]: eui.Image, ["name"]: name + "_select" + i, ["image"]: "hb_jiNengXuanZhong", ["x"]: -1, ["y"]: -2, ["w"]: 100, ["h"]: 100,  },
                 { ["index_type"]: eui.Image, ["name"]:name + "name_bg" + i, ["image"]: "ty_textDi05", ["x"]: -13, ["y"]: 69, ["w"]: 127, ["h"]: 40,  },
                 { ["index_type"]: eui.Label, ["name"]: name + "_name" + i, ["parent"]:name + "name_bg" + i,["title"]:danName, ["font"]: "ht_24_cc", ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 127, ["h"]: 40,  },
				
				 ];
        	   UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this,this.mElemList["group_" + i] );
		   	   this.mElemList[name + "_select" + i].visible = false;
               let image = <eui.Image>this.mElemList[name + "_sprite"+ i]
               image.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickOne, this)
		   }
		  
	   }
	   
    }

    onRefresh(){
        //this.select = -1
        let danConfig = GameConfig.FunTianXianDanYaoConfig["TianXianDanYao"]
        let selectDan = danConfig[this.select]
        if(selectDan == null) this.select = -1
        if(selectDan){
            let selectHad = ItemSystem.getInstance().getItemCount(selectDan.itemid)
            if(selectHad < selectDan.itemnum){
                this.select = -1
            }
        }
        if(this.select == -1){
            for(let k in danConfig){
                let danInfo = danConfig[k]
                let danyaoHad = ItemSystem.getInstance().getItemCount(danInfo.itemid)
                if(danyaoHad >= danInfo.itemnum){
                    this.select = tonumber(k)
                    break
                }
            }
        }
        
        let recvinfo = TianXianSystem.getInstance().getTianXianInfo(this.type)
        if( recvinfo == null) return 
        let usedlist = recvinfo["danyaodatalist"]
        if(size_t(usedlist) == 0) return 

        if(this.select == -1) {
            this.select = 1
        }
        this.showWithSelect()

        
        //common rd_1~4
        let totalConfig = {}
        for(let i = 0; i < size_t(usedlist); i++){
           let tempConfig = danConfig[i+1]
           let config = table_effect(tempConfig.effects)
           config = table_effect_mul(config, usedlist[i])
           if(size_t(totalConfig) == 0){
               totalConfig = config
           }else{
               totalConfig = table_effect_add(totalConfig, config)
           }
           
        }
        let force = recvinfo["force"]
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

        let str1 = ""
        let str2 = ""
        let str3 = ""
        let str4 = ""
        let str5 = ""
        let str6 = ""
        let str7 = ""
        let str8 = ""
        for(let k in totalConfig){
            let v = "#green" + tostring(totalConfig[k]) + "#rf"
            if(k == IndexToabilityName[objectField.UNIT_FIELD_MAX_HP] ){
                str1 += GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_DODGE] ){
                str2 += GetPropertyName(objectField.UNIT_FIELD_DODGE) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_ATTACK] ){
                str3 += GetPropertyName(objectField.UNIT_FIELD_ATTACK) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_CRITICAL] ){
                str4 += GetPropertyName(objectField.UNIT_FIELD_CRITICAL) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_DEFENCE] ){
                str5 += GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_CRITICAL_DEC] ){
                str6 += GetPropertyName(objectField.UNIT_FIELD_CRITICAL_DEC) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_HITRATE] ){
                str7 += GetPropertyName(objectField.UNIT_FIELD_HITRATE) + v
            }else if(k == IndexToabilityName[objectField.UNIT_FIELD_SPEED] ){
                str8 += GetPropertyName(objectField.UNIT_FIELD_SPEED) + v
            }
        }
        AddRdContent(this.mElemList["rd_1"], str1 + "#br#br" + str2, "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["rd_2"], str3 + "#br#br" + str4, "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["rd_3"], str5 + "#br#br" + str6, "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["rd_4"], str7 + "#br#br" + str8, "ht_20_cc", "ublack")

    }

    
    showWithSelect(){
        
        for(let i = 1; i <= 8; i++){
           this.mElemList["pellet_select" + i].visible = false
        }
        this.mElemList["pellet_select" + this.select].visible = true;

        let danConfig = GameConfig.FunTianXianDanYaoConfig["TianXianDanYao"][this.select]
        let config = table_effect(danConfig.effects)
        let desStr = Localize_cns("TIANXIAN_SHUXING")
        for(let k in config){
            desStr += "#br" + GetPropertyName(lastAbilityNameToIdOptions[k]) + config[k]
        }
        let forceStr = Localize_cns("TIANXIAN_ZHANLI") + GetForceMath(config)
        AddRdContent(this.mElemList["rd_des"], desStr, "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["rd_zhanli"], forceStr, "ht_20_cc_stroke", "lime")

        //bottom
        this.mElemList["petlletBox"].updateByEntry(danConfig.itemid)
        //字体颜色
        
        let name = danConfig.itemname
        this.mElemList["label_name"].text = name

        let itemid = danConfig.itemid
        let need = danConfig.itemnum
       // let item = ItemSystem.getInstance().getItemLogicInfoByID(itemid)
       // let quality = item.getProperty("quality")
        let nameColor = GetItemFontColor(itemid, false)
        let had = ItemSystem.getInstance().getItemCount(itemid)
        let hadStr = (had >= need)?"#rf#green" : "#rf#red"
        name  = "#" + nameColor + name + "x" + need + "#br#br#black" + Localize_cns("ITEM_TXT30")+ hadStr + had
        AddRdContent(this.mElemList["rd_had"], name, "ht_20_cc", "ublack")

        let recvInfo  = TianXianSystem.getInstance().getTianXianInfo(this.type)
        if(recvInfo == null) return
        let usedlist = recvInfo["danyaodatalist"]

        let used = usedlist[this.select-1]
    
        let usedStr = String.format(Localize_cns("ROLE_MOUNT_DAN_TXT1"), used)
        AddRdContent(this.mElemList["rd_used"], usedStr, "ht_20_cc", "ublack")

    }
    ///------------------响应
    onClickOne(args:egret.Event){
        let name = args.target.name
        let index  = name.replace(/[^0-9]/ig, "");
        this.select = tonumber(index)
        
        this.showWithSelect()
    }

    onUseClick(){
        let danConfig = GameConfig.FunTianXianDanYaoConfig["TianXianDanYao"][this.select]
        let itemid = danConfig.itemid
        let need = danConfig.itemnum
        let had = ItemSystem.getInstance().getItemCount(itemid)
        if(had < need) {
            let itemConfig = GameConfig.itemConfig[itemid]
            let name = itemConfig.name
            //let fontColor = "#" + GetQualityColorStr(itemConfig.quality)
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), name ))
            return 
        }
        RpcProxy.call("C2G_SIMPLECELLFUN_DANYAOUP", this.type ,  this.select)//entryid 玩法丹药  index --升级第几个丹药

    }
}