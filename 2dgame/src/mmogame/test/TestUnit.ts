module test{
	export class TestUnit extends TClass{
		public constructor() {
			super();
		}

		onStart():void{

		}

		onExit():void{

		}
	}


	export class GameTestDelegate extends GameModeDelegate{
		mTestUnit:TestUnit;
		constructor(){
			super();
			this.mTestUnit = this.selectTestUnit();
		}

		//游戏开始
		public onGameStart():void{
			this.mTestUnit.onStart();
		}

		//游戏尝试关闭
		public onGameExit():void{
			this.mTestUnit.onExit();
		}

		public selectTestUnit():TestUnit{
			return new TestUI;
			//return new TestComponent;
			//return new TestEgret;
			// return new TestEnterMap;
		}
	}
}

