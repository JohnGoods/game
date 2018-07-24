/*
作者:
    lintianfeng
	
创建时间：
   2013.10.26(周六)

意图：
	 表演元素的基类   

公共接口：
   isFinish(){
	 tick( delay){
	 begin(){
	 finish(){
	
	 //子类继承
	 onBegin(){
	 onTick( dalay){
	 onFinish(){
*/
/*
class Movie_Elem extends TClass {
    bFinish: boolean;
    bBegin: boolean;
    show_time: number;
    show_max_time: number;
    public initObj(...args: any[]): void {
        this.bFinish = false
        this.bBegin = false
        this.show_time = 0
        // 最大播放时间,超过直接显示完成
        this.show_max_time = args[0].showTime || 10000
    }

    destory() {

    }

    isFinish() {
        return this.bFinish
    }

    tick(delay) {
        if (this.isFinish()) {
            return true
        }
        this.show_time = this.show_time + delay
        if (this.show_max_time == -1) {
            this.onTick(delay)
        } else {
            if (this.show_time < this.show_max_time) {
                this.onTick(delay)
            } else {
                this.finish()
            }
        }
    }

    begin() {
        this.bBegin = true
        this.onBegin()
    }

    finish() {
        if (this.bFinish == true ||
            this.bBegin == false) {

            return
        }
        this.bFinish = true
        this.onFinish()
    }

    // 子类继承
    onBegin() {

    }

    onTick(dalay) {
        this.finish()
    }

    onFinish() {

    }

}*/