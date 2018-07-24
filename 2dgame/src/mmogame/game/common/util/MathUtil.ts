
function newPos(x, y){
	return {x:x, y:y};
}

class MathUtil {

	public static isFloat(n:number):boolean{
		return (n - Math.floor(n)) != 0
	}
	
	public static checkNormScope(testx, testy, centerx, centery, scope){
		var distance = Math.pow(testx - centerx, 2) + Math.pow(testy - centery,2)

		return distance <= (scope * scope)
	}

	public static checkScope(testx, testy, centerx, centery, scope):boolean{
		return (testx >= centerx -scope) && (testx <= centerx +scope) &&
		(testy >= centery - scope) && (testy <= centery + scope)
	}

	
	public static getRandomArray(count, summation, rate):number[]{
		var average = Math.floor(summation / count)
		var err = Math.abs(Math.floor(average * rate))
		//math.randomseed(GetServerTime())
		var sum = 0
		
		var list = []
		//for i = 1, count - 1 do
		for(var i = 0; i < count - 1; i++){
			//var num = math.random(-1 * err, err)
			//var num = (Math.random()*2-1) *err;
			var num = MathUtil.random(-1*err, err);
			num = average + num
			
			if(sum + num > summation){
				sum = summation
				num = summation - sum
			}else{
				sum = sum + num
			}
			list.push(num)
		}
		
		var remain = summation - sum
		remain = remain > 0 && remain || 0
		list.push(remain)
		return list
	}


	public static random(val1?:number, val2?:number){

		var rval = Math.random()

		if(val1 !=null && val2 != null){
			rval = Math.ceil(val1 + (val2-val1) * rval)
		}else if(val1){
			rval = Math.ceil(rval * val1)
		}

		return rval;
	}




	public static clamp(value, min, max){
		if(value < min){
			value = min;
		}else if(value > max){
			value = max;
		}
		return value
	}


	public static radToDegree(rad:number):number{
		return rad/Math.PI * 180
	}

	public static degreeToRad(degree:number):number{
		return degree / 180 * Math.PI;
	}

	public static cos(degree:number):number{
		return Math.cos(this.degreeToRad(degree));
	}

	public static sin(degree:number):number{
		return Math.sin(this.degreeToRad(degree));
	}

	//==============向量计算=======================

	public static pAdd(pt1,pt2){
		 return {x : pt1.x + pt2.x , y : pt1.y + pt2.y }
	}

	public static pSub(pt1,pt2){
		 return {x : pt1.x - pt2.x , y : pt1.y - pt2.y }
	}


	public static pGetDistance(startP,endP){
		return this.pGetLength(this.pSub(startP,endP))
	}

	public static pGetLength(pt:{x:any, y:any}):number{
		return Math.sqrt( pt.x * pt.x + pt.y * pt.y )
	}

	public static pNormalize(pt:{x:any, y:any}):{x:any, y:any}{
		var length = this.pGetLength(pt)
		if(0 == length){
			return newPos(1.0, 0.0);
		}
		return newPos(pt.x / length, pt.y / length)
	}

	//叉乘
	public static pCross(self, other):number{
		return self.x * other.y - self.y * other.x
	}
	//点积
	public static pDot(self, other):number{
		return self.x * other.x + self.y * other.y
	}

	//求需要旋转的角度
	public static pGetAngle(self, other):number{
		var a2 = this.pNormalize(self)
		var b2 = this.pNormalize(other)
		var rad = Math.atan2(this.pCross(a2, b2), this.pDot(a2, b2) )
		
		if(Math.abs(rad) < 1.192092896e-7){
			return 0.0
		}
		return this.radToDegree(rad)
	}

	//求夹角
	public static pToAngleSelf(self){
		return this.radToDegree(Math.atan2(self.y, self.x)) 
	}


	//贝塞尔曲线
	//p0开始点 ， p3终点
	//p1,p2是控制点
	//count是生成多少个点，至少两个
	public static bezier(p0, p1, p2, p3, count){
		TLog.Assert(count >= 2)
	
		var list = []
		
		//for i = 0, count - 1 do
		for(var i = 0; i< count ;i++){
			var t = i / (count-1)
			
			var cx = 3* (p1.x-p0.x)
			var bx = 3*(p2.x-p1.x) - cx
			var ax = p3.x - p0.x - cx - bx
			
			var cy = 3* (p1.y-p0.y)
			var by = 3*(p2.y-p1.y) - cy
			var ay = p3.y - p0.y - cy - by

			var t2 = t*t;
			var t3 = t2*t;
			
			var x = ax *t3 + bx*t2 + cx*t + p0.x
			var y = ay *t3 + by*t2 + cy*t + p0.y

			list.push(newPos(x, y));
		}
		
		return list
	}

	//求轴对称点（关于任意角度的直线）
	public static fliplr(angle, x0, y0, x1, y1){
		let x2 = Math.sin(2*angle) * (y1 - y0) + 2 * (Math.sin(angle))^2 * x0 + Math.cos(2*angle) * x1;
		let y2 = -2 * (Math.cos(angle))^2 * (y1 - y0) - Math.sin(2*angle) * x0 + y1 + Math.sin(2*angle) * x1;
		return newPos(x2, y2);
	}

	///一些公式


	public static easeOutCubic(t, b, c, d){
		t = t / d - 1
		return c * (t * t * t + 1) + b
	}

	public static easeOutQuad(t, b, c, d){
		t = t / d
		return -c * t * (t - 2) + b
	}
	
	public static easeInElastic( t, b, c, d){
		let s = 1.70158
		let p = 0
		let a = c
		if(t == 0 ){
			return b
		}
		
		t = t / d
		if(t == 1 ){
			return b + c
		}
		
		p = d * 0.35
		if(a < Math.abs(c) ){
			a = c
			s = p / 4
		}else{
			s = p / (2 * Math.PI) * Math.asin (c / a)
		}
		t = t - 1
		return -(a * Math.pow(2, 10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
	}
}