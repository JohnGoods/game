

/*

//模版系统
class TemplateSystem extends BaseSystem{
	
	public initObj(...params:any[]):void{
		
	}

	destory(){
		
	}

	prepareResource(workQueue:WorkQueue):void{

	}

	onClear():void{

	}

}

*/




class BaseSystem extends TClass{

	public static  s_systemList:BaseSystem[] = [];

	public initObj(...params:any[]):void{
		RegisterEvent(EventDefine.LOADING_GAME_RESOURCE_PREPARE, this.onPrepareResource, this);

		BaseSystem.s_systemList.push(this);
	}

	destory(){
		UnRegisterEvent(EventDefine.LOADING_GAME_RESOURCE_PREPARE, this.onPrepareResource, this);
	}


	onPrepareResource(args:LoadingEvent){
		this.prepareResource(args.workQueue);
	}

	prepareResource(workQueue:WorkQueue):void{

	}

	onClear():void{

	}


}