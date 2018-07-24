/*
作者:
    lintianfeng
	
创建时间：
   2013.10.26(周六)

意图：
	 电影加载地图元素   

公共接口：
   
*/
/*
class Movie_LoadMap extends Movie_Elem{
mapId
mapX
mapY
old_mapId
old_mapX
old_mapY
time
public initObj(...args:any[]):void {
	this.mapId = args[0].map
	this.mapX= args[0].x, this.mapY = args[0].y
	this.old_mapId = MapSystem.getInstance().getMapId() 

	let heroPos = GetHero().getCellXY()
	this.old_mapX = heroPos.x, this.old_mapY = heroPos.y
	this.time = 200
	
}

destory(){
	//let message = GetMessage(opCodes.G2C_MAP_ENTER)
	//message.mapId = this.old_mapId 
	//message.cellx = this.old_mapX
	//message.celly = this.old_mapY
	//GameNetDispatcher.getInstance().onTcpRecv(message)
}

onBegin(){
	if(! GameConfig.MapConfig[this.mapId] ){
		TLog.Warn("the %d map is null!!!!!!!!!!!!!", this.mapId)
		this.finish()
		return
	}
	TLog.Debug("Movie_LoadMap",this.mapId)
	MapSystem.getInstance().loadMovieMap(this.mapId, this.mapX, this.mapY)
	//MapSystem.getInstance().loadMap(this.mapId, this.mapX, this.mapY)
	this.finish() 
}

onTick( delay){	 
}

onFinish( ){

}


}*/