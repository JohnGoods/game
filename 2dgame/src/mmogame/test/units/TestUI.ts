module test {
	export class TestUI extends TestUnit {

		onStart(): void {

			WngMrg.getInstance().setShowStateWindow(false);
			RegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onGameLoadComplete, this);
			PrecedureManager.getInstance().changePrecedure(PRECEDURE_GAME);

		}

		onExit(): void {

		}



		onGameLoadComplete(event: PrecedureEvent) {
			if (event.state != PRECEDURE_GAME)
				return;
			// let wnd = WngMrg.getInstance().getWindow("FuncPreviewFrame");
			// wnd.showFuncPreviewFrame("zuoqi")
			// this.testRpc()

			WngMrg.getInstance().showWindow("MiLuFrame");

			// let wnd = WngMrg.getInstance().getWindow("PrizeShowFrame")
			// wnd.showWithPrizeList([[30004, 1, 0]])
			// let wnd = WngMrg.getInstance().getWindow("ActorShowFrame")
			// wnd.showGainPartner(18000)

			// let wnd = WngMrg.getInstance().getWindow("LoginFrame");
			// wnd.showLoadingWithMsg(Localize_cns("LOGIN_ADD_MEMERY_CONTENT"))

			//WngMrg.getInstance().showWindow("PlayerListFrame");

			// let cbObj: IIconMsgCallBack = {
			// 	onIconMsgCallBack(id: number, userData): boolean {
			// 		// let t: IDialogCallback = {
			// 		// 	onDialogCallback(result: boolean, userData): void {
			// 		// 		if (result) {
			// 		// 			WngMrg.getInstance().showWindow("MailListFrame")
			// 		// 		}
			// 		// 		MailSystem.getInstance().removeAllIconMsgInfo()
			// 		// 	}
			// 		// }

			// 		// let infoStr = Localize_cns("EMAIL_EXIST_NO_READ")
			// 		// MsgSystem.confirmDialog(infoStr, t, userData)

			// 		//return true;

			// 		return true;
			// 	}
			// }
			// let info = IconMsgType.EMAIL_LIST;

			// MsgSystem.addIconMsg(cbObj, info, IconMsgType.EMAIL_LIST)

			// info = IconMsgType.FRIEND_CHAT
			// MsgSystem.addIconMsg(cbObj, info, IconMsgType.FRIEND_CHAT)
			// MsgSystem.addIconMsg(cbObj, info, IconMsgType.FRIEND_CHAT)
			// MsgSystem.addIconMsg(cbObj, info, IconMsgType.FRIEND_CHAT)
			// MsgSystem.addIconMsg(cbObj, info, IconMsgType.FRIEND_CHAT)
			// MsgSystem.addIconMsg(cbObj, info, IconMsgType.FRIEND_CHAT)

			//MailSystem.getInstance().addIconMsgInfo(info)

			//FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.newObj(true, Localize_cns("LOGIN_GET_ACCOUNT_INFO"),true))
			// let args:any = {}
			// args.skillId = 22001
			// args.entryId = 18020

			// let wnd = WngMrg.getInstance().getWindow("FightAttackFrame")
			// wnd.onShowSkill(args)
			//MsgSystem.showScreenEffect(effectIndex.FightStart);

			// let recordList = []
			// for(let i = 1; i <=10; i++){
			// 	let data:any = {}
			// 	data.funds = 100 + i
			// 	data.plrExp = 100 + i
			// 	data.petExp = 100 + i
			// 	data.itemList = {["20001"]:2, ["20002"]:5}
			// 	data.time = GetOSTime()
			// 	recordList.push(data)
			// }

			// let wnd = WngMrg.getInstance().getWindow("RobberRecordFrame")
			// wnd.recordList = recordList
			// wnd.showWnd();
			//WngMrg.getInstance().showWindow("FightFrame");

			// let wnd = WngMrg.getInstance().getWindow("QuickGainUpgradeFrame");
			// let itemConfig = [null, ["CampaignFrame"]]
     		// wnd.showQuickGainFrame(itemConfig)
		}


		testXXTEA(){
			var encrypt_buf = new Uint8Array([1,2]);
			let key1: Uint8Array = new Uint8Array(17);
			key1[16] = 0;
			let a = 13;
			let mod = 64;
			let seed = 11;
			for (let i = 0; i < 16; ++i) {
				key1[i] = seed + 33;
				seed = (seed * a) % mod;
			}
			let temp_encrypt:Uint8Array = core.xxteaEncrypt(encrypt_buf, encrypt_buf.length, key1);//this.m_encryptKey);



			let key2: Uint8Array = new Uint8Array(17);
			key2[16] = 0;
			// let a = 13;
			// let mod = 64;
			//let seed = this.m_decryptSeed;
			for (let i = 0; i < 16; ++i) {
				key2[i] = seed + 33;
				seed = (seed * a) % mod;
			}
			let temp_decrypt = core.xxteaDecrypt(temp_encrypt, temp_encrypt.length, key2);//this.m_decryptKey);
		}


		testRpc(){
			//let stream = RpcProxy.callForStream("test1", true, 1,2,3)
			//let stream = RpcProxy.callForStream("test2", {name:"aa", id:122}, "ccc",2.1,3.411, 6)
			//let stream = RpcProxy.callForStream("test3", [1,2,3,4,5,6], 100, false, [{name:"a1", id:121}, {name:"a2", id:122}, {name:"a3", id:123}])
			let stream = RpcProxy.callForStream("test4", [1,2,3,4,5,6], 100, false, [{name:"a1", id:121, friends:[]}, {name:"a2", id:122, friends:[{name:"f1", id:221,}, {name:"f2", id:221,}]}, {name:"a3", id:123, friends:[]}])

			stream.position = 0;
			var code = stream.readUnsignedShort();
			RpcProxy.unpackMessage(stream)
		}

	}

}
