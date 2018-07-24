class CommandQueue extends TClass{

    queue:CommandBase[];
    curState:number;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.queue = [];
        this.curState = 0;
    }
    //子类复写 析构函数
    protected destory(): void{
        this.clear();
    }

    start(){
        var newCommand = this.queue[0];
        if(newCommand){
            newCommand.start();
        }
    }


    clear(){
        this.curState = 1;

        do{
            var v = this.queue.pop();
            if(v == null)
                break;
            
            v.finish();
            v.deleteObj();
        }while(this.queue.length != 0);

        this.curState = 0;
    }

    restartCurrentCommand(){
        var command = this.queue[0];
        if(command){
            command.restart()
        }
    }

    pushBack(command:CommandBase){
       command.setOwnerQueue(this);
	
	    this.queue.push(command);
    }


    pushFront(command:CommandBase){
       command.setOwnerQueue(this)
	
	    this.queue.push( command[0]);
    }

    onCommandFinish(command:CommandBase){
         //如果在命令队列执行的过程中，新的命令从队头插入会造成错误
        var v = this.queue[0];
        if(v == null){
            return
        }else if(v != command){
            TLog.Error("CommandQueue.onCommandFinish command is not then current command")
            return
        }
        
        //当前命令出列
        this.queue.shift();
        this.start();
    }

    isEmpty():boolean{
        //命令队列为空（完成）的的条件：
        //1.当前不在队列清空过程；
        //2.如果队列为空；如果队列不为空且只为1，而此时的命令执行完毕。
       var flag = (this.curState == 0);
        var size =this.queue.length;
        if(size == 0){
            
        }else if(size == 1){
            var v = this.queue[0]
            flag = flag && v.isFinish();
        }else{
            flag = false
        }
        
        return flag
    }

}