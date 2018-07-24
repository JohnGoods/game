class WorkUnit extends TClass{
	mWorkQueue:WorkQueue;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
		this.mWorkQueue = null;
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	public onAddToWorkQueue(queue:WorkQueue ){
		this.mWorkQueue = queue;
	}

	//返回true表示完成
	//返回false，则在完成后回调notifyComplete
	public onExcute():boolean{
		return false;
	}

	public notifyExcuteComplete():void{
		this.mWorkQueue.onWorkUnitComplete(this);
	}
}


//资源加载的workQueue，这里的资源加载是无序的
class ResWorkUnit extends WorkUnit{
	mConfigList:{};
	public initObj(...params:any[]):void{

		this.mConfigList ={};
		if(params[0] && params[1] && params[2]){
			this.addRes(params[0], params[1], params[2], params[3]);
		}
    }

	protected destory(): void{
		this.mConfigList = null;
	}


	addRes(path:string, callback:(userData)=>void, thisObj:any, userData?:any):void{
		path = path.replace(/\\/g, "/");
		this.mConfigList[path] = {func:callback, thisObj:thisObj, userData:userData};
	}

	public onExcute():boolean{
		var all = Object.keys(this.mConfigList).length;
		if(all == 0){
			//this.notifyExcuteComplete();
			return true;
		}

		var count = 0;
		var callback:core.ResItemCallback = {
			onResItemLoad:(res:core.ResItem):void=>{
				var info = this.mConfigList[res.getKey()];
				if(info){
					info.func.call(info.thisObj, res.getData(), info.userData);
				}
				count++;

				if(count >= all){
					this.notifyExcuteComplete();
				}
			},
			onResItemError:(key:string):void=>{
				count ++;//表单出错
				if(count >= all){
					this.notifyExcuteComplete();
				}
			}
		}

		for(var k in this.mConfigList){
			var info = this.mConfigList[k];
			IGlobal.resManager.loadResAsyn(k, callback, core.ResourceType.TYPE_TEXT);
		}

		return false;
	}

}

class CallbackWorkUnit extends WorkUnit{
	callback:Function;
	thisObj:any;
	userData:any;
	public initObj(...params:any[]):void{
		this.callback = params[0];
		this.thisObj = params[1];
		this.userData = params[2];
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	public onExcute():boolean{
		this.callback.call(this.thisObj, this.userData);
		return true;
	}
}



class ZipWorkUnit extends WorkUnit implements core.ZipItemCallback {

	path:string;
	bExpand:boolean
		//子类复写 初始化函数
	public initObj(...params:any[]):void{
		this.path = params[0]
		this.bExpand = params[1] == true
	}
	//子类复写 析构函数
	protected destory(): void{
	}

	public onExcute():boolean{

		IGlobal.resManager.addZipPacket(this.path, this, this.bExpand)

		return false;
	}

	onZipItemLoad(key, result:number):void{
		if(result == 0 || GAME_DEBUG){
			this.notifyExcuteComplete();
		}else{
			MsgSystem.confirmDialog_YES(Localize_cns("NET_ERROR2"));
		}
	}
	
}


//================================================================================
interface WorkQueueCallback{
	onBeginWorkQueue(allCount:number);
	onUpdateWorkQueue(unit:WorkUnit, cur:number, all:number);
	onEndWorkQueue();
}	

//================================================================================


class WorkQueue extends TClass{

	mQueue:WorkUnit[];
	mCallback:WorkQueueCallback;
	scheduleEntryID:number;
	step:number; // 一次处理多少个unit

	allCount:number = 0;
	finishCount:number = 0;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.mQueue = [];
		this.mCallback = null;
		this.step = 1;
    }
    //子类复写 析构函数
    protected destory(): void{
        if(this.scheduleEntryID){
			KillTimer(this.scheduleEntryID);
			this.scheduleEntryID = null;
		}
    }


	addWorkUnit(workUnit:WorkUnit, bFirst?:boolean){
		if(bFirst == null)
			bFirst = false;

		workUnit.onAddToWorkQueue(this);
		if(bFirst){
			this.mQueue.unshift(workUnit)
		}else{
			this.mQueue.push(workUnit);
		}

		this.allCount++;
		//this.allCount = this.mQueue.length;
	}

	addWorkUnitFirst(workUnit:WorkUnit){
		this.addWorkUnit(workUnit, true)
	}

	setCallback(callback:WorkQueueCallback){
		this.mCallback = callback;
	}

	clear(){
		this.allCount = 0;
		this.finishCount = 0;
		this.mQueue.length = 0;
	}

	onWorkUnitComplete(workUnit:WorkUnit):void{
		if(this.mCallback ){
			this.finishCount++;
			let cur = this.finishCount;
			// var remain = this.mQueue.length;
			// var cur = this.allCount - remain;
			this.mCallback.onUpdateWorkQueue(workUnit, cur, this.allCount);

			workUnit.deleteObj();
		}

		this.next();
	}


	start(){
		if(this.allCount <= 0){
			TLog.Warn("WorkQueue.start Queue_size == 0");
			if(this.mCallback){
				this.mCallback.onBeginWorkQueue(0);
				this.mCallback.onUpdateWorkQueue(null, 0, 0);
				this.mCallback.onEndWorkQueue();
			}
			return
		}

		if(this.mCallback){
			this.mCallback.onBeginWorkQueue(this.allCount)
		}

		this.next();
	}

	next(){
		var workUnit:WorkUnit = this.mQueue.shift();
		if(workUnit == null){ //完成所有的工作单元
			if(this.mCallback){
				this.mCallback.onEndWorkQueue();
			}
			
			KillTimer(this.scheduleEntryID);
			this.scheduleEntryID = null;
			return;
		}
		
		var bComplete = workUnit.onExcute();
		if(bComplete){
			workUnit.notifyExcuteComplete();
		}
	}




}