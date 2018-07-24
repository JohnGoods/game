module tool{
	export class ToolUnit extends TClass{
		public constructor() {
			super();
		}

		onStart():void{

		}

		onExit():void{

		}
	}


	export class GameToolDelegate extends GameModeDelegate{
		mTestUnit:ToolUnit;
		constructor(){
			super();
			this.mTestUnit = this.selectToolUnit();
		}

		//游戏开始
		public onGameStart():void{
			this.mTestUnit.onStart();
		}

		//游戏尝试关闭
		public onGameExit():void{
			this.mTestUnit.onExit();
		}

		public selectToolUnit():ToolUnit{

			 var tool_mode = IGlobal.config.getNumber("tool", 1);

			 if(tool_mode == 1){
				 return new FightEditor;
			 }else if(tool_mode == 2){
				 return new ToolColor;
			 }
			 

			//return new TestUI;
			//return new TestEgret;
			//return new TestEnterMap;
		}
	}
	
}

