
class LoadingPrecedure extends BasePrecedure implements WorkQueueCallback{
	mbLoad:boolean;
	workQueue:WorkQueue;

	//bPreloaded:boolean


	//mImageSetCsv:any;

	public initObj(...params:any[]){
		this.mbLoad = false;
		//this.bPreloaded = false;
		this.workQueue = WorkQueue.newObj();
		this.workQueue.setCallback(this);

		//this.mImageSetCsv = {};
	}

	destory(){
		this.workQueue.deleteObj();
		this.workQueue = null;
		
	}



	public onActive(lastId):void{
		TLog.Debug("LoadingPrecedure.onActive lastId:%d", lastId)
		FireEvent(EventDefine.PRECEDURE_ACTIVE, PrecedureEvent.createObj(this.id))


		if(this.mbLoad == false){
			this.mbLoad = true;
			//this.startPreLoading();
			this.startLoading();
		}
		// var timerId = 0;
		// function testLoad(){
		// 	KillTimer(timerId);

		// 	FireEvent(EventDefine.LOADING_LANCH_RESOURCE_FINISH, null);
		// }
		// timerId = SetTimer(testLoad, this, 100);
	}

	public onDeactive(currentId):void{
		TLog.Debug("LoadingPrecedure.onDeactive currentId:%d", currentId)
		FireEvent(EventDefine.PRECEDURE_DEACTIVE, PrecedureEvent.createObj(this.id))
	}
	
	//预加载imagesetcsv
	// startPreLoading():void{

	// 	fontSetInit();
		
	// 	if(this.bPreloaded == false){
	// 		this.workQueue.clear();	
	// 		this.workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/image_set_list.csv", readCSV, this, this.mImageSetCsv) );
	// 		this.workQueue.start();
	// 	}
	// }

	//--------------------------------------------------------------------------------------------------
	// loadImageSet(workQueue:WorkQueue){
	// 	for(var k in this.mImageSetCsv){
	// 		var v = this.mImageSetCsv[k];
	// 		this.workQueue.addWorkUnit(ImageSetWorkUnit.newObj(v.filename));
	// 	}
	// 	this.mImageSetCsv = null;
	// }

	startLoading(){
		fontSetInit();

		this.workQueue.clear();	
		GameConfig.initCommonCsv(this.workQueue);
		//this.loadImageSet(this.workQueue);
		this.workQueue.start();
	}


	onBeginWorkQueue(allCount:number){

	}

	onUpdateWorkQueue(unit:WorkUnit, cur:number, all:number){
		LoadingUI.setProgress(cur, all)
	}

	onEndWorkQueue(){
		// //预加载一次
		// if(this.bPreloaded == false){
		// 	this.bPreloaded = true;
		// 	this.startLoading()
		// }else{
		// 	//真正加载完成
		// 	FireEvent(EventDefine.LOADING_LANCH_RESOURCE_FINISH, null);
		// }
		FireEvent(EventDefine.LOADING_LANCH_RESOURCE_FINISH, null);
	}


	
}