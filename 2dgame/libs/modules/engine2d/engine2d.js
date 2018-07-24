var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
// TypeScript file
//类似多继承，整合多个class的方法到目标class中，但是只有一个super
var core;
(function (core) {
    //target:目标类
    //template:多继承父类
    function MixinClasses(target, template) {
        for (var property in template) {
            if (property != "prototype" && template.hasOwnProperty(property)) {
                target[property] = template[property];
            }
        }
        var prototype = target.prototype;
        var protoBase = template.prototype;
        var keys = Object.keys(protoBase);
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (!prototype.hasOwnProperty(key) || isEmptyFunction(prototype, key)) {
                var value = Object.getOwnPropertyDescriptor(protoBase, key);
                Object.defineProperty(prototype, key, value);
            }
        }
    }
    core.MixinClasses = MixinClasses;
    function isEmptyFunction(prototype, key) {
        if (typeof prototype[key] != "function") {
            return false;
        }
        var body = prototype[key].toString();
        var index = body.indexOf("{");
        var lastIndex = body.lastIndexOf("}");
        body = body.substring(index + 1, lastIndex);
        return body.trim() == "";
    }
})(core || (core = {}));
// TypeScript file
/*
作者:
    yangguiming
    
创建时间：
   2016.12.24(周六)

意图：
   1.获得classname
   2.获得单例
   3.通过newObject和deleteObj，由缓存创建，减少重复创建带来的性能消耗
   4.引用计数
   5.createObj和newObj区别是，createObj会下一帧自动销毁

   6.mixin的类，都要调用_initclass_

公共接口：
    ------------------------------------------------
    --TClass接口
    public static getInstance() :any
    public static destoryInstance():void
    public static createObj(...params:any[]):any
    public static newObj(...params:any[]):any
    public  deleteObj():void

    public retain()
    public release():void
    public autorelease():void

    必须继承
    public initObj(...params:any[]):void
    public  destory():void
    
*/
//reference指令已废弃，现在ts按照引用自动识别。但是部分识别不了，需要手动调用importType(type)显示引用
//例如objectField是any类型，objectField.UNIT_FIELD_LEVEL = objectField.UNIT_BASE_BEGIN + 0
//另外一个文件引用objectField.UNIT_FIELD_LEVEL，会识别不了objectField，无法自动加入引用
//注意:只是针对静态编译才会这样。如果非静态函数的调用，类型早已编译完了。
function ImportType(any) {
}
function CastType(val) {
    return (val);
}
function _createTClass_() {
    var ptype = this.prototype;
    // var clazz = egret.getDefinitionByName(ptype.__class__);
    var clazz = this;
    var obj = new clazz();
    obj.classname = ptype.__class__;
    obj._initclass_();
    return obj;
}
function _createTObject_() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var obj = _createTClass_.call(this);
    //obj.initObj(...params);
    //从父类到子类初始化
    var initOrderList = [];
    var d = obj;
    while (d != null) {
        if (d.hasOwnProperty("initObj"))
            initOrderList.push(d);
        d = Object.getPrototypeOf(d);
    }
    initOrderList = initOrderList.reverse();
    initOrderList.forEach(function (value) {
        (_a = value.initObj).call.apply(_a, [obj].concat(params));
        var _a;
    });
    return obj;
}
var TClass = (function (_super) {
    __extends(TClass, _super);
    function TClass() {
        return _super.call(this) || this;
    }
    //初始化函数写这里，因为mixin之后，template类的构造函数不会被调用
    TClass.prototype._initclass_ = function () {
        this.mReferenceCount = 1;
        //this.$hashCode = this.hashCode();
    };
    //子类复写 初始化函数
    TClass.prototype.initObj = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
    };
    //子类复写 析构函数
    TClass.prototype.destory = function () {
    };
    TClass.getInstance = function () {
        if (this._instance == undefined) {
            this._instance = _createTObject_.call(this);
        }
        return this._instance;
    };
    TClass.destoryInstance = function () {
        if (this._instance != undefined) {
            this._instance.deleteObj();
            this._instance = undefined;
        }
    };
    //autorelease,下一帧自动销毁
    TClass.createObj = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var obj = _createTObject_.call.apply(_createTObject_, [this].concat(params));
        obj.autorelease();
        return obj;
    };
    TClass.newObj = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return _createTObject_.call.apply(_createTObject_, [this].concat(params));
    };
    TClass.prototype.deleteObj = function () {
        this.mReferenceCount = 0;
        var d = this;
        while (d != null) {
            if (d.hasOwnProperty("destory")) {
                //d.destory();
                d.destory.call(this);
            }
            d = Object.getPrototypeOf(d);
        }
    };
    TClass.prototype.retain = function () {
        TLog.Assert(this.mReferenceCount >= 0, "this.mReferenceCount >= 0");
        this.mReferenceCount++;
    };
    TClass.prototype.release = function () {
        TLog.Assert(this.mReferenceCount >= 0, "this.mReferenceCount >= 0");
        this.mReferenceCount--;
        if (this.mReferenceCount == 0) {
            this.deleteObj();
        }
    };
    TClass.prototype.releaseLater = function () {
        core.AutoreleasePool.getInstance().addObject(this);
    };
    TClass.prototype.getReferenceCount = function () {
        return this.mReferenceCount;
    };
    TClass.prototype.autorelease = function () {
        core.AutoreleasePool.getInstance().addObject(this);
    };
    TClass.prototype.getProperty = function (name) {
        if (name in this) {
            return this[name];
        }
        return null;
    };
    return TClass;
}(egret.HashObject));
__reflect(TClass.prototype, "TClass");
/// <reference path="TClass.ts" />
/// <reference path="MixinClasses.ts" />
var core;
(function (core) {
    var EventArgs = (function (_super) {
        __extends(EventArgs, _super);
        function EventArgs() {
            var _this = _super.call(this, "", false, false) || this;
            _this._initclass_();
            _this.handle = 0;
            return _this;
        }
        EventArgs.prototype._initclass_ = function () { };
        // public static getInstance() :any {}
        // public static destoryInstance():void{}
        EventArgs.createObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        EventArgs.newObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        EventArgs.prototype.deleteObj = function () { };
        EventArgs.prototype.retain = function () { };
        EventArgs.prototype.release = function () { };
        EventArgs.prototype.autorelease = function () { };
        EventArgs.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        EventArgs.prototype.destory = function () { };
        return EventArgs;
    }(egret.Event));
    core.EventArgs = EventArgs;
    __reflect(EventArgs.prototype, "core.EventArgs");
    var EventSet = (function (_super) {
        __extends(EventSet, _super);
        function EventSet() {
            var _this = _super.call(this) || this;
            //this.mReferenceCount = 1;
            _this.mCurrentEventName = "";
            _this._initclass_();
            return _this;
        }
        EventSet.prototype._initclass_ = function () { };
        EventSet.getInstance = function () { };
        EventSet.destoryInstance = function () { };
        EventSet.createObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        EventSet.newObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        EventSet.prototype.deleteObj = function () { };
        EventSet.prototype.retain = function () { };
        EventSet.prototype.release = function () { };
        EventSet.prototype.releaseLater = function () { };
        EventSet.prototype.autorelease = function () { };
        EventSet.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        EventSet.prototype.destory = function () { };
        //@复写注册事件，如果已经存在会报错
        EventSet.prototype.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
            var eventMap = this.$getEventMap(useCapture);
            var list = eventMap[type];
            if (list) {
                if (!TLog.Assert(this.isEventExsit(list, listener, thisObject), "EventSet registerEvent %s exsit...", type)) {
                    return;
                }
            }
            _super.prototype.$addListener.call(this, type, listener, thisObject, useCapture, priority, dispatchOnce);
        };
        EventSet.prototype.fireEvent = function (eventName, event, bubble) {
            var lastEventName = this.mCurrentEventName;
            this.mCurrentEventName = eventName;
            event.$type = eventName;
            event.$bubbles = !!bubble;
            var ret = _super.prototype.dispatchEvent.call(this, event);
            this.mCurrentEventName = lastEventName;
            return ret;
        };
        EventSet.prototype.dispatchEvent = function (event) {
            throw new Error("dispatch not support");
            //return false;
        };
        EventSet.prototype.isEventExsit = function (list, listener, thisObject) {
            for (var i = 0; i < list.length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return false;
                }
            }
            return true;
        };
        EventSet.prototype.clearEvent = function () {
            this.$EventDispatcher = {
                //0: target ? target : this,
                1: {},
                2: {},
                3: 0
            };
            this.mCurrentEventName = "";
        };
        EventSet.prototype.getCurrentEventName = function () {
            return this.mCurrentEventName;
        };
        return EventSet;
    }(egret.EventDispatcher));
    core.EventSet = EventSet;
    __reflect(EventSet.prototype, "core.EventSet");
    core.MixinClasses(EventArgs, TClass);
    core.MixinClasses(EventSet, TClass);
})(core || (core = {}));
var map;
(function (map) {
    var SpriteBase = (function (_super) {
        __extends(SpriteBase, _super);
        function SpriteBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteBase.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mbInView = false;
            this.mParentLayer = null;
            this.mNodeIndex = 0;
            this.mOriginalParent = null;
        };
        SpriteBase.prototype.destory = function () {
            var node = this.getDisplayNode();
            if (node.parent)
                node.parent.removeChild(node);
        };
        SpriteBase.prototype.setInCameraView = function (cam, bInView) {
            if (bInView != this.mbInView) {
                this.mbInView = bInView;
                if (bInView) {
                    this.onCameraFound();
                }
                else {
                    this.onCameraLost();
                }
            }
        };
        SpriteBase.prototype.onUpdate = function (cam) {
            if (cam) {
                //TLog.Assert(this.mParentLayer != null);
                var bInView = this.isInCameraView(cam);
                this.setInCameraView(cam, bInView);
            }
            else {
                this.setInCameraView(cam, true);
            }
        };
        SpriteBase.prototype.isInCameraView = function (cam) {
            var boundRect = this.getBoundRect();
            var viewRect = cam.getViewRect();
            var bInView = viewRect.intersects(boundRect);
            // if(bInView == false){
            // 	TLog.Debug("ccccccccccccc");
            // }
            return bInView;
        };
        // public getBoundRect() : egret.Rectangle{
        // 	var node = this.getDisplayNode();
        // 	//node.getTransformedBounds(this.mParentLayer.getDisplayNode(), this.mTempRect);
        // 	this.mTempRect.copyFrom(node.$getOriginalBounds());
        // 	if(this.mTempRect.isEmpty()){
        // 		this.mTempRect.setTo(node.x, node.y, 1, 1);
        // 	}else{
        // 		this.mTempRect.x = node.x - this.mTempRect.width/2;
        // 		this.mTempRect.y = node.y - this.mTempRect.height;
        // 	}
        // 	return this.mTempRect;
        // }
        SpriteBase.prototype.isClip = function () {
            //return !this.mbInView || !this.getDisplayNode().visible;
            return !this.mbInView;
        };
        //显示sprite
        SpriteBase.prototype.onCameraFound = function () {
            if (this.mParentLayer == null)
                return;
            var node = this.getDisplayNode();
            //TLog.Assert(node.parent == null, "node.parent == null");
            if (node.parent == null) {
                this.mParentLayer.getDisplayNode().addChildAt(node, this.mNodeIndex);
            }
        };
        //隐藏sprite
        SpriteBase.prototype.onCameraLost = function () {
            if (this.mParentLayer == null)
                return;
            var node = this.getDisplayNode();
            //TLog.Assert(node.parent != null, "node.parent == null");
            var mapLayerNode = this.mParentLayer.getDisplayNode();
            if (node.parent == mapLayerNode) {
                this.mNodeIndex = mapLayerNode.getChildIndex(node);
                mapLayerNode.removeChild(node);
            }
        };
        SpriteBase.prototype.setVisible = function (visible) {
            var node = this.getDisplayNode();
            if (node.visible != visible) {
                if (this.mOriginalParent == null) {
                    this.mOriginalParent = node.parent;
                }
                if (!visible) {
                    this.mOriginalParent = node.parent;
                    if (node.parent) {
                        node.parent.removeChild(node);
                    }
                }
                else {
                    if (this.mOriginalParent) {
                        this.mOriginalParent.addChild(node);
                    }
                    else if (this.mParentLayer) {
                        this.mParentLayer.getDisplayNode().addChild(node);
                    }
                }
            }
            node.visible = visible;
        };
        SpriteBase.prototype.setVisibleRaw = function (visible) {
            var node = this.getDisplayNode();
            node.visible = visible;
        };
        SpriteBase.prototype.isVisible = function () {
            return this.getDisplayNode().visible;
        };
        SpriteBase.prototype.onEnterMap = function (layer) {
            TLog.Assert(this.mParentLayer == null, "onEnterMap");
            this.mParentLayer = layer;
            this.mbInView = false;
            this.mOriginalParent = null;
        };
        SpriteBase.prototype.onLeaveMap = function (layer) {
            TLog.Assert(this.mParentLayer != null, "onLeaveMap");
            if (this.mParentLayer != null && this.mParentLayer != layer) {
                return;
            }
            if (this.mbInView) {
                this.mbInView = false;
                this.onCameraLost();
            }
            this.mParentLayer = null;
            this.mOriginalParent = null;
        };
        SpriteBase.prototype.isEnterMap = function () {
            return this.mParentLayer != null;
        };
        SpriteBase.prototype.getLayer = function () {
            return this.mParentLayer;
        };
        SpriteBase.prototype.setPosition = function (x, y) {
            TLog.Assert(x != null && y != null && !isNaN(x) && !isNaN(y));
            var node = this.getDisplayNode();
            node.x = x;
            node.y = y;
        };
        SpriteBase.prototype.getPositionX = function () {
            var node = this.getDisplayNode();
            return node.x;
        };
        SpriteBase.prototype.getPositionY = function () {
            var node = this.getDisplayNode();
            return node.y;
        };
        SpriteBase.prototype.setPositionCellXY = function (cellx, celly) {
            var x = map.LogicBlock.getXFromCell(cellx);
            var y = map.LogicBlock.getXFromCell(celly);
            this.setPosition(x, y);
        };
        SpriteBase.prototype.getPositionCellX = function () {
            return map.LogicBlock.getCellX(this.getPositionX());
        };
        SpriteBase.prototype.getPositionCellY = function () {
            return map.LogicBlock.getCellY(this.getPositionY());
        };
        return SpriteBase;
    }(core.EventSet));
    map.SpriteBase = SpriteBase;
    __reflect(SpriteBase.prototype, "map.SpriteBase");
})(map || (map = {}));
var map;
(function (map) {
    function transfromDir(dir) {
        /*
        --逻辑dir的坐标系
        --   7  6  5
        --   	 \|/
        --   0 ———|————4
        --   	 /|\
        --   	1	2  3

        --引擎精灵dir的坐标系(angle坐标：地图左上角0,0，Y轴向下，X轴向左)
        --   5  6  7
        --   	 \|/
        --   4 ———|————0
        --   	 /|\
        --   	3	2  1*/
        if (dir > 7)
            dir = 7;
        if (dir < 0)
            dir = 0;
        if (dir <= 4)
            dir = 4 - dir;
        else
            dir = 12 - dir;
        return dir;
    }
    //地图相关逻辑，包括寻路
    var MovableSprite = (function (_super) {
        __extends(MovableSprite, _super);
        function MovableSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        MovableSprite.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.report = 0;
            this.optimizeflag = 0;
            this.mPathMgr = map.MapManager.getInstance().getPathMgr();
            this.movementEvent = map.SpriteMovEvent.newObj();
            this.mmoving = false;
            this.mbTickMove = false;
            this.m_nAngle = -1;
            this.m_bDirChange = false;
        };
        //子类复写 析构函数
        MovableSprite.prototype.destory = function () {
            this.movementEvent.deleteObj();
            this.movementEvent = null;
        };
        MovableSprite.prototype.addReportFlag = function (f) {
            this.report = this.report | f;
        };
        MovableSprite.prototype.removeReportFlag = function (f) {
            this.report = this.report & (~f);
        };
        MovableSprite.prototype.clearReportFlag = function () {
            this.report = 0;
        };
        MovableSprite.prototype.moveTo = function (mapx, mapy, ignoreBlock) {
            TLog.Assert(!isNaN(mapx) && !isNaN(mapy));
            this._DelayInitLogicPath();
            var curX = this.getPositionX();
            var curY = this.getPositionY();
            //异步寻路,4000步搜索一次
            var from = { x: curX, y: curY };
            var to = { x: mapx, y: mapy };
            var ret = this.mPathMgr.createPath(this.logicPath, from, to, this.getAngle(), 10000, ignoreBlock);
            if (ret == map.FindPathType.eFindPathType_Succeed) {
                if (this.mmoving == false) {
                    //创建路径成功
                    this.mmoving = true;
                    if (this.report & map.MoveReportFlag.MOVEMENT_BEGIN_RUN) {
                        this._FireMovementEvent(map.MoveReportFlag.MOVEMENT_BEGIN_RUN);
                    }
                }
            }
            else if (ret == map.FindPathType.eFindPathType_Fail) {
                if (this.mmoving) {
                    this.mmoving = false;
                    if (map.MoveReportFlag.MOVEMENT_STOPING & this.report) {
                        this._FireMovementEvent(map.MoveReportFlag.MOVEMENT_STOPING);
                    }
                }
            }
            this.mbTickMove = (ret != map.FindPathType.eFindPathType_Fail);
            return this.mbTickMove;
        };
        MovableSprite.prototype.moveStop = function () {
            TLog.Assert(this.isEnterMap());
            if (this.mbTickMove && this.logicPath) {
                this.mbTickMove = false;
                this.mPathMgr.clearPath(this.logicPath);
            }
            if (this.mmoving) {
                this.mmoving = false;
                if (map.MoveReportFlag.MOVEMENT_STOPING & this.report) {
                    this._FireMovementEvent(map.MoveReportFlag.MOVEMENT_STOPING);
                }
            }
        };
        MovableSprite.prototype.isMoving = function () {
            return this.mmoving;
        };
        MovableSprite.prototype.setMoveSpeed = function (speed) {
            this._DelayInitLogicPath();
            this.logicPath.SetSpeed(speed);
        };
        MovableSprite.prototype.getMoveSpeed = function () {
            this._DelayInitLogicPath();
            return this.logicPath.GetSpeed();
        };
        MovableSprite.prototype._DelayInitLogicPath = function () {
            TLog.Assert(this.isEnterMap());
            if (this.logicPath == null) {
                this.logicPath = this.mPathMgr.createLogicPath();
                this.logicPath.SetSpeed(this.getMoveSpeed());
            }
            return true;
        };
        MovableSprite.prototype._FireMovementEvent = function (flag) {
            if (flag == 0) {
                return;
            }
            var pos = { x: this.getPositionX(), y: this.getPositionY() };
            var cell = { x: this.getPositionCellX(), y: this.getPositionCellY() };
            this.movementEvent.actor = this;
            this.movementEvent.flag = flag;
            this.movementEvent.dir = this.getDir();
            this.movementEvent.pixel = pos;
            this.movementEvent.cell = cell;
            if ((flag & map.MoveReportFlag.MOVEMENT_BEGIN_RUN) != 0 && (this.report & map.MoveReportFlag.MOVEMENT_TRACE_PATH) != 0) {
                if (this.logicPath) {
                    // num = this.logicPath.GetPathNum();
                    // if (num > 0)
                    // {
                    // 	LogicPath::TWalkLine* line = this.logicPath.GetPathList();
                    // 	this.movementEvent.CreatePath(num);
                    // 	for (i = 0; i < num; ++i)
                    // 	{
                    // 		this.movementEvent.SetPathXY(i, line[i].ptStart.x, line[i].ptStart.y);
                    // 	}
                    // 	this.movementEvent.SetPathEndXY(this.logicPath.GetEndX(), this.logicPath.GetEndY());
                    // 	this.movementEvent.walkOnPathIndex = this.logicPath.GetCurrentPathIndex();
                    // 	this.movementEvent.walkOnPathThousand = 0;
                    // }
                }
            }
            if ((flag & map.MoveReportFlag.MOVEMENT_CELL_CHANGED) == 0) {
                this.fireEvent(map.SpriteMovEvent.MovementEvent, this.movementEvent);
                return;
            }
            // if ((this.report & MoveReportFlag.MOVEMENT_TRACE_PATH) != 0)
            // {
            // 	this.movementEvent.walkOnPathIndex = this.logicPath.GetCurrentPathIndex();
            // 	this.movementEvent.walkOnPathThousand = this.logicPath.GetCurrentPathThousand();
            // }
            if (this.mPathMgr.getLogicBlock().IsBlock(cell)) {
                this.movementEvent.flag = this.movementEvent.flag & (~map.MoveReportFlag.MOVEMENT_CELL_CHANGED);
                this.fireEvent(map.SpriteMovEvent.MovementEvent, this.movementEvent);
                return;
            }
            this.fireEvent(map.SpriteMovEvent.MovementEvent, this.movementEvent);
        };
        MovableSprite.prototype.setDir = function (dir) {
            this.setAngle(transfromDir(dir) * 45);
        };
        MovableSprite.prototype.getDir = function () {
            var angle = this.getAngle();
            var unit = 22.5;
            var dir = 1;
            if (angle <= unit || angle >= 360 - unit)
                dir = 0;
            else if (angle >= unit && angle <= 3 * unit)
                dir = 1;
            else if (angle >= 3 * unit && angle <= 5 * unit)
                dir = 2;
            else if (angle >= 5 * unit && angle <= 7 * unit)
                dir = 3;
            else if (angle >= 7 * unit && angle <= 9 * unit)
                dir = 4;
            else if (angle >= 9 * unit && angle <= 11 * unit)
                dir = 5;
            else if (angle >= 11 * unit && angle <= 13 * unit)
                dir = 6;
            else if (angle >= 13 * unit && angle <= 15 * unit)
                dir = 7;
            return transfromDir(dir);
        };
        MovableSprite.prototype.setAngle = function (angle) {
            TLog.Assert(!isNaN(angle));
            if (this.m_nAngle != angle) {
                this.m_nAngle = angle;
                this.m_bDirChange = true;
            }
        };
        MovableSprite.prototype.getAngle = function () {
            return this.m_nAngle;
        };
        MovableSprite.prototype.setDirChange = function () {
            this.m_bDirChange = true;
        };
        MovableSprite.prototype._UpdateMovement = function (cam) {
            if (!this.isEnterMap())
                return;
            if (!this.mbTickMove || this.logicPath == null)
                return;
            this.logicPath.UpdateTime(core.TimeStamp.DelayTime);
            //PROFILE_AUTO("RenderActor::_UpdateMovement");
            // unsigned int flag = 0;
            // Math::Point<int> pos_ ;
            // int dir_ = 0;
            // Math::Point<int> cell_ ;
            // bool shouldStop = false;
            var flag = 0;
            var outValue = {};
            outValue.bStop = false;
            outValue.x = 0;
            outValue.y = 0;
            outValue.dir = 0;
            var type = this.mPathMgr.updatePath(this.logicPath, outValue);
            var shouldStop = outValue.bStop;
            var dir_ = outValue.dir;
            var cell_ = {};
            var pos_ = {};
            pos_.x = outValue.x;
            pos_.y = outValue.y;
            if (type == map.FindPathType.eFindPathType_Succeed) {
                if (this.mmoving == false) {
                    this.mmoving = true;
                    flag |= map.MoveReportFlag.MOVEMENT_BEGIN_RUN;
                }
                else {
                    if (shouldStop) {
                        this.mbTickMove = false;
                        if (this.mmoving) {
                            this.mmoving = false;
                            flag |= map.MoveReportFlag.MOVEMENT_STOPING;
                        }
                    }
                    else {
                        var curX = this.getPositionX();
                        var curY = this.getPositionY();
                        var curCellX = this.getPositionCellX();
                        var curCellY = this.getPositionCellY();
                        var curDir = this.getAngle();
                        if (pos_.x != curX || pos_.y != curY) {
                            flag |= map.MoveReportFlag.MOVEMENT_PIXEL_CHANGED;
                            cell_.x = map.LogicBlock.getCellX(pos_.x);
                            cell_.y = map.LogicBlock.getCellX(pos_.y);
                            this.setPosition(pos_.x, pos_.y);
                            if (cell_.x != curCellX || cell_.y != curCellY) {
                                flag |= map.MoveReportFlag.MOVEMENT_CELL_CHANGED;
                            }
                        }
                        if (dir_ != curDir) {
                            flag |= map.MoveReportFlag.MOVEMENT_DIR_CHANGED;
                            this.setAngle(dir_);
                        }
                    }
                }
            }
            else if (type == map.FindPathType.eFindPathType_Fail) {
                if (this.mmoving) {
                    this.mmoving = false;
                    flag |= map.MoveReportFlag.MOVEMENT_STOPING;
                }
                this.mbTickMove = false;
            }
            flag = flag & this.report;
            if (flag != 0) {
                if (this.isClip() && (this.optimizeflag & map.OptimizeFlag.OPTIMIZE_MOVEMENT_ONSEE) != 0) {
                    //看不见的情况下，只通知开始移动和结束移动
                    if ((flag & map.MoveReportFlag.MOVEMENT_BEGIN_RUN) || (flag & map.MoveReportFlag.MOVEMENT_STOPING)) {
                    }
                    else {
                        return;
                    }
                }
                this._FireMovementEvent(flag);
            }
        };
        MovableSprite.prototype._UpdateAppearance = function () {
            if (this.isClip() && this.optimizeflag & map.OptimizeFlag.OPTIMIZE_UPDATE_ONSEE)
                return;
            //PROFILE_AUTO("RenderActor::_UpdateAppearance");
            if (this.m_bDirChange) {
                // var s_dirs:number[] = [0, 45, 90, 135, 180, 225, 270, 315]; 
                // var minOffset = 0x0fffffff;
                // var dirIndex = 0;
                // for (var i = 0; i < s_dirs.length; ++i)
                // {
                // 	var dir = s_dirs[i];
                // 	var curdir = this.m_nAngle;
                // 	var offset = curdir - dir;
                // 	if (offset < -180 || offset > 180)
                // 	{
                // 		offset = dir + 360 - curdir;
                // 	}
                // 	else if (offset < 0)
                // 	{
                // 		offset = -offset;
                // 	}
                // 	if (offset < minOffset)
                // 	{
                // 		minOffset = offset;
                // 		dirIndex = i;
                // 	}
                // }
                // dirIndex = transfromDir(dirIndex)
                var dirIndex = this.getDir();
                if (this.onMoveDirChange(dirIndex))
                    this.m_bDirChange = false;
            }
        };
        MovableSprite.prototype.onUpdate = function (cam) {
            _super.prototype.onUpdate.call(this, cam);
            this._UpdateMovement(cam);
            this._UpdateAppearance();
        };
        MovableSprite.prototype.onMoveDirChange = function (dir) {
            return true;
        };
        return MovableSprite;
    }(map.SpriteBase));
    map.MovableSprite = MovableSprite;
    __reflect(MovableSprite.prototype, "map.MovableSprite");
})(map || (map = {}));
var map;
(function (map) {
    var LayerBase = (function (_super) {
        __extends(LayerBase, _super);
        function LayerBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LayerBase.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTileMap = params[0];
            this.mZOder = -1;
        };
        LayerBase.prototype.destory = function () {
        };
        LayerBase.prototype.getTileMap = function () {
            return this.mTileMap;
        };
        // getDisplayNode():egret.DisplayObjectContainer{
        // 	if(!this.mDisplayNode){
        // 		this.mDisplayNode = new MapLayerDisplayerNode();
        // 	}
        // 	return this.mDisplayNode;
        // }
        LayerBase.prototype.onUpdate = function (cam) {
        };
        LayerBase.prototype.setZOrder = function (order) {
            this.mZOder = order;
        };
        LayerBase.prototype.getZOrder = function () {
            return this.mZOder;
        };
        return LayerBase;
    }(TClass));
    map.LayerBase = LayerBase;
    __reflect(LayerBase.prototype, "map.LayerBase");
})(map || (map = {}));
// class ModelResouceEvent extends core.EventArgs{
// 	public static EVENT_MODEL_LOAD:string = "EVENT_MODEL_LOAD";
// 	public static EVENT_MODEL_UNLOAD:string = "EVENT_MODEL_UNLOAD";
// 	resource:LogicSpriteResource;
// }
var map;
(function (map) {
    var SpriteResourceBase = (function (_super) {
        __extends(SpriteResourceBase, _super);
        function SpriteResourceBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        SpriteResourceBase.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mResRefCount = 0;
            this.mLoadState = map.ModelLoadState.eUnLoaded;
            this.mModelName = params[0];
            this.mSpriteMgr = params[2];
            this.mUnLoadBeginTime = -1;
        };
        //子类复写 析构函数
        SpriteResourceBase.prototype.destory = function () {
            this.unloadImp();
        };
        //状态切换：(==是双向箭头，--是单向箭头)
        //eUnLoaded<==>eLoading-->eLoaded
        //		\					//
        //		 \				   //
        //		  \	  eUnLoading
        SpriteResourceBase.prototype.load = function () {
            this.mResRefCount++;
            if (this.mResRefCount == 1) {
                if (this.isUnLoading()) {
                    this.mSpriteMgr.removeUnloadingResource(this);
                    this.mUnLoadBeginTime = -1;
                    this.mLoadState = map.ModelLoadState.eLoaded;
                }
                if (this.isUnLoaded()) {
                    this.mLoadState = map.ModelLoadState.eLoading;
                    this._loadImp();
                }
            }
            return this.mLoadState == map.ModelLoadState.eLoaded;
        };
        SpriteResourceBase.prototype.unload = function () {
            // if (this.isUnLoaded() || this.isUnLoading())
            // 	return;
            TLog.Assert(this.mResRefCount > 0);
            this.mResRefCount--;
            if (this.mResRefCount == 0) {
                //this.unloadImp();
                if (this.isLoading()) {
                    this._cancelLoadImp();
                    this.mLoadState = map.ModelLoadState.eUnLoaded;
                }
                else {
                    this.mLoadState = map.ModelLoadState.eUnLoading;
                    this.mSpriteMgr.addUnloadingResource(this);
                }
            }
            return this.isUnLoaded();
        };
        SpriteResourceBase.prototype.unloadImp = function () {
            // if(this.isLoading()){
            // 	this._cancelLoadImp()
            // }
            this._unloadImp();
            this.mSpriteMgr.removeUnloadingResource(this);
            this.mUnLoadBeginTime = -1;
            this.mLoadState = map.ModelLoadState.eUnLoaded;
        };
        SpriteResourceBase.prototype.isLoaded = function () {
            return this.mLoadState == map.ModelLoadState.eLoaded;
        };
        SpriteResourceBase.prototype.isLoading = function () {
            return this.mLoadState == map.ModelLoadState.eLoading;
        };
        SpriteResourceBase.prototype.isUnLoaded = function () {
            return this.mLoadState == map.ModelLoadState.eUnLoaded;
        };
        SpriteResourceBase.prototype.isUnLoading = function () {
            return this.mLoadState == map.ModelLoadState.eUnLoading;
        };
        SpriteResourceBase.prototype.notifyLoadComplete = function () {
            this.mLoadState = map.ModelLoadState.eLoaded;
        };
        /////////////////子类继承/////////////////
        SpriteResourceBase.prototype._loadImp = function () {
        };
        SpriteResourceBase.prototype._unloadImp = function () {
        };
        SpriteResourceBase.prototype._cancelLoadImp = function () {
        };
        return SpriteResourceBase;
    }(TClass));
    map.SpriteResourceBase = SpriteResourceBase;
    __reflect(SpriteResourceBase.prototype, "map.SpriteResourceBase");
})(map || (map = {}));
var map;
(function (map) {
    var SpriteLayer = (function (_super) {
        __extends(SpriteLayer, _super);
        function SpriteLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteLayer.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTag = -1;
            this.mObjectList = [];
            this.mAddObjectList = [];
            this.mRemoveObjectList = [];
            this.mRenderObjectList = [];
            this.mbUpdateLock = false;
        };
        SpriteLayer.prototype.destory = function () {
            this.clearSprite();
        };
        SpriteLayer.prototype.getDisplayNode = function () {
            if (!this.mDisplayNode) {
                this.mDisplayNode = new map.SpriteLayerDisplayerNode();
            }
            return this.mDisplayNode;
        };
        SpriteLayer.prototype.setTag = function (tag) {
            this.mTag = tag;
        };
        SpriteLayer.prototype.getTag = function () {
            return this.mTag;
        };
        SpriteLayer.prototype.addSprite = function (sprite) {
            if (sprite == null)
                return false;
            //如果update锁定了，就加入缓存列表
            if (this.mbUpdateLock) {
                var idx = this.mRemoveObjectList.indexOf(sprite);
                if (idx != -1) {
                    sprite.release();
                    this.mRemoveObjectList.splice(idx, 1);
                }
                if (this.mAddObjectList.indexOf(sprite) != -1)
                    return false;
                sprite.retain();
                sprite.onEnterMap(this);
                this.mAddObjectList.push(sprite);
                return true;
            }
            var idx = this.mObjectList.indexOf(sprite);
            if (idx == -1) {
                sprite.retain();
                this.mObjectList.push(sprite);
                if (!sprite.isEnterMap())
                    sprite.onEnterMap(this);
            }
            var reIdx = this.mRemoveObjectList.indexOf(sprite); //（由于移除的操作都要延迟）用于应对在同一帧内，先加入，后移除，再加入的情况
            if (reIdx != -1) {
                sprite.release();
                if (!sprite.isEnterMap())
                    sprite.onEnterMap(this);
                this.mRemoveObjectList.splice(reIdx, 1);
            }
            return true;
        };
        //dragonbones循环里，不允许删除amarture，所以这里延迟一帧处理
        SpriteLayer.prototype.removeSprite = function (sprite) {
            if (sprite == null)
                return;
            var idx = this.mAddObjectList.indexOf(sprite);
            if (idx != -1) {
                sprite.release();
                this.mAddObjectList.splice(idx, 1);
            }
            if (this.mRemoveObjectList.indexOf(sprite) != -1)
                return;
            //如果update锁定了，就加入缓存列表
            //if (this.mbUpdateLock)
            {
                sprite.retain();
                sprite.onLeaveMap(this);
                this.mRemoveObjectList.push(sprite);
                //return true;
            }
            return true;
        };
        SpriteLayer.prototype.removeSpriteImp = function (sprite) {
            var idx = this.mObjectList.indexOf(sprite);
            if (idx != -1) {
                this.mObjectList.splice(idx, 1);
                // if(sprite.isEnterMap())
                // 	sprite.onLeaveMap(this);
                sprite.release();
            }
            idx = this.mRenderObjectList.indexOf(sprite);
            if (idx != -1) {
                this.mRenderObjectList.splice(idx, 1);
            }
            return true;
        };
        SpriteLayer.prototype.clearSprite = function () {
            this.mAddObjectList.forEach(function (obj) {
                obj.release();
            });
            this.mAddObjectList.length = 0;
            this.mRemoveObjectList.forEach(function (obj) {
                obj.release();
            });
            this.mRemoveObjectList.length = 0;
            this.mObjectList.forEach(function (obj) {
                obj.release();
            });
            this.mObjectList.length = 0;
            this.mRenderObjectList.length = 0;
        };
        SpriteLayer.prototype.onUpdate = function (cam) {
            if (this.mObjectList.length == 0)
                return;
            this.onUpdateSpriteList(cam);
            this.onRenderSpriteList(cam);
        };
        SpriteLayer.prototype.onUpdateSpriteList = function (cam) {
            this.mbUpdateLock = true;
            var size = this.mObjectList.length;
            for (var i = 0; i < size; i++) {
                var obj = this.mObjectList[i];
                if (this.mRemoveObjectList.indexOf(obj) != -1)
                    continue;
                obj.onUpdate(cam);
            }
            this.mbUpdateLock = false;
            if (this.mAddObjectList.length > 0) {
                var size = this.mAddObjectList.length;
                for (var i = 0; i < size; i++) {
                    var obj = this.mAddObjectList[i];
                    this.addSprite(obj);
                    obj.release();
                }
                this.mAddObjectList.length = 0;
            }
            if (this.mRemoveObjectList.length > 0) {
                var size = this.mRemoveObjectList.length;
                for (var i = 0; i < size; i++) {
                    var obj = this.mRemoveObjectList[i];
                    this.removeSpriteImp(obj);
                    obj.release();
                }
                this.mRemoveObjectList.length = 0;
            }
        };
        //渲染sprite
        SpriteLayer.prototype.onRenderSpriteList = function (cam) {
            var _this = this;
            this.mRenderObjectList.length = 0;
            this.mObjectList.forEach(function (obj) {
                if (obj.isVisible() == true && obj.isClip() == false) {
                    _this.mRenderObjectList.push(obj);
                }
            });
        };
        return SpriteLayer;
    }(map.LayerBase));
    map.SpriteLayer = SpriteLayer;
    __reflect(SpriteLayer.prototype, "map.SpriteLayer");
})(map || (map = {}));
var map;
(function (map) {
    var MapLayerBase = (function (_super) {
        __extends(MapLayerBase, _super);
        function MapLayerBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mLayerEyeshot = new map.MapLayerEyeShot;
            _this.mLayerType = 0;
            _this.mLayerID = 0;
            return _this;
        }
        MapLayerBase.prototype.destory = function () {
        };
        MapLayerBase.prototype.getDisplayNode = function () {
            if (!this.mDisplayNode) {
                this.mDisplayNode = new map.MapLayerDisplayerNode();
            }
            return this.mDisplayNode;
        };
        MapLayerBase.prototype.initEyeshot = function (nMapWidth, nMapHeight, nGridWidth, nGridHeight) {
            this.mLayerEyeshot.create(this, nMapWidth, nMapHeight, nGridWidth, nGridHeight);
        };
        MapLayerBase.prototype.load = function (stream) {
            this.mLayerType = stream.readByte();
            this.mLayerID = stream.readShort();
            this.mName = stream.readString();
            return true;
        };
        MapLayerBase.prototype.onUpdate = function (cam) {
            if (cam.isViewChanged()) {
                this.mLayerEyeshot.changeViewportSize(cam.getViewWidth(), cam.getViewHeight(), false);
                this.mLayerEyeshot.moveViewportCenterTo(cam.getViewCenterX(), cam.getViewCenterY());
            }
        };
        MapLayerBase.prototype.onEyeshotFound = function (nGridX, nGridY) {
        };
        MapLayerBase.prototype.onEyeshotLost = function (nGridX, nGridY) {
        };
        return MapLayerBase;
    }(map.LayerBase));
    map.MapLayerBase = MapLayerBase;
    __reflect(MapLayerBase.prototype, "map.MapLayerBase", ["map.IEyeshotCallback"]);
})(map || (map = {}));
var map;
(function (map) {
    var LogicSprite = (function (_super) {
        __extends(LogicSprite, _super);
        function LogicSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LogicSprite.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mRootNode = new egret.DisplayObjectContainer;
            this.mLogicFlags = 0;
            this.mLogicInfo = {
                0: "",
            };
            this.mSpriteMgr = map.LogicSpriteManager.getInstance();
            this.mParentSprite = null;
            this.mChildSpriteList = [];
            this.mChildAddInfoList = [];
            //this.mChildRemoveInfoList = [];
            this.m_bFlipX = false;
            this.m_bFlipY = false;
            this.mFlipXFlag = 1;
            this.mFlipYFlag = 1;
            this.m_bMirror = false;
            this.mPersScale = 1;
            this.mScale = 1;
            this.mAlpha = 255;
            this.mMaskAlpha = 255;
            this.mRotate = 0;
            this.mDisplayeNodeList = [];
            //this.mAddNodeSlots = [];
            this.mBoundRect = new egret.Rectangle;
            this.mBoundRect.setTo(0, 0, 1, 1);
            this.mBoundActionId = "";
            this.mbBoundDirty = false;
            this.mbUpdateAnimAlways = false;
            this.mPartSkinInfoList = [];
            this.mActionAliasMap = {};
        };
        LogicSprite.prototype.destory = function () {
            // this.mSpriteMgr.removeEventListener(ModelResouceEvent.EVENT_MODEL_LOAD, this.onResLoad, this);
            // this.mSpriteMgr.removeEventListener(ModelResouceEvent.EVENT_MODEL_UNLOAD, this.onResUnLoad, this);
            this.mSpriteMgr.removeSprite(this);
            this.clearAllChildSprite();
            if (this.mRootNode.parent) {
                this.mRootNode.parent.removeChild(this.mRootNode);
            }
            this.mDisplayeNodeList = null;
            if (this.mAnimEvent) {
                this.mAnimEvent.release();
                this.mAnimEvent = null;
            }
        };
        LogicSprite.prototype.getBoundRect = function () {
            var node = this.getDisplayNode();
            this.mBoundRect.x = map.FLOOR(node.x - this.mBoundRect.width / 2);
            this.mBoundRect.y = map.FLOOR(node.y - this.mBoundRect.height);
            return this.mBoundRect;
        };
        LogicSprite.prototype.loadModel = function (name) {
            this.changeSkin("");
            this.mPartSkinInfoList.length = 0;
            this.setLogicInfo(0 /* ModelName */, name, 1 /* InvalidModelName */);
            return true;
        };
        LogicSprite.prototype.getModelName = function () {
            return this.mLogicInfo[0 /* ModelName */];
        };
        //loop 动画需要播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
        LogicSprite.prototype.changeAction = function (actionId, loop) {
            this.setLogicInfo(1 /* ActionId */, actionId, 2 /* InvalidActionId */);
            this.setLogicInfo(3 /* LoopCount */, loop, 8 /* InvalidLoop */);
            //this.setAnimSpeed(speed);
            return false;
        };
        LogicSprite.prototype.addAliasAction = function (name, aliasName) {
            this.mActionAliasMap[name] = aliasName;
        };
        LogicSprite.prototype.clearAliasAction = function () {
            this.mActionAliasMap = {};
        };
        LogicSprite.prototype.getAliasAction = function (name) {
            return this.mActionAliasMap[name];
        };
        LogicSprite.prototype.getActionId = function () {
            return this.mLogicInfo[1 /* ActionId */];
        };
        LogicSprite.prototype.getLoopCount = function () {
            if (this.mLogicInfo[3 /* LoopCount */] != null)
                return this.mLogicInfo[3 /* LoopCount */];
            return -1;
        };
        LogicSprite.prototype.setAnimSpeed = function (speed) {
            this.setLogicInfo(2 /* AnimSpeed */, speed, 4 /* InvalidAnimSpeed */);
        };
        LogicSprite.prototype.getAnimSpeed = function () {
            return this.mLogicInfo[2 /* AnimSpeed */] || 1;
        };
        LogicSprite.prototype.setPause = function (bPause) {
            this.setLogicInfo(4 /* Pause */, bPause, 16 /* InvalidPause */);
        };
        LogicSprite.prototype.isPause = function () {
            return this.mLogicInfo[4 /* Pause */] || false;
        };
        LogicSprite.prototype.setAlpha = function (alpha) {
            this.mAlpha = alpha;
            this._updateAlpha();
        };
        LogicSprite.prototype.setMaskAlpha = function (maskAlpha) {
            this.mMaskAlpha = maskAlpha;
            this._updateAlpha();
        };
        LogicSprite.prototype.setColor = function (r, g, b) {
        };
        LogicSprite.prototype.setRotate = function (rot) {
            this.mRotate = rot;
            this._updateRotate();
        };
        LogicSprite.prototype.getRotate = function () {
            return this.mRotate;
            //return this.mRootNode.rotation;
        };
        LogicSprite.prototype.setScale = function (s) {
            this.mScale = s;
            this._updateScale();
        };
        LogicSprite.prototype.getScale = function () {
            return this.mScale;
        };
        LogicSprite.prototype.setPersScale = function (s) {
            this.mPersScale = s;
            this._updateScale();
        };
        LogicSprite.prototype.getPersScale = function () {
            return this.mPersScale;
        };
        LogicSprite.prototype.setMirror = function (b) {
            this.m_bMirror = b;
            this.setDirChange();
        };
        LogicSprite.prototype.setFlipXY = function (bFilpX, bFilpY) {
            this.m_bFlipX = bFilpX;
            this.m_bFlipY = bFilpY;
            this.setDirChange();
        };
        LogicSprite.prototype.isFlipX = function () {
            return this.m_bFlipX;
        };
        LogicSprite.prototype.isFlipY = function () {
            return this.m_bFlipY;
        };
        LogicSprite.prototype.setParent = function (sprite) {
            this.mParentSprite = sprite;
        };
        LogicSprite.prototype.getParent = function () {
            return this.mParentSprite;
        };
        //包围盒计算时候的动作
        LogicSprite.prototype.setBoundActionId = function (action) {
            this.mBoundActionId = action;
        };
        LogicSprite.prototype.getBoundActionId = function () {
            return this.mBoundActionId;
        };
        LogicSprite.prototype.invalideBounds = function () {
            if (this.report & map.AnimReportFlag.BOUND_NOTIFY) {
                this.mbBoundDirty = true;
            }
        };
        //一直更新动画（默认只是可见时才更新）
        LogicSprite.prototype.setUpdateAnimAlways = function (b) {
            this.mbUpdateAnimAlways = b;
        };
        LogicSprite.prototype.isUpdateAnimAlways = function () {
            return this.mbUpdateAnimAlways;
        };
        //换皮
        LogicSprite.prototype.changePartSkin = function (slotName, replaceSkinPath) {
            for (var i = 0; i < this.mPartSkinInfoList.length; i++) {
                var info_1 = this.mPartSkinInfoList[i];
                if (info_1.sloName == slotName) {
                    info_1.replaceSkinPath = replaceSkinPath;
                    return;
                }
            }
            var info = { slotName: slotName, replaceSkinPath: replaceSkinPath };
            this.mPartSkinInfoList.push(info);
        };
        LogicSprite.prototype.changeSkin = function (skinPath) {
            this.setLogicInfo(5 /* Skin */, skinPath, 64 /* InvalidSkin */);
        };
        LogicSprite.prototype.getSkinName = function () {
            return this.mLogicInfo[5 /* Skin */] || "";
        };
        //位置偏移
        LogicSprite.prototype.setPositionOffset = function (x, y) {
        };
        //子类Sprite
        LogicSprite.prototype.addChildSprite = function (slot, sprite, order, bTransform) {
            if (sprite == null || sprite == this)
                return;
            TLog.Assert(sprite.isEnterMap() == false && sprite.getParent() == null);
            var info = {};
            info.slot = slot;
            info.sprite = sprite;
            info.order = (order == null ? NaN : order);
            info.bTransform = !!bTransform;
            this.mChildAddInfoList.push(info);
            sprite.setParent(this);
            sprite.retain();
        };
        LogicSprite.prototype.removeChildSprite = function (sprite) {
            var bHandle = false;
            for (var i = 0; i < this.mChildAddInfoList.length; i++) {
                var info = this.mChildAddInfoList[i];
                if (info.sprite == sprite) {
                    this._removeChildNode(sprite);
                    this.mChildAddInfoList.splice(i, 1);
                    bHandle = true;
                    break;
                }
            }
            if (bHandle)
                return;
            for (var i = 0; i < this.mChildSpriteList.length; i++) {
                var curSprite = this.mChildSpriteList[i];
                if (curSprite == sprite) {
                    this._removeChildNode(sprite);
                    this.mChildSpriteList.splice(i, 1);
                    break;
                }
            }
        };
        LogicSprite.prototype.clearAllChildSprite = function () {
            for (var i = 0; i < this.mChildSpriteList.length; i++) {
                var curSprite = this.mChildSpriteList[i];
                this._removeChildNode(curSprite);
            }
            this.mChildSpriteList.length = 0;
        };
        LogicSprite.prototype.addDisplayeNode = function (type, node) {
            if (node == null || type < 0 || type > map.SpriteDisplayNodeType.eDisplayNode_Unknown) {
                return;
            }
            //todo:yangguiming 这里添加阴影会打断渲染批次，应该要批次渲染。
            if (JsUtil.arrayPush(this.mDisplayeNodeList, node)) {
                var index = 0;
                if (type == map.SpriteDisplayNodeType.eDisplayNode_Shadow) {
                }
                else if (type == map.SpriteDisplayNodeType.eDisplayNode_UI) {
                    index = -1;
                }
                this.mRootNode.addChildAt(node, index);
            }
        };
        LogicSprite.prototype.removeDisplayeNode = function (node) {
            if (JsUtil.arrayRemoveVal(this.mDisplayeNodeList, node)) {
                this.mRootNode.removeChild(node);
            }
        };
        LogicSprite.prototype.getDisplayNodeList = function () {
            return this.mDisplayeNodeList;
        };
        //为了兼容cocos引擎，挂接骨骼后，Y轴向上
        LogicSprite.prototype.setPosition = function (x, y) {
            TLog.Assert(x != null && y != null && !isNaN(x) && !isNaN(y));
            var node = this.getDisplayNode();
            node.x = x;
            node.y = y;
            if (this.getParent()) {
                node.y = -y;
            }
        };
        LogicSprite.prototype.getPositionX = function () {
            var node = this.getDisplayNode();
            return node.x;
        };
        LogicSprite.prototype.getPositionY = function () {
            var node = this.getDisplayNode();
            var y = node.y;
            if (this.getParent()) {
                y = -y;
            }
            return y;
        };
        //////////////////////////////////子类通用函数////////////////////////////////////////////////////
        LogicSprite.prototype._setFlags = function (flag) {
            this.mLogicFlags |= flag;
        };
        LogicSprite.prototype._removeFlags = function (flags) {
            this.mLogicFlags &= ~flags;
        };
        LogicSprite.prototype._hasFlags = function (flags) {
            return (this.mLogicFlags & flags) == flags;
        };
        LogicSprite.prototype.setLogicInfo = function (key, val, flag) {
            this.mLogicInfo[key] = val;
            this._setFlags(flag);
        };
        LogicSprite.prototype._fireAnimEvent = function (notify) {
            if (this.report & map.AnimReportFlag.ANIM_NOTIFY) {
                //var e: SpriteAnimEvent = SpriteAnimEvent.createObj();
                if (this.mAnimEvent == null) {
                    this.mAnimEvent = map.SpriteAnimEvent.newObj();
                }
                var e = this.mAnimEvent;
                e.actor = this;
                e.actionId = this.getActionId();
                e.notify = notify;
                this.fireEvent(map.SpriteAnimEvent.AnimEvent, e);
            }
        };
        LogicSprite.prototype._fireBoundEvent = function () {
            if (this.report & map.AnimReportFlag.BOUND_NOTIFY) {
                var e = map.SpriteEvent.createObj();
                e.actor = this;
                this.fireEvent(map.SpriteEvent.BoundSizeEvent, e);
            }
        };
        LogicSprite.prototype._updateMask = function () {
            //阻挡点遮掩mask
            var rect = this.getBoundRect();
            //脚底是做检测mask
            var leftX = map.LogicBlock.getCellX(rect.left);
            var topY = map.LogicBlock.getCellY(rect.top);
            var rightX = map.LogicBlock.getCellX(rect.right);
            var bottomY = map.LogicBlock.getCellY(rect.bottom);
            var maskAlpha = 255;
            var pMask = map.MapManager.getInstance().getLogicMask();
            //if ( pMask->IsMask(leftX, topY) || pMask->IsMask(leftX, bottomY) || pMask->IsMask(rightX, topY) || pMask->IsMask(rightX, bottomY) )
            if (pMask.IsMask(map.FLOOR((leftX + rightX) / 2), bottomY) && pMask.IsMask(map.FLOOR((leftX + rightX) / 2), map.FLOOR((topY + bottomY) / 2)))
                maskAlpha = 128;
            this.setMaskAlpha(maskAlpha);
        };
        LogicSprite.prototype._removeChildNode = function (sprite) {
            var displayNode = sprite.getDisplayNode();
            if (displayNode.parent) {
                //已经加到container
                displayNode.parent.removeChild(displayNode);
            }
            sprite.setParent(null);
            sprite.release();
        };
        //=========================begin 继承SpriteBase===========================
        LogicSprite.prototype.getDisplayNode = function () {
            return this.mRootNode;
        };
        LogicSprite.prototype.onUpdate = function (cam) {
            _super.prototype.onUpdate.call(this, cam);
            if (!this.isClip()) {
                this._updateModel();
                for (var i = 0; i < this.mChildSpriteList.length; i++) {
                    var sprite = this.mChildSpriteList[i];
                    sprite.onUpdate(cam);
                }
            }
        };
        LogicSprite.prototype.isInCameraView = function (cam) {
            //如果有父亲节点，则用父亲的剔除方式
            if (this.mParentSprite) {
                return !this.mParentSprite.isClip();
            }
            return _super.prototype.isInCameraView.call(this, cam);
        };
        LogicSprite.prototype.onCameraFound = function () {
            _super.prototype.onCameraFound.call(this);
        };
        LogicSprite.prototype.onCameraLost = function () {
            _super.prototype.onCameraLost.call(this);
        };
        //=========================end 继承SpriteBase===========================
        //===============================start 子类继承实现===========================
        LogicSprite.prototype._updateAlpha = function () {
        };
        LogicSprite.prototype._updateScale = function () {
        };
        LogicSprite.prototype._updateRotate = function () {
        };
        LogicSprite.prototype._updateModel = function () {
        };
        LogicSprite.prototype.hasActionId = function (actionId) {
            return false;
        };
        return LogicSprite;
    }(map.MovableSprite));
    map.LogicSprite = LogicSprite;
    __reflect(LogicSprite.prototype, "map.LogicSprite");
})(map || (map = {}));
var gui;
(function (gui) {
    var ComboBoxItem = (function (_super) {
        __extends(ComboBoxItem, _super);
        function ComboBoxItem() {
            return _super.call(this) || this;
        }
        ComboBoxItem.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        ComboBoxItem.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //背景
            this.bg = new gui.Grid9Image();
            this.addChild(this.bg);
            // this.bg.width = this.stage.stageWidth;
            // this.bg.height = 113;
            //内容
            this.content = new eui.Label();
            this.addChild(this.content);
            this.addEventListener(gui.TouchEvent.TOUCH_SHORT, this.onTouchEnd, this);
            this.content.textAlign = "center";
            this.content.verticalAlign = "middle";
            this.content.textColor = 0x000000;
        };
        ComboBoxItem.prototype.dataChanged = function () {
            //this.bg.source = this.data.bg;
            if (typeof (this.data.content) != "undefined") {
                //内容
                this.content.text = this.data.content;
            }
            if (typeof (this.data.width) != "undefined") {
                //宽度
                this.width = this.data.width;
                this.content.width = this.data.width;
                this.bg.width = this.data.width;
            }
            if (typeof (this.data.autoScale9Grid) != "undefined") {
                this.bg.autoScale9Grid = this.data.autoScale9Grid;
            }
            else {
                this.bg.autoScale9Grid = false;
            }
            if (typeof (this.data.bg) != "undefined") {
                //背景
                this.bg.source = this.data.bg;
            }
            else {
                this.bg.source = "";
            }
            if (typeof (this.data.height) != "undefined") {
                //高度
                this.height = this.data.height;
                this.bg.height = this.data.height;
                this.content.height = this.data.height;
            }
            if (typeof (this.data.fontSize) != "undefined") {
                //字体大小
                this.content.size = this.data.fontSize;
            }
            if (typeof (this.data.textAlign) != "undefined") {
                //字体对齐方式
                this.content.textAlign = this.data.textAlign;
            }
            if (typeof (this.data.textColor) != "undefined") {
                //字体对齐方式
                this.content.textColor = this.data.textColor;
            }
        };
        ComboBoxItem.prototype.onTouchEnd = function (event) {
            var data = {};
            data["itemIndex"] = this.itemIndex;
            data["content"] = this.data.content || "";
            this.dispatchEventWith(gui.ComboBox.onClick, true, data);
        };
        return ComboBoxItem;
    }(eui.ItemRenderer));
    gui.ComboBoxItem = ComboBoxItem;
    __reflect(ComboBoxItem.prototype, "gui.ComboBoxItem");
})(gui || (gui = {}));
var core;
(function (core) {
    var ResourceType = (function () {
        function ResourceType() {
        }
        ResourceType.TYPE_XML = RES.ResourceItem.TYPE_XML;
        ResourceType.TYPE_IMAGE = RES.ResourceItem.TYPE_IMAGE;
        ResourceType.TYPE_BIN = RES.ResourceItem.TYPE_BIN;
        ResourceType.TYPE_TEXT = RES.ResourceItem.TYPE_TEXT;
        ResourceType.TYPE_JSON = RES.ResourceItem.TYPE_JSON;
        //public static TYPE_SHEET:string = RES.ResourceItem.TYPE_SHEET;
        //public static TYPE_FONT:string = RES.ResourceItem.TYPE_FONT;
        ResourceType.TYPE_SOUND = RES.ResourceItem.TYPE_SOUND;
        return ResourceType;
    }());
    core.ResourceType = ResourceType;
    __reflect(ResourceType.prototype, "core.ResourceType");
    var ResManager = (function (_super) {
        __extends(ResManager, _super);
        function ResManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //private mConfigCallback:ResConfigCallback = null;
            _this.mGroupCallbackMap = {};
            _this.mItemCallbackMap = {};
            return _this;
        }
        ResManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.init();
        };
        ResManager.prototype.init = function () {
            //加载config(default.res.json)
            // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            // RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigError, this);
            // //加载组
            // RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadComplete, this);
            // RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            // RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
            //加载item
            //RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            //因为引擎自带的纹理集是纹理和配置一起加载的，而我们的需求是只要配置，纹理需要时候加载。
            //这里要注释sheet，如果开发时候用到了sheet会报错
            // RES.registerAnalyzer(RES.ResourceItem.TYPE_SHEET, null);
            // RES.registerAnalyzer(RES.ResourceItem.TYPE_FONT, null);
            this.initRES();
            this.mRemotePath = "";
            this.mRootPath = "";
            this.mZipList = {};
            this.mZipExpandList = {};
            this.mbSearchZipFirst = true;
            this.mResExplicitType = {};
            //RES.setMaxRetryTimes(2);//错误资源重试次数
            //RES.setMaxLoadingThread(8);//并发线程
            this.mLangIncludePathList = [];
            this.mLangExcludePathList = [];
            this.mLanguagePath = "";
            this.mPath2ResItem = {};
            //this.mbH5CrossOrign = false;
            this.mErrorResPathMap = {};
            this.mErrorMaxTryTimes = 3;
            this.mLoadQueue = [];
            this.mLoadMaxCount = 8;
            this.mLoadCount = 0;
        };
        ResManager.prototype.destory = function () {
            //RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        };
        //由于loadConfig会初始化一个FileSystem(参照LegacyResourceConfigProcessor)
        //如果不调用RES.loadConfig，需要自定义一个fileSystem（）
        ResManager.prototype.injectRESConfig = function () {
            //初始化文件系统
            var fsData = {};
            var fileSystem = {
                getFile: function (filename) {
                    return fsData[filename];
                },
                addFile: function (filename, type, root) {
                    if (!type)
                        type = "";
                    if (root == undefined) {
                        root = "";
                    }
                    fsData[filename] = { name: filename, type: type, url: filename, root: root };
                },
                profile: function () {
                    console.log(fsData);
                }
            };
            //如果没有指定类型，这里根据文件名定义类型
            var ResourceItem = RES.ResourceItem;
            RES.resourceTypeSelector = function (url) {
                var suffix = url.substr(url.lastIndexOf(".") + 1);
                if (suffix) {
                    suffix = suffix.toLowerCase();
                }
                var type;
                switch (suffix) {
                    case ResourceItem.TYPE_XML:
                    case ResourceItem.TYPE_JSON:
                    case ResourceItem.TYPE_SHEET:
                        type = suffix;
                        break;
                    case "png":
                    case "jpg":
                    case "gif":
                    case "jpeg":
                    case "bmp":
                        type = ResourceItem.TYPE_IMAGE;
                        break;
                    case "fnt":
                        type = ResourceItem.TYPE_FONT;
                        break;
                    case "txt":
                        type = ResourceItem.TYPE_TEXT;
                        break;
                    case "mp3":
                    case "ogg":
                    case "mpeg":
                    case "wav":
                    case "m4a":
                    case "mp4":
                    case "aiff":
                    case "wma":
                    case "mid":
                        type = ResourceItem.TYPE_SOUND;
                        break;
                    default:
                        type = ResourceItem.TYPE_BIN;
                        break;
                }
                return type;
            };
            var config = {
                alias: {}, groups: {}, resourceRoot: "",
                fileSystem: fileSystem
            };
            RES.native_init();
            RES.config.parseConfig(config);
        };
        ResManager.prototype.initRES = function () {
            //RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            //并发线程
            RES.setMaxLoadingThread(8);
            //注入自定义文件系统
            this.injectRESConfig();
        };
        ResManager.prototype.setRemotePath = function (remotePath) {
            this.mRemotePath = remotePath;
        };
        ResManager.prototype.getRemotePath = function () {
            return this.mRemotePath;
        };
        ResManager.prototype.setRootPath = function (rootPath) {
            this.mRootPath = rootPath;
        };
        ResManager.prototype.getRootPath = function () {
            return this.mRootPath;
        };
        ResManager.prototype.setSearchZipFirst = function (b) {
            this.mbSearchZipFirst = b;
        };
        ResManager.prototype.setLanguagePath = function (lang) {
            this.mLanguagePath = lang;
        };
        ResManager.prototype.getLanguagePath = function () {
            return this.mLanguagePath;
        };
        ResManager.prototype.addLanguageIncludePath = function (path) {
            if (this.mLangIncludePathList.indexOf(path) == -1) {
                this.mLangIncludePathList.push(path);
                return true;
            }
            return false;
        };
        ResManager.prototype.addLanguageExcludePath = function (path) {
            if (this.mLangExcludePathList.indexOf(path) == -1) {
                this.mLangExcludePathList.push(path);
                return true;
            }
            return false;
        };
        //获取文件真正路径，如果设了多语言，则按多语言搜索
        ResManager.prototype.getPathInterval = function (path) {
            if (this.mLanguagePath == "") {
                return path;
            }
            //在忽视列表中，直接返回
            for (var _i = 0, _a = this.mLangExcludePathList; _i < _a.length; _i++) {
                var subpath = _a[_i];
                if (path.indexOf(subpath) != -1) {
                    return path;
                }
            }
            for (var _b = 0, _c = this.mLangIncludePathList; _b < _c.length; _b++) {
                var subpath = _c[_b];
                if (path.indexOf(subpath) != -1) {
                    return this.mLanguagePath + path;
                }
            }
            return path;
        };
        // public fetchVersion(cb: Function, thisObj: any, userData?: any) {
        // 	let callback = {
        // 		onSuccess: (data: any) => {
        // 			//this.resLoader.loadGroup(itemList,Resource.GROUP_CONFIG,Number.MAX_VALUE);
        // 			cb.call(thisObj, 0, userData)
        // 		},
        // 		onFail: (err: number, data: any) => {
        // 			//ResourceEvent.dispatchResourceEvent(this,ResourceEvent.CONFIG_LOAD_ERROR);
        // 			cb.call(thisObj, -1, userData)
        // 		}
        // 	};
        // 	RES.getVersionController().fetchVersion(callback)
        // }
        // public loadConfig(url:string, callback:ResConfigCallback):void{
        // 	this.mConfigCallback = callback;
        // 	RES.loadConfig( this.mRootPath + url, this.mRootPath);
        // }
        // public loadGroup(name:string, callback:ResGroupCallback, priority:number = 0):void{
        // 	var cbList:ResGroupCallback[] = this.mGroupCallbackMap[name];
        // 	if(cbList == null){
        // 		cbList = this.mGroupCallbackMap[name] = [];
        // 	}
        // 	if(cbList.indexOf(callback) != -1){
        // 		return;
        // 	}
        // 	cbList.push(callback);
        // 	RES.loadGroup(name, priority);
        // }
        ResManager.prototype.transfromZipObjectData = function (zipObj, url, type) {
            //目前只支持config(xml、json、csv、exml)以及地图二进制dat
            if (type != null) {
                switch (type) {
                    case core.ResourceType.TYPE_TEXT:
                        return zipObj.asText();
                    case core.ResourceType.TYPE_BIN:
                        return zipObj.asArrayBuffer();
                    case core.ResourceType.TYPE_JSON:
                        return JsUtil.JsonDecode(zipObj.asText());
                }
            }
            else {
                var suffix = url.substr(url.lastIndexOf(".") + 1);
                if (suffix) {
                    suffix = suffix.toLowerCase();
                }
                if (suffix == "dat" || suffix == "bin") {
                    return zipObj.asArrayBuffer();
                }
                else if (suffix == "json") {
                    return JsUtil.JsonDecode(zipObj.asText());
                }
            }
            return zipObj.asText();
        };
        ResManager.prototype.loadZipRes = function (key) {
            if (this.checkResItemCache(key, "")) {
                return true;
            }
            var type = this.mResExplicitType[key];
            var path = this.getPathInterval(key);
            //如果本地存在zip文件
            for (var k in this.mZipList) {
                var zipobj = null;
                var expandList = this.mZipExpandList[k];
                if (expandList) {
                    zipobj = expandList[path];
                }
                if (zipobj == null) {
                    var zip = this.mZipList[k];
                    zipobj = zip.file(path);
                }
                if (zipobj) {
                    egret.$callAsync(this.onItemLoadSuccess, this, this.transfromZipObjectData(zipobj, key, type), key, true);
                    //this.onItemLoadSuccess(this.transfromZipObjectData(zipobj, key, type), key, true)
                    return true;
                }
            }
            return false;
        };
        //本地或者本地服务器内的资源
        ResManager.prototype.loadResAsynLocal = function (key, callback, type) {
            this._loadResAsyn(key, callback, type, false);
        };
        //指定远程服务器的资源(mRemotePath)
        ResManager.prototype.loadResAsyn = function (key, callback, type) {
            this._loadResAsyn(key, callback, type, true);
        };
        ResManager.prototype._loadResAsyn = function (key, callback, type, isRemote) {
            TLog.Assert(key != null);
            key = key.replace(/\\/g, "/");
            if (this.mRootPath != "" && key.indexOf(this.mRootPath) == 0) {
                key = key.substring(this.mRootPath.length);
            }
            if (this.isErrorRes(key)) {
                egret.callLater(callback.onResItemError, callback, key);
                return;
            }
            //key = this.getH5CrossOrignPath(key)
            var icbList = this.mItemCallbackMap[key];
            if (icbList == null) {
                icbList = this.mItemCallbackMap[key] = [];
            }
            if (icbList.indexOf(callback) != -1) {
                //TLog.Debug("loadResAsyn %s already be loading!", key);
                return;
            }
            icbList.push(callback);
            if (type != null) {
                this.mResExplicitType[key] = type;
            }
            if (this.mbSearchZipFirst) {
                if (this.loadZipRes(key)) {
                    return;
                }
            }
            if (RES.hasRes(key)) {
                RES.getResAsync(key, this.onItemLoadSuccess, this);
            }
            else {
                //key = this.mRootPath + key;
                var path = this.mRootPath + this.getPathInterval(key);
                if (this.checkResItemCache(key, this.mRootPath)) {
                    return;
                }
                if (isRemote && this.mRemotePath != "") {
                    path = this.mRemotePath + path;
                }
                //RES.getResByUrl(path, this.onItemLoadSuccess, this, type);
                this.mLoadQueue.push({ path: path, type: type });
                this.nextLoadQueue();
            }
        };
        ResManager.prototype.releaseLoadThread = function () {
            if (this.mLoadCount > 0) {
                this.mLoadCount--;
            }
        };
        ResManager.prototype.nextLoadQueue = function () {
            while (this.mLoadCount < this.mLoadMaxCount && this.mLoadQueue.length > 0) {
                var info = this.mLoadQueue.shift();
                if (info == null)
                    break;
                RES.getResByUrl(info.path, this.onItemLoadSuccess, this, info.type);
                this.mLoadCount++;
            }
        };
        ResManager.prototype.destroyRes = function (path) {
            RES.destroyRes(path, true);
            this.clearResPath(path);
        };
        ResManager.prototype.clearResPath = function (path) {
            delete this.mPath2ResItem[path];
        };
        ResManager.prototype.cancelResAsyn = function (callback) {
            for (var k in this.mItemCallbackMap) {
                var icbList = this.mItemCallbackMap[k];
                var idx = icbList.indexOf(callback);
                if (idx != -1) {
                    icbList.splice(idx, 1);
                }
            }
        };
        ResManager.prototype.getRes = function (key) {
            return RES.getRes(key);
        };
        //同时加载多少资源
        ResManager.prototype.setMaxThreadCount = function (count) {
            this.mLoadMaxCount = count;
        };
        //最大的错误次数，默认3次
        ResManager.prototype.setMaxErrorTimes = function (times) {
            this.mErrorMaxTryTimes = times;
        };
        ResManager.prototype.clearErrorRes = function () {
            this.mErrorResPathMap = {};
        };
        ResManager.prototype.addZipPacket = function (key, callback, bExpand) {
            key = key.replace(/\\/g, "/");
            var zip = this.mZipList[key];
            if (zip) {
                if (callback)
                    callback.onZipItemLoad(key, 0);
                return;
            }
            var _this = this;
            var zipCallback = {
                onResItemLoad: function (res) {
                    var zipkey = res.getKey();
                    var zip = JSZip(res.getData());
                    if (zip) {
                        //res.retain();
                        if (bExpand) {
                            var expandZipObjList = zip.file(/.+/g); //解压缩zip全部文件
                            if (_this.mZipExpandList[zipkey] == null) {
                                _this.mZipExpandList[zipkey] = {};
                            }
                            for (var _i = 0, expandZipObjList_1 = expandZipObjList; _i < expandZipObjList_1.length; _i++) {
                                var zipobj = expandZipObjList_1[_i];
                                _this.mZipExpandList[zipkey][zipobj.name] = zipobj;
                            }
                        }
                        _this.mZipList[zipkey] = zip;
                        if (callback)
                            callback.onZipItemLoad(res.getKey(), 0);
                    }
                    else {
                        if (callback)
                            callback.onZipItemLoad(key, -1);
                    }
                },
                onResItemError: function (key) {
                    if (callback)
                        callback.onZipItemLoad(key, -1);
                }
            };
            this.loadResAsyn(key, zipCallback, core.ResourceType.TYPE_BIN);
        };
        ResManager.prototype.removeZipPacket = function (key) {
            key = key.replace(/\\/g, "/");
            if (key in this.mZipList) {
                delete this.mZipList[key];
            }
            if (key in this.mZipExpandList) {
                delete this.mZipExpandList[key];
            }
        };
        ResManager.prototype.removeZipExpandCache = function (key) {
            if (key in this.mZipExpandList) {
                delete this.mZipExpandList[key];
            }
        };
        ResManager.prototype.getZipPacketCount = function () {
            var count = 0;
            for (var k in this.mZipList) {
                count++;
            }
            return count;
        };
        //modify:crossOrigin
        // public startH5CrossOrigin(crossRootPath: string) {
        // 	if (crossRootPath == null)
        // 	 	return;
        // 	this.mbH5CrossOrign = true
        // 	//重新设置跨域
        // 	var vc: RES.VersionController = new RES.web.Html5VersionController();
        // 	vc.getVirtualUrl = function (url: string): string {
        // 		return crossRootPath + url;
        // 	}
        // 	RES.registerVersionController(vc);
        // 	RES.registerAnalyzer( RES.ResourceItem.TYPE_IMAGE, core.CrossJsonpImageAnalyzer);
        // }
        // private getH5CrossOrignPath(path: string): string {
        // 	if (this.mbH5CrossOrign == false)
        // 		return path;
        // 	if (path.indexOf(".png") != -1 ||
        // 		path.indexOf(".jpg") != -1 ||
        // 		path.indexOf(".jpeg") != -1) {
        // 		return path + ".js";
        // 	}
        // 	return path;
        // }
        //=========================事件响应=====================================
        // private onConfigComplete(event:RES.ResourceEvent):void {
        // 	if(this.mConfigCallback){
        // 		this.mConfigCallback.onResConfigResult(0);
        // 	}
        // }
        // private onConfigError(event:RES.ResourceEvent):void {
        // 	if(this.mConfigCallback){
        // 		this.mConfigCallback.onResConfigResult(-1);
        // 	}
        // }
        // private onGroupLoadComplete(event:RES.ResourceEvent):void {
        // 	var groupName = event.groupName;
        // 	var cbList:ResGroupCallback[] = this.mGroupCallbackMap[groupName];
        // 	if(cbList){
        // 		cbList.forEach((cb:ResGroupCallback)=>{
        // 			cb.onResGroupResult(groupName, 0);
        // 		});
        // 		delete this.mGroupCallbackMap[groupName];
        // 	}
        // }
        // private onGroupLoadError(event:RES.ResourceEvent):void {
        // 	var groupName = event.groupName;
        // 	var cbList:ResGroupCallback[] = this.mGroupCallbackMap[groupName];
        // 	if(cbList){
        // 		cbList.forEach((cb:ResGroupCallback)=>{
        // 			cb.onResGroupResult(groupName, -1);
        // 		});
        // 		delete this.mGroupCallbackMap[groupName];
        // 	}
        // 	TLog.Warn("onGroupLoadError:" + groupName + " has failed to load");
        // }
        // private onGroupProgress(event:RES.ResourceEvent):void {
        // 	var groupName = event.groupName;
        // 	var cbList:ResGroupCallback[] = this.mGroupCallbackMap[groupName];
        // 	if(cbList){
        // 		cbList.forEach((cb:ResGroupCallback)=>{
        // 			cb.onResGroupProgress(groupName, event.itemsLoaded, event.itemsTotal);
        // 		});
        // 	}
        // }
        ResManager.prototype.checkResItemCache = function (key, rootPath) {
            var path = rootPath + this.getPathInterval(key);
            var resItem = this.mPath2ResItem[path];
            if (resItem != null) {
                resItem.retain();
                egret.callLater(this.onResItemLoad, this, resItem);
                return true;
            }
            return false;
        };
        ResManager.prototype.onResItemLoad = function (resItem) {
            var key = resItem.getKey();
            var icbList = this.mItemCallbackMap[key];
            if (icbList) {
                icbList.forEach(function (cb) {
                    cb.onResItemLoad(resItem);
                });
                delete this.mItemCallbackMap[key];
            }
            delete this.mResExplicitType[key];
            resItem.release();
        };
        ResManager.prototype.onItemLoadSuccess = function (data, key, fromzip) {
            if (data != null) {
                fromzip = !!fromzip;
                var path = key;
                if (this.mRemotePath != "" && key.indexOf(this.mRemotePath) == 0) {
                    key = key.substring(this.mRemotePath.length);
                }
                if (this.mRootPath != "" && key.indexOf(this.mRootPath) == 0) {
                    key = key.substring(this.mRootPath.length);
                }
                if (this.mLanguagePath != "" && key.indexOf(this.mLanguagePath) == 0) {
                    key = key.substring(this.mLanguagePath.length);
                }
                delete this.mErrorResPathMap[key];
                var resItem = this.mPath2ResItem[path];
                if (resItem == null) {
                    resItem = core.ResItem.createObj(key, path, data, fromzip);
                    this.mPath2ResItem[path] = resItem;
                }
                resItem.retain();
                this.onResItemLoad(resItem);
            }
            //加载新的资源
            if (!fromzip) {
                this.releaseLoadThread();
                this.nextLoadQueue();
            }
        };
        ResManager.prototype.isErrorRes = function (key) {
            var times = this.mErrorResPathMap[key];
            if (times != null && times >= this.mErrorMaxTryTimes)
                return true;
            return false;
        };
        ResManager.prototype.onResByUrlError = function (path, e) {
            this.releaseLoadThread();
            if (!e.__resource_manager_error__) {
                console.error(e.stack);
                throw e;
            }
            var key = path;
            if (this.mRemotePath != "" && key.indexOf(this.mRemotePath) == 0) {
                key = key.substring(this.mRemotePath.length);
            }
            if (this.mRootPath != "" && key.indexOf(this.mRootPath) == 0) {
                key = key.substring(this.mRootPath.length);
            }
            if (this.mLanguagePath != "" && key.indexOf(this.mLanguagePath) == 0) {
                key = key.substring(this.mLanguagePath.length);
            }
            var errorTimes = this.mErrorResPathMap[key];
            if (errorTimes == null) {
                errorTimes = 0;
            }
            errorTimes = errorTimes + 1;
            this.mErrorResPathMap[key] = errorTimes;
            //再试一次
            if (errorTimes < this.mErrorMaxTryTimes) {
                RES.host.state[path] = 0;
                //RES.getResByUrl(path, this.onItemLoadSuccess, this, this.mResExplicitType[key]);
                var type = this.mResExplicitType[key];
                this.mLoadQueue.push({ path: path, type: type });
                this.nextLoadQueue();
            }
            else {
                this.onItemLoadError(key);
            }
        };
        //private onItemLoadError(event: RES.ResourceEvent): void {
        ResManager.prototype.onItemLoadError = function (key) {
            // if (event.groupName != "") {//组加载中的失败文件
            // 	// var groupName = event.groupName;
            // 	// var cbList:ResGroupCallback[] = this.mGroupCallbackMap[groupName];
            // 	// if(cbList){
            // 	// 	cbList.forEach((cb:ResGroupCallback)=>{
            // 	// 		cb.onResGroupItemError(groupName, event.resItem.name);
            // 	// 	});
            // 	// }
            // } else {
            // var key: string = event.resItem.name;
            // if (this.mRemotePath != "" && key.indexOf(this.mRemotePath) == 0) {
            // 	key = key.substring(this.mRemotePath.length);
            // }
            // if (this.mRootPath != "" && key.indexOf(this.mRootPath) == 0) {
            // 	key = key.substring(this.mRootPath.length);
            // }
            // if (this.mLanguagePath != "" && key.indexOf(this.mLanguagePath) == 0) {
            // 	key = key.substring(this.mLanguagePath.length);
            // }
            if (this.mbSearchZipFirst == false) {
                if (this.loadZipRes(key)) {
                    return;
                }
            }
            var icbList = this.mItemCallbackMap[key];
            if (icbList) {
                icbList.forEach(function (cb) {
                    cb.onResItemError(key);
                });
                delete this.mItemCallbackMap[key];
            }
            delete this.mResExplicitType[key];
            //}
            //加载新的资源
            this.nextLoadQueue();
            TLog.Error("onItemLoadError:" + key + " has failed to load");
        };
        return ResManager;
    }(TClass));
    core.ResManager = ResManager;
    __reflect(ResManager.prototype, "core.ResManager");
})(core || (core = {}));
var core;
(function (core) {
    var SoundManager = (function (_super) {
        __extends(SoundManager, _super);
        function SoundManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        SoundManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mEffectResList = [];
            this.mMusicResList = [];
            this.mMaxEffectCacheCount = 20;
            this.mMaxMusicCacheCount = 3;
            this.mMusicChannel = null;
            this.mCurrentMusicName = "";
            this.mLastMusicName = "";
            this.mMusicLoop = true;
            this.mSoundChannelMap = {};
        };
        //子类复写 析构函数
        SoundManager.prototype.destory = function () {
        };
        SoundManager.prototype.setMaxCache = function (effctCount, musicCount) {
            this.mMaxEffectCacheCount = effctCount;
            this.mMaxMusicCacheCount = musicCount;
        };
        SoundManager.prototype.playSoundImp = function (sound, bEffect) {
            if (sound == null)
                return;
            if (bEffect) {
                var lastChannel = this.mSoundChannelMap[sound.hashCode];
                if (lastChannel) {
                    try {
                        lastChannel.stop();
                    }
                    catch (e) {
                    }
                }
                sound.type = egret.Sound.EFFECT;
                this.mSoundChannelMap[sound.hashCode] = sound.play(0, 1);
            }
            else {
                if (this.mMusicChannel) {
                    try {
                        this.mMusicChannel.stop();
                    }
                    catch (e) {
                    }
                    this.mMusicChannel = null;
                }
                sound.type = egret.Sound.MUSIC;
                var loopFlag = -1;
                if (this.mMusicLoop == false) {
                    loopFlag = 1;
                }
                this.mMusicChannel = sound.play(0, loopFlag);
                //this.mMusicChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
            }
        };
        // public onSoundComplete(event:egret.Event):void{
        // 	let target = event.target;
        // 	console.log("onSoundComplete");
        // }
        SoundManager.prototype.playEffect = function (name) {
            var _this = this;
            //TLog.Debug("SoundManager.playEffect:" + name )
            if (this.mEffectResList.length > this.mMaxEffectCacheCount) {
                this.mEffectResList.forEach(function (res) {
                    var sound = res.getData();
                    var channel = _this.mSoundChannelMap[sound.hashCode];
                    if (channel) {
                        channel.stop();
                        delete _this.mSoundChannelMap[sound.hashCode];
                    }
                    res.release();
                });
                this.mEffectResList.length = 0;
            }
            for (var i = 0; i < this.mEffectResList.length; i++) {
                var resItem = this.mEffectResList[i];
                if (resItem.getKey() == name) {
                    this.playSoundImp(resItem.getData(), true);
                    return;
                }
            }
            var self = this;
            var callback = {
                onResItemLoad: function (res) {
                    var sound = res.getData();
                    res.retain();
                    self.mEffectResList.push(res);
                    self.playSoundImp(sound, true);
                },
                onResItemError: function (key) {
                }
            };
            core.ResManager.getInstance().loadResAsyn(name, callback, core.ResourceType.TYPE_SOUND);
        };
        SoundManager.prototype.playMusic = function (name, loop) {
            if (this.mCurrentMusicName == name) {
                return;
            }
            //TLog.Debug("SoundManager.playMusic:" + name )
            if (!name) {
                TLog.Error("SoundManager.playMusic name == null");
                return;
            }
            if (loop == null) {
                loop = true;
            }
            this.mMusicLoop = loop;
            if (this.mMusicResList.length > this.mMaxMusicCacheCount) {
                this.mMusicResList.forEach(function (res) {
                    res.release();
                });
                this.mMusicResList.length = 0;
            }
            for (var i = 0; i < this.mMusicResList.length; i++) {
                var resItem = this.mMusicResList[i];
                if (resItem.getKey() == name) {
                    this.mCurrentMusicName = name;
                    this.playSoundImp(resItem.getData(), false);
                    return;
                }
            }
            this.mLastMusicName = this.mCurrentMusicName;
            this.mCurrentMusicName = name;
            core.ResManager.getInstance().loadResAsyn(name, this, core.ResourceType.TYPE_SOUND);
        };
        SoundManager.prototype.stop = function () {
            if (this.mMusicChannel) {
                this.mMusicChannel.stop();
                this.mMusicChannel = null;
            }
            this.mCurrentMusicName = "";
        };
        SoundManager.prototype.clear = function () {
            this.stop();
            if (this.mEffectResList.length > this.mMaxEffectCacheCount) {
                this.mEffectResList.forEach(function (res) {
                    var sound = res.getData();
                    sound.close();
                    res.release();
                });
                this.mEffectResList.length = 0;
            }
            if (this.mMusicResList.length > this.mMaxMusicCacheCount) {
                this.mMusicResList.forEach(function (res) {
                    var sound = res.getData();
                    sound.close();
                    res.release();
                });
                this.mMusicResList.length = 0;
            }
        };
        //音乐回调
        SoundManager.prototype.onResItemLoad = function (res) {
            res.retain();
            this.mMusicResList.push(res);
            if (this.mCurrentMusicName == res.getKey()) {
                this.stop();
                this.playSoundImp(res.getData(), false);
            }
        };
        SoundManager.prototype.onResItemError = function (key) {
            this.mCurrentMusicName = this.mLastMusicName;
        };
        return SoundManager;
    }(TClass));
    core.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "core.SoundManager", ["core.ResItemCallback"]);
})(core || (core = {}));
var core;
(function (core) {
    ;
    var TextureEvent = (function (_super) {
        __extends(TextureEvent, _super);
        function TextureEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextureEvent.TextureDisposeEvent = "TextureDisposeEvent";
        TextureEvent.TextureWarnEvent = "TextureWarnEvent";
        return TextureEvent;
    }(core.EventArgs));
    core.TextureEvent = TextureEvent;
    __reflect(TextureEvent.prototype, "core.TextureEvent");
    var TextureRes = (function () {
        function TextureRes() {
        }
        return TextureRes;
    }());
    __reflect(TextureRes.prototype, "TextureRes");
    var TextureManager = (function (_super) {
        __extends(TextureManager, _super);
        function TextureManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextureManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTextureResMap = {};
            this.mCallbackMap = {};
            this.mCheckTime = 5000;
            this.mDisposeTime = 60000;
            this.delayTime = 0;
            this.mTextNodeCleanList = [];
            this.mTextNodeMaxCount = 1000;
            this.mTextNodeCleanTime = 10 * 60000;
            this.mTextNodeMaxCount = 10;
            this.mTextNodeCleanTime = 10 * 60000;
            this.mMaxTextureMemorySize = 0;
            this.mCheckMemoryTime = 0;
            this.mCheckMemoryDuring = 0;
            this.mGraphicCleanList = [];
        };
        TextureManager.prototype.destory = function () {
            for (var k in this.mTextureResMap) {
                var textureRes = this.mTextureResMap[k];
                textureRes.res.release();
            }
            this.mTextureResMap = {};
        };
        TextureManager.prototype.setAutoDisposeTime = function (checkTime, disposeTime) {
            this.mCheckTime = checkTime;
            this.mDisposeTime = disposeTime;
        };
        //文字纹理存活时间、最大数量；图形纹理存活时间、最大数量
        TextureManager.prototype.setAutoTextAndGraphicsDispose = function (maxTextCount, maxTextTime, maxGraphicCount, maxGraphicTime) {
            this.mTextNodeMaxCount = maxTextCount;
            this.mTextNodeCleanTime = maxTextTime;
            this.mGraphicMaxCount = maxGraphicCount;
            this.mGraphicCleanTime = maxGraphicTime;
        };
        TextureManager.prototype.setMaxTextureMemory = function (checkTime, maxBytes) {
            this.mCheckMemoryTime = checkTime;
            this.mMaxTextureMemorySize = maxBytes;
        };
        TextureManager.prototype.loadTextureAsyn = function (key, callback) {
            key = key.replace(/\\/g, "/");
            var textureRes = this.mTextureResMap[key];
            if (textureRes) {
                var resItem = textureRes.res;
                var texture = resItem.getData();
                callback.onAsynTextureSucceed(key, texture, resItem);
                return;
            }
            var callbackList = this.mCallbackMap[key];
            if (callbackList == null) {
                callbackList = this.mCallbackMap[key] = [];
            }
            if (callbackList.indexOf(callback) != -1) {
                return;
            }
            callbackList.push(callback);
            var resMgr = core.ResManager.getInstance();
            resMgr.loadResAsyn(key, this, core.ResourceType.TYPE_IMAGE);
        };
        TextureManager.prototype.cancelTextureAsyn = function (key, callback) {
            var callbackList = this.mCallbackMap[key];
            if (callbackList) {
                var idx = callbackList.indexOf(callback);
                if (idx != -1) {
                    callbackList.splice(idx);
                }
            }
        };
        TextureManager.prototype.cancelTextureAsynAll = function (callback) {
            for (var key in this.mCallbackMap) {
                this.cancelTextureAsyn(key, callback);
            }
        };
        //清空所有无用的纹理
        TextureManager.prototype.cleanUpCacheTexture = function () {
            this.onUpdate(true);
        };
        TextureManager.prototype.getTextureWebGL = function (texture) {
            var stage = Application.getInstance().getStageNode();
            var bitmapData = texture.bitmapData;
            if (bitmapData && bitmapData.webGLTexture == null) {
                var buffer = stage.$displayList.renderBuffer;
                if (buffer != null && buffer.context != null && buffer.context["getWebGLTexture"] != null) {
                    var context = buffer.context;
                    bitmapData.webGLTexture = context["getWebGLTexture"].call(context, bitmapData);
                }
            }
        };
        TextureManager.prototype.onResItemLoad = function (res) {
            var key = res.getKey();
            var texture = res.getData();
            var callbackList = this.mCallbackMap[key];
            if (callbackList.length > 0 && texture.bitmapData != null) {
                if (this.mTextureResMap[key] == null) {
                    this.getTextureWebGL(texture);
                    res.retain();
                    var textureRes = new TextureRes;
                    textureRes.res = res;
                    textureRes.noUseBeginTime = -1;
                    this.mTextureResMap[key] = textureRes;
                }
                callbackList.forEach(function (callback) {
                    callback.onAsynTextureSucceed(key, texture, res);
                });
                delete this.mCallbackMap[key];
            }
        };
        TextureManager.prototype.onResItemError = function (key) {
            delete this.mCallbackMap[key];
        };
        TextureManager.prototype.getTexture = function (key) {
            var res = this.mTextureResMap[key];
            if (res) {
                return res.res.getData();
            }
            return null;
        };
        //bitmap的引用，当display加入到舞台会+1，从舞台移除会-1（详细查看egret.Bitmap源码）
        TextureManager.prototype.checkBitmapRefrence = function (bitmapData) {
            var _displayList = egret.BitmapData._displayList;
            var tempList = _displayList[bitmapData.hashCode];
            if (tempList) {
                return tempList.length;
            }
            return 0;
        };
        TextureManager.prototype.onUpdateCleanTextAndGraphicNodeList = function (bforce) {
            var _this = this;
            //文字纹理
            if (this.mTextNodeCleanList.length > 0) {
                var disposeList = [];
                for (var i = 0; i < this.mTextNodeCleanList.length; i++) {
                    var textNode = this.mTextNodeCleanList[i];
                    if (textNode.$texture == null) {
                        disposeList.push(textNode);
                        continue;
                    }
                    var beginTime = textNode["_beginTime_"];
                    if (bforce == true || core.TimeStamp.CurrentTime - beginTime > this.mTextNodeCleanTime) {
                        disposeList.push(textNode);
                    }
                }
                if (disposeList.length > 0) {
                    disposeList.forEach(function (textNode) {
                        JsUtil.arrayRemoveVal(_this.mTextNodeCleanList, textNode);
                        textNode.clean();
                    });
                }
            }
            //图形纹理
            if (this.mGraphicCleanList.length > 0) {
                var disposeList = [];
                var usingList = [];
                for (var i = 0; i < this.mGraphicCleanList.length; i++) {
                    var graphicNode = this.mGraphicCleanList[i];
                    var bindDisplayNode = graphicNode.$targetDisplay;
                    if (bindDisplayNode != null && bindDisplayNode.stage != null) {
                        usingList.push(graphicNode);
                        continue;
                    }
                    var beginTime = graphicNode["_beginTime_"];
                    if (bforce == true || core.TimeStamp.CurrentTime - beginTime > this.mGraphicCleanTime) {
                        disposeList.push(graphicNode);
                    }
                }
                //正在使用的
                if (usingList.length > 0) {
                    usingList.forEach(function (graphicNode) {
                        JsUtil.arrayRemoveVal(_this.mGraphicCleanList, graphicNode);
                    });
                }
                //可以清理纹理的
                if (disposeList.length > 0) {
                    disposeList.forEach(function (graphicNode) {
                        JsUtil.arrayRemoveVal(_this.mGraphicCleanList, graphicNode);
                        if (graphicNode.$renderNode) {
                            graphicNode.$renderNode.clean();
                        }
                    });
                }
            }
        };
        TextureManager.prototype.caculateTextureMemory = function () {
            var ARGBSize = 4;
            var textureMemory = 0;
            var textMemory = 0;
            var graphicMemory = 0;
            for (var k in this.mTextureResMap) {
                var textureRes = this.mTextureResMap[k];
                var texture = textureRes.res.getData();
                var bitmapSize = texture.$bitmapWidth * texture.$bitmapHeight * ARGBSize;
                textureMemory += bitmapSize;
            }
            for (var i = 0; i < this.mTextNodeCleanList.length; i++) {
                var textNode = this.mTextNodeCleanList[i];
                if (textNode.$texture != null) {
                    var size = textNode.$textureWidth * textNode.$textureHeight * ARGBSize;
                    textMemory += size;
                }
            }
            for (var i = 0; i < this.mGraphicCleanList.length; i++) {
                var graphic = this.mGraphicCleanList[i];
                var graphicNode = graphic.$renderNode;
                if (graphicNode.$texture != null) {
                    var size = graphicNode.$textureWidth * graphicNode.$textureHeight * ARGBSize;
                    graphicMemory += size;
                }
            }
            var allMemory = textureMemory + textMemory + graphicMemory;
            return allMemory;
        };
        TextureManager.prototype.onUpdate = function (bforce) {
            var _this = this;
            if (bforce === void 0) { bforce = false; }
            //检查bitmapData是否没有引用了
            this.delayTime += core.TimeStamp.DelayTime;
            if (bforce == true || this.delayTime > this.mCheckTime) {
                var validTime = core.TimeStamp.CurrentTime - this.mDisposeTime;
                var disposeList = [];
                for (var k in this.mTextureResMap) {
                    var textureRes = this.mTextureResMap[k];
                    var texture = textureRes.res.getData();
                    var bitmapData = texture.bitmapData;
                    TLog.Assert(bitmapData != null);
                    if (this.checkBitmapRefrence(bitmapData) == 0 && textureRes.res.getReferenceCount() == 1) {
                        if (textureRes.noUseBeginTime < 0) {
                            textureRes.noUseBeginTime = core.TimeStamp.CurrentTime;
                        }
                    }
                    else {
                        textureRes.noUseBeginTime = -1;
                    }
                    //纹理的不使用时间，小于指定时间（validTime）
                    if (textureRes.noUseBeginTime >= 0 && (bforce || textureRes.noUseBeginTime < validTime)) {
                        disposeList.push(textureRes);
                    }
                }
                if (disposeList.length > 0) {
                    disposeList.forEach(function (textureRes) {
                        var res = textureRes.res;
                        var key = res.getKey();
                        delete _this.mTextureResMap[key];
                        res.release(); //Res的ImageAnalyzer会析构纹理
                        //通知引用纹理的地方做清理处理
                        var event = TextureEvent.createObj();
                        event.path = key;
                        _this.fireEvent(core.TextureEvent.TextureDisposeEvent, event);
                    });
                    //CollectGarbage()
                }
                //清理延时的纹理
                this.onUpdateCleanTextAndGraphicNodeList(bforce);
                this.delayTime = 0;
            }
            if (bforce == false && this.mMaxTextureMemorySize > 0) {
                this.mCheckMemoryDuring += core.TimeStamp.DelayTime;
                if (this.mCheckMemoryDuring > this.mCheckMemoryTime) {
                    this.mCheckMemoryDuring = 0;
                    var currentSize = this.caculateTextureMemory();
                    if (currentSize > this.mMaxTextureMemorySize) {
                        var event_1 = TextureEvent.createObj();
                        this.fireEvent(core.TextureEvent.TextureWarnEvent, event_1);
                    }
                }
            }
        };
        ////////////////////////////////////////////////////////////////////////
        //缓存TextNode和Graphic，定时清理
        TextureManager.prototype.addCleanGraphic = function (graphicNode) {
            if (graphicNode == null || this.mGraphicCleanList.indexOf(graphicNode) != -1) {
                return;
            }
            graphicNode["_beginTime_"] = core.TimeStamp.CurrentTime;
            this.mGraphicCleanList.push(graphicNode);
            if (this.mGraphicCleanList.length > this.mGraphicCleanTime) {
                for (var _i = 0, _a = this.mGraphicCleanList; _i < _a.length; _i++) {
                    var graphicNode_1 = _a[_i];
                    var bindDisplayNode = graphicNode_1.$targetDisplay;
                    if (bindDisplayNode != null && bindDisplayNode.stage != null) {
                        continue;
                    }
                    if (graphicNode_1.$renderNode) {
                        graphicNode_1.$renderNode.clean();
                    }
                }
                this.mGraphicCleanList = [];
                TLog.Warn("=====auto clean:max [graphic texture] count has exceed limit: %d!", this.mGraphicMaxCount);
            }
        };
        //待清理的文本纹理
        TextureManager.prototype.addCleanTextNode = function (textNode) {
            if (textNode == null || this.mTextNodeCleanList.indexOf(textNode) != -1) {
                return;
            }
            textNode["_beginTime_"] = core.TimeStamp.CurrentTime;
            this.mTextNodeCleanList.push(textNode);
            if (this.mTextNodeCleanList.length > this.mTextNodeMaxCount) {
                for (var _i = 0, _a = this.mTextNodeCleanList; _i < _a.length; _i++) {
                    var textNode_1 = _a[_i];
                    textNode_1.clean();
                }
                this.mTextNodeCleanList = [];
                TLog.Warn("=====auto clean:max [text texture] count has exceed limit: %d!", this.mTextNodeMaxCount);
            }
        };
        TextureManager.prototype.removeCleanTextNode = function (textNode) {
            if (textNode == null)
                return;
            var index = this.mTextNodeCleanList.indexOf(textNode);
            if (index == -1)
                return;
            this.mTextNodeCleanList.splice(index, 1);
        };
        return TextureManager;
    }(core.EventSet));
    core.TextureManager = TextureManager;
    __reflect(TextureManager.prototype, "core.TextureManager", ["core.ResItemCallback"]);
})(core || (core = {}));
var core;
(function (core) {
    var AutoreleasePool = (function (_super) {
        __extends(AutoreleasePool, _super);
        function AutoreleasePool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AutoreleasePool.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this._managedObjectArray = [];
        };
        AutoreleasePool.prototype.addObject = function (obj) {
            TLog.Assert(obj.retain != null && obj.release != null);
            // if(this._managedObjectArray.indexOf(obj) != -1)
            // 	return;
            this._managedObjectArray.push(obj);
        };
        AutoreleasePool.prototype.clear = function () {
            if (this._managedObjectArray.length > 0) {
                this._managedObjectArray.forEach(function (obj) {
                    obj.release();
                });
                this._managedObjectArray.length = 0;
            }
        };
        return AutoreleasePool;
    }(TClass));
    core.AutoreleasePool = AutoreleasePool;
    __reflect(AutoreleasePool.prototype, "core.AutoreleasePool");
})(core || (core = {}));
var BinaryStream = (function (_super) {
    __extends(BinaryStream, _super);
    function BinaryStream(buffer) {
        var _this = _super.call(this, buffer) || this;
        _this.setNetMode(false);
        return _this;
    }
    BinaryStream.prototype.setNetMode = function (b) {
        if (b) {
            this.endian = egret.Endian.BIG_ENDIAN;
        }
        else {
            this.endian = egret.Endian.LITTLE_ENDIAN;
        }
    };
    BinaryStream.prototype.readString = function () {
        return this.readUTF();
    };
    BinaryStream.prototype.readUInt = function () {
        return this.readUnsignedInt();
    };
    BinaryStream.prototype.readUShort = function () {
        return this.readUnsignedShort();
    };
    BinaryStream.prototype.readUChar = function () {
        return this.readUnsignedByte();
    };
    BinaryStream.prototype.readChar = function () {
        return this.readByte();
    };
    BinaryStream.prototype.writeString = function (value) {
        this.writeUTF(value);
    };
    BinaryStream.prototype.writeUInt = function (value) {
        this.writeUnsignedInt(value);
    };
    BinaryStream.prototype.writeUShort = function (value) {
        this.writeUnsignedShort(value);
    };
    BinaryStream.prototype.writeUChar = function (value) {
        this.writeByte(value);
    };
    BinaryStream.prototype.writeChar = function (value) {
        this.writeByte(value);
    };
    return BinaryStream;
}(egret.ByteArray));
__reflect(BinaryStream.prototype, "BinaryStream");
var core;
(function (core) {
    var ConfigFile = (function () {
        function ConfigFile() {
            //super();
            this.mData = {};
        }
        ConfigFile.prototype.initWithJson = function (data) {
            TLog.Assert(data != null);
            for (var k in data) {
                this.mData[k] = data[k];
            }
        };
        ConfigFile.prototype.getString = function (k, def) {
            var val = this.mData[k];
            if (typeof val == "string") {
                return val;
            }
            else if (val) {
                return val.toString();
            }
            return def || "";
        };
        ConfigFile.prototype.getNumber = function (k, def) {
            var val = this.mData[k];
            if (typeof val == "number") {
                return val;
            }
            else {
                var numVal = Number(val).valueOf();
                if (!isNaN(numVal)) {
                    return numVal;
                }
            }
            return def || 0;
        };
        ConfigFile.prototype.getBoolean = function (k, def) {
            var val = this.mData[k];
            if (val === undefined) {
                return !!def;
            }
            return !!val;
        };
        ConfigFile.prototype.getData = function (k, def) {
            var val = this.mData[k];
            if (val === undefined) {
                return def;
            }
            return val;
        };
        return ConfigFile;
    }());
    core.ConfigFile = ConfigFile;
    __reflect(ConfigFile.prototype, "core.ConfigFile");
})(core || (core = {}));
// TypeScript file
var core;
(function (core) {
    // export class Rect extends egret.Rectangle{
    //     setLTRB(l:number, t:number, r:number, b:number):void{
    //         this.left = l;
    //         this.top = t;
    //         this.right = r;
    //         this.bottom = b;
    //     }
    // }
    // export class Point extends egret.Point{
    // }
    var EgretUtil = (function () {
        function EgretUtil() {
        }
        EgretUtil.Rectangle_setLTRB = function (rect, l, t, r, b) {
            rect.left = l;
            rect.top = t;
            rect.right = r;
            rect.bottom = b;
        };
        EgretUtil.nodeToStageXY = function (node, fromX, fromY) {
            var outPoint = new egret.Point;
            var m = node.$getConcatenatedMatrix();
            m.transformPoint(fromX, fromY, outPoint);
            return outPoint;
        };
        EgretUtil.stageToNodeXY = function (node, stageX, stageY) {
            var outPoint = new egret.Point;
            var m = node.$getInvertedConcatenatedMatrix();
            m.transformPoint(stageX, stageY, outPoint);
            return outPoint;
        };
        EgretUtil.hitTestRect = function (node, stageX, stageY) {
            var outPoint = new egret.Point;
            var m = node.$getInvertedConcatenatedMatrix();
            m.transformPoint(stageX, stageY, outPoint);
            return outPoint.x >= 0 && outPoint.y >= 0 && outPoint.x <= node.width && outPoint.y <= node.height;
        };
        return EgretUtil;
    }());
    core.EgretUtil = EgretUtil;
    __reflect(EgretUtil.prototype, "core.EgretUtil");
})(core || (core = {}));
// TypeScript file
var core;
(function (core) {
    var ErrorReport = (function (_super) {
        __extends(ErrorReport, _super);
        function ErrorReport() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        ErrorReport.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mUrl = "";
            this.mParamMsg = "";
            this.mbEnable = false;
            this.mParamList = {};
            this.mbSend = false;
        };
        //子类复写 析构函数
        ErrorReport.prototype.destory = function () {
        };
        ErrorReport.prototype.setReportUrl = function (url) {
            this.mUrl = url;
        };
        ErrorReport.prototype.setUserParamMsg = function (params) {
            this.mParamMsg = params;
        };
        ErrorReport.prototype.addUserParam = function (key, val) {
            if (key == null || key == "")
                return;
            if (val == null) {
                delete this.mParamList[key];
            }
            else {
                this.mParamList[key] = val;
            }
            var paramsMsg = "";
            for (var k in this.mParamList) {
                var v = this.mParamList[k];
                var msg = k + "=" + v;
                if (paramsMsg != "") {
                    msg = "&" + msg;
                }
                paramsMsg = paramsMsg + msg;
            }
            this.setUserParamMsg(paramsMsg);
        };
        ErrorReport.prototype.setReportEnable = function (bEnable) {
            this.mbEnable = true;
        };
        ErrorReport.prototype.isReportEnable = function () {
            return this.mbEnable;
        };
        ErrorReport.prototype.captureError = function (error) {
            TLog.Error(error.stack);
            if (this.mbEnable == false || this.mUrl == "") {
                return;
            }
            if (this.mbSend)
                return;
            this.mbSend = true;
            var httpRequest = new egret.HttpRequest();
            httpRequest.open(this.mUrl, egret.HttpMethod.POST);
            //if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //}
            var errorMsg = error.stack;
            //errorMsg = errorMsg.replace(/\(.+\)/g, "")
            var sendData = "";
            if (this.mParamMsg == "") {
                sendData = String.format("luaError=%s", errorMsg);
            }
            else {
                sendData = String.format("%s&luaError=%s", this.mParamMsg, errorMsg);
            }
            httpRequest.send(sendData);
        };
        return ErrorReport;
    }(TClass));
    core.ErrorReport = ErrorReport;
    __reflect(ErrorReport.prototype, "core.ErrorReport");
})(core || (core = {}));
// TypeScript file
var JsUtil = (function () {
    function JsUtil() {
    }
    //========================begin array========================
    JsUtil.arrayPush = function (list, val) {
        if (list.indexOf(val) == -1) {
            list.push(val);
            return true;
        }
        return false;
    };
    //按lua的table.insert参数传入
    JsUtil.arrayInstert = function (list, pos, value) {
        if (value == null) {
            value = pos;
            //pos = 0;
            pos = list.length;
        }
        // if(pos === undefined){
        //     pos = 0;
        // }
        list.splice(pos, 0, value);
    };
    JsUtil.arrayRemove = function (list, pos) {
        if (list.length <= 0)
            return null;
        if (pos == null) {
            pos = list.length - 1;
        }
        var val = list[pos];
        list.splice(pos, 1);
        return val;
    };
    JsUtil.arrayRemoveVal = function (list, val) {
        var index = list.indexOf(val);
        if (index == -1)
            return false;
        list.splice(index, 1);
        return true;
    };
    JsUtil.arrayExsit = function (list, val) {
        for (var i = 0; i < list.length; i++) {
            var v = list[i];
            if (v == val) {
                return true;
            }
        }
        return false;
    };
    //========================end array========================
    //========================begin object========================
    //回调如果返回true，则终止循环
    JsUtil.objectForEach = function (m, callback) {
        if (Array.isArray(m)) {
            var list = m;
            for (var i = 0; i < list.length; i++) {
                var v = m[i];
                var result = !!callback(v, i);
                if (result) {
                    return;
                }
            }
        }
        else {
            for (var k in m) {
                var v = m[k];
                var result = !!callback(v, k);
                if (result) {
                    return;
                }
            }
        }
    };
    JsUtil.objectCopy = function (m) {
        if (m == null)
            return null;
        if (typeof m != "object")
            return m;
        var copy = null;
        if (Array.isArray(m)) {
            copy = [];
            for (var k = 0; k < m.length; k++) {
                var v = m[k];
                if (typeof v == "object" && v != null) {
                    copy[k] = this.objectCopy(v);
                }
                else {
                    copy[k] = v;
                }
            }
        }
        else {
            copy = {};
            for (var k in m) {
                if (k != "prototype" && m.hasOwnProperty(k)) {
                    var v = m[k];
                    if (typeof v == "object" && v != null) {
                        copy[k] = this.objectCopy(v);
                    }
                    else {
                        copy[k] = v;
                    }
                }
            }
        }
        return copy;
    };
    //复制指定对象
    JsUtil.objectCopyEx = function (newObj, srcObj) {
        if (newObj == null || srcObj == null)
            return false;
        if (Array.isArray(srcObj)) {
            for (var k = 0; k < srcObj.length; k++) {
                newObj[k] = this.objectCopy(srcObj[k]);
            }
        }
        else {
            for (var k in srcObj) {
                if (k != "prototype" && srcObj.hasOwnProperty(k)) {
                    newObj[k] = this.objectCopy(srcObj[k]);
                }
            }
        }
        return true;
    };
    JsUtil.objectFindIndexWithValue = function (obj, val) {
        for (var k in obj) {
            var v = obj[k];
            if (v == val)
                return k;
        }
        return null;
    };
    //========================end object========================
    //========================begin json========================
    //str->obj
    JsUtil.JsonEncode = function (obj) {
        return JSON.stringify(obj, null, 1);
    };
    //obj->str
    JsUtil.JsonDecode = function (str) {
        return JSON.parse(str);
    };
    //删除控制字符后
    JsUtil.JsonDecodeSafeFormat = function (str) {
        str = str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
        return JSON.parse(str);
    };
    //========================begin json========================
    //========================begin global========================
    JsUtil.UrlEncode = function (str) {
        return encodeURI(str);
    };
    JsUtil.UrlDecode = function (str) {
        return decodeURI(str);
    };
    JsUtil.toString = function (obj) {
        return String(obj);
    };
    JsUtil.toNumber = function (str, def) {
        if (str == "")
            return def;
        var v = Number(str);
        if (isNaN(v)) {
            return def;
        }
        return v;
    };
    JsUtil.isNaN = function (obj) {
        return isNaN(obj);
    };
    JsUtil.isFinite = function (obj) {
        return isFinite(obj);
    };
    JsUtil.parseFloat = function (str) {
        return parseFloat(str);
    };
    JsUtil.parseInt = function (str, radix) {
        return parseInt(str, radix);
    };
    //========================end global========================
    JsUtil.loadScript = function (path, callback) {
        if (egret.Capabilities.runtimeType != egret.RuntimeType.WEB) {
            TLog.Error("loadJsScript", path);
            return;
        }
        var s = document.createElement('script');
        //s.async = false;
        s.src = path;
        var listner = null;
        listner = function () {
            s.parentNode.removeChild(s);
            s.removeEventListener('load', listner, false);
            if (callback)
                callback();
        };
        s.addEventListener('load', listner, false);
        document.body.appendChild(s);
    };
    return JsUtil;
}());
__reflect(JsUtil.prototype, "JsUtil");
/*
* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
* Digest Algorithm, as defined in RFC 1321.
* Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*/
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var core;
(function (core) {
    function getMd5String(str) {
        var md5Str = new md5().hex_md5(str);
        return md5Str;
    }
    core.getMd5String = getMd5String;
    var md5 = (function () {
        function md5() {
            this.hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
            this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
        }
        /*
         * These are the privates you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        md5.prototype.hex_md5 = function (s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
        md5.prototype.b64_md5 = function (s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
        md5.prototype.any_md5 = function (s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
        md5.prototype.hex_hmac_md5 = function (k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
        md5.prototype.b64_hmac_md5 = function (k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
        md5.prototype.any_hmac_md5 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
        /*
         * Perform a simple self-test to see if the VM is working
         */
        md5.prototype.md5_vm_test = function () {
            return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
        };
        /*
         * Calculate the MD5 of a raw string
         */
        md5.prototype.rstr_md5 = function (s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        md5.prototype.rstr_hmac_md5 = function (key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        };
        /*
         * Convert a raw string to a hex string
         */
        md5.prototype.rstr2hex = function (input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)
                    + hex_tab.charAt(x & 0x0F);
            }
            return output;
        };
        /*
         * Convert a raw string to a base-64 string
         */
        md5.prototype.rstr2b64 = function (input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        };
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        md5.prototype.rstr2any = function (input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }
            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        };
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        md5.prototype.str2rstr_utf8 = function (input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }
                /* Encode output as utf-8 */
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            }
            return output;
        };
        /*
         * Encode a string as utf-16
         */
        md5.prototype.str2rstr_utf16le = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        };
        md5.prototype.str2rstr_utf16be = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
            return output;
        };
        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        md5.prototype.rstr2binl = function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            return output;
        };
        /*
         * Convert an array of little-endian words to a string
         */
        md5.prototype.binl2rstr = function (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            return output;
        };
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        md5.prototype.binl_md5 = function (x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return [a, b, c, d];
        };
        /*
         * These privates implement the four basic operations the algorithm uses.
         */
        md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        };
        md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        };
        md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        };
        md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };
        md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        };
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        md5.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        md5.prototype.bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        return md5;
    }());
    __reflect(md5.prototype, "md5");
})(core || (core = {}));
// TypeScript file
var core;
(function (core) {
    var TimeStamp = (function () {
        function TimeStamp() {
        }
        TimeStamp.DelayTime = 0;
        TimeStamp.CurrentTime = 0;
        TimeStamp.CurrentFrame = 0;
        return TimeStamp;
    }());
    core.TimeStamp = TimeStamp;
    __reflect(TimeStamp.prototype, "core.TimeStamp");
    function getCpuTime() {
        return egret.getTimer();
    }
    core.getCpuTime = getCpuTime;
})(core || (core = {}));
// TypeScript file
var TLog = (function () {
    function TLog() {
    }
    TLog.Debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.s_bEnable)
            return;
        console.log.apply(console, ["Debug:" + message].concat(optionalParams));
    };
    TLog.Warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.s_bEnable)
            return;
        console.warn.apply(console, ["Warn:" + message].concat(optionalParams));
    };
    TLog.Error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        // if(!this.s_bEnable)
        //     return;
        console.error.apply(console, ["Error:" + message].concat(optionalParams));
    };
    TLog.Assert = function (test, message) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        if (!this.s_bEnable)
            return true;
        //console.assert(test, message, ...optionalParams);
        if (test === 0) {
            return;
        }
        if (!test) {
            //alert(String.format(message, optionalParams));
            throw new Error(String.format(message, optionalParams));
            //return false;
        }
        return true;
        //console.trace(message, optionalParams);
    };
    TLog.Throw = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.s_bEnable)
            return;
        throw new Error(String.format(message, optionalParams));
    };
    TLog.SetEnable = function (b) {
        this.s_bEnable = b;
    };
    TLog.s_bEnable = true;
    return TLog;
}());
__reflect(TLog.prototype, "TLog");
var TXML = (function () {
    function TXML() {
    }
    TXML.parse = function (data, root) {
        if (root) {
            data = "<root>" + data + "</root>";
        }
        var resultXML = null;
        try {
            resultXML = egret.XML.parse(data);
        }
        catch (error) {
            TLog.Error("xml error:" + data);
            resultXML = null;
        }
        return resultXML;
    };
    TXML.findChild = function (xml, name) {
        var len = xml.children.length;
        for (var i = 0; i < len; i++) {
            var v = xml.children[i];
            if (v.nodeType == 1) {
                var child = v;
                if (child.name == name) {
                    return child;
                }
            }
        }
        return null;
    };
    TXML.queryText = function (xml) {
        var len = xml.children.length;
        for (var i = 0; i < len; i++) {
            var v = xml.children[i];
            if (v.nodeType == 3) {
                var child = v;
                return child.text;
            }
        }
        return "";
    };
    TXML.queryIntText = function (xml, def) {
        var str = TXML.queryText(xml);
        var result = parseInt(str);
        if (isNaN(result) == true) {
            return def;
        }
        return result;
    };
    TXML.queryAttribute = function (xml, attName, def) {
        if (def == null) {
            def = "";
        }
        if (attName in xml.attributes) {
            return xml.attributes[attName];
        }
        return def;
    };
    TXML.queryIntAttribute = function (xml, attName, def) {
        var str = TXML.queryAttribute(xml, attName);
        var result = parseInt(str);
        if (isNaN(result) == true) {
            return def;
        }
        return result;
    };
    TXML.forEach = function (xml, callback) {
        var len = xml.children.length;
        for (var i = 0; i < len; i++) {
            var v = xml.children[i];
            if (v.nodeType == 1) {
                callback(v);
            }
        }
    };
    return TXML;
}());
__reflect(TXML.prototype, "TXML");
// TypeScript file
var core;
(function (core) {
    var XXTEA_DELTA = 0x9e3779b9;
    var XXTEA_Uint32Array = new Uint32Array(1);
    function xxtea_long_encrypt(v, len, k) {
        var n = len - 1;
        var z = v[n], y = v[0], delta = 0x9E3779B9;
        var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = 0;
        while (0 < q--) {
            sum = sum + delta & 0xffffffff;
            e = sum >>> 2 & 3;
            for (p = 0; p < n; p++) {
                y = v[p + 1];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                z = v[p] = v[p] + mx & 0xffffffff;
            }
            y = v[0];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            z = v[n] = v[n] + mx & 0xffffffff;
        }
    }
    function xxtea_long_decrypt(v, len, k) {
        var n = len - 1;
        var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
        var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff;
        while (sum != 0) {
            e = sum >>> 2 & 3;
            for (p = n; p > 0; p--) {
                z = v[p - 1];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                y = v[p] = v[p] - mx & 0xffffffff;
            }
            z = v[n];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            y = v[0] = v[0] - mx & 0xffffffff;
            sum = sum - delta & 0xffffffff;
        }
    }
    ///////////////////////////////////////////////////////////////////
    function xxtea_to_long_array(buffer, data, len, include_length) {
        //xxtea_long i, n, *result;
        //let dataUint32: Uint32Array = new Uint32Array(data.buffer);
        var result = null;
        var ret_len = 0;
        var n = len >> 2;
        n = (((len & 3) == 0) ? n : n + 1);
        if (include_length) {
            result = buffer ? new Uint32Array(buffer.buffer) : new Uint32Array((n + 1) << 2);
            result[n] = len;
            ret_len = n + 1;
        }
        else {
            result = buffer ? new Uint32Array(buffer.buffer) : new Uint32Array(n << 2);
            ret_len = n;
        }
        for (var i = 0; i < len; i++) {
            result[i >> 2] |= data[i] << ((i & 3) << 3);
        }
        return [result, ret_len];
    }
    function xxtea_to_byte_array(data, len, include_length) {
        // xxtea_long i, n, m;
        // unsigned char * result;
        var i = 0, n = 0, m = 0;
        n = len << 2;
        if (include_length) {
            m = data[len - 1];
            if ((m < n - 7) || (m > n - 4)) {
                return null;
            }
            n = m;
        }
        var result = new Uint8Array(n);
        for (i = 0; i < n; i++) {
            result[i] = ((data[i >> 2] >> ((i & 3) << 3)) & 0xff);
        }
        return result;
    }
    function xxteaEncrypt(data, len, key) {
        // xxtea_long *v, *k, v_len, k_len;
        // char buffer[32];
        var buffer = new Uint8Array(32);
        var _a = xxtea_to_long_array(null, data, len, 1), v = _a[0], v_len = _a[1];
        var _b = xxtea_to_long_array(buffer, key, 16, 0), k = _b[0], k_len = _b[1];
        xxtea_long_encrypt(v, v_len, k);
        var ret = xxtea_to_byte_array(v, v_len, 0);
        return ret;
    }
    core.xxteaEncrypt = xxteaEncrypt;
    function xxteaDecrypt(data, len, key) {
        var buffer = new Uint8Array(32);
        var _a = xxtea_to_long_array(null, data, len, 0), v = _a[0], v_len = _a[1];
        var _b = xxtea_to_long_array(buffer, key, 16, 0), k = _b[0], k_len = _b[1];
        xxtea_long_decrypt(v, v_len, k);
        var ret = xxtea_to_byte_array(v, v_len, 1);
        return ret;
    }
    core.xxteaDecrypt = xxteaDecrypt;
})(core || (core = {}));
// TypeScript file
var gui;
(function (gui) {
    var Color;
    (function (Color) {
        Color[Color["aliceblue"] = 15792383] = "aliceblue";
        Color[Color["antiquewhite"] = 16444375] = "antiquewhite";
        Color[Color["aqua"] = 65535] = "aqua";
        Color[Color["aquamarine"] = 8388564] = "aquamarine";
        Color[Color["azure"] = 15794175] = "azure";
        Color[Color["beige"] = 16119260] = "beige";
        Color[Color["bisque"] = 16770244] = "bisque";
        Color[Color["black"] = 0] = "black";
        Color[Color["blanchedalmond"] = 16772045] = "blanchedalmond";
        Color[Color["blue"] = 255] = "blue";
        Color[Color["blueviolet"] = 9055202] = "blueviolet";
        Color[Color["brown"] = 10824234] = "brown";
        Color[Color["burlywood"] = 14596231] = "burlywood";
        Color[Color["cadetblue"] = 6266528] = "cadetblue";
        Color[Color["chartreuse"] = 8388352] = "chartreuse";
        Color[Color["chocolate"] = 13789470] = "chocolate";
        Color[Color["coral"] = 16744272] = "coral";
        Color[Color["cornflowerblue"] = 6591981] = "cornflowerblue";
        Color[Color["cornsilk"] = 16775388] = "cornsilk";
        Color[Color["crimson"] = 14423100] = "crimson";
        Color[Color["cyan"] = 65535] = "cyan";
        Color[Color["darkblue"] = 139] = "darkblue";
        Color[Color["darkcyan"] = 35723] = "darkcyan";
        Color[Color["darkgoldenrod"] = 12092939] = "darkgoldenrod";
        Color[Color["darkgray"] = 11119017] = "darkgray";
        Color[Color["darkgreen"] = 25600] = "darkgreen";
        Color[Color["darkkhaki"] = 12433259] = "darkkhaki";
        Color[Color["darkmagenta"] = 9109643] = "darkmagenta";
        Color[Color["darkolivegreen"] = 5597999] = "darkolivegreen";
        Color[Color["darkorange"] = 16747520] = "darkorange";
        Color[Color["darkorchid"] = 10040012] = "darkorchid";
        Color[Color["darkred"] = 9109504] = "darkred";
        Color[Color["darksalmon"] = 15308410] = "darksalmon";
        Color[Color["darkseagreen"] = 9419915] = "darkseagreen";
        Color[Color["darkslateblue"] = 4734347] = "darkslateblue";
        Color[Color["darkslategray"] = 3100495] = "darkslategray";
        Color[Color["darkturquoise"] = 52945] = "darkturquoise";
        Color[Color["darkviolet"] = 9699539] = "darkviolet";
        Color[Color["deeppink"] = 16716947] = "deeppink";
        Color[Color["deepskyblue"] = 49151] = "deepskyblue";
        Color[Color["dimgray"] = 6908265] = "dimgray";
        Color[Color["dodgerblue"] = 2003199] = "dodgerblue";
        Color[Color["firebrick"] = 11674146] = "firebrick";
        Color[Color["floralwhite"] = 16775920] = "floralwhite";
        Color[Color["forestgreen"] = 2263842] = "forestgreen";
        Color[Color["fuchsia"] = 16711935] = "fuchsia";
        Color[Color["gainsboro"] = 14474460] = "gainsboro";
        Color[Color["ghostwhite"] = 16316671] = "ghostwhite";
        Color[Color["gold"] = 16766720] = "gold";
        Color[Color["goldenrod"] = 14329120] = "goldenrod";
        Color[Color["gray"] = 8421504] = "gray";
        Color[Color["green"] = 32768] = "green";
        Color[Color["greenyellow"] = 11403055] = "greenyellow";
        Color[Color["honeydew"] = 15794160] = "honeydew";
        Color[Color["hotpink"] = 16738740] = "hotpink";
        Color[Color["indianred"] = 13458524] = "indianred";
        Color[Color["indigo"] = 4915330] = "indigo";
        Color[Color["ivory"] = 16777200] = "ivory";
        Color[Color["khaki"] = 15787660] = "khaki";
        Color[Color["lavender"] = 15132410] = "lavender";
        Color[Color["lavenderblush"] = 16773365] = "lavenderblush";
        Color[Color["lawngreen"] = 8190976] = "lawngreen";
        Color[Color["lemonchiffon"] = 16775885] = "lemonchiffon";
        Color[Color["lightblue"] = 11393254] = "lightblue";
        Color[Color["lightcoral"] = 15761536] = "lightcoral";
        Color[Color["lightcyan"] = 14745599] = "lightcyan";
        Color[Color["lightgoldenrodyellow"] = 16448210] = "lightgoldenrodyellow";
        Color[Color["lightgreen"] = 9498256] = "lightgreen";
        Color[Color["lightgrey"] = 13882323] = "lightgrey";
        Color[Color["lightpink"] = 16758465] = "lightpink";
        Color[Color["lightsalmon"] = 16752762] = "lightsalmon";
        Color[Color["lightseagreen"] = 2142890] = "lightseagreen";
        Color[Color["lightskyblue"] = 8900346] = "lightskyblue";
        Color[Color["lightslategray"] = 7833753] = "lightslategray";
        Color[Color["lightsteelblue"] = 11584734] = "lightsteelblue";
        Color[Color["lightyellow"] = 16777184] = "lightyellow";
        Color[Color["lime"] = 65280] = "lime";
        Color[Color["limegreen"] = 3329330] = "limegreen";
        Color[Color["linen"] = 16445670] = "linen";
        Color[Color["magenta"] = 16711935] = "magenta";
        Color[Color["maroon"] = 8388608] = "maroon";
        Color[Color["mediumaquamarine"] = 6737322] = "mediumaquamarine";
        Color[Color["mediumblue"] = 205] = "mediumblue";
        Color[Color["mediumorchid"] = 12211667] = "mediumorchid";
        Color[Color["mediumpurple"] = 9662683] = "mediumpurple";
        Color[Color["mediumseagreen"] = 3978097] = "mediumseagreen";
        Color[Color["mediumslateblue"] = 8087790] = "mediumslateblue";
        Color[Color["mediumspringgreen"] = 64154] = "mediumspringgreen";
        Color[Color["mediumturquoise"] = 4772300] = "mediumturquoise";
        Color[Color["mediumvioletred"] = 13047173] = "mediumvioletred";
        Color[Color["midnightblue"] = 1644912] = "midnightblue";
        Color[Color["mintcream"] = 16121850] = "mintcream";
        Color[Color["mistyrose"] = 16770273] = "mistyrose";
        Color[Color["moccasin"] = 16770229] = "moccasin";
        Color[Color["navajowhite"] = 16768685] = "navajowhite";
        Color[Color["navy"] = 128] = "navy";
        Color[Color["oldlace"] = 16643558] = "oldlace";
        Color[Color["olive"] = 8421376] = "olive";
        Color[Color["olivedrab"] = 7048739] = "olivedrab";
        Color[Color["orange"] = 16753920] = "orange";
        Color[Color["orangered"] = 16729344] = "orangered";
        Color[Color["orchid"] = 14315734] = "orchid";
        Color[Color["palegoldenrod"] = 15657130] = "palegoldenrod";
        Color[Color["palegreen"] = 10025880] = "palegreen";
        Color[Color["paleturquoise"] = 11529966] = "paleturquoise";
        Color[Color["palevioletred"] = 14381203] = "palevioletred";
        Color[Color["papayawhip"] = 16773077] = "papayawhip";
        Color[Color["peachpuff"] = 16767673] = "peachpuff";
        Color[Color["peru"] = 13468991] = "peru";
        Color[Color["pink"] = 16761035] = "pink";
        Color[Color["plum"] = 14524637] = "plum";
        Color[Color["powderblue"] = 11591910] = "powderblue";
        Color[Color["purple"] = 8388736] = "purple";
        Color[Color["red"] = 16711680] = "red";
        Color[Color["rosybrown"] = 12357519] = "rosybrown";
        Color[Color["royalblue"] = 4286945] = "royalblue";
        Color[Color["saddlebrown"] = 9127187] = "saddlebrown";
        Color[Color["salmon"] = 16416882] = "salmon";
        Color[Color["sandybrown"] = 16032864] = "sandybrown";
        Color[Color["seagreen"] = 3050327] = "seagreen";
        Color[Color["seashell"] = 16774638] = "seashell";
        Color[Color["sienna"] = 10506797] = "sienna";
        Color[Color["silver"] = 12632256] = "silver";
        Color[Color["skyblue"] = 8900331] = "skyblue";
        Color[Color["slateblue"] = 6970061] = "slateblue";
        Color[Color["slategray"] = 7372944] = "slategray";
        Color[Color["snow"] = 16775930] = "snow";
        Color[Color["springgreen"] = 65407] = "springgreen";
        Color[Color["steelblue"] = 4620980] = "steelblue";
        Color[Color["tan"] = 13808780] = "tan";
        Color[Color["teal"] = 32896] = "teal";
        Color[Color["thistle"] = 14204888] = "thistle";
        Color[Color["tomato"] = 16737095] = "tomato";
        Color[Color["turquoise"] = 4251856] = "turquoise";
        Color[Color["violet"] = 15631086] = "violet";
        Color[Color["wheat"] = 16113331] = "wheat";
        Color[Color["white"] = 16777215] = "white";
        Color[Color["whitesmoke"] = 16119285] = "whitesmoke";
        Color[Color["yellow"] = 16776960] = "yellow";
        Color[Color["yellowgreen"] = 10145074] = "yellowgreen";
        Color[Color["ublack"] = 4535083] = "ublack";
        Color[Color["zongse"] = 4530441] = "zongse";
        Color[Color["zongse02"] = 4535083] = "zongse02";
        Color[Color["rouse"] = 15190421] = "rouse";
        Color[Color["rouse02"] = 16703170] = "rouse02";
        Color[Color["lvse"] = 14151544] = "lvse";
        Color[Color["hongse"] = 16658223] = "hongse";
        Color[Color["lvse02"] = 107265] = "lvse02";
    })(Color = gui.Color || (gui.Color = {}));
    function GetColorFromName(colorName) {
        if (gui.ColorTable == null) {
            InitColorTable();
        }
        if (colorName in gui.ColorNameIndexMap) {
            var index = gui.ColorNameIndexMap[colorName];
            return gui.ColorTable[index];
        }
        TLog.Error("GetColorFromName can not get color %s error", colorName);
        return 0;
    }
    gui.GetColorFromName = GetColorFromName;
    function InitColorTable() {
        gui.ColorTable = [];
        gui.ColorNameIndexMap = {};
        gui.ColorTable[0] = Color.aliceblue;
        gui.ColorTable[1] = Color.antiquewhite;
        gui.ColorTable[2] = Color.aqua;
        gui.ColorTable[3] = Color.aquamarine;
        gui.ColorTable[4] = Color.azure;
        gui.ColorTable[5] = Color.beige;
        gui.ColorTable[6] = Color.bisque;
        gui.ColorTable[7] = Color.black;
        gui.ColorTable[8] = Color.blanchedalmond;
        gui.ColorTable[9] = Color.blue;
        gui.ColorTable[10] = Color.blueviolet;
        gui.ColorTable[11] = Color.brown;
        gui.ColorTable[12] = Color.burlywood;
        gui.ColorTable[13] = Color.cadetblue;
        gui.ColorTable[14] = Color.chartreuse;
        gui.ColorTable[15] = Color.chocolate;
        gui.ColorTable[16] = Color.coral;
        gui.ColorTable[17] = Color.cornflowerblue;
        gui.ColorTable[18] = Color.cornsilk;
        gui.ColorTable[19] = Color.crimson;
        gui.ColorTable[20] = Color.cyan;
        gui.ColorTable[21] = Color.darkblue;
        gui.ColorTable[22] = Color.darkcyan;
        gui.ColorTable[23] = Color.darkgoldenrod;
        gui.ColorTable[24] = Color.darkgray;
        gui.ColorTable[25] = Color.darkgreen;
        gui.ColorTable[26] = Color.darkkhaki;
        gui.ColorTable[27] = Color.darkmagenta;
        gui.ColorTable[28] = Color.darkolivegreen;
        gui.ColorTable[29] = Color.darkorange;
        gui.ColorTable[30] = Color.darkorchid;
        gui.ColorTable[31] = Color.darkred;
        gui.ColorTable[32] = Color.darksalmon;
        gui.ColorTable[33] = Color.darkseagreen;
        gui.ColorTable[34] = Color.darkslateblue;
        gui.ColorTable[35] = Color.darkslategray;
        gui.ColorTable[36] = Color.darkturquoise;
        gui.ColorTable[37] = Color.darkviolet;
        gui.ColorTable[38] = Color.deeppink;
        gui.ColorTable[39] = Color.deepskyblue;
        gui.ColorTable[40] = Color.dimgray;
        gui.ColorTable[41] = Color.dodgerblue;
        gui.ColorTable[42] = Color.firebrick;
        gui.ColorTable[43] = Color.floralwhite;
        gui.ColorTable[44] = Color.forestgreen;
        gui.ColorTable[45] = Color.fuchsia;
        gui.ColorTable[46] = Color.gainsboro;
        gui.ColorTable[47] = Color.ghostwhite;
        gui.ColorTable[48] = Color.gold;
        gui.ColorTable[49] = Color.goldenrod;
        gui.ColorTable[50] = Color.gray;
        gui.ColorTable[51] = Color.green;
        gui.ColorTable[52] = Color.greenyellow;
        gui.ColorTable[53] = Color.honeydew;
        gui.ColorTable[54] = Color.hotpink;
        gui.ColorTable[55] = Color.indianred;
        gui.ColorTable[56] = Color.indigo;
        gui.ColorTable[57] = Color.ivory;
        gui.ColorTable[58] = Color.khaki;
        gui.ColorTable[59] = Color.lavender;
        gui.ColorTable[60] = Color.lavenderblush;
        gui.ColorTable[61] = Color.lawngreen;
        gui.ColorTable[62] = Color.lemonchiffon;
        gui.ColorTable[63] = Color.lightblue;
        gui.ColorTable[64] = Color.lightcoral;
        gui.ColorTable[65] = Color.lightcyan;
        gui.ColorTable[66] = Color.lightgoldenrodyellow;
        gui.ColorTable[67] = Color.lightgreen;
        gui.ColorTable[68] = Color.lightgrey;
        gui.ColorTable[69] = Color.lightpink;
        gui.ColorTable[70] = Color.lightsalmon;
        gui.ColorTable[71] = Color.lightseagreen;
        gui.ColorTable[72] = Color.lightskyblue;
        gui.ColorTable[73] = Color.lightslategray;
        gui.ColorTable[74] = Color.lightsteelblue;
        gui.ColorTable[75] = Color.lightyellow;
        gui.ColorTable[76] = Color.lime;
        gui.ColorTable[77] = Color.limegreen;
        gui.ColorTable[78] = Color.linen;
        gui.ColorTable[79] = Color.magenta;
        gui.ColorTable[80] = Color.maroon;
        gui.ColorTable[81] = Color.mediumaquamarine;
        gui.ColorTable[82] = Color.mediumblue;
        gui.ColorTable[83] = Color.mediumorchid;
        gui.ColorTable[84] = Color.mediumpurple;
        gui.ColorTable[85] = Color.mediumseagreen;
        gui.ColorTable[86] = Color.mediumslateblue;
        gui.ColorTable[87] = Color.mediumspringgreen;
        gui.ColorTable[88] = Color.mediumturquoise;
        gui.ColorTable[89] = Color.mediumvioletred;
        gui.ColorTable[90] = Color.midnightblue;
        gui.ColorTable[91] = Color.mintcream;
        gui.ColorTable[92] = Color.mistyrose;
        gui.ColorTable[93] = Color.moccasin;
        gui.ColorTable[94] = Color.navajowhite;
        gui.ColorTable[95] = Color.navy;
        gui.ColorTable[96] = Color.oldlace;
        gui.ColorTable[97] = Color.olive;
        gui.ColorTable[98] = Color.olivedrab;
        gui.ColorTable[99] = Color.orange;
        gui.ColorTable[100] = Color.orangered;
        gui.ColorTable[101] = Color.orchid;
        gui.ColorTable[102] = Color.palegoldenrod;
        gui.ColorTable[103] = Color.palegreen;
        gui.ColorTable[104] = Color.paleturquoise;
        gui.ColorTable[105] = Color.palevioletred;
        gui.ColorTable[106] = Color.papayawhip;
        gui.ColorTable[107] = Color.peachpuff;
        gui.ColorTable[108] = Color.peru;
        gui.ColorTable[109] = Color.pink;
        gui.ColorTable[110] = Color.plum;
        gui.ColorTable[111] = Color.powderblue;
        gui.ColorTable[112] = Color.purple;
        gui.ColorTable[113] = Color.red;
        gui.ColorTable[114] = Color.rosybrown;
        gui.ColorTable[115] = Color.royalblue;
        gui.ColorTable[116] = Color.saddlebrown;
        gui.ColorTable[117] = Color.salmon;
        gui.ColorTable[118] = Color.sandybrown;
        gui.ColorTable[119] = Color.seagreen;
        gui.ColorTable[120] = Color.seashell;
        gui.ColorTable[121] = Color.sienna;
        gui.ColorTable[122] = Color.silver;
        gui.ColorTable[123] = Color.skyblue;
        gui.ColorTable[124] = Color.slateblue;
        gui.ColorTable[125] = Color.slategray;
        gui.ColorTable[126] = Color.snow;
        gui.ColorTable[127] = Color.springgreen;
        gui.ColorTable[128] = Color.steelblue;
        gui.ColorTable[129] = Color.tan;
        gui.ColorTable[130] = Color.teal;
        gui.ColorTable[131] = Color.thistle;
        gui.ColorTable[132] = Color.tomato;
        gui.ColorTable[133] = Color.turquoise;
        gui.ColorTable[134] = Color.violet;
        gui.ColorTable[135] = Color.wheat;
        gui.ColorTable[136] = Color.white;
        gui.ColorTable[137] = Color.whitesmoke;
        gui.ColorTable[138] = Color.yellow;
        gui.ColorTable[139] = Color.yellowgreen;
        gui.ColorTable[140] = Color.zongse;
        gui.ColorTable[141] = Color.zongse02;
        gui.ColorTable[142] = Color.rouse;
        gui.ColorTable[143] = Color.rouse02;
        gui.ColorTable[144] = Color.lvse;
        gui.ColorTable[145] = Color.hongse;
        gui.ColorTable[146] = Color.lvse02;
        gui.ColorTable[147] = Color.ublack;
        gui.ColorNameIndexMap["aliceblue"] = 0;
        gui.ColorNameIndexMap["antiquewhite"] = 1;
        gui.ColorNameIndexMap["aqua"] = 2;
        gui.ColorNameIndexMap["aquamarine"] = 3;
        gui.ColorNameIndexMap["azure"] = 4;
        gui.ColorNameIndexMap["beige"] = 5;
        gui.ColorNameIndexMap["bisque"] = 6;
        gui.ColorNameIndexMap["black"] = 7;
        gui.ColorNameIndexMap["blanchedalmond"] = 8;
        gui.ColorNameIndexMap["blue"] = 9;
        gui.ColorNameIndexMap["blueviolet"] = 10;
        gui.ColorNameIndexMap["brown"] = 11;
        gui.ColorNameIndexMap["burlywood"] = 12;
        gui.ColorNameIndexMap["cadetblue"] = 13;
        gui.ColorNameIndexMap["chartreuse"] = 14;
        gui.ColorNameIndexMap["chocolate"] = 15;
        gui.ColorNameIndexMap["coral"] = 16;
        gui.ColorNameIndexMap["cornflowerblue"] = 17;
        gui.ColorNameIndexMap["cornsilk"] = 18;
        gui.ColorNameIndexMap["crimson"] = 19;
        gui.ColorNameIndexMap["cyan"] = 20;
        gui.ColorNameIndexMap["darkblue"] = 21;
        gui.ColorNameIndexMap["darkcyan"] = 22;
        gui.ColorNameIndexMap["darkgoldenrod"] = 23;
        gui.ColorNameIndexMap["darkgray"] = 24;
        gui.ColorNameIndexMap["darkgreen"] = 25;
        gui.ColorNameIndexMap["darkkhaki"] = 26;
        gui.ColorNameIndexMap["darkmagenta"] = 27;
        gui.ColorNameIndexMap["darkolivegreen"] = 28;
        gui.ColorNameIndexMap["darkorange"] = 29;
        gui.ColorNameIndexMap["darkorchid"] = 30;
        gui.ColorNameIndexMap["darkred"] = 31;
        gui.ColorNameIndexMap["darksalmon"] = 32;
        gui.ColorNameIndexMap["darkseagreen"] = 33;
        gui.ColorNameIndexMap["darkslateblue"] = 34;
        gui.ColorNameIndexMap["darkslategray"] = 35;
        gui.ColorNameIndexMap["darkturquoise"] = 36;
        gui.ColorNameIndexMap["darkviolet"] = 37;
        gui.ColorNameIndexMap["deeppink"] = 38;
        gui.ColorNameIndexMap["deepskyblue"] = 39;
        gui.ColorNameIndexMap["dimgray"] = 40;
        gui.ColorNameIndexMap["dodgerblue"] = 41;
        gui.ColorNameIndexMap["firebrick"] = 42;
        gui.ColorNameIndexMap["floralwhite"] = 43;
        gui.ColorNameIndexMap["forestgreen"] = 44;
        gui.ColorNameIndexMap["fuchsia"] = 45;
        gui.ColorNameIndexMap["gainsboro"] = 46;
        gui.ColorNameIndexMap["ghostwhite"] = 47;
        gui.ColorNameIndexMap["gold"] = 48;
        gui.ColorNameIndexMap["goldenrod"] = 49;
        gui.ColorNameIndexMap["gray"] = 50;
        gui.ColorNameIndexMap["green"] = 51;
        gui.ColorNameIndexMap["greenyellow"] = 52;
        gui.ColorNameIndexMap["honeydew"] = 53;
        gui.ColorNameIndexMap["hotpink"] = 54;
        gui.ColorNameIndexMap["indianred"] = 55;
        gui.ColorNameIndexMap["indigo"] = 56;
        gui.ColorNameIndexMap["ivory"] = 57;
        gui.ColorNameIndexMap["khaki"] = 58;
        gui.ColorNameIndexMap["lavender"] = 59;
        gui.ColorNameIndexMap["lavenderblush"] = 60;
        gui.ColorNameIndexMap["lawngreen"] = 61;
        gui.ColorNameIndexMap["lemonchiffon"] = 62;
        gui.ColorNameIndexMap["lightblue"] = 63;
        gui.ColorNameIndexMap["lightcoral"] = 64;
        gui.ColorNameIndexMap["lightcyan"] = 65;
        gui.ColorNameIndexMap["lightgoldenrodyellow"] = 66;
        gui.ColorNameIndexMap["lightgreen"] = 67;
        gui.ColorNameIndexMap["lightgrey"] = 68;
        gui.ColorNameIndexMap["lightpink"] = 69;
        gui.ColorNameIndexMap["lightsalmon"] = 70;
        gui.ColorNameIndexMap["lightseagreen"] = 71;
        gui.ColorNameIndexMap["lightskyblue"] = 72;
        gui.ColorNameIndexMap["lightslategray"] = 73;
        gui.ColorNameIndexMap["lightsteelblue"] = 74;
        gui.ColorNameIndexMap["lightyellow"] = 75;
        gui.ColorNameIndexMap["lime"] = 76;
        gui.ColorNameIndexMap["limegreen"] = 77;
        gui.ColorNameIndexMap["linen"] = 78;
        gui.ColorNameIndexMap["magenta"] = 79;
        gui.ColorNameIndexMap["maroon"] = 80;
        gui.ColorNameIndexMap["mediumaquamarine"] = 81;
        gui.ColorNameIndexMap["mediumblue"] = 82;
        gui.ColorNameIndexMap["mediumorchid"] = 83;
        gui.ColorNameIndexMap["mediumpurple"] = 84;
        gui.ColorNameIndexMap["mediumseagreen"] = 85;
        gui.ColorNameIndexMap["mediumslateblue"] = 86;
        gui.ColorNameIndexMap["mediumspringgreen"] = 87;
        gui.ColorNameIndexMap["mediumturquoise"] = 88;
        gui.ColorNameIndexMap["mediumvioletred"] = 89;
        gui.ColorNameIndexMap["midnightblue"] = 90;
        gui.ColorNameIndexMap["mintcream"] = 91;
        gui.ColorNameIndexMap["mistyrose"] = 92;
        gui.ColorNameIndexMap["moccasin"] = 93;
        gui.ColorNameIndexMap["navajowhite"] = 94;
        gui.ColorNameIndexMap["navy"] = 95;
        gui.ColorNameIndexMap["oldlace"] = 96;
        gui.ColorNameIndexMap["olive"] = 97;
        gui.ColorNameIndexMap["olivedrab"] = 98;
        gui.ColorNameIndexMap["orange"] = 99;
        gui.ColorNameIndexMap["orangered"] = 100;
        gui.ColorNameIndexMap["orchid"] = 101;
        gui.ColorNameIndexMap["palegoldenrod"] = 102;
        gui.ColorNameIndexMap["palegreen"] = 103;
        gui.ColorNameIndexMap["paleturquoise"] = 104;
        gui.ColorNameIndexMap["palevioletred"] = 105;
        gui.ColorNameIndexMap["papayawhip"] = 106;
        gui.ColorNameIndexMap["peachpuff"] = 107;
        gui.ColorNameIndexMap["peru"] = 108;
        gui.ColorNameIndexMap["pink"] = 109;
        gui.ColorNameIndexMap["plum"] = 110;
        gui.ColorNameIndexMap["powderblue"] = 111;
        gui.ColorNameIndexMap["purple"] = 112;
        gui.ColorNameIndexMap["red"] = 113;
        gui.ColorNameIndexMap["rosybrown"] = 114;
        gui.ColorNameIndexMap["royalblue"] = 115;
        gui.ColorNameIndexMap["saddlebrown"] = 116;
        gui.ColorNameIndexMap["salmon"] = 117;
        gui.ColorNameIndexMap["sandybrown"] = 118;
        gui.ColorNameIndexMap["seagreen"] = 119;
        gui.ColorNameIndexMap["seashell"] = 120;
        gui.ColorNameIndexMap["sienna"] = 121;
        gui.ColorNameIndexMap["silver"] = 122;
        gui.ColorNameIndexMap["skyblue"] = 123;
        gui.ColorNameIndexMap["slateblue"] = 124;
        gui.ColorNameIndexMap["slategray"] = 125;
        gui.ColorNameIndexMap["snow"] = 126;
        gui.ColorNameIndexMap["springgreen"] = 127;
        gui.ColorNameIndexMap["steelblue"] = 128;
        gui.ColorNameIndexMap["tan"] = 129;
        gui.ColorNameIndexMap["teal"] = 130;
        gui.ColorNameIndexMap["thistle"] = 131;
        gui.ColorNameIndexMap["tomato"] = 132;
        gui.ColorNameIndexMap["turquoise"] = 133;
        gui.ColorNameIndexMap["violet"] = 134;
        gui.ColorNameIndexMap["wheat"] = 135;
        gui.ColorNameIndexMap["white"] = 136;
        gui.ColorNameIndexMap["whitesmoke"] = 137;
        gui.ColorNameIndexMap["yellow"] = 138;
        gui.ColorNameIndexMap["yellowgreen"] = 139;
        gui.ColorNameIndexMap["zongse"] = 140;
        gui.ColorNameIndexMap["zongse02"] = 141;
        gui.ColorNameIndexMap["rouse"] = 142;
        gui.ColorNameIndexMap["rouse02"] = 143;
        gui.ColorNameIndexMap["lvse"] = 144;
        gui.ColorNameIndexMap["hongse"] = 145;
        gui.ColorNameIndexMap["lvse02"] = 146;
        gui.ColorNameIndexMap["ublack"] = 147;
    }
    gui.InitColorTable = InitColorTable;
})(gui || (gui = {}));
// TypeScript file
var gui;
(function (gui) {
    var TouchEvent = (function () {
        function TouchEvent() {
        }
        TouchEvent.TOUCH_LONG = "LongTouchEvent"; //长按
        TouchEvent.TOUCH_SHORT = "ShortTouchEvent"; //短按  (响应了TOUCH_LONG就不会响应TOUCH_SHORT, 移动了也不响应  TOUCH_TAP无论是否长按都会响应)
        return TouchEvent;
    }());
    gui.TouchEvent = TouchEvent;
    __reflect(TouchEvent.prototype, "gui.TouchEvent");
    var Flag;
    (function (Flag) {
        Flag[Flag["LEFT"] = 0] = "LEFT";
        Flag[Flag["H_CENTER"] = 1] = "H_CENTER";
        Flag[Flag["RIGHT"] = 2] = "RIGHT";
        Flag[Flag["TOP"] = 0] = "TOP";
        Flag[Flag["V_CENTER"] = 4] = "V_CENTER";
        Flag[Flag["BOTTOM"] = 8] = "BOTTOM";
        Flag[Flag["LEFT_TOP"] = 0] = "LEFT_TOP";
        Flag[Flag["LEFT_CENTER"] = 4] = "LEFT_CENTER";
        Flag[Flag["LEFT_BOTTOM"] = 8] = "LEFT_BOTTOM";
        Flag[Flag["CENTER_TOP"] = 1] = "CENTER_TOP";
        Flag[Flag["CENTER_CENTER"] = 5] = "CENTER_CENTER";
        Flag[Flag["CENTER_BOTTOM"] = 9] = "CENTER_BOTTOM";
        Flag[Flag["RIGHT_TOP"] = 2] = "RIGHT_TOP";
        Flag[Flag["RIGHT_CENTER"] = 6] = "RIGHT_CENTER";
        Flag[Flag["RIGHT_BOTTOM"] = 10] = "RIGHT_BOTTOM";
        Flag[Flag["V_REVERSE"] = 16] = "V_REVERSE";
        Flag[Flag["H_REVERSE"] = 32] = "H_REVERSE";
        //BOLD			= 0x0100,//加粗
        //THIN			= 0x0200,//细体
        //ITALIC			= 0x0400,//斜体
        //UNDER_LINE		= 0x0800,//下划线
        //ENGLISH			= 0x1000,//是英文
        //FONT_THREE		= 0x1f00,//前三种相加
        //SHADOW			= 0x2000,//阴影
        //STROKE			= 0x4000,//描边
    })(Flag = gui.Flag || (gui.Flag = {}));
    ;
    var FontFlag;
    (function (FontFlag) {
        FontFlag[FontFlag["BOLD"] = 65536] = "BOLD";
        FontFlag[FontFlag["ITALIC"] = 131072] = "ITALIC";
        FontFlag[FontFlag["UNDER_LINE"] = 262144] = "UNDER_LINE";
        FontFlag[FontFlag["FREE_TYPE_ALL"] = 983040] = "FREE_TYPE_ALL";
        FontFlag[FontFlag["SHADOW"] = 1048576] = "SHADOW";
        FontFlag[FontFlag["STROKE"] = 2097152] = "STROKE";
        // 			SELF_BOLD		= 0x00400000,//自已绘制粗体
        // 			SELF_THIN		= 0x00800000,//细体
        // 			ENGLISH			= 0x01000000,//是英文
    })(FontFlag = gui.FontFlag || (gui.FontFlag = {}));
    ;
    function GetFlagFromName(name) {
        var ret = 0;
        if (name == "LEFT") {
            ret |= Flag.LEFT;
        }
        else if (name == "LEFT") {
            ret |= Flag.LEFT;
        }
        else if (name == "RIGHT") {
            ret |= Flag.RIGHT;
        }
        else if (name == "TOP") {
            ret |= Flag.TOP;
        }
        else if (name == "BOTTOM") {
            ret |= Flag.BOTTOM;
        }
        else if (name == "V_CENTER") {
            ret |= Flag.V_CENTER;
        }
        else if (name == "H_CENTER") {
            ret |= Flag.H_CENTER;
        }
        else if (name == "V_REVERSE") {
            ret |= Flag.V_REVERSE;
        }
        else if (name == "H_REVERSE") {
            ret |= Flag.H_REVERSE;
        }
        return ret;
    }
    gui.GetFlagFromName = GetFlagFromName;
    function GrayComponent(component, bGray) {
        if (bGray) {
            var colorMatrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var grayFlilter = new egret.ColorMatrixFilter(colorMatrix);
            component.filters = [grayFlilter];
        }
        else {
            component.filters = null;
        }
    }
    gui.GrayComponent = GrayComponent;
})(gui || (gui = {}));
// TypeScript file
var gui;
(function (gui) {
    var GUIEvent = (function (_super) {
        __extends(GUIEvent, _super);
        function GUIEvent(type, window) {
            var _this = _super.call(this, type) || this;
            _this.window = window;
            return _this;
        }
        return GUIEvent;
    }(egret.Event));
    gui.GUIEvent = GUIEvent;
    __reflect(GUIEvent.prototype, "gui.GUIEvent");
    var GUIHyperlinkEvent = (function (_super) {
        __extends(GUIHyperlinkEvent, _super);
        function GUIHyperlinkEvent(type, window) {
            var _this = _super.call(this, type, window) || this;
            _this.link = "";
            return _this;
        }
        GUIHyperlinkEvent.prototype.getHyperlink = function () {
            return this.link;
        };
        GUIHyperlinkEvent.prototype.setHyperlink = function (link) {
            this.link = link;
        };
        return GUIHyperlinkEvent;
    }(GUIEvent));
    gui.GUIHyperlinkEvent = GUIHyperlinkEvent;
    __reflect(GUIHyperlinkEvent.prototype, "gui.GUIHyperlinkEvent");
    var GUITranslateWordEvent = (function (_super) {
        __extends(GUITranslateWordEvent, _super);
        function GUITranslateWordEvent(type, window) {
            var _this = _super.call(this, type, window) || this;
            _this.word = "";
            return _this;
        }
        GUITranslateWordEvent.prototype.getTranslateWord = function () {
            return this.word;
        };
        GUITranslateWordEvent.prototype.setTranslateWord = function (word) {
            this.word = word;
        };
        return GUITranslateWordEvent;
    }(GUIEvent));
    gui.GUITranslateWordEvent = GUITranslateWordEvent;
    __reflect(GUITranslateWordEvent.prototype, "gui.GUITranslateWordEvent");
    var GUIDriveEvent = (function (_super) {
        __extends(GUIDriveEvent, _super);
        function GUIDriveEvent(type, touchTarget) {
            var _this = _super.call(this, type) || this;
            _this.handler = 0;
            _this.hoverTarget = touchTarget;
            _this.showDriveTarget = null;
            _this.userData = null;
            return _this;
        }
        GUIDriveEvent.prototype.setDriveBegin = function (bHandle) {
            if (bHandle) {
                this.handler++;
            }
        };
        GUIDriveEvent.prototype.isDriveBegin = function () {
            return this.handler > 0;
        };
        GUIDriveEvent.prototype.setDriveOffXY = function (offx, offy) {
            this.driveOffStageX = offx;
            this.driveOffStageY = offy;
        };
        GUIDriveEvent.prototype.setShowDriveTarget = function (target) {
            this.showDriveTarget = target;
        };
        GUIDriveEvent.prototype.setUserData = function (userData) {
            this.userData = userData;
        };
        GUIDriveEvent.BeginDriveEvent = "BeginDriveEvent"; //开始拖拉
        GUIDriveEvent.EndDriveEvent = "EndDriveEvent"; //结束拖拉
        return GUIDriveEvent;
    }(egret.TouchEvent));
    gui.GUIDriveEvent = GUIDriveEvent;
    __reflect(GUIDriveEvent.prototype, "gui.GUIDriveEvent");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var GuiManager = (function (_super) {
        __extends(GuiManager, _super);
        function GuiManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GuiManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTickList = [];
            this.mTouchTarget = null;
            this.mTouchId = -1;
            this.mTouchBeginTime = -1;
            this.mbFireLongTouch = false;
            this.mbTouchMove = false;
            this.mDriveTargetSaveData = null;
            this.mbTouchDown = false;
            this.mbInputEnableDelay = true;
            this.mbInputEnable = this.mbInputEnableDelay;
            this.mDefaultFont = "";
        };
        GuiManager.prototype.init = function (rootNode, stage) {
            //this.mRootNode = rootNode;
            this.mStage = stage;
            this.mUIRootNode = new egret.DisplayObjectContainer;
            this.mUIRootNode.name = "UIRootNode";
            rootNode.addChild(this.mUIRootNode);
            this.mBottomLayer = new eui.UILayer;
            this.mNormalLayer = new eui.UILayer;
            this.mModalLayer = new gui.ModalLayer;
            this.mTopLayer = new eui.UILayer;
            this.mBottomLayer.name = "BottomLayer";
            this.mBottomLayer.touchEnabled = false;
            this.mNormalLayer.touchEnabled = false;
            this.mNormalLayer.name = "NormalLayer";
            this.mTopLayer.touchEnabled = false;
            this.mTopLayer.name = "TopLayer";
            //this.mModalLayer.touchEnabled = false;//modal层不能穿透
            this.mModalLayer.name = "ModalLayer";
            this.mUIRootNode.addChild(this.mBottomLayer);
            this.mUIRootNode.addChild(this.mNormalLayer);
            this.mUIRootNode.addChild(this.mModalLayer);
            this.mUIRootNode.addChild(this.mTopLayer);
            //注入加载方式：资源和主题
            egret.registerImplementation("eui.IAssetAdapter", new gui.AssetAdapter());
            egret.registerImplementation("eui.IThemeAdapter", new gui.ThemeAdapter());
            this.initGuiTouchEvent();
            this.mDriveDisplayerObject = new egret.DisplayObjectContainer;
        };
        GuiManager.prototype.loadTheme = function (name, callback, thisObj) {
            var theme = new eui.Theme(name, this.mStage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function (evt) {
                callback.call(thisObj, name);
            }, this);
        };
        // public checkValid(parent:egret.DisplayObject){
        // 	if(parent == null)
        // 		return true;
        // 	return parent.parent == this.mUIRootNode;
        // }
        //解析字符串
        GuiManager.prototype.parseLayoutString = function (content) {
            var text = content.trim();
            if (text.charAt(0) == "<") {
                var clazz_ = EXML.parse(text);
                var obj = new clazz_();
                return obj;
            }
            return null;
        };
        //加载布局文件列表
        GuiManager.prototype.loadLayoutAsyn = function (paths, callback, thisObject) {
            var len = paths.length;
            var cur = 0;
            function layoutCallback(clazz, url) {
                cur++;
                if (cur == len) {
                    egret.callLater(callback, thisObject);
                    //callback.call(thisObject);
                }
            }
            for (var i = 0; i < len; i++) {
                EXML.load(paths[i], layoutCallback, this, true);
            }
            // EXML.$loadAll(paths, (classes?:any[], urls?:string[])=>{
            // 	callback.call(thisObject);
            // }, this, true);
        };
        GuiManager.prototype.setDefaultFontName = function (fontName) {
            this.mDefaultFont = fontName;
        };
        GuiManager.prototype.getDefaultFontName = function () {
            return this.mDefaultFont;
        };
        GuiManager.prototype.isRootNode = function (target) {
            if (this.mUIRootNode.getChildIndex(target) == -1)
                return false;
            return true;
        };
        GuiManager.prototype.setNodeLayer = function (node, layer) {
            if (node == null) {
                return;
            }
            var parent = this.getLayerNode(layer);
            parent.addChild(node);
        };
        GuiManager.prototype.getLayerNode = function (layer) {
            if (layer == null) {
                return this.mNormalLayer;
            }
            var node = this.mNormalLayer;
            switch (layer) {
                case 0 /* Bottom */:
                    node = this.mBottomLayer;
                    break;
                case 1 /* Normal */:
                    node = this.mNormalLayer;
                    break;
                case 3 /* Top */:
                    node = this.mTopLayer;
                    break;
                case 2 /* Modal */:
                    node = this.mModalLayer;
                    break;
            }
            return node;
        };
        GuiManager.prototype.addTickCallback = function (callback) {
            var index = this.mTickList.indexOf(callback);
            if (index < 0) {
                this.mTickList.push(callback);
            }
        };
        GuiManager.prototype.removeTickCallback = function (callback) {
            var index = this.mTickList.indexOf(callback);
            if (index >= 0) {
                this.mTickList.splice(index, 1);
            }
        };
        GuiManager.prototype.onUpdate = function () {
            //ControllerManager.getInstance().onUpdate();
            for (var i = 0; i < this.mTickList.length; i++) {
                var v = this.mTickList[i];
                v.onTick();
            }
            if (this.mTouchBeginTime > 0 && this.mbFireLongTouch == false) {
                var nowTime = core.getCpuTime();
                if (nowTime - this.mTouchBeginTime >= 200) {
                    this.onLongTouchEvent();
                }
            }
        };
        GuiManager.prototype.setUIVisible = function (b) {
            this.mUIRootNode.visible = b;
        };
        GuiManager.prototype.isUIVisible = function () {
            return this.mUIRootNode.visible;
        };
        GuiManager.prototype.getPathFromChild = function (target) {
            if (this.mUIRootNode.contains(target) == false)
                return "";
            if (this.mUIRootNode.getChildIndex(target) > 0)
                return "";
            var parent = target;
            var parentList = [];
            while (parent) {
                parentList.push(parent);
                parent = parent.parent;
                //mUIRootNode以及layers都不打印
                if (this.mUIRootNode.getChildIndex(parent) >= 0)
                    break;
            }
            var dumpStr = "";
            if (parentList.length > 0) {
                var strList = [];
                for (var i = parentList.length - 1; i >= 0; i--) {
                    //let p = Object.getPrototypeOf(target);
                    var obj = parentList[i];
                    //if(obj.name != ""){
                    strList.push(obj.name);
                    //}
                }
                dumpStr = strList.join("/");
            }
            return dumpStr;
        };
        GuiManager.prototype.getChildFromPathImp = function (rootNode, pathlist) {
            var targetNode = rootNode;
            var count = 0;
            for (var _i = 0, pathlist_1 = pathlist; _i < pathlist_1.length; _i++) {
                var name_1 = pathlist_1[_i];
                var node = targetNode.getChildByName(name_1);
                if (node == null) {
                    return null;
                }
                count++;
                targetNode = node;
                if (!(targetNode instanceof egret.DisplayObjectContainer)) {
                    break;
                }
            }
            if (count != pathlist.length) {
                return null;
            }
            return targetNode;
        };
        GuiManager.prototype.getChildFromPath = function (path) {
            if (!path) {
                return null;
            }
            var pathlist = path.split("/");
            if (pathlist.length == 0)
                return null;
            var node = this.getChildFromPathImp(this.mTopLayer, pathlist);
            if (node != null)
                return node;
            node = this.getChildFromPathImp(this.mModalLayer, pathlist);
            if (node != null)
                return node;
            node = this.getChildFromPathImp(this.mNormalLayer, pathlist);
            if (node != null)
                return node;
            node = this.getChildFromPathImp(this.mBottomLayer, pathlist);
            if (node != null)
                return node;
            return null;
        };
        GuiManager.prototype.setInputEnable = function (bEnable) {
            if (this.mbTouchDown && bEnable == false) {
                this.mbInputEnableDelay = false;
                this.mbInputEnable = true;
            }
            else {
                this.mbInputEnable = bEnable;
                this.mbInputEnableDelay = bEnable;
            }
        };
        GuiManager.prototype.isInputEnable = function () {
            return this.mbInputEnable;
        };
        GuiManager.prototype.startDriveTouch = function () {
            var event = new gui.GUIDriveEvent(gui.GUIDriveEvent.BeginDriveEvent, this.mTouchTarget);
            event.$initTo(this.mTouchX, this.mTouchY, this.mTouchId);
            this.mTouchTarget.dispatchEvent(event);
            //处理拖拉事件
            if (event.isDriveBegin()) {
                var showTarget = this.mTouchTarget;
                if (event.showDriveTarget != null) {
                    showTarget = event.showDriveTarget;
                }
                var childIndex = showTarget.parent.getChildIndex(showTarget);
                this.mDriveTargetSaveData = {
                    target: this.mTouchTarget,
                    parent: showTarget.parent,
                    x: showTarget.x,
                    y: showTarget.y,
                    showTarget: showTarget,
                    userData: event.userData,
                    childIndex: childIndex
                };
                TLog.Assert(this.mDriveTargetSaveData.parent != null && this.mDriveDisplayerObject.parent == null);
                //设置拖拉对象坐标
                var stagePoint = core.EgretUtil.nodeToStageXY(showTarget, 0, 0);
                var driveBais = 10;
                this.mDriveOffsetX = this.mTouchX - stagePoint.x + driveBais;
                this.mDriveOffsetY = this.mTouchY - stagePoint.y + driveBais;
                this.mDriveDisplayerObject.x = this.mTouchX - this.mDriveOffsetX;
                this.mDriveDisplayerObject.y = this.mTouchY - this.mDriveOffsetY;
                //保存原来的父亲，把当前对象父亲设置为mDriveDisplayerObject
                showTarget.x = 0;
                showTarget.y = 0;
                this.mDriveDisplayerObject.addChild(showTarget);
                this.mTopLayer.addChild(this.mDriveDisplayerObject);
            }
        };
        GuiManager.prototype.stopDriveTouch = function (x, y, touchPointID) {
            if (this.mDriveTargetSaveData == null)
                return;
            //重置父亲
            var showTarget = this.mDriveTargetSaveData.showTarget;
            showTarget.x = this.mDriveTargetSaveData.x;
            showTarget.y = this.mDriveTargetSaveData.y;
            var driveTarget = this.mDriveTargetSaveData.target;
            if (driveTarget.stage == null) {
                this.mDriveTargetSaveData = null;
                return;
            }
            var userData = this.mDriveTargetSaveData.userData;
            this.mDriveTargetSaveData.parent.addChildAt(showTarget, this.mDriveTargetSaveData.childIndex);
            this.mTopLayer.removeChild(this.mDriveDisplayerObject);
            var driveTouchTarget = this.mStage.$hitTest(x, y);
            if (driveTouchTarget) {
                var event_2 = new gui.GUIDriveEvent(gui.GUIDriveEvent.EndDriveEvent, driveTouchTarget);
                event_2.$initTo(x, y, touchPointID);
                event_2.setDriveOffXY(this.mDriveOffsetX, this.mDriveOffsetY);
                event_2.userData = userData;
                driveTarget.dispatchEvent(event_2);
            }
            this.mDriveTargetSaveData = null;
        };
        GuiManager.prototype.moveDriveTouch = function (x, y, touchPointID) {
            if (this.mDriveTargetSaveData == null)
                return;
            this.mDriveDisplayerObject.x = x - this.mDriveOffsetX;
            this.mDriveDisplayerObject.y = y - this.mDriveOffsetY;
        };
        GuiManager.prototype.startTouch = function (x, y, touchPointID) {
            if (this.mTouchId != -1)
                return;
            this.mTouchTarget = this.mStage.$hitTest(x, y);
            this.mTouchBeginTime = -1;
            if (this.mTouchTarget) {
                this.mTouchBeginTime = core.getCpuTime();
            }
            this.mTouchX = x;
            this.mTouchY = y;
            this.mTouchId = touchPointID;
            this.mbTouchMove = false;
            this.mbFireLongTouch = false;
        };
        GuiManager.prototype.stopTouch = function (touchPointID) {
            if (touchPointID != this.mTouchId) {
                return false;
            }
            if (this.mTouchTarget) {
                this.mTouchTarget = null;
                this.mTouchBeginTime = -1;
            }
            this.mbFireLongTouch = false;
            this.mbTouchMove = false;
            this.mTouchId = -1;
            return true;
        };
        GuiManager.prototype.isTouchMove = function () {
            return this.mbTouchMove;
        };
        GuiManager.prototype.onLongTouchEvent = function () {
            if (!this.mbFireLongTouch && this.mTouchTarget != null) {
                this.mbFireLongTouch = true;
                egret.TouchEvent.dispatchTouchEvent(this.mTouchTarget, gui.TouchEvent.TOUCH_LONG, true, true, this.mTouchX, this.mTouchY, this.mTouchId, true);
                this.startDriveTouch();
            }
        };
        GuiManager.prototype.initGuiTouchEvent = function () {
            var stageObj = this.mStage;
            var _this = this;
            var delta = 3;
            var onTouchBegin = egret.sys.TouchHandler.prototype.onTouchBegin;
            egret.sys.TouchHandler.prototype.onTouchBegin = function (x, y, touchPointID) {
                if (!_this.mbInputEnable)
                    return;
                _this.mbTouchDown = true;
                onTouchBegin.call(this, x, y, touchPointID);
                _this.startTouch(x, y, touchPointID);
            };
            var onTouchMove = egret.sys.TouchHandler.prototype.onTouchMove;
            egret.sys.TouchHandler.prototype.onTouchMove = function (x, y, touchPointID) {
                if (!_this.mbInputEnable)
                    return;
                onTouchMove.call(this, x, y, touchPointID);
                if (this.mTouchId == touchPointID && Math.abs(_this.mTouchX - x) > delta || Math.abs(_this.mTouchY - y) > delta) {
                    //if(_this.mTouchX != x || _this.mTouchY != y){
                    _this.moveDriveTouch(x, y, touchPointID);
                    _this.mbTouchMove = true;
                    //_this.stopLongTouch();
                }
            };
            var onTouchEnd = egret.sys.TouchHandler.prototype.onTouchEnd;
            egret.sys.TouchHandler.prototype.onTouchEnd = function (x, y, touchPointID) {
                if (!_this.mbInputEnable) {
                    _this.stopTouch(touchPointID);
                    return;
                }
                var target = stageObj.$hitTest(x, y);
                onTouchEnd.call(this, x, y, touchPointID);
                //没有长按/没有移动/没有拖拉事件
                if (target != null && _this.mbFireLongTouch == false && _this.mbTouchMove == false && _this.mDriveTargetSaveData == null) {
                    if (_this.mTouchTarget == target)
                        egret.TouchEvent.dispatchTouchEvent(target, gui.TouchEvent.TOUCH_SHORT, true, true, x, y, touchPointID, false);
                }
                if (_this.mDriveTargetSaveData != null) {
                    _this.stopDriveTouch(x, y, touchPointID);
                }
                _this.stopTouch(touchPointID);
                _this.mbTouchDown = false;
                if (_this.mbInputEnableDelay == false) {
                    _this.mbInputEnable = _this.mbInputEnableDelay;
                }
            };
        };
        return GuiManager;
    }(TClass));
    gui.GuiManager = GuiManager;
    __reflect(GuiManager.prototype, "gui.GuiManager");
})(gui || (gui = {}));
// TypeScript file
function OverrideEUIInit() {
    eui.override._init();
}
//在加入舞台时候可以刷新一次资源(因为加入了自动清理纹理机制)
var eui;
(function (eui) {
    var override;
    (function (override) {
        function _init() {
            //override eui.Image
            {
                var _onAddToStage_1 = eui.Image.prototype.$onAddToStage;
                eui.Image.prototype.$onAddToStage = function (stage, nestLevel) {
                    _onAddToStage_1.call(this, stage, nestLevel);
                    //刷新一次image
                    this.sourceChanged = true;
                    this.invalidateProperties();
                };
                var _measureContentBounds_1 = eui.Image.prototype.$measureContentBounds;
                eui.Image.prototype.$measureContentBounds = function (bounds) {
                    _measureContentBounds_1.call(this, bounds);
                    //let image = this.$Bitmap[egret.sys.BitmapKeys.bitmapData];
                    var image = this.$bitmapData;
                    if (!image) {
                        var values = this.$UIComponent;
                        var explicitW = values[8 /* explicitWidth */];
                        var explicitH = values[9 /* explicitHeight */];
                        if (!isNaN(explicitW) && !isNaN(explicitH)) {
                            bounds.setTo(0, 0, explicitW, explicitH);
                        }
                    }
                };
                Object.defineProperty(eui.Image.prototype, "enabled", {
                    get: function () {
                        return !!this._enabled;
                    },
                    set: function (bEnabled) {
                        if (this._enabled == null)
                            this._enabled = true;
                        if (this.lastTouchEnabled == null)
                            this.lastTouchEnabled = true;
                        if (bEnabled != this._enabled) {
                            this._enabled = bEnabled;
                            gui.GrayComponent(this, !bEnabled);
                            if (bEnabled) {
                                this.touchEnabled = this.lastTouchEnabled;
                            }
                            else {
                                this.lastTouchEnabled = this.touchEnabled;
                                this.touchEnabled = false;
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ///////////////////////////可见时加入显示图片/////////////////////////////////////
                eui.Image.prototype["isVisibleOnStage"] = function () {
                    if (this.$stage == null || this.visible == false)
                        return false;
                    var visibleOnStage = true;
                    var p = this.parent;
                    while (p) {
                        if (p == this.$stage) {
                            break;
                        }
                        if (p.visible == false) {
                            visibleOnStage = false;
                            break;
                        }
                        p = p.parent;
                    }
                    return visibleOnStage;
                };
                eui.Image.prototype["onVisibleChange"] = function () {
                    this._visibleChange = false;
                    if (this.$stage == null)
                        return;
                    if (this.isVisibleOnStage()) {
                        var texture = this.$texture;
                        if (texture) {
                            egret.BitmapData.$addDisplayObject(this, texture.$bitmapData);
                        }
                        if (this.sourceChanged || (texture && texture.$bitmapData == null)) {
                            this.parseSource();
                        }
                    }
                    else {
                        var texture = this.$texture;
                        if (texture) {
                            egret.BitmapData.$removeDisplayObject(this, texture.$bitmapData);
                        }
                    }
                };
                var _parseSource_1 = eui.Image.prototype["parseSource"];
                eui.Image.prototype["parseSource"] = function () {
                    if (this.isVisibleOnStage() == false) {
                        if (this.$stage != null) {
                            this.sourceChanged = true;
                        }
                        return;
                    }
                    _parseSource_1.call(this);
                };
                eui.Image.prototype["onParentVisible"] = function (value) {
                    if (!this._visibleChange) {
                        this._visibleChange = true;
                        egret.callLater(this.onVisibleChange, this);
                    }
                };
                var _setVisible_1 = eui.Image.prototype.$setVisible;
                eui.Image.prototype.$setVisible = function (value) {
                    var lastVisible = this.$visible;
                    _setVisible_1.call(this, value);
                    if (lastVisible != value) {
                        if (!this._visibleChange) {
                            this._visibleChange = true;
                            egret.callLater(this.onVisibleChange, this);
                        }
                    }
                };
                ////////////////////////////////////////////////////////////////
            }
            {
                //override eui.Button
                eui.Button.prototype.invalidateState = function () {
                    var superClass = eui.Component;
                    superClass.prototype.invalidateState.call(this);
                    var currentState = this.getCurrentState();
                    gui.GrayComponent(this, currentState == "disabled");
                };
            }
            {
                //override eui.RadioButton
                //移动过程中，不响应选中
                var guiManger_1 = gui.GuiManager.getInstance();
                var superButtonRelease_1 = eui.RadioButton.prototype.buttonReleased;
                eui.RadioButton.prototype.buttonReleased = function () {
                    if (this.shortSelected && guiManger_1.isTouchMove())
                        return;
                    superButtonRelease_1.call(this);
                };
                Object.defineProperty(eui.RadioButton.prototype, "shortSelected", {
                    get: function () {
                        return !!this.$shortSelected;
                    },
                    set: function (value) {
                        this.$shortSelected = value;
                    },
                    enumerable: true,
                    configurable: true
                });
            }
            //override eui.ItemRenderer
            Object.defineProperty(eui.ItemRenderer.prototype, "name", {
                get: function () {
                    if (this.parent == null) {
                        return "";
                    }
                    var index = this.parent.getChildIndex(this);
                    return "item" + index;
                },
                set: function (value) {
                    this.$name = value;
                },
                enumerable: true,
                configurable: true
            });
            {
                //override eui.Scroller
                eui.Scroller.prototype.onTouchEndCapture = function (event) {
                    if (this.$Scroller[12 /* touchCancle */]) {
                        event.stopPropagation();
                        this.onTouchEnd(event);
                        event.$isPropagationStopped = false;
                        event.$bubbles = false;
                        var lastTarget = event.$target;
                        this.dispatchEvent(event);
                        event.$setTarget(lastTarget); //恢复上一次的target
                    }
                };
                eui.Scroller.prototype.onTouchTapCapture = function (event) {
                    if (this.$Scroller[12 /* touchCancle */]) {
                        event.stopPropagation();
                        event.$isPropagationStopped = false;
                        event.$bubbles = false;
                        var lastTarget = event.$target;
                        this.dispatchEvent(event);
                        event.$setTarget(lastTarget); //恢复上一次的target
                    }
                };
            }
            {
                //override eui.DataGroup
                var _onCollectionChange_1 = eui.DataGroup.prototype.onCollectionChange;
                eui.DataGroup.prototype.onCollectionChange = function (event) {
                    _onCollectionChange_1.call(this, event);
                    this._collectionChange = true;
                };
                var _updateDisplayList_1 = eui.DataGroup.prototype.updateDisplayList;
                eui.DataGroup.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                    _updateDisplayList_1.call(this, unscaledWidth, unscaledHeight);
                    if (this._collectionChange == true) {
                        this._collectionChange = false;
                        var _this = this;
                        var scroller = _this.parent;
                        if (scroller instanceof eui.Scroller) {
                            var maxViewH = _this.contentHeight - scroller.height;
                            if (_this.scrollV > maxViewH) {
                                _this.scrollV = maxViewH > 0 ? maxViewH : 0;
                            }
                            var maxViewW = _this.contentWidth - scroller.width;
                            if (_this.scrollH > maxViewW) {
                                _this.scrollH = maxViewW > 0 ? maxViewW : 0;
                            }
                        }
                    }
                };
            }
            //检测LayoutName和className是一致的
            if (true) {
                var superOnExmlLoaded_1 = eui.Component.prototype.onExmlLoaded;
                eui.Component.prototype.onExmlLoaded = function (clazz, url) {
                    superOnExmlLoaded_1.call(this, clazz, url);
                    if (clazz) {
                        var className = clazz.prototype.__class__;
                        if (url.indexOf(className) == -1) {
                            TLog.Error("Layout Name Error path:%s", url);
                        }
                    }
                };
            }
            {
                //override eui.RadioButton
                //移动过程中，不响应选中
                var guiManger = gui.GuiManager.getInstance();
                var defaultFontName_1 = guiManger.getDefaultFontName();
                var firtInit_1 = false;
                var superGetStyleConfig_1 = eui.Theme.prototype.$getStyleConfig;
                eui.Theme.prototype.$getStyleConfig = function (style) {
                    if (firtInit_1 == false && defaultFontName_1 != "") {
                        firtInit_1 = true;
                        for (var k in this.$styles) {
                            var style_1 = this.$styles[k];
                            style_1.fontFamily = defaultFontName_1; //重置字体
                        }
                    }
                    return superGetStyleConfig_1.call(this, style);
                };
            }
        }
        override._init = _init;
    })(override = eui.override || (eui.override = {}));
})(eui || (eui = {}));
var gui;
(function (gui) {
    var AssetAdapter = (function () {
        function AssetAdapter() {
        }
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
            // var isFont = source.indexOf(".fnt") != -1;
            // var isSheet = source.indexOf(".json") != -1;
            // if(!isFont && !isSheet){
            var callback = {
                onAsynTextureSucceed: function (key, texture) {
                    compFunc.call(thisObject, texture, source);
                }
            };
            gui.ImageSet.getInstance().loadTextureAsyn(source, callback);
            // }else{
            //     //如果是字体的
            //     let callback: core.ResItemCallback = {
            //         onResItemLoad:(res:core.ResItem):void=>{
            //             compFunc.call(thisObject, res.getData(), source);
            //         },
            //         onResItemError:( key:string):void=>{
            //             compFunc.call(thisObject);
            //         }
            //     }
            //     let resMgr:core.ResManager = core.ResManager.getInstance();
            //     if(isFont){
            //         resMgr.loadResAsyn(source, callback, core.ResourceType.TYPE_FONT);
            //     }else if(isSheet){
            //         resMgr.loadResAsyn(source, callback, core.ResourceType.TYPE_SHEET);
            //     }
            // }
        };
        return AssetAdapter;
    }());
    gui.AssetAdapter = AssetAdapter;
    __reflect(AssetAdapter.prototype, "gui.AssetAdapter", ["eui.IAssetAdapter"]);
})(gui || (gui = {}));
var gui;
(function (gui) {
    var ThemeAdapter = (function () {
        function ThemeAdapter() {
        }
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        // public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void {
        //     var callback: core.ResItemCallback = {
        //         onResItemLoad:(res:core.ResItem):void=>{
        //            compFunc.call(thisObject, res.getData());
        //         },
        //         onResItemError:( key:string):void=>{
        //             compFunc.call(thisObject);
        //         }
        //     }
        //     var resMgr:core.ResManager = core.ResManager.getInstance();
        //     resMgr.loadResAsyn(url, callback, core.ResourceType.TYPE_TEXT);
        // }
        ThemeAdapter.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
            // function onResGet(e: string): void {
            //     onSuccess.call(thisObject, e);
            // }
            // function onResError(e: RES.ResourceEvent): void {
            //     if (e.resItem.url == url) {
            //         RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
            //         onError.call(thisObject);
            //     }
            // }
            var resMgr = core.ResManager.getInstance();
            if (typeof generateEUI !== 'undefined') {
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateEUI);
                }, this);
            }
            else if (typeof generateEUI2 !== 'undefined') {
                var callback = {
                    onResItemLoad: function (res) {
                        window["JSONParseClass"]["setData"](res.getData());
                        onSuccess.call(thisObject, generateEUI2);
                        //onSuccess.call(thisObject, res.getData());
                        //  egret.callLater(() => {
                        //     onSuccess.call(thisObject, generateEUI2);
                        // }, this);
                    },
                    onResItemError: function (key) {
                        onError.call(thisObject);
                    }
                };
                var version = "";
                if (typeof _EuiJsonVersion_ != "undefined") {
                    version = _EuiJsonVersion_;
                }
                resMgr.loadResAsyn("gameEui" + version + ".json", callback, core.ResourceType.TYPE_JSON);
            }
            else {
                var callback = {
                    onResItemLoad: function (res) {
                        onSuccess.call(thisObject, res.getData());
                    },
                    onResItemError: function (key) {
                        onError.call(thisObject);
                    }
                };
                var resMgr = core.ResManager.getInstance();
                resMgr.loadResAsyn(url, callback, core.ResourceType.TYPE_TEXT);
            }
        };
        return ThemeAdapter;
    }());
    gui.ThemeAdapter = ThemeAdapter;
    __reflect(ThemeAdapter.prototype, "gui.ThemeAdapter", ["eui.IThemeAdapter"]);
})(gui || (gui = {}));
var gui;
(function (gui) {
    //居中显示模型
    var ActorView = (function (_super) {
        __extends(ActorView, _super);
        function ActorView() {
            var _this = _super.call(this) || this;
            _this.mContainer = new egret.DisplayObjectContainer;
            _this.addChild(_this.mContainer);
            _this.mActorList = [];
            return _this;
        }
        ActorView.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            this.mContainer.x = unscaledWidth / 2;
            this.mContainer.y = unscaledHeight / 2;
        };
        ActorView.prototype.addActor = function (actor) {
            if (actor == null)
                return;
            //this._clearActor(actor);
            var index = this.mActorList.indexOf(actor);
            if (index != -1)
                return;
            if (this.mActorList.length == 0)
                this._regsterTimer();
            var node = actor.getDisplayNode();
            TLog.Assert(node.parent == null);
            this.mContainer.addChild(node);
            actor.setInCameraView(null, true);
            actor.retain();
            this.mActorList.push(actor);
        };
        ActorView.prototype.removeActor = function (actor) {
            if (actor == null)
                return false;
            var index = this.mActorList.indexOf(actor);
            if (index == -1)
                return false;
            if (this.mContainer.getChildIndex(actor.getDisplayNode()) != -1) {
                this.mContainer.removeChild(actor.getDisplayNode());
            }
            actor.setInCameraView(null, false);
            actor.release();
            this.mActorList.splice(index, 1);
            if (this.mActorList.length == 0) {
                this.clearTimer();
            }
            return true;
        };
        // public getActor():map.SpriteBase{
        // 	return this.mActor;
        // }
        ActorView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            if (this.mActorList.length != 0)
                this._regsterTimer();
        };
        ActorView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.clearTimer();
            // if(this.mActor){
            // 	this.mActor.setInCameraView(null, false)
            // }
            for (var _i = 0, _a = this.mActorList; _i < _a.length; _i++) {
                var actor = _a[_i];
                actor.setInCameraView(null, false);
            }
        };
        // private _clearActor(){
        // 	if(this.mActor){
        // 		if(this.mContainer.getChildIndex(this.mActor.getDisplayNode()) != -1){
        // 			this.mContainer.removeChild(this.mActor.getDisplayNode());
        // 		}
        // 		this.mActor.setInCameraView(null, false)
        // 		this.mActor.release();
        // 		this.mActor = null;
        // 		this.clearTimer();
        // 	}
        // }
        ActorView.prototype.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            if (localX < 0 || localX > this.width || localY < 0 || localY > this.height)
                return null;
            return _super.prototype.$hitTest.call(this, stageX, stageY);
        };
        ActorView.prototype._regsterTimer = function () {
            gui.GuiManager.getInstance().addTickCallback(this);
        };
        ActorView.prototype.clearTimer = function () {
            gui.GuiManager.getInstance().removeTickCallback(this);
        };
        ActorView.prototype.onTick = function () {
            if (this.mActorList.length == 0)
                return;
            for (var _i = 0, _a = this.mActorList; _i < _a.length; _i++) {
                var actor = _a[_i];
                actor.onUpdate(null);
            }
        };
        return ActorView;
    }(eui.Component));
    gui.ActorView = ActorView;
    __reflect(ActorView.prototype, "gui.ActorView", ["gui.GuiTickCallback"]);
})(gui || (gui = {}));
var gui;
(function (gui) {
    var AnimBox = (function (_super) {
        __extends(AnimBox, _super);
        function AnimBox() {
            var _this = _super.call(this) || this;
            _this.m_intervalTime = 200;
            _this.m_frameIndex = -1;
            _this.m_intervalCurrentTime = 0;
            _this.m_bLoop = true;
            _this.m_bPlaying = true;
            _this.m_bReverse = false;
            _this.m_AnimName = "";
            _this.m_AnimInfo = null;
            _this.m_AnimChanged = false;
            var image = new eui.Image;
            image.percentWidth = 100;
            image.percentHeight = 100;
            _this.addChild(image);
            _this.m_image = image;
            _this.touchChildren = false;
            return _this;
        }
        AnimBox.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            gui.GuiManager.getInstance().addTickCallback(this);
        };
        AnimBox.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            gui.GuiManager.getInstance().removeTickCallback(this);
        };
        AnimBox.prototype.setAnimName = function (animName) {
            if (animName == null || animName == "")
                return;
            var animInfo = gui.AnimSet.getInstance().getAnimInfo(animName);
            if (animInfo == null || animInfo.count <= 0) {
                TLog.Error("AnimBox::SetName %s Error", animName);
                return;
            }
            //如果没有加入imageset，则添加
            //const char* frameImageName = this->GetFrameImageName(animName, 0);
            this.m_AnimInfo = animInfo;
            this.m_AnimName = animName;
            this.setAnimInterval(animInfo.interval);
        };
        AnimBox.prototype.play = function () {
            this.m_bPlaying = true;
            this.reset();
        };
        AnimBox.prototype.pause = function () {
            this.m_bPlaying = false;
        };
        AnimBox.prototype.reset = function () {
            this.m_frameIndex = -1;
        };
        AnimBox.prototype.setLoop = function (loop) {
            this.m_bLoop = loop;
        };
        AnimBox.prototype.setAnimInterval = function (millisecond) {
            if (millisecond < 0)
                millisecond = 100;
            this.m_intervalTime = millisecond;
        };
        AnimBox.prototype.setReverse = function (bReverse) {
            this.m_bReverse = bReverse;
        };
        AnimBox.prototype.updateAnimImage = function () {
            var frameImageName = String.format("%s_%02d", this.m_AnimName, this.m_frameIndex + 1);
            this.m_image.source = frameImageName;
        };
        AnimBox.prototype.onTick = function () {
            if (this.visible == false)
                return;
            if (this.m_bPlaying == false || this.m_AnimInfo == null)
                return 0;
            this.m_intervalCurrentTime += core.TimeStamp.DelayTime;
            if (this.m_frameIndex == -1) {
                this.m_frameIndex = !this.m_bReverse ? -1 : this.m_AnimInfo.count;
                this.m_intervalCurrentTime = this.m_intervalTime;
                this.m_AnimChanged = true;
            }
            while (this.m_intervalCurrentTime >= this.m_intervalTime) {
                var loopFinish = false;
                if (!this.m_bReverse) {
                    //循环到终点了
                    this.m_frameIndex++;
                    if (this.m_frameIndex > this.m_AnimInfo.count - 1) {
                        loopFinish = true;
                        this.m_frameIndex = 0;
                    }
                }
                else {
                    this.m_frameIndex--;
                    if (this.m_frameIndex < 0) {
                        loopFinish = true;
                        this.m_frameIndex = this.m_AnimInfo.count - 1;
                    }
                }
                this.m_AnimChanged = true;
                if (loopFinish) {
                    if (this.m_bLoop == false)
                        this.m_bPlaying = false;
                    var event_3 = new gui.GUIEvent(AnimBox.AnimEndEvent, this);
                    this.dispatchEvent(event_3);
                }
                this.m_intervalCurrentTime -= this.m_intervalTime;
                //this.SetChanged();
            }
            if (this.m_AnimChanged) {
                this.updateAnimImage();
            }
            return 0;
        };
        Object.defineProperty(AnimBox.prototype, "animName", {
            get: function () {
                return this.m_AnimName;
            },
            //编辑器使用get set属性
            set: function (animName) {
                this.setAnimName(animName);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimBox.prototype, "animInterval", {
            get: function () {
                return this.m_intervalTime;
            },
            set: function (interval) {
                this.setAnimInterval(interval);
            },
            enumerable: true,
            configurable: true
        });
        AnimBox.AnimEndEvent = "AnimEndEvent";
        return AnimBox;
    }(eui.Component));
    gui.AnimBox = AnimBox;
    __reflect(AnimBox.prototype, "gui.AnimBox", ["gui.GuiTickCallback"]);
})(gui || (gui = {}));
var gui;
(function (gui) {
    var BatchImage = (function (_super) {
        __extends(BatchImage, _super);
        function BatchImage() {
            var _this = _super.call(this) || this;
            _this.$beginDraw = false;
            _this.touchChildren = false;
            _this.mCacheImageList = [];
            _this.mCacheMaxCount = 30;
            return _this;
        }
        //------------------------------------------------------------
        //公用函数
        BatchImage.prototype.beginDraw = function () {
            TLog.Assert(this.$beginDraw == false);
            this.mCacheImageList = [];
            var num = this.numChildren;
            if (num < this.mCacheMaxCount) {
                for (var i = 0; i < num; i++) {
                    var child = this.getChildAt(i);
                    child.visible = false;
                    this.mCacheImageList.push(child);
                }
            }
            else {
                this.removeChildren();
            }
            this.$beginDraw = true;
        };
        BatchImage.prototype.endDraw = function () {
            TLog.Assert(this.$beginDraw);
            this.$beginDraw = false;
            //重新绘制
            this.$invalidateContentBounds();
        };
        BatchImage.prototype._renderImage = function (name, xPos, yPos) {
            var image = null;
            var imageInfo = gui.ImageSet.getInstance().getImageInfo(name);
            if (imageInfo) {
                if (this.mCacheImageList.length > 0) {
                    image = this.mCacheImageList.shift();
                }
                else {
                    image = new gui.Grid9Image;
                    this.addChild(image);
                }
                image.visible = true;
                image.source = name;
                image.x = xPos;
                image.y = yPos;
                image.fillMode = egret.BitmapFillMode.SCALE;
                image.width = image.height = NaN;
                //this.setChildIndex(image, this.mCacheBeginIndex++)
            }
            return [imageInfo, image];
        };
        BatchImage.prototype._renderProgress = function (name, xPos, yPos, progress, isVertical) {
            var _a = this._renderImage(name, xPos, yPos), imageInfo = _a[0], image = _a[1];
            if (imageInfo) {
                image.fillMode = egret.BitmapFillMode.CLIP;
                if (!isVertical) {
                    //水平
                    image.width = imageInfo.w * progress;
                }
                else {
                    //垂直
                    image.height = imageInfo.h * progress;
                }
                image.visible = (progress != 0);
            }
            return imageInfo;
        };
        //数字
        BatchImage.prototype.drawNumberString = function (image_prefix, strNumber, targetX, targetY, spaceX) {
            if (targetX === void 0) { targetX = 0; }
            if (targetY === void 0) { targetY = 0; }
            if (spaceX === void 0) { spaceX = 0; }
            TLog.Assert(this.$beginDraw);
            if (image_prefix == null)
                return 0;
            if (typeof strNumber == "number") {
                strNumber = String(strNumber);
            }
            var imageW = 0;
            for (var s = 0; s < strNumber.length; s++) {
                var strCurNumber = strNumber.charAt(s);
                var image_name = image_prefix + strCurNumber; //给定前缀，字符串合并
                var imageInfo = this._renderImage(image_name, targetX, targetY)[0];
                if (imageInfo) {
                    targetX += imageInfo.w + spaceX;
                    imageW = imageW + imageInfo.w;
                }
            }
            return imageW;
        };
        //图片
        BatchImage.prototype.drawImage = function (image_name, targetX, targetY) {
            if (targetX === void 0) { targetX = 0; }
            if (targetY === void 0) { targetY = 0; }
            TLog.Assert(this.$beginDraw);
            if (image_name == null)
                return 0;
            var imageInfo = this._renderImage(image_name, targetX, targetY)[0];
            return imageInfo.w;
        };
        //进度条
        BatchImage.prototype.drawImageProgress = function (image_name, progress, targetX, targetY) {
            if (targetX === void 0) { targetX = 0; }
            if (targetY === void 0) { targetY = 0; }
            TLog.Assert(progress >= 0 && progress <= 1);
            if (image_name == null)
                return;
            this._renderProgress(image_name, targetX, targetY, progress, false);
        };
        //竖直方向进度条
        BatchImage.prototype.drawImageVProgress = function (image_name, progress, targetX, targetY) {
            if (targetX === void 0) { targetX = 0; }
            if (targetY === void 0) { targetY = 0; }
            TLog.Assert(progress >= 0 && progress <= 1);
            if (image_name == null)
                return;
            this._renderProgress(image_name, targetX, targetY, progress, true);
        };
        BatchImage.prototype.$invalidateContentBounds = function () {
            //super.$invalidateContentBounds();
            this.invalidateSize();
        };
        return BatchImage;
    }(eui.Component));
    gui.BatchImage = BatchImage;
    __reflect(BatchImage.prototype, "gui.BatchImage");
})(gui || (gui = {}));
var gui;
(function (gui) {
    //弹跳按钮
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.COMPLETE, _this.onCompleteHandler, _this);
            return _this;
        }
        Button.prototype.onCompleteHandler = function (event) {
            if (this.backgroupImage != null)
                return;
            var obj = this.getChildAt(0);
            if (obj && obj instanceof eui.Image) {
                this.backgroupImage = obj;
            }
        };
        Button.prototype.invalidateState = function () {
            _super.prototype.invalidateState.call(this);
            var currentState = this.getCurrentState();
            if (currentState == "disabled") {
                var colorMatrix = [
                    0.3, 0.6, 0, 0, 0,
                    0.3, 0.6, 0, 0, 0,
                    0.3, 0.6, 0, 0, 0,
                    0, 0, 0, 1, 0
                ];
                var grayFlilter = new egret.ColorMatrixFilter(colorMatrix);
                this.filters = [grayFlilter];
            }
            else if (currentState == "down") {
                this.smallButton();
            }
            else if (currentState == "up") {
                this.normalButton();
            }
        };
        Button.prototype.smallButton = function () {
            if (this.backgroupImage == null)
                return;
            this.backgroupImage.percentWidth = 90;
            this.backgroupImage.percentHeight = 90;
        };
        Button.prototype.normalButton = function () {
            if (this.backgroupImage == null)
                return;
            this.backgroupImage.percentWidth = 100;
            this.backgroupImage.percentHeight = 100;
        };
        Object.defineProperty(Button.prototype, "labelColor", {
            set: function (color) {
                if (this.labelDisplay == null)
                    return;
                this.labelDisplay.textColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "image", {
            set: function (source) {
                if (this.backgroupImage) {
                    this.backgroupImage.source = source;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "backgroupImage", {
            get: function () {
                return this.mBackgroupImage;
            },
            set: function (image) {
                this.mBackgroupImage = image;
                if (this.mBackgroupImage) {
                    this.mBackgroupImage.verticalCenter = 0;
                    this.mBackgroupImage.horizontalCenter = 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "source", {
            get: function () {
                if (this.backgroupImage) {
                    return this.backgroupImage.source;
                }
                return "";
            },
            //与label保存一致的接口
            set: function (src) {
                if (this.backgroupImage) {
                    this.backgroupImage.source = src;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "text", {
            get: function () {
                return this.label;
            },
            set: function (str) {
                this.label = str;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "textColor", {
            set: function (color) {
                this.labelColor = color;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(eui.Button));
    gui.Button = Button;
    __reflect(Button.prototype, "gui.Button");
})(gui || (gui = {}));
var gui;
(function (gui) {
    //1.自动九宫格
    var Grid9Image = (function (_super) {
        __extends(Grid9Image, _super);
        function Grid9Image() {
            var _this = _super.call(this) || this;
            _this.bAutoScale9Grid = true;
            return _this;
        }
        Object.defineProperty(Grid9Image.prototype, "autoScale9Grid", {
            get: function () {
                return this.bAutoScale9Grid;
            },
            set: function (b) {
                this.bAutoScale9Grid = b;
            },
            enumerable: true,
            configurable: true
        });
        Grid9Image.prototype.$setTexture = function (value) {
            var ret = _super.prototype.$setTexture.call(this, value);
            if (this.$UIComponent && this.bAutoScale9Grid == true) {
                this.scale9Grid = null;
                if (value) {
                    //九宫格拉伸，中间一个像素
                    //水平
                    var hCenter = Math.ceil(value.$bitmapWidth / 2);
                    var left = hCenter - 1;
                    var right = hCenter + 1;
                    //垂直
                    var vCenter = Math.ceil(value.$bitmapHeight / 2);
                    var top = vCenter - 1;
                    var bottom = vCenter + 1;
                    // var scaleRect = new egret.Rectangle;
                    // scaleRect.setTo(left, top, right - left, bottom - top);
                    // this.scale9Grid = scaleRect;
                    this.scale9Grid = new egret.Rectangle(hCenter, vCenter, 1, 1);
                }
            }
            return ret;
        };
        return Grid9Image;
    }(eui.Image));
    gui.Grid9Image = Grid9Image;
    __reflect(Grid9Image.prototype, "gui.Grid9Image");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var LayoutNode = (function (_super) {
        __extends(LayoutNode, _super);
        function LayoutNode() {
            var _this = _super.call(this) || this;
            _this.mbModal = false;
            _this.mLayerId = 1 /* Normal */;
            _this.visible = false;
            _this.mbCanDrag = false;
            _this.mbModalMask = false;
            _this.mModalGroupId = 0;
            return _this;
        }
        LayoutNode.prototype.removeFromtParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        //通知maskLayer更新rendertexture
        LayoutNode.prototype.$setX = function (value) {
            this.dispatchEventWith(egret.Event.CHANGE);
            return _super.prototype.$setX.call(this, value);
        };
        LayoutNode.prototype.$setY = function (value) {
            this.dispatchEventWith(egret.Event.CHANGE);
            return _super.prototype.$setY.call(this, value);
        };
        LayoutNode.prototype.$setVisible = function (visible) {
            if (this.visible != visible) {
                if (this.mOriginalParent == null)
                    this.mOriginalParent = this.parent;
                if (!visible) {
                    this.mOriginalParent = this.parent;
                    this.removeFromtParent();
                }
                else {
                    if (this.mOriginalParent) {
                        this.mOriginalParent.addChild(this);
                    }
                    else {
                        gui.GuiManager.getInstance().setNodeLayer(this, this.mLayerId);
                    }
                }
            }
            //mask不处理visible
            if (this.mbModalMask == true) {
                return;
            }
            _super.prototype.$setVisible.call(this, visible);
        };
        LayoutNode.prototype.getComponent = function (idName) {
            return this[idName];
        };
        LayoutNode.prototype.setDoModal = function (b, groupId) {
            if (this.mbModal == b)
                return;
            this.mbModal = b;
            this.mModalGroupId = groupId || 0;
            if (this.mbModal) {
                //IGlobal.guiManager.setNodeLayer()
                this.setLayer(2 /* Modal */);
            }
            else {
                this.setLayer(1 /* Normal */);
            }
        };
        LayoutNode.prototype.isDoModal = function () {
            return this.mbModal;
        };
        LayoutNode.prototype.getModalGroupId = function () {
            return this.mModalGroupId;
        };
        LayoutNode.prototype.setDoModalMask = function (b) {
            if (b == this.mbModalMask)
                return;
            this.mbModalMask = b;
            if (this.mbModalMask) {
                _super.prototype.$setVisible.call(this, false);
            }
            else {
            }
            this.dispatchEventWith(egret.Event.CHANGE);
        };
        LayoutNode.prototype.isDoModalMask = function () {
            return this.mbModalMask;
        };
        LayoutNode.prototype.moveToFront = function () {
            if (this.parent == null)
                return;
            var childLength = this.parent.numChildren;
            var childIndex = this.parent.getChildIndex(this);
            if (childIndex == childLength - 1) {
                return;
            }
            //this.parent.setChildIndex(this, -1) 
            var parent = this.parent;
            this.parent.removeChild(this);
            parent.addChildAt(this, -1);
        };
        LayoutNode.prototype.moveToBack = function () {
            if (this.parent == null)
                return;
            var childIndex = this.parent.getChildIndex(this);
            if (childIndex == 0) {
                return;
            }
            //this.parent.setChildIndex(this, 0)
            var parent = this.parent;
            this.parent.removeChild(this);
            parent.addChildAt(this, 0);
        };
        LayoutNode.prototype.setLayer = function (layer) {
            //gui.GuiManager.getInstance().setNodeLayer(this, layer);
            this.mLayerId = layer;
            if (this.visible) {
                gui.GuiManager.getInstance().setNodeLayer(this, this.mLayerId);
            }
        };
        LayoutNode.prototype.getLayer = function () {
            return this.mLayerId;
        };
        LayoutNode.prototype.setCanDrag = function (b) {
            if (this.mbCanDrag == b)
                return;
            this.mbCanDrag = b;
            if (b) {
                this.addEventListener(gui.GUIDriveEvent.BeginDriveEvent, this.onBeginDrive, this);
                this.addEventListener(gui.GUIDriveEvent.EndDriveEvent, this.onEndDrive, this);
            }
            else {
                this.removeEventListener(gui.GUIDriveEvent.BeginDriveEvent, this.onBeginDrive, this);
                this.removeEventListener(gui.GUIDriveEvent.EndDriveEvent, this.onEndDrive, this);
            }
        };
        LayoutNode.prototype.onBeginDrive = function (event) {
            event.setDriveBegin(true);
            TLog.Debug("LayoutNode::onBeginDrive", this.name);
        };
        LayoutNode.prototype.onEndDrive = function (event) {
            TLog.Debug("LayoutNode::onEndDrive", this.name);
            var parent = this.parent;
            var point = core.EgretUtil.stageToNodeXY(parent, event.stageX - event.driveOffStageX, event.stageY - event.driveOffStageY);
            this.x = point.x;
            this.y = point.y;
            this.left = NaN;
            this.top = NaN;
            this.right = NaN;
            this.bottom = NaN;
            this.verticalCenter = NaN;
            this.horizontalCenter = NaN;
        };
        return LayoutNode;
    }(eui.Component));
    gui.LayoutNode = LayoutNode;
    __reflect(LayoutNode.prototype, "gui.LayoutNode");
})(gui || (gui = {}));
// TypeScript file
var gui;
(function (gui) {
    var ModalColorLayer = (function (_super) {
        __extends(ModalColorLayer, _super);
        function ModalColorLayer() {
            var _this = _super.call(this) || this;
            _this.mColorNode = new eui.Rect;
            // this.mColorNode.percentWidth = 100
            // this.mColorNode.percentHeight = 100;
            _this.mColorNode.fillColor = gui.Color.black;
            _this.mColorNode.alpha = 0.5;
            _this.addChild(_this.mColorNode);
            _this.touchChildren = false;
            _this.touchEnabled = false;
            _this.mRenderNode = new egret.Bitmap;
            _this.mLayoutNodeList = [];
            _this.mbMaskNodeChanged = false;
            _this.mMaskNodeSaveDataList = null;
            _this.mbUpdateLock = false;
            return _this;
        }
        //覆盖父类
        ModalColorLayer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            gui.GuiManager.getInstance().addTickCallback(this);
        };
        ModalColorLayer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            gui.GuiManager.getInstance().removeTickCallback(this);
        };
        // $propagateFlagsUp(flags: number): void {
        //     super.$propagateFlagsUp(flags);
        //     //子类的位置改变了
        //     if(flags == egret.sys.DisplayObjectFlags.InvalidBounds){
        //         this.setNodeChange()
        //     }
        // }
        ModalColorLayer.prototype.$cacheDirtyUp = function () {
            _super.prototype.$cacheDirtyUp.call(this);
            this.setNodeChange();
        };
        ModalColorLayer.prototype.addLayoutNode = function (node) {
            TLog.Assert(node != null);
            if (this.mLayoutNodeList.indexOf(node) != -1) {
                return false;
            }
            node.addEventListener(egret.Event.CHANGE, this.onModalMaskChange, this);
            this.mLayoutNodeList.push(node);
            this.setNodeChange();
        };
        ModalColorLayer.prototype.removeLayoutNode = function (node) {
            if (JsUtil.arrayRemoveVal(this.mLayoutNodeList, node) == false) {
                return false;
            }
            node.removeEventListener(egret.Event.CHANGE, this.onModalMaskChange, this);
            this.setNodeChange();
            return true;
        };
        ModalColorLayer.prototype.getMaskNodeList = function () {
            var maskNodeList = [];
            for (var i = 0; i < this.mLayoutNodeList.length; i++) {
                var node = this.mLayoutNodeList[i];
                if (node.isDoModalMask()) {
                    maskNodeList.push(node);
                }
            }
            return maskNodeList;
        };
        ModalColorLayer.prototype.isUpdateLock = function () {
            return this.mbUpdateLock;
        };
        ModalColorLayer.prototype.setNodeChange = function () {
            if (this.mbUpdateLock)
                return;
            this.mbMaskNodeChanged = true;
        };
        ModalColorLayer.prototype.removeChildSafe = function (node) {
            if (node.parent == null)
                return;
            node.parent.removeChild(node);
        };
        ModalColorLayer.prototype.addChildSafe = function (node) {
            if (node.parent == this)
                return;
            this.addChild(node);
        };
        ModalColorLayer.prototype.onBeginMask = function (maskNodeList) {
            this.mMaskNodeSaveDataList = [];
            for (var i = 0; i < maskNodeList.length; i++) {
                var node = maskNodeList[i];
                var data = {
                    node: node,
                    parent: node.parent,
                    childIndex: node.parent.getChildIndex(node),
                };
                this.mMaskNodeSaveDataList.push(data);
            }
        };
        ModalColorLayer.prototype.onUpdateMask = function (maskNodeList) {
            if (this.mMaskNodeContainer == null) {
                this.mMaskNodeContainer = new egret.DisplayObjectContainer;
            }
            this.mColorNode.width = this.width;
            this.mColorNode.height = this.height;
            this.mMaskNodeContainer.removeChildren();
            this.mMaskNodeContainer.addChild(this.mColorNode); //加入黑底
            for (var i = 0; i < maskNodeList.length; i++) {
                var node = maskNodeList[i];
                node.$visible = (true);
                node.blendMode = egret.BlendMode.ERASE;
                this.mMaskNodeContainer.addChild(node);
            }
            if (this.mRenderTexture == null) {
                this.mRenderTexture = new egret.RenderTexture();
            }
            this.mRenderTexture.drawToTexture(this.mMaskNodeContainer);
            this.mRenderNode.texture = this.mRenderTexture;
        };
        ModalColorLayer.prototype.onFinshMask = function () {
            for (var i = 0; i < this.mMaskNodeSaveDataList.length; i++) {
                var data = this.mMaskNodeSaveDataList[i];
                data.node.$visible = (false);
                data.parent.addChildAt(data.node, data.childIndex);
            }
            this.mMaskNodeSaveDataList = null;
        };
        ModalColorLayer.prototype.onTick = function () {
            if (this.mbMaskNodeChanged == false) {
                return;
            }
            this.mbMaskNodeChanged = false;
            this.mbUpdateLock = true;
            var maskNodeList = [];
            for (var i = 0; i < this.mLayoutNodeList.length; i++) {
                var node = this.mLayoutNodeList[i];
                if (node.isDoModalMask()) {
                    maskNodeList.push(node);
                }
            }
            //如果有maskNode，重新刷新一次RenderTexture
            if (maskNodeList.length > 0) {
                this.removeChildSafe(this.mColorNode);
                this.onBeginMask(maskNodeList);
                this.onUpdateMask(maskNodeList);
                this.onFinshMask();
                this.addChildSafe(this.mRenderNode);
            }
            else {
                this.mColorNode.width = this.width;
                this.mColorNode.height = this.height;
                //否则，只是添加Color
                this.removeChildSafe(this.mRenderNode);
                this.addChildSafe(this.mColorNode);
            }
            this.mbUpdateLock = false;
        };
        ModalColorLayer.prototype.onModalMaskChange = function (event) {
            this.setNodeChange();
        };
        return ModalColorLayer;
    }(eui.UILayer));
    gui.ModalColorLayer = ModalColorLayer;
    __reflect(ModalColorLayer.prototype, "gui.ModalColorLayer", ["gui.GuiTickCallback"]);
})(gui || (gui = {}));
// TypeScript file
var gui;
(function (gui) {
    var ModalLayer = (function (_super) {
        __extends(ModalLayer, _super);
        function ModalLayer() {
            var _this = _super.call(this) || this;
            //colorLayer不可以点击
            _this.colorLayer = new gui.ModalColorLayer;
            // this.colorLayer.touchChildren = false;
            // this.colorLayer.touchEnabled = true;
            _this.touchEnabled = true;
            _this.addChild(_this.colorLayer);
            _this.visible = false;
            return _this;
        }
        ModalLayer.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            _super.prototype.$doAddChild.call(this, child, index, notifyListeners);
            if (this.colorLayer == child)
                return child;
            TLog.Assert(child instanceof gui.LayoutNode);
            //colorLayer会临时移除child，如果被锁定则不处理
            if (this.colorLayer.isUpdateLock()) {
                return;
            }
            this.colorLayer.addLayoutNode(child);
            this.updateLayer();
            return child;
        };
        ModalLayer.prototype.$doRemoveChild = function (index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            var child = _super.prototype.$doRemoveChild.call(this, index, notifyListeners);
            if (this.colorLayer == child)
                return child;
            if (this.colorLayer.isUpdateLock()) {
                return;
            }
            if (child instanceof gui.LayoutNode) {
                this.colorLayer.removeLayoutNode(child);
            }
            this.updateLayer();
            return child;
        };
        ModalLayer.prototype.$hitTest = function (stageX, stageY) {
            if (this.numChildren <= 1)
                return null;
            var maskNodeList = this.colorLayer.getMaskNodeList();
            if (maskNodeList.length == 0) {
                var topChild = this.getChildAt(this.numChildren - 1);
                TLog.Assert(topChild != this.colorLayer);
                var hitChildTarget = topChild.$hitTest(stageX, stageY);
                if (hitChildTarget)
                    return hitChildTarget;
                return this;
            }
            var hitTarget = _super.prototype.$hitTest.call(this, stageX, stageY);
            var colorLayerIndex = this.getChildIndex(this.colorLayer);
            var bHitMask = false;
            for (var i = 0; i < maskNodeList.length; i++) {
                var node = maskNodeList[i];
                var nodeIndex = this.getChildIndex(node);
                if (nodeIndex < colorLayerIndex) {
                    break;
                }
                node.$visible = true;
                var child = node.$hitTest(stageX, stageY);
                node.$visible = false;
                if (child != null) {
                    bHitMask = true;
                    break;
                }
            }
            //点击了mask，直接穿透
            if (bHitMask == true) {
                if (hitTarget == this) {
                    return null;
                }
                return hitTarget;
            }
            return this;
        };
        ModalLayer.prototype.updateLayer = function () {
            var length = this.numChildren;
            if (length == 1) {
                var child = this.getChildAt(0);
                TLog.Assert(child == this.colorLayer);
                this.visible = false;
                return;
            }
            this.visible = true;
            var colorIndex = 0;
            var lastModalGroupId = -1;
            var bLastColorLayer = false;
            for (var i = length - 1; i >= 0; i--) {
                var child = this.getChildAt(i);
                if (child == this.colorLayer) {
                    bLastColorLayer = true;
                    continue;
                }
                var layoutNode = (child);
                if (lastModalGroupId == -1 && layoutNode.getModalGroupId() == 0) {
                    colorIndex = i;
                    if (bLastColorLayer) {
                        colorIndex++;
                    }
                    break;
                }
                else {
                    var curModalGroupId = layoutNode.getModalGroupId();
                    if (lastModalGroupId != -1 && curModalGroupId != lastModalGroupId) {
                        var span = bLastColorLayer ? 2 : 1; //如果上一个是颜色层，则跳2步
                        colorIndex = i + span; //取前一个模态窗口
                        break;
                    }
                    lastModalGroupId = curModalGroupId;
                }
                bLastColorLayer = false;
            }
            if (colorIndex > 0) {
                this.setChildIndex(this.colorLayer, colorIndex - 1);
            }
            else {
                this.setChildIndex(this.colorLayer, 0);
            }
        };
        return ModalLayer;
    }(eui.UILayer));
    gui.ModalLayer = ModalLayer;
    __reflect(ModalLayer.prototype, "gui.ModalLayer");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var ProgressBar = (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar() {
            return _super.call(this) || this;
        }
        ProgressBar.prototype.onCompleteHandler = function (event) {
            if (this.mBackgroupImage != null)
                return;
            var obj = this.getChildAt(0);
            if (obj && obj instanceof eui.Image) {
                this.mBackgroupImage = obj;
            }
        };
        Object.defineProperty(ProgressBar.prototype, "image", {
            set: function (source) {
                if (this.mBackgroupImage) {
                    this.mBackgroupImage.source = source;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProgressBar.prototype, "backgroupImage", {
            get: function () {
                return this.mBackgroupImage;
            },
            set: function (image) {
                this.mBackgroupImage = image;
                if (this.mBackgroupImage) {
                    this.mBackgroupImage.verticalCenter = 0;
                    this.mBackgroupImage.horizontalCenter = 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProgressBar.prototype, "thumbImage", {
            set: function (source) {
                if (this.thumb) {
                    var img = this.thumb;
                    img.source = source;
                }
            },
            enumerable: true,
            configurable: true
        });
        return ProgressBar;
    }(eui.ProgressBar));
    gui.ProgressBar = ProgressBar;
    __reflect(ProgressBar.prototype, "gui.ProgressBar");
})(gui || (gui = {}));
var gui;
(function (gui) {
    ;
    //逻辑信息
    var LogicInfo = (function () {
        function LogicInfo() {
            this.type = 0; //不同类型，以下变量可能会不同意思
            this.id = 0;
            this.text = "";
            this.name = "";
            this.link = "";
            this.color = 0;
            this.border = 0;
            this.value = 0;
            this.flag = 0;
        }
        return LogicInfo;
    }());
    __reflect(LogicInfo.prototype, "LogicInfo");
    //每一行的控件位置
    var PosInfo = (function () {
        function PosInfo() {
            //位置尺寸
            // x:number = 0;
            // y:number = 0;
            this.width = 0;
            this.height = 0;
            this.logicInfo = null;
            this.param1 = null;
            this.param2 = null;
            this.window = null;
        }
        return PosInfo;
    }());
    __reflect(PosInfo.prototype, "PosInfo");
    //行信息
    var RowInfo = (function () {
        function RowInfo() {
            this.contentH = 0;
            this.contentW = 0;
            this.mPosInfoList = [];
            this.full = false;
        }
        return RowInfo;
    }());
    __reflect(RowInfo.prototype, "RowInfo");
    var RichDisplayer = (function (_super) {
        __extends(RichDisplayer, _super);
        function RichDisplayer() {
            var _this = _super.call(this) || this;
            _this.mRowInfoList = [];
            _this.mLogicInfoList = [];
            _this.mTempXmlList = [];
            _this.mDefaultValue = 16;
            _this.mDefaultFontFlag = gui.Flag.LEFT_CENTER;
            _this.mReplaceArr = [];
            _this.mReplaceArr.push([/&lt;/g, "<"]);
            _this.mReplaceArr.push([/&gt;/g, ">"]);
            _this.mReplaceArr.push([/&amp;/g, "&"]);
            _this.mReplaceArr.push([/&quot;/g, "\""]);
            _this.mReplaceArr.push([/&apos;/g, "\'"]);
            _this.mContainer = _this;
            // this.mContainer = new eui.Group;
            // this.mContainer.width = 1;
            // this.mContainer.height = 1;
            // this.viewport = this.mContainer;//h5手机端报错，查不出什么原因
            _this.mAlignFlag = 0;
            _this.mContentChanged = false;
            _this.mSizeChanged = false;
            _this.mRowDistance = 0;
            _this.mCacheCtrlList = {};
            _this.mbShowLast = false;
            _this.mTempXmlNodeList = [];
            return _this;
        }
        RichDisplayer.prototype.translateWord = function (text) {
            var strList = text.split("##");
            if (strList.length <= 2) {
                return text;
            }
            var length = strList.length;
            //双数的最后一条，拼接##
            if (length % 2 == 0) {
                var str = strList[length - 1];
                strList[length - 1] = "##" + str;
            }
            for (var i = 0; i < length; i++) {
                var str = strList[i];
                if (i % 2 == 1 && i != length - 1) {
                    if (str != "") {
                        var event_4 = new gui.GUITranslateWordEvent(RichDisplayer.RichDisplayerTranslateEvent, this);
                        event_4.setTranslateWord(str);
                        this.dispatchEvent(event_4);
                        var transStr = event_4.getTranslateWord();
                        if (transStr == "") {
                            //strList[i] = transStr;
                            return text;
                        }
                        else {
                            strList[i] = transStr;
                        }
                    }
                }
            }
            return strList.join("");
        };
        RichDisplayer.prototype.replaceSpecial = function (value) {
            for (var i = 0; i < this.mReplaceArr.length; i++) {
                var k = this.mReplaceArr[i][0];
                var v = this.mReplaceArr[i][1];
                value = value.replace(k, v);
            }
            return value;
        };
        RichDisplayer.prototype.fillLogicInfo = function (logicInfo, xmlNode) {
            switch (logicInfo.type) {
                case 4 /* BrType */:
                case 6 /* HorBlankType */:
                case 5 /* VerBlankType */:
                    {
                        logicInfo.value = TXML.queryIntAttribute(xmlNode, RichDisplayer.AttValue, this.mDefaultValue);
                    }
                    break;
                case 1 /* TextType */:
                case 3 /* AnimType */:
                case 2 /* ImageType */:
                    {
                        var text = TXML.queryText(xmlNode);
                        text = this.replaceSpecial(text);
                        if (logicInfo.type == 1 /* TextType */) {
                            if (text != "") {
                                //##content##转换
                                logicInfo.text = this.translateWord(text);
                            }
                            else {
                                TLog.Error("RichDisplayer::FillLogicElemInfo TextType can not get text");
                                return;
                            }
                        }
                        else {
                            logicInfo.text = text;
                        }
                        logicInfo.link = TXML.queryAttribute(xmlNode, RichDisplayer.AttLink);
                        logicInfo.name = TXML.queryAttribute(xmlNode, RichDisplayer.AttName);
                        if (logicInfo.name == "") {
                            if (logicInfo.type == 3 /* AnimType */ || logicInfo.type == 2 /* ImageType */) {
                                TLog.Error("RichDisplayer::FillLogicElemInfo AnimType or ImageType can not get name");
                                return;
                            }
                        }
                        var colorName = TXML.queryAttribute(xmlNode, RichDisplayer.AttColor);
                        if (colorName != "") {
                            logicInfo.color = gui.GetColorFromName(colorName);
                        }
                        var flagName = TXML.queryAttribute(xmlNode, RichDisplayer.AttFlag);
                        if (flagName != "") {
                            logicInfo.flag = gui.GetFlagFromName(flagName);
                        }
                        else {
                            logicInfo.flag = this.mDefaultFontFlag;
                        }
                    }
                    break;
            }
        };
        RichDisplayer.prototype.setRowDistance = function (distance) {
            this.mRowDistance = distance;
        };
        RichDisplayer.prototype.showFirstRow = function () {
            this.mbShowLast = false;
        };
        RichDisplayer.prototype.showLastRow = function () {
            this.mbShowLast = true;
        };
        RichDisplayer.prototype._addXmlNodeImp = function () {
            var _this = this;
            for (var i = 0; i < this.mTempXmlNodeList.length; i++) {
                var xml = this.mTempXmlNodeList[i];
                TXML.forEach(xml, function (xmlNode) {
                    var value = xmlNode.name;
                    var type = -1;
                    if (value == RichDisplayer.TagText) {
                        type = 1 /* TextType */;
                    }
                    else if (value == RichDisplayer.TagBR) {
                        type = 4 /* BrType */;
                    }
                    else if (value == RichDisplayer.TagHorBlank) {
                        type = 6 /* HorBlankType */;
                    }
                    else if (value == RichDisplayer.TagVerBlank) {
                        type = 5 /* VerBlankType */;
                    }
                    else if (value == RichDisplayer.TagImage) {
                        type = 2 /* ImageType */;
                    }
                    else if (value == RichDisplayer.TagAnim) {
                        type = 3 /* AnimType */;
                    }
                    if (type != -1) {
                        var logicInfo = new LogicInfo();
                        logicInfo.type = type;
                        _this.fillLogicInfo(logicInfo, xmlNode);
                        _this.mLogicInfoList.push(logicInfo);
                    }
                });
            }
        };
        RichDisplayer.prototype._addXmlStringImp = function (xmlStr) {
            var _this = this;
            xmlStr = "<root>" + xmlStr + "</root>";
            var xml = TXML.parse(xmlStr);
            if (xml == null) {
                TLog.Error("addXmlString %s", xmlStr);
                return;
            }
            TXML.forEach(xml, function (xmlNode) {
                var value = xmlNode.name;
                var type = -1;
                if (value == RichDisplayer.TagText) {
                    type = 1 /* TextType */;
                }
                else if (value == RichDisplayer.TagBR) {
                    type = 4 /* BrType */;
                }
                else if (value == RichDisplayer.TagHorBlank) {
                    type = 6 /* HorBlankType */;
                }
                else if (value == RichDisplayer.TagVerBlank) {
                    type = 5 /* VerBlankType */;
                }
                else if (value == RichDisplayer.TagImage) {
                    type = 2 /* ImageType */;
                }
                else if (value == RichDisplayer.TagAnim) {
                    type = 3 /* AnimType */;
                }
                if (type != -1) {
                    var logicInfo = new LogicInfo();
                    logicInfo.type = type;
                    _this.fillLogicInfo(logicInfo, xmlNode);
                    _this.mLogicInfoList.push(logicInfo);
                }
            });
        };
        RichDisplayer.prototype.addXmlString = function (xmlStr) {
            if (xmlStr == "")
                return;
            this.mTempXmlList.push(xmlStr);
            this.mContentChanged = true;
            this.invalidateDisplayList();
        };
        RichDisplayer.prototype.addXmlNode = function (xmlNode) {
            if (xmlNode == null)
                return;
            this.mTempXmlNodeList.push(xmlNode);
            this.mContentChanged = true;
            this.invalidateDisplayList();
        };
        RichDisplayer.prototype.finishCurrentRow = function () {
            var rowInfo = this.getCurrentRow();
            rowInfo.full = true;
        };
        RichDisplayer.prototype.getCurrentRow = function () {
            var rowInfo = null;
            if (this.mRowInfoList.length > 0) {
                rowInfo = this.mRowInfoList[this.mRowInfoList.length - 1];
                if (rowInfo.full) {
                    rowInfo = null;
                }
            }
            if (rowInfo == null) {
                rowInfo = new RowInfo();
                this.mRowInfoList.push(rowInfo);
            }
            return rowInfo;
        };
        RichDisplayer.prototype.addPosInfo = function (logicInfo, width, height) {
            var posInfo = new PosInfo();
            posInfo.logicInfo = logicInfo;
            posInfo.width = width;
            posInfo.height = height;
            var rowInfo = this.getCurrentRow();
            rowInfo.contentW = rowInfo.contentW + width;
            rowInfo.contentH = Math.max(rowInfo.contentH, height);
            rowInfo.mPosInfoList.push(posInfo);
            return posInfo;
        };
        RichDisplayer.prototype.insertImage = function (logicInfo) {
            var imageInfo = gui.ImageSet.getInstance().getImageInfo(logicInfo.name);
            if (imageInfo == null || imageInfo.w > this.width) {
                return;
            }
            var rowInfo = this.getCurrentRow();
            if (rowInfo.contentW + imageInfo.w > this.width) {
                this.finishCurrentRow();
                rowInfo = this.getCurrentRow();
            }
            this.addPosInfo(logicInfo, imageInfo.w, imageInfo.h);
        };
        RichDisplayer.prototype.insertAnim = function (logicInfo) {
            var animInfo = gui.AnimSet.getInstance().getAnimInfo(logicInfo.name);
            if (animInfo == null || animInfo.w > this.width) {
                return;
            }
            var rowInfo = this.getCurrentRow();
            if (rowInfo.contentW + animInfo.w > this.width) {
                this.finishCurrentRow();
                rowInfo = this.getCurrentRow();
            }
            this.addPosInfo(logicInfo, animInfo.w, animInfo.h);
        };
        RichDisplayer.prototype.insertText = function (logicInfo) {
            if (logicInfo.text == "")
                return;
            var fontName = logicInfo.name;
            var fontInfo = gui.FontSet.getInstance().getFont(fontName);
            if (fontInfo == null) {
                TLog.Error("RichDisplayer::insertText font:%s == null", fontName);
                return;
            }
            var displayW = this.width;
            // let textLen:number[] = [];
            // let allTextLen = 0;
            var startPos = 0;
            var lastPos = 0;
            var curTextLen = 0;
            //let spaceX = fontInfo.space_x;
            for (var i = 0; i < logicInfo.text.length; i++) {
                var str = logicInfo.text[i];
                var strW = egret.sys.measureText(str, fontInfo.fontName, fontInfo.fontSize, fontInfo.isBold(), fontInfo.isItalic());
                var rowInfo = this.getCurrentRow();
                if (rowInfo.contentW + curTextLen + strW <= displayW) {
                    lastPos = i;
                    curTextLen += strW;
                }
                else {
                    //换行，插入之前的字符串
                    if (curTextLen > 0) {
                        var posInfo = this.addPosInfo(logicInfo, curTextLen, fontInfo.fontSize);
                        posInfo.param1 = startPos;
                        posInfo.param2 = lastPos;
                        startPos = i;
                        lastPos = i;
                        curTextLen = strW;
                    }
                    this.finishCurrentRow();
                }
            }
            //最后一行
            if (curTextLen > 0) {
                var posInfo = this.addPosInfo(logicInfo, curTextLen, fontInfo.fontSize);
                posInfo.param1 = startPos;
                posInfo.param2 = lastPos;
            }
        };
        RichDisplayer.prototype.clear = function () {
            this.mContentChanged = true;
            this.mTempXmlList = [];
            this.mTempXmlNodeList = [];
            this.mLogicInfoList = [];
            //this.refreshShow()
            this.invalidateDisplayList();
        };
        // public showLastRow():void{
        // 	//this.refreshShow()
        // 	this.invalidateDisplayList();
        // }
        RichDisplayer.prototype.setAlignFlag = function (flag) {
            this.mAlignFlag = flag;
        };
        RichDisplayer.prototype.getLogicWidth = function () {
            this.refreshLogicShow();
            var logicW = 0;
            for (var i = 0; i < this.mRowInfoList.length; i++) {
                var rowInfo = this.mRowInfoList[i];
                logicW = Math.max(logicW, rowInfo.contentW);
            }
            return logicW;
        };
        RichDisplayer.prototype.getLogicHeight = function () {
            this.refreshLogicShow();
            var logicH = 0;
            for (var i = 0; i < this.mRowInfoList.length; i++) {
                var rowInfo = this.mRowInfoList[i];
                logicH += rowInfo.contentH + this.mRowDistance;
            }
            return logicH;
        };
        RichDisplayer.prototype.getLogicRowCount = function () {
            this.refreshLogicShow();
            return this.mRowInfoList.length;
        };
        RichDisplayer.prototype.refreshLogicShow = function () {
            var _this = this;
            if (this.mContentChanged == false)
                return;
            this.mContentChanged = false;
            this.mSizeChanged = true;
            if (this.mTempXmlList.length > 0) {
                var xmlContent = this.mTempXmlList.join();
                this.mTempXmlList = [];
                this._addXmlStringImp(xmlContent);
            }
            if (this.mTempXmlNodeList.length > 0) {
                this._addXmlNodeImp();
                this.mTempXmlNodeList = [];
            }
            //清理之前的控件内容
            if (this.mRowInfoList.length > 0) {
                this.mRowInfoList.forEach(function (rowInfo) {
                    rowInfo.mPosInfoList.forEach(function (posInfo) {
                        if (posInfo.window != null) {
                            //this.mContainer.removeChild(posInfo.window);
                            _this.releaseCtrl(posInfo.logicInfo.type, posInfo.window);
                            posInfo.window = null;
                        }
                    });
                });
                this.mRowInfoList.length = 0;
            }
            if (this.mLogicInfoList.length > 0) {
                //重新排位当前布局
                var displayW = this.width;
                var displayH = this.height;
                for (var i = 0; i < this.mLogicInfoList.length; i++) {
                    var logicInfo = this.mLogicInfoList[i];
                    if (logicInfo.type == 4 /* BrType */) {
                        var curRow = this.getCurrentRow();
                        curRow.full = true;
                        if (curRow.contentH == 0) {
                            curRow.contentH = logicInfo.value;
                        }
                    }
                    else if (logicInfo.type == 5 /* VerBlankType */) {
                        this.finishCurrentRow();
                        var curRow = this.getCurrentRow();
                        curRow.contentH = logicInfo.value;
                        this.finishCurrentRow();
                    }
                    else if (logicInfo.type == 6 /* HorBlankType */) {
                        var curRow = this.getCurrentRow();
                        this.addPosInfo(logicInfo, logicInfo.value, 0);
                        if (curRow.contentW > displayW) {
                            curRow.contentW = displayW;
                            this.finishCurrentRow();
                        }
                    }
                    else if (logicInfo.type == 2 /* ImageType */) {
                        this.insertImage(logicInfo);
                    }
                    else if (logicInfo.type == 3 /* AnimType */) {
                        this.insertAnim(logicInfo);
                    }
                    else if (logicInfo.type == 1 /* TextType */) {
                        this.insertText(logicInfo);
                    }
                }
            }
            //this.invalidateDisplayList();
        };
        RichDisplayer.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            // this.width = unscaledWidth;
            // this.height = unscaledHeight;
            // if(this.width == unscaledWidth && this.height == unscaledHeight && this.mContentChanged == false){
            // 	return
            // }
            do {
                if (this.width == 0 || this.height == 0) {
                    TLog.Error("RichDisplayer::refreshShow this.width == 0 || this.height == 0");
                    break;
                }
                // if (!this.visible) {
                // 	break;
                // }
                if (this.width != unscaledWidth || this.height != unscaledHeight) {
                    this.mSizeChanged = true;
                }
                // this.width = unscaledWidth;
                // this.height = unscaledHeight;
                //this.mContentChanged = false;
                //刷新逻辑排版
                this.refreshLogicShow();
                if (this.mSizeChanged == true) {
                    this.mSizeChanged = false;
                    //刷新实际排版
                    var logicStartX = 0;
                    var logicStartY = 0;
                    var logicW = this.getLogicWidth();
                    var logicH = this.getLogicHeight();
                    if ((this.mAlignFlag & gui.Flag.H_CENTER) == gui.Flag.H_CENTER) {
                        logicStartX = (this.width - logicW) / 2;
                    }
                    else if ((this.mAlignFlag & gui.Flag.RIGHT) == gui.Flag.RIGHT) {
                        logicStartX = this.width - logicW;
                    }
                    if ((this.mAlignFlag & gui.Flag.V_CENTER) == gui.Flag.V_CENTER) {
                        logicStartY = (this.height - logicH) / 2;
                    }
                    var startY = logicStartY;
                    for (var i = 0; i < this.mRowInfoList.length; i++) {
                        var rowInfo = this.mRowInfoList[i];
                        var contentH = rowInfo.contentH;
                        var contentW = rowInfo.contentW;
                        var contentStartX = 0;
                        if ((this.mAlignFlag & gui.Flag.H_CENTER) == gui.Flag.H_CENTER) {
                            contentStartX = (logicW - contentW) / 2;
                        }
                        else if ((this.mAlignFlag & gui.Flag.RIGHT) == gui.Flag.RIGHT) {
                            contentStartX = logicW - contentW;
                        }
                        var startX = contentStartX + logicStartX;
                        for (var j = 0; j < rowInfo.mPosInfoList.length; j++) {
                            var posInfo = rowInfo.mPosInfoList[j];
                            var logicInfo = posInfo.logicInfo;
                            var offY = contentH - posInfo.height + 2; //行下对齐
                            if (logicInfo.type == 1 /* TextType */) {
                                var text = logicInfo.text.substring(posInfo.param1, posInfo.param2 + 1);
                                var label = posInfo.window;
                                if (label == null) {
                                    label = posInfo.window = this.getSaveLabel(text);
                                }
                                gui.FontSet.getInstance().updateTextField(logicInfo.name, label, false);
                                label.textColor = logicInfo.color;
                                label.text = text;
                            }
                            else if (logicInfo.type == 2 /* ImageType */) {
                                var image = posInfo.window;
                                if (image == null) {
                                    image = posInfo.window = this.getSaveImage();
                                }
                                image.source = logicInfo.name;
                                image.touchEnabled = false;
                            }
                            else if (logicInfo.type == 3 /* AnimType */) {
                                var animBox = posInfo.window;
                                if (animBox == null) {
                                    animBox = posInfo.window = this.getSaveAnimBox();
                                }
                                animBox.setAnimName(logicInfo.name);
                                animBox.play();
                                animBox.touchEnabled = false;
                            }
                            var window_1 = posInfo.window;
                            if (window_1) {
                                window_1.x = startX;
                                window_1.y = startY + offY;
                                window_1.width = posInfo.width;
                                window_1.height = posInfo.height;
                            }
                            startX = startX + posInfo.width;
                        }
                        startX = 0;
                        startY = startY + rowInfo.contentH + this.mRowDistance;
                    }
                }
            } while (false);
            //基类Group的BasicLayout会计算RichDisplayer的content,用来计算滚动区域
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            if (this.mbShowLast) {
                //移动Scroller过程中，不设置滚动
                var curScrollV = this.scrollV;
                var bottomScrollV = this.contentHeight - this.height;
                if (bottomScrollV < 0) {
                    bottomScrollV = 0;
                }
                this.scrollV = bottomScrollV;
                // if(curScrollV == 0 || curScrollV == bottomScrollV){
                // 	this.scrollV = bottomScrollV;
                // }
            }
        };
        //=====================================================================
        RichDisplayer.prototype.setCtrlVisible = function (ctrl, b) {
            ctrl.visible = b;
            ctrl.includeInLayout = b;
        };
        RichDisplayer.prototype.releaseCtrl = function (type, ctrl) {
            if (this.mCacheCtrlList[type] == null) {
                this.mCacheCtrlList[type] = [];
            }
            this.setCtrlVisible(ctrl, false);
            this.mCacheCtrlList[type].push(ctrl);
        };
        RichDisplayer.prototype.getSaveLabel = function (text) {
            var type = 1 /* TextType */;
            var list = this.mCacheCtrlList[type];
            if (list == null) {
                list = this.mCacheCtrlList[type] = [];
            }
            if (list.length == 0) {
                var label = new eui.Label;
                label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRdTouchTapCapture, this, true);
                this.mContainer.addChild(label);
                list.push(label);
            }
            var ctrl = null;
            for (var i = 0; i < list.length; i++) {
                var label = list[i];
                if (label.text == text) {
                    list.splice(i, 1);
                    ctrl = label;
                    break;
                }
            }
            if (ctrl == null) {
                ctrl = list.pop();
            }
            this.setCtrlVisible(ctrl, true);
            return ctrl;
        };
        RichDisplayer.prototype.getSaveImage = function () {
            var type = 2 /* ImageType */;
            var list = this.mCacheCtrlList[type];
            if (list == null) {
                list = this.mCacheCtrlList[type] = [];
            }
            if (list.length == 0) {
                var image = new eui.Image;
                this.mContainer.addChild(image);
                list.push(image);
            }
            var ctrl = list.pop();
            this.setCtrlVisible(ctrl, true);
            return ctrl;
        };
        RichDisplayer.prototype.getSaveAnimBox = function () {
            var type = 3 /* AnimType */;
            var list = this.mCacheCtrlList[type];
            if (list == null) {
                list = this.mCacheCtrlList[type] = [];
            }
            if (list.length == 0) {
                var animBox = new gui.AnimBox;
                this.mContainer.addChild(animBox);
                list.push(animBox);
            }
            var ctrl = list.pop();
            this.setCtrlVisible(ctrl, true);
            return ctrl;
        };
        //=====================================================================
        RichDisplayer.prototype.getLogicInfoFromWindow = function (window) {
            for (var i = 0; i < this.mRowInfoList.length; i++) {
                var rowInfo = this.mRowInfoList[i];
                for (var j = 0; j < rowInfo.mPosInfoList.length; j++) {
                    var posInfo = rowInfo.mPosInfoList[j];
                    if (posInfo.window == window)
                        return posInfo.logicInfo;
                }
            }
            return null;
        };
        RichDisplayer.prototype.onRdTouchTapCapture = function (event) {
            var logicInfo = this.getLogicInfoFromWindow(event.target);
            if (logicInfo && logicInfo.link != "") {
                var event_5 = new gui.GUIHyperlinkEvent(RichDisplayer.RichDisplayerLinkCmdEvent, this);
                event_5.setHyperlink(logicInfo.link);
                this.dispatchEvent(event_5);
            }
        };
        RichDisplayer.TagBR = "br"; //换行<br />
        RichDisplayer.TagVerBlank = "ver_blank"; //竖直方向空多少像素<ver_blank value=32 />
        RichDisplayer.TagHorBlank = "hor_blank"; //水平方向空多少像素<ver_blank value=32 />
        RichDisplayer.TagText = "text"; //<text name="fs_16" color=green flag="" link="http://www.sfsd.com" mouse_on_color=red mouse_down_color=blue> 显示内容</text>
        RichDisplayer.TagImage = "image"; //<image name=team_icon border=1 link="http://www.sfsd.com" mouse_on_color=red mouse_down_color=blue />
        RichDisplayer.TagAnim = "anim"; //<anim name=haha_naim border=1 link="http://www.sfsd.com" mouse_on_color=red mouse_down_color=blue />
        //static AttStyle				= "style";
        RichDisplayer.AttName = "name"; //name
        RichDisplayer.AttColor = "color"; //color
        //static AttWidth				= "width";//width
        //static AttHeight			= "height";//height
        //static AttBorder			= "border";//border
        RichDisplayer.AttLink = "link"; //link
        //static AttMouseOnColor		= "mouse_on_color";//mouse_on_color;
        //static AttMouseDownColor	= "mouse_down_color";//mouse_down_color;
        RichDisplayer.AttValue = "value"; //value
        RichDisplayer.AttFlag = "flag"; //flag
        RichDisplayer.RichDisplayerLinkCmdEvent = "RichDisplayerLinkCmdEvent"; //超链接
        RichDisplayer.RichDisplayerTranslateEvent = "RichDisplayerTranslateEvent"; //词语转换
        return RichDisplayer;
    }(eui.Group));
    gui.RichDisplayer = RichDisplayer;
    __reflect(RichDisplayer.prototype, "gui.RichDisplayer");
})(gui || (gui = {}));
var gui;
(function (gui) {
    //弹跳按钮
    var Scroller = (function (_super) {
        __extends(Scroller, _super);
        function Scroller() {
            var _this = _super.call(this) || this;
            _this.touchScrollH = _this.$Scroller[8];
            _this.touchScrollV = _this.$Scroller[9];
            return _this;
        }
        Scroller.prototype.scrollToXY = function (scrollHor, scrollVer, anim) {
            var viewport = this.viewport;
            if (viewport == null)
                return;
            viewport.validateNow();
            this.stopAnimation();
            var maxScrollW = viewport.contentWidth - this.width;
            if (maxScrollW < 0)
                maxScrollW = 0;
            if (scrollHor > maxScrollW) {
                scrollHor = maxScrollW;
            }
            if (scrollHor < 0) {
                scrollHor = 0;
            }
            var maxScrollH = viewport.contentHeight - this.height;
            if (maxScrollH < 0)
                maxScrollH = 0;
            if (scrollVer > maxScrollH) {
                scrollVer = maxScrollH;
            }
            if (scrollVer < 0) {
                scrollVer = 0;
            }
            if (anim == false) {
                viewport.scrollH = scrollHor;
                viewport.scrollV = scrollVer;
            }
            else {
                this.touchScrollH.maxScrollPos = maxScrollW;
                this.touchScrollV.maxScrollPos = maxScrollH;
                this.touchScrollH.throwTo(scrollHor, 300);
                this.touchScrollV.throwTo(scrollVer, 300);
            }
        };
        return Scroller;
    }(eui.Scroller));
    gui.Scroller = Scroller;
    __reflect(Scroller.prototype, "gui.Scroller");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var ComboBox = (function (_super) {
        __extends(ComboBox, _super);
        function ComboBox() {
            var _this = _super.call(this) || this;
            _this.isPullDown = true;
            _this.maxItemCount = 10;
            _this._itemData = {};
            _this.initPullView();
            return _this;
        }
        // protected childrenCreated():void
        // {
        // 	//super.childrenCreated();
        // 	this.initPullView();
        // }
        ComboBox.prototype.updateData = function (key, value) {
            if (this._data == null)
                return;
            for (var i = 0; i < this._data.length; i++) {
                this._data[i][key] = value;
            }
        };
        ComboBox.prototype.initPullView = function () {
            // this.width = this.stage.stageWidth;
            // this.height = this.stage.stageHeight;
            var labelDefaultHeight = 30;
            //背景图片
            this.bg = new eui.Image();
            //this.bg.source = "resource/assets/ItemRenderer/selected.png"
            this.addChild(this.bg);
            this.bg.width = this.width;
            this.bg.height = labelDefaultHeight;
            //标题
            this.titleLabel = new eui.Label();
            this.addChild(this.titleLabel);
            this.titleLabel.width = this.width;
            this.titleLabel.height = labelDefaultHeight;
            this.titleLabel.textColor = 0x000000;
            this.titleLabel.verticalAlign = "middle";
            this.titleLabel.textAlign = "center";
            this.titleLabel.text = "ComboBox";
            this.titleLabel.size = 20;
            this.titleLabel.addEventListener(egret.TouchEvent.TOUCH_END, this.onRightIconBg, this);
            //1.准备数据
            var myCollection = new eui.ArrayCollection(this._data); //用ArrayCollection包装
            // var itemHeight = this._itemData["height"];
            // if(itemHeight == null){
            // 	itemHeight = this.height;
            // }
            //2.设置相关参数
            this.Scroller = new eui.Scroller();
            //this.addChild(this.Scroller);
            this.scrollY = labelDefaultHeight;
            this.Scroller.width = this.width;
            //this.Scroller.height = this.maxItemCount * itemHeight;
            this.setMaxItem(this.maxItemCount);
            this.DataGroup = new eui.DataGroup();
            this.Scroller.addChild(this.DataGroup);
            this.DataGroup.dataProvider = myCollection;
            this.DataGroup.itemRenderer = gui.ComboBoxItem;
            this.Scroller.viewport = this.DataGroup;
            //大数据优化:numElements 会获得总的数据条数. numChildren 会获得具体的实例数量.
            this.DataGroup.useVirtualLayout = true;
            this.Scroller.addEventListener(ComboBox.onClick, this.onItemClick, this);
            this.hide();
        };
        ComboBox.prototype.onRightIconBg = function (event) {
            if (!this.isPullDown) {
                //this.isPullDown = true;
                //展开
                //this.addChild(this.Scroller);
                this.show();
            }
            else {
                // this.isPullDown = false;
                // //收起
                // this.removeChild(this.Scroller);
                this.hide();
            }
        };
        ComboBox.prototype.getTitleLabe = function () {
            return this.titleLabel;
        };
        /**
         * Set the item width of the comboBox
         *
         */
        ComboBox.prototype.setItemWidth = function (width) {
            this.width = width;
            this.bg.width = width;
            this.titleLabel.width = width;
            this.Scroller.width = width;
            this.updateData("width", width);
            this._itemData["width"] = width;
        };
        /**
         * Set the item height of the comboBox
         *
         */
        ComboBox.prototype.setItemHeight = function (height) {
            this.updateData("height", height);
            this._itemData["height"] = height;
        };
        /**
         * Set the title fontSize of the comboBox
         */
        ComboBox.prototype.setItemFontSize = function (number) {
            if (number === void 0) { number = 25; }
            this.updateData("fontSize", number);
            this._itemData["fontSize"] = number;
        };
        /**
         * Set the title height of the comboBox
         *
         */
        ComboBox.prototype.setTitleHeight = function (height) {
            this.bg.height = height;
            this.titleLabel.height = height;
            //this.Scroller.y = height;
            this.scrollY = height;
            this.updatePos();
        };
        /**
         * Set the title background of the comboBox
         * example:"reource/picture.png"
         */
        ComboBox.prototype.setTitleBackground = function (src) {
            this.bg.source = src;
        };
        /**
         * Set the title fontSize of the comboBox
         */
        ComboBox.prototype.setTitleFontSize = function (number) {
            this.titleLabel.size = number;
        };
        ComboBox.prototype.setTitle = function (title) {
            this.titleLabel.text = title;
        };
        ComboBox.prototype.updatePos = function () {
            if (this.Scroller == null || this.Scroller.parent == null)
                return;
            var m = this.$getConcatenatedMatrix();
            var point = m.transformPoint(0, this.scrollY);
            this.Scroller.x = point.x;
            this.Scroller.y = point.y;
        };
        /**
         * Show the comboBox
         */
        ComboBox.prototype.show = function () {
            this.isPullDown = true;
            //展开
            this.stage.addChild(this.Scroller);
            this.updatePos();
        };
        /**
         * Hidden the comboBox
         */
        ComboBox.prototype.hide = function () {
            this.isPullDown = false;
            if (this.Scroller.parent) {
                //收起
                this.Scroller.parent.removeChild(this.Scroller);
            }
        };
        /**
         * TextAlign:"left";"center";"right"
         */
        ComboBox.prototype.setItemTextAlign = function (align) {
            this.titleLabel.textAlign = align;
            this.updateData("textAlign", align);
            this._itemData["textAlign"] = align;
        };
        ComboBox.prototype.$setWidth = function (value) {
            _super.prototype.$setWidth.call(this, value);
            if (this.Scroller) {
                this.Scroller.width = value;
                this.bg.width = value;
                this.titleLabel.width = value;
            }
        };
        ComboBox.prototype.$setHeight = function (value) {
            _super.prototype.$setHeight.call(this, value);
            // if(this.Scroller){
            // 	this.Scroller.height = this.height;
            // }
        };
        ComboBox.prototype.setMaxItem = function (num) {
            this.maxItemCount = num;
            if (this.Scroller) {
                var itemHeight = this._itemData["height"];
                if (itemHeight == null) {
                    itemHeight = this.height;
                }
                this.Scroller.height = this.maxItemCount * itemHeight;
            }
        };
        Object.defineProperty(ComboBox.prototype, "data", {
            get: function () {
                return this._data;
            },
            //setData(data:any[]){
            set: function (value) {
                this._data = value;
                if (this._itemData) {
                    for (var k in this._itemData) {
                        var v = this._itemData[k];
                        this.updateData(k, v);
                    }
                }
                if (this.DataGroup) {
                    var myCollection = new eui.ArrayCollection(this._data); //用ArrayCollection包装
                    this.DataGroup.dataProvider = myCollection;
                }
            },
            enumerable: true,
            configurable: true
        });
        ComboBox.prototype.onItemClick = function (event) {
            this.hide();
            this.dispatchEvent(event);
        };
        ComboBox.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageMouseDown, this);
        };
        ComboBox.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageMouseDown, this);
        };
        ComboBox.prototype.onStageMouseDown = function (event) {
            if (this.contains(event.target) == false && this.Scroller.contains(event.target) == false) {
                this.hide();
            }
        };
        //抛出事件
        ComboBox.onClick = "ComboBoxOnClick";
        return ComboBox;
    }(eui.Component));
    gui.ComboBox = ComboBox;
    __reflect(ComboBox.prototype, "gui.ComboBox");
})(gui || (gui = {}));
// TypeScript file
var core;
(function (core) {
    var NetSystem = (function (_super) {
        __extends(NetSystem, _super);
        function NetSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetSystem.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTcpListLock = 0;
            this.mTcpList = [];
            this.mHttpListLock = 0;
            this.mHttpList = [];
        };
        NetSystem.prototype.destory = function () {
            this.clearAll();
        };
        NetSystem.prototype.createNetWork = function () {
            var list = this.mTcpList;
            if (this.mTcpListLock > 0) {
                list = this.mTcpList = this.mTcpList.concat(); //原来的list正在lock,copy出来 
            }
            var nw = core.NetWork.newObj();
            list.push(nw);
            return nw;
        };
        NetSystem.prototype.removeNetWork = function (nw) {
            var index = this.mTcpList.indexOf(nw);
            if (index == -1) {
                return false;
            }
            var list = this.mTcpList;
            if (this.mTcpListLock > 0) {
                list = this.mTcpList = this.mTcpList.concat(); //原来的list正在lock,copy出来 
            }
            nw.deleteObj();
            list.splice(index, 1);
            return true;
        };
        NetSystem.prototype.createHttpClient = function () {
            var list = this.mHttpList;
            if (this.mHttpListLock > 0) {
                list = this.mHttpList = this.mHttpList.concat(); //原来的list正在lock,copy出来 
            }
            var nw = core.HttpClient.newObj();
            list.push(nw);
            return nw;
        };
        NetSystem.prototype.removeHttpClient = function (httpnw) {
            var index = this.mHttpList.indexOf(httpnw);
            if (index == -1) {
                return false;
            }
            var list = this.mHttpList;
            if (this.mHttpListLock > 0) {
                list = this.mHttpList = this.mHttpList.concat(); //原来的list正在lock,copy出来 
            }
            httpnw.deleteObj();
            list.splice(index, 1);
        };
        NetSystem.prototype.onUpdate = function () {
            var tcpList = this.mTcpList;
            var httpList = this.mHttpList;
            this.mTcpListLock++;
            for (var _i = 0, tcpList_1 = tcpList; _i < tcpList_1.length; _i++) {
                var nw = tcpList_1[_i];
                nw.onUpdate();
            }
            this.mTcpListLock--;
            this.mHttpListLock++;
            for (var _a = 0, httpList_1 = httpList; _a < httpList_1.length; _a++) {
                var hw = httpList_1[_a];
                hw.onUpdate();
            }
            this.mHttpListLock--;
        };
        NetSystem.prototype.clearAll = function () {
            for (var _i = 0, _a = this.mTcpList; _i < _a.length; _i++) {
                var nw = _a[_i];
                nw.deleteObj();
            }
            this.mTcpList = null;
            for (var _b = 0, _c = this.mHttpList; _b < _c.length; _b++) {
                var hw = _c[_b];
                hw.onUpdate();
            }
            this.mHttpList = null;
        };
        return NetSystem;
    }(TClass));
    core.NetSystem = NetSystem;
    __reflect(NetSystem.prototype, "core.NetSystem");
})(core || (core = {}));
var gui;
(function (gui) {
    var AnimInfo = (function (_super) {
        __extends(AnimInfo, _super);
        function AnimInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AnimInfo;
    }(TClass));
    gui.AnimInfo = AnimInfo;
    __reflect(AnimInfo.prototype, "gui.AnimInfo");
    var AnimSet = (function (_super) {
        __extends(AnimSet, _super);
        function AnimSet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        AnimSet.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mInfoList = {};
        };
        //子类复写 析构函数
        AnimSet.prototype.destory = function () {
        };
        AnimSet.prototype.insertInfo = function (name, w, h, count, interval) {
            TLog.Assert(name != "" && w != null && h != null && count != null && interval != null);
            var info = AnimInfo.newObj();
            info.w = w;
            info.h = h;
            info.count = count;
            info.interval = interval;
            this.mInfoList[name] = info;
            return true;
        };
        AnimSet.prototype.getAnimInfo = function (name) {
            return this.mInfoList[name];
        };
        AnimSet.prototype.getAnimSize = function (name) {
            var info = this.getAnimInfo(name);
            if (info == null)
                return null;
            return { w: info.w, h: info.h };
        };
        AnimSet.prototype.getAnimFrameNum = function (name) {
            var info = this.getAnimInfo(name);
            if (info == null)
                return;
            return info.count;
        };
        return AnimSet;
    }(TClass));
    gui.AnimSet = AnimSet;
    __reflect(AnimSet.prototype, "gui.AnimSet");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var FontInfo = (function (_super) {
        __extends(FontInfo, _super);
        function FontInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        FontInfo.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        //子类复写 析构函数
        FontInfo.prototype.destory = function () {
        };
        FontInfo.prototype.init = function (fontName, fontSize, flag) {
            this.fontName = fontName;
            this.fontSize = fontSize;
            this.flag = flag;
        };
        FontInfo.prototype.setColor = function (color) {
            this.color = color;
        };
        FontInfo.prototype.setShadowColor = function (color) {
            this.shadowColor = color;
        };
        FontInfo.prototype.setShadowOffset = function (shadownOffset) {
            this.shadownOffset = shadownOffset;
        };
        FontInfo.prototype.setSpace = function (space_x, space_y) {
            this.space_x = space_x;
            this.space_y = space_y;
        };
        FontInfo.prototype.setStroke = function (stroke) {
            this.stroke = stroke;
        };
        FontInfo.prototype.isBold = function () {
            return (this.flag & gui.FontFlag.BOLD) != 0;
        };
        FontInfo.prototype.isItalic = function () {
            return (this.flag & gui.FontFlag.ITALIC) != 0;
        };
        return FontInfo;
    }(TClass));
    gui.FontInfo = FontInfo;
    __reflect(FontInfo.prototype, "gui.FontInfo");
    var FontSet = (function (_super) {
        __extends(FontSet, _super);
        function FontSet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        FontSet.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mFontList = {};
        };
        //子类复写 析构函数
        FontSet.prototype.destory = function () {
            this.clearAllFont();
        };
        FontSet.prototype.insertFont = function (name, fontName, fontSize, color, backColor, flag, space_x, space_y, stoke, shadownOffset) {
            var font = this.mFontList[name];
            if (font) {
                font.init(fontName, fontSize, flag);
                font.setColor(color);
                font.setShadowColor(backColor);
                font.setSpace(space_x, space_y);
                font.setStroke(stoke);
                font.setShadowOffset(shadownOffset);
                return false;
            }
            font = FontInfo.newObj();
            font.init(fontName, fontSize, flag);
            font.setColor(color);
            font.setShadowColor(backColor);
            font.setSpace(space_x, space_y);
            font.setStroke(stoke);
            font.setShadowOffset(shadownOffset);
            this.mFontList[name] = font;
        };
        FontSet.prototype.getFont = function (name) {
            var font = this.mFontList[name];
            if (font == null) {
                TLog.Error("FontSet.getFont %s not exist", name);
                return null;
            }
            return font;
        };
        FontSet.prototype.clearAllFont = function () {
            for (var k in this.mFontList) {
                var font = this.mFontList[k];
                font.deleteObj();
            }
            this.mFontList = null;
        };
        FontSet.prototype.hasFlag = function (testValue, flag) {
            return (testValue & flag) != 0;
        };
        FontSet.prototype.updateTextField = function (name, text, colorChange) {
            if (colorChange == null) {
                colorChange = true;
            }
            var fontInfo = this.getFont(name);
            if (fontInfo == null)
                return;
            var flag = fontInfo.flag;
            //字体名
            text.fontFamily = fontInfo.fontName;
            //尺寸
            text.size = fontInfo.fontSize;
            if (colorChange) {
                //颜色
                text.textColor = fontInfo.color;
            }
            //行距
            text.lineSpacing = fontInfo.space_y;
            //斜体
            text.italic = this.hasFlag(flag, gui.FontFlag.ITALIC);
            //粗体
            text.bold = this.hasFlag(flag, gui.FontFlag.BOLD);
            //描边
            if (this.hasFlag(flag, gui.FontFlag.STROKE)) {
                text.stroke = fontInfo.stroke;
                text.strokeColor = fontInfo.shadowColor;
            }
            else {
                text.stroke = 0;
            }
            var hAlign = egret.HorizontalAlign.LEFT;
            var vAlign = egret.VerticalAlign.TOP;
            //布局
            // if(this.hasFlag(flag, gui.Flag.LEFT)){
            // 	hAlign = egret.HorizontalAlign.LEFT;
            // } else
            if (this.hasFlag(flag, gui.Flag.H_CENTER)) {
                hAlign = egret.HorizontalAlign.CENTER;
            }
            else if (this.hasFlag(flag, gui.Flag.RIGHT)) {
                hAlign = egret.HorizontalAlign.RIGHT;
            }
            // if (this.hasFlag(flag, gui.Flag.TOP)) {
            // 	vAlign = egret.VerticalAlign.TOP;
            // } else 
            if (this.hasFlag(flag, gui.Flag.V_CENTER)) {
                vAlign = egret.VerticalAlign.MIDDLE;
            }
            else if (this.hasFlag(flag, gui.Flag.BOTTOM)) {
                vAlign = egret.VerticalAlign.BOTTOM;
            }
            if (hAlign && vAlign) {
                text.textAlign = hAlign;
                text.verticalAlign = vAlign;
            }
        };
        return FontSet;
    }(TClass));
    gui.FontSet = FontSet;
    __reflect(FontSet.prototype, "gui.FontSet");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var ImageInfo = (function (_super) {
        __extends(ImageInfo, _super);
        function ImageInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        ImageInfo.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.subTexture = null;
            this.baseTexture = null;
        };
        //子类复写 析构函数
        ImageInfo.prototype.destory = function () {
            this.subTexture = null;
            this.baseTexture = null;
        };
        return ImageInfo;
    }(TClass));
    gui.ImageInfo = ImageInfo;
    __reflect(ImageInfo.prototype, "gui.ImageInfo");
    var ImageSet = (function (_super) {
        __extends(ImageSet, _super);
        function ImageSet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        ImageSet.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mResMgr = core.ResManager.getInstance();
            this.mTextureMgr = core.TextureManager.getInstance();
            this.mTextureMgr.addEventListener(core.TextureEvent.TextureDisposeEvent, this.onTextureDispose, this);
            this.mInfoList = {};
        };
        //子类复写 析构函数
        ImageSet.prototype.destory = function () {
            this.clearInfo();
            this.mTextureMgr.removeEventListener(core.TextureEvent.TextureDisposeEvent, this.onTextureDispose, this);
        };
        ImageSet.prototype.loadImageSet = function (path, callback) {
            var _this = this;
            var resCallback = {
                onResItemLoad: function (res) {
                    _this.onImageSetInfoLoad(path, res.getData());
                    callback.onImageSetLoad(path);
                },
                onResItemError: function (key) {
                    callback.onImageSetLoad(path);
                }
            };
            this.mResMgr.loadResAsyn(path, resCallback, core.ResourceType.TYPE_JSON);
        };
        ImageSet.prototype.onImageSetInfoLoad = function (url, config) {
            var file = config["file"];
            url = url.split("\\").join("/");
            var params = url.match(/#.*|\?.*/);
            var paramUrl = "";
            if (params) {
                paramUrl = params[0];
            }
            var index = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            var imageUrl = url + paramUrl;
            var frames = config.frames;
            var info = ImageInfo.createObj();
            for (var name in frames) {
                var v = frames[name];
                info.x = v.x;
                info.y = v.y;
                info.w = v.w;
                info.h = v.h;
                info.offX = v.offX;
                info.offY = v.offY;
                info.sourceW = v.sourceW;
                info.sourceH = v.sourceH;
                this.insertInfo(name, imageUrl, info);
            }
        };
        ImageSet.prototype.insertInfo = function (name, path, imageInfo) {
            if (name == "" || path == "" || imageInfo == null)
                return false;
            if (this.mInfoList[name] != null) {
                return false;
            }
            var info = ImageInfo.newObj();
            info.x = imageInfo.x;
            info.y = imageInfo.y;
            info.w = imageInfo.w;
            info.h = imageInfo.h;
            info.offX = imageInfo.offX;
            info.offY = imageInfo.offY;
            info.sourceW = imageInfo.sourceW;
            info.sourceH = imageInfo.sourceH;
            info.name = imageInfo.name;
            info.fileName = path;
            ;
            this.mInfoList[name] = info;
            return true;
        };
        ImageSet.prototype.clearInfo = function () {
            for (var k in this.mInfoList) {
                var v = this.mInfoList[k];
                v.deleteObj();
            }
            this.mInfoList = {};
        };
        ImageSet.prototype.getImageInfo = function (key) {
            if (key == null || key == "")
                return null;
            var imageInfo = this.mInfoList[key];
            if (imageInfo == null) {
                var pos = key.lastIndexOf(".");
                if (pos != -1) {
                    var keyInterval = key.substring(pos + 1);
                    imageInfo = this.mInfoList[keyInterval];
                }
            }
            return imageInfo;
        };
        // createSubTexture(baseTexture:egret.Texture, name:string, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number, offsetX:number = 0, offsetY:number = 0):egret.Texture{
        // 	let texture:egret.Texture = new egret.Texture();
        //     texture._bitmapData = baseTexture._bitmapData;
        //     texture.$initData(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, bitmapWidth, bitmapHeight, bitmapWidth, bitmapHeight);
        // 	return texture;
        // }
        ImageSet.prototype.createSubTexture = function (baseTexture, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (textureWidth == void 0) {
                textureWidth = offsetX + bitmapWidth;
            }
            if (textureHeight == void 0) {
                textureHeight = offsetY + bitmapHeight;
            }
            var texture = new egret.Texture();
            texture.$bitmapData = baseTexture.$bitmapData;
            texture.$initData(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, baseTexture.$sourceWidth, baseTexture.$sourceHeight);
            return texture;
        };
        ImageSet.prototype.loadTextureAsyn = function (key, callback) {
            var self = this;
            var imageInfo = self.getImageInfo(key);
            if (imageInfo != null) {
                if (imageInfo.subTexture != null) {
                    callback.onAsynTextureSucceed(key, imageInfo.subTexture);
                }
                else {
                    //加载imageInfo的texture
                    var imageInfoCallback = {
                        onAsynTextureSucceed: function (fileName, baseTexture) {
                            imageInfo.baseTexture = baseTexture;
                            imageInfo.subTexture = self.createSubTexture(baseTexture, imageInfo.x, imageInfo.y, imageInfo.w, imageInfo.h, imageInfo.offX, imageInfo.offY, imageInfo.sourceW, imageInfo.sourceH);
                            callback.onAsynTextureSucceed(key, imageInfo.subTexture);
                        }
                    };
                    self.mTextureMgr.loadTextureAsyn(imageInfo.fileName, imageInfoCallback);
                }
            }
            else {
                self.mTextureMgr.loadTextureAsyn(key, callback);
            }
        };
        ImageSet.prototype.onTextureDispose = function (event) {
            var imagePath = event.path;
            //纹理被清空，相应的子纹理被清空
            for (var k in this.mInfoList) {
                var imageInfo = this.mInfoList[k];
                if (imageInfo.fileName == imagePath) {
                    if (imageInfo.subTexture) {
                        imageInfo.subTexture.$bitmapData = null;
                        imageInfo.subTexture = null;
                    }
                    if (imageInfo.baseTexture) {
                        imageInfo.baseTexture.$bitmapData = null;
                        imageInfo.baseTexture = null;
                    }
                }
            }
        };
        return ImageSet;
    }(TClass));
    gui.ImageSet = ImageSet;
    __reflect(ImageSet.prototype, "gui.ImageSet");
})(gui || (gui = {}));
//MapManager是地图模块的管理类，负责的逻辑包括：
//1.加载地图TileMap
//2.寻路模块
//3.MapSprite的添加和移除
var map;
(function (map) {
    var MapEvent = (function (_super) {
        __extends(MapEvent, _super);
        function MapEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapEvent.prototype.initObj = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.userData = args[0];
        };
        MapEvent.LOAD_MAP_FINISH = "LOAD_MAP_FINISH";
        return MapEvent;
    }(core.EventArgs));
    map.MapEvent = MapEvent;
    __reflect(MapEvent.prototype, "map.MapEvent");
    var MapManager = (function (_super) {
        __extends(MapManager, _super);
        function MapManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mFileName = "";
            _this.mResMgr = null;
            _this.mMapData = null;
            return _this;
        }
        MapManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mResMgr = core.ResManager.getInstance();
            // this.mMapLoadedCallback = null;
            // this.mMapLoadedCallBackObj = null;
            this.mMapLayerList = [];
            this.mbLayersOrderChange = false;
            this.m_pPathMgr = map.PathMgr.newObj();
            this.m_pLogicMask = map.LogicMask.newObj();
            this.m_pLogicBlock = this.m_pPathMgr.getLogicBlock();
            this.m_loadingMapPathList = [];
            this.mStaticImageMap = {};
            this.mAreaAnimMap = {};
            this.mAreaParticleMap = {};
            this.m_bBeginLoadTileImage = false;
            this.m_loadingTileImageList = [];
        };
        MapManager.prototype.destory = function () {
            if (this.m_pPathMgr) {
                this.m_pPathMgr.deleteObj();
                this.m_pPathMgr = null;
            }
        };
        MapManager.prototype.init = function (rootNode) {
            TLog.Assert(this.mTileMap == null, "initWithRootNode this.mTileMap == null");
            //this.mRootNode = rootNode;
            this.mTileMap = new map.TileMap(rootNode);
            var cam = this.mTileMap.getCamera();
            cam.setViewSize(rootNode.stage.stageWidth, rootNode.stage.stageHeight);
            //cam.touchChildren = true;
            cam.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDown, this);
            cam.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMouseMove, this);
            cam.addEventListener(egret.TouchEvent.TOUCH_END, this.onMouseUp, this);
        };
        MapManager.prototype.onMouseDown = function (evt) {
            if (this.mInputCallback) {
                this.mInputCallback.onMapMouseDownEvent(evt);
            }
        };
        MapManager.prototype.onMouseMove = function (evt) {
            if (this.mInputCallback) {
                this.mInputCallback.onMapMouseMoveEvent(evt);
            }
        };
        MapManager.prototype.onMouseUp = function (evt) {
            if (this.mInputCallback) {
                this.mInputCallback.onMapMouseUpEvent(evt);
            }
        };
        MapManager.prototype.setInputCallback = function (callback) {
            this.mInputCallback = callback;
        };
        MapManager.prototype.getTileMap = function () {
            return this.mTileMap;
        };
        MapManager.prototype.getCamera = function () {
            return this.mTileMap.getCamera();
        };
        MapManager.prototype.onUpdate = function () {
            if (this.mbLayersOrderChange) {
                this.mbLayersOrderChange = false;
                this.mTileMap.sortLayers();
            }
            this.mTileMap.onUpdate();
        };
        //==========================正在加载的资源==========================
        MapManager.prototype.addLoadingTileImage = function (path) {
            var index = this.m_loadingTileImageList.indexOf(path);
            if (index == -1) {
                this.m_bBeginLoadTileImage = true;
                this.m_loadingTileImageList.push(path);
            }
        };
        MapManager.prototype.removeLoadingTileImage = function (path) {
            var index = this.m_loadingTileImageList.indexOf(path);
            if (index != -1) {
                this.m_loadingTileImageList.splice(index, 1);
            }
        };
        //返回-1表示还没开始加载
        MapManager.prototype.getLoadingTileImageCount = function () {
            if (this.m_bBeginLoadTileImage == false)
                return -1;
            return this.m_loadingTileImageList.length;
        };
        //==========================begin加载地图==========================
        //loadMap(filename:string, callback?:()=>void, thisObject?:any){
        MapManager.prototype.loadMap = function (filename, userData) {
            if (filename == "")
                return false;
            if (filename.lastIndexOf("/") != filename.length - 1) {
                filename = filename + "/";
            }
            //如果当前正在加载，则加入列表。当加载完成后，再次调用m_loadingMapPathList最后一个路径加载地图
            this.m_loadingMapPathList.push(filename);
            if (this.m_loadingMapPathList.length > 1) {
                return false;
            }
            if (this.mFileName == filename) {
                egret.callLater(this.onLoadMapFinish, this);
                //this.onLoadMapFinish()
                return true;
            }
            this.mFileName = filename;
            this.mUserData = userData;
            this.m_bBeginLoadTileImage = false;
            this.m_loadingTileImageList = [];
            // this.mMapLoadedCallback = callback;
            // this.mMapLoadedCallBackObj = thisObject;
            var indexXML = this.mFileName.concat("index.xml");
            var self = this;
            var xmlCallback = {
                onResItemLoad: function (res) {
                    self.onLoadMapXml(res.getData(), filename);
                },
                onResItemError: function (key) {
                }
            };
            this.mResMgr.loadResAsyn(indexXML, xmlCallback, core.ResourceType.TYPE_TEXT);
            return true;
        };
        MapManager.prototype.onLoadMapXml = function (xmlStr, mapfile) {
            // if(this.mFileName != mapfile)
            // 	return;
            TLog.Assert(this.mFileName == mapfile);
            var mapData = new map.MapData;
            this.mMapData = mapData;
            //TLog.Debug(xml);
            var xml = TXML.parse(xmlStr);
            mapData.mapId = TXML.queryIntText(TXML.findChild(xml, "id"), -1);
            mapData.mapName = TXML.queryText(TXML.findChild(xml, "name"));
            mapData.colNum = TXML.queryIntText(TXML.findChild(xml, "colNum"), -1);
            mapData.rowNum = TXML.queryIntText(TXML.findChild(xml, "rowNum"), -1);
            mapData.tileWidth = TXML.queryIntText(TXML.findChild(xml, "tileWidth"), -1);
            mapData.tileHeight = TXML.queryIntText(TXML.findChild(xml, "tileHeight"), -1);
            mapData.layerNum = TXML.queryIntText(TXML.findChild(xml, "layerNum"), -1);
            var self = this;
            var callback = {
                onResItemLoad: function (res) {
                    //self.onLoadMapXml(data, filename);
                    var dataList = self.mMapData.layerDataList;
                    var len = dataList.length;
                    var loadFinish = true;
                    for (var i = 0; i < len; i++) {
                        var layerData = dataList[i];
                        if (layerData.layerFileName == res.getKey()) {
                            layerData.layerStream = new BinaryStream(res.getData());
                            layerData.layerStream.setNetMode(false);
                            layerData.resItem = res;
                            res.retain();
                        }
                        if (layerData.layerStream == null) {
                            loadFinish = false;
                        }
                    }
                    //配置文件全部加载完毕
                    if (loadFinish) {
                        self.onLoadMapImp();
                    }
                },
                onResItemError: function (key) {
                    TLog.Error("LoadMapError:" + key);
                }
            };
            for (var i = 0; i < mapData.layerNum; i++) {
                var type = TXML.queryIntText(TXML.findChild(xml, "type" + i));
                var id = TXML.queryIntText(TXML.findChild(xml, "id" + i));
                var layerDataFileName = this.mFileName.concat(type + "_" + id + ".dat"); //3_1001.dat
                var layerData = new map.MapLayerData(id, type, layerDataFileName);
                mapData.layerDataList.push(layerData);
                this.mResMgr.loadResAsyn(layerDataFileName, callback, core.ResourceType.TYPE_BIN);
            }
        };
        MapManager.prototype._loadMapMetaData = function (reader) {
            var mLayerType = reader.readByte();
            var mLayerID = reader.readShort();
            var mName = reader.readString();
            var ver_0_flag = 0xffff4321;
            var flag = reader.readUInt();
            if (flag != ver_0_flag)
                return false;
            var cellSizew_ = reader.readUInt();
            var cellSizeh_ = reader.readUInt();
            var numW_ = reader.readUInt();
            var numH_ = reader.readUInt();
            var compress = reader.readUShort();
            var mMetaType = reader.readByte();
            //颜色层信息，这里不用
            var num = reader.readShort();
            for (var i = 0; i < num; i++) {
                var color = reader.readInt();
                var v = reader.readByte();
            }
            var buffer = [];
            buffer.length = numW_ * numH_;
            for (var i = 0; i < numW_ * numH_; i++) {
                buffer[i] = reader.readByte();
            }
            if ("block" == mName) {
                this.m_pPathMgr.RefreshLogicBlock(numW_, numH_, buffer);
            }
            else if ("mask" == mName) {
                //this.RefreshLogicMask(buff);
                this.m_pLogicMask.ReloadMask(numW_, numH_, buffer);
            }
            return true;
        };
        MapManager.prototype.onLoadMapImp = function () {
            var _this = this;
            var tileMap = this.mTileMap;
            var mapData = this.mMapData;
            tileMap.setId(mapData.mapId);
            tileMap.setName(mapData.mapName);
            tileMap.setMapSize(mapData.colNum, mapData.rowNum, mapData.tileWidth, mapData.tileHeight);
            for (var i = 0; i < this.mMapLayerList.length; i++) {
                var layer = this.mMapLayerList[i];
                tileMap.removeLayer(layer);
                layer.deleteObj();
            }
            this.mMapLayerList.length = 0;
            var mapW = tileMap.getMapWidth();
            var mapH = tileMap.getMapHeight();
            var cellXCount = map.LogicBlock.getCellX(mapW);
            var cellYCount = map.LogicBlock.getCellX(mapH);
            this.m_pPathMgr.ResetLogicBlock(cellXCount, cellYCount);
            this.m_pLogicMask.ResetMask(cellXCount, cellYCount);
            // int cellXCount = GetMapWidth() / ILogicBlock::CellWidth;
            // int cellYCount = GetMapHeight() / ILogicBlock::CellHeight;
            // IMapSystem::instance->GetPathMgr()->ResetLogicBlock(cellXCount,cellYCount);
            // IMapSystem::instance->ResetLogicMask(cellXCount,cellYCount);
            mapData.layerDataList.forEach(function (layerData) {
                var stream = layerData.layerStream;
                var layerType = stream.readByte();
                stream.position = 0; //重置流位置
                var zorder = 0;
                var layer = null;
                switch (layerType) {
                    case map.MapLayerType.TileLayerType:
                        {
                            layer = map.MapTileLayer.newObj(tileMap);
                            layer.load(stream);
                            layer.setZOrder(zorder);
                            zorder++;
                        }
                        break;
                    case map.MapLayerType.MetaLayerType:
                        {
                            _this._loadMapMetaData(stream);
                        }
                        break;
                    case map.MapLayerType.AreaLayerType:
                        {
                            layer = map.MapAreaElemLayer.newObj(tileMap);
                            layer.load(stream);
                            layer.setZOrder(zorder);
                            zorder++;
                        }
                        break;
                }
                if (layer) {
                    layer.initEyeshot(tileMap.getMapWidth(), tileMap.getMapHeight(), map.EyeGridSize, map.EyeGridSize);
                    tileMap.addLayer(layer);
                    _this.mMapLayerList.push(layer);
                }
            });
            // let testlayer:MapAreaElemLayer = MapAreaElemLayer.newObj(tileMap);
            // testlayer.setZOrder(1);
            // let mapElem1:MapAreaElem = MapAreaElem.newObj()
            // mapElem1.initWithParam(1, "fireworks", new egret.Rectangle(1120, 512, 1, 1), "outside_particle");
            // testlayer.mAreaElemList.push(mapElem1)
            // let mapElem2:MapAreaElem = MapAreaElem.newObj()
            // mapElem2.initWithParam(2, "shoushou", new egret.Rectangle(1120, 612, 1, 1), "frame_anim");
            // testlayer.mAreaElemList.push(mapElem2)
            // let mapElem3:MapAreaElem = MapAreaElem.newObj()
            // mapElem3.initWithParam(3, "huoyan_EFF", new egret.Rectangle(1120, 712, 1, 1), "frame_anim");
            // testlayer.mAreaElemList.push(mapElem3)
            // testlayer.initEyeshot(tileMap.getMapWidth(), tileMap.getMapHeight(), EyeGridSize, EyeGridSize);
            // tileMap.addLayer(testlayer);
            // this.mMapLayerList.push(testlayer);
            this.mbLayersOrderChange = true;
            //更新下camera
            this.getCamera().setViewChanged(true);
            tileMap.updateCameraView();
            this.mMapData.clear();
            this.mMapData = null;
            this.onLoadMapFinish();
        };
        MapManager.prototype.onLoadMapFinish = function () {
            // if(this.mMapLoadedCallback){
            // 	this.mMapLoadedCallback.call(this.mMapLoadedCallBackObj);
            // }
            var index = this.m_loadingMapPathList.indexOf(this.mFileName);
            if (index != -1) {
                this.m_loadingMapPathList.splice(index, 1);
            }
            if (this.m_loadingMapPathList.length > 0) {
                var path = this.m_loadingMapPathList.pop();
                this.m_loadingMapPathList = []; //清空之前无效的调用
                this.loadMap(path);
            }
            else {
                this.fireEvent(map.MapEvent.LOAD_MAP_FINISH, MapEvent.newObj(this.mUserData));
            }
        };
        //==========================end加载地图==========================
        //==========================begin MapSprite管理==========================
        MapManager.prototype.addSpriteLayer = function (tag, layer) {
            layer.setTag(tag);
            layer.setZOrder(tag);
            this.mTileMap.addLayer(layer);
            this.mbLayersOrderChange = true;
        };
        MapManager.prototype.removeSpriteLayer = function (layer) {
            if (this.mTileMap.removeLayer(layer)) {
                layer.setTag(-1);
            }
            this.mbLayersOrderChange = true;
        };
        MapManager.prototype.getSpriteLayer = function (tag) {
            var layerList = this.mTileMap.mLayerList;
            var length = layerList.length;
            for (var i = 0; i < length; i++) {
                var layer = layerList[i];
                if (layer instanceof map.SpriteLayer) {
                    var slayer = layer;
                    if (slayer.getTag() == tag) {
                        return slayer;
                    }
                }
            }
            return null;
        };
        MapManager.prototype.enterMap = function (sprite, layerTag) {
            var layer = this.getSpriteLayer(layerTag);
            if (layer) {
                return layer.addSprite(sprite);
            }
            return false;
        };
        MapManager.prototype.leaveMap = function (sprite) {
            var layer = sprite.getLayer();
            if (layer) {
                return layer.removeSprite(sprite);
            }
            return false;
        };
        MapManager.prototype.changeMapLayer = function (sprite, tag) {
            var enterLayer = this.getSpriteLayer(tag);
            TLog.Assert(enterLayer != null);
            var leaveLayer = sprite.getLayer();
            if (enterLayer == null || leaveLayer == null || enterLayer == leaveLayer)
                return false;
            leaveLayer.removeSprite(sprite);
            enterLayer.addSprite(sprite);
        };
        //==========================end MapSprite管理==========================	
        MapManager.prototype.getPathMgr = function () {
            return this.m_pPathMgr;
        };
        MapManager.prototype.getLogicMask = function () {
            return this.m_pLogicMask;
        };
        MapManager.prototype.getLogicBlock = function () {
            return this.m_pLogicBlock;
        };
        //===============================地图资源===============================
        MapManager.prototype.setStaticImage = function (id, path, width, height) {
            this.mStaticImageMap[id] = { path: path, width: path, height: height };
        };
        MapManager.prototype.getStaticImagePath = function (id) {
            var info = this.mStaticImageMap[id];
            if (!info)
                return "";
            return info.path;
        };
        //地图帧动画
        MapManager.prototype.addAreaAnimConfig = function (name, animPath, animDelay, scale) {
            if (scale <= 0)
                scale = 1;
            this.mAreaAnimMap[name] = { path: animPath, delay: animDelay, scale: scale };
        };
        MapManager.prototype.getAreaAnimConfig = function (name) {
            return this.mAreaAnimMap[name];
        };
        MapManager.prototype.addAreaParticleConfig = function (name, particlePath) {
            this.mAreaParticleMap[name] = { path: particlePath };
        };
        MapManager.prototype.getAreaParticleConfig = function (name) {
            return this.mAreaParticleMap[name];
        };
        return MapManager;
    }(core.EventSet));
    map.MapManager = MapManager;
    __reflect(MapManager.prototype, "map.MapManager");
})(map || (map = {}));
var core;
(function (core) {
    var HttpResult = (function (_super) {
        __extends(HttpResult, _super);
        function HttpResult() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HttpResult.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.url = params[0];
            this.bSucceed = (params[1] == egret.Event.COMPLETE);
            this.response = params[2];
            this.listen_list = params[3];
        };
        HttpResult.prototype.destory = function () {
            this.listen_list = null;
            this.response = null;
        };
        return HttpResult;
    }(TClass));
    core.HttpResult = HttpResult;
    __reflect(HttpResult.prototype, "core.HttpResult");
    var HttpClient = (function (_super) {
        __extends(HttpClient, _super);
        function HttpClient() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HttpClient.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this._dataFormat = HttpClient.FORMAT_TEXT;
            this._resultList = [];
            this._recycler = [];
            this.mRequestId2Url = {};
            this.mUrl2ListernList = {};
        };
        HttpClient.prototype.destory = function () {
        };
        HttpClient.prototype.send = function (url, callback, userData) {
            var listener_list = this.mUrl2ListernList[url];
            if (listener_list == null) {
                this.mUrl2ListernList[url] = listener_list = [];
            }
            var length = listener_list.length;
            for (var i = 0; i < length; i++) {
                var info = listener_list[i];
                if (info.callback == callback && info.userData == userData) {
                    TLog.Debug("HttpClient send already exsit:%s", url);
                    return;
                }
            }
            listener_list.push({ callback: callback, userData: userData });
            //正在发送
            if (listener_list.length > 1) {
                return;
            }
            var request = this.getRequest();
            // request.setRequestHeader("Access-Control-Allow-Origin", "*");
            // request.setRequestHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
            request.open(url);
            request.send();
            this.mRequestId2Url[request.hashCode] = url;
        };
        HttpClient.prototype.cancel = function (callback) {
            for (var url in this.mUrl2ListernList) {
                var listen_list = this.mUrl2ListernList[url];
                if (listen_list) {
                    for (var i = 0; i < listen_list.length; i++) {
                        var listener = listen_list[i];
                        if (listener.callback == callback) {
                            listener.callback = null;
                        }
                    }
                }
            }
        };
        HttpClient.prototype.setDataFormat = function (format) {
            this._dataFormat = format;
        };
        HttpClient.prototype.getRequest = function () {
            var request = this._recycler.pop();
            if (!request) {
                request = new egret.HttpRequest();
                request.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            }
            request.responseType = this._dataFormat;
            return request;
        };
        HttpClient.prototype.onLoadFinish = function (event) {
            var request = (event.target);
            var url = this.mRequestId2Url[request.hashCode];
            var listener_list = this.mUrl2ListernList[url];
            delete this.mRequestId2Url[request.hashCode];
            delete this.mUrl2ListernList[url];
            TLog.Assert(listener_list);
            var result = (event.type == egret.Event.COMPLETE);
            this._resultList.push(HttpResult.newObj(url, event.type, request.response, listener_list));
            this._recycler.push(request);
        };
        //所有回调函数，需要在同一个update处理
        HttpClient.prototype.onUpdate = function () {
            if (this._resultList.length > 0) {
                var resultList = this._resultList;
                for (var _i = 0, resultList_1 = resultList; _i < resultList_1.length; _i++) {
                    var result = resultList_1[_i];
                    var url = result.url;
                    var response = result.response;
                    var bSucceed = result.bSucceed;
                    result.listen_list.forEach(function (listener) {
                        var callback = listener.callback;
                        if (callback) {
                            var userData = listener.userData;
                            if (bSucceed) {
                                callback.onHttpResponse(url, response, userData);
                            }
                            else {
                                callback.onHttpError(url, userData);
                            }
                        }
                    });
                    result.deleteObj();
                }
                this._resultList.length = 0;
            }
        };
        HttpClient.FORMAT_BINARY = egret.HttpResponseType.ARRAY_BUFFER;
        HttpClient.FORMAT_TEXT = egret.HttpResponseType.TEXT;
        return HttpClient;
    }(TClass));
    core.HttpClient = HttpClient;
    __reflect(HttpClient.prototype, "core.HttpClient");
})(core || (core = {}));
var map;
(function (map) {
    function FLOOR(x) {
        return Math.floor(x);
    }
    map.FLOOR = FLOOR;
    map.EyeGridSize = 256;
    //地图层类型
    var MapLayerType;
    (function (MapLayerType) {
        MapLayerType[MapLayerType["NullLayerType"] = 0] = "NullLayerType";
        MapLayerType[MapLayerType["TileLayerType"] = 1] = "TileLayerType";
        MapLayerType[MapLayerType["AdornmentLayerType"] = 2] = "AdornmentLayerType";
        MapLayerType[MapLayerType["MetaLayerType"] = 3] = "MetaLayerType";
        MapLayerType[MapLayerType["AreaLayerType"] = 4] = "AreaLayerType";
    })(MapLayerType = map.MapLayerType || (map.MapLayerType = {}));
    ;
    //地图层数据
    var MapLayerData = (function () {
        function MapLayerData(layerId, layerType, layerFileName) {
            this.layerFileName = layerFileName;
            this.layerId = layerId;
            this.layerType = layerType;
            this.layerStream = null;
            this.resItem = null;
        }
        return MapLayerData;
    }());
    map.MapLayerData = MapLayerData;
    __reflect(MapLayerData.prototype, "map.MapLayerData");
    //地图数据
    var MapData = (function () {
        function MapData() {
            this.layerDataList = [];
        }
        MapData.prototype.clear = function () {
            this.layerDataList.forEach(function (value) {
                value.layerStream.clear();
                value.resItem.release();
            });
            this.layerDataList = null;
        };
        return MapData;
    }());
    map.MapData = MapData;
    __reflect(MapData.prototype, "map.MapData");
})(map || (map = {}));
var map;
(function (map) {
    var LogicBlockType;
    (function (LogicBlockType) {
        LogicBlockType[LogicBlockType["CellWidth"] = 16] = "CellWidth";
        LogicBlockType[LogicBlockType["CellHeight"] = 16] = "CellHeight";
        LogicBlockType[LogicBlockType["HalfCellWidth"] = 8] = "HalfCellWidth";
        LogicBlockType[LogicBlockType["HalfCellHeight"] = 8] = "HalfCellHeight";
    })(LogicBlockType || (LogicBlockType = {}));
    ;
    function MyAbs(x) {
        var t = x >> 31;
        x ^= t;
        x -= t;
        return x;
    }
    function MyMin(x, y) {
        var t = (x - y) >> 31;
        x &= t;
        y &= ~t;
        return x | y;
    }
    function MyMax(x, y) {
        var t = (x - y) >> 31;
        x &= ~t;
        y &= t;
        return x | y;
    }
    function MySign(x) {
        var t = x >> 31;
        var t2 = -x >> 31;
        return t | -t2;
    }
    var LogicBlock = (function (_super) {
        __extends(LogicBlock, _super);
        function LogicBlock() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        LogicBlock.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.bufferSize = 0;
            this.buffer = [];
            this.width = 0;
            this.height = 0;
        };
        //子类复写 析构函数
        LogicBlock.prototype.destory = function () {
        };
        LogicBlock.getCellX = function (x) { return map.FLOOR(x / LogicBlockType.CellWidth); };
        LogicBlock.getCellY = function (y) { return map.FLOOR(y / LogicBlockType.CellHeight); };
        LogicBlock.getXFromCell = function (x) { return x * LogicBlockType.CellWidth + LogicBlockType.HalfCellWidth; };
        LogicBlock.getYFromCell = function (y) { return y * LogicBlockType.CellHeight + LogicBlockType.HalfCellHeight; };
        //把最外面一圈设为阻挡
        LogicBlock.prototype.InitAreaLimit = function () {
            if (this.width == 0 || this.height == 0)
                return;
            var len = this.width * this.height;
            var x = 0;
            var y = 0;
            this.buffer.length = len;
            for (var i = 0; i < len; i++) {
                if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1) {
                    this.buffer[i] = 1;
                }
                else {
                    this.buffer[i] = 0;
                }
                x++;
                if (x >= this.width) {
                    x = 0;
                    y++;
                }
            }
        };
        LogicBlock.prototype.SetBlock = function (x, y, block) {
            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                return;
            }
            this.buffer[x + y * this.width] = block;
        };
        LogicBlock.prototype.ClearBlock = function () {
            for (var i = 0; i < this.buffer.length; i++) {
                this.buffer[i] = 0;
            }
        };
        LogicBlock.prototype.IsBlock = function (point) {
            if (this.buffer == null || !this.IsValid(point)) {
                return true;
            }
            return this.buffer[point.x + point.y * this.width] != 0;
        };
        LogicBlock.prototype.IsValid = function (point) {
            if (point.x < 0 || point.x >= this.width || point.y < 0 || point.y >= this.height) {
                return false;
            }
            return true;
        };
        LogicBlock.prototype.HaveBlock = function (from, to) {
            var block = {};
            return this.FirstBlock(from, to, block);
        };
        LogicBlock.prototype.FirstBlock = function (from, to, firstBlock) {
            if (this.buffer == null
                || from.x < 0 || from.x >= this.width || from.y < 0 || from.y >= this.height
                || to.x < 0 || to.x >= this.width || to.y < 0 || to.y >= this.height) {
                return false;
            }
            var dx = to.x - from.x;
            var dy = to.y - from.y;
            var sdx = MySign(dx);
            var sdy = MySign(dy);
            dx = MyAbs(dx) * 2;
            dy = MyAbs(dy) * 2;
            firstBlock.x = from.x;
            firstBlock.y = from.y;
            if (dx >= dy) {
                var e = -(dx >> 1) + (dy >> 1);
                firstBlock.x += sdx;
                for (; firstBlock.x != to.x; firstBlock.x += sdx) {
                    if (e != 0)
                        if (this.IsBlock(firstBlock))
                            return true;
                    e += dy;
                    if (e > 0) {
                        firstBlock.y += sdy;
                        e -= dx;
                        if (this.IsBlock(firstBlock))
                            return true;
                    }
                } //for
            }
            else {
                var e = -(dy >> 1) + (dx >> 1);
                firstBlock.y += sdy;
                for (; firstBlock.y != to.y; firstBlock.y += sdy) {
                    if (e != 0)
                        if (this.IsBlock(firstBlock))
                            return true;
                    e += dx;
                    if (e > 0) {
                        firstBlock.x += sdx;
                        e -= dy;
                        if (this.IsBlock(firstBlock))
                            return true;
                    }
                } //for
            }
            return false;
        };
        LogicBlock.prototype.FirstNotBlock = function (from, to, firstNotBlock) {
            if (this.buffer == null
                || from.x < 0 || from.x >= this.width || from.y < 0 || from.y >= this.height
                || to.x < 0 || to.x >= this.width || to.y < 0 || to.y >= this.height) {
                return false;
            }
            var dx = to.x - from.x;
            var dy = to.y - from.y;
            var sdx = MySign(dx);
            var sdy = MySign(dy);
            dx = MyAbs(dx) * 2;
            dy = MyAbs(dy) * 2;
            firstNotBlock.x = from.x;
            firstNotBlock.y = from.y;
            if (dx >= dy) {
                var e = -(dx >> 1) + (dy >> 1);
                firstNotBlock.x += sdx;
                for (; firstNotBlock.x != to.x; firstNotBlock.x += sdx) {
                    if (e != 0)
                        if (!this.IsBlock(firstNotBlock))
                            return true;
                    e += dy;
                    if (e > 0) {
                        firstNotBlock.y += sdy;
                        e -= dx;
                        if (!this.IsBlock(firstNotBlock))
                            return true;
                    }
                } //for
            }
            else {
                var e = -(dy >> 1) + (dx >> 1);
                firstNotBlock.y += sdy;
                for (; firstNotBlock.y != to.y; firstNotBlock.y += sdy) {
                    if (e != 0)
                        if (!this.IsBlock(firstNotBlock))
                            return true;
                    e += dx;
                    if (e > 0) {
                        firstNotBlock.x += sdx;
                        e -= dy;
                        if (!this.IsBlock(firstNotBlock))
                            return true;
                    }
                } //for
            }
            return false;
        };
        LogicBlock.prototype.LastBlock = function (from, to, lastBlock) {
            if (this.buffer == null
                || from.x < 0 || from.x >= this.width || from.y < 0 || from.y >= this.height
                || to.x < 0 || to.x >= this.width || to.y < 0 || to.y >= this.height) {
                return false;
            }
            if (!this.IsBlock(from)) {
                return false;
            }
            lastBlock = from;
            var _lastBlock = from;
            var dx = to.x - from.x;
            var dy = to.y - from.y;
            var sdx = MySign(dx);
            var sdy = MySign(dy);
            dx = MyAbs(dx) * 2;
            dy = MyAbs(dy) * 2;
            if (dx >= dy) {
                var e = -(dx >> 1) + (dy >> 1);
                _lastBlock.x += sdx;
                for (; _lastBlock.x != to.x; _lastBlock.x += sdx) {
                    if (e != 0) {
                        if (!this.IsBlock(_lastBlock)) {
                            return true;
                        }
                        else {
                            lastBlock = _lastBlock;
                        }
                    }
                    e += dy;
                    if (e > 0) {
                        _lastBlock.y += sdy;
                        e -= dx;
                        if (!this.IsBlock(_lastBlock)) {
                            return true;
                        }
                        else {
                            lastBlock = _lastBlock;
                        }
                    }
                } //for
            }
            else {
                var e = -(dy >> 1) + (dx >> 1);
                _lastBlock.y += sdy;
                for (; _lastBlock.y != to.y; _lastBlock.y += sdy) {
                    if (e != 0) {
                        if (!this.IsBlock(_lastBlock)) {
                            return true;
                        }
                        else {
                            lastBlock = _lastBlock;
                        }
                    }
                    e += dx;
                    if (e > 0) {
                        _lastBlock.x += sdx;
                        e -= dy;
                        if (!this.IsBlock(_lastBlock)) {
                            return true;
                        }
                        else {
                            lastBlock = _lastBlock;
                        }
                    }
                } //for
            }
            return false;
        };
        LogicBlock.prototype.LastNotBlock = function (from, to, lastNotBlock) {
            if (this.buffer == null
                || from.x < 0 || from.x >= this.width || from.y < 0 || from.y >= this.height
                || to.x < 0 || to.x >= this.width || to.y < 0 || to.y >= this.height) {
                return false;
            }
            var dx = from.x - to.x;
            var dy = from.y - to.y;
            var sdx = MySign(dx);
            var sdy = MySign(dy);
            dx = MyAbs(dx) * 2;
            dy = MyAbs(dy) * 2;
            lastNotBlock.x = to.x;
            lastNotBlock.y = to.y;
            if (dx >= dy) {
                var e = -(dx >> 1) + (dy >> 1);
                lastNotBlock.x += sdx;
                for (; lastNotBlock.x != to.x; lastNotBlock.x += sdx) {
                    if (e != 0)
                        if (!this.IsBlock(lastNotBlock))
                            return true;
                    e += dy;
                    if (e > 0) {
                        lastNotBlock.y += sdy;
                        e -= dx;
                        if (!this.IsBlock(lastNotBlock))
                            return true;
                    }
                } //for
            }
            else {
                var e = -(dy >> 1) + (dx >> 1);
                lastNotBlock.y += sdy;
                for (; lastNotBlock.y != to.y; lastNotBlock.y += sdy) {
                    if (e != 0)
                        if (!this.IsBlock(lastNotBlock))
                            return true;
                    e += dx;
                    if (e > 0) {
                        lastNotBlock.x += sdx;
                        e -= dy;
                        if (!this.IsBlock(lastNotBlock))
                            return true;
                    }
                } //for
            }
            return false;
        };
        LogicBlock.prototype.MaxBlock = function (pt, ptDest) {
        };
        return LogicBlock;
    }(TClass));
    map.LogicBlock = LogicBlock;
    __reflect(LogicBlock.prototype, "map.LogicBlock");
})(map || (map = {}));
var map;
(function (map) {
    function MyAbs(x) {
        var t = x >> 31;
        x ^= t;
        x -= t;
        return x;
    }
    function MyMin(x, y) {
        var t = (x - y) >> 31;
        x &= t;
        y &= ~t;
        return x | y;
    }
    function MyMax(x, y) {
        var t = (x - y) >> 31;
        x &= ~t;
        y &= t;
        return x | y;
    }
    function MySign(x) {
        var t = x >> 31;
        var t2 = -x >> 31;
        return t | -t2;
    }
    var TLink = (function () {
        function TLink() {
            this.clear();
        }
        TLink.prototype.clear = function () {
            this.h = 0;
            this.x = 0;
            this.y = 0;
            this.f = 0;
            this.next = null;
            this.father = null;
            this.next = null;
        };
        return TLink;
    }());
    __reflect(TLink.prototype, "TLink");
    ;
    var LogicFinder = (function (_super) {
        __extends(LogicFinder, _super);
        function LogicFinder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        LogicFinder.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.distanceBuffer = [];
            this.closeListBuffer = [];
            this.openListBuffer = [];
            this.openNodeList = null;
            this.blockBuffer = [];
            this.linkBuffer = {};
            // this.linkBuffer.length = LogicFinder.MAX_NODE;
            // for(let i = 0; i <  LogicFinder.MAX_NODE, i++){
            // 	this.linkBuffer[i] = new TLink;
            // }
        };
        //子类复写 析构函数
        LogicFinder.prototype.destory = function () {
        };
        LogicFinder.prototype.ReLoad = function (block) {
            this.distanceBuffer.length = 0;
            this.closeListBuffer.length = 0;
            this.openListBuffer.length = 0;
            this.width = block.width;
            this.height = block.height;
            var iLen = this.width * this.height;
            this.distanceBuffer.length = iLen;
            this.closeListBuffer.length = iLen;
            this.openListBuffer.length = iLen;
            this.blockBuffer = block.buffer;
            return true;
        };
        LogicFinder.prototype.memset = function (buff, val) {
            for (var i = 0; i < buff.length; i++) {
                buff[i] = val;
            }
        };
        LogicFinder.prototype.Find = function (from, to, iMaxStep) {
            if (from.y <= 0 || to.y <= 0) {
                //LogOut(Core::IOutputDevice::Error, ("LogicFinder::FindPath::this.distanceBuffer == 0 || this.blockBuffer == 0"));
                return 0;
            }
            if (from.x < 0 || from.x >= this.width || from.y < 0 || from.y >= this.height
                || to.x < 0 || to.x >= this.width || to.y < 0 || to.y >= this.height) {
                return 0;
            }
            this.memset(this.distanceBuffer, 0);
            this.memset(this.closeListBuffer, false);
            this.memset(this.openListBuffer, 0);
            this.linkBuffer = {};
            // for (let i = 0; i < this.linkBuffer.length; i++) {
            // 	let link = this.linkBuffer[i];
            // 	link.clear();
            // }
            var iStartX = from.x;
            var iStartY = from.y;
            this.endX = to.x;
            this.endY = to.y;
            this.openNodeList = null;
            //ClearHeap();
            this.iUsed = 1;
            this.rootLink = null;
            //this.openListLength = 0;
            var buffer = this.addOpenList(iStartX, iStartY);
            buffer.h = 0;
            buffer.father = null;
            buffer.f = this.judge(iStartX, iStartY);
            buffer.next = null;
            return this.FindNext(iMaxStep);
        };
        LogicFinder.prototype.FindNext = function (iMaxStep) {
            var root = null;
            var step = 0;
            for (;;) {
                //当次寻路大于最大步数,留到下一帧再进行
                if (step > iMaxStep) {
                    return 0xFFFFFFFF;
                }
                root = this.getOpenLowestCostNode();
                if (root == null)
                    return 0;
                var x = root.x;
                var y = root.y;
                if (x == this.endX && y == this.endY)
                    break; // succ get to dest
                this.removeOpenList(x, y);
                this.addCloseList(x, y);
                var h = (root.h + 5);
                var offset = x + (y - 1) * this.width;
                this.addNeighborNode(x, y - 1, h, root); //up
                h += 2;
                this.addNeighborNode(x + 1, y - 1, h, root); ///up right
                this.addNeighborNode(x - 1, y - 1, h, root); ///up left
                h -= 2;
                this.addNeighborNode(x - 1, y, h, root); ///left
                this.addNeighborNode(x + 1, y, h, root); ///right
                h += 2;
                this.addNeighborNode(x + 1, y + 1, h, root); ///down right
                this.addNeighborNode(x - 1, y + 1, h, root); ///down left
                h -= 2;
                this.addNeighborNode(x, y + 1, h, root); ///down
                if (this.iUsed >= LogicFinder.MAX_NODE - 10) {
                    return 0;
                }
                step++;
            }
            // save success node to path list
            this.rootLink = root;
            var p = root;
            var len = 0;
            while (p) {
                len++;
                p = p.father;
            }
            this.linkBuffer = {};
            return len;
        };
        LogicFinder.prototype.judge = function (x, y) {
            var dx = MyAbs(this.endX - x);
            var dy = MyAbs(this.endY - y);
            return MyAbs(dx - dy) * 5 + MyMin(dx, dy) * 7;
        };
        LogicFinder.prototype.addNeighborNode = function (x, y, h, father) {
            var offset = x + y * this.width;
            if (this.closeListBuffer[offset] || this.blockBuffer[offset])
                return;
            if (this.openListBuffer[offset]) {
                if (h < this.distanceBuffer[offset]) {
                    var node = this.getOpenNode(x, y);
                    node.father = father;
                    node.h = h;
                    node.f = h + this.judge(x, y);
                    this.distanceBuffer[offset] = h;
                }
            }
            else {
                var pNewNode = this.addOpenList(x, y);
                pNewNode.father = father;
                pNewNode.h = h;
                pNewNode.f = h + this.judge(x, y);
                this.distanceBuffer[offset] = h;
            }
        };
        LogicFinder.prototype.addCloseList = function (x, y) {
            this.closeListBuffer[x + this.width * y] = true;
        };
        LogicFinder.prototype.removeOpenList = function (x, y) {
            var offset = x + this.width * y;
            var index = this.openListBuffer[offset];
            if (index == 0)
                return;
            var buffer = this.linkBuffer[index];
            buffer.index = 0;
            this.openListBuffer[offset] = 0;
        };
        LogicFinder.prototype.addOpenList = function (x, y) {
            var index = this.iUsed;
            var buffer = this.linkBuffer[index];
            if (buffer == null) {
                buffer = new TLink;
                this.linkBuffer[index] = buffer;
            }
            buffer.index = index;
            buffer.x = x;
            buffer.y = y;
            buffer.next = null;
            this.openListBuffer[x + this.width * y] = index;
            if (this.openNodeList == null) {
                this.openNodeList = buffer;
            }
            else {
                buffer.next = this.openNodeList.next;
                this.openNodeList.next = buffer;
            }
            this.iUsed++;
            return buffer;
        };
        LogicFinder.prototype.getOpenNode = function (x, y) {
            var offset = x + this.width * y;
            var index = this.openListBuffer[offset];
            if (index == 0)
                return null;
            var buffer = this.linkBuffer[index];
            if (buffer.index == 0)
                return null;
            return buffer;
        };
        LogicFinder.prototype.getOpenLowestCostNode = function () {
            if (this.openNodeList == null)
                return null;
            var buffer = null;
            var cost = 0x7fffffff;
            var node = this.openNodeList;
            var last = null;
            while (node) {
                if (node.index == 0) {
                    //删除结点
                    if (last == null) {
                        this.openNodeList = node.next;
                        node = this.openNodeList;
                    }
                    else {
                        last.next = node.next;
                        node = node.next;
                    }
                    continue;
                }
                else {
                    //检查最小估值
                    if (node.f < cost) {
                        cost = node.f;
                        buffer = node;
                    }
                }
                last = node;
                node = node.next;
            }
            return buffer;
        };
        LogicFinder.prototype.GetPoint = function (out) {
            if (this.rootLink == null) {
                return false;
            }
            var p = this.rootLink;
            var len = 0;
            while (p) {
                len++;
                p = p.father;
            }
            p = this.rootLink;
            var i;
            for (i = len - 1; p; i--) {
                out[i] = {};
                out[i].x = p.x;
                out[i].y = p.y;
                p = p.father;
            }
            if (i != -1) {
                //LogOut(itf::iOutput::Error, "LogicFinder::FindPath len not match %d", len);
                return false;
            }
            return true;
        };
        LogicFinder.MAX_NODE = 90000;
        return LogicFinder;
    }(TClass));
    map.LogicFinder = LogicFinder;
    __reflect(LogicFinder.prototype, "map.LogicFinder");
})(map || (map = {}));
var map;
(function (map) {
    var LogicMask = (function (_super) {
        __extends(LogicMask, _super);
        function LogicMask() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        LogicMask.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.bufferSize = 0;
            this.buffer = null;
            this.width = 0;
            this.height = 0;
            this.enable = true;
        };
        //子类复写 析构函数
        LogicMask.prototype.destory = function () {
        };
        LogicMask.prototype.ResetMask = function (width, height) {
            this.buffer = null;
            this.width = width;
            this.height = height;
        };
        LogicMask.prototype.ReloadMask = function (width, height, buffer) {
            this.buffer = null;
            this.width = width;
            this.height = height;
            this.buffer = buffer;
        };
        LogicMask.prototype.IsMask = function (x, y) {
            if (!this.enable)
                return false;
            if (this.buffer == null || !this.IsValid(x, y)) {
                return false;
            }
            return this.buffer[x + y * this.width] != 0;
        };
        LogicMask.prototype.IsValid = function (x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return false;
            }
            return true;
        };
        LogicMask.prototype.SetMaskEnable = function (enable) {
            this.enable = enable;
        };
        return LogicMask;
    }(TClass));
    map.LogicMask = LogicMask;
    __reflect(LogicMask.prototype, "map.LogicMask");
})(map || (map = {}));
var map;
(function (map) {
    var FIND_MAX_STEP = 1000;
    var TIME_ROTATE = 0;
    var TIME_ROTATE_START = 0;
    var EWalkLineType;
    (function (EWalkLineType) {
        EWalkLineType[EWalkLineType["WLT_NORMAL"] = 0] = "WLT_NORMAL";
        EWalkLineType[EWalkLineType["WLT_START"] = 1] = "WLT_START";
        EWalkLineType[EWalkLineType["WLT_END"] = 2] = "WLT_END";
    })(EWalkLineType || (EWalkLineType = {}));
    ;
    var ECreatePath;
    (function (ECreatePath) {
        ECreatePath[ECreatePath["CP_NOTNEED"] = -1] = "CP_NOTNEED";
        ECreatePath[ECreatePath["CP_FAIL"] = 0] = "CP_FAIL";
        ECreatePath[ECreatePath["CP_FINE"] = 1] = "CP_FINE";
        ECreatePath[ECreatePath["CP_FINDNEXT"] = 2] = "CP_FINDNEXT";
        ECreatePath[ECreatePath["CP_LOCKFIND"] = 3] = "CP_LOCKFIND";
    })(ECreatePath || (ECreatePath = {}));
    ;
    var TWalkLine = (function () {
        function TWalkLine() {
        }
        return TWalkLine;
    }());
    __reflect(TWalkLine.prototype, "TWalkLine");
    var LogicPath = (function (_super) {
        __extends(LogicPath, _super);
        function LogicPath() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        LogicPath.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.m_ptLastSend = {};
            this.m_ptEnd = {};
            this.m_pLine = null; //各段路线
            this.m_bSended = false;
            this.m_dwLastSendPosTime = 0;
            this.m_ptLastSend.x = 0;
            this.m_ptLastSend.y = 0;
            this.m_iMidX = 0;
            this.m_iMidY = 0;
            this.m_bFindNext = false;
            this.m_bSendPos = false;
            this.m_iSpeed = 12;
            this.m_iDropStep = 0;
            this.m_iMaxStep = FIND_MAX_STEP;
            this.m_iDirNum = 8; //只支持4 和 8
            this.mFindPathState = 0;
        };
        //子类复写 析构函数
        LogicPath.prototype.destory = function () {
        };
        LogicPath.prototype.init = function (block, finder) {
            this.m_pBlock = block;
            this.m_pPathFinder = finder;
        };
        LogicPath.prototype.CreatePathLine = function (listPoint, ptStart, ptEnd, iStartDir, currentTime) {
            //计算各条路线
            // std::list< IntPoint >::iterator iter = listPoint.begin();
            // ++iter;//脚下的点
            var ptLast = ptStart;
            var iPointLen = listPoint.length;
            //n_assert( iPointLen > 1 );
            this.m_iMaxLine = iPointLen - 1; // 共有多少条路段
            //var bWalk = (this.m_pLine != null);
            //SafeDeleteArray(this.m_pLine);
            //delete [] this.m_pLine;
            // if (this.m_pLine)
            // {
            // 	free(this.m_pLine);
            // 	this.m_pLine = 0;
            // }
            this.m_pLine = [];
            this.m_pLine.length = this.m_iMaxLine + 1;
            for (var i = 0; i < this.m_pLine.length; i++) {
                this.m_pLine[i] = new TWalkLine();
            }
            // var buf_len = sizeof(TWalkLine) * (this.m_iMaxLine + 1);
            // this.m_pLine = (TWalkLine*)malloc(buf_len);//, "map_path_line");
            // ::memset(this.m_pLine, 0, buf_len);
            this.firstUpdateTime = true;
            this.timeOffset = 0;
            //if( !bWalk )
            this.m_pLine[0].iType |= EWalkLineType.WLT_START;
            this.m_pLine[0].uTimeStart = currentTime; //itf::iSystem::CurrentTime;
            //this.m_pLine[0].uTimeStart	=	timeGetTime();
            this.m_pLine[0].iDirStart = iStartDir;
            this.m_pLine[0].ptStart = ptStart;
            this.m_pLine[this.m_iMaxLine - 1].iType |= EWalkLineType.WLT_END;
            //#ifdef _DEBUG
            //	int x_ = ptStart.x;
            //	int y_ = ptStart.y;
            //	x_ = XRealToGrid(x_);
            //	y_ = YRealToGrid( y_);
            //	debugf(TEXT("%d %d"), x_, y_);
            //#endif
            //#ifdef _DEBUG
            //	f(TEXT("create tiem %d, x %d, y %d"), this.m_pLine[0].uTimeStart, ptStart.x, ptStart.y);
            //#endif
            var i = 0;
            for (var k = 1; k < listPoint.length; k++) {
                var pt = listPoint[k]; //下一个目标点
                ////n_assert( !this.m_pBlock.IsBlock(pt.x, pt.y) );
                //pt.x *= GRID_WIDTH;
                //pt.y *= GRID_HEIGHT;
                //pt.x += GRID_WIDTH/2;
                //pt.y += GRID_HEIGHT/2;
                //debugf(TEXT("%d %d"), pt.x, pt.y);
                pt.x = map.LogicBlock.getXFromCell(pt.x);
                pt.y = map.LogicBlock.getYFromCell(pt.y);
                if (i != 0) {
                    this.m_pLine[i].uTimeStart = this.m_pLine[i - 1].uTimeEnd;
                    this.m_pLine[i].iDirStart = this.m_pLine[i - 1].iDir;
                    this.m_pLine[i].ptStart = ptLast;
                }
                this.SetLine(pt, this.m_iSpeed, this.m_pLine[i]);
                i++;
                ptLast = pt;
            }
            listPoint.length = 0;
            this.m_ptEnd = ptLast;
            this.m_iCurLine = 0;
            this.m_iCurThousand = 0;
        };
        LogicPath.prototype.UpdateTime = function (delay) {
            this.m_iCurrentTime += delay;
        };
        LogicPath.prototype.UpdatePos = function (outValue) {
            if (this._GetStateIsEnd(outValue, this.m_iCurrentTime)) {
                if (this.m_pLine != null) {
                    ////n_assert( abs(x-m_ptEnd.x) + abs(y-m_ptEnd.y) <= 20 );
                    outValue.dir = this.m_pLine[this.m_iMaxLine - 1].iDir;
                    outValue.x = this.m_ptEnd.x;
                    outValue.y = this.m_ptEnd.y;
                    this.m_pLine = null;
                }
                return true;
            }
            return false;
        };
        LogicPath.prototype.Clear = function () {
            this.m_pLine = null;
            this.m_iMaxLine = 0;
            this.firstUpdateTime = false;
            this.timeOffset = 0;
        };
        LogicPath.prototype.SetSpeed = function (speed) {
            this.m_iSpeed = speed;
        };
        LogicPath.prototype.GetSpeed = function () {
            return this.m_iSpeed;
        };
        LogicPath.prototype.SetLine = function (ptEnd, iSpeed, pWalkLine) {
            var dx = ptEnd.x - pWalkLine.ptStart.x;
            var dy = ptEnd.y - pWalkLine.ptStart.y;
            var dAngle = Math.atan2(dy * 1.4142135623731, dx); //角度
            var dDir = dAngle * (180 / 3.14159265359);
            var iDir = dDir;
            if (iDir < 0)
                iDir += 360;
            pWalkLine.iDir = iDir % 360;
            var iDistance = 1600 * iSpeed;
            pWalkLine.dx = map.FLOOR(Math.cos(dAngle) * iDistance);
            pWalkLine.dy = map.FLOOR(Math.sin(dAngle) * iDistance * 0.70710678118654);
            var uUseTime; // 单位毫秒
            if (dx != 0)
                uUseTime = dx * 100000 / pWalkLine.dx;
            else if (dy != 0)
                uUseTime = dy * 100000 / pWalkLine.dy;
            else
                uUseTime = 1;
            pWalkLine.iRotateSign = 0;
            if (pWalkLine.iDirStart != pWalkLine.iDir) {
                //int iInc = (pWalkLine.iDir - pWalkLine.iDirStart + 8) % 8;
                //pWalkLine.iRotateSign = 1;
                //if( iInc > 8 - iInc )
                //{
                //	pWalkLine.iRotateSign = -1;
                //	iInc = 8 - iInc;
                //}
                var iInc = (pWalkLine.iDir - pWalkLine.iDirStart + 360) % 360;
                pWalkLine.iRotateSign = 1;
                if (iInc > 360 - iInc) {
                    pWalkLine.iRotateSign = -1;
                    iInc = 360 - iInc;
                }
                if (pWalkLine.iType & EWalkLineType.WLT_START) {
                    uUseTime += iInc * TIME_ROTATE_START;
                }
            }
            pWalkLine.uTimeEnd = pWalkLine.uTimeStart + uUseTime;
        };
        LogicPath.prototype._GetStateIsEnd = function (outValue, currentTime) {
            if (this.m_pLine == null)
                return true;
            //计算当前路段
            var dwCurTime = currentTime; //itf::iSystem::CurrentTime;
            if (this.firstUpdateTime) {
                this.timeOffset = dwCurTime - this.m_pLine[0].uTimeStart;
                this.firstUpdateTime = false;
            }
            dwCurTime -= this.timeOffset;
            while (this.m_iCurLine != this.m_iMaxLine && this.m_pLine[this.m_iCurLine].uTimeEnd <= dwCurTime) {
                this.m_iCurThousand = 0;
                this.m_iCurLine++;
                //如果走完了
                if (this.m_iCurLine == this.m_iMaxLine) {
                    return true;
                }
            }
            //消耗时间
            var iUseTime = (dwCurTime - this.m_pLine[this.m_iCurLine].uTimeStart);
            if (iUseTime < 0) {
                return true;
            }
            //n_assert( iUseTime >= 0 );
            var lineAllTime = this.m_pLine[this.m_iCurLine].uTimeEnd - this.m_pLine[this.m_iCurLine].uTimeStart;
            if (lineAllTime > 0) {
                this.m_iCurThousand = iUseTime * 1000 / lineAllTime;
            }
            //n_assert( this.m_iCurLine < this.m_iMaxLine );
            var pCurLine = this.m_pLine[this.m_iCurLine];
            var iRotateDir = ((pCurLine.iDir - pCurLine.iDirStart) * pCurLine.iRotateSign + 360) % 360;
            //int iRotateDir = ( (pCurLine.iDir - pCurLine.iDirStart) * pCurLine.iRotateSign) & 0x0ffff;
            ////n_assert( iRotateDir <= 4 );
            //int iOldx = x, iOldy = y;
            outValue.x = pCurLine.ptStart.x;
            outValue.y = pCurLine.ptStart.y;
            // 第一段路
            if (pCurLine.iType & EWalkLineType.WLT_START) {
                var iRotateTime = iRotateDir * TIME_ROTATE_START;
                if (iUseTime >= iRotateTime) {
                    outValue.dir = pCurLine.iDir;
                    iUseTime -= iRotateTime;
                }
                else {
                    var addDir = iUseTime / TIME_ROTATE_START;
                    if (this.m_iDirNum == 4) {
                        addDir = addDir & 0xfffffffE;
                    }
                    outValue.dir = (pCurLine.iDirStart + addDir * pCurLine.iRotateSign + 360) % 360;
                    //dir = ((int)( pCurLine.iDirStart + iUseTime / TIME_ROTATE * pCurLine.iRotateSign + 8 )) % 8;
                    //dir = ((int)( pCurLine.iDirStart + iUseTime / TIME_ROTATE_START * pCurLine.iRotateSign)) & 0x0ffff;
                    return false;
                }
            }
            else {
                var iRotateTime = iRotateDir * TIME_ROTATE;
                if (iUseTime >= iRotateTime) {
                    outValue.dir = pCurLine.iDir;
                }
                else {
                    var addDir = iUseTime / TIME_ROTATE;
                    if (this.m_iDirNum == 4) {
                        addDir = addDir & 0xfffffffE;
                    }
                    outValue.dir = (map.FLOOR(pCurLine.iDirStart + addDir * pCurLine.iRotateSign + 360)) % 360;
                    //dir = ((int)( pCurLine.iDirStart + iUseTime / TIME_ROTATE * pCurLine.iRotateSign )) & 0x0ffff;
                }
            }
            //debugf(TEXT("dwCurTime %d, iUseTime %d x %d y %d dx %d dy %d"), dwCurTime, iUseTime, x, y, pCurLine.dx, pCurLine.dy);
            outValue.x = outValue.x + pCurLine.dx * iUseTime / 100000.0;
            outValue.y = outValue.y + pCurLine.dy * iUseTime / 100000.0;
        };
        return LogicPath;
    }(TClass));
    map.LogicPath = LogicPath;
    __reflect(LogicPath.prototype, "map.LogicPath");
})(map || (map = {}));
var map;
(function (map) {
    var FindPathType;
    (function (FindPathType) {
        //结果
        FindPathType[FindPathType["eFindPathType_Succeed"] = 1] = "eFindPathType_Succeed";
        FindPathType[FindPathType["eFindPathType_FindNext"] = 2] = "eFindPathType_FindNext";
        FindPathType[FindPathType["eFindPathType_Fail"] = 3] = "eFindPathType_Fail";
        //状态
        FindPathType[FindPathType["eFindPathType_Findind"] = 4] = "eFindPathType_Findind";
        FindPathType[FindPathType["eFindPathType_FindNotHandle"] = 5] = "eFindPathType_FindNotHandle";
    })(FindPathType = map.FindPathType || (map.FindPathType = {}));
    ;
    var PathMgr = (function (_super) {
        __extends(PathMgr, _super);
        function PathMgr() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        PathMgr.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.m_pPathFinder = map.LogicFinder.newObj();
            this.m_pBlock = map.LogicBlock.newObj();
            this.m_bBusy = false;
        };
        //子类复写 析构函数
        PathMgr.prototype.destory = function () {
        };
        PathMgr.prototype.createLogicPath = function () {
            var p = map.LogicPath.newObj();
            p.init(this.m_pBlock, this.m_pPathFinder);
            return p;
        };
        PathMgr.prototype.releaseLogicPath = function (logicPath) {
            if (logicPath) {
                this.clearPath(logicPath);
                logicPath.deleteObj();
            }
        };
        //寻路相关
        PathMgr.prototype.createPath = function (logicPath, from, to, dir, iMaxStep, ignoreBlock) {
            logicPath.m_iStartX = from.x;
            logicPath.m_iStartY = from.y;
            logicPath.m_iEndX = to.x;
            logicPath.m_iEndY = to.y;
            logicPath.m_iMaxStep = iMaxStep;
            logicPath.m_bIgnoreBlock = ignoreBlock;
            logicPath.m_iStartDir = dir;
            logicPath.m_iCurrentTime = 0;
            //因为是新的路径，所以如果logic一样，得先置空
            if (this.m_pCurLogicPath == logicPath) {
                this.m_pCurLogicPath.Clear();
                this.m_pCurLogicPath = null;
            }
            //先测试是不是可以无阻挡或者直线行走
            var outValue = {};
            // outValue.ptTrueStart = ptTrueStart;
            // outValue.ptTrueEnd = ptTrueEnd;
            // outValue.bNoBlock = false;
            logicPath.mFindPathState = this.TryNoBlockPath(from, to, ignoreBlock, outValue);
            if (FindPathType.eFindPathType_Fail == logicPath.mFindPathState)
                return FindPathType.eFindPathType_Fail;
            if (outValue.bNoBlock) {
                var ptStart = from;
                var ptEnd = to;
                var pointList = [];
                pointList.push(outValue.ptTrueStart);
                pointList.push(outValue.ptTrueEnd);
                logicPath.CreatePathLine(pointList, ptStart, ptEnd, dir, logicPath.m_iCurrentTime);
                return FindPathType.eFindPathType_Succeed;
            }
            //发现有阻挡，就真正寻路
            return this.CheckFindPathState(logicPath);
        };
        PathMgr.prototype.updatePath = function (logicPath, outValue) {
            //bStop,  x,  y, dir
            //已经寻路成功了，就直接tick
            if (logicPath.mFindPathState == FindPathType.eFindPathType_Succeed) {
                outValue.bStop = logicPath.UpdatePos(outValue);
            }
            else if (logicPath.mFindPathState != FindPathType.eFindPathType_Fail) {
                //否则，就检查先当前可以寻路不
                this.CheckFindPathState(logicPath);
            }
            if (outValue.x != null && outValue.y != null) {
                outValue.x = map.FLOOR(outValue.x);
                outValue.y = map.FLOOR(outValue.y);
            }
            return logicPath.mFindPathState;
        };
        PathMgr.prototype.clearPath = function (logicPath) {
            if (this.m_pCurLogicPath && this.m_pCurLogicPath == logicPath) {
                logicPath.Clear();
                this.m_pCurLogicPath = null;
            }
        };
        PathMgr.prototype.getLogicBlock = function () {
            return this.m_pBlock;
        };
        PathMgr.prototype.TryNoBlockPath = function (from, to, ignoreBlock, outValue) {
            var ptTrueStart = {};
            var ptTrueEnd = {};
            ptTrueStart.x = map.LogicBlock.getCellX(from.x);
            ptTrueStart.y = map.LogicBlock.getCellX(from.y);
            ptTrueEnd.x = map.LogicBlock.getCellX(to.x);
            ptTrueEnd.y = map.LogicBlock.getCellX(to.y);
            outValue.ptTrueStart = ptTrueStart;
            outValue.ptTrueEnd = ptTrueEnd;
            outValue.bNoBlock = false;
            if (ignoreBlock) {
                //无视阻挡
            }
            else {
                //查找路径
                if (!this.m_pBlock.IsValid(ptTrueStart))
                    return FindPathType.eFindPathType_Fail;
                if (!this.m_pBlock.IsValid(ptTrueEnd))
                    return FindPathType.eFindPathType_Fail;
                if (this.m_pBlock.IsBlock(ptTrueStart)) {
                    //找到第一个不是阻挡的格子
                    var firstNotBlock = {};
                    if (this.m_pBlock.FirstNotBlock(ptTrueStart, ptTrueEnd, firstNotBlock)) {
                        ptTrueStart.x = firstNotBlock.x;
                        ptTrueStart.y = firstNotBlock.y;
                    }
                }
                if (this.m_pBlock.IsBlock(ptTrueStart))
                    return FindPathType.eFindPathType_Fail;
                if (this.m_pBlock.IsBlock(ptTrueEnd)) {
                    //找到最后一个不是阻挡的格子
                    var lastNotBlock = {};
                    if (this.m_pBlock.LastNotBlock(ptTrueStart, ptTrueEnd, lastNotBlock)) {
                        ptTrueEnd.x = lastNotBlock.x;
                        ptTrueEnd.y = lastNotBlock.y;
                    }
                }
                if (this.m_pBlock.IsBlock(ptTrueEnd))
                    return FindPathType.eFindPathType_Fail;
            }
            if (ptTrueStart.x == ptTrueEnd.x && ptTrueStart.y == ptTrueEnd.y)
                return FindPathType.eFindPathType_Fail;
            if (ignoreBlock || !this.m_pBlock.HaveBlock(ptTrueStart, ptTrueEnd) /*&& iDropStep == 0*/) {
                outValue.bNoBlock = true;
            }
            return FindPathType.eFindPathType_Succeed;
        };
        PathMgr.prototype.CheckFindPathState = function (logicPath) {
            var from = {};
            var to = {};
            from.x = logicPath.m_iStartX;
            from.y = logicPath.m_iStartY;
            to.x = logicPath.m_iEndX;
            to.y = logicPath.m_iEndY;
            var iMaxStep = logicPath.m_iMaxStep;
            var ignoreBlock = logicPath.m_bIgnoreBlock;
            var dir = logicPath.m_iStartDir;
            var bHandleFind = false;
            var bFindNext = false;
            if (this.m_bBusy == false) {
                TLog.Assert(this.m_pCurLogicPath == null);
                bHandleFind = true;
            }
            else {
                //当前在忙
                if (this.m_pCurLogicPath != logicPath) {
                    logicPath.mFindPathState = FindPathType.eFindPathType_FindNotHandle;
                }
                else {
                    if (logicPath.mFindPathState == FindPathType.eFindPathType_FindNext) {
                        bFindNext = true;
                        bHandleFind = true;
                    }
                }
            }
            if (bHandleFind) {
                var bResultBusy = false;
                var pResultLogicPath = null;
                //if (m_bSynFind)
                {
                    var pointList = [];
                    var type = 0;
                    if (!bFindNext) {
                        type = this.FindPathPointList(from, to, iMaxStep, ignoreBlock, pointList);
                    }
                    else {
                        //findNext
                        type = this.FindPathNext(iMaxStep, pointList);
                    }
                    if (type == FindPathType.eFindPathType_Succeed) {
                        logicPath.CreatePathLine(pointList, from, to, dir, logicPath.m_iCurrentTime);
                        logicPath.mFindPathState = FindPathType.eFindPathType_Succeed;
                    }
                    else if (type == FindPathType.eFindPathType_FindNext) {
                        //分步处理
                        logicPath.mFindPathState = FindPathType.eFindPathType_FindNext;
                        pResultLogicPath = logicPath;
                        bResultBusy = true;
                    }
                    else {
                        logicPath.mFindPathState = FindPathType.eFindPathType_Fail;
                    }
                }
                // else
                // {
                //     //异步搜索中，还没有结果
                //     REQUEST_INFO* info = new REQUEST_INFO;
                //     info.from = from;
                //     info.to = to;
                //     info.iMaxStep = iMaxStep;
                //     info.ignoreBlock = ignoreBlock;
                //     info.bFindNext = bFindNext;
                //     m_WorkQueueHelper.PostRequest(info);
                //     logicPath.mFindPathState = eFindPathType_Findind;
                //     pResultLogicPath = logicPath;
                //     bResultBusy = true;
                // }
                this.m_pCurLogicPath = pResultLogicPath;
                this.m_bBusy = bResultBusy;
            }
            return logicPath.mFindPathState;
        };
        PathMgr.prototype.FindPathPointList = function (from, to, iMaxStep, ignoreBlock, listPoint) {
            // outValue.ptTrueStart = ptTrueStart;
            // outValue.ptTrueEnd = ptTrueEnd;
            // outValue.bNoBlock = false;
            var outValue = {};
            //搜索一下是不是忽视阻挡点行走，或者目的点和出发点没阻挡
            if (FindPathType.eFindPathType_Fail == this.TryNoBlockPath(from, to, ignoreBlock, outValue))
                return FindPathType.eFindPathType_Fail;
            //搜索导航点
            listPoint.length = 0;
            if (outValue.bNoBlock) {
                listPoint.push(outValue.ptTrueStart);
                listPoint.push(outValue.ptTrueEnd);
                return FindPathType.eFindPathType_Succeed;
            }
            else {
                return this.FindPath(outValue.ptTrueStart, outValue.ptTrueEnd, iMaxStep, listPoint);
            }
        };
        PathMgr.prototype.FindPath = function (ptTrueStart, ptTrueEnd, iMaxStep, listPoint) {
            var iPathLen = this.m_pPathFinder.Find(ptTrueStart, ptTrueEnd, iMaxStep);
            if (iPathLen == 0) {
                return FindPathType.eFindPathType_Fail;
            }
            //未能一次完成寻路
            if (iPathLen == 0xFFFFFFFF) {
                ///如果有导航点
                // if (m_pWayPointFinder.IsHasWayPoint())
                // {
                // 	let wayPathLen = m_pWayPointFinder.FindWayPoint(ptTrueStart.x, ptTrueStart.y, ptTrueEnd.x, ptTrueEnd.y);
                // 	if (wayPathLen == 0)
                // 		return FindPathType.eFindPathType_Fail;
                // 	EXTERN_STACK_VAR(IntPoint*, ptWayPath, wayPathLen * sizeof(IntPoint));
                // 	m_pWayPointFinder.GetWayPoint(ptWayPath);
                // 	//导航点寻路
                // 	IntPoint from = ptTrueStart;
                // 	IntPoint to;
                // 	for (let i = 0; i < wayPathLen + 1; i++)
                // 	{
                // 		std::list< IntPoint> tempListPoint;
                // 		if (i < wayPathLen)
                // 			to = ptWayPath[i];
                // 		else
                // 			to = ptTrueEnd;
                // 		let iPathLen = m_pPathFinder.Find(from, to, 0x3FFFFFFF);
                // 		if (iPathLen == 0 || iPathLen == 0xFFFFFFFF)
                // 			return FindPathType.eFindPathType_Fail;
                // 		if ( this.this.GetPathPoint(iPathLen, tempListPoint) == false)
                // 			return FindPathType.eFindPathType_Fail;
                // 		std::list< IntPoint>::iterator iter= tempListPoint.begin();
                // 		if (i != 0)
                // 			iter ++;
                // 		listPoint.insert(listPoint.end(), iter, tempListPoint.end());
                // 		from = to;
                // 	}
                // 	return FindPathType.eFindPathType_Succeed;
                // }
                return FindPathType.eFindPathType_FindNext;
            }
            if (this.GetPathPoint(iPathLen, listPoint) == false)
                return FindPathType.eFindPathType_Fail;
            return FindPathType.eFindPathType_Succeed;
        };
        PathMgr.prototype.FindPathNext = function (iMaxStep, listPoint) {
            var iPathLen = this.m_pPathFinder.FindNext(iMaxStep);
            if (iPathLen == 0)
                return FindPathType.eFindPathType_Fail;
            if (iPathLen == 0xFFFFFFFF)
                return FindPathType.eFindPathType_FindNext;
            if (this.GetPathPoint(iPathLen, listPoint) == false)
                return FindPathType.eFindPathType_Fail;
            return FindPathType.eFindPathType_Succeed;
        };
        PathMgr.prototype.GetPathPoint = function (iPathLen, listPoint) {
            var ptPath = [];
            if (!this.m_pPathFinder.GetPoint(ptPath)) {
                return false;
            }
            listPoint.push(ptPath[0]);
            if (!this.m_pBlock.HaveBlock(ptPath[0], ptPath[iPathLen - 1])) {
                listPoint.push(ptPath[iPathLen - 1]);
            }
            else {
                //for(let t=1;t<iPathLen;t++)
                //	listPoint.push_back( ptPath[t] );
                var iStart = void 0, iEndS = void 0, iEndE = void 0, iEndM = void 0;
                iStart = 0;
                while (iStart < iPathLen - 1) {
                    iEndS = iStart + 1, iEndE = iPathLen - 1;
                    if (iStart == 0 || this.m_pBlock.HaveBlock(ptPath[iStart], ptPath[iEndE])) {
                        while (iEndS < iEndE) {
                            iEndM = (iEndS + iEndE) >> 1;
                            if (this.m_pBlock.HaveBlock(ptPath[iStart], ptPath[iEndM]))
                                iEndE = iEndM - 1;
                            else
                                iEndS = iEndM + 1;
                        }
                        if (this.m_pBlock.HaveBlock(ptPath[iStart], ptPath[iEndE])) {
                            iEndE--;
                        }
                    }
                    ////n_assert( iEndE > iStart );
                    listPoint.push(ptPath[iEndE]);
                    iStart = iEndE;
                }
            }
            return true;
        };
        PathMgr.prototype.ResetLogicBlock = function (width, height) {
            this.m_pBlock.width = width;
            this.m_pBlock.height = height;
            this.m_pBlock.InitAreaLimit();
            this.m_pPathFinder.ReLoad(this.m_pBlock);
        };
        PathMgr.prototype.RefreshLogicBlock = function (width, height, buffer) {
            var buf_size = width * height;
            if (buf_size == 0)
                return;
            this.m_pBlock.buffer.length = 0;
            this.m_pBlock.width = width;
            this.m_pBlock.height = height;
            this.m_pBlock.buffer = buffer;
            this.m_pPathFinder.ReLoad(this.m_pBlock);
        };
        return PathMgr;
    }(TClass));
    map.PathMgr = PathMgr;
    __reflect(PathMgr.prototype, "map.PathMgr");
})(map || (map = {}));
// TypeScript file
function CollectGarbage() {
    if (typeof g_CollectGarbage != "undefined") {
        g_CollectGarbage();
    }
}
function OverrideEgretInit() {
    egret.override._init();
    RES.override._init();
}
var RES;
(function (RES) {
    var override;
    (function (override) {
        function _init() {
            var myResMgr = core.ResManager.getInstance();
            var _getResByUrl = RES.Resource.prototype.getResByUrl;
            RES.Resource.prototype.getResByUrl = function (key, compFunc, thisObject, type) {
                if (type === void 0) { type = ""; }
                return _getResByUrl.call(this, key, compFunc, thisObject, type).catch(function (e) {
                    //ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, name, item);
                    // if (!e.__resource_manager_error__) {
                    // 	console.error(e.stack)
                    //     throw e;
                    // }
                    myResMgr.onResByUrlError(key, e);
                });
            };
        }
        override._init = _init;
    })(override = RES.override || (RES.override = {}));
})(RES || (RES = {}));
var egret;
(function (egret) {
    var override;
    (function (override) {
        function _init() {
            // let $onRemoveFromStage = DisplayObject.prototype.$onRemoveFromStage;
            // DisplayObject.prototype.$onRemoveFromStage = function(): void {
            //     $onRemoveFromStage.call(this);
            //     egret.Tween.removeTweens(this);
            // }
            var errorReport = core.ErrorReport.getInstance();
            window.onerror = function (message, filename, lineno, colno, error) {
                console.error("=== unexception ===", error);
                core.ErrorReport.getInstance().captureError(error);
            };
            var systemTickerUpdate = egret.sys.SystemTicker.prototype.update;
            egret.sys.SystemTicker.prototype.update = function () {
                var isReportEnable = errorReport.isReportEnable();
                if (isReportEnable) {
                    try {
                        systemTickerUpdate.call(this);
                    }
                    catch (error) {
                        core.ErrorReport.getInstance().captureError(error);
                    }
                }
                else {
                    systemTickerUpdate.call(this);
                }
            };
            var eventNotifyListener = egret.EventDispatcher.prototype.$notifyListener;
            egret.EventDispatcher.prototype.$notifyListener = function (event, capturePhase) {
                var ret = false;
                var isReportEnable = errorReport.isReportEnable();
                if (isReportEnable) {
                    try {
                        eventNotifyListener.call(this, event, capturePhase);
                    }
                    catch (error) {
                        core.ErrorReport.getInstance().captureError(error);
                    }
                }
                else {
                    eventNotifyListener.call(this, event, capturePhase);
                }
                return ret;
            };
            //修复报错
            var _onBlobLoaded = egret.ImageLoader.prototype.onBlobLoaded;
            egret.ImageLoader.prototype.onBlobLoaded = function (event) {
                if (this.request) {
                    _onBlobLoaded.call(this, event);
                }
            };
            {
                //优化文本纹理，延迟一段时间才清理
                var superClass_1 = egret.DisplayObject;
                var textureMgr_1 = core.TextureManager.getInstance();
                var _onAddToStage_2 = egret.TextField.prototype.$onAddToStage;
                egret.TextField.prototype.$onAddToStage = function (stage, nestLevel) {
                    _onAddToStage_2.call(this, stage, nestLevel);
                    textureMgr_1.removeCleanTextNode(this.textNode);
                };
                var _onRemoveFromStage = egret.TextField.prototype.$onRemoveFromStage;
                egret.TextField.prototype.$onRemoveFromStage = function () {
                    superClass_1.prototype.$onRemoveFromStage.call(this);
                    this.removeEvent();
                    if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                        this.inputUtils._removeStageText();
                    }
                    if (this.textNode) {
                        //this.textNode.clean();
                        textureMgr_1.addCleanTextNode(this.textNode);
                        if (egret.nativeRender) {
                            egret_native.NativeDisplayObject.disposeTextData(this);
                        }
                    }
                };
            }
            {
                //优化图形graphic纹理，延迟一段时间才清理
                var textureMgr_2 = core.TextureManager.getInstance();
                var _onRemoveFromStage = egret.Graphics.prototype.$onRemoveFromStage;
                egret.Graphics.prototype.$onRemoveFromStage = function () {
                    if (this.$renderNode) {
                        textureMgr_2.addCleanGraphic(this);
                    }
                    if (egret.nativeRender) {
                        egret_native.NativeDisplayObject.disposeGraphicData(this);
                    }
                };
            }
            {
                //override egret.DisplayObjectContainer
                var _setVisible_2 = egret.DisplayObjectContainer.prototype.$setVisible;
                egret.DisplayObjectContainer.prototype.$setVisible = function (value) {
                    var lastVisible = this.$visible;
                    _setVisible_2.call(this, value);
                    if (lastVisible != value) {
                        this.onParentVisible(value);
                    }
                };
                egret.DisplayObjectContainer.prototype["onParentVisible"] = function (value) {
                    for (var i = 0; i < this.$children.length; i++) {
                        var child = this.$children[i];
                        if (child["onParentVisible"] != null) {
                            child["onParentVisible"].call(child, value);
                        }
                    }
                };
            }
            //修复外网报错，可能createTexture创建不了gltext
            overrideWebGl(egret["web"]);
            overrideWebGl(egret["wxgame"]);
        }
        override._init = _init;
        function overrideWebGl(nsWeb) {
            if (nsWeb && nsWeb["WebGLRenderTarget"]) {
                var renderContext_1 = null;
                var _initFrameBuffer_1 = nsWeb["WebGLRenderTarget"].prototype.initFrameBuffer;
                nsWeb["WebGLRenderTarget"].prototype.initFrameBuffer = function () {
                    if (renderContext_1 == null) {
                        renderContext_1 = nsWeb["WebGLRenderContext"].getInstance(0, 0);
                    }
                    if (renderContext_1.contextLost)
                        return;
                    _initFrameBuffer_1.call(this);
                };
            }
        }
    })(override = egret.override || (egret.override = {}));
})(egret || (egret = {}));
// TypeScript file
var map;
(function (map) {
    //标志d
    var OptimizeFlag;
    (function (OptimizeFlag) {
        OptimizeFlag[OptimizeFlag["OPTIMIZE_UPDATE_ONSEE"] = 1] = "OPTIMIZE_UPDATE_ONSEE";
        OptimizeFlag[OptimizeFlag["OPTIMIZE_MOVEMENT_ONSEE"] = 2] = "OPTIMIZE_MOVEMENT_ONSEE";
        OptimizeFlag[OptimizeFlag["OPTIMIZE_HIDE_ONMAXACTOR"] = 4] = "OPTIMIZE_HIDE_ONMAXACTOR";
        OptimizeFlag[OptimizeFlag["OPTIMIZE_LOAD_SYN"] = 8] = "OPTIMIZE_LOAD_SYN";
    })(OptimizeFlag = map.OptimizeFlag || (map.OptimizeFlag = {}));
    ;
    var MoveReportFlag;
    (function (MoveReportFlag) {
        MoveReportFlag[MoveReportFlag["MOVEMENT_PIXEL_CHANGED"] = 1] = "MOVEMENT_PIXEL_CHANGED";
        MoveReportFlag[MoveReportFlag["MOVEMENT_CELL_CHANGED"] = 2] = "MOVEMENT_CELL_CHANGED";
        MoveReportFlag[MoveReportFlag["MOVEMENT_DIR_CHANGED"] = 4] = "MOVEMENT_DIR_CHANGED";
        MoveReportFlag[MoveReportFlag["MOVEMENT_BEGIN_RUN"] = 256] = "MOVEMENT_BEGIN_RUN";
        MoveReportFlag[MoveReportFlag["MOVEMENT_STOPING"] = 512] = "MOVEMENT_STOPING";
        MoveReportFlag[MoveReportFlag["MOVEMENT_TRACE_PATH"] = 1024] = "MOVEMENT_TRACE_PATH";
        //ANIM_BEING = 0x010000,
        //ANIM_END	= 0x020000,
        //ANIM_INDEX_CHANGED = 0x030000, 
        MoveReportFlag[MoveReportFlag["ANIM_NOTIFY"] = 262144] = "ANIM_NOTIFY";
    })(MoveReportFlag = map.MoveReportFlag || (map.MoveReportFlag = {}));
    ;
    var SpriteMovEvent = (function (_super) {
        __extends(SpriteMovEvent, _super);
        function SpriteMovEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteMovEvent.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.actor = null;
            this.pathList = null;
            this.pathListMaxNum = 0;
            this.pathListNum = 0;
            this.walkOnPathIndex = 0;
            this.walkOnPathThousand = 0;
        };
        SpriteMovEvent.prototype.destory = function () {
        };
        SpriteMovEvent.prototype.pixelChanged = function () {
            return ((this.flag & MoveReportFlag.MOVEMENT_PIXEL_CHANGED) != 0);
        };
        SpriteMovEvent.prototype.dirChanged = function () {
            return ((this.flag & MoveReportFlag.MOVEMENT_DIR_CHANGED) != 0);
        };
        SpriteMovEvent.prototype.cellChanged = function () {
            return ((this.flag & MoveReportFlag.MOVEMENT_CELL_CHANGED) != 0);
        };
        SpriteMovEvent.prototype.isStoping = function () {
            return ((this.flag & MoveReportFlag.MOVEMENT_STOPING) != 0);
        };
        SpriteMovEvent.prototype.beginRun = function () {
            return ((this.flag & MoveReportFlag.MOVEMENT_BEGIN_RUN) != 0);
        };
        SpriteMovEvent.MovementEvent = "MovementEvent";
        return SpriteMovEvent;
    }(core.EventArgs));
    map.SpriteMovEvent = SpriteMovEvent;
    __reflect(SpriteMovEvent.prototype, "map.SpriteMovEvent");
})(map || (map = {}));
/// <reference path="../../util/EventSet.ts" />
var core;
(function (core) {
    var NetWorkResultState;
    (function (NetWorkResultState) {
        NetWorkResultState[NetWorkResultState["Connect"] = 0] = "Connect";
        NetWorkResultState[NetWorkResultState["Close"] = 1] = "Close";
        NetWorkResultState[NetWorkResultState["Normal"] = 2] = "Normal";
    })(NetWorkResultState = core.NetWorkResultState || (core.NetWorkResultState = {}));
    var Opcodes;
    (function (Opcodes) {
        Opcodes[Opcodes["MSG_NULL"] = 0] = "MSG_NULL";
        Opcodes[Opcodes["CMSG_PING"] = 1] = "CMSG_PING";
        Opcodes[Opcodes["SMSG_PONG"] = 2] = "SMSG_PONG";
        Opcodes[Opcodes["CMSG_REGION_NOTICE"] = 9] = "CMSG_REGION_NOTICE";
        Opcodes[Opcodes["CMSG_COMM"] = 10] = "CMSG_COMM";
        Opcodes[Opcodes["CMSG_LOGIN"] = 11] = "CMSG_LOGIN";
        Opcodes[Opcodes["SMSG_LOGIN"] = 12] = "SMSG_LOGIN";
        Opcodes[Opcodes["CMSG_LOGOUT"] = 13] = "CMSG_LOGOUT";
        Opcodes[Opcodes["SMSG_LOGOUT"] = 14] = "SMSG_LOGOUT";
        Opcodes[Opcodes["CMSG_LOGIN_USER"] = 15] = "CMSG_LOGIN_USER";
        Opcodes[Opcodes["SMSG_LOGIN_USER"] = 16] = "SMSG_LOGIN_USER";
    })(Opcodes || (Opcodes = {}));
    ;
    var LoginOpcodes;
    (function (LoginOpcodes) {
        LoginOpcodes[LoginOpcodes["C2L_CONNECT"] = 17] = "C2L_CONNECT";
        LoginOpcodes[LoginOpcodes["L2C_CONNECT"] = 18] = "L2C_CONNECT";
        LoginOpcodes[LoginOpcodes["C2L_STATE"] = 22] = "C2L_STATE";
        LoginOpcodes[LoginOpcodes["L2C_STATE"] = 23] = "L2C_STATE";
        LoginOpcodes[LoginOpcodes["C2L_VERSION"] = 24] = "C2L_VERSION";
        LoginOpcodes[LoginOpcodes["L2C_VERSION"] = 25] = "L2C_VERSION";
        LoginOpcodes[LoginOpcodes["C2L_VERVIFY_CODE"] = 26] = "C2L_VERVIFY_CODE";
        LoginOpcodes[LoginOpcodes["L2C_VERVIRY_CODE"] = 27] = "L2C_VERVIRY_CODE";
        LoginOpcodes[LoginOpcodes["C2L_ROLE_SELECT"] = 28] = "C2L_ROLE_SELECT";
        LoginOpcodes[LoginOpcodes["L2C_ROLE_SELECT"] = 29] = "L2C_ROLE_SELECT";
        LoginOpcodes[LoginOpcodes["C2L_ROLE_LIST"] = 30] = "C2L_ROLE_LIST";
        LoginOpcodes[LoginOpcodes["L2C_ROLE_LIST"] = 31] = "L2C_ROLE_LIST";
        LoginOpcodes[LoginOpcodes["C2L_ROLE_CREATE"] = 32] = "C2L_ROLE_CREATE";
        LoginOpcodes[LoginOpcodes["L2C_ROLE_CREATE"] = 33] = "L2C_ROLE_CREATE";
        LoginOpcodes[LoginOpcodes["C2L_ROLE_DELETE"] = 34] = "C2L_ROLE_DELETE";
        LoginOpcodes[LoginOpcodes["L2C_ROLE_DELETE"] = 35] = "L2C_ROLE_DELETE";
        LoginOpcodes[LoginOpcodes["L2C_QUEUE_UPDATE"] = 36] = "L2C_QUEUE_UPDATE";
        LoginOpcodes[LoginOpcodes["LOGIN_MSG_COUNT"] = 37] = "LOGIN_MSG_COUNT";
    })(LoginOpcodes || (LoginOpcodes = {}));
    ;
    var NetWorkResult = (function (_super) {
        __extends(NetWorkResult, _super);
        function NetWorkResult() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NetWorkResult.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.state = 0;
            this.code = 0;
            this.buffer = null;
        };
        NetWorkResult.prototype.destory = function () {
            this.buffer = null;
        };
        return NetWorkResult;
    }(TClass));
    core.NetWorkResult = NetWorkResult;
    __reflect(NetWorkResult.prototype, "core.NetWorkResult");
    ;
    var EncryptKey = "`#$X1_+%,aBVx}@8";
    ////////////////////////////////////////////////////////////
    //连接事件
    var NetConnectEvent = (function (_super) {
        __extends(NetConnectEvent, _super);
        function NetConnectEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NetConnectEvent;
    }(core.EventArgs));
    core.NetConnectEvent = NetConnectEvent;
    __reflect(NetConnectEvent.prototype, "core.NetConnectEvent");
    ;
    //关闭连接
    var NetCloseEvent = (function (_super) {
        __extends(NetCloseEvent, _super);
        function NetCloseEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NetCloseEvent;
    }(core.EventArgs));
    core.NetCloseEvent = NetCloseEvent;
    __reflect(NetCloseEvent.prototype, "core.NetCloseEvent");
    ;
    var NetRecvEvent = (function (_super) {
        __extends(NetRecvEvent, _super);
        function NetRecvEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NetRecvEvent;
    }(core.EventArgs));
    core.NetRecvEvent = NetRecvEvent;
    __reflect(NetRecvEvent.prototype, "core.NetRecvEvent");
    ////////////////////////////////////////////////////////////
    var NetWork = (function (_super) {
        __extends(NetWork, _super);
        function NetWork() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.PACKET_HEADER_SIZE = 4;
            _this.SHORT_SIZE = 2;
            return _this;
        }
        NetWork.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mRecvBuffer = new BinaryStream;
            this.mRecvResultList = [];
            this.socket = this.createSocket();
            this.mWriteBuffer = new BinaryStream;
            this.mWriteBuffer.setNetMode(false); //小端
            this.mConnecting = false;
            this.mSocketError = false;
            this.mClosing = false;
            this.m_encryptKey = EncryptKey;
            this.m_decryptKey = EncryptKey;
            this.m_encrypt = true;
            this.m_decrypt = true;
            this.m_encryptSeed = 25;
            this.m_decryptSeed = 25;
            this.m_serialNumber = 0;
            this.m_initSerialNumber = false;
            this.m_sendSerialNumber = false;
        };
        NetWork.prototype.destory = function () {
            this.destorySocket();
            this.mRecvBuffer.clear();
            this.mRecvBuffer = null;
            this.mWriteBuffer.clear();
            this.mWriteBuffer = null;
        };
        NetWork.prototype.createSocket = function () {
            var socket = new egret.WebSocket();
            socket.type = egret.WebSocket.TYPE_BINARY;
            //添加收到数据侦听，收到数据会调用此方法
            socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            //添加链接打开侦听，连接成功会调用此方法
            socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
            socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            //添加异常侦听，出现异常会调用此方法
            socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            return socket;
        };
        NetWork.prototype.destorySocket = function () {
            if (this.socket) {
                var socket = this.socket;
                socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                socket.removeEventListener(egret.ProgressEvent.CONNECT, this.onSocketOpen, this);
                socket.removeEventListener(egret.ProgressEvent.CLOSE, this.onSocketClose, this);
                socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
                if (this.mClosing == false)
                    socket.close();
                this.socket = null;
            }
        };
        NetWork.prototype.connect = function (server, port) {
            if (this.isConnect()) {
                TLog.Error("connect has not been close:", server + ":" + port);
                return;
            }
            this.destorySocket();
            this.socket = this.createSocket();
            var protocol = "ws://";
            var isIp4 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(server);
            if (isIp4 == false && egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME) {
                protocol = "wss://";
            }
            this.socket.connectByUrl(protocol + server + ":" + port);
            this.mClosing = false;
            this.mConnecting = true;
            this.mSocketError = false;
            return true;
        };
        NetWork.prototype.disconnect = function () {
            if (this.isConnect() == false)
                return false;
            this.mClosing = true;
            this.mConnecting = false;
            this.mSocketError = false;
            this.socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.socket.removeEventListener(egret.ProgressEvent.CONNECT, this.onSocketOpen, this);
            this.socket.removeEventListener(egret.ProgressEvent.CLOSE, this.onSocketClose, this);
            this.socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            this.socket.close();
            return true;
        };
        NetWork.prototype.isConnect = function () {
            if (this.mClosing == true)
                return false;
            return this.socket.connected;
        };
        NetWork.prototype.beginPack = function () {
            this.mWriteBuffer.clear();
            return this.mWriteBuffer;
        };
        NetWork.prototype.endPack = function () {
            if (this.isConnect() == false) {
                this.mWriteBuffer.clear();
                return;
            }
            if (this.net_temp == null) {
                this.net_temp = new Uint8Array(0x10000);
            }
            var len = this.mWriteBuffer.length;
            var buf = this.mWriteBuffer.bytes;
            var dataView = this.mWriteBuffer.dataView;
            var code = dataView.getInt16(0, true);
            if ((code >= 17 && code <= 27) || this.m_encrypt == false) {
                var size = len;
                var nb = new BinaryStream();
                nb.writeUnsignedShort(size);
                nb.writeBytes(this.mWriteBuffer, 0, len);
                this.sendBuffer(nb);
                nb.clear();
            }
            else {
                var encrypt_buf = new Uint8Array(buf.buffer, 2);
                var encrypt_len = len - 2;
                if (this.m_sendSerialNumber) {
                    var serial_num = 0;
                    if (this.m_initSerialNumber && code != Opcodes.CMSG_PING) {
                        serial_num = this.m_serialNumber;
                        ++this.m_serialNumber;
                        if (this.m_serialNumber == 0) {
                            this.m_serialNumber = 1;
                        }
                    }
                    var tempView = new DataView(this.net_temp.buffer);
                    tempView.setUint32(0, serial_num, true);
                    this.net_temp.set(encrypt_buf, 4);
                    encrypt_buf = this.net_temp;
                    encrypt_len += 4;
                }
                var temp = null;
                if (encrypt_len > 0) {
                    //Performance_M_C("xxteaEncrypt");
                    var key = new Uint8Array(17);
                    key[16] = 0;
                    var a = 13;
                    var mod = 64;
                    var seed = this.m_encryptSeed;
                    for (var i = 0; i < 16; ++i) {
                        key[i] = seed + 33;
                        seed = (seed * a) % mod;
                    }
                    temp = core.xxteaEncrypt(encrypt_buf, encrypt_len, key); //this.m_encryptKey);
                }
                var nb_1 = new BinaryStream();
                var size = temp.length + 2;
                nb_1.writeUnsignedShort(size);
                nb_1.writeUnsignedShort(code);
                if (temp.length > 0) {
                    var tempStram = new BinaryStream(temp.buffer);
                    nb_1.writeBytes(tempStram);
                }
                this.sendBuffer(nb_1);
                nb_1.clear();
            }
            this.mWriteBuffer.clear();
            // // struct NetPacketHeader
            // // {
            // // 	unsigned short wDataSize;//数据包大小(opcode+逻辑数据大小)
            // // 	short wOpcode; // -10 ~ 10//数据包操作码
            // // };
            // //mWriteBuffer内容是小端打包
            // //但是发送的长度，用的是大端wDataSize
            // var byteArray:BinaryStream = new BinaryStream();
            // byteArray.setNetMode(true)
            // var length = this.mWriteBuffer.position;
            // byteArray.writeUnsignedShort(length);//wDataSize
            // byteArray.setNetMode(false)
            // byteArray.writeBytes(this.mWriteBuffer);//wOpcode+逻辑数据大小
            // this.socket.writeBytes(byteArray);
            // byteArray.clear();
            // this.mWriteBuffer.clear();
            return true;
        };
        NetWork.prototype.sendBuffer = function (byteArray) {
            // struct NetPacketHeader
            // {
            // 	unsigned short wDataSize;//数据包大小(opcode+逻辑数据大小)
            // 	short wOpcode; // -10 ~ 10//数据包操作码
            // };
            //mWriteBuffer内容是小端打包
            //但是发送的长度，用的是大端wDataSize
            var dataView = byteArray.dataView;
            var len = dataView.getUint16(0, true);
            dataView.setUint16(0, len, false); //小端转大端
            this.socket.writeBytes(byteArray);
        };
        NetWork.prototype.setEncrypt = function (encrypt, decrypt) {
            this.m_encrypt = encrypt;
            this.m_decrypt = decrypt;
        };
        NetWork.prototype.setSeed = function (encryptSeed, decryptSeed) {
            this.m_encryptSeed = encryptSeed;
            this.m_decryptSeed = decryptSeed;
        };
        NetWork.prototype.setSendSerialNumber = function (send) {
            this.m_sendSerialNumber = send;
        };
        NetWork.prototype.getLastErrorCode = function () {
            if (this.mSocketError) {
                return -1;
            }
            return 0;
        };
        NetWork.prototype.onSocketOpen = function () {
            var result = NetWorkResult.newObj();
            result.state = NetWorkResultState.Connect;
            result.code = this.getLastErrorCode();
            this.mRecvResultList.push(result);
            //清空缓冲
            this.mRecvBuffer.clear();
            this.mClosing = false;
            this.mConnecting = false;
        };
        NetWork.prototype.onSocketClose = function () {
            //接收到Error，接着会收到Close
            //连接失败，也会收到Error->Close
            var result = NetWorkResult.newObj();
            result.state = this.mConnecting ? NetWorkResultState.Connect : NetWorkResultState.Close;
            //result.code = this.getLastErrorCode();
            result.code = this.mClosing ? 0 : -1;
            if (this.mSocketError)
                result.code = -1;
            this.mRecvResultList.push(result);
            this.mClosing = false;
        };
        NetWork.prototype.onSocketError = function () {
            this.mSocketError = true;
            this.mClosing = true;
        };
        NetWork.prototype.onReceiveMessage = function (e) {
            // //读取数据
            //this.cbRecvBuffer_.dataView.byteLength
            var byteArray = new BinaryStream();
            this.socket.readBytes(byteArray);
            //复制到缓冲区
            this.mRecvBuffer.writeBytes(byteArray);
            var recvBuffDataview = new DataView(this.mRecvBuffer.buffer);
            var litter_endian = false;
            // struct NetPacketHeader
            // {
            // 	unsigned short wDataSize;//数据包大小(opcode+逻辑数据大小)
            // 	short wOpcode; // -10 ~ 10//数据包操作码
            // };
            var recvLen = this.mRecvBuffer.position;
            while (recvLen >= this.PACKET_HEADER_SIZE) {
                var nPacketSize = recvBuffDataview.getUint16(0, litter_endian); //wDataSize
                var step = nPacketSize + this.SHORT_SIZE; //wDataSize + wDataSizee大小
                if (recvLen < step) {
                    break;
                }
                //在内存复制的时候，需要先跳过wDataSize （长度unsigned short，2个字节）
                //假如到结果列表
                var result = NetWorkResult.newObj();
                result.state = NetWorkResultState.Normal;
                result.code = this.getLastErrorCode();
                result.buffer = new BinaryStream();
                result.buffer.setNetMode(false);
                result.buffer.writeBytes(this.mRecvBuffer, this.SHORT_SIZE, nPacketSize);
                result.buffer.position = 0;
                this.mRecvResultList.push(result);
                //把[0...step...recvLen],把step以后的数据复制到数据头
                for (var i = 0; i < recvLen - step; i++) {
                    recvBuffDataview.setUint8(i, recvBuffDataview.getUint8(i + step));
                }
                recvLen -= step;
            }
            this.mRecvBuffer.position = recvLen;
        };
        NetWork.prototype.onUpdate = function () {
            if (this.mRecvResultList.length != 0) {
                for (var _i = 0, _a = this.mRecvResultList; _i < _a.length; _i++) {
                    var result = _a[_i];
                    switch (result.state) {
                        case NetWorkResultState.Connect:
                            {
                                //var connetEvent = egret.Event.create(NetConnectEvent, NetWork.ConnectEvent);
                                var connetEvent = NetConnectEvent.createObj();
                                connetEvent.code = result.code;
                                connetEvent.net = this;
                                this.fireEvent(NetWork.ConnectEvent, connetEvent);
                                //egret.Event.release(connetEvent);
                            }
                            break;
                        case NetWorkResultState.Close:
                            {
                                var closeEvent = NetCloseEvent.createObj();
                                closeEvent.code = result.code;
                                closeEvent.net = this;
                                this.fireEvent(NetWork.CloseEvent, closeEvent);
                                //egret.Event.release(closeEvent);
                            }
                            break;
                        case NetWorkResultState.Normal:
                            {
                                // var recvEvent: NetRecvEvent = NetRecvEvent.createObj();
                                // recvEvent.msgLen = result.buffer.length;
                                // recvEvent.reader = result.buffer;
                                // recvEvent.net = this;
                                // this.fireEvent(NetWork.RecvEvent, recvEvent);
                                //egret.Event.release(recvEvent);
                                this.fireNetMsg(result.buffer);
                            }
                            break;
                    }
                    result.deleteObj();
                }
                this.mRecvResultList.length = 0;
            }
        };
        NetWork.prototype.fireNetMsg = function (buffer) {
            var dataView = buffer.dataView;
            var len = buffer.length;
            if (len > 65536)
                return;
            var code = dataView.getUint16(0, true);
            if (len <= 2 || (code >= 17 && code <= 27) || this.m_decrypt == false) {
                var recvEvent = NetRecvEvent.createObj();
                recvEvent.msgLen = buffer.length;
                recvEvent.reader = buffer;
                recvEvent.net = this;
                this.fireEvent(NetWork.RecvEvent, recvEvent);
                //LogOut("====== %d,recv code %d len %d after fire", i, code, len);
            }
            else {
                var encrypt_buf = new Uint8Array(buffer.rawBuffer, 2);
                var temp = null;
                {
                    //Performance_M_C("xxteaDecrypt");
                    var key = new Uint8Array(17);
                    key[16] = 0;
                    var a = 13;
                    var mod = 64;
                    var seed = this.m_decryptSeed;
                    for (var i = 0; i < 16; ++i) {
                        key[i] = seed + 33;
                        seed = (seed * a) % mod;
                    }
                    temp = core.xxteaDecrypt(encrypt_buf, len - 2, key); //this.m_decryptKey);
                }
                if (temp) {
                    var tempStream = new BinaryStream(temp.buffer);
                    var ms = new BinaryStream;
                    ms.writeUShort(code);
                    if ((code == Opcodes.SMSG_LOGIN || code == Opcodes.SMSG_LOGIN_USER)
                        && this.m_sendSerialNumber) {
                        this.m_serialNumber = tempStream.readUnsignedInt();
                        this.m_initSerialNumber = true;
                        tempStream.readBytes(ms, 2);
                    }
                    else {
                        tempStream.readBytes(ms, 2);
                    }
                    ms.position = 0;
                    var recvEvent = NetRecvEvent.createObj();
                    recvEvent.msgLen = ms.length;
                    recvEvent.reader = ms;
                    recvEvent.net = this;
                    this.fireEvent(NetWork.RecvEvent, recvEvent);
                }
            }
        };
        NetWork.ConnectEvent = "NetConnectEvent";
        NetWork.CloseEvent = "NetCloseEvent";
        NetWork.RecvEvent = "NetRecvEvent";
        return NetWork;
    }(core.EventSet));
    core.NetWork = NetWork;
    __reflect(NetWork.prototype, "core.NetWork");
})(core || (core = {}));
//原理是js文件不受同源策略限制。利用jsonp我们就可以把所有非js/css的资源，转成js文件（图片转base64），由egret加载并解析。
//modify:crossOrigin
// class CrossJsonP {
//     private static mLocalCall: any = {};
//     public static sendLocal(url: string, callback: Function, callobj: any): void {
//         CrossJsonP.mLocalCall[url] = [callback, callobj];
//         var script = document.createElement('script');
//         script.src = url;
//         script.addEventListener('load', function(){
//             script.parentNode.removeChild(script);
//         }, false);
//         script.addEventListener('error', function(){
//             script.parentNode.removeChild(script);
//             CrossJsonP.mLocalCall[url][0].apply(CrossJsonP.mLocalCall[url][1], [url, null]);
//         }, false);
//         document.body.appendChild(script);
//     }
//     public static localCallback(relatePath: string, data: string): void {
//         let url = RES.$getVirtualUrl(relatePath);
//         if (CrossJsonP.mLocalCall[url]) {
//             CrossJsonP.mLocalCall[url][0].apply(CrossJsonP.mLocalCall[url][1], [url, data]);
//         } else {
//             console.log(url);
//             console.log(JSON.stringify(CrossJsonP.mLocalCall));
//             console.log('jsonp error:no call back of' + url);
//         }
//     }
// }
// module core {
//     //图片跨域不支持welgl，需要用到jsonp
//     export class CrossJsonpImageAnalyzer extends RES.ImageAnalyzer {
//         private mUrls: any = {};
//         public constructor() {
//             super();
//         }
//         /**
//          * @inheritDoc
//          */
//         public loadFile(resItem, compFunc, thisObject) {
//             if (this.fileDic[resItem.name]) {
//                 compFunc.call(thisObject, resItem);
//                 return;
//             }
//             var url: string = RES.$getVirtualUrl(resItem.url + ".js");
//             this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;
//             CrossJsonP.sendLocal(url, this.onLoadOk, this);
//         };
//         private onLoadError(url:string){
//             var data = this.mUrls[url];
//             delete this.mUrls[url];
//             var resItem = data.item;
//             var compFunc = data.func;
//             resItem.loaded = false;
//             compFunc.call(data.thisObject, resItem);
//         }
//         private onLoadOk(url: string, base64: string): void {
//             if(base64 == null){
//                 this.onLoadError(url)
//                 return;
//             }
//             var img: HTMLImageElement = document.createElement('img');
//             img.src = base64;
//             var self = this;
//             img.onload = function (e: Event) {
//                 e.currentTarget['onload'] = null;
//                 var data = self.mUrls[url];
//                 delete self.mUrls[url];
//                 var resItem = data.item;
//                 var compFunc = data.func;
//                 resItem.loaded = true;
//                 var texture2: egret.Texture = new egret.Texture();
//                 texture2.bitmapData = new egret.BitmapData(img);
//                 // texture2._setBitmapData( img  as any);
//                 self.analyzeData(resItem, texture2);
//                 compFunc.call(data.thisObject, resItem);
//             };
//             //   img.onerror = function (e: Event) {
//             //      self.onLoadError(url)
//             //   }
//         };
//     }
// }
var map;
(function (map) {
    var TileMap = (function (_super) {
        __extends(TileMap, _super);
        //mDisplayerNode:egret.DisplayObjectContainer;
        function TileMap(rooNode) {
            var _this = _super.call(this) || this;
            _this.mId = -1;
            _this.mName = "";
            _this.mTileColNum = 0;
            _this.mTileRowNum = 0;
            _this.mTileWidth = 0;
            _this.mTileHeight = 0;
            _this.mapW = 0;
            _this.mapH = 0;
            _this.mLayerList = [];
            //this.mDisplayerNode = new egret.DisplayObjectContainer();
            _this.mCamera = new map.Camera(_this);
            //this.mDisplayerNode.addChild(this.mCamera);
            rooNode.addChild(_this.mCamera);
            return _this;
        }
        TileMap.prototype.destory = function () {
            this.removeAllLayer();
        };
        TileMap.prototype.addLayer = function (layer) {
            if (this.mLayerList.indexOf(layer) != -1)
                return false;
            this.mLayerList.push(layer);
            this.mCamera.addNodeToCamera(layer.getDisplayNode());
            return true;
        };
        TileMap.prototype.removeLayer = function (layer) {
            var index = this.mLayerList.indexOf(layer);
            if (index == -1)
                return false;
            this.mLayerList.splice(index, 1);
            this.mCamera.removeNodeFromCamera(layer.getDisplayNode());
            return true;
        };
        TileMap.prototype.removeAllLayer = function () {
            for (var i = 0; i < this.mLayerList.length; i++) {
                var layer = this.mLayerList[i];
                this.mCamera.removeNodeFromCamera(layer.getDisplayNode());
                layer.deleteObj();
            }
            this.mLayerList.length = 0;
        };
        TileMap.prototype.sortLayers = function () {
            if (this.mLayerList.length <= 1)
                return;
            this.mLayerList.sort(function (a, b) {
                return a.getZOrder() - b.getZOrder();
            });
            for (var i = 0; i < this.mLayerList.length; i++) {
                var layer = this.mLayerList[i];
                this.mCamera.mContainer.setChildIndex(layer.getDisplayNode(), i);
            }
            this.mCamera.onLayersChange();
        };
        TileMap.prototype.setId = function (id) {
            this.mId = id;
        };
        TileMap.prototype.getId = function () {
            return this.mId;
        };
        TileMap.prototype.setName = function (name) {
            this.mName = name;
        };
        TileMap.prototype.getName = function () {
            return this.mName;
        };
        TileMap.prototype.getCamera = function () {
            return this.mCamera;
        };
        TileMap.prototype.setMapSize = function (tileColNum, tileRowNum, tileWidth, tileHeight) {
            this.mTileColNum = tileColNum;
            this.mTileRowNum = tileRowNum;
            this.mTileWidth = tileWidth;
            this.mTileHeight = tileHeight;
            this.mapW = tileColNum * tileWidth;
            this.mapH = tileRowNum * tileHeight;
        };
        TileMap.prototype.getMapWidth = function () {
            return this.mapW;
        };
        TileMap.prototype.getMapHeight = function () {
            return this.mapH;
        };
        TileMap.prototype.getTileColNum = function () {
            return this.mTileColNum;
        };
        TileMap.prototype.getTileRowNum = function () {
            return this.mTileRowNum;
        };
        TileMap.prototype.getTileWidth = function () {
            return this.mTileWidth;
        };
        TileMap.prototype.getTileHeight = function () {
            return this.mTileHeight;
        };
        TileMap.prototype.onUpdate = function () {
            this.mCamera.onUpdate();
            this.updateCameraView();
        };
        TileMap.prototype.updateCameraView = function () {
            for (var _i = 0, _a = this.mLayerList; _i < _a.length; _i++) {
                var layer = _a[_i];
                layer.onUpdate(this.mCamera);
            }
            this.mCamera.setViewChanged(false);
        };
        return TileMap;
    }(TClass));
    map.TileMap = TileMap;
    __reflect(TileMap.prototype, "map.TileMap");
})(map || (map = {}));
var map;
(function (map) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(tileMap) {
            var _this = _super.call(this) || this;
            _this.name = "camera";
            //可以被点击
            _this.touchEnabled = true;
            _this.mContainer = new egret.DisplayObjectContainer; //用来转换地图坐标到屏幕坐标
            _this.addChild(_this.mContainer);
            _this.mBScreenContainer = new egret.DisplayObjectContainer;
            _this.mBScreenContainer.name = "background";
            _this.mContainer.addChild(_this.mBScreenContainer);
            _this.mFScreenContainer = new egret.DisplayObjectContainer;
            _this.mFScreenContainer.name = "foreground";
            _this.mContainer.addChild(_this.mFScreenContainer);
            _this.mTileMap = tileMap;
            _this.mViewRect = new egret.Rectangle;
            _this.mViewChanged = true;
            _this.mbAdjustView = true;
            _this.m_linkSprite = null;
            _this.mTempPoint = new egret.Point;
            _this.mFgColorLayer = new egret.Shape();
            _this.mFgColorLayer.name = "foreground_color";
            _this.mBgColorLayer = new egret.Shape();
            _this.mBgColorLayer.name = "background_color";
            _this.mBgImage = new egret.Bitmap;
            _this.mFgImage = new egret.Bitmap;
            _this.mScreenEffectList = [];
            return _this;
        }
        Camera.prototype.addNodeToCamera = function (node) {
            this.mContainer.addChild(node);
        };
        Camera.prototype.removeNodeFromCamera = function (node) {
            if (this.mContainer.getChildIndex(node) != -1)
                this.mContainer.removeChild(node);
        };
        Camera.prototype.isViewChanged = function () {
            return this.mViewChanged;
        };
        Camera.prototype.setViewChanged = function (b) {
            this.mViewChanged = b;
        };
        Camera.prototype.setViewSize = function (w, h) {
            if (this.mViewRect.width == w && this.mViewRect.height == h)
                return;
            this.mViewRect.width = w;
            this.mViewRect.height = h;
            //设置摄像机锚点是中间
            this.anchorOffsetX = w / 2;
            this.anchorOffsetY = h / 2;
            this.x = w / 2;
            this.y = h / 2;
            this.adjustViewCenter();
        };
        Camera.prototype.getViewWidth = function () {
            return this.mViewRect.width;
        };
        Camera.prototype.getViewHeight = function () {
            return this.mViewRect.height;
        };
        Camera.prototype.setAdjustViewCenter = function (bAdjust) {
            this.mbAdjustView = bAdjust;
        };
        Camera.prototype.setViewCenter = function (x, y) {
            TLog.Assert(x != null && y != null && isNaN(x) == false && isNaN(y) == false);
            TLog.Assert(this.mViewRect.width != 0 && this.mViewRect.height != 0, "setViewCenter");
            var beginX = x - this.mViewRect.width / 2;
            var beginY = y - this.mViewRect.height / 2;
            if (beginX == this.mViewRect.x && beginY == this.mViewRect.y)
                return;
            this.mViewRect.x = beginX;
            this.mViewRect.y = beginY;
            this.adjustViewCenter();
        };
        Camera.prototype.getViewCenterX = function () {
            return this.mViewRect.x + this.mViewRect.width / 2;
        };
        Camera.prototype.getViewCenterY = function () {
            return this.mViewRect.y + this.mViewRect.height / 2;
        };
        Camera.prototype.getViewBeginX = function () {
            return this.mViewRect.x;
        };
        Camera.prototype.getViewBeginY = function () {
            return this.mViewRect.y;
        };
        Camera.prototype.getViewRect = function () {
            return this.mViewRect;
        };
        Camera.prototype.getAdjustCenter = function (inCenterX, inCenterY, outPoint) {
            var ouCenterX = inCenterX;
            var outCenterY = inCenterY;
            if (this.mbAdjustView) {
                var mapW = this.mTileMap.getMapWidth();
                var mapH = this.mTileMap.getMapHeight();
                var viewSizeW = this.mViewRect.width;
                var viewSizeWHalf = viewSizeW / 2;
                var viewSizeH = this.mViewRect.height;
                var viewSizeHHalf = viewSizeH / 2;
                var maxViewW = mapW - viewSizeWHalf;
                var maxViewH = mapH - viewSizeHHalf;
                var minViewW = viewSizeWHalf;
                var minViewH = viewSizeHHalf;
                if (mapW <= viewSizeW) {
                    maxViewW = viewSizeWHalf; //this.mapW/2;
                    minViewW = viewSizeWHalf;
                }
                if (mapH <= viewSizeH) {
                    maxViewH = viewSizeHHalf; //this.mapH/2;
                    minViewH = viewSizeHHalf;
                }
                if (inCenterX > maxViewW) {
                    ouCenterX = maxViewW;
                }
                else if (inCenterX < minViewW) {
                    ouCenterX = minViewW;
                }
                if (inCenterY > maxViewH) {
                    outCenterY = maxViewH;
                }
                else if (inCenterY < minViewH) {
                    outCenterY = minViewH;
                }
            }
            return outPoint.setTo(ouCenterX, outCenterY);
        };
        Camera.prototype.adjustViewCenter = function () {
            var viewSizeW = this.mViewRect.width;
            var viewSizeWHalf = viewSizeW / 2;
            var viewSizeH = this.mViewRect.height;
            var viewSizeHHalf = viewSizeH / 2;
            var inCenterX = this.mViewRect.x + viewSizeWHalf;
            var inCenterY = this.mViewRect.y + viewSizeHHalf;
            this.getAdjustCenter(inCenterX, inCenterY, this.mTempPoint);
            //更新视口坐标
            this.mViewRect.x = this.mTempPoint.x - viewSizeWHalf;
            this.mViewRect.y = this.mTempPoint.y - viewSizeHHalf;
            //DisplayObjectContainer
            this.width = viewSizeW;
            this.height = viewSizeH;
            this.mContainer.x = -this.mViewRect.x; //转成摄像机左边（左上角0，0）
            this.mContainer.y = -this.mViewRect.y;
            //if (this.mFgColorLayer.parent) {
            this.mFgColorLayer.x = this.mViewRect.x;
            this.mFgColorLayer.y = this.mViewRect.y;
            //}
            //if (this.mBgColorLayer.parent) {
            this.mBgColorLayer.x = this.mViewRect.x;
            this.mBgColorLayer.y = this.mViewRect.y;
            //}
            this.mFScreenContainer.x = this.mViewRect.x;
            this.mFScreenContainer.y = this.mViewRect.y;
            this.mBScreenContainer.x = this.mViewRect.x;
            this.mBScreenContainer.y = this.mViewRect.y;
            this.mViewChanged = true;
        };
        Camera.prototype.setZoomScale = function (scale) {
            this.scaleX = this.scaleY = scale;
        };
        Camera.prototype.getZoomScale = function () {
            return this.scaleX;
        };
        //不用检测camera里面的object
        Camera.prototype.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target == null) {
                if (!this.$visible || !this.touchEnabled) {
                    return null;
                }
                var m = this.mContainer.$getInvertedConcatenatedMatrix();
                var localX = m.a * stageX + m.c * stageY + m.tx;
                var localY = m.b * stageX + m.d * stageY + m.ty;
                if (this.mViewRect.contains(localX, localY)) {
                    target = this;
                }
            }
            return target;
        };
        Camera.prototype.stageXYToMapXY = function (stageX, stageY, outPoint) {
            var m = this.mContainer.$getInvertedConcatenatedMatrix();
            m.transformPoint(stageX, stageY, outPoint);
            return outPoint;
        };
        Camera.prototype.mapXYToStageXY = function (mapX, mapY, outPoint) {
            var m = this.mContainer.$getConcatenatedMatrix();
            m.transformPoint(mapX, mapY, outPoint);
            return outPoint;
        };
        Camera.prototype.linkMapSprite = function (sprite) {
            this.unlinkMapSprite();
            this.m_linkSprite = sprite;
            this.m_linkSprite.retain();
        };
        Camera.prototype.unlinkMapSprite = function () {
            if (this.m_linkSprite) {
                this.m_linkSprite.release();
                this.m_linkSprite = null;
            }
        };
        ///========================================================================
        Camera.prototype.updateLinkSprite = function () {
            if (this.m_linkSprite == null)
                return;
            var spriteX = this.m_linkSprite.getPositionX();
            var spriteY = this.m_linkSprite.getPositionY();
            //this.getAdjustCenter(spriteX, spriteY, this.mTempPoint);
            this.setViewCenter(spriteX, spriteY);
        };
        Camera.prototype.onUpdate = function () {
            //跟踪精灵
            this.updateLinkSprite();
            this.updateScreenEffect();
        };
        ///========================================================================
        Camera.prototype.updateColor = function (layer, a, r, g, b) {
            var color = r << 16 | g << 8 | b;
            layer.graphics.clear(); //modify:yangguiming 修复内存泄漏
            layer.graphics.beginFill(color);
            layer.graphics.drawRect(0, 0, this.mViewRect.width, this.mViewRect.height);
            layer.graphics.endFill();
            layer.alpha = a / 255;
        };
        //镜头的背景色，在所有层sprite的下面，地图层上面
        Camera.prototype.setBgBlendColorEnable = function (enable) {
            if (enable) {
                this.mContainer.addChild(this.mBgColorLayer);
                this.onLayersChange();
            }
            else {
                if (this.mBgColorLayer.parent)
                    this.mContainer.removeChild(this.mBgColorLayer);
            }
        };
        Camera.prototype.setBgBlendColor = function (a, r, g, b) {
            this.updateColor(this.mBgColorLayer, a, r, g, b);
        };
        //镜头的前景色，在第一层sprite的下面
        Camera.prototype.setFgBlendColorEnable = function (enable) {
            if (enable) {
                this.mContainer.addChild(this.mFgColorLayer);
                this.onLayersChange();
            }
            else {
                if (this.mFgColorLayer.parent)
                    this.mContainer.removeChild(this.mFgColorLayer);
            }
        };
        Camera.prototype.setFgBlendColor = function (a, r, g, b) {
            this.updateColor(this.mFgColorLayer, a, r, g, b);
        };
        Camera.prototype._setScreenImageImp = function (imagePath, image, parent) {
            if (imagePath == "" || imagePath == null) {
                if (image.parent)
                    image.parent.removeChild(image);
            }
            else {
                var callback = {
                    onAsynTextureSucceed: function (key, texture, res) {
                        image.texture = texture; //显示图片
                    }
                };
                parent.addChildAt(image, 0);
                var textureMgr = core.TextureManager.getInstance();
                textureMgr.loadTextureAsyn(imagePath, callback);
            }
        };
        Camera.prototype.setBgImage = function (imagePath) {
            this._setScreenImageImp(imagePath, this.mBgImage, this.mBScreenContainer);
            return this.mBgImage;
        };
        Camera.prototype.setFgImage = function (imagePath) {
            this._setScreenImageImp(imagePath, this.mFgImage, this.mFScreenContainer);
            return this.mFgImage;
        };
        Camera.prototype.onLayersChange = function () {
            var childrents = this.mContainer.$children;
            //从下往上搜索
            var index = -1;
            for (var i = 0; i < childrents.length; i++) {
                var v = childrents[i];
                if (v instanceof map.MapLayerDisplayerNode) {
                    index = i;
                    break;
                }
            }
            //MapLayer可能多个，bgColorLayer插入到第一个MapLayer上面
            if (index != -1) {
                this.mContainer.setChildIndex(this.mBScreenContainer, index + 1);
                if (this.mBgColorLayer.parent) {
                    this.mContainer.setChildIndex(this.mBgColorLayer, index + 1);
                }
            }
            else {
                this.mContainer.setChildIndex(this.mBScreenContainer, 0);
                if (this.mBgColorLayer.parent) {
                    this.mContainer.setChildIndex(this.mBgColorLayer, 0);
                }
            }
            //从上往下搜索
            index = -1;
            for (var i = childrents.length - 1; i >= 0; i--) {
                var v = childrents[i];
                if (v instanceof map.SpriteLayerDisplayerNode) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                this.mContainer.setChildIndex(this.mFScreenContainer, index + 1);
                if (this.mFgColorLayer.parent) {
                    this.mContainer.setChildIndex(this.mFgColorLayer, index - 1);
                }
            }
        };
        Camera.prototype.addScreenEffect = function (sprite, layer) {
            var index = this.mScreenEffectList.indexOf(sprite);
            if (index != -1) {
                return false;
            }
            if (layer == Camera.SCREEN_FOREGROUND) {
                this.mFScreenContainer.addChild(sprite.getDisplayNode());
            }
            else {
                this.mBScreenContainer.addChild(sprite.getDisplayNode());
            }
            this.mScreenEffectList.push(sprite);
        };
        Camera.prototype.removeScreenEffect = function (sprite) {
            var index = this.mScreenEffectList.indexOf(sprite);
            if (index == -1)
                return false;
            this.mScreenEffectList.splice(index, 1);
            var parent = sprite.getDisplayNode().parent;
            TLog.Assert(parent != null);
            parent.removeChild(sprite.getDisplayNode());
        };
        Camera.prototype.updateScreenEffect = function () {
            if (this.mScreenEffectList.length == 0)
                return;
            for (var _i = 0, _a = this.mScreenEffectList; _i < _a.length; _i++) {
                var v = _a[_i];
                v.retain();
                v.onUpdate(null);
                v.release();
            }
        };
        Camera.SCREEN_BACKGROUND = 0;
        Camera.SCREEN_FOREGROUND = 1;
        return Camera;
    }(egret.DisplayObjectContainer));
    map.Camera = Camera;
    __reflect(Camera.prototype, "map.Camera");
})(map || (map = {}));
var map;
(function (map) {
    //地图上占据区域的元素（动画、装饰等等）
    var MapAreaElemDisplayNode = (function (_super) {
        __extends(MapAreaElemDisplayNode, _super);
        function MapAreaElemDisplayNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //默认居中
        MapAreaElemDisplayNode.prototype.positionFromRect = function (rect) {
            this.x = rect.left + rect.width / 2;
            this.y = rect.top + rect.height / 2;
        };
        return MapAreaElemDisplayNode;
    }(egret.DisplayObjectContainer));
    map.MapAreaElemDisplayNode = MapAreaElemDisplayNode;
    __reflect(MapAreaElemDisplayNode.prototype, "map.MapAreaElemDisplayNode");
    // 通用加载资源的node
    var MapAreaElemResNode = (function (_super) {
        __extends(MapAreaElemResNode, _super);
        function MapAreaElemResNode() {
            var _this = _super.call(this) || this;
            _this.mMapMgr = map.MapManager.getInstance();
            _this.textureRes = null;
            _this.jsonRes = null;
            _this.mResMgr = core.ResManager.getInstance();
            _this.mTextureMgr = core.TextureManager.getInstance();
            return _this;
        }
        //析构
        MapAreaElemResNode.prototype.clear = function () {
            if (this.textureRes) {
                this.textureRes.release();
                this.textureRes = null;
            }
            if (this.jsonRes) {
                this.jsonRes.release();
                this.jsonRes = null;
            }
            this.mResMgr.cancelResAsyn(this);
            this.mTextureMgr.cancelTextureAsynAll(this);
        };
        //////////////////////////////////////////////////////////////
        MapAreaElemResNode.prototype.loadTextureAndJson = function (texturePath, jsonPath) {
            this.mTextureMgr.loadTextureAsyn(texturePath, this);
            this.mResMgr.loadResAsyn(jsonPath, this, core.ResourceType.TYPE_JSON);
        };
        MapAreaElemResNode.prototype.onAsynTextureSucceed = function (key, texture, textureRes) {
            this.textureRes = textureRes;
            this.textureRes.retain();
            this.checkLoadComplete();
        };
        MapAreaElemResNode.prototype.onResItemLoad = function (res) {
            this.jsonRes = res;
            this.jsonRes.retain();
            this.checkLoadComplete();
        };
        MapAreaElemResNode.prototype.onResItemError = function (key) {
        };
        MapAreaElemResNode.prototype.checkLoadComplete = function () {
            if (this.textureRes && this.jsonRes) {
                this.onLoadComplete();
            }
        };
        //////////////////////////////////////////////////////////////
        //子类继承
        MapAreaElemResNode.prototype.onLoadComplete = function () {
        };
        return MapAreaElemResNode;
    }(MapAreaElemDisplayNode));
    map.MapAreaElemResNode = MapAreaElemResNode;
    __reflect(MapAreaElemResNode.prototype, "map.MapAreaElemResNode", ["core.ResItemCallback", "core.TextureCallback"]);
    //帧动画
    var MapAreaAnimNode = (function (_super) {
        __extends(MapAreaAnimNode, _super);
        function MapAreaAnimNode() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.lastTimeStamp = -1;
            _this.frames = null;
            _this.index = 0;
            _this.delay = 200;
            _this.during = 0;
            _this.animScale = 1;
            return _this;
        }
        MapAreaAnimNode.prototype.initWithName = function (name) {
            var info = this.mMapMgr.getAreaAnimConfig(name);
            if (info == null || !info.path) {
                TLog.Error("MapAreaAnimNode %s not exist", name);
                return;
            }
            this.index = -1;
            this.delay = info.delay || 200;
            this.animScale = info.scale;
            this.during = this.delay;
            var path = info.path;
            if (path.charAt(path.length - 1) != "/") {
                path = path + "/";
            }
            var texPath = path + name + ".png";
            var texJson = path + name + ".json";
            this.loadTextureAndJson(texPath, texJson);
        };
        MapAreaAnimNode.prototype.clear = function () {
            _super.prototype.clear.call(this);
            egret.stopTick(this.update, this);
            this.mFramesTexture = null;
        };
        //帧动画的坐标点在左下方
        MapAreaAnimNode.prototype.positionFromRect = function (rect) {
            this.x = rect.x;
            this.y = rect.bottom - rect.height;
        };
        MapAreaAnimNode.prototype.onLoadComplete = function () {
            var raw = this.jsonRes.getData();
            TLog.Assert(raw.frames);
            var keys = Object.keys(raw.frames);
            keys.sort(function (a, b) {
                return a.localeCompare(b);
            });
            this.frames = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                this.frames.push(raw.frames[k]);
            }
            //this.frames = raw.frames;
            TLog.Assert(this.frames.length > 0);
            this.mBitmap = new egret.Bitmap;
            this.addChild(this.mBitmap);
            this.lastTimeStamp = egret.getTimer();
            this.mFramesTexture = {};
            this.scaleX = this.animScale;
            this.scaleY = this.animScale;
            egret.startTick(this.update, this);
        };
        MapAreaAnimNode.prototype.update = function (timeStamp) {
            if (this.mFramesTexture == null)
                return false;
            var dt = timeStamp - this.lastTimeStamp;
            this.lastTimeStamp = timeStamp;
            this.during += dt;
            if (this.during >= this.delay) {
                this.during = 0;
                this.index++;
                if (this.index >= this.frames.length) {
                    this.index = 0;
                }
                if (this.mFramesTexture[this.index] == null) {
                    var frame = this.frames[this.index];
                    var baseTexture = this.textureRes.getData();
                    var texture = new egret.Texture();
                    texture.$bitmapData = baseTexture.$bitmapData;
                    texture.$initData(frame.x, frame.y, frame.w, frame.h, frame.offX, frame.offY, frame.sourceW, frame.sourceH, baseTexture.$sourceWidth, baseTexture.$sourceHeight);
                    this.mFramesTexture[this.index] = texture;
                }
                this.mBitmap.texture = this.mFramesTexture[this.index];
            }
            return false;
        };
        return MapAreaAnimNode;
    }(MapAreaElemResNode));
    map.MapAreaAnimNode = MapAreaAnimNode;
    __reflect(MapAreaAnimNode.prototype, "map.MapAreaAnimNode");
    //粒子系统(暂时不用，屏蔽粒子系统)
    // export class MapAreaParticleNode extends MapAreaElemResNode {
    // 	private system: particle.GravityParticleSystem;
    // 	public initWithName(name:string){
    // 		let info = this.mMapMgr.getAreaParticleConfig(name);
    // 		if(info == null || !info.path ){
    // 			TLog.Error("MapAreaParticleNode %s not exist", name)
    // 			return 
    // 		}
    // 		let path:string = info.path
    // 		if(path.charAt(path.length - 1) != "/"){
    // 			path = path + "/";
    // 		}
    // 		let texPath = path + name + ".png"
    // 		let texJson = path + name + ".json"
    // 		this.loadTextureAndJson(texPath, texJson);
    // 	}
    // 	public clear(){
    // 		super.clear();
    // 		if(this.system){
    // 			this.system.stop(true);
    // 			this.system = null;
    // 		}
    // 	}
    // 	protected onLoadComplete(){
    // 		this.system = new particle.GravityParticleSystem(this.textureRes.getData(), this.jsonRes.getData());
    // 		this.addChild(this.system);
    //         this.system.start();
    // 	}
    // }
})(map || (map = {}));
var map;
(function (map) {
    //主要为了识别在camera里面的node种类
    var MapLayerDisplayerNode = (function (_super) {
        __extends(MapLayerDisplayerNode, _super);
        function MapLayerDisplayerNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MapLayerDisplayerNode;
    }(egret.DisplayObjectContainer));
    map.MapLayerDisplayerNode = MapLayerDisplayerNode;
    __reflect(MapLayerDisplayerNode.prototype, "map.MapLayerDisplayerNode");
    var SpriteLayerDisplayerNode = (function (_super) {
        __extends(SpriteLayerDisplayerNode, _super);
        function SpriteLayerDisplayerNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SpriteLayerDisplayerNode;
    }(egret.DisplayObjectContainer));
    map.SpriteLayerDisplayerNode = SpriteLayerDisplayerNode;
    __reflect(SpriteLayerDisplayerNode.prototype, "map.SpriteLayerDisplayerNode");
})(map || (map = {}));
var map;
(function (map) {
    //地图上占据区域的元素（动画、装饰等等）
    var MapAreaElem = (function (_super) {
        __extends(MapAreaElem, _super);
        function MapAreaElem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mRefCount = 0;
            return _this;
        }
        MapAreaElem.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mMapMgr = map.MapManager.getInstance();
        };
        MapAreaElem.prototype.destory = function () {
            this.clearNode();
            this.mRefCount = 0;
        };
        MapAreaElem.prototype.initWithParam = function (id, name, area, elemType) {
            this.mId = id;
            this.mName = name;
            this.mArea = area;
            this.mType = elemType;
        };
        MapAreaElem.prototype.onElemFound = function (layer) {
            if (this.mRefCount != 0)
                return;
            this.mRefCount++;
            if (this.mNode == null)
                this.mNode = this.createElemNode(this.mType, this.mName);
            if (this.mNode == null) {
                TLog.Error("MapAreaElem.onElemFound", this.mType, this.mName);
                return;
            }
            layer.getDisplayNode().addChild(this.mNode);
            this.mNode.positionFromRect(this.mArea);
        };
        MapAreaElem.prototype.onElemLost = function (layer) {
            if (this.mRefCount == 0)
                return;
            this.mRefCount--;
            if (this.mRefCount == 0) {
                this.clearNode();
            }
        };
        MapAreaElem.prototype.clearNode = function () {
            if (this.mNode) {
                if (this.mNode.parent) {
                    this.mNode.parent.removeChild(this.mNode);
                }
                this.mNode.clear();
                this.mNode = null;
            }
        };
        MapAreaElem.prototype.createElemNode = function (objectType, name) {
            var elemNode = null;
            if (objectType == "frame_anim") {
                elemNode = new map.MapAreaAnimNode();
            }
            else if (objectType == "outside_particle") {
                //elemNode = new MapAreaParticleNode()
            }
            if (elemNode) {
                elemNode.initWithName(name);
            }
            return elemNode;
        };
        return MapAreaElem;
    }(TClass));
    map.MapAreaElem = MapAreaElem;
    __reflect(MapAreaElem.prototype, "map.MapAreaElem");
})(map || (map = {}));
var map;
(function (map) {
    //地图上占据区域的元素（动画、装饰等等）
    var MapAreaElemLayer = (function (_super) {
        __extends(MapAreaElemLayer, _super);
        function MapAreaElemLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapAreaElemLayer.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mAreaElemList = [];
            this.mGrid2ElemListMap = {};
        };
        MapAreaElemLayer.prototype.destory = function () {
            this.clearAllElems();
        };
        MapAreaElemLayer.prototype.clearAllElems = function () {
            for (var _i = 0, _a = this.mAreaElemList; _i < _a.length; _i++) {
                var elem = _a[_i];
                elem.destory();
            }
            this.mAreaElemList = null;
        };
        MapAreaElemLayer.prototype.load = function (stream) {
            _super.prototype.load.call(this, stream);
            var flag = stream.readUInt();
            var typeNum = stream.readUInt();
            for (var i = 0; i < typeNum; ++i) {
                var typeName = stream.readString();
                var infoNum = stream.readUInt();
                for (var j = 0; j < infoNum; ++j) {
                    //let typeId = stream.readUInt();
                    var id = stream.readUInt();
                    var name_2 = stream.readString();
                    var area = new egret.Rectangle();
                    area.left = stream.readUInt();
                    area.top = stream.readUInt();
                    area.right = stream.readUInt();
                    area.bottom = stream.readUInt();
                    var mapElem = map.MapAreaElem.newObj();
                    mapElem.initWithParam(id, name_2, area, typeName);
                    this.mAreaElemList.push(mapElem);
                }
            }
            return true;
        };
        MapAreaElemLayer.prototype.initEyeshot = function (nMapWidth, nMapHeight, nGridWidth, nGridHeight) {
            _super.prototype.initEyeshot.call(this, nMapWidth, nMapHeight, nGridWidth, nGridHeight);
            this.mGrid2ElemListMap = {};
            //一行多少个格子
            var colCount = this.mLayerEyeshot.getGridWidth();
            for (var _i = 0, _a = this.mAreaElemList; _i < _a.length; _i++) {
                var elem = _a[_i];
                var gridRect = this.mLayerEyeshot.getGridByMapRect(elem.mArea);
                for (var x = gridRect.left; x <= gridRect.right; x++) {
                    for (var y = gridRect.top; y <= gridRect.bottom; y++) {
                        var index = x * colCount + y;
                        if (this.mGrid2ElemListMap[index] == null) {
                            this.mGrid2ElemListMap[index] = [];
                        }
                        this.mGrid2ElemListMap[index].push(elem);
                    }
                }
            }
        };
        MapAreaElemLayer.prototype.getMapAreaElem = function (nGridX, nGridY) {
            var colCount = this.mLayerEyeshot.getGridWidth();
            var index = nGridX * colCount + nGridY;
            return this.mGrid2ElemListMap[index];
        };
        MapAreaElemLayer.prototype.onEyeshotFound = function (nGridX, nGridY) {
            var elemList = this.getMapAreaElem(nGridX, nGridY);
            if (elemList) {
                for (var _i = 0, elemList_1 = elemList; _i < elemList_1.length; _i++) {
                    var elem = elemList_1[_i];
                    elem.onElemFound(this);
                }
            }
        };
        MapAreaElemLayer.prototype.onEyeshotLost = function (nGridX, nGridY) {
            var elemList = this.getMapAreaElem(nGridX, nGridY);
            if (elemList) {
                for (var _i = 0, elemList_2 = elemList; _i < elemList_2.length; _i++) {
                    var elem = elemList_2[_i];
                    elem.onElemLost(this);
                }
            }
        };
        return MapAreaElemLayer;
    }(map.MapLayerBase));
    map.MapAreaElemLayer = MapAreaElemLayer;
    __reflect(MapAreaElemLayer.prototype, "map.MapAreaElemLayer");
})(map || (map = {}));
var core;
(function (core) {
    var ResGroup = (function (_super) {
        __extends(ResGroup, _super);
        function ResGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResGroup.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mResGroupMgr = params[0];
            this.mResItemMap = {};
            this.mbLoaded = false;
            this.mDelayTime = 0;
            this.mDisposeTime = -1;
            this.mResCallback = null;
            this.mTextureCallback = null;
        };
        ResGroup.prototype.destory = function () {
            this.unload();
            this.mResItemMap = null;
        };
        ResGroup.prototype.addResItemConfig = function (path, type) {
            this.mResItemMap[path] = { type: type, resItem: null };
        };
        ResGroup.prototype.setDisposeTime = function (time) {
            //TLog.Assert(time > 0)
            this.mDisposeTime = time;
        };
        ResGroup.prototype.onLoadComplete = function () {
            //TLog.Assert(this.mResCallback != null);
            this.mDelayTime = 0;
            this.mbLoaded = true;
            this.mResCallback = null;
            this.mTextureCallback = null;
            this.mResGroupMgr._onGroupLoad(this.name);
        };
        ResGroup.prototype.onSingleResSucceed = function (res, count, all) {
            var info = this.mResItemMap[res.getKey()];
            if (info) {
                TLog.Assert(info.resItem == null);
                info.resItem = res;
                res.retain();
            }
            count++;
            if (count >= all) {
                this.onLoadComplete();
            }
            return count;
        };
        ResGroup.prototype.load = function () {
            var _this = this;
            if (this.mbLoaded == true) {
                egret.callLater(this.mResGroupMgr._onGroupLoad, this.mResGroupMgr, this.name);
                //this.mResGroupMgr._onGroupLoad(this.name);
                return;
            }
            if (this.mResCallback != null && this.mTextureCallback != null)
                return;
            var self = this;
            var all = Object.keys(this.mResItemMap).length;
            var count = 0;
            var callback = {
                onResItemLoad: function (res) {
                    count = self.onSingleResSucceed(res, count, all);
                },
                onResItemError: function (key) {
                    count++; //表单出错
                    if (count >= all) {
                        _this.onLoadComplete();
                    }
                }
            };
            this.mResCallback = callback;
            var textureCallback = {
                onAsynTextureSucceed: function (key, texture, res) {
                    count = self.onSingleResSucceed(res, count, all);
                }
            };
            this.mTextureCallback = textureCallback;
            var resManager = core.ResManager.getInstance();
            var textureMgr = core.TextureManager.getInstance();
            for (var path in this.mResItemMap) {
                var info = this.mResItemMap[path];
                if (info.type == core.ResourceType.TYPE_IMAGE) {
                    textureMgr.loadTextureAsyn(path, textureCallback);
                }
                else {
                    resManager.loadResAsyn(path, callback, info.type);
                }
            }
        };
        ResGroup.prototype.unload = function () {
            if (this.mbLoaded == false)
                return;
            this.mbLoaded = false;
            if (this.mResCallback) {
                var resManager = core.ResManager.getInstance();
                resManager.cancelResAsyn(this.mResCallback);
                this.mResCallback = null;
            }
            if (this.mTextureCallback) {
                var textureMgr = core.TextureManager.getInstance();
                textureMgr.cancelTextureAsynAll(this.mTextureCallback);
                this.mTextureCallback = null;
            }
            for (var path in this.mResItemMap) {
                var info = this.mResItemMap[path];
                if (info.resItem) {
                    info.resItem.release();
                    info.resItem = null;
                }
            }
        };
        ResGroup.prototype.onUpdate = function () {
            if (this.mbLoaded == false || this.mDisposeTime == -1)
                return;
            this.mDelayTime += core.TimeStamp.DelayTime;
            if (this.mDelayTime > this.mDisposeTime) {
                this.unload();
            }
        };
        return ResGroup;
    }(TClass));
    core.ResGroup = ResGroup;
    __reflect(ResGroup.prototype, "core.ResGroup");
})(core || (core = {}));
var map;
(function (map) {
    ;
    function GRID_ALIGN(x, g) {
        return Math.floor((x - 1) / g + 1);
        //return Math.floor(x/g);
    }
    var MapLayerEyeShot = (function () {
        function MapLayerEyeShot() {
            this.m_bForceRefresh = false;
        }
        MapLayerEyeShot.prototype.create = function (pSink, nMapWidth, nMapHeight, nGridWidth, nGridHeight) {
            this.m_pScrollSheetSink = pSink;
            this.m_nMapWidth = nMapWidth;
            this.m_nMapHeight = nMapHeight;
            if (this.m_nMapWidth == 0 || this.m_nMapHeight == 0)
                return false;
            this.m_nGridWidth = nGridWidth;
            this.m_nGridHeight = nGridHeight; //逻辑视口格子宽度
            if (this.m_nGridWidth == 0 || this.m_nGridHeight == 0)
                return false;
            this.m_nMapGridWidth = GRID_ALIGN(this.m_nMapWidth, this.m_nGridWidth);
            this.m_nMapGridHeight = GRID_ALIGN(this.m_nMapHeight, this.m_nGridHeight);
            this.m_rcViewport = new egret.Rectangle;
            this.m_rcViewportGrid = new egret.Rectangle();
            core.EgretUtil.Rectangle_setLTRB(this.m_rcViewportGrid, -1, -1, -1, -1);
            this.m_rcLastDirtyGrid = new egret.Rectangle;
            this.m_rcLastDirtyGrid.copyFrom(this.m_rcViewportGrid);
        };
        MapLayerEyeShot.prototype.getGridWidth = function () {
            return this.m_nGridWidth;
        };
        MapLayerEyeShot.prototype.getGridHeight = function () {
            return this.m_nGridHeight;
        };
        MapLayerEyeShot.prototype.getGridXCount = function () {
            return this.m_nMapGridWidth;
        };
        MapLayerEyeShot.prototype.getGridYCount = function () {
            return this.m_nMapGridHeight;
        };
        MapLayerEyeShot.prototype.getGridRect = function (nGridX, nGridY) {
            var rcGrid = new egret.Rectangle;
            core.EgretUtil.Rectangle_setLTRB(rcGrid, nGridX * this.m_nGridWidth, nGridY * this.m_nGridHeight, (nGridX + 1) * this.m_nGridWidth, (nGridY + 1) * this.m_nGridHeight);
            var rcMap = new egret.Rectangle;
            core.EgretUtil.Rectangle_setLTRB(rcMap, 0, 0, this.m_nMapWidth - 1, this.m_nMapHeight - 1);
            return rcGrid.intersection(rcMap);
        };
        MapLayerEyeShot.prototype.getGridByMapRect = function (mapRect) {
            if (this.m_nMapWidth == 0 || this.m_nMapHeight == 0)
                return new egret.Rectangle;
            var rcGrid = new egret.Rectangle;
            core.EgretUtil.Rectangle_setLTRB(rcGrid, map.FLOOR(mapRect.left / this.m_nGridWidth), map.FLOOR(mapRect.top / this.m_nGridHeight), map.FLOOR(mapRect.right / this.m_nGridWidth), map.FLOOR(mapRect.bottom / this.m_nGridHeight));
            var rcMap = new egret.Rectangle;
            core.EgretUtil.Rectangle_setLTRB(rcMap, 0, 0, this.m_nMapWidth - 1, this.m_nMapHeight - 1);
            return rcGrid.intersection(rcMap);
        };
        MapLayerEyeShot.prototype.changeViewportSize = function (viewportWidth, viewportHeight, notify) {
            if (this.m_rcViewport.width == viewportWidth && this.m_rcViewport.height == viewportHeight)
                return;
            this.m_rcViewport.setTo(this.m_rcViewport.left, this.m_rcViewport.top, viewportWidth, viewportHeight);
            if (notify)
                this.scrollViewport(0, 0);
        };
        MapLayerEyeShot.prototype.moveViewportCenterTo = function (centerX, centerY) {
            return this.moveViewportTo(centerX - this.m_rcViewport.width / 2, centerY - this.m_rcViewport.height / 2);
        };
        MapLayerEyeShot.prototype.moveViewportTo = function (x, y) {
            // if (this.m_rcViewport.height == 0 || this.m_rcViewport.width == 0 
            // 	|| x == this.m_rcViewport.left || y == this.m_rcViewport.top)
            // 	return false;
            if (this.m_rcViewport.height == 0 || this.m_rcViewport.width == 0)
                return false;
            return this.scrollViewport(x - this.m_rcViewport.left, y - this.m_rcViewport.top);
        };
        MapLayerEyeShot.prototype.scrollViewport = function (dx, dy) {
            if (this.m_rcViewport.left + dx < 0)
                dx = -this.m_rcViewport.left;
            if (this.m_rcViewport.right + dx > this.m_nMapWidth)
                dx = this.m_nMapWidth - this.m_rcViewport.right;
            if (this.m_rcViewport.top + dy < 0)
                dy = -this.m_rcViewport.top;
            if (this.m_rcViewport.bottom + dy > this.m_nMapHeight)
                dy = this.m_nMapHeight - this.m_rcViewport.bottom;
            this.m_rcViewport.offset(dx, dy);
            //Math::IntRect rcNew, rcOffset, rcNewDirty;
            var rcNew = new egret.Rectangle;
            var rcOffset = null;
            var rcNewDirty = null;
            // 计算新的网格矩形
            core.EgretUtil.Rectangle_setLTRB(rcNew, map.FLOOR(this.m_rcViewport.left / this.m_nGridWidth), map.FLOOR(this.m_rcViewport.top / this.m_nGridHeight), map.FLOOR(this.m_rcViewport.right / this.m_nGridWidth), map.FLOOR(this.m_rcViewport.bottom / this.m_nGridHeight));
            if (rcNew.equals(this.m_rcViewportGrid))
                return true;
            //保证左边一列和上面一行会被加载
            rcOffset = rcNew.clone();
            rcOffset.left -= 1;
            rcOffset.top -= 1;
            rcOffset.right += 1;
            rcOffset.bottom += 1;
            //脏网格标记
            var rcMapGrid = new egret.Rectangle;
            rcMapGrid.setTo(0, 0, this.m_nMapGridWidth - 1, this.m_nMapGridHeight - 1);
            rcNewDirty = rcOffset.intersection(rcMapGrid);
            var tempPoint = new egret.Point;
            if (this.m_bForceRefresh == false) {
                for (var y = this.m_rcLastDirtyGrid.top; y >= 0 && y <= this.m_rcLastDirtyGrid.bottom; y++) {
                    for (var x = this.m_rcLastDirtyGrid.left; x >= 0 && x <= this.m_rcLastDirtyGrid.right; x++) {
                        tempPoint.setTo(x, y);
                        if (!rcNewDirty.contains(tempPoint.x, tempPoint.y))
                            this.m_pScrollSheetSink.onEyeshotLost(x, y);
                    }
                }
                for (var y = rcNewDirty.top; y <= rcNewDirty.bottom; y++) {
                    for (var x = rcNewDirty.left; x <= rcNewDirty.right; x++) {
                        tempPoint.setTo(x, y);
                        if (!this.m_rcLastDirtyGrid.contains(tempPoint.x, tempPoint.y))
                            this.m_pScrollSheetSink.onEyeshotFound(x, y);
                    }
                }
            }
            else {
                for (var y = this.m_rcLastDirtyGrid.top; y >= 0 && y <= this.m_rcLastDirtyGrid.bottom; y++) {
                    for (var x = this.m_rcLastDirtyGrid.left; x >= 0 && x <= this.m_rcLastDirtyGrid.right; x++) {
                        this.m_pScrollSheetSink.onEyeshotLost(x, y);
                    }
                }
                for (var y = rcNewDirty.top; y <= rcNewDirty.bottom; y++) {
                    for (var x = rcNewDirty.left; x <= rcNewDirty.right; x++) {
                        this.m_pScrollSheetSink.onEyeshotFound(x, y);
                    }
                }
            }
            this.m_rcViewportGrid = rcNew;
            this.m_rcLastDirtyGrid = rcNewDirty;
            return true;
        };
        return MapLayerEyeShot;
    }());
    map.MapLayerEyeShot = MapLayerEyeShot;
    __reflect(MapLayerEyeShot.prototype, "map.MapLayerEyeShot");
})(map || (map = {}));
var map;
(function (map) {
    var MapTile = (function (_super) {
        __extends(MapTile, _super);
        function MapTile() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mRefCount = 0;
            return _this;
        }
        MapTile.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mCellX = params[0];
            this.mCellY = params[1];
            this.mImageId = 0;
            this.mFlag = 0;
            this.mMapMgr = map.MapManager.getInstance();
        };
        MapTile.prototype.destory = function () {
            this.clearImage();
            this.mImage = null;
            this.mRefCount = 0;
        };
        MapTile.prototype.setImageId = function (imageId) {
            this.mImageId = imageId;
        };
        MapTile.prototype.setFlag = function (flag) {
            this.mFlag = flag;
        };
        MapTile.prototype.onTileFound = function (layer) {
            if (this.mRefCount != 0)
                return;
            this.mRefCount++;
            if (this.mImage == null)
                this.mImage = new egret.Bitmap;
            layer.getDisplayNode().addChild(this.mImage);
            this.mImage.x = this.mCellX * layer.getCellW();
            this.mImage.y = this.mCellY * layer.getCellH();
            //加载图片，设置XY，根据flag设置翻转缩放
            var path = this.mMapMgr.getStaticImagePath(this.mImageId);
            if (path != "") {
                var textureMgr = core.TextureManager.getInstance();
                textureMgr.loadTextureAsyn(path, this);
                this.mPath = path;
                this.mMapMgr.addLoadingTileImage(this.mPath);
            }
        };
        MapTile.prototype.onTileLost = function (layer) {
            if (this.mRefCount == 0)
                return;
            this.mRefCount--;
            if (this.mRefCount == 0) {
                this.clearImage();
            }
        };
        MapTile.prototype.clearImage = function () {
            if (this.mImage && this.mImage.parent) {
                this.mImage.parent.removeChild(this.mImage);
                this.mImage.$setBitmapData(null);
            }
            if (this.mPath) {
                this.mMapMgr.removeLoadingTileImage(this.mPath);
                var textureMgr = core.TextureManager.getInstance();
                textureMgr.cancelTextureAsyn(this.mPath, this);
                this.mPath = null;
            }
        };
        MapTile.prototype.onAsynTextureSucceed = function (key, texture) {
            this.mImage.texture = texture; //显示图片
            if (this.mPath) {
                this.mMapMgr.removeLoadingTileImage(this.mPath);
            }
        };
        return MapTile;
    }(TClass));
    map.MapTile = MapTile;
    __reflect(MapTile.prototype, "map.MapTile", ["core.TextureCallback"]);
})(map || (map = {}));
var map;
(function (map) {
    var MapTileLayer = (function (_super) {
        __extends(MapTileLayer, _super);
        function MapTileLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mTempViewInfo = {};
            return _this;
        }
        MapTileLayer.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTileList = [];
        };
        MapTileLayer.prototype.destory = function () {
            this.clearAllTiles();
        };
        MapTileLayer.prototype.clearAllTiles = function () {
            this.mTileList.forEach(function (tile) {
                tile.deleteObj();
            });
            this.mTileList = [];
        };
        MapTileLayer.prototype.load = function (stream) {
            _super.prototype.load.call(this, stream);
            var cell_w = stream.readUnsignedInt();
            var cell_h = stream.readUnsignedInt();
            var cell_w_num = stream.readUnsignedInt();
            var cell_h_num = stream.readUnsignedInt();
            this.setCellWHAndNum(cell_w, cell_h, cell_w_num, cell_h_num);
            for (var y = 0; y < cell_h_num; ++y) {
                for (var x = 0; x < cell_w_num; ++x) {
                    var tile = this.getMapTile(x, y);
                    var imageNum = stream.readShort();
                    for (var idx = 0; idx < imageNum; idx++) {
                        var imageId = stream.readInt();
                        tile.setImageId(imageId);
                    }
                    var flag = stream.readInt();
                    tile.setFlag(flag); //翻转，缩放
                }
            }
            return true;
        };
        MapTileLayer.prototype.getMapTile = function (x, y) {
            TLog.Assert(x < this.cellNumW || x >= 0 || y < this.cellNumW || y >= 0, "getTile x:" + x + " y:" + y);
            var idx = x + y * this.cellNumW;
            var tile = this.mTileList[idx];
            if (tile == null) {
                tile = this.mTileList[idx] = map.MapTile.newObj(x, y);
            }
            return tile;
        };
        MapTileLayer.prototype.setCellWHAndNum = function (w, h, wnum, hnum) {
            this.clearAllTiles();
            this.cellSizeW = w;
            this.cellSizeH = h;
            this.cellNumW = wnum;
            this.cellNumH = hnum;
            this.mapSizeH = this.cellSizeH * this.cellNumH;
            this.mapSizeW = this.cellSizeW * this.cellNumW;
        };
        MapTileLayer.prototype.getCellW = function () {
            return this.cellSizeW;
        };
        MapTileLayer.prototype.getCellH = function () {
            return this.cellSizeH;
        };
        MapTileLayer.prototype.onEyeshotFound = function (nGridX, nGridY) {
            this.getVisibleCellInfo(nGridX, nGridY);
            var info = this.mTempViewInfo;
            for (var x = 0; x < info.xviewnum; x++) {
                for (var y = 0; y < info.yviewnum; y++) {
                    var xidx = info.xbegin + x;
                    var yidx = info.ybegin + y;
                    var tile = this.getMapTile(xidx, yidx);
                    tile.onTileFound(this);
                }
            }
        };
        MapTileLayer.prototype.onEyeshotLost = function (nGridX, nGridY) {
            this.getVisibleCellInfo(nGridX, nGridY);
            var info = this.mTempViewInfo;
            for (var x = 0; x < info.xviewnum; x++) {
                for (var y = 0; y < info.yviewnum; y++) {
                    var xidx = info.xbegin + x;
                    var yidx = info.ybegin + y;
                    var tile = this.getMapTile(xidx, yidx);
                    tile.onTileLost(this);
                }
            }
        };
        MapTileLayer.prototype.getVisibleCellInfo = function (nGridX, nGridY) {
            var gridRect = this.mLayerEyeshot.getGridRect(nGridX, nGridY);
            var info = this.mTempViewInfo = {};
            info.xbegin = map.FLOOR(gridRect.left / this.cellSizeW);
            info.ybegin = map.FLOOR(gridRect.top / this.cellSizeH);
            info.xviewnum = map.FLOOR((gridRect.width - 1) / this.cellSizeW) + 1;
            info.yviewnum = map.FLOOR((gridRect.height - 1) / this.cellSizeH) + 1;
        };
        return MapTileLayer;
    }(map.MapLayerBase));
    map.MapTileLayer = MapTileLayer;
    __reflect(MapTileLayer.prototype, "map.MapTileLayer");
})(map || (map = {}));
var Application = (function (_super) {
    __extends(Application, _super);
    function Application() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mLastTime = -1;
        return _this;
    }
    //private mLooper: GameLooper;
    Application.prototype.init = function (rootNode, stage) {
        this.mRootNode = rootNode;
        this.mStage = stage;
        //this.mLooper = new GameLooper();
        //覆盖函数
        OverrideEgretInit();
        OverrideEUIInit();
        map.MapManager.getInstance().init(this.mRootNode);
        gui.GuiManager.getInstance().init(this.mRootNode, this.mStage);
        this.mRootNode.addEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
        var initFunc = egret.getDefinitionByName("g_LaunchInit");
        TLog.Assert(typeof (initFunc) == "function");
        initFunc();
    };
    Application.prototype.stop = function () {
        this.mRootNode.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
    };
    Application.prototype.setFps = function (fps) {
        this.mStage.frameRate = fps;
    };
    Application.prototype.setDebug = function (b) {
    };
    Application.prototype.getRootNode = function () {
        return this.mRootNode;
    };
    Application.prototype.getStageNode = function () {
        return this.mStage;
    };
    // public isDeviceMobile(){
    // 	return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
    // }
    // public isDeviceWeb(){
    // 	return egret.MainContext.deviceType == egret.MainContext.DEVICE_PC;
    // }
    // public isRuntimeHtml5(){
    // 	return egret.Capabilities.runtimeType == egret.RuntimeType.WEB
    // }
    // public isRuntimeNative(){
    // 	return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE 
    // }
    Application.prototype.onUpdate = function () {
        //this.mLooper.onUpdate();
        var now = core.getCpuTime();
        if (this.mLastTime < 0) {
            this.mLastTime = now;
        }
        core.TimeStamp.DelayTime = now - this.mLastTime;
        core.TimeStamp.CurrentTime += core.TimeStamp.DelayTime;
        core.TimeStamp.CurrentFrame += 1;
        this.mLastTime = now;
        core.NetSystem.getInstance().onUpdate();
        map.MapManager.getInstance().onUpdate();
        gui.GuiManager.getInstance().onUpdate();
        map.LogicSpriteManager.getInstance().onUpdate();
        core.TextureManager.getInstance().onUpdate();
        core.ResGroupManager.getInstance().onUpdate();
        core.AutoreleasePool.getInstance().clear();
    };
    return Application;
}(TClass));
__reflect(Application.prototype, "Application");
var UserSettingMode;
(function (UserSettingMode) {
    UserSettingMode[UserSettingMode["Common"] = 0] = "Common";
    //User,	//账号目录
    UserSettingMode[UserSettingMode["Role"] = 1] = "Role"; //角色目录
})(UserSettingMode || (UserSettingMode = {}));
var UserSetting = (function (_super) {
    __extends(UserSetting, _super);
    function UserSetting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserSetting.prototype.initObj = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.mCommonName = "";
        //this.mUserName = "";
        this.mRoleName = "";
        this.mOperateType = -1;
        this.mStorgeCache = {};
    };
    UserSetting.prototype.setOperationType = function (type) {
    };
    UserSetting.prototype.setRoleName = function (name) {
        this.mRoleName = name;
    };
    UserSetting.prototype.setCommonSetting = function (type, key, value) {
        this._setSetttingStorage(UserSettingMode.Common, type, key, value);
    };
    UserSetting.prototype.getCommonSetting = function (type, key, def) {
        return this._getSettingStorage(UserSettingMode.Common, type, key, def);
    };
    UserSetting.prototype.setRoleSetting = function (type, key, value) {
        this._setSetttingStorage(UserSettingMode.Role, type, key, value);
    };
    UserSetting.prototype.getRoleSetting = function (type, key, def) {
        return this._getSettingStorage(UserSettingMode.Role, type, key, def);
    };
    UserSetting.prototype._setSetttingStorage = function (mode, type, key_, value) {
        var key = this._getKeyName(mode, key_);
        var cacheVal = this.mStorgeCache[key];
        if (cacheVal != value) {
            try {
                egret.localStorage.setItem(key, value);
            }
            catch (e) {
            }
        }
        this.mStorgeCache[key] = value;
    };
    UserSetting.prototype._getSettingStorage = function (mode, type, key_, defValue) {
        var key = this._getKeyName(mode, key_);
        var value = this.mStorgeCache[key];
        if (value == null) {
            try {
                value = egret.localStorage.getItem(key);
            }
            catch (e) {
                value = null;
            }
            this.mStorgeCache[key] = value;
        }
        if (value === null || value === "") {
            this.mStorgeCache[key] = defValue;
            return defValue;
        }
        // if(type == UserSetting.TYPE_STRING){
        // 	return value;
        // }else 
        if (type == UserSetting.TYPE_NUMBER) {
            return Number(value).valueOf();
        }
        else if (type == UserSetting.TYPE_BOOLEAN) {
            if (value === false || value == "false" || value == "0") {
                return false;
            }
            else {
                return true;
            }
        }
        return value;
    };
    UserSetting.prototype._getKeyName = function (mode, key_) {
        var key = key_;
        if (UserSettingMode.Role == mode) {
            if (this.mRoleName == "") {
                TLog.Error("UserSetting RoleName is empty. key:%s", key);
            }
            key = key + this.mRoleName;
        }
        return key;
    };
    UserSetting.TYPE_STRING = 0; //字符串
    UserSetting.TYPE_NUMBER = 1; //number
    UserSetting.TYPE_BOOLEAN = 2; //布尔
    return UserSetting;
}(TClass));
__reflect(UserSetting.prototype, "UserSetting");
// TypeScript file
var core;
(function (core) {
    var ResGroupManager = (function (_super) {
        __extends(ResGroupManager, _super);
        function ResGroupManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResGroupManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mResGroupList = [];
            this.mGroupCallbackMap = {};
        };
        ResGroupManager.prototype.destory = function () {
            for (var _i = 0, _a = this.mResGroupList; _i < _a.length; _i++) {
                var group = _a[_i];
                group.deleteObj();
            }
            this.mResGroupList = null;
        };
        ResGroupManager.prototype.getGroup = function (groupName, autoCreate) {
            for (var _i = 0, _a = this.mResGroupList; _i < _a.length; _i++) {
                var group_1 = _a[_i];
                if (group_1.name == groupName) {
                    return group_1;
                }
            }
            autoCreate = !!autoCreate;
            if (autoCreate == false)
                return null;
            var group = core.ResGroup.newObj(this);
            group.name = groupName;
            this.mResGroupList.push(group);
            return group;
        };
        ResGroupManager.prototype.addGroupConfig = function (groupName, path, type) {
            var group = this.getGroup(groupName, true);
            group.addResItemConfig(path, type);
        };
        ResGroupManager.prototype.loadGroup = function (groupName, callback) {
            var group = this.getGroup(groupName);
            if (group == null)
                return;
            //TLog.Assert(group != null)
            if (callback) {
                var cbList = this.mGroupCallbackMap[groupName];
                if (cbList == null) {
                    cbList = this.mGroupCallbackMap[groupName] = [];
                }
                if (cbList.indexOf(callback) != -1) {
                    return;
                }
                cbList.push(callback);
            }
            group.load();
        };
        ResGroupManager.prototype.unLoadGroup = function (groupName) {
            var group = this.getGroup(groupName);
            if (group == null)
                return;
            group.unload();
        };
        ResGroupManager.prototype.cancelGroup = function (groupName) {
            delete this.mGroupCallbackMap[groupName];
        };
        ResGroupManager.prototype._onGroupLoad = function (groupName) {
            var cbList = this.mGroupCallbackMap[groupName];
            if (cbList) {
                cbList.forEach(function (cb) {
                    cb.onResGroupLoad(groupName);
                });
                delete this.mGroupCallbackMap[groupName];
            }
        };
        ResGroupManager.prototype.onUpdate = function () {
            for (var _i = 0, _a = this.mResGroupList; _i < _a.length; _i++) {
                var group = _a[_i];
                group.onUpdate();
            }
        };
        return ResGroupManager;
    }(TClass));
    core.ResGroupManager = ResGroupManager;
    __reflect(ResGroupManager.prototype, "core.ResGroupManager");
})(core || (core = {}));
// TypeScript file
var map;
(function (map) {
    var SpriteType;
    (function (SpriteType) {
        SpriteType[SpriteType["TYPE_BONE_SPRITE"] = 0] = "TYPE_BONE_SPRITE";
        SpriteType[SpriteType["TYPE_FRMAE_SPRITE"] = 1] = "TYPE_FRMAE_SPRITE";
    })(SpriteType = map.SpriteType || (map.SpriteType = {}));
    var AnimReportFlag;
    (function (AnimReportFlag) {
        AnimReportFlag[AnimReportFlag["ANIM_NOTIFY"] = 262144] = "ANIM_NOTIFY";
        AnimReportFlag[AnimReportFlag["BOUND_NOTIFY"] = 524288] = "BOUND_NOTIFY";
    })(AnimReportFlag = map.AnimReportFlag || (map.AnimReportFlag = {}));
    ;
    var ModelLoadState;
    (function (ModelLoadState) {
        ModelLoadState[ModelLoadState["eLoaded"] = 0] = "eLoaded";
        ModelLoadState[ModelLoadState["eUnLoaded"] = 1] = "eUnLoaded";
        ModelLoadState[ModelLoadState["eLoading"] = 2] = "eLoading";
        ModelLoadState[ModelLoadState["eUnLoading"] = 3] = "eUnLoading";
    })(ModelLoadState = map.ModelLoadState || (map.ModelLoadState = {}));
    var SpriteAnimEvent = (function (_super) {
        __extends(SpriteAnimEvent, _super);
        function SpriteAnimEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteAnimEvent.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        SpriteAnimEvent.prototype.destory = function () {
        };
        SpriteAnimEvent.AnimEvent = "AnimEvent";
        return SpriteAnimEvent;
    }(core.EventArgs));
    map.SpriteAnimEvent = SpriteAnimEvent;
    __reflect(SpriteAnimEvent.prototype, "map.SpriteAnimEvent");
    var SpriteEvent = (function (_super) {
        __extends(SpriteEvent, _super);
        function SpriteEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteEvent.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
        };
        SpriteEvent.prototype.destory = function () {
        };
        SpriteEvent.BoundSizeEvent = "BoundSizeEvent";
        return SpriteEvent;
    }(core.EventArgs));
    map.SpriteEvent = SpriteEvent;
    __reflect(SpriteEvent.prototype, "map.SpriteEvent");
    var SpriteDisplayNodeType;
    (function (SpriteDisplayNodeType) {
        SpriteDisplayNodeType[SpriteDisplayNodeType["eDisplayNode_UI"] = 0] = "eDisplayNode_UI";
        SpriteDisplayNodeType[SpriteDisplayNodeType["eDisplayNode_Shadow"] = 1] = "eDisplayNode_Shadow";
        SpriteDisplayNodeType[SpriteDisplayNodeType["eDisplayNode_Unknown"] = 2] = "eDisplayNode_Unknown";
    })(SpriteDisplayNodeType = map.SpriteDisplayNodeType || (map.SpriteDisplayNodeType = {}));
    ;
})(map || (map = {}));
var map;
(function (map) {
    var LogicSpriteManager = (function (_super) {
        __extends(LogicSpriteManager, _super);
        function LogicSpriteManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //mTempEvent:ModelResouceEvent;
        LogicSpriteManager.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mSpriteList = [];
            this.mRelaseSpriteList = [];
            this.mModelInfoMap = {};
            this.mSkeletonResourceMap = {};
            this.mTextureResourceMap = {};
            //dragonBones.BaseObject.setMaxCount(null, 0);
            this.mUnloadingResourceList = [];
            this.mDisposeTime = 5000;
        };
        LogicSpriteManager.prototype.destory = function () {
            for (var _i = 0, _a = this.mRelaseSpriteList; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.release();
            }
            this.mRelaseSpriteList.length = 0;
            this.mSpriteList.forEach(function (sprite) {
                sprite.deleteObj();
            });
            this.mSpriteList.length = 0;
            this.mUnloadingResourceList.length = 0;
            /*modify:yangguiming屏蔽骨骼动画
            for (var k in this.mSkeletonResourceMap) {
                var skeRes: BoneSpriteSkletonResource = this.mSkeletonResourceMap[k];
                skeRes.deleteObj();
            }
            this.mSkeletonResourceMap = {};

            for (var k in this.mTextureResourceMap) {
                var texRes: BoneSpriteTextureResource = this.mTextureResourceMap[k];
                texRes.deleteObj();
            }
            this.mSkeletonResourceMap = {};
            */
        };
        LogicSpriteManager.prototype.createSprite = function (type) {
            /*modify:yangguiming屏蔽骨骼动画
                var sprite = null;
                if(type == SpriteType.TYPE_BONE_SPRITE){
                    sprite = BoneSprite.createObj();
                }else if(type == SpriteType.TYPE_FRMAE_SPRITE){
                    sprite = FrameSprite.createObj();
                }
            */
            var sprite = sprite = map.FrameSprite.createObj();
            this.mSpriteList.push(sprite);
            return sprite;
        };
        LogicSpriteManager.prototype.removeSprite = function (sprite) {
            var idx = this.mSpriteList.indexOf(sprite);
            if (idx != -1) {
                this.mSpriteList.splice(idx, 1);
                //sprite.delete();
            }
        };
        // releaseSpriteLater(sprite: LogicSprite){
        // 	if(sprite == null)
        // 		return;
        // 	if(this.mRelaseSpriteList.indexOf(sprite) != -1)
        // 		return
        // 	sprite.retain();
        // 	this.mRelaseSpriteList.push(sprite);
        // }
        LogicSpriteManager.prototype.defineModelPath = function (modelName, path, isbin) {
            if (!modelName || !path) {
                return;
            }
            var info = {};
            info.modelName = modelName;
            info.path = path;
            info.isbin = isbin;
            this.mModelInfoMap[modelName] = info;
        };
        /*modify:yangguiming屏蔽骨骼动画
        ///////////////////////////////////////////////////////////////////////////
        getBoneSkeletonResource(modelName: string): BoneSpriteSkletonResource {
            var info = this.mModelInfoMap[modelName];
            //TLog.Assert(!path, "loadResouce:" + modelName);
            if (modelName == null || info == null) {
                return null;
            }

            var res: BoneSpriteSkletonResource = this.mSkeletonResourceMap[modelName];
            if (res == null) {
                //res = new LogicSpriteResource(modelName, info, this);
                //this.mModelResourceMap[modelName] = res;
                res = BoneSpriteSkletonResource.newObj(modelName, info, this);
                this.mSkeletonResourceMap[modelName] = res;
            }
            return res;
        }

        getBoneTextureResource(modelName): BoneSpriteTextureResource {
            var info = this.mModelInfoMap[modelName];
            //TLog.Assert(!path, "loadResouce:" + modelName);
            if (modelName == null || info == null) {
                return null;
            }

            var res: BoneSpriteTextureResource = this.mTextureResourceMap[modelName];
            if (res == null) {
                res = BoneSpriteTextureResource.newObj(modelName, info, this);
                this.mTextureResourceMap[modelName] = res;
            }
            return res;
        }
        */
        ///////////////////////////////////////////////////////////////////////////
        //帧动画图片资源
        LogicSpriteManager.prototype.getFrameTextureResource = function (modelName) {
            var info = this.mModelInfoMap[modelName];
            //TLog.Assert(!path, "loadResouce:" + modelName);
            if (modelName == null || info == null) {
                return null;
            }
            var res = this.mTextureResourceMap[modelName];
            if (res == null) {
                res = map.FrameSpriteTextureResource.newObj(modelName, info, this);
                this.mTextureResourceMap[modelName] = res;
            }
            return res;
        };
        LogicSpriteManager.prototype.getFrameSpriteInfoResource = function (modelName) {
            var info = this.mModelInfoMap[modelName];
            //TLog.Assert(!path, "loadResouce:" + modelName);
            if (modelName == null || info == null) {
                return null;
            }
            var res = this.mSkeletonResourceMap[modelName];
            if (res == null) {
                //res = new LogicSpriteResource(modelName, info, this);
                //this.mModelResourceMap[modelName] = res;
                res = map.FrameSpriteInfoResource.newObj(modelName, info, this);
                this.mSkeletonResourceMap[modelName] = res;
            }
            return res;
        };
        ///////////////////////////////////////////////////////////////////////////
        LogicSpriteManager.prototype.addUnloadingResource = function (res) {
            if (this.mUnloadingResourceList.indexOf(res) != -1)
                return;
            TLog.Assert(res.mUnLoadBeginTime == -1);
            res.mUnLoadBeginTime = core.TimeStamp.CurrentTime;
            this.mUnloadingResourceList.push(res);
        };
        LogicSpriteManager.prototype.removeUnloadingResource = function (res) {
            var index = this.mUnloadingResourceList.indexOf(res);
            if (index == -1)
                return;
            this.mUnloadingResourceList.splice(index, 1);
        };
        LogicSpriteManager.prototype.setAutoDisposeTime = function (disposeTime) {
            TLog.Assert(disposeTime >= 0);
            this.mDisposeTime = disposeTime;
        };
        LogicSpriteManager.prototype.cleanUpCacheRes = function () {
            this.onUpdate(true);
        };
        LogicSpriteManager.prototype.onUpdate = function (bForce) {
            // if(this.mRelaseSpriteList.length > 0){
            // 	for(let sprite of this.mRelaseSpriteList){
            // 		sprite.release()
            // 	}
            // 	this.mRelaseSpriteList.length = 0;
            // }
            var _this = this;
            if (bForce === void 0) { bForce = false; }
            if (this.mUnloadingResourceList.length > 0) {
                var disposeList = [];
                var validTime = core.TimeStamp.CurrentTime - this.mDisposeTime;
                for (var _i = 0, _a = this.mUnloadingResourceList; _i < _a.length; _i++) {
                    var res = _a[_i];
                    if (bForce || res.mUnLoadBeginTime > 0 && res.mUnLoadBeginTime < validTime) {
                        disposeList.push(res);
                    }
                }
                if (disposeList.length > 0) {
                    disposeList.forEach(function (res) {
                        _this.removeUnloadingResource(res);
                        res.unloadImp();
                    });
                }
            }
        };
        return LogicSpriteManager;
    }(core.EventSet));
    map.LogicSpriteManager = LogicSpriteManager;
    __reflect(LogicSpriteManager.prototype, "map.LogicSpriteManager");
})(map || (map = {}));
var map;
(function (map) {
    var SortSpriteLayer = (function (_super) {
        __extends(SortSpriteLayer, _super);
        function SortSpriteLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SortSpriteLayer.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            //this.mCacheRenderObject = [];
            this.mCacheHashCodeList = [];
        };
        SortSpriteLayer.prototype.destory = function () {
        };
        SortSpriteLayer.prototype.onRenderSpriteList = function (cam) {
            var _this = this;
            _super.prototype.onRenderSpriteList.call(this, cam);
            var length = this.mRenderObjectList.length;
            if (length == 0)
                return;
            this.mRenderObjectList.sort(function (a, b) {
                //优先上下排序，如果一致则左右排序
                var result = a.getPositionY() - b.getPositionY();
                if (result == 0) {
                    result = a.getPositionX() - b.getPositionX();
                }
                return result;
            });
            var bSortList = false;
            if (length != this.mCacheHashCodeList.length) {
                bSortList = true;
            }
            else {
                for (var i = 0; i < length; i++) {
                    var cacheCode = this.mCacheHashCodeList[i];
                    var objCode = this.mRenderObjectList[i].hashCode;
                    if (cacheCode != objCode) {
                        bSortList = true;
                        break;
                    }
                }
            }
            if (!bSortList)
                return;
            this.mCacheHashCodeList.length = 0;
            var index = 0;
            var layerNode = this.getDisplayNode();
            this.mRenderObjectList.forEach(function (obj) {
                var objNode = obj.getDisplayNode();
                if (objNode.parent == layerNode) {
                    layerNode.setChildIndex(objNode, index);
                }
                index++;
                _this.mCacheHashCodeList.push(obj.hashCode);
            });
        };
        return SortSpriteLayer;
    }(map.SpriteLayer));
    map.SortSpriteLayer = SortSpriteLayer;
    __reflect(SortSpriteLayer.prototype, "map.SortSpriteLayer");
})(map || (map = {}));
var core;
(function (core) {
    var ResItem = (function (_super) {
        __extends(ResItem, _super);
        function ResItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResItem.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mKey = params[0];
            this.mPath = params[1];
            this.mData = params[2];
            this.mFromZip = !!params[3];
        };
        ResItem.prototype.destory = function () {
            if (this.mFromZip == false)
                core.ResManager.getInstance().destroyRes(this.mPath);
            this.mData = null;
            core.ResManager.getInstance().clearResPath(this.mPath);
        };
        ResItem.prototype.getKey = function () {
            return this.mKey;
        };
        ResItem.prototype.getData = function () {
            return this.mData;
        };
        return ResItem;
    }(TClass));
    core.ResItem = ResItem;
    __reflect(ResItem.prototype, "core.ResItem");
})(core || (core = {}));
/*modify:yangguiming屏蔽骨骼动画
module map {

    export class BoneSprite extends map.LogicSprite {

        // mLogicInfo: any;
        // mLogicFlags: number;

        // mRootNode: egret.DisplayObjectContainer;
        mArmatureDisplay: dragonBones.EgretArmatureDisplay;

        // mSpriteMgr: LogicSpriteManager;
        // //mCurrentResouce:LogicSpriteResource;

        mSkletonResource: BoneSpriteSkletonResource;
        mTextureResource: BoneSpriteTextureResource;
        mTextureChanged: boolean;


        // mParentSprite: LogicSprite;
        // mChildSpriteList: LogicSprite[];
        // mChildAddInfoList: any[];
        // //mChildRemoveInfoList:any[];

        // m_bFlipX:boolean;
        // m_bFlipY:boolean;
        // mFlipXFlag:number;
        // mFlipYFlag:number;

        // m_bMirror:boolean;
        // mPersScale:number;
        // mScale:number;

        // mAlpha:number;
        // mMaskAlpha:number;

        // mRotate:number;

        // mBoundRect:egret.Rectangle;
        // mBoundActionId:string; //包围盒根据actionId设置
        // mBoundModelChanged:boolean;

        // mDisplayeNodeList:egret.DisplayObject[];
        // //mAddNodeSlots : dragonBones.Slot[]; //挂接的slot，因为龙骨每次换动画都把displayeIndex清-1，所以每次换动作，都重新重置为0

        // mbUpdateAnimAlways:boolean; //任何时候都更新动画

        dynamicSlotDataList:dragonBones.SlotData[];

        // mPartSkinInfoList: any[];

        // mAnimEvent:SpriteAnimEvent;

        public initObj(...params: any[]) {
            
            // this.mSpriteMgr.addEventListener(ModelResouceEvent.EVENT_MODEL_LOAD, this.onResLoad, this);
            // this.mSpriteMgr.addEventListener(ModelResouceEvent.EVENT_MODEL_UNLOAD, this.onResUnLoad, this);
            this.mSkletonResource = null;
            this.mTextureResource = null;

            this.dynamicSlotDataList = [];

        }

        destory() {
            this._clearArmature();
            this._unLoadSkeletonResource();
            this._unLoadTextureResource();

            this.dynamicSlotDataList.forEach(v=>{
                v.returnToPool();
            })
            this.dynamicSlotDataList = null;

        }


        public _loadTextureResource() {
            if (this.mTextureResource == null) {
                var modelName = this.getModelName();
                if (modelName != "") {

                    this.mTextureResource = this.mSpriteMgr.getBoneTextureResource(modelName);
                    if (this.mTextureResource == null) {
                        TLog.Error("_loadTextureResource:" + modelName);
                        return;
                    }

                    this.mTextureResource.load();
                    this._setFlags(LogicSpriteFlags.InvalidTexture);
                }

            }
        }

        public _unLoadTextureResource() {
            if (this.mTextureResource) {
                this.mTextureResource.unload();
                this.mTextureResource = null;
            }
            this._removeFlags(LogicSpriteFlags.InvalidTexture);

            if(this.mArmatureDisplay)
                this._updateSlotDisplay(true)
        }

        public _loadSkeletonResource() {
            if (this.mSkletonResource == null) {
                var modelName = this.getModelName();
                if (modelName != "") {

                    this.mSkletonResource = this.mSpriteMgr.getBoneSkeletonResource(modelName);
                    if (this.mSkletonResource == null) {
                        TLog.Error("_loadSkeletonResource:" + modelName);
                        return;
                    }

                    this.mSkletonResource.load();
                }

            }
        }

        public _unLoadSkeletonResource() {
            if (this.mSkletonResource) {
                this.mSkletonResource.unload();
                this.mSkletonResource = null;
            }
        }


        private onFrameEvent(event: dragonBones.EgretEvent): void {

            var eventName = event.eventObject.name ? event.eventObject.name : ""
            this._fireAnimEvent(eventName);
        }

        private onAnimationEvent(event: dragonBones.EgretEvent): void {

            if (event.type == dragonBones.EventObject.START) {

                this._fireAnimEvent("begin");
            } else if (event.type == dragonBones.EventObject.LOOP_COMPLETE) {

                this._fireAnimEvent("end");
                this._fireAnimEvent("turn");
            } else if (event.type == dragonBones.EventObject.COMPLETE) {

                this._fireAnimEvent("end");
            }


            //this.fireEvent()
            //TLog.Debug(event.eventObject.animationState.name, event.type, event.eventObject.name ? event.eventObject.name : "");
        }

        

        private _createArmature() {
            TLog.Assert(this.mArmatureDisplay == null && this.mSkletonResource != null);


            this.mArmatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay(this.getModelName());

            TLog.Assert(this.mArmatureDisplay != null, "buildArmatureDisplay failded %s", this.getModelName())

            this.mRootNode.addChildAt(this.mArmatureDisplay, 0);

            this.mArmatureDisplay.addEventListener(dragonBones.EventObject.START, this.onAnimationEvent, this);
            this.mArmatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onAnimationEvent, this);

            this.mArmatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrameEvent, this);
            this.mArmatureDisplay.disableBatch();

            //this.mArmatureDisplay.armature.cacheFrameRate = 24;

            this._updateAlpha();
            this._updateScale();
            this._updateRotate();
            //this.mArmatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationEvent, this);
            // this.mArmatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN, this.onAnimationEvent, this);
            // this.mArmatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this.onAnimationEvent, this);
            // this.mArmatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT, this.onAnimationEvent, this);
            // this.mArmatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this.onAnimationEvent, this);
            // Test frame event
        }

        private _clearArmature() {
            if (this.mArmatureDisplay) {
                this.mRootNode.removeChild(this.mArmatureDisplay);
                this.mArmatureDisplay.dispose();
                this.mArmatureDisplay = null;

                //this.mAddNodeSlots.length = 0;
            }
        }


        private _updateAnimation(): void {
            //播放动作
            if (this._hasFlags(LogicSpriteFlags.InvalidActionId)) {
                this._removeFlags(LogicSpriteFlags.InvalidActionId);
                this._removeFlags(LogicSpriteFlags.InvalidLoop);

                var actionId = this.mLogicInfo[LogicSpriteKey.ActionId];

                if(actionId == "" || actionId == null){
                    this.mArmatureDisplay.animation.play(null, this.getLoopCount());
                }else{
                    this.mArmatureDisplay.animation.play(actionId, this.getLoopCount());
                }
                this.mArmatureDisplay.animation.timeScale = this.getAnimSpeed();

                //重新更新一次
                // for(var i = 0; i < this.mAddNodeSlots.length; i++){
                // 	var slot = this.mAddNodeSlots[i];
                // 	slot.displayIndex = 0;
                // }
            }
            //播放速度
            if (this._hasFlags(LogicSpriteFlags.InvalidAnimSpeed)) {
                this._removeFlags(LogicSpriteFlags.InvalidAnimSpeed);
                this.mArmatureDisplay.animation.timeScale = this.getAnimSpeed();
            }

            //暂停
            if (this._hasFlags(LogicSpriteFlags.InvalidPause)) {
                this._removeFlags(LogicSpriteFlags.InvalidPause);
                var bPause = this.isPause();
                if (bPause) {
                    this.mArmatureDisplay.animation.stop();
                } else {
                    this.mArmatureDisplay.animation.play();
                }
            }

        }


        private _getTextureData(textureName: string): dragonBones.TextureData {
            var name = this.getModelName();
            var textureAtlasDataList: dragonBones.TextureAtlasData[] = dragonBones.EgretFactory.factory.getTextureAtlasData(name);
            if (textureAtlasDataList) {
                for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    var textureData = textureAtlasDataList[i].getTexture(textureName);
                    if (textureData) {
                        TLog.Assert(textureData.parent != null)
                        return textureData;
                    }
                }
            }

            return null;
        }

        private _updateSlotDisplay(isDelete?:boolean){

            isDelete = !!isDelete;

            //重新刷新一次slot的displayData.texture
            var slots: dragonBones.Slot[] = this.mArmatureDisplay.armature.getSlots();
            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];

                var slotDisplayDataSet = slot._displayDatas;
                for (let i = 0, l = slotDisplayDataSet.length; i < l; ++i) {
                    const displayData = slotDisplayDataSet[i];
                    if (displayData instanceof dragonBones.ImageDisplayData) {
                        displayData.texture = this._getTextureData(displayData.path);
                    }
                }

                // if(isDelete){//資源刪除后，需要把displayIndex=-1
                // 	slot.displayIndex = -1;
                // }

                //主要是为了刷新slot._textureData
                let _slot = <any>slot;
                _slot._textureData = null;
                _slot._displayData = null;
                _slot._updateDisplayData();
            }

            this.mArmatureDisplay.armature.invalidUpdate(null, true);
            this.mArmatureDisplay.armature.advanceTime(0);

            // if(isDelete == false){
            // 	this._setFlags(LogicSpriteFlags.InvalidActionId)
            // 	this._updateAnimation();
            // }
            //this.mArmatureDisplay.armature.advanceTime(0);
        }

        private _updateTexture() {
            if (this.mTextureResource && this.mTextureResource.isLoaded()) {
                if (this._hasFlags(LogicSpriteFlags.InvalidTexture)) {
                    this._removeFlags(LogicSpriteFlags.InvalidTexture)

                    //更新插槽图片
                    this._updateSlotDisplay();
                }
            }
        }

        private _updateBound(){
            if(this.mBoundModelChanged == false){
                return
            }

            if (this.mTextureResource == null || this.mTextureResource.isLoaded() == false)
                return

            this.mBoundModelChanged = false;

            //如果设置了指定actionId的包围盒，则需要先设一次指定actionID，再复原
            let bHandleBound = false;
            let animation = this.mArmatureDisplay.animation;
            if(this.mBoundActionId != "" && this.mBoundActionId != animation.lastAnimationName && animation.hasAnimation(this.mBoundActionId)){
                animation.play(this.mBoundActionId)
                this.mArmatureDisplay.armature.advanceTime(0);
                bHandleBound = true;
            }

            //更新包围盒
            let node = this.getDisplayNode()
            this.mArmatureDisplay.getTransformedBounds(node, this.mBoundRect );
            this._fireBoundEvent()

            if(bHandleBound){
                this._setFlags(LogicSpriteFlags.InvalidActionId)
                this._updateAnimation();
            }
        }


        private _updatePartSkin(slotName:string, replaceSkinPath:string){
            var factory = dragonBones.EgretFactory.factory;
            let armature = this.mArmatureDisplay.armature;
            let slot = armature.getSlot(slotName);
            if(slot == null){
                TLog.Error("changePartSkin slot:%s not exist!", slotName)
                return;
            }

            let modelName = this.getModelName();
            let dragonBonesData = factory.getDragonBonesData(modelName);

            let paths = replaceSkinPath.split("/");
            if(paths.length != 2){
                TLog.Error("changePartSkin replaceSkinPath paths:%s error!", replaceSkinPath)
            }
            //检查替换皮肤的slot是否存在
            let skinArmatrueName = paths[0];
            let skinSlotName = paths[1];
            let skinArmatrue = dragonBonesData.getArmature(skinArmatrueName)
            if(skinArmatrue == null ||  skinArmatrue.defaultSkin.getDisplays(skinSlotName) == null){
                TLog.Error("changePartSkin no skinSlot exsit path:%s", replaceSkinPath);
                return;
            }
            //用指定资源替换指定插槽的显示对象。(用 "dragonBonesName/armatureName/slotName" 的资源替换 "slot" 的显示对象)
            factory.replaceSlotDisplayList(modelName, skinArmatrueName, skinSlotName, slot);
        }



        private _updateSkin(){
            if (this._hasFlags(LogicSpriteFlags.InvalidSkin)) {
                this._removeFlags(LogicSpriteFlags.InvalidSkin);

                do{

                    let skinArmatrueName = this.getSkinName()
                    if(skinArmatrueName == "")
                        break;

                    let factory = dragonBones.EgretFactory.factory;
                    let armature = this.mArmatureDisplay.armature;

                    let modelName = this.getModelName();
                    let dragonBonesData = factory.getDragonBonesData(modelName);

                    let skinArmatrue = dragonBonesData.getArmature(skinArmatrueName)
                    if(skinArmatrue == null ){
                        TLog.Error("_updateSkin no skin exsit... path:%s", skinArmatrueName);
                        return;
                    }
                    factory.changeSkin(armature, skinArmatrue.defaultSkin)
                }while(false)

            }


            if(this.mPartSkinInfoList.length > 0){
                this.mPartSkinInfoList.forEach(v=>{
                    this._updatePartSkin(v.slotName, v.replaceSkinPath);
                })
                this.mPartSkinInfoList.length = 0;
            }

        }


        private _createDynamicSlotData(name:string, parent:dragonBones.BoneData):dragonBones.SlotData{
            for(let v of this.dynamicSlotDataList){
                if(v.name == name)
                    return v;
            }
            const slot = dragonBones.DragonBones.webAssembly ? new Module["SlotData"]() as dragonBones.SlotData : dragonBones.BaseObject.borrowObject(dragonBones.SlotData);
            slot.displayIndex = 0;
            slot.zOrder = 0;
            slot.name = name;
            slot.parent = parent
            slot.color = dragonBones.DragonBones.webAssembly ? Module["SlotData"].DEFAULT_COLOR : dragonBones.SlotData.DEFAULT_COLOR;
            this.dynamicSlotDataList.push(slot);

            return slot;
        }


        private _addChidNode(boneName: string, sprite: LogicSprite, order: number, bTransform?: boolean): void {
            TLog.Assert(sprite instanceof BoneSprite)

            var bAddToRoot = true;
            // if(order < 0 ){
            // 	order = 0;
            // }

            do {
                if (boneName != "" && boneName != null) {
                    var armature: dragonBones.Armature = this.mArmatureDisplay.armature;
                    let boneData = armature.armatureData.getBone(boneName);
                    if(boneData == null){
                        TLog.Error("_addChidNode %s does not have boneData:%s", this.getModelName(), boneName)
                        break;
                    }

                    let dynamicSlotName = boneName + "_background" //背景slot
                    if(order > 0){
                        dynamicSlotName = boneName + "_foreground"  //前景slot
                    }

                    var slot: dragonBones.Slot = armature.getSlot(dynamicSlotName);
                    //动态创建插槽
                    if(slot == null){
                        let slotData = this._createDynamicSlotData(dynamicSlotName, boneData);
                        slot = dragonBones.BaseObject.borrowObject(dragonBones.EgretSlot);
                        slot.init(
                            slotData,
                            [],
                            new egret.Bitmap(),
                            new egret.Mesh()
                        );
                        slot._setDisplayList([]);

                        //调整slot的顺序
                        // if (isNaN(order) == false) {
                        slot._setZorder(order);
                        // }
                        armature.addSlot(slot, boneName);
                    }

                    //var slots :dragonBones.Slot[] =armature.getSlots();
                    if (slot == null)
                        break;

                    if (slot.display == null) {
                        slot.display = new egret.DisplayObjectContainer();
                        this.mArmatureDisplay.armature.invalidUpdate(boneName, true);//骨骼位置变换更新
                        this.mArmatureDisplay.armature.advanceTime(0);

                        //slot.displayIndex = 0;
                    }

                    if(!( slot.display instanceof egret.DisplayObjectContainer )){
                        TLog.Error("slot:%s is not DisplayObjectContainer", dynamicSlotName);
                        break;
                    }

                    var container: egret.DisplayObjectContainer = slot.display;
                    container.addChild(sprite.getDisplayNode());

                    // if(this.mAddNodeSlots.indexOf(slot) == -1){
                    // 	this.mAddNodeSlots.push(slot);
                    // }
                    bAddToRoot = false;
                }

            } while (false);


            if (bAddToRoot) {
                sprite.setPersScale(this.getPersScale())
                this.mRootNode.addChildAt(sprite.getDisplayNode(), order);
            }

            this.mChildSpriteList.push(sprite);
            sprite.retain();
        }

        

        //=========================begin 继承SpriteBase===========================
        public onCameraFound(): void {
            super.onCameraFound();
            this._loadTextureResource();
            if(this.mArmatureDisplay ){
                this.mArmatureDisplay.armature.clock = dragonBones.EgretFactory.clock;
            }
        }

        public onCameraLost(): void {
            super.onCameraLost();
            this._unLoadTextureResource();
            if(this.mArmatureDisplay && this.mbUpdateAnimAlways == false){
                this.mArmatureDisplay.armature.clock = null;
            }
        }


        protected onMoveDirChange(dirIndex: number):boolean {
            //程序设定资源是向右,0度向右
            //如果资源是向左的，就需要镜像处理下

            let leftDirs = [0, 1, 6, 7]
            let bRight = leftDirs.indexOf(dirIndex) != -1

            if(this.mArmatureDisplay == null){
                return false;
            }

            var handle = 0;
            if (bRight) {
                //向右
                if (this.m_bMirror)
                    handle++;
            }
            else {
                //向左
                handle++
                if (this.m_bMirror)
                    handle++;
            }

            if(this.m_bFlipX)
                handle++;


            this.mFlipXFlag = (handle %2 == 1)? -1: 1;
            this.mFlipYFlag = (this.m_bFlipY)? -1: 1;

            this._updateScale();
            return true;
        }
        //=========================end 继承SpriteBase===========================

        //===============================start 子类继承实现===========================
        protected _updateAlpha(){
            if(this.mArmatureDisplay){
                this.mArmatureDisplay.alpha = (this.mAlpha / 255) * (this.mMaskAlpha /255);
            }
        }

        protected _updateScale(){
            if(this.mArmatureDisplay){
                var s = this.mPersScale * this.mScale
                this.mArmatureDisplay.scaleX = s * this.mFlipXFlag;
                this.mArmatureDisplay.scaleY = s * this.mFlipYFlag;
            }
        }


        protected _updateRotate():void{
            if(this.mArmatureDisplay){
                this.mArmatureDisplay.rotation = this.mRotate;
            }
        }

        protected _updateModel() {
            if (this._hasFlags(LogicSpriteFlags.InvalidModelName)) {
                this._removeFlags(LogicSpriteFlags.InvalidModelName);

                this.mBoundModelChanged = true;

                this._clearArmature();
                this._unLoadSkeletonResource();
                this._unLoadTextureResource();

                this._loadSkeletonResource();

                if(!this.isClip())
                    this._loadTextureResource();
            }

            if (this.mSkletonResource == null || this.mSkletonResource.isLoaded() == false) {
                return;
            }

            // if(this.mTextureResource == null || this.mTextureResource.isLoaded() == false ){
            // 	return;
            // }

            if (this.mArmatureDisplay == null) {
                this._createArmature();
                this.setDirChange();
            }

            this._updateAnimation();

            this._updateTexture();

            this._updateBound()

            this._updateSkin()


            if (this.isEnterMap() == true){
                this._updateMask();
            }
            
            //如果已经加载成功，则把信息加到childlist
            if (this.mArmatureDisplay) {
                var addlen = this.mChildAddInfoList.length;
                if (addlen > 0) {
                    for (var i = 0; i < addlen; i++) {
                        var info = this.mChildAddInfoList[i];
                        this._addChidNode(info.slot, info.sprite, info.order, info.bTransform);
                        info.sprite.release();
                    }
                    this.mChildAddInfoList.length = 0;
                }
            }

        }

        
        public hasActionId(actionId:string) {
            if(this.mArmatureDisplay == null)
                return false;
            let armature = this.mArmatureDisplay.armature;
            return armature.animation.animationNames.indexOf(actionId) != -1
        }


        //===============================end 子类继承实现===========================


    }

}

*/ 
/*modify:yangguiming屏蔽骨骼动画
module map {

    //骨骼资源
    export class BoneSpriteSkletonResource extends SpriteResourceBase implements core.ResItemCallback {
        dragonBonesData: dragonBones.DragonBonesData;
        modelJsonPath: string;
        texturePath: string;
        textureJsonPath: string;
        //子类复写 初始化函数
        public initObj(...params: any[]): void {
            this.dragonBonesData = null;

            var info = params[1];
            var path = info.path;
            this.modelJsonPath = path.concat("/" + info.modelName + "_ske.json");
            this.texturePath = path.concat("/" + info.modelName + "_tex.png");
            this.textureJsonPath = path.concat("/" + info.modelName + "_tex.json");
            if (info.isbin) {
                this.modelJsonPath = path.concat("/" + info.modelName + "_ske.dbbin");
            }
        }
        //子类复写 析构函数
        protected destory(): void {

        }

        protected _loadImp() {
            var resMgr: core.ResManager = core.ResManager.getInstance();

            if (this.modelJsonPath.lastIndexOf(".dbbin") != -1) {
                resMgr.loadResAsyn(this.modelJsonPath, this, core.ResourceType.TYPE_BIN);
            } else {
                resMgr.loadResAsyn(this.modelJsonPath, this, core.ResourceType.TYPE_JSON);
            }
        }

        protected _unloadImp() {

            var factory = dragonBones.EgretFactory.factory;
            if (this.dragonBonesData) {
                factory.removeDragonBonesData(this.dragonBonesData.name);
                this.dragonBonesData = null
            }
            //this.mLoadState = ModelLoadState.eUnLoad;
        }

        _cancelLoadImp(){
            var resMgr: core.ResManager = core.ResManager.getInstance();
            resMgr.cancelResAsyn(this);
            
        }

        onResItemLoad(res: core.ResItem): void {
            if (res.getKey() == this.modelJsonPath) {
                var factory = dragonBones.EgretFactory.factory;
                this.dragonBonesData = factory.parseDragonBonesData(res.getData());

                this.notifyLoadComplete()

            }
        }

        onResItemError(key: string): void {

        }
    }

    //纹理资源
    export class BoneSpriteTextureResource extends SpriteResourceBase implements core.ResItemCallback, core.TextureCallback {

        textureJsonRes: core.ResItem;
        textureRes: core.ResItem;
        textureAtlasData: dragonBones.TextureAtlasData;

        modelJsonPath: string;
        texturePath: string;
        textureJsonPath: string;

        //子类复写 初始化函数
        public initObj(...params: any[]): void {
            this.textureJsonRes = null;
            this.textureRes = null;
            this.textureAtlasData = null;

            var info = params[1];
            var path = info.path;
            this.modelJsonPath = path.concat("/" + info.modelName + "_ske.json");
            this.texturePath = path.concat("/" + info.modelName + "_tex.png");
            this.textureJsonPath = path.concat("/" + info.modelName + "_tex.json");

            if (info.isbin) {
                this.modelJsonPath = path.concat("/" + info.modelName + "_ske.dbbin");
            }

        }
        //子类复写 析构函数
        protected destory(): void {
            if (this.textureJsonRes) {
                this.textureJsonRes.release();
                this.textureJsonRes = null;
            }

            if(this.textureRes){
                this.textureRes.release()
                this.textureRes = null;
            }
        }

        protected _loadImp() {
            var resMgr: core.ResManager = core.ResManager.getInstance();
            resMgr.loadResAsyn(this.textureJsonPath, this, core.ResourceType.TYPE_JSON);


            if(this.textureRes == null){
                var textureMgr: core.TextureManager = core.TextureManager.getInstance();
                textureMgr.loadTextureAsyn(this.texturePath, this);
            }
        }

        protected _unloadImp() {
            var factory = dragonBones.EgretFactory.factory;

            if (this.textureAtlasData) {
                factory.removeTextureAtlasData(this.textureAtlasData.name);
                this.textureAtlasData = null;

                //清理骨架下所有图片信息
                let name = this.mModelName;
                let dragonBonesData = factory.getDragonBonesData(name);
                if(dragonBonesData){
                    let armatures = dragonBonesData.armatures

                    for (let k in armatures) {
                        let armatureData = armatures[k];

                        if (armatureData) {
                            //所有皮肤
                            for (let skinName in armatureData.skins) {
                                let skinData = armatureData.skins[skinName];
                                //皮肤下的skinSlot
                                for (let skinSlotName in skinData.displays) {
                                    let displayDataList: dragonBones.DisplayData[] = skinData.displays[skinSlotName];
                                    //display的texture清空
                                    for (let displayData of displayDataList) {
                                        if (displayData instanceof dragonBones.ImageDisplayData) {
                                            displayData.texture = null
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(this.textureRes){
                this.textureRes.release()
                this.textureRes = null;
            }
            //this.mLoadState = ModelLoadState.eUnLoad;
        }

        _cancelLoadImp(){
            let resMgr: core.ResManager = core.ResManager.getInstance();
            resMgr.cancelResAsyn(this);

            let textureMgr: core.TextureManager = core.TextureManager.getInstance();
            textureMgr.cancelTextureAsyn(this.texturePath, this);
        }

        onResItemLoad(res: core.ResItem): void {
            if (res.getKey() == this.textureJsonPath) {
                this.textureJsonRes = res;
            }
            res.retain();

            this._updateRes();
        }

        onResItemError(key: string): void {

        }

        onAsynTextureSucceed(key: string, texture: egret.Texture, textureRes:core.ResItem) {
            TLog.Assert(this.textureRes == null)
            if (key == this.texturePath) {
                this.textureRes = textureRes;
                this.textureRes.retain();
                this._updateRes();
            }
        }

        _updateRes() {
            if (this.textureJsonRes &&
                this.textureRes) {

                var factory = dragonBones.EgretFactory.factory;
                this.textureAtlasData = factory.parseTextureAtlasData(this.textureJsonRes.getData(), this.textureRes.getData());

                this.notifyLoadComplete()

                //删除json文件
                this.textureJsonRes.release();
                this.textureJsonRes = null;
            }
        }

    }



}
*/ 
var map;
(function (map) {
    var FrameSprite = (function (_super) {
        __extends(FrameSprite, _super);
        function FrameSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FrameSprite.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mSpriteInfoResource = null;
            this.mTextureResource = null;
            this.mSpriteAnimation = map.FrameSpriteAnim.newObj(this);
            this.mSpriteDisplay = new map.FrameSpriteDisplay;
            this.mbSpriteDisplayLoaded = false;
            this.mRootNode.addChildAt(this.mSpriteDisplay, 0);
            this.mTransfromProxy = null;
        };
        FrameSprite.prototype.destory = function () {
            this._clearArmature();
            this._unLoadSkeletonResource();
            this._unLoadTextureResource();
        };
        FrameSprite.prototype.getSpriteTexture = function () {
            return this.mTextureResource;
        };
        FrameSprite.prototype.getSpriteDisplay = function () {
            return this.mSpriteDisplay;
        };
        //加到父类后，有可能是跟随父类动画（例如武器、坐骑）
        //也有可能独立动画，例如战斗特效
        FrameSprite.prototype.setTransfromProxy = function (proxy) {
            this.mTransfromProxy = proxy;
        };
        FrameSprite.prototype.getTransformProxy = function () {
            return this.mTransfromProxy;
        };
        FrameSprite.prototype.joinBodyPartsTo = function (target) {
            var targetDisplay = target.getSpriteDisplay();
            this.mSpriteDisplay.joinBodyPartDisplayTo(targetDisplay);
            this.mJoinPartsTarget = target;
        };
        FrameSprite.prototype.restoreBodyParts = function () {
            this.mSpriteDisplay.restoreBodyPartDisplay();
            this.mJoinPartsTarget = null;
        };
        //----------------FrameSpriteAnimListener调用----------------------
        FrameSprite.prototype.onAnimationEvent = function (event) {
            if (event != "")
                this._fireAnimEvent(event);
        };
        //动画索引改变
        FrameSprite.prototype.onAnimationIndexChange = function (actionId, index) {
            this.mSpriteDisplay.setActionAndFrameIndex(actionId, index);
        };
        //-----------------------------------内部函数------------------------------------------------
        FrameSprite.prototype.getSpriteInfo = function () {
            if (this.mSpriteInfoResource == null)
                return null;
            return this.mSpriteInfoResource.getSpriteInfo();
        };
        FrameSprite.prototype._clearArmature = function () {
            this.mbSpriteDisplayLoaded = false;
            this.mSpriteDisplay.clearBodyPartDisplay();
            this.mSpriteAnimation.unloadAnim();
        };
        FrameSprite.prototype._createArmature = function () {
            TLog.Assert(this.mbSpriteDisplayLoaded == false && this.mSpriteInfoResource != null);
            this.mbSpriteDisplayLoaded = true;
            this.mSpriteDisplay.loadModelInfo(this, this.getSpriteInfo());
            this.mSpriteAnimation.loadModelAnim(this.getSpriteInfo());
            //加入到target
            if (this.mJoinPartsTarget) {
                this.joinBodyPartsTo(this.mJoinPartsTarget);
            }
        };
        FrameSprite.prototype._loadTextureResource = function () {
            if (this.mTextureResource == null) {
                var modelName = this.getModelName();
                if (modelName != "") {
                    this.mTextureResource = this.mSpriteMgr.getFrameTextureResource(modelName);
                    if (this.mTextureResource == null) {
                        TLog.Error("_loadTextureResource:" + modelName);
                        return;
                    }
                    this.mTextureResource.load();
                    this._setFlags(32 /* InvalidTexture */);
                }
            }
        };
        FrameSprite.prototype._unLoadTextureResource = function () {
            if (this.mTextureResource) {
                this.mTextureResource.unload();
                this.mTextureResource = null;
            }
            this._removeFlags(32 /* InvalidTexture */);
        };
        FrameSprite.prototype._loadSkeletonResource = function () {
            if (this.mSpriteInfoResource == null) {
                var modelName = this.getModelName();
                if (modelName != "") {
                    this.mSpriteInfoResource = this.mSpriteMgr.getFrameSpriteInfoResource(modelName);
                    if (this.mSpriteInfoResource == null) {
                        TLog.Error("_loadSkeletonResource:" + modelName);
                        return;
                    }
                    this.mSpriteInfoResource.load();
                }
            }
        };
        FrameSprite.prototype._unLoadSkeletonResource = function () {
            if (this.mSpriteInfoResource) {
                this.mSpriteInfoResource.unload();
                this.mSpriteInfoResource = null;
            }
        };
        FrameSprite.prototype._updateAnimation = function () {
            //播放动作
            if (this._hasFlags(2 /* InvalidActionId */)) {
                this._removeFlags(2 /* InvalidActionId */);
                this._removeFlags(8 /* InvalidLoop */);
                var actionId = this.mLogicInfo[1 /* ActionId */];
                if (actionId == "" || actionId == null) {
                    var animInfo = this.mSpriteAnimation.getAnimationInfoByIndex(0); //第一个anim
                    this.mSpriteAnimation.changeAction(animInfo.name, this.getLoopCount() == 0);
                }
                else {
                    // for(let name in this.mActionAliasMap){
                    // 	let alisName = this.mActionAliasMap[name]
                    // }
                    // if("idle" == actionId && this.hasActionId("idle") == false)
                    // 	actionId = "combat_idle"
                    if (this.hasActionId(actionId) == false) {
                        var aliasName = this.getAliasAction(actionId);
                        if (aliasName != null) {
                            actionId = aliasName;
                        }
                    }
                    this.mSpriteAnimation.changeAction(actionId, this.getLoopCount() == 0);
                }
                this.mSpriteAnimation.setAnimSpeed(this.getAnimSpeed());
                this._updateDirChange(true); //强制刷新一次方向
            }
            //播放速度
            if (this._hasFlags(4 /* InvalidAnimSpeed */)) {
                this._removeFlags(4 /* InvalidAnimSpeed */);
                this.mSpriteAnimation.setAnimSpeed(this.getAnimSpeed());
            }
            //暂停
            if (this._hasFlags(16 /* InvalidPause */)) {
                this._removeFlags(16 /* InvalidPause */);
                var bPause = this.isPause();
                if (bPause) {
                    this.mSpriteAnimation.setPause(true);
                }
                else {
                    this.mSpriteAnimation.setPause(false);
                }
            }
            if (this.mJoinPartsTarget != null)
                return;
            this.mSpriteAnimation.onUpdate();
        };
        FrameSprite.prototype._updateTexture = function () {
            if (this.mTextureResource && this.mTextureResource.isLoaded()) {
                if (this._hasFlags(32 /* InvalidTexture */)) {
                    this._removeFlags(32 /* InvalidTexture */);
                    this.mSpriteDisplay.updateDisplay();
                }
            }
        };
        FrameSprite.prototype._updateBound = function () {
            if (this.mbBoundDirty == false) {
                return;
            }
            if (this.mTextureResource == null || this.mTextureResource.isLoaded() == false)
                return;
            if (this.mSpriteDisplay.numChildren == 0)
                return;
            //如果设置了指定actionId的包围盒，则需要先设一次指定actionID，再复原
            //let bHandleBound = false;
            var animation = this.mSpriteAnimation;
            if (this.mJoinPartsTarget) {
                animation = this.mJoinPartsTarget.getAnimation();
            }
            // if(this.mBoundActionId != "" && this.mBoundActionId != animation.getActionId() && animation.getAnimationInfo(this.mBoundActionId) != null){
            // 	animation.changeAction(this.mBoundActionId, true)
            // 	this.mSpriteDisplay.updateDisplay();
            // 	bHandleBound = true;
            // }
            if (this.mTextureResource.isAnimTextureLoaded(animation.getActionId()) == false)
                return;
            this.mbBoundDirty = false;
            this.mSpriteDisplay.updateDisplay();
            //更新包围盒
            var node = this.getDisplayNode();
            this.mSpriteDisplay.getTransformedBounds(node, this.mBoundRect);
            this._fireBoundEvent();
            if (this.mParentSprite != null) {
                this.mParentSprite.invalideBounds();
            }
            // if(bHandleBound){
            // 	this._setFlags(LogicSpriteFlags.InvalidActionId)
            // 	this._updateAnimation();
            // }
        };
        //绑定子精灵三个特性：
        //1.动作和方向不跟随父精灵，都自主控制（e.g 无方向的绑定特效 bTransfrom=false）
        //2.动作自助控制，方向跟随父精灵；子精灵全部在父精灵上层或下层(e.g 有方向的绑定特效 bTransfrom=true, order!=0)
        //3.动作和方向都跟随父精灵；子精灵层次参与父精灵排序（e.g武器，坐骑 bTransform=true, order= 0）
        FrameSprite.prototype._addChidNode = function (boneName, sprite, order, bTransform) {
            TLog.Assert(sprite instanceof FrameSprite);
            if (bTransform) {
                if (order == 0) {
                    sprite.joinBodyPartsTo(this); //把body加入到parent
                }
                else {
                    var displayProxy = new map.FramSpriteBodyPartDisplayProxy(); //部件代理
                    displayProxy.initWithParam(sprite);
                    displayProxy.setOrder(order);
                    this.mSpriteDisplay.addBodyPartDisplay(displayProxy);
                    this.mSpriteDisplay.updateDisplay();
                    sprite.setTransfromProxy(displayProxy);
                }
            }
            else {
                var childIndex = this.mRootNode.numChildren;
                if (order < 0) {
                    childIndex = 0;
                }
                sprite.setPersScale(this.getPersScale());
                this.mRootNode.addChildAt(sprite.getDisplayNode(), childIndex);
            }
            // let bAddToRoot = true;
            // if (bAddToRoot) {
            // 	sprite.setPersScale(this.getPersScale())
            // 	this.mRootNode.addChildAt(sprite.getDisplayNode(), order);
            // }
            // //参与身体排序，实际只是把身体部件加到父类，本身display没有
            // if(bTransform) 
            // 	this.mSpriteDisplay.addChildDisplay(sprite.getSpriteDisplay())
            //this.mRootNode.addChildAt(sprite.getDisplayNode(), order);
            //this.mSpriteDisplay.addChildDisplay(sprite.getDisplayNode(), order)
            this.mChildSpriteList.push(sprite);
            sprite.retain();
        };
        FrameSprite.prototype._removeChildNode = function (sprite) {
            var proxy = sprite.getTransformProxy();
            if (proxy != null) {
                this.mSpriteDisplay.removeBodyPartDisplay(proxy);
            }
            sprite.restoreBodyParts();
            _super.prototype._removeChildNode.call(this, sprite);
        };
        FrameSprite.prototype._updateDirChange = function (bForce) {
            bForce = !!bForce;
            if ((this.mTransfromProxy != null && bForce == false) || this.mJoinPartsTarget != null)
                return;
            var dirIndex = this.getDir();
            if (this.mParentSprite != null) {
                dirIndex = this.mParentSprite.getDir();
            }
            var animInfo = this.mSpriteAnimation.getCurAnimationInfo();
            if (animInfo == null || animInfo.dirs.length <= 0)
                return;
            //找到最接近的方向
            var closestDir = animInfo.dirs[0];
            var closetDistance = Math.abs(dirIndex - closestDir);
            for (var i = 1; i < animInfo.dirs.length; i++) {
                var curDir = animInfo.dirs[i];
                var curDistance = Math.abs(curDir - dirIndex);
                if (curDistance < closetDistance) {
                    closestDir = curDir;
                    closetDistance = curDistance;
                }
            }
            this.mSpriteDisplay.setDirIndex(closestDir);
        };
        //=========================继承SpriteBase===========================
        FrameSprite.prototype.onCameraFound = function () {
            _super.prototype.onCameraFound.call(this);
            this._loadTextureResource();
        };
        FrameSprite.prototype.onCameraLost = function () {
            _super.prototype.onCameraLost.call(this);
            this._unLoadTextureResource();
        };
        FrameSprite.prototype.onMoveDirChange = function (dirIndex) {
            this._updateDirChange();
            return true;
        };
        FrameSprite.prototype.changePartSkin = function (partName, show) {
            this.mSpriteDisplay.setPartShow(partName, show);
        };
        FrameSprite.prototype.changeSkin = function (skinPath) {
            //TLog.Assert(false, "not support")
        };
        FrameSprite.prototype.getSkinName = function () {
            TLog.Assert(false, "not support");
            return "";
        };
        //位置偏移
        FrameSprite.prototype.setPositionOffset = function (x, y) {
            this.mSpriteDisplay.x = x;
            this.mSpriteDisplay.y = y;
        };
        //===============================子类继承实现===========================
        FrameSprite.prototype._updateAlpha = function () {
            this.mSpriteDisplay.alpha = (this.mAlpha / 255) * (this.mMaskAlpha / 255);
        };
        FrameSprite.prototype._updateScale = function () {
            var s = this.mPersScale * this.mScale;
            this.mSpriteDisplay.scaleX = s * this.mFlipXFlag;
            this.mSpriteDisplay.scaleY = s * this.mFlipYFlag;
        };
        FrameSprite.prototype._updateRotate = function () {
            this.mSpriteDisplay.rotation = this.mRotate;
        };
        FrameSprite.prototype._updateModel = function () {
            if (this._hasFlags(1 /* InvalidModelName */)) {
                this._removeFlags(1 /* InvalidModelName */);
                this.invalideBounds();
                this._clearArmature();
                this._unLoadSkeletonResource();
                this._unLoadTextureResource();
                this._loadSkeletonResource();
                if (!this.isClip())
                    this._loadTextureResource();
            }
            if (this.mSpriteInfoResource == null || this.mSpriteInfoResource.isLoaded() == false) {
                return;
            }
            // if(this.mTextureResource == null || this.mTextureResource.isLoaded() == false ){
            // 	return;
            // }
            if (this.mbSpriteDisplayLoaded == false) {
                this._createArmature();
                this.setDirChange();
            }
            this._updateAnimation();
            this._updateTexture();
            this._updateBound();
            //this._updateSkin()
            if (this.isEnterMap() == true) {
                this._updateMask();
            }
            //如果已经加载成功，则把信息加到childlist
            var addlen = this.mChildAddInfoList.length;
            if (addlen > 0) {
                for (var i = 0; i < addlen; i++) {
                    var info = this.mChildAddInfoList[i];
                    this._addChidNode(info.slot, info.sprite, info.order, info.bTransform);
                    info.sprite.release();
                }
                this.mChildAddInfoList.length = 0;
            }
        };
        FrameSprite.prototype.hasActionId = function (actionId) {
            return this.mSpriteAnimation.getAnimationInfo(actionId) != null;
        };
        FrameSprite.prototype.getAnimation = function () {
            return this.mSpriteAnimation;
        };
        return FrameSprite;
    }(map.LogicSprite));
    map.FrameSprite = FrameSprite;
    __reflect(FrameSprite.prototype, "map.FrameSprite", ["map.FrameSpriteAnimListener"]);
})(map || (map = {}));
// TypeScript file
var map;
(function (map) {
    var FrameSpriteAnim = (function (_super) {
        __extends(FrameSpriteAnim, _super);
        function FrameSpriteAnim() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FrameSpriteAnim.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mListener = params[0];
            this.mLoop = true;
            this.mAnimSpeed = 1;
            this.mFrameIndex = -1;
            this.mbPause = false;
            this.mCurIntervalTime = 0;
            this.mAnimChanged = false;
            this.mCurAnimInfo = null;
            this.mSpriteInfo = null;
            this.mActionId = "";
        };
        FrameSpriteAnim.prototype.destory = function () {
        };
        FrameSpriteAnim.prototype.loadModelAnim = function (spriteInfo) {
            this.mSpriteInfo = spriteInfo;
            if (this.mActionId != "")
                this.changeAction(this.mActionId, this.mLoop);
        };
        FrameSpriteAnim.prototype.unloadAnim = function () {
            this.mSpriteInfo = null;
            this.mCurAnimInfo = null;
        };
        FrameSpriteAnim.prototype.changeAction = function (actionId, loop) {
            this.mActionId = actionId;
            this.mLoop = loop;
            if (this.mSpriteInfo == null)
                return;
            var spriteInfo = this.mSpriteInfo;
            this.mCurAnimInfo = spriteInfo.getFrameAnimInfo(actionId);
            if (this.mCurAnimInfo == null) {
                TLog.Error("model:%s body:%s changeAction %s not exist", spriteInfo.name, actionId);
            }
            this.mAnimChanged = false;
            this.mFrameIndex = -1;
            this.setPause(false);
        };
        FrameSpriteAnim.prototype.getActionId = function () {
            return this.mActionId;
        };
        FrameSpriteAnim.prototype.setAnimSpeed = function (speed) {
            this.mAnimSpeed = speed;
        };
        FrameSpriteAnim.prototype.setPause = function (pause) {
            this.mbPause = pause;
        };
        FrameSpriteAnim.prototype.getAnimationInfoByIndex = function (index) {
            if (this.mSpriteInfo == null)
                return null;
            return this.mSpriteInfo.mAnimationList[index];
        };
        FrameSpriteAnim.prototype.getAnimationInfo = function (actionId) {
            if (this.mSpriteInfo == null)
                return;
            return this.mSpriteInfo.getFrameAnimInfo(actionId);
        };
        FrameSpriteAnim.prototype.getCurAnimationInfo = function () {
            return this.mCurAnimInfo;
        };
        FrameSpriteAnim.prototype.onUpdate = function () {
            if (this.mbPause || this.mCurAnimInfo == null)
                return;
            var passTime = core.TimeStamp.DelayTime * this.mAnimSpeed;
            this.mCurIntervalTime += passTime;
            if (this.mFrameIndex == -1) {
                this.mFrameIndex = -1;
                this.mCurIntervalTime = this.mCurAnimInfo.timeInterval;
                this.mAnimChanged = true;
                this.mListener.onAnimationEvent("begin");
            }
            while (this.mCurIntervalTime >= this.mCurAnimInfo.timeInterval) {
                this.mCurIntervalTime -= this.mCurAnimInfo.timeInterval;
                var loopFinish = false;
                //循环到终点了
                this.mFrameIndex++;
                if (this.mFrameIndex >= this.mCurAnimInfo.frameCount) {
                    loopFinish = true;
                    this.mFrameIndex = 0;
                }
                this.mAnimChanged = true;
                if (this.mCurAnimInfo.eventFrameIndex == this.mFrameIndex && this.mCurAnimInfo.eventName != "") {
                    this.mListener.onAnimationEvent(this.mCurAnimInfo.eventName);
                }
                if (loopFinish) {
                    this.mListener.onAnimationEvent("end");
                    if (this.mLoop == false) {
                        this.mbPause = true;
                    }
                    else {
                        this.mListener.onAnimationEvent("turn");
                    }
                }
                //this.SetChanged();
            }
            if (this.mAnimChanged) {
                this.mListener.onAnimationIndexChange(this.mCurAnimInfo.name, this.mFrameIndex);
            }
        };
        return FrameSpriteAnim;
    }(TClass));
    map.FrameSpriteAnim = FrameSpriteAnim;
    __reflect(FrameSpriteAnim.prototype, "map.FrameSpriteAnim");
})(map || (map = {}));
// TypeScript file
var map;
(function (map) {
    ///////////////////////////////////////////////////////////////////////////////////////
    //身体部件基类display
    var FramSpriteBodyPartDisplayBase = (function (_super) {
        __extends(FramSpriteBodyPartDisplayBase, _super);
        function FramSpriteBodyPartDisplayBase() {
            var _this = _super.call(this) || this;
            _this.mActionId = "";
            _this.mDirIndex = -1;
            _this.mFrameIndex = -1;
            _this.mPartShowName = "";
            _this.mOrder = 0;
            return _this;
        }
        FramSpriteBodyPartDisplayBase.prototype.setDispalyParent = function (parent, childIndex) {
            if (childIndex === void 0) { childIndex = 0; }
            if (this.parent != parent) {
                if (parent == null) {
                    if (this.parent) {
                        this.parent.removeChild(this);
                    }
                }
                else {
                    parent.addChildAt(this, childIndex);
                }
                return;
            }
            parent.setChildIndex(this, childIndex);
        };
        //-----------------获取帧动画重要参数-----------------------------------
        FramSpriteBodyPartDisplayBase.prototype.setDirIndex = function (dir) {
            this.mDirIndex = dir;
            this.updateDislay();
        };
        FramSpriteBodyPartDisplayBase.prototype.setAction = function (actionId) {
            this.mActionId = actionId;
            this.updateDislay();
        };
        FramSpriteBodyPartDisplayBase.prototype.setFrameIndex = function (index) {
            this.mFrameIndex = index;
            this.updateDislay();
        };
        FramSpriteBodyPartDisplayBase.prototype.setPartShow = function (show) {
            this.mPartShowName = show;
            this.updateDislay();
        };
        //----------------------------------------------------
        FramSpriteBodyPartDisplayBase.prototype.setVisible = function (b) {
            this.visible = b;
        };
        FramSpriteBodyPartDisplayBase.prototype.setOrder = function (order) {
            this.mOrder = order;
        };
        FramSpriteBodyPartDisplayBase.prototype.getOrder = function () {
            return this.mOrder;
        };
        FramSpriteBodyPartDisplayBase.prototype.updateDislay = function () {
            //子类实现 
        };
        return FramSpriteBodyPartDisplayBase;
    }(egret.DisplayObjectContainer));
    map.FramSpriteBodyPartDisplayBase = FramSpriteBodyPartDisplayBase;
    __reflect(FramSpriteBodyPartDisplayBase.prototype, "map.FramSpriteBodyPartDisplayBase");
    ///////////////////////////////////////////////////////////////////////////////////////
    //bitmap的部件
    var FramSpriteBodyPartDisplayBitmap = (function (_super) {
        __extends(FramSpriteBodyPartDisplayBitmap, _super);
        function FramSpriteBodyPartDisplayBitmap() {
            return _super.call(this) || this;
        }
        FramSpriteBodyPartDisplayBitmap.prototype.initWithParam = function (parent, bodyPartInfo) {
            this.mLogicSprite = parent;
            this.mBodyPartInfo = bodyPartInfo;
            this.mPartName = bodyPartInfo.name;
            this.mOrder = this.mBodyPartInfo.defaultOrder;
            this.mBitmap = new egret.Bitmap;
            this.mBitmap.anchorOffsetX = bodyPartInfo.offx;
            this.mBitmap.anchorOffsetY = bodyPartInfo.offy;
            this.addChild(this.mBitmap);
        };
        FramSpriteBodyPartDisplayBitmap.prototype.setAction = function (actionId) {
            var realActionId = actionId;
            if (this.mLogicSprite.hasActionId(actionId) == false) {
                var aliasName = this.mLogicSprite.getAliasAction(actionId);
                if (aliasName != null) {
                    realActionId = aliasName;
                }
            }
            this.mActionId = realActionId;
            this.updateDislay();
        };
        FramSpriteBodyPartDisplayBitmap.prototype.setDirIndex = function (dir) {
            _super.prototype.setDirIndex.call(this, dir);
            var dirOrder = this.mBodyPartInfo.dirsOrder[dir];
            if (dirOrder != null)
                this.setOrder(dirOrder);
        };
        FramSpriteBodyPartDisplayBitmap.prototype.updateDislay = function () {
            if (this.mActionId == "" || this.mDirIndex < 0 || this.mFrameIndex < 0)
                return;
            var textureRes = this.mLogicSprite.getSpriteTexture();
            if (textureRes == null)
                return;
            textureRes.requestLoadAnimTexture(this.mActionId);
            var frameIndexStr = this.mFrameIndex < 10 ? "0" + this.mFrameIndex : String(this.mFrameIndex);
            var hashImageKey = null;
            if (this.mPartShowName == "") {
                //hashImageKey = String.format("%s_%d_%s_%02d", this.mActionId, this.mDirIndex, this.mBodyPartInfo.name , this.mFrameIndex);
                hashImageKey = this.mActionId + "_" + this.mDirIndex + "_" + this.mBodyPartInfo.name + "_" + frameIndexStr;
            }
            else {
                //hashImageKey = String.format("%s_%d_%s_%s_%02d", this.mActionId, this.mDirIndex, this.mBodyPartInfo.name, this.mPartShowName,  this.mFrameIndex);
                hashImageKey = this.mActionId + "_" + this.mDirIndex + "_" + this.mBodyPartInfo.name + "_" + this.mPartShowName + "_" + frameIndexStr;
            }
            var texture = textureRes.getTexture(hashImageKey);
            this.mBitmap.texture = texture;
        };
        // $measureContentBounds(bounds: egret.Rectangle): void {
        //     super.$measureContentBounds(bounds)
        //     if(this.mBitmap){
        //         bounds.setTo(0, 0, this.mBitmap.texture.$getScaleBitmapWidth(), this.mBitmap.texture.$getScaleBitmapHeight());
        //     }else{
        //         bounds.setTo(0, 0, 0, 0);
        //     }
        // }
        //没有其他子类
        FramSpriteBodyPartDisplayBitmap.prototype.$measureChildBounds = function (bounds) {
            _super.prototype.$measureContentBounds.call(this, bounds);
            if (this.mBitmap.texture) {
                bounds.setTo(0, 0, this.mBitmap.texture.$getScaleBitmapWidth(), this.mBitmap.texture.$getScaleBitmapHeight());
            }
            else {
                bounds.setTo(0, 0, 0, 0);
            }
        };
        return FramSpriteBodyPartDisplayBitmap;
    }(FramSpriteBodyPartDisplayBase));
    map.FramSpriteBodyPartDisplayBitmap = FramSpriteBodyPartDisplayBitmap;
    __reflect(FramSpriteBodyPartDisplayBitmap.prototype, "map.FramSpriteBodyPartDisplayBitmap");
    ///////////////////////////////////////////////////////////////////////////////////////
    //FrameSprite的代理部件
    var FramSpriteBodyPartDisplayProxy = (function (_super) {
        __extends(FramSpriteBodyPartDisplayProxy, _super);
        function FramSpriteBodyPartDisplayProxy() {
            return _super.call(this) || this;
        }
        FramSpriteBodyPartDisplayProxy.prototype.initWithParam = function (parent) {
            this.mLogicSprite = parent;
            this.mSpriteDisplay = parent.getSpriteDisplay();
            this.mSpriteAnim = parent.getAnimation();
            this.addChild(this.mLogicSprite.getDisplayNode());
        };
        FramSpriteBodyPartDisplayProxy.prototype.setDirIndex = function (dir) {
            var curAnimInfo = this.mSpriteAnim.getCurAnimationInfo();
            if (curAnimInfo == null)
                return;
            if (curAnimInfo.isDirectionExsit(dir) == false) {
                if (this.mDirIndex != -1 || curAnimInfo.dirs.length == 0) {
                    return;
                }
                dir = curAnimInfo.dirs[0]; //默认取一个
            }
            _super.prototype.setDirIndex.call(this, dir);
            var bodyPartList = this.mSpriteDisplay.mBodyPartDisplayList;
            if (bodyPartList.length > 0) {
                var partDisplay = bodyPartList[0]; //如果是FramSpriteBodyPartDisplayBitmap，则检查dirsOrder
                if (partDisplay instanceof FramSpriteBodyPartDisplayBitmap) {
                    var dirOrder = partDisplay.mBodyPartInfo.dirsOrder[dir];
                    if (dirOrder != null)
                        this.setOrder(dirOrder);
                }
            }
        };
        FramSpriteBodyPartDisplayProxy.prototype.setAction = function (actionId) {
            // this.mActionId = actionId;
            // this.updateDislay()
        };
        FramSpriteBodyPartDisplayProxy.prototype.setFrameIndex = function (index) {
            // this.mFrameIndex = index;
            // this.updateDislay()
        };
        FramSpriteBodyPartDisplayProxy.prototype.updateDislay = function () {
            if (this.mDirIndex < 0)
                return;
            // if(this.mActionId == "" || this.mDirIndex < 0 || this.mFrameIndex < 0)
            //     return;
            //let displaySprite = this.mLogicSprite.getSpriteDisplay()
            this.mSpriteDisplay.setDirIndex(this.mDirIndex);
            //this.mSpriteDisplay.setFrameIndex(this.mActionId, this.mFrameIndex)
        };
        return FramSpriteBodyPartDisplayProxy;
    }(FramSpriteBodyPartDisplayBase));
    map.FramSpriteBodyPartDisplayProxy = FramSpriteBodyPartDisplayProxy;
    __reflect(FramSpriteBodyPartDisplayProxy.prototype, "map.FramSpriteBodyPartDisplayProxy");
    ///////////////////////////////////////////////////////////////////////////////////////
    //帧动画display
    var FrameSpriteDisplay = (function (_super) {
        __extends(FrameSpriteDisplay, _super);
        function FrameSpriteDisplay() {
            var _this = _super.call(this) || this;
            _this.mBodyPartDisplayList = [];
            _this.mRestoreBodyPartDisplayList = [];
            _this.mRestoreSpriteDisplay = null;
            _this.mActionId = "";
            _this.mDirIndex = -1;
            _this.mFrameIndex = -1;
            return _this;
        }
        FrameSpriteDisplay.prototype.loadModelInfo = function (parent, spriteInfo) {
            TLog.Assert(spriteInfo != null);
            this.mRestoreBodyPartDisplayList = [];
            this.mRestoreSpriteDisplay = null;
            this.mActionId = "";
            this.mDirIndex = -1;
            this.mFrameIndex = -1;
            this.mLogicSprite = parent;
            var bodyPartList = spriteInfo.mBodyPartInfoList;
            for (var _i = 0, bodyPartList_1 = bodyPartList; _i < bodyPartList_1.length; _i++) {
                var bodyPartInfo = bodyPartList_1[_i];
                var bodyPartDisplay = new FramSpriteBodyPartDisplayBitmap;
                bodyPartDisplay.initWithParam(parent, bodyPartInfo);
                this.addChild(bodyPartDisplay);
                this.mBodyPartDisplayList.push(bodyPartDisplay);
            }
            this.updateDisplay();
        };
        FrameSpriteDisplay.prototype.setDirIndex = function (dir) {
            var orderChange = false;
            for (var _i = 0, _a = this.mBodyPartDisplayList; _i < _a.length; _i++) {
                var bodyPartDisplay = _a[_i];
                var order = bodyPartDisplay.getOrder();
                bodyPartDisplay.setDirIndex(dir); //设置方向后，order有可能改变了
                if (order != bodyPartDisplay.getOrder())
                    orderChange = true;
            }
            if (orderChange) {
                this.updateDisplay();
            }
            this.mDirIndex = dir;
        };
        FrameSpriteDisplay.prototype.setActionAndFrameIndex = function (actionId, index) {
            if (this.mActionId != actionId) {
                for (var _i = 0, _a = this.mBodyPartDisplayList; _i < _a.length; _i++) {
                    var bodyPartDisplay = _a[_i];
                    bodyPartDisplay.setAction(actionId);
                }
                this.mActionId = actionId;
            }
            if (this.mFrameIndex != index) {
                for (var _b = 0, _c = this.mBodyPartDisplayList; _b < _c.length; _b++) {
                    var bodyPartDisplay = _c[_b];
                    bodyPartDisplay.setFrameIndex(index);
                }
                this.mFrameIndex = index;
            }
        };
        FrameSpriteDisplay.prototype.setPartShow = function (partName, show) {
            if (partName == "")
                return;
            for (var _i = 0, _a = this.mBodyPartDisplayList; _i < _a.length; _i++) {
                var bodyPartDisplay = _a[_i];
                if (bodyPartDisplay.mPartName == partName) {
                    bodyPartDisplay.setPartShow(show);
                }
            }
        };
        //恢复bodypart
        FrameSpriteDisplay.prototype.restoreBodyPartDisplay = function () {
            if (this.mRestoreSpriteDisplay == null)
                return;
            for (var i = 0; i < this.mRestoreBodyPartDisplayList.length; i++) {
                var bodyPartDisplay = this.mRestoreBodyPartDisplayList[i];
                this.mRestoreSpriteDisplay.removeBodyPartDisplay(bodyPartDisplay);
                this.addBodyPartDisplay(bodyPartDisplay);
            }
            this.mRestoreSpriteDisplay.updateDisplay();
            this.updateDisplay();
            this.mRestoreSpriteDisplay = null;
        };
        //把自身bodypart移到target
        FrameSpriteDisplay.prototype.joinBodyPartDisplayTo = function (target) {
            if (this.mRestoreSpriteDisplay != null || this.mBodyPartDisplayList.length == 0)
                return;
            for (var i = 0; i < this.mBodyPartDisplayList.length; i++) {
                var bodyPartDisplay = this.mBodyPartDisplayList[i];
                this.removeChild(bodyPartDisplay);
                target.addBodyPartDisplay(bodyPartDisplay);
                this.mRestoreBodyPartDisplayList.push(bodyPartDisplay);
            }
            this.mBodyPartDisplayList.length = 0;
            this.mRestoreSpriteDisplay = target;
            target.updateDisplay();
        };
        //身体部件
        ///////////////////////////////////////////////////////////////////////////
        FrameSpriteDisplay.prototype.addBodyPartDisplay = function (display) {
            if (JsUtil.arrayPush(this.mBodyPartDisplayList, display)) {
                this.addChild(display);
                display.setDirIndex(this.mDirIndex);
                display.setAction(this.mActionId);
                display.setFrameIndex(this.mDirIndex);
                return true;
            }
            return false;
        };
        FrameSpriteDisplay.prototype.removeBodyPartDisplay = function (display) {
            if (JsUtil.arrayRemoveVal(this.mBodyPartDisplayList, display)) {
                this.removeChild(display);
                return true;
            }
            return false;
        };
        FrameSpriteDisplay.prototype.clearBodyPartDisplay = function () {
            for (var i = 0; i < this.mBodyPartDisplayList.length; i++) {
                var bodyPartDisplay = this.mBodyPartDisplayList[i];
                this.removeChild(bodyPartDisplay);
            }
            this.mBodyPartDisplayList.length = 0;
        };
        ///////////////////////////////////////////////////////////////////////////
        FrameSpriteDisplay.prototype.updateDisplay = function () {
            if (this.mRestoreSpriteDisplay != null) {
                for (var i = 0; i < this.mRestoreBodyPartDisplayList.length; i++) {
                    var bodyPartDisplay = this.mRestoreBodyPartDisplayList[i];
                    bodyPartDisplay.updateDislay();
                }
                return;
            }
            this.mBodyPartDisplayList.sort(function (a, b) {
                return a.getOrder() - b.getOrder();
            });
            for (var i = 0; i < this.mBodyPartDisplayList.length; i++) {
                var display = this.mBodyPartDisplayList[i];
                display.setDispalyParent(this, i);
                display.updateDislay();
            }
        };
        return FrameSpriteDisplay;
    }(egret.DisplayObjectContainer));
    map.FrameSpriteDisplay = FrameSpriteDisplay;
    __reflect(FrameSpriteDisplay.prototype, "map.FrameSpriteDisplay");
})(map || (map = {}));
// TypeScript file
var map;
(function (map) {
    //动画帧信息
    var FrameSpriteAnimInfo = (function (_super) {
        __extends(FrameSpriteAnimInfo, _super);
        function FrameSpriteAnimInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FrameSpriteAnimInfo.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.name = params[0];
            this.frameCount = 0;
            this.timeInterval = 0;
            this.eventName = "";
            this.eventFrameIndex = -1;
            this.dirs = [];
        };
        FrameSpriteAnimInfo.prototype.isDirectionExsit = function (dir) {
            return this.dirs.indexOf(dir) != -1;
        };
        return FrameSpriteAnimInfo;
    }(TClass));
    map.FrameSpriteAnimInfo = FrameSpriteAnimInfo;
    __reflect(FrameSpriteAnimInfo.prototype, "map.FrameSpriteAnimInfo");
    //身体部件信息
    var FrameSpriteBodyPartInfo = (function (_super) {
        __extends(FrameSpriteBodyPartInfo, _super);
        function FrameSpriteBodyPartInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FrameSpriteBodyPartInfo.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.name = params[0];
            this.partShowList = [];
            //this.animationList = [];
            this.defaultOrder = 0;
            this.defaultShow = "";
            this.dirsOrder = {};
            this.offx = 0;
            this.offy = 0;
        };
        FrameSpriteBodyPartInfo.prototype.destory = function () {
        };
        return FrameSpriteBodyPartInfo;
    }(TClass));
    map.FrameSpriteBodyPartInfo = FrameSpriteBodyPartInfo;
    __reflect(FrameSpriteBodyPartInfo.prototype, "map.FrameSpriteBodyPartInfo");
    //帧模型信息
    var FrameSpriteInfo = (function (_super) {
        __extends(FrameSpriteInfo, _super);
        function FrameSpriteInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FrameSpriteInfo.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.name = "";
            this.mBodyPartInfoList = [];
            this.mAnimationList = [];
        };
        FrameSpriteInfo.prototype.destory = function () {
        };
        FrameSpriteInfo.prototype.loadWithJson = function (rawData) {
            this.name = rawData.name;
            var bodyparts = rawData.bodyparts;
            for (var _i = 0, bodyparts_1 = bodyparts; _i < bodyparts_1.length; _i++) {
                var partinfo = bodyparts_1[_i];
                //身体部件
                var bodypartInfo = this.addBodyPart(partinfo.name, partinfo.order);
                bodypartInfo.offx = partinfo.offx;
                bodypartInfo.offy = partinfo.offy;
                if (partinfo.dirsOrder) {
                    for (var strdir in partinfo.dirsOrder) {
                        var dir = JsUtil.toNumber(strdir, -1);
                        if (dir != -1) {
                            bodypartInfo.dirsOrder[dir] = partinfo.dirsOrder[dir];
                        }
                    }
                }
                //套装信息
                if (partinfo.shows) {
                    for (var _a = 0, _b = partinfo.shows; _a < _b.length; _a++) {
                        var show = _b[_a];
                        this.addBodyPartShow(partinfo.name, show);
                    }
                }
            }
            var anims = rawData.anims;
            for (var _c = 0, anims_1 = anims; _c < anims_1.length; _c++) {
                var animinfo = anims_1[_c];
                this.addAnimation(animinfo.name, animinfo.dirs, animinfo.interval, animinfo.frameCount, animinfo.eventName, animinfo.eventIndex);
            }
        };
        //添加身体部件(body, head, hair)
        FrameSpriteInfo.prototype.addBodyPart = function (name, order) {
            var bodyInfo = this.getBodyPartInfo(name);
            if (bodyInfo == null) {
                bodyInfo = FrameSpriteBodyPartInfo.newObj(name);
            }
            bodyInfo.defaultOrder = order;
            this.mBodyPartInfoList.push(bodyInfo);
            //排序
            this.mBodyPartInfoList.sort(function (a, b) {
                return a.defaultOrder - b.defaultOrder;
            });
            return bodyInfo;
        };
        //添加身体套装(a,b,c,d)
        FrameSpriteInfo.prototype.addBodyPartShow = function (parname, showname) {
            if (showname == "")
                return;
            var bodyInfo = this.getBodyPartInfo(parname);
            if (bodyInfo == null) {
                TLog.Error("addBodyPartShow %s not exsit", parname);
                return;
            }
            bodyInfo.partShowList.push(showname);
            if (bodyInfo.defaultShow == "")
                bodyInfo.defaultShow = showname;
        };
        //获取身体部件信息
        FrameSpriteInfo.prototype.getBodyPartInfo = function (name) {
            for (var i = 0; i < this.mBodyPartInfoList.length; i++) {
                var info = this.mBodyPartInfoList[i];
                if (info.name == name)
                    return info;
            }
            return null;
        };
        //添加身体部件动画(idle, run)
        FrameSpriteInfo.prototype.addAnimation = function (anim, dirs, interval, frameCount, eventName, eventFrameIndex) {
            if (eventName === void 0) { eventName = ""; }
            if (eventFrameIndex === void 0) { eventFrameIndex = -1; }
            var animInfo = this.getFrameAnimInfo(anim);
            if (animInfo != null) {
                TLog.Error("addAnimation anim:%s exsit", anim);
                return;
            }
            animInfo = FrameSpriteAnimInfo.newObj(anim);
            animInfo.dirs = dirs.concat();
            animInfo.frameCount = frameCount;
            animInfo.timeInterval = interval;
            animInfo.eventName = eventName;
            animInfo.eventFrameIndex = eventFrameIndex;
            this.mAnimationList.push(animInfo);
            return animInfo;
        };
        FrameSpriteInfo.prototype.getFrameAnimInfo = function (anim) {
            var animList = this.mAnimationList;
            for (var _i = 0, animList_1 = animList; _i < animList_1.length; _i++) {
                var info = animList_1[_i];
                if (info.name == anim) {
                    return info;
                }
            }
            return null;
        };
        return FrameSpriteInfo;
    }(TClass));
    map.FrameSpriteInfo = FrameSpriteInfo;
    __reflect(FrameSpriteInfo.prototype, "map.FrameSpriteInfo");
})(map || (map = {}));
var map;
(function (map) {
    //帧动画模型资源
    var FrameSpriteInfoResource = (function (_super) {
        __extends(FrameSpriteInfoResource, _super);
        function FrameSpriteInfoResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //mTexturePaths:string[];
        //子类复写 初始化函数
        FrameSpriteInfoResource.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var info = params[1];
            this.mBasePath = info.path;
            this.modelJsonPath = this.mBasePath.concat("/" + info.modelName + "_ske.json");
            this.mFrameSpriteInfo = null;
        };
        //子类复写 析构函数
        FrameSpriteInfoResource.prototype.destory = function () {
        };
        FrameSpriteInfoResource.prototype.getSpriteInfo = function () {
            return this.mFrameSpriteInfo;
        };
        // public getTexturePaths():string[]{
        // 	return this.mTexturePaths;
        // }
        FrameSpriteInfoResource.prototype._loadImp = function () {
            var resMgr = core.ResManager.getInstance();
            resMgr.loadResAsyn(this.modelJsonPath, this, core.ResourceType.TYPE_JSON);
        };
        FrameSpriteInfoResource.prototype._unloadImp = function () {
            if (this.mFrameSpriteInfo) {
                this.mFrameSpriteInfo.deleteObj();
                this.mFrameSpriteInfo = null;
            }
        };
        FrameSpriteInfoResource.prototype._cancelLoadImp = function () {
            var resMgr = core.ResManager.getInstance();
            resMgr.cancelResAsyn(this);
        };
        FrameSpriteInfoResource.prototype.onResItemLoad = function (res) {
            if (res.getKey() == this.modelJsonPath) {
                var rawJsonData = res.getData();
                var spriteInfo = map.FrameSpriteInfo.newObj();
                spriteInfo.loadWithJson(rawJsonData);
                this.mFrameSpriteInfo = spriteInfo;
                // this.mTexturePaths.length = 0;
                // if(rawJsonData.textures != null){
                // 	for(let path of rawJsonData.textures){
                // 		this.mTexturePaths.push(this.mBasePath.concat("/" + path))
                // 	}
                // }
                this.notifyLoadComplete();
            }
        };
        FrameSpriteInfoResource.prototype.onResItemError = function (key) {
        };
        return FrameSpriteInfoResource;
    }(map.SpriteResourceBase));
    map.FrameSpriteInfoResource = FrameSpriteInfoResource;
    __reflect(FrameSpriteInfoResource.prototype, "map.FrameSpriteInfoResource", ["core.ResItemCallback"]);
    //纹理资源
    var FrameSpriteTextureResource = (function (_super) {
        __extends(FrameSpriteTextureResource, _super);
        function FrameSpriteTextureResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //子类复写 初始化函数
        FrameSpriteTextureResource.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.mTextureResMap = {};
            this.mTextureAtlasMap = {};
            //this.mJsonResList = [];	
            var info = params[1];
            this.mBasePath = info.path;
            this.modelJsonPath = this.mBasePath.concat("/" + info.modelName + "_ske.json");
        };
        //子类复写 析构函数
        FrameSpriteTextureResource.prototype.destory = function () {
        };
        FrameSpriteTextureResource.prototype.getTexture = function (name) {
            return this.mTextureAtlasMap[name];
        };
        FrameSpriteTextureResource.prototype.isAnimTextureLoaded = function (animName) {
            var animTexturePath = this.mModelName + "_" + animName;
            var res = this.mTextureResMap[animTexturePath];
            if (res == null) {
                animTexturePath = this.mModelName;
                res = this.mTextureResMap[animTexturePath];
            }
            return res != null && (res.textureRes != null && res.bloading == false);
        };
        FrameSpriteTextureResource.prototype.requestLoadAnimTexture = function (animName) {
            var animTexturePath = this.mModelName + "_" + animName;
            var res = this.mTextureResMap[animTexturePath];
            if (res == null) {
                animTexturePath = this.mModelName;
                res = this.mTextureResMap[animTexturePath];
            }
            if (res == null || res.textureRes != null || res.bloading == true)
                return;
            //加载texture配置文件
            var jsonPath = this._getTextureJsonPath(animTexturePath);
            var resMgr = core.ResManager.getInstance();
            resMgr.loadResAsyn(jsonPath, this, core.ResourceType.TYPE_JSON);
            //加载texture
            var texturePath = this._getTexturePath(animTexturePath);
            var textureMgr = core.TextureManager.getInstance();
            textureMgr.loadTextureAsyn(texturePath, this);
            res.bloading = true;
        };
        FrameSpriteTextureResource.prototype._loadImp = function () {
            var resMgr = core.ResManager.getInstance();
            resMgr.loadResAsyn(this.modelJsonPath, this, core.ResourceType.TYPE_JSON);
        };
        FrameSpriteTextureResource.prototype._unloadImp = function () {
            for (var key in this.mTextureResMap) {
                var texRes = this.mTextureResMap[key];
                if (texRes.textureRes) {
                    texRes.textureRes.release();
                }
                if (texRes.jsonRes) {
                    texRes.jsonRes.release();
                }
            }
            this.mTextureResMap = {};
            this.mTextureAtlasMap = {};
        };
        FrameSpriteTextureResource.prototype._cancelLoadImp = function () {
            var textureMgr = core.TextureManager.getInstance();
            for (var key in this.mTextureResMap) {
                var res = this.mTextureResMap[key];
                textureMgr.cancelTextureAsyn(this._getTexturePath(key), this);
            }
            var resMgr = core.ResManager.getInstance();
            resMgr.cancelResAsyn(this);
        };
        FrameSpriteTextureResource.prototype.onResItemLoad = function (res) {
            if (res.getKey() == this.modelJsonPath) {
                var rawJsonData = res.getData();
                var texturePaths = [];
                if (rawJsonData.textures != null) {
                    for (var _i = 0, _a = rawJsonData.textures; _i < _a.length; _i++) {
                        var path = _a[_i];
                        //this.mTexturePaths.push(this.mBasePath.concat("/" + path))
                        texturePaths.push(path);
                    }
                }
                for (var _b = 0, texturePaths_1 = texturePaths; _b < texturePaths_1.length; _b++) {
                    var texturePath = texturePaths_1[_b];
                    var pos = texturePath.lastIndexOf(".");
                    var noPofixPath = texturePath.substring(0, pos);
                    //let jsonPath = noPofixPath + ".json"
                    this.mTextureResMap[noPofixPath] = { textureRes: null, jsonRes: null, bloading: false };
                }
                this.notifyLoadComplete();
                //this.loadAllTextures(texturePaths)
            }
            else {
                for (var k in this.mTextureResMap) {
                    var jsonRes = this.mTextureResMap[k];
                    var jsonPath = this._getTextureJsonPath(k);
                    if (jsonPath == res.getKey()) {
                        res.retain();
                        jsonRes.jsonRes = res;
                    }
                }
                this._checkLoadComplete();
            }
        };
        FrameSpriteTextureResource.prototype.onResItemError = function (key) {
        };
        FrameSpriteTextureResource.prototype.onAsynTextureSucceed = function (key, texture, textureRes) {
            for (var k in this.mTextureResMap) {
                var res = this.mTextureResMap[k];
                var texturePath = this._getTexturePath(k);
                if (texturePath == key) {
                    textureRes.retain();
                    res.textureRes = textureRes;
                }
            }
            this._checkLoadComplete();
        };
        FrameSpriteTextureResource.prototype._getTexturePath = function (path) {
            return this.mBasePath.concat("/", path + ".png");
        };
        FrameSpriteTextureResource.prototype._getTextureJsonPath = function (path) {
            return this.mBasePath.concat("/", path + ".json");
        };
        FrameSpriteTextureResource.prototype._checkLoadComplete = function () {
            for (var k in this.mTextureResMap) {
                var res = this.mTextureResMap[k];
                if (res.bloading) {
                    if (res.textureRes != null && res.jsonRes != null) {
                        this._createTextureAtlas(res);
                        res.bloading = false;
                        //配置文件内存析构
                        res.jsonRes.release();
                        res.jsonRes = null;
                    }
                }
            }
        };
        FrameSpriteTextureResource.prototype._createTextureAtlas = function (res) {
            // for(let i = 0 ; i < this.mTextureResMap.length; i++){
            // 	let res = this.mTextureResMap[i];
            TLog.Assert(res.textureRes != null && res.jsonRes != null);
            var textureAtlas = res.textureRes.getData();
            var jsonData = res.jsonRes.getData();
            for (var key in jsonData.frames) {
                var data = jsonData.frames[key];
                //"ty_bt_back02":{"x":669,"y":323,"w":80,"h":80,"offX":0,"offY":0,"sourceW":80,"sourceH":80},
                var subtexture = new egret.Texture();
                subtexture.$bitmapData = textureAtlas.$bitmapData;
                subtexture.$initData(data.x, data.y, data.w, data.h, data.offX, data.offY, data.sourceW, data.sourceH, textureAtlas.$sourceWidth, textureAtlas.$sourceHeight);
                this.mTextureAtlasMap[key] = subtexture;
            }
            //}
        };
        return FrameSpriteTextureResource;
    }(map.SpriteResourceBase));
    map.FrameSpriteTextureResource = FrameSpriteTextureResource;
    __reflect(FrameSpriteTextureResource.prototype, "map.FrameSpriteTextureResource", ["core.ResItemCallback", "core.TextureCallback"]);
})(map || (map = {}));
// TypeScript file
var core;
(function (core) {
    var SdkResultEvent = (function (_super) {
        __extends(SdkResultEvent, _super);
        function SdkResultEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SdkResultEvent.prototype.initObj = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.code = params[0];
            this.params = params[1];
        };
        SdkResultEvent.prototype.destory = function () {
        };
        return SdkResultEvent;
    }(core.EventArgs));
    core.SdkResultEvent = SdkResultEvent;
    __reflect(SdkResultEvent.prototype, "core.SdkResultEvent");
    // export class SdkRuntimeEvent extends core.EventArgs {
    //     params: string;
    //     public initObj(...params: any[]): void {
    //         this.params = params[1]
    //     }
    //     protected destory(): void {
    //     }
    // }
    var GameSdk = (function (_super) {
        __extends(GameSdk, _super);
        function GameSdk() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // mQdKey: string;
            // mServerListUrl: string;
            _this.mInterGameSdk = null;
            // mInited: boolean = false;
            // mInitFinished: boolean = false;
            // mSkipSelectServer: boolean = false;
            // mSkillAccountAuth: boolean = false;
            _this.mSupportInvite = false;
            //-1 不显示关注按钮 0未关注 1已关注
            _this.mAttentionStatus = GameSdk.NOT_SUPPORT_ATTENTION;
            return _this;
        }
        //private callbackFlagMap:{[key:string]:boolean} = {}
        GameSdk.staticInit = function (cmdline, className) {
            GameSdk.sCmdLine = cmdline;
            GameSdk.sMainClass = className;
        };
        GameSdk.prototype.initSdk = function (json) {
            this.mConfig = new core.ConfigFile;
            this.mConfig.initWithJson(json);
            this._loginSuccessAppead = "qdKey=" + this.getStringConfigDef("QD_Key", "");
            this._loginSuccessAppead = this._loginSuccessAppead + "&code1=" + this.getStringConfigDef("QD_Code1", "");
            this._loginSuccessAppead = this._loginSuccessAppead + "&code2=" + this.getStringConfigDef("QD_Code2", "");
            this._loginSuccessAppead = this._loginSuccessAppead + "&gameKey=" + this.getStringConfigDef("GameKey", "");
            this._loginSuccessAppead = this._loginSuccessAppead + "&gameName=" + this.getStringConfigDef("GameName", "") + "&";
            this.initCmdLine();
            var defineClass = egret.getDefinitionByName(GameSdk.sMainClass);
            if (defineClass) {
                this.mInterGameSdk = new defineClass(this);
            }
            if (this.mInterGameSdk != null) {
                this.mInterGameSdk.initSdk();
            }
        };
        GameSdk.prototype.initCmdLine = function () {
            TLog.Debug("sCmdLine", GameSdk.sCmdLine);
            //初始化命令行
            //this.mCmdLine = l;   
            this.mCmdListValueList = {};
            TLog.Debug("GameSdk.sCmdLine", GameSdk.sCmdLine);
            if (GameSdk.sCmdLine != null && GameSdk.sCmdLine.length > 1) {
                var splitindex = GameSdk.sCmdLine.indexOf("?");
                if (splitindex != -1) {
                    var url = GameSdk.sCmdLine.substr(0, splitindex);
                    if (GameSdk.sCmdLine.length > splitindex + 1) {
                        var nextindex = splitindex + 1;
                        var keyvaluelisttxt = GameSdk.sCmdLine.substr(nextindex, GameSdk.sCmdLine.length - nextindex);
                        this.mCmdListValueList = core.GameSdkUtil.splitHttpParams(keyvaluelisttxt);
                    }
                    this.mCmdListValueList['url'] = url;
                }
                else {
                    this.mCmdListValueList['url'] = GameSdk.sCmdLine;
                }
            }
            for (var key in this.mCmdListValueList) {
                var value = this.mCmdListValueList[key];
                TLog.Debug("cmd:", key, value);
            }
        };
        GameSdk.prototype.getFromCmdLine = function (key) {
            return this.mCmdListValueList[key];
        };
        //////////////////////////////////////////////////////////////////////////////
        GameSdk.prototype.getStringConfigDef = function (key, def) {
            return this.mConfig.getString(key, def);
        };
        GameSdk.prototype.getBoolConfigDef = function (key, def) {
            return this.mConfig.getBoolean(key, def);
        };
        GameSdk.prototype.reportRoleCreate = function (serverinfo, roleinfo) {
            TLog.Debug("GameSdk.reportRoleCreate");
            if (this.mInterGameSdk == null)
                return false;
            //serverinfo
            //serverInfo.gameId = gameInfo.id
            //serverInfo.id = beginIndex//第几个服。从0开始
            //serverInfo.regionIndex = regionIndex//在第几个组.
            //serverInfo.indexInRegion = indexInRegion//在组里排第几个
            //serverInfo.groupIndex = i //在游戏服里第几个分组
            //roleinfo
            //this.id = reader.readUnsignedInt();
            //this.name = reader.readString();
            //this.level = reader.readUnsignedInt();
            //this.body = reader.readUnsignedInt();
            //this.groupIndex = reader.readUShort();    
            return this.mInterGameSdk.reportRoleCreate(serverinfo, roleinfo);
        };
        GameSdk.prototype.reportRoleLogin = function (serverinfo, roleinfo) {
            TLog.Debug("GameSdk.reportRoleLogin");
            if (this.mInterGameSdk == null)
                return false;
            //serverinfo
            //serverInfo.gameId = gameInfo.id
            //serverInfo.id = beginIndex//第几个服。从0开始
            //serverInfo.regionIndex = regionIndex//在第几个组.
            //serverInfo.indexInRegion = indexInRegion//在组里排第几个
            //serverInfo.groupIndex = i //在游戏服里第几个分组
            //roleinfo = "HeroInfoBase":[
            //	"id:uint32",
            //	"name:string",
            //	"vocation:uint32",
            //	"sexId:uint8",
            //	"level:uint16",
            //	"exp:string",
            //	"VIP_level:uint32",
            //	"VIP_exp:uint32",
            //	"force:uint32",
            //	"saveRecord:table",
            //	"funds:uint32",
            //	"bindGold:uint32",
            //	"gold:uint32",                
            return this.mInterGameSdk.reportRoleLogin(serverinfo, roleinfo);
        };
        GameSdk.prototype.reportFirstEnter = function () {
            TLog.Debug("GameSdk.reportFirstEnter");
            if (this.mInterGameSdk == null)
                return false;
            return this.mInterGameSdk.reportFirstEnter();
        };
        GameSdk.prototype.reportPayReturn = function (serverinfo, roleinfo, payInfo) {
            TLog.Debug("GameSdk.reportFirstEnter");
            if (this.mInterGameSdk == null)
                return false;
            //payInfo.paypoint = 0//冲了多少元宝点数
            //payInfo.money = 0//多少钱，单位元
            //payInfo.itemid = 0//冲值ID
            //payInfo.paytype = ""//冲值渠道     
            //payInfo.billno = ""//定单号
            return this.mInterGameSdk.reportPayReturn(serverinfo, roleinfo, payInfo);
        };
        //////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////
        // setSkip(qd: string) {
        //     if (qd == "allu") {
        //         this.mSkillAccountAuth = true;
        //         //this.mSkipSelectServer = true;
        //     }
        // }
        // getQDKey() {
        //     return this.mQdKey;
        // }
        // getServerListUrl() {
        //     return this.mServerListUrl;
        // }
        //setServerListUrl(url:string){
        //    this.mServerListUrl = url;
        //}
        // onInitSdkReturn(ret: boolean) {
        //     TLog.Debug("GameSdk:onInitSdkReturn", ret);
        //     this.mInitFinished = ret;
        // }
        //是不是忽略账号验证
        // getSkipAccountAuth(): boolean {
        //     return this.mSkillAccountAuth;
        // }
        // //是不是忽略选择服务器
        // getSkipSelectServer(): boolean {
        //     return this.mSkipSelectServer;
        // }
        //是不是支持邀请
        GameSdk.prototype.canInvite = function () {
            return this.mSupportInvite;
        };
        //设置是不是支持邀请 
        GameSdk.prototype.setSupportInvite = function (invite) {
            TLog.Debug("GameSdk:setSupportInvite", invite);
            this.mSupportInvite = invite;
            this.fireEvent(GameSdk.SHARE_STATUS_CHANGE, SdkResultEvent.newObj(0));
            //FireEvent(EventDefine.SHARE_STATUS_CHANGE, StateEvent.newObj(0));
        };
        //设置关注状态;;; 
        GameSdk.prototype.setAttentionStatus = function (value) {
            TLog.Debug("GameSdk:setAttentionStatus", value);
            this.mAttentionStatus = value;
            this.fireEvent(GameSdk.ATTENTION_STATUS_CHANGE, SdkResultEvent.newObj(0));
        };
        GameSdk.prototype.getAttentionStatus = function () {
            return this.mAttentionStatus;
        };
        GameSdk.prototype.canShowAttention = function () {
            return (this.mAttentionStatus == GameSdk.NOT_ATTENTION);
        };
        GameSdk.prototype.onLoginReturn = function (ret, params) {
            if (ret == 0) {
                params = this._loginSuccessAppead + params;
            }
            this.fireEvent(GameSdk.LoginEvent, SdkResultEvent.newObj(ret, params));
        };
        //邀请返回
        GameSdk.prototype.onInviteReturn = function (finish) {
            TLog.Debug("GameSdk:onInviteReturn", finish);
            if (finish) {
                this.fireEvent(GameSdk.SHARE_RETURN, SdkResultEvent.newObj(0));
            }
        };
        GameSdk.prototype.onPayReturn = function (result, params) {
            TLog.Debug("GameSDK.onPayReturn", result, params);
            //let args = {'code':-1,'params':'error'}
            // var recvEvent: PayEventArgs = PayEventArgs.createObj();
            // recvEvent.code = -1
            // recvEvent.params = "not suport"
            // FireEvent(EventDefine.PAY_SDK_EVENT, recvEvent);
            this.fireEvent(GameSdk.PAY_SDK_EVENT, SdkResultEvent.newObj(result, params));
        };
        GameSdk.prototype.callLogin = function (params) {
            if (this.mInterGameSdk == null)
                return false;
            return this.mInterGameSdk.login(params);
        };
        GameSdk.prototype.callPay = function (itemparams) {
            //if (this.mInited && this.mInitFinished)
            TLog.Debug("sCmdLine", itemparams);
            if (this.mInterGameSdk == null) {
                this.onPayReturn(-1, "not suport");
                return false;
            }
            return this.mInterGameSdk.pay(itemparams);
            //return false;
        };
        GameSdk.prototype.callShowShare = function (params) {
            //FireEvent(EventDefine.SHARE_RETURN, StateEvent.newObj(0));
            if (this.mInterGameSdk == null) {
                return;
            }
            return this.mInterGameSdk.showShare(params);
        };
        GameSdk.prototype.callShowAttention = function (params) {
            //FireEvent(EventDefine.SHARE_RETURN, StateEvent.newObj(0));
            if (this.mInterGameSdk == null) {
                return;
            }
            return this.mInterGameSdk.showAttention(params);
        };
        GameSdk.prototype.callSdk = function (strFun, param) {
            if (param === void 0) { param = ""; }
            if (this.mInterGameSdk == null) {
                this.callRuntimeInterface(strFun, param);
            }
            else {
                //网页版本
                this.mInterGameSdk.callSdk(strFun, param);
            }
        };
        //运行时接口（Android,Ios）
        GameSdk.prototype.callRuntimeInterface = function (eventName, param) {
            if (eventName == "" || eventName == null) {
                return;
            }
            var self = this;
            var localFunc = function (param) {
                self.callEventToGame.call(self, eventName, param);
            };
            egret.ExternalInterface.addCallback(eventName, localFunc);
        };
        GameSdk.prototype.callEventToGame = function (eventName, param) {
            this.fireEvent(eventName, SdkResultEvent.newObj(0, param));
        };
        GameSdk.SHARE_STATUS_CHANGE = "SHARE_STATUS_CHANGE"; //状态变化，可以显示分享或不能显示分享;;;;
        GameSdk.SHARE_RETURN = "SHARE_RETURN"; //分享返回;;;
        GameSdk.ATTENTION_STATUS_CHANGE = "ATTENTION_STATUS_CHANGE"; //关注状态变化;;
        GameSdk.PAY_SDK_EVENT = "PAY_SDK_EVENT";
        GameSdk.LoginEvent = "LoginEvent";
        GameSdk.NOT_SUPPORT_ATTENTION = -1;
        GameSdk.NOT_ATTENTION = 0;
        GameSdk.AREADY_ATTENTION = 1;
        GameSdk.sCmdLine = null;
        GameSdk.sMainClass = null;
        return GameSdk;
    }(core.EventSet));
    core.GameSdk = GameSdk;
    __reflect(GameSdk.prototype, "core.GameSdk");
})(core || (core = {}));
// TypeScript file
var core;
(function (core) {
    var GameSdkUtil = (function () {
        function GameSdkUtil() {
        }
        //从字符串里分析出参数列表 
        GameSdkUtil.splitHttpParams = function (line) {
            if (!line) {
                return {};
            }
            var ret = {};
            var keyvaluelist = line.split("&");
            for (var i = 0; i < keyvaluelist.length; ++i) {
                var keyvaluetxt = keyvaluelist[i];
                var index = keyvaluetxt.search("=");
                if ((index != -1) && (keyvaluetxt.length > (index + 1))) {
                    var key = keyvaluetxt.substr(0, index);
                    var nextindex = index + 1;
                    var value = keyvaluetxt.substr(nextindex, keyvaluetxt.length - nextindex);
                    ret[key] = value;
                }
            }
            return ret;
        };
        GameSdkUtil.httpParamsToString = function (params) {
            if (params == null)
                return "";
            var resultList = [];
            for (var k in params) {
                resultList.push(k + "=" + params[k]);
            }
            return resultList.join("&");
        };
        //系统时间，以秒为单位
        GameSdkUtil.getOSTime = function () {
            var d = new Date();
            return Math.floor(d.getTime() / 1000);
        };
        GameSdkUtil.toNumber = function (v, def) {
            if (v == null)
                return def;
            if (typeof v == "number") {
                return v;
            }
            return JsUtil.toNumber(v, def);
        };
        return GameSdkUtil;
    }());
    core.GameSdkUtil = GameSdkUtil;
    __reflect(GameSdkUtil.prototype, "core.GameSdkUtil");
})(core || (core = {}));
