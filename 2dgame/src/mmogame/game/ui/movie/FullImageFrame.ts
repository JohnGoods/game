// TypeScript file

//modify:yangguiming
// class FullImageFrame extends BaseWnd{
//     imageName:string;
// 	public initObj(...params:any[]){
		
// 	}

// 	public onLoad():void{
		
// 		this.setFullScreen(true)
		

// 		var elemInfo = [
// 			{ ["index_type"]: eui.Rect, ["name"]: "bg", ["color"]: gui.Color.ublack, ["alpha"]: 1, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null,  },
// 			{ ["index_type"]: eui.Image, ["name"]: "content", ["image"]: "", ["x"]: 0, ["y"]: 0, ["horizontalCenter"]: 0, ["verticalCenter"]: 0 },
// 		];
// 		UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this);
// 	}

// 	public onUnLoad():void{

// 	}

// 	public onShow():void{
// 		this.mLayoutNode.visible = true;
//         this.refreshFrame();
// 	}

// 	public onHide():void{
// 		this.mLayoutNode.visible = false;
// 	}


//     setImageName(imageName){
//         this.imageName = imageName
        
        
//     }

//     refreshFrame(){
//         this.mElemList["content"].source = this.imageName;
//     }


// }