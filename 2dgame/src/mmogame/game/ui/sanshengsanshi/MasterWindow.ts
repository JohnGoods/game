class MasterWindow extends BaseCtrlWnd {
	mElemList;
	tabWndList1: UITabWndList
	curTabIndex;


	public initObj(...params: any[]) {
		// 
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		this.mElemList["my_master_group"].visible = false
		this.mElemList["my_prentice_group"].visible = false
		this.mElemList["recruit_group"].visible = false
		var elemInfo =[
				{["name"] : "btn_rule",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onRuleClick},
				{ ["name"]: "weiwang_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShopClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let tabInfoList = [
			{ name: "group3_radio1", wnd: MasterWindow1.newObj(this.mLayoutNode, this) },
			{ name: "group3_radio2", wnd: MasterWindow2.newObj(this.mLayoutNode, this) },
			{ name: "group3_radio3", wnd: MasterWindow3.newObj(this.mLayoutNode, this) },
		]
		this.tabWndList1 = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.mElemList["group3"].visible = true;
		this.mElemList["btn_rule"].visible = true;
		this.mElemList["weiwang_shop"].visible = true;
		this.mElemList["title"].text = Localize_cns("SANSHENG_TXT9")
		this.tabWndList1.setWndVisible(true);
		this.onRefresh()

	}

	public onHide(): void {
		this.mElemList["group3"].visible = false;
		this.mElemList["btn_rule"].visible = false;
		this.mElemList["weiwang_shop"].visible = false;
		this.tabWndList1.setWndVisible(false);
		// this.curTabIndex = null
	}
	
	onRefresh() {
		if (this.mParentWnd.masterIndex!=-1) {
            this.tabWndList1.changeTabWithIndex(this.mParentWnd.masterIndex)
			this.mParentWnd.masterIndex = -1
        }
    }

	initItemWindow(window){
	
	}

	refreshItemWindow(window, data){
	
	}

	onRuleClick(){
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("shituRule")
	}

	onShopClick(){
		let wnd = WngMrg.getInstance().getWindow("ShopZhuangBanFrame");
		wnd.showWithIndex(3);
	}

	// showWithIndex(index) {
    //     if (index!=null) {
    //         this.curTabIndex = index
    //     }
        // this.showWnd()
		// if (this.curTabIndex!=null) {
            // this.tabWndList1.changeTabWithIndex(this.curTabIndex)
        // }
    // }
 }

//我的师傅
 class MasterWindow1 extends BaseCtrlWnd {
	mElemList;
	lastSendTime :number
	scroll : UIScrollList
	nameToInfo:any[];
	petBox : UIPetBox
	taskConfig;
	tudiTaskExp:number

	public initObj(...params: any[]) {
		this.lastSendTime = -1
		let config = {
			[100] : {},
			[101] : {handle: this.onEquip, param:2},	//装备熔炼
			[102] : {handle: this.onExp, param:2},	//经验妖魔
			[103] : {handle: this.onDegeon, param:2},	//组队副本
			[104] : {handle: this.onGeReBoss, param:2},	//个人BOSS
			[105] : {handle: this.onQuanminBoss, param:2},	//全民BOSS
			[106] : {handle: this.onWuLin, param:2},	//武林擂台
			[107] : {handle: this.onCaiLiao, param:2},	//材料副本
			[108] : {handle: this.onHuSong, param:2},	//西游护送
		}
		this.taskConfig = config
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo =[
				{ ["name"]: "master_label", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSendApplyClick },	
				{ ["name"]: "master_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAsterClick },	
				{ ["name"]: "wanmeichushi_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWanMeiClick },	
				{ ["name"]: "putongchushi_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPuTongClick },	
				{ ["name"]: "seek_master_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSendApplyClick },	
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		
		let group : eui.Group = this.mElemList["task_list_group"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)
		// 这里初始化一个头像
		this.petBox = UIPetBox.newObj(this, "petBox", -40, -30, this.mElemList["master_role_group"], 1)

		for(let i = 1;i<2;i++){
			this.mElemList["award1"+"itemBox"+i] = UIItemBox.newObj(this.mElemList, "award1"+"itemBox"+i, (i-1)*80 ,0,this.mElemList["putongchushi_reward"],0.9)
			this.mElemList["award2"+"itemBox"+i] = UIItemBox.newObj(this.mElemList, "award2"+"itemBox"+i, (i-1)*80 ,0,this.mElemList["wanmeichushi_reward"],0.9)
			this.mElemList["award1"+"itemBox"+i].updateByEntry(-1)
			this.mElemList["award2"+"itemBox"+i].updateByEntry(-1)
		}
		this.mElemList["wanmeichushi_exp"] = UIItemBox.newObj(this.mElemList, "wanmeichushi_exp",0 ,0,this.mElemList["wanmeichushi_exp"],0.9)
		
		this.mElemList["wanmeichushi_need_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
		this.mElemList["chushi_need_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.mElemList["my_master_group"].visible = true;
		RegisterEvent(EventDefine.SHITU_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		RpcProxy.call("C2G_UpdateShitu")
	}

	public onHide(): void {
		this.mElemList["my_master_group"].visible = false;
		UnRegisterEvent(EventDefine.SHITU_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
	}
	
	onRefresh() {
	  this.petBox.setVisible(false)
	  this.tudiTaskExp = 0
	  let shituInfo	= ActivitySystem.getInstance().getShiTuInfo()
	//   if(shituInfo == null || shituInfo.shifuInfo == null || !shituInfo.shifuInfo.id){		//注释了
	// 	  return
	//   }

	  let haveShiFu = false
	  if(shituInfo && shituInfo.shifuInfo && shituInfo.shifuInfo.id > 0){
		  haveShiFu = true
	  }
	  this.mElemList["have_master_group"].visible = haveShiFu
	  this.mElemList["not_master_group"].visible = (!haveShiFu)
	  
	  
	  //出师消耗
	  let str = String.format(Localize_cns("SANSHENG_TXT45"),4800)
	  AddRdContent(this.mElemList["wanmeichushi_need_rd"], str, "ht_20_cc_stroke", "white")
	  AddRdContent(this.mElemList["chushi_need_rd"], Localize_cns("SANSHENG_TXT46"), "ht_20_cc_stroke", "white")
	  
	  let scroll = this.scroll
	  scroll.clearItemList();

	  if(haveShiFu){
		  let shifuInfo = shituInfo.shifuInfo
		  let vocation = shifuInfo.vocation || 10001
		  let sexId = shifuInfo.sexId || 1
		  this.petBox.updateRoleInfo(vocation,sexId ,  shifuInfo.id)
		  this.petBox.setClickEnable(false)
		  this.petBox.setEnable(true)
		  this.petBox.setVisible(true)

		  let masterName = shifuInfo.name
		  this.mElemList["master_name"].text = String.format(Localize_cns("SANSHENG_TXT21"),masterName)
		  
		  let masterLevel = shifuInfo.level
		  this.mElemList["master_level"].text = String.format(Localize_cns("SANSHENG_TXT22"),masterLevel)

		  let state = shifuInfo.online
		  let masterStateText = Localize_cns("SANSHENG_TXT27")
		  let color = "#red"
		  if(state == 1){
			  masterStateText = Localize_cns("SANSHENG_TXT28")
			  color = "#lime"
		  }
		  AddRdContent(this.mElemList["master_state"], color+masterStateText, "ht_20_cc", "ublack")
		 
		  //this.mElemList["master_state"].color = color

		  //shifuInfo.chuanGong
		  //0没传功
		  //1师傅传功了
		  //2已经接受传功
		  //let theWork = (shifuInfo.chuanGong == 1)	//是否传功
		  let isChuanGong = (shifuInfo.chuanGong == 2) 
		  this.mElemList["master_kechushi_group"].visible = false
		  this.mElemList["chushi_group"].visible = false
		  this.mElemList["master_not_theWork_group"].visible = !isChuanGong
		  this.mElemList["master_theWork_group"].visible = isChuanGong
		  this.mElemList["master_btn"].enabled = (shifuInfo.chuanGong == 1)
		  this.mElemList["jieshou_hongdian"].visible = (shifuInfo.chuanGong == 1)
		  

		//    this.mElemList["master_btn"].enabled = true
		//   if(shifuInfo.chuanGong == 1){
		// 	  this.mElemList["master_btn"].enabled = false
		//   }
		  

		  let curTime = GetServerTime()
		  let chushiTime = shifuInfo.chushiTime
		  let canChushi = false	//是否可以出师
		  let chushiDay = 0	//出师还有多少天
		  if(curTime>=chushiTime){
			  canChushi = true
		  }else{
			 chushiDay = Math.ceil((chushiTime-curTime)/86400)
		  }
		  this.mElemList["master_chushi_day"].text = String.format(Localize_cns("SANSHENG_TXT24"),chushiDay)

		  //自己可以出师了
		  if(canChushi){
			 this.mElemList["master_kechushi_group"].visible = true
			 this.mElemList["chushi_group"].visible = true
			 this.mElemList["master_theWork_group"].visible = false
		 	 this.mElemList["master_not_theWork_group"].visible = false
			 let config = GameConfig.ShiTuPrizeConfig

			 for(let i=1;i<3;i++){
				let curConfig = config[i+99]
				let prize = curConfig.tdPrize
				for(let j = 1;j<2;j++){
					if(prize[j-1]){
						let _type = prize[j-1][0]
						let itemId = prize[j-1][1]
						let itemCount= prize[j-1][2]
						if(_type == "prestige"){
							itemId = 60063
							itemCount= prize[j-1][1]
						}
						this.mElemList["award"+i+"itemBox"+j].updateByEntry(itemId,itemCount)
					}else{
						this.mElemList["award"+i+"itemBox"+j].updateByEntry(-1)
					}
				}
			 }

			 //完美出师经验
			 let myLevel = GetHeroProperty("level") || 0
          	 let expConfig = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Hero - 1]]
		  	 let exp = 0
       	  	 for (let _ in expConfig) {
            	let v = expConfig[_]
            	if (v.Level == myLevel) {
                	exp = v.maxexp
					break
            	}
         	 }

			 let expId = 60061
			 let expNum = exp * opShiTu.prefabChushi
			 this.mElemList["wanmeichushi_exp"].updateByEntry(expId,expNum)
			 return
		  }
		  
		  //描述
		  this.mElemList["master_des"].text = Localize_cns("SANSHENG_TXT25")

		  //传功exp = 当前等级经验 * 系数
		  let myLevel = GetHeroProperty("level") || 0
          let config = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Hero - 1]]
		  let exp = 0
       	  for (let _ in config) {
            let v = config[_]
            if (v.Level == myLevel) {
                exp = v.maxexp
            }
          }

		  let masterExp = exp * opShiTu.tudiAcceptExp
		  this.tudiTaskExp = exp * opShiTu.tudiTaskExp	//这里顺便设置徒弟任务奖励经验
		  this.mElemList["master_exp"].text = String.format(Localize_cns("SANSHENG_TXT26"),MakeLongNumberShort(masterExp))
	   }else{
		   return	//没师傅就跳出
	   }

	   let task = shituInfo.shifuInfo.task //当前任务次数 task[任务id] = 完成次数
	   let taskIsGetInfo = getSaveRecord(opSaveRecordKey.shituTaskPrize)	//任务是否领取信息

	   let configList =  []
	   let list = []
	   let list1 = []	//没领取
	   let list2 = []	//已领取
	   let list3 = []	//可领取
	   for (let _ in GameConfig.ShiTuTaskConfig) {
            let v = GameConfig.ShiTuTaskConfig[_]
			if(task[v.ID] == v.maxCount && (taskIsGetInfo == null || taskIsGetInfo[v.ID] == null)){
				v.isGet = false
				table_insert(list3,v)	//可领取
			}else{
				if(taskIsGetInfo && taskIsGetInfo[v.ID]){
					v.isGet = true
					table_insert(list2,v)	//已领取了
				}else{
					v.isGet = false
					table_insert(list1,v)
				}
			}
       }

	   for(let i =0;i<size_t(list3);i++){
		   table_insert(list,list3[i])
	   }

	   for(let i =0;i<size_t(list1);i++){
		   table_insert(list,list1[i])
	   }

	   for(let i =0;i<size_t(list2);i++){
		   table_insert(list,list2[i])
	   }

	   this.nameToInfo = []
	   
       for (let i = 0; i<size_t(list); i++) {
            let v = list[i]
            let [window, flag] = this.scroll.getItemWindow(i, 560, 75, 0, 0, 5)
			if (flag == true) {
            	this.initItemWindow(window)
			}
            this.refreshItemWindow(window, v,task)
       }
    }

	initItemWindow(window){
		let name = window.name
		let width = 550
		let height = 75
		let Info: any = [
               //背景
                { ["index_type"]: gui.Grid9Image, ["name"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 5, ["y"]: 0, ["w"]: width, ["h"]: height, },
				{ ["index_type"]: eui.Label, ["name"]: name + "task_des", ["parent"]: name + "bg", ["title"]: "XXXXXX任务", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]:20, ["y"]: 0, ["w"]: 180, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: name + "task_jindu", ["parent"]: name + "bg", ["title"]: "0/5", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]: 205, ["y"]: 0, ["w"]: 70, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: name + "goBtn", ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 425, ["y"]: 10, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoClick},
				{ ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "goBtn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
		// this.mElemList[name + "rd"].setAlignFlag(gui.Flag.LEFT)
		this.mElemList[name+"itemBox"] = UIItemBox.newObj(this.mElemList, name+"itemBox", 310 ,0,this.mElemList[name+"bg"],0.9)
		//this.mElemList[name+"itemBox"].updateByEntry(20001,99)
	}

	refreshItemWindow(window,data,taskInfo){
		let name = window.name

		let prizeItemId = 60061	//经验ID
		// let prizeCount = data.prize[0][1]
		let prizeCount = this.tudiTaskExp
		this.mElemList[name+"itemBox"].updateByEntry(prizeItemId,prizeCount)

		this.mElemList[name+"task_des"].text = data.name
		let taskNum = taskInfo[data.ID] || 0
		this.mElemList[name+"task_jindu"].text = taskNum + "/" + data.maxCount
		this.mElemList[name+"goBtn"].enabled = true

		let state = 1
		let btnText = Localize_cns("SANSHENG_TXT29")
		let _enabled = true
		if(taskNum >= data.maxCount){
			state = 2
			btnText = Localize_cns("SANSHENG_TXT30")
		}
		let isGet = data.isGet
		if(isGet){
			state = 3
			btnText = Localize_cns("SANSHENG_TXT31")
			_enabled = false
		}
		this.mElemList[name+"goBtn"].text = btnText
		this.mElemList[name+"goBtn"].enabled = _enabled
		this.mElemList[name+"btnTips"].visible = (state==2)
		
		let info = {"state":state,"id":data.ID}
		this.nameToInfo[name+"goBtn"] = info
	}

	//广播
	onSendApplyClick(){
		let curSendTime = GetCurMillSec()
		if (this.lastSendTime > 0 && curSendTime - this.lastSendTime < 180000) {
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT13"))
			return
		}
		this.lastSendTime = curSendTime	
		RpcProxy.call("C2G_JoinList")
		MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT44"))
	}

	//我的师傅 传功给我的
	onAsterClick(){
		RpcProxy.call("C2G_AcceptChuanGong")
	}

	onGoClick(args){
		let name = args.target.name
        if(this.nameToInfo[name]==null){
            return
        }
		let info = this.nameToInfo[name]
		let config = this.taskConfig 
		if(info.state == 1){
            if(config[info.id]){
				let configInfo = config[info.id]
            	let func:Function = configInfo.handle
            	if(func){
               		func.call(this, configInfo.param)
              	}
            }
		}else if(info.state == 2){	//发协议完成
			RpcProxy.call("C2G_ReceiveExp",info.id)
		}
	}

	//完美出师
	onWanMeiClick(){
		//判断够不够元宝
		let curGold =  GetHeroProperty("gold")
		if(curGold<4800){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT34"))
			return
		}
		let roleId =  GetHeroProperty("id")
		RpcProxy.call("C2G_ChuShi",roleId,1,101)
	}

	//普通出师
	onPuTongClick(){
		//都是发自己ID
		let roleId =  GetHeroProperty("id")
		RpcProxy.call("C2G_ChuShi",roleId,1,100)
	}


	onEquip(param){
		let wnd : BeiBaoSmelteFrame = WngMrg.getInstance().getWindow("BeiBaoSmelteFrame")
		wnd.showWnd()
	}

	onExp(param){
		ExecuteMainFrameFunction("richang")
	}

	//组队!
	onDegeon(param){
		ExecuteMainFrameFunction("global")
	}

	onGeReBoss(param){
		let wnd =  WngMrg.getInstance().getWindow("BossMainFrame")
		wnd.showBossFrame(0)
	}

	onQuanminBoss(param){
		let wnd =  WngMrg.getInstance().getWindow("BossMainFrame")
		wnd.showBossFrame(1)
	}

	//武林擂台
	onWuLin(param){
		ExecuteMainFrameFunction("jingjichang")
	}

	//材料副本
	onCaiLiao(param){
		ExecuteMainFrameFunction("fuben")
	}

	//护送商店
	onHuSong(param){
		let wnd = WngMrg.getInstance().getWindow("EscortFrame")
        wnd.showWnd()
	}
 }

 class MasterWindow2 extends BaseCtrlWnd {
	mElemList;
	mTabIndex:number
	scroll : UIScrollList
	petBox1:UIPetBox
	petBox2:UIPetBox
	roleId1:number
	roleId2:number

	public initObj(...params: any[]) {
		this.mTabIndex = 1
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo =[
				{ ["name"]: "prentice_tip1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoApplyClick },	
				{ ["name"]: "prentice_tip2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoApplyClick },	
				{ ["name"]: "not_prentice_tip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoApplyClick },	


				{ ["name"]: "wanmei_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPrefectClick },	
				{ ["name"]: "putong_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPutongClick },	
		
				{ ["name"]: "work_btn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWorkClick1 },	
				{ ["name"]: "work_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWorkClick2 },	

				{ ["name"]: "coerce_btn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCoerceClick1 },	
				{ ["name"]: "coerce_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCoerceClick2 },			
				
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onTabSelected, this);
		let radioBtn = <eui.RadioButton>this.mElemList["group3_radio4"]
		radioBtn.group = radioGroup;
		radioBtn.value = 1;

		radioBtn = <eui.RadioButton>this.mElemList["group3_radio5"]
		radioBtn.group = radioGroup;
		radioBtn.value = 2;

		let group : eui.Group = this.mElemList["prentice_list_group"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)

		//  这里初始化一个头像
		this.petBox1 = UIPetBox.newObj(this, "petBox", -20, -15, this.mElemList["prentice_role_group1"], 0.8)
		this.petBox2 = UIPetBox.newObj(this, "petBox", -20, -15, this.mElemList["prentice_role_group2"], 0.8)

		//apprenticeship_reward1	apprenticeship_reward2 这里for循环三个物品
		for(let i = 1;i<3;i++){
			this.mElemList["reward1"+"itemBox"+i] = UIItemBox.newObj(this.mElemList, "reward1"+"itemBox"+i, (i-1)*80 ,0,this.mElemList["apprenticeship_reward2"],0.9)
			this.mElemList["reward2"+"itemBox"+i] = UIItemBox.newObj(this.mElemList, "reward2"+"itemBox"+i, (i-1)*80 ,0,this.mElemList["apprenticeship_reward1"],0.9)
			this.mElemList["reward1"+"itemBox"+i].updateByEntry(-1)
			this.mElemList["reward2"+"itemBox"+i].updateByEntry(-1)
		}
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.mElemList["my_prentice_group"].visible = true;
		RegisterEvent(EventDefine.SHITU_UPDATE, this.onRefresh, this)
		RpcProxy.call("C2G_UpdateShitu")
		this.onRefresh()

		//ShiTuPrizeConfig
		//
	}

	public onHide(): void {
		this.mElemList["my_prentice_group"].visible = false;
		UnRegisterEvent(EventDefine.SHITU_UPDATE, this.onRefresh, this)
	}
	
	onRefresh() {
		for(let i =1;i<3;i++){
			let radioBtn = <eui.RadioButton>this.mElemList["group3_radio"+(i+3)]
			radioBtn.selected = (radioBtn.value == this.mTabIndex)
		}

		this.roleId1 = 0
		this.roleId2 = 0
		this.petBox1.setVisible(false)
		this.petBox2.setVisible(false)
		

		this.mElemList["not_prentice_tip"].visible = false	//没有徒弟的隐藏
		this.mElemList["apprenticeship_group"].visible = false

	   	let shituInfo= ActivitySystem.getInstance().getShiTuInfo()
	    if(shituInfo == null){
		  return
	    }

		let tudiInfo = shituInfo.tudiInfo

		for(let i = 0;i<2;i++){
			// let curTuDiInfo = tudiInfo[i]
			let haveTudi = false
			if(tudiInfo && tudiInfo[i] && tudiInfo[i].id>0){
				haveTudi = true
			}
			this.mElemList["prentice_group"+(i+1)].visible = haveTudi
	 		this.mElemList["not_prentice_group"+(i+1)].visible = (!haveTudi)


			// this.mElemList["work_btn"+(i+1)].enable = true
			// if(curTuDiInfo.chuanGong == 0){
			// 	this.mElemList["work_btn"+(i+1)].enable = false
			// }
			this.mElemList["work_hongdian"+(i+1)].visible = false
			if(haveTudi){
				let curTuDiInfo = tudiInfo[i]
				//徒弟信息
				let canShowChuanGong = (curTuDiInfo.chuanGong == 0)	//这里要看一下 1=师傅已经传功了
				this.mElemList["not_theWork_group"+(i+1)].visible = canShowChuanGong
		  		this.mElemList["theWork_group"+(i+1)].visible = !canShowChuanGong
				this.mElemList["work_hongdian"+(i+1)].visible = canShowChuanGong
				

				//强制出师
				this.mElemList["coerce_group"+(i+1)].visible = false

				let vocation = curTuDiInfo.vocation || 10001
		  		let sexId = curTuDiInfo.sexId || 1
				
				if(i == 0){
					this.petBox1.updateRoleInfo(vocation,sexId,curTuDiInfo.id)
					this.petBox1.setClickEnable(false)
		  			// this.petBox1.setEnable(true)
					this.petBox1.setVisible(true)
					this.roleId1 = curTuDiInfo.id
				}else{
					this.petBox2.updateRoleInfo(vocation,sexId,curTuDiInfo.id)
					this.petBox2.setClickEnable(false)
		 			// this.petBox2.setEnable(true)
					this.petBox2.setVisible(true)
					this.roleId2 = curTuDiInfo.id
				}

		  		let masterName = curTuDiInfo.name
		  		this.mElemList["prentice_name"+(i+1)].text = String.format(Localize_cns("SANSHENG_TXT48"),masterName)
		  
		 		let masterLevel = curTuDiInfo.level
		 		this.mElemList["prentice_level"+(i+1)].text = String.format(Localize_cns("SANSHENG_TXT22"),masterLevel)

				let state = curTuDiInfo.online
		  		let masterStateText = Localize_cns("SANSHENG_TXT27")
		  		let color = "#red"
		  		if(state == 1){
			  		masterStateText = Localize_cns("SANSHENG_TXT28")
			  		color = "#lime"
		  		}
		 		AddRdContent(this.mElemList["prentice_state"+(i+1)], color+masterStateText, "ht_20_cc", "ublack")

				let curTime = GetServerTime()
		  		let chushiTime = curTuDiInfo.chushiTime
		  		let canChushi = false	//是否可以出师！！	//还要加一个强制出师的奖励
		  		let chushiDay = 0	//出师还有多少天
		  		if(curTime>=chushiTime){
			 		 canChushi = true
		  		}else{
			 		chushiDay = Math.ceil((chushiTime-curTime)/86400)
		  		}
				
				//可以出师 且过了一天 需要强制出师
				if(canChushi){
					 //能出师把物品更新一下
					 let config = GameConfig.ShiTuPrizeConfig
					 for(let i=1;i<3;i++){
						let curConfig = config[i+99]
						let prize = curConfig.sfPrize
						for(let j = 1;j<3;j++){
							if(prize[j-1]){
								let _type = prize[j-1][0]
								let itemId = prize[j-1][1]
								let itemCount= prize[j-1][2]
								if(_type == "prestige"){
									itemId = 60063
									itemCount= prize[j-1][1]
								}
							this.mElemList["reward"+i+"itemBox"+j].updateByEntry(itemId,itemCount)
							}else{
								this.mElemList["reward"+i+"itemBox"+j].updateByEntry(-1)
							}
						}
					}

					this.mElemList["theWork_group"+(i+1)].visible = false
		 			this.mElemList["not_theWork_group"+(i+1)].visible = false
					this.mElemList["coerce_group"+(i+1)].visible = false
					if((curTime - 86400) >= chushiTime){
						this.mElemList["coerce_group"+(i+1)].visible = true
						// break
					}
				}
		  
		 		this.mElemList["prentice_day"+(i+1)].text = String.format(Localize_cns("SANSHENG_TXT24"),chushiDay)
		 		//描述
		 		this.mElemList["prentice_des"+(i+1)].text = Localize_cns("SANSHENG_TXT25")

				//传功exp = 当前等级经验 * 系数
		  		let myLevel = GetHeroProperty("level") || 0
         		let expConfig = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Hero - 1]]
		 		let exp = 0
       	  		for (let _ in expConfig) {
            		let v = expConfig[_]
            		if (v.Level == myLevel) {
                		exp = v.maxexp
           		    }
         		}

		 		//传功exp
		 		let masterExp = exp * opShiTu.shifuChuanExp	//师傅传给我的系数
		 		this.mElemList["prentice_exp"+(i+1)].text = String.format(Localize_cns("SANSHENG_TXT26"),MakeLongNumberShort(masterExp))
			}
		}
		
	    this.refresChuShiInfo(tudiInfo)	//刷新scroll
    }

	refresChuShiInfo(tudiInfo){
		let curInfo = tudiInfo[this.mTabIndex-1]
		let haveTudi = false
		if(tudiInfo && curInfo && curInfo.id>0){
			haveTudi = true
		}
		if(!haveTudi){
			this.mElemList["not_prentice_tip"].visible = true
			this.mElemList["apprenticeship_group"].visible = false
			this.mElemList["prentice_list"].visible = false
			return
		}

		let curTime = GetServerTime()
		let chushiTime = curInfo.chushiTime
		let canChushi = false	//是否可以出师！！	//还要加一个强制出事的奖励
		// let chushiDay = 0	//出师还有多少天
		if(curTime>=chushiTime){
			canChushi = true
		}
		// else{
			// chushiDay = Math.ceil((chushiTime-curTime)/86400)
		// }

		this.mElemList["apprenticeship_group"].visible = canChushi
		this.mElemList["prentice_list"].visible = (!canChushi)

        let scroll = this.scroll
		scroll.clearItemList();

		let task = curInfo.task
		if(canChushi){
			// let config = GameConfig.ShiTuPrizeConfig
			//  for(let i=1;i<3;i++){
			// 	let curConfig = config[i+99]
			// 	let prize = curConfig.sfPrize
			// 	for(let j = 1;j<3;j++){
			// 		if(prize[j-1]){
			// 			let _type = prize[j-1][0]
			// 			let itemId = prize[j-1][1]
			// 			let itemCount= prize[j-1][2]
			// 			if(_type == "prestige"){
			// 				itemId = 60063
			// 				itemCount= prize[j-1][1]
			// 			}
			// 			this.mElemList["reward"+i+"itemBox"+j].updateByEntry(itemId,itemCount)
			// 		}else{
			// 			this.mElemList["reward"+i+"itemBox"+j].updateByEntry(-1)
			// 		}
			// 	}
			//  } 
		}else{
			this.refreshScrollList(task)	//刷新界面
		}
	}

	refreshScrollList(task){
		let list = []
		let list1 = []
		let list2 = []
	    for (let _ in GameConfig.ShiTuTaskConfig) {
            let v = GameConfig.ShiTuTaskConfig[_]
			let num = task[v.ID] || 0
			if(num >= v.maxCount){	//完成了
				table_insert(list2,v)
			}else{
				table_insert(list1,v)
			}
        }

		for(let i = 0; i<size_t(list1);i++){
			table_insert(list,list1[i])
		}

		for(let i = 0; i<size_t(list2);i++){
			table_insert(list,list2[i])
		}

        for (let i = 0; i<size_t(list); i++) {
           	let v = list[i]
            let [window, flag] = this.scroll.getItemWindow(i, 560, 75, 0, 0, 5)
			if (flag == true) {
           		this.initItemWindow(window)
			}
            this.refreshItemWindow(window, v,task)  
        }
	}

	initItemWindow(window){
		let name = window.name
		let width = 550
		let height = 75
		let Info: any = [
               //背景
                { ["index_type"]: gui.Grid9Image, ["name"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 5, ["y"]: 0, ["w"]: width, ["h"]: height, },
				{ ["index_type"]: eui.Label, ["name"]: name + "task_des", ["parent"]: name + "bg", ["title"]: "XXXXXX任务", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]:20, ["y"]: 0, ["w"]: 200, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: name + "state", ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]:240, ["y"]: 0, ["w"]: 100, ["h"]: height, ["messageFlag"]: true },
				]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
		this.mElemList[name+"itemBox"] = UIItemBox.newObj(this.mElemList, name+"itemBox", 480 ,0,this.mElemList[name+"bg"],0.9)
		//this.mElemList[name+"itemBox"].updateByEntry(20001,99)
	}

	refreshItemWindow(window,data,taskInfo){
		let name = window.name
		let prizeItemId = 60063	//威望ID
		let prizeCount = data.prize[0][1]
		this.mElemList[name+"task_des"].text = data.name
		// this.mElemList[name+"task_jindu"].text = taskNum + "/" + data.maxCount

		let taskNum = taskInfo[data.ID] || 0
		let stateText = Localize_cns("SANSHENG_TXT32")
		let color = gui.Color.red
		if(taskNum>=data.maxCount){
			stateText = Localize_cns("SANSHENG_TXT33")
			color = gui.Color.green
		}

		this.mElemList[name+"state"].text = stateText
		this.mElemList[name+"state"].textColor = color

		this.mElemList[name+"itemBox"].updateByEntry(prizeItemId,prizeCount)
	}

	onTabSelected(event: egret.Event) {
		var radioGroup: eui.RadioButtonGroup = event.target;
		let radiobtn = radioGroup.selection;
		this.mTabIndex = radiobtn.value
		this.onRefresh()
	}

	//前往
	onGoApplyClick(){
		this.mParentWnd.tabWndList1.changeTabWithIndex(2)
		// showWithIndex
	}

	//完美出师
	onPrefectClick(){

	}

	//普通出师
	onPutongClick(){

	}

	//大弟子传功按钮
	onWorkClick1(){
		if(this.roleId1 > 0){
			RpcProxy.call("C2G_ChuanGong",this.roleId1)
		}
	}

	//小弟子传功按钮1
	onWorkClick2(){
		if(this.roleId2 > 0){
			RpcProxy.call("C2G_ChuanGong",this.roleId2)
		}
	}

	//强制出师1
	onCoerceClick1(){
		let msg = Localize_cns("SANSHENG_TXT47")
		let roleId = this.roleId1
		var callback: IDialogCallback = {
		onDialogCallback(result: boolean, userData): void {
				if (result) {
                	RpcProxy.call("C2G_ChuShi",roleId,2,100)
				}
	    	}
        }
        MsgSystem.confirmDialog(msg, callback, null)	
	}

	//强制出师2
	onCoerceClick2(){
		let msg = Localize_cns("SANSHENG_TXT47")
		let roleId = this.roleId2
		var callback: IDialogCallback = {
		onDialogCallback(result: boolean, userData): void {
				if (result) {
                	RpcProxy.call("C2G_ChuShi",roleId,2,100)
				}
	    	}
        }
        MsgSystem.confirmDialog(msg, callback, null)
	}

 }

 class MasterWindow3 extends BaseCtrlWnd {
	mElemList;
	scroll : UIScrollList
	nameToIndex : any[]

	public initObj(...params: any[]) {
		
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		let group : eui.Group = this.mElemList["recruit_scroll"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.mElemList["recruit_group"].visible = true;
		RegisterEvent(EventDefine.SHITU_APPLY_LIST, this.onRefresh, this)
		RpcProxy.call("C2G_ShiTuYaoQinList")
		this.onRefresh()
	}

	public onHide(): void {
		this.mElemList["recruit_group"].visible = false;
		UnRegisterEvent(EventDefine.SHITU_APPLY_LIST, this.onRefresh, this)
	}
	
	onRefresh() {
	  	let shituApplyListInfo =  ActivitySystem.getInstance().getShiTuApplyListInfo()
	  	if(shituApplyListInfo == null){
			return
	 	}

		let t = []
		let t1 =  []
		for (let i = 0; i<size_t(shituApplyListInfo); i++) {
			let info = shituApplyListInfo[i]
			if(info.type == 2){
				table_insert(t,info)
			}else{
				table_insert(t1,info)
			}
		}

		table_sort(t1, function(a, b) {return b.time - a.time})

		let list = [] 
		for (let i = 0; i<size_t(t); i++) {
			let info = t[i]
			table_insert(list,info)
		}

		for (let i = 0; i<size_t(t1); i++) {
			let info = t1[i]
			table_insert(list,info)
		}

		let list1 = []
		let id = GetHeroProperty("id")
		for (let i = 0; i<size_t(list); i++) {
			let info = list[i]
			if(info.id != id){
				table_insert(list1,info)
			}
		}

		let list2 = []

		for(let i = 0; i<20; i++) {
			if(list1[i]){
				table_insert(list2,list1[i])
			}
		}
		
	 	let str = ""
	  	this.nameToIndex = []
    	let scroll = this.scroll
		scroll.clearItemList();

        for (let i = 0; i<size_t(list2); i++) {
            let v = list2[i]
            let [window, flag] = this.scroll.getItemWindow(i, 560, 65, 0, 5, 5)
			if (flag == true) {
            	this.initItemWindow(window)
			}
            this.refreshItemWindow(window, v)
        }
    }

	initItemWindow(window){
		let name = window.name
		let width = 550, height = 65

		let Info: any = [
               //背景
			   	//{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height},
                { ["index_type"]: gui.Grid9Image, ["name"]: name+"bg1", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 5, ["y"]: 0, ["w"]: width, ["h"]: height, },
				{ ["index_type"]: eui.Label, ["name"]: name + "name", ["parent"]: name + "bg1", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]:50, ["y"]: 0, ["w"]: 160, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: name + "level", ["parent"]: name + "bg1", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]: 220, ["y"]: 0, ["w"]: 80, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: name + "btn", ["parent"]: name + "bg1", ["title"]: Localize_cns("SANSHENG_TXT17"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 395, ["y"]: 5, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick},

				{ ["index_type"]: gui.Grid9Image, ["name"]: name+"bg2", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 5, ["y"]: 0, ["w"]: width, ["h"]: height, },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "rd", ["parent"]: name + "bg2", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 22, ["w"]: 300, ["h"]: 25, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: name + "ok", ["parent"]: name + "bg2", ["title"]: Localize_cns("SANSHENG_TXT18"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 425-127, ["y"]: 5, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOkClick},
				{ ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "ok", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: name + "no", ["parent"]: name + "bg2", ["title"]: Localize_cns("SANSHENG_TXT19"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt6", ["color"]: gui.Color.white, ["x"]: 425, ["y"]: 5, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onNoClick},
				]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
		this.mElemList[name + "rd"].setAlignFlag(gui.Flag.LEFT)
	}

	refreshItemWindow(window, data){
		let name = window.name
		let type = data.type
		//0 = 正常
		//1 = 邀请别人了
		//2 = 被别人邀请了
		this.mElemList[name+"bg1"].visible = (data.type!=2)
		this.mElemList[name+"name"].visible = (data.type!=2)
		this.mElemList[name+"level"].visible = (data.type!=2)
		this.mElemList[name+"btn"].visible = (data.type!=2)

		this.mElemList[name+"bg2"].visible = (data.type==2)
		this.mElemList[name+"rd"].visible = (data.type==2)
		this.mElemList[name+"ok"].visible = (data.type==2)
		this.mElemList[name+"no"].visible = (data.type==2)

		this.mElemList[name+"btn"].enabled = (data.type!=1)

		this.mElemList[name+"name"].text = data.name
		this.mElemList[name+"level"].text = "Lv."+ data.level

		let rdStr = String.format(Localize_cns("SANSHENG_TXT16"),data.name)
        AddRdContent(this.mElemList[name+"rd"], rdStr, "ht_20_cc", "ublack")

		let info = {"level":data.level,"id":data.id}
		this.nameToIndex[name + "btn"] = info
		this.nameToIndex[name + "ok"] = info
		this.nameToIndex[name + "no"] = info
	}

	onClick(args){
		let name = args.target.name
		if(this.nameToIndex[name] == null){
			return
		}
		let info = this.nameToIndex[name]
		let id = info.id
		let level = info.level
		let myLevel = GetHeroProperty("level") || 0
		if(myLevel<(level+3)){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT15"))
			return
		}

		//60004 判断是否有师徒令
		let itemId = 60004
		let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
		if(ownItemCount<=0){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT20"))
			return
		}
		RpcProxy.call("C2G_ShouTu",id ,level)	
		// C2G_ShouTu":"uint32;uint16",--收徒（师傅触发）, 徒弟的ID,徒弟等级
	}

	//需要在线...
	onOkClick(args){
		let name = args.target.name
		if(this.nameToIndex[name] == null){
			return
		}
		let info = this.nameToIndex[name]
		RpcProxy.call("C2G_DaYingFou",info.id ,1)
	}

	onNoClick(args){
		let name = args.target.name
		if(this.nameToIndex[name] == null){
			return
		}
		let info = this.nameToIndex[name]
		RpcProxy.call("C2G_DaYingFou",info.id ,0)
	}
 }