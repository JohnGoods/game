// TypeScript file


module GameConfig{

	 //通用表单
    
    export var CnsConfig:any = {};
    export var NetMsgConfig:any = {};
    export var HyperLinkConfig = {};
   

	export var xmlKeyWordConfig:any = {};
	export var nameConfig:any = {};
	export var ImageSetListConfig:any = {};




	export class ImageSetWorkUnit extends WorkUnit implements gui.ImageSetLoadCallback{

		path:string;

		//子类复写 初始化函数
		public initObj(...params:any[]):void{
			this.path = params[0];
		}
		//子类复写 析构函数
		protected destory(): void{
			
		}

		public onExcute():boolean{

			IGlobal.imageSet.loadImageSet(this.path, this);

			return false;
		}

		onImageSetLoad(name:string){
			this.notifyExcuteComplete();
		}
	}


    
    // export function LoadCsv(data:string, csv_config:any): void{
    //     //TLog.Assert(GameConfig[varName] !== undefined, "GameConfig[%s] not define", varName);
    //     //GameConfig[varName] = readCSV(data);
    //     TLog.Assert(csv_config != null, "LoadCsv");
    //     readCSV(data, csv_config);
    // }

    ////////////////////////////////////////////////////////////////////////////////////////////

   

    

    // function initCns(data:any){
	// 	GameConfig.loadCsvData(data, "CnsConfig");
	// }

	function _initNetMsg(data:any){
		var tmpConfig = readCSV(data);

		for(var k in tmpConfig){
			var v = tmpConfig[k];
			if(v.key != null && v.show != null && v.msg != null && v.transform != null){

				var info = {["show"] : v.show, ["msg"] : v.msg, ["transform"] : v.transform, ["count"] : v.count || 0, ["priority"] : v.priority || 0};

                var code = resultCode[v.key];
                if(code != null){
                    //以字符串作索引，例如C2G_Move
                    NetMsgConfig[code.toString()] = info
                    
                    //以Id作索引，如C2G_Move==1000,就以1000做key
                    NetMsgConfig[v.key] = info;
                }
				
			}
		}

	}

	function _initLoginImageSetList(data:any, workQueue:WorkQueue){
		ImageSetListConfig = readCSV(data);
		for(var k in ImageSetListConfig){
			var v = ImageSetListConfig[k];
			if(v.type == "login"){
				workQueue.addWorkUnit(ImageSetWorkUnit.newObj(v.filename));
			}
		}
	}

	function _initImageSet(data:any){
		var imageset = readCSV(data);


		let area_info:gui.ImageInfo = gui.ImageInfo.newObj();
		for(var k in imageset){
			var v = imageset[k];

			if( v.refname != ""){

				let image_info = IGlobal.imageSet.getImageInfo(v.refname)
				if(image_info == null){
					TLog.Error("name:%s refname:%s is null", v.name, v.refname)
				}else{
					area_info.x = image_info.x
					area_info.y = image_info.y
					area_info.w = image_info.w
					area_info.h = image_info.h
					IGlobal.imageSet.insertInfo(v.name, image_info.fileName, area_info)
				}

			}else{
				area_info.x = v.x
				area_info.y = v.y
				area_info.w = v.w
				area_info.h = v.h
				IGlobal.imageSet.insertInfo(v.name, v.filename, area_info)
			}
		}


	}


	function _initAnimSet(data:any){
		let AnimSetCsvTable = readCSV(data)
		for(let k in AnimSetCsvTable){
			let v = AnimSetCsvTable[k]
			IGlobal.animSet.insertInfo(k, v.w, v.h, v.count, v.interval)
		}
	}


	function _initFilterWords(data:any){

		let config = readCSV(data)

		let result_list = []
		for(let k in config){
			let v = config[k]
			result_list.push(v.content)
		}
		WordFilter.initFilterList(result_list);

	}

	function _initForbidName(data:any){
		let config = readCSV(data)

		let result_list = []
		for(let k in config){
			let v = config[k]
			result_list.push(v.content)
		}
		WordFilter.initForbidName(result_list);

	}


	function _initRpcProtocol(data:any){
		let jsonData = JsUtil.JsonDecode(data)
		RpcProxy.initProxy(jsonData)
		initRpcObjectField()
	}


    export function initCommonCsv(workQueue:WorkQueue){
       

       workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/Cns/cns.csv", readCSV, this, CnsConfig) );
       workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/Cns/net_msg.csv", _initNetMsg, this, NetMsgConfig) );
	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/Cns/hyperLink.csv", readCSV, this, HyperLinkConfig));

       
	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/xml_keyword.csv", readCSV, this, xmlKeyWordConfig) );

	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/image_set.csv", _initImageSet, this) );
	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/image_set_list.csv", _initLoginImageSetList, this, workQueue) );


	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/ui_anim.csv", _initAnimSet, this, workQueue) );


	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/name.csv", readCSV, this, nameConfig) );
	   

	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/Badwords/FilterWords.csv", _initFilterWords, this) );
	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/Badwords/ForbidName.csv", _initForbidName, this) );

	   workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/protocol/RPCProtocol.json", _initRpcProtocol, this) );
	          
    }
    


}