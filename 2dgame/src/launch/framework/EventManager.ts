
var g_EventManager = new core.EventSet();


function GetEventSet():core.EventSet{
	return g_EventManager
}

//once响应监听后会自动注销
function RegisterEventOnce(type:string, listener:Function, thisObject:any) {
	g_EventManager.once(type, listener, thisObject);
}

 function RegisterEvent(type:string, listener:Function, thisObject:any) {
	 g_EventManager.addEventListener(type, listener, thisObject);
}

 function UnRegisterEvent(type:string, listener:Function, thisObject:any) {
	 g_EventManager.removeEventListener(type, listener, thisObject);
}

function FireEvent(type:string, event:core.EventArgs, bubble?:boolean):boolean{
	var evt:egret.Event = event;

	//如果没传时间，则从内存池里取一个
	var tmpEvt = null;
	if(evt == null){
		evt = egret.Event.create(core.EventArgs, type, false, false);
		tmpEvt = evt;
	}
	
	var result =  g_EventManager.fireEvent(type, evt, bubble);

	if(tmpEvt){
		egret.Event.release(tmpEvt);
	}
	return result;
}