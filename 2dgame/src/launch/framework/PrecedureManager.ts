
class BasePrecedure extends TClass{
	eventHandle = {};
	id:number = -1;

	protected destory(){

	}

	public registerEventHandle(name:string, funcRef:Function, objRef:any):void{
		this.eventHandle[name] = [funcRef, objRef];
	}

	public unregisterEventHandle(name:string):void{
		delete this.eventHandle[name];
	}

	public onActive(lastId):void{

	}

	public onDeactive(currentId):void{
		
	}

	public setPrecedureId(id):void{
		this.id = id;
	}

	public getPrecedureId(){
		return this.id
	}

	public onEvent(eventName:string, args:any){
		var handler = this.eventHandle[eventName];
		if(handler){
			var funcRef:Function = handler[0];
			var objRef:any = handler[1];
			funcRef.call(objRef, args);
		}
	}
		
}


class PrecedureManager extends TClass{
	mPrecedureList = [];
	mCurrentPrecedure = null;
	mPrevPrecedure = null;

	constructor(){
		super();
	}

	protected destory(){
		this.clear();
	}

	public clear(){
		if(this.mCurrentPrecedure){
			var lastId = this.mCurrentPrecedure.getPrecedureId();
			this.mCurrentPrecedure.onDeactive(-1);
			this.mCurrentPrecedure = null;
		}

		for(var k in this.mPrecedureList){
			var v:BasePrecedure = this.mPrecedureList[k] 
			v.deleteObj()
		}
		this.mPrecedureList = [];
	}


	public registerPrecedure(id:number, precedure:BasePrecedure){
		precedure.setPrecedureId(id)
		this.mPrecedureList.push(precedure);
	}
	

	public unRegisterPrecedure(precedure:BasePrecedure){
		this.mPrecedureList.forEach((v, k)=>{
			if(v == precedure){
				this.mPrecedureList.splice(k, 1);
				return true;
			}
		});
	}

	public getCurrentPrecedureId():number{
		if(this.mCurrentPrecedure){
			return this.mCurrentPrecedure.getPrecedureId();
		}
		return -1;
	}
	
	

	public changePrecedure(id){
		if(this.getCurrentPrecedureId() == id){
			return;
		}

		for(var k = 0; k < this.mPrecedureList.length; k++){
			var v = this.mPrecedureList[k];
			if(id == v.getPrecedureId()){
				this.mPrevPrecedure = this.mCurrentPrecedure
				var lastId = -1
				if(this.mCurrentPrecedure) {
					lastId = this.mCurrentPrecedure.getPrecedureId();
					this.mCurrentPrecedure.onDeactive(id);
				}
					
				this.mCurrentPrecedure = v;
				this.mCurrentPrecedure.onActive(lastId);
				break;
			}
		}
	}



	public onEvent(eventname, args){
		if(this.mCurrentPrecedure == null ){
			TLog.Error("PrecedureManager.onEvent %s  self.mCurrentPrecedure == nil", eventname);
		}

		if(this.mCurrentPrecedure){
			this.mCurrentPrecedure.onEvent(eventname, args)
		}

	}
}
