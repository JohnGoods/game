declare module core {
    function MixinClasses(target: any, template: any): void;
}
declare function ImportType(any: any): void;
declare function CastType<T>(val: any): T;
declare function _createTClass_(): any;
declare function _createTObject_(...params: any[]): any;
declare class TClass extends egret.HashObject {
    private static _instance;
    private mReferenceCount;
    classname: string;
    constructor();
    protected _initclass_(): void;
    initObj(...params: any[]): void;
    protected destory(): void;
    static getInstance(): any;
    static destoryInstance(): void;
    static createObj(...params: any[]): any;
    static newObj(...params: any[]): any;
    deleteObj(): void;
    retain(): void;
    release(): void;
    releaseLater(): void;
    getReferenceCount(): number;
    autorelease(): void;
    getProperty(name: string): any;
}
declare module core {
    class EventArgs extends egret.Event {
        handle: number;
        constructor();
        protected _initclass_(): void;
        static createObj(...params: any[]): any;
        static newObj(...params: any[]): any;
        deleteObj(): void;
        retain(): void;
        release(): void;
        autorelease(): void;
        initObj(...params: any[]): void;
        protected destory(): void;
    }
    class EventSet extends egret.EventDispatcher {
        private mCurrentEventName;
        constructor();
        protected _initclass_(): void;
        static getInstance(): any;
        static destoryInstance(): void;
        static createObj(...params: any[]): any;
        static newObj(...params: any[]): any;
        deleteObj(): void;
        retain(): void;
        release(): void;
        releaseLater(): void;
        autorelease(): void;
        initObj(...params: any[]): void;
        protected destory(): void;
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void;
        fireEvent(eventName: string, event: egret.Event, bubble?: boolean): boolean;
        dispatchEvent(event: egret.Event): boolean;
        private isEventExsit(list, listener, thisObject);
        clearEvent(): void;
        getCurrentEventName(): string;
    }
}
declare module map {
    abstract class SpriteBase extends core.EventSet {
        mbInView: boolean;
        mParentLayer: SpriteLayer;
        mNodeIndex: number;
        mOriginalParent: egret.DisplayObjectContainer;
        initObj(...params: any[]): void;
        destory(): void;
        abstract getDisplayNode(): egret.DisplayObjectContainer;
        abstract getBoundRect(): egret.Rectangle;
        setInCameraView(cam: Camera, bInView: boolean): void;
        onUpdate(cam: Camera): void;
        protected isInCameraView(cam: Camera): boolean;
        isClip(): boolean;
        onCameraFound(): void;
        onCameraLost(): void;
        setVisible(visible: boolean): void;
        setVisibleRaw(visible: boolean): void;
        isVisible(): boolean;
        onEnterMap(layer: SpriteLayer): void;
        onLeaveMap(layer: SpriteLayer): void;
        isEnterMap(): boolean;
        getLayer(): SpriteLayer;
        setPosition(x: number, y: number): void;
        getPositionX(): number;
        getPositionY(): number;
        setPositionCellXY(cellx: number, celly: number): void;
        getPositionCellX(): number;
        getPositionCellY(): number;
    }
}
declare module map {
    abstract class MovableSprite extends SpriteBase {
        report: number;
        optimizeflag: number;
        mPathMgr: PathMgr;
        logicPath: LogicPath;
        mmoving: boolean;
        mbTickMove: boolean;
        movementEvent: SpriteMovEvent;
        m_nAngle: number;
        m_bDirChange: boolean;
        initObj(...params: any[]): void;
        destory(): void;
        addReportFlag(f: number): void;
        removeReportFlag(f: number): void;
        clearReportFlag(): void;
        moveTo(mapx: number, mapy: number, ignoreBlock: boolean): boolean;
        moveStop(): void;
        isMoving(): boolean;
        setMoveSpeed(speed: number): void;
        getMoveSpeed(): number;
        _DelayInitLogicPath(): boolean;
        _FireMovementEvent(flag: number): void;
        setDir(dir: number): void;
        getDir(): number;
        setAngle(angle: number): void;
        getAngle(): number;
        setDirChange(): void;
        _UpdateMovement(cam: Camera): void;
        _UpdateAppearance(): void;
        onUpdate(cam: Camera): void;
        protected onMoveDirChange(dir: number): boolean;
    }
}
declare module map {
    abstract class LayerBase extends TClass {
        mTileMap: TileMap;
        mZOder: number;
        initObj(...params: any[]): void;
        destory(): void;
        getTileMap(): TileMap;
        abstract getDisplayNode(): egret.DisplayObjectContainer;
        onUpdate(cam: Camera): void;
        setZOrder(order: number): void;
        getZOrder(): number;
    }
}
declare module map {
    class SpriteResourceBase extends TClass {
        mUnLoadBeginTime: number;
        mResRefCount: number;
        mLoadState: number;
        mModelName: string;
        mSpriteMgr: LogicSpriteManager;
        initObj(...params: any[]): void;
        protected destory(): void;
        load(): boolean;
        unload(): boolean;
        unloadImp(): void;
        isLoaded(): boolean;
        isLoading(): boolean;
        isUnLoaded(): boolean;
        isUnLoading(): boolean;
        protected notifyLoadComplete(): void;
        protected _loadImp(): void;
        protected _unloadImp(): void;
        protected _cancelLoadImp(): void;
    }
}
declare module map {
    class SpriteLayer extends LayerBase {
        mTag: number;
        mbUpdateLock: boolean;
        mAddObjectList: SpriteBase[];
        mRemoveObjectList: SpriteBase[];
        mObjectList: SpriteBase[];
        mRenderObjectList: SpriteBase[];
        mDisplayNode: SpriteLayerDisplayerNode;
        initObj(...params: any[]): void;
        destory(): void;
        getDisplayNode(): egret.DisplayObjectContainer;
        setTag(tag: number): void;
        getTag(): number;
        addSprite(sprite: SpriteBase): boolean;
        removeSprite(sprite: SpriteBase): boolean;
        private removeSpriteImp(sprite);
        clearSprite(): void;
        onUpdate(cam: Camera): void;
        protected onUpdateSpriteList(cam: Camera): void;
        protected onRenderSpriteList(cam: Camera): void;
    }
}
declare module map {
    class MapLayerBase extends LayerBase implements IEyeshotCallback {
        mLayerEyeshot: MapLayerEyeShot;
        mLayerType: number;
        mLayerID: number;
        mName: string;
        mDisplayNode: MapLayerDisplayerNode;
        destory(): void;
        getDisplayNode(): egret.DisplayObjectContainer;
        initEyeshot(nMapWidth: number, nMapHeight: number, nGridWidth: number, nGridHeight: number): void;
        load(stream: BinaryStream): boolean;
        onUpdate(cam: Camera): void;
        onEyeshotFound(nGridX: number, nGridY: number): void;
        onEyeshotLost(nGridX: number, nGridY: number): void;
    }
}
declare module map {
    const enum LogicSpriteFlags {
        InvalidModelName = 1,
        InvalidActionId = 2,
        InvalidAnimSpeed = 4,
        InvalidLoop = 8,
        InvalidPause = 16,
        InvalidTexture = 32,
        InvalidSkin = 64,
        InvalidAll = 255,
    }
    const enum LogicSpriteKey {
        ModelName = 0,
        ActionId = 1,
        AnimSpeed = 2,
        LoopCount = 3,
        Pause = 4,
        Skin = 5,
    }
    class LogicSprite extends map.MovableSprite {
        mLogicInfo: any;
        mLogicFlags: number;
        mRootNode: egret.DisplayObjectContainer;
        mSpriteMgr: LogicSpriteManager;
        mParentSprite: LogicSprite;
        mChildSpriteList: LogicSprite[];
        mChildAddInfoList: any[];
        m_bFlipX: boolean;
        m_bFlipY: boolean;
        mFlipXFlag: number;
        mFlipYFlag: number;
        m_bMirror: boolean;
        mPersScale: number;
        mScale: number;
        mAlpha: number;
        mMaskAlpha: number;
        mRotate: number;
        mBoundRect: egret.Rectangle;
        mBoundActionId: string;
        mbBoundDirty: boolean;
        mDisplayeNodeList: egret.DisplayObject[];
        mbUpdateAnimAlways: boolean;
        mPartSkinInfoList: any[];
        mAnimEvent: SpriteAnimEvent;
        mActionAliasMap: {
            [key: string]: string;
        };
        initObj(...params: any[]): void;
        destory(): void;
        getBoundRect(): egret.Rectangle;
        loadModel(name: string): boolean;
        getModelName(): string;
        changeAction(actionId: string, loop: number): boolean;
        addAliasAction(name: string, aliasName: string): void;
        clearAliasAction(): void;
        getAliasAction(name: string): string;
        getActionId(): string;
        getLoopCount(): number;
        setAnimSpeed(speed: number): void;
        getAnimSpeed(): number;
        setPause(bPause: boolean): void;
        isPause(): boolean;
        setAlpha(alpha: number): void;
        setMaskAlpha(maskAlpha: any): void;
        setColor(r: number, g: number, b: number): void;
        setRotate(rot: number): void;
        getRotate(): number;
        setScale(s: number): void;
        getScale(): number;
        setPersScale(s: number): void;
        getPersScale(): number;
        setMirror(b: boolean): void;
        setFlipXY(bFilpX: boolean, bFilpY: boolean): void;
        isFlipX(): boolean;
        isFlipY(): boolean;
        setParent(sprite: LogicSprite): void;
        getParent(): LogicSprite;
        setBoundActionId(action: string): void;
        getBoundActionId(): string;
        invalideBounds(): void;
        setUpdateAnimAlways(b: boolean): void;
        isUpdateAnimAlways(): boolean;
        changePartSkin(slotName: string, replaceSkinPath: string): void;
        changeSkin(skinPath: string): void;
        getSkinName(): string;
        setPositionOffset(x: number, y: number): void;
        addChildSprite(slot: string, sprite: LogicSprite, order?: number, bTransform?: boolean): void;
        removeChildSprite(sprite: LogicSprite): void;
        clearAllChildSprite(): void;
        addDisplayeNode(type: SpriteDisplayNodeType, node: egret.DisplayObject): void;
        removeDisplayeNode(node: egret.DisplayObject): void;
        getDisplayNodeList(): egret.DisplayObject[];
        setPosition(x: number, y: number): void;
        getPositionX(): number;
        getPositionY(): number;
        protected _setFlags(flag: number): void;
        protected _removeFlags(flags: number): void;
        protected _hasFlags(flags: number): boolean;
        protected setLogicInfo(key: number, val: any, flag: number): void;
        protected _fireAnimEvent(notify: string): void;
        protected _fireBoundEvent(): void;
        protected _updateMask(): void;
        protected _removeChildNode(sprite: LogicSprite): void;
        getDisplayNode(): egret.DisplayObjectContainer;
        onUpdate(cam: map.Camera): void;
        protected isInCameraView(cam: map.Camera): boolean;
        onCameraFound(): void;
        onCameraLost(): void;
        protected _updateAlpha(): void;
        protected _updateScale(): void;
        protected _updateRotate(): void;
        protected _updateModel(): void;
        hasActionId(actionId: string): boolean;
    }
}
declare module gui {
    class ComboBoxItem extends eui.ItemRenderer {
        private bg;
        private content;
        constructor();
        protected partAdded(partName: string, instance: any): void;
        protected childrenCreated(): void;
        protected dataChanged(): void;
        private onTouchEnd(event);
    }
}
declare module core {
    class ResourceType {
        static TYPE_XML: string;
        static TYPE_IMAGE: string;
        static TYPE_BIN: string;
        static TYPE_TEXT: string;
        static TYPE_JSON: string;
        static TYPE_SOUND: string;
    }
    interface ResItemCallback {
        onResItemLoad(res: ResItem): void;
        onResItemError(key: string): void;
    }
    interface ZipItemCallback {
        onZipItemLoad(key: any, result: number): void;
    }
    class ResManager extends TClass {
        private mGroupCallbackMap;
        private mItemCallbackMap;
        private mRemotePath;
        private mRootPath;
        private mZipList;
        private mZipExpandList;
        private mbSearchZipFirst;
        private mResExplicitType;
        private mLangIncludePathList;
        private mLangExcludePathList;
        private mLanguagePath;
        private mPath2ResItem;
        private mErrorResPathMap;
        private mErrorMaxTryTimes;
        private mLoadQueue;
        private mLoadMaxCount;
        private mLoadCount;
        initObj(...params: any[]): void;
        init(): void;
        destory(): void;
        private injectRESConfig();
        private initRES();
        setRemotePath(remotePath: string): void;
        getRemotePath(): string;
        setRootPath(rootPath: string): void;
        getRootPath(): string;
        setSearchZipFirst(b: boolean): void;
        setLanguagePath(lang: string): void;
        getLanguagePath(): string;
        addLanguageIncludePath(path: string): boolean;
        addLanguageExcludePath(path: string): boolean;
        private getPathInterval(path);
        private transfromZipObjectData(zipObj, url, type);
        private loadZipRes(key);
        loadResAsynLocal(key: string, callback: ResItemCallback, type?: string): void;
        loadResAsyn(key: string, callback: ResItemCallback, type?: string): void;
        private _loadResAsyn(key, callback, type, isRemote);
        releaseLoadThread(): void;
        nextLoadQueue(): void;
        destroyRes(path: string): void;
        clearResPath(path: any): void;
        cancelResAsyn(callback: any): void;
        getRes(key: string): any;
        setMaxThreadCount(count: number): void;
        setMaxErrorTimes(times: number): void;
        clearErrorRes(): void;
        addZipPacket(key: string, callback?: ZipItemCallback, bExpand?: boolean): void;
        removeZipPacket(key: string): void;
        removeZipExpandCache(key: string): void;
        getZipPacketCount(): number;
        private checkResItemCache(key, rootPath);
        private onResItemLoad(resItem);
        private onItemLoadSuccess(data, key, fromzip?);
        private isErrorRes(key);
        onResByUrlError(path: string, e: any): void;
        private onItemLoadError(key);
    }
}
declare module core {
    class SoundManager extends TClass implements core.ResItemCallback {
        mCurrentMusicName: string;
        mLastMusicName: string;
        mMusicChannel: egret.SoundChannel;
        mMusicLoop: boolean;
        mEffectResList: core.ResItem[];
        mMusicResList: core.ResItem[];
        mMaxEffectCacheCount: number;
        mMaxMusicCacheCount: number;
        mSoundChannelMap: {
            [key: number]: egret.SoundChannel;
        };
        initObj(...params: any[]): void;
        protected destory(): void;
        setMaxCache(effctCount: number, musicCount: number): void;
        private playSoundImp(sound, bEffect);
        playEffect(name: string): void;
        playMusic(name: string, loop?: boolean): void;
        stop(): void;
        clear(): void;
        onResItemLoad(res: ResItem): void;
        onResItemError(key: string): void;
    }
}
declare module core {
    interface TextureCallback {
        onAsynTextureSucceed(key: string, texture: egret.Texture, res?: ResItem): any;
    }
    class TextureEvent extends core.EventArgs {
        static TextureDisposeEvent: string;
        static TextureWarnEvent: string;
        path: string;
    }
    class TextureManager extends core.EventSet implements ResItemCallback {
        mTextureResMap: any;
        mCallbackMap: any;
        mCheckTime: number;
        mDisposeTime: number;
        delayTime: number;
        mTextNodeCleanList: egret.sys.TextNode[];
        mTextNodeMaxCount: number;
        mTextNodeCleanTime: number;
        mGraphicCleanList: egret.Graphics[];
        mGraphicMaxCount: number;
        mGraphicCleanTime: number;
        mMaxTextureMemorySize: number;
        mCheckMemoryDuring: number;
        mCheckMemoryTime: number;
        initObj(...params: any[]): void;
        destory(): void;
        setAutoDisposeTime(checkTime: number, disposeTime: number): void;
        setAutoTextAndGraphicsDispose(maxTextCount: number, maxTextTime: number, maxGraphicCount: number, maxGraphicTime: number): void;
        setMaxTextureMemory(checkTime: number, maxBytes: number): void;
        loadTextureAsyn(key: string, callback: TextureCallback): void;
        cancelTextureAsyn(key: string, callback: TextureCallback): void;
        cancelTextureAsynAll(callback: TextureCallback): void;
        cleanUpCacheTexture(): void;
        private getTextureWebGL(texture);
        onResItemLoad(res: ResItem): void;
        onResItemError(key: string): void;
        getTexture(key: string): egret.Texture;
        private checkBitmapRefrence(bitmapData);
        private onUpdateCleanTextAndGraphicNodeList(bforce);
        caculateTextureMemory(): number;
        onUpdate(bforce?: boolean): void;
        addCleanGraphic(graphicNode: egret.Graphics): void;
        addCleanTextNode(textNode: egret.sys.TextNode): void;
        removeCleanTextNode(textNode: egret.sys.TextNode): void;
    }
}
declare module core {
    class AutoreleasePool extends TClass {
        _managedObjectArray: any[];
        initObj(...params: any[]): void;
        addObject(obj: any): void;
        clear(): void;
    }
}
declare class BinaryStream extends egret.ByteArray {
    constructor(buffer?: ArrayBuffer);
    setNetMode(b: boolean): void;
    readString(): string;
    readUInt(): number;
    readUShort(): number;
    readUChar(): number;
    readChar(): number;
    writeString(value: string): void;
    writeUInt(value: number): void;
    writeUShort(value: number): void;
    writeUChar(value: number): void;
    writeChar(value: number): void;
}
declare module core {
    class ConfigFile {
        mData: any;
        constructor();
        initWithJson(data: any): void;
        getString(k: string, def?: string): string;
        getNumber(k: string, def?: number): number;
        getBoolean(k: string, def?: boolean): boolean;
        getData(k: string, def?: any): any;
    }
}
declare module core {
    class EgretUtil {
        static Rectangle_setLTRB(rect: egret.Rectangle, l: number, t: number, r: number, b: number): void;
        static nodeToStageXY(node: egret.DisplayObject, fromX: number, fromY: number): egret.Point;
        static stageToNodeXY(node: egret.DisplayObject, stageX: number, stageY: number): egret.Point;
        static hitTestRect(node: egret.DisplayObject, stageX: number, stageY: number): boolean;
    }
}
declare module core {
    class ErrorReport extends TClass {
        mUrl: string;
        mParamMsg: string;
        mbEnable: boolean;
        mParamList: any;
        mbSend: boolean;
        initObj(...params: any[]): void;
        protected destory(): void;
        setReportUrl(url: string): void;
        setUserParamMsg(params: string): void;
        addUserParam(key: string, val: string): void;
        setReportEnable(bEnable: boolean): void;
        isReportEnable(): boolean;
        captureError(error: Error): void;
    }
}
declare class JsUtil {
    static arrayPush<T>(list: T[], val: T): boolean;
    static arrayInstert<T>(list: T[], pos: any, value?: any): void;
    static arrayRemove<T>(list: T[], pos?: any): T;
    static arrayRemoveVal<T>(list: T[], val: T): boolean;
    static arrayExsit<T>(list: T[], val: T): boolean;
    static objectForEach<T>(m: any, callback: (value, key) => any): void;
    static objectCopy(m: any): any;
    static objectCopyEx(newObj: any, srcObj: any): boolean;
    static objectFindIndexWithValue(obj: Object, val: any): string;
    static JsonEncode(obj: any): string;
    static JsonDecode(str: string): any;
    static JsonDecodeSafeFormat(str: string): any;
    static UrlEncode(str: string): string;
    static UrlDecode(str: string): string;
    static toString(obj: any): string;
    static toNumber(str: string, def?: number): number;
    static isNaN(obj: number): boolean;
    static isFinite(obj: number): boolean;
    static parseFloat(str: string): number;
    static parseInt(str: string, radix?: number): number;
    static loadScript(path: string, callback?: () => void): void;
}
declare module core {
    function getMd5String(str: string): string;
}
declare module core {
    class TimeStamp {
        static DelayTime: number;
        static CurrentTime: number;
        static CurrentFrame: number;
    }
    function getCpuTime(): number;
}
declare class TLog {
    private static s_bEnable;
    static Debug(message?: any, ...optionalParams: any[]): void;
    static Warn(message?: any, ...optionalParams: any[]): void;
    static Error(message?: any, ...optionalParams: any[]): void;
    static Assert(test: any, message?: any, ...optionalParams: any[]): boolean;
    static Throw(message?: any, ...optionalParams: any[]): void;
    static SetEnable(b: boolean): void;
}
declare class TXML {
    static parse(data: string, root?: boolean): egret.XML;
    static findChild(xml: egret.XML, name: string): any;
    static queryText(xml: egret.XML): string;
    static queryIntText(xml: egret.XML, def?: number): number;
    static queryAttribute(xml: egret.XML, attName: string, def?: string): string;
    static queryIntAttribute(xml: egret.XML, attName: string, def?: number): number;
    static forEach(xml: egret.XML, callback: (xmlNode: egret.XML) => any): void;
}
declare module core {
    function xxteaEncrypt(data: Uint8Array, len: number, key: Uint8Array): Uint8Array;
    function xxteaDecrypt(data: Uint8Array, len: number, key: Uint8Array): Uint8Array;
}
declare module gui {
    enum Color {
        aliceblue = 15792383,
        antiquewhite = 16444375,
        aqua = 65535,
        aquamarine = 8388564,
        azure = 15794175,
        beige = 16119260,
        bisque = 16770244,
        black = 0,
        blanchedalmond = 16772045,
        blue = 255,
        blueviolet = 9055202,
        brown = 10824234,
        burlywood = 14596231,
        cadetblue = 6266528,
        chartreuse = 8388352,
        chocolate = 13789470,
        coral = 16744272,
        cornflowerblue = 6591981,
        cornsilk = 16775388,
        crimson = 14423100,
        cyan = 65535,
        darkblue = 139,
        darkcyan = 35723,
        darkgoldenrod = 12092939,
        darkgray = 11119017,
        darkgreen = 25600,
        darkkhaki = 12433259,
        darkmagenta = 9109643,
        darkolivegreen = 5597999,
        darkorange = 16747520,
        darkorchid = 10040012,
        darkred = 9109504,
        darksalmon = 15308410,
        darkseagreen = 9419915,
        darkslateblue = 4734347,
        darkslategray = 3100495,
        darkturquoise = 52945,
        darkviolet = 9699539,
        deeppink = 16716947,
        deepskyblue = 49151,
        dimgray = 6908265,
        dodgerblue = 2003199,
        firebrick = 11674146,
        floralwhite = 16775920,
        forestgreen = 2263842,
        fuchsia = 16711935,
        gainsboro = 14474460,
        ghostwhite = 16316671,
        gold = 16766720,
        goldenrod = 14329120,
        gray = 8421504,
        green = 32768,
        greenyellow = 11403055,
        honeydew = 15794160,
        hotpink = 16738740,
        indianred = 13458524,
        indigo = 4915330,
        ivory = 16777200,
        khaki = 15787660,
        lavender = 15132410,
        lavenderblush = 16773365,
        lawngreen = 8190976,
        lemonchiffon = 16775885,
        lightblue = 11393254,
        lightcoral = 15761536,
        lightcyan = 14745599,
        lightgoldenrodyellow = 16448210,
        lightgreen = 9498256,
        lightgrey = 13882323,
        lightpink = 16758465,
        lightsalmon = 16752762,
        lightseagreen = 2142890,
        lightskyblue = 8900346,
        lightslategray = 7833753,
        lightsteelblue = 11584734,
        lightyellow = 16777184,
        lime = 65280,
        limegreen = 3329330,
        linen = 16445670,
        magenta = 16711935,
        maroon = 8388608,
        mediumaquamarine = 6737322,
        mediumblue = 205,
        mediumorchid = 12211667,
        mediumpurple = 9662683,
        mediumseagreen = 3978097,
        mediumslateblue = 8087790,
        mediumspringgreen = 64154,
        mediumturquoise = 4772300,
        mediumvioletred = 13047173,
        midnightblue = 1644912,
        mintcream = 16121850,
        mistyrose = 16770273,
        moccasin = 16770229,
        navajowhite = 16768685,
        navy = 128,
        oldlace = 16643558,
        olive = 8421376,
        olivedrab = 7048739,
        orange = 16753920,
        orangered = 16729344,
        orchid = 14315734,
        palegoldenrod = 15657130,
        palegreen = 10025880,
        paleturquoise = 11529966,
        palevioletred = 14381203,
        papayawhip = 16773077,
        peachpuff = 16767673,
        peru = 13468991,
        pink = 16761035,
        plum = 14524637,
        powderblue = 11591910,
        purple = 8388736,
        red = 16711680,
        rosybrown = 12357519,
        royalblue = 4286945,
        saddlebrown = 9127187,
        salmon = 16416882,
        sandybrown = 16032864,
        seagreen = 3050327,
        seashell = 16774638,
        sienna = 10506797,
        silver = 12632256,
        skyblue = 8900331,
        slateblue = 6970061,
        slategray = 7372944,
        snow = 16775930,
        springgreen = 65407,
        steelblue = 4620980,
        tan = 13808780,
        teal = 32896,
        thistle = 14204888,
        tomato = 16737095,
        turquoise = 4251856,
        violet = 15631086,
        wheat = 16113331,
        white = 16777215,
        whitesmoke = 16119285,
        yellow = 16776960,
        yellowgreen = 10145074,
        ublack = 4535083,
        zongse = 4530441,
        zongse02 = 4535083,
        rouse = 15190421,
        rouse02 = 16703170,
        lvse = 14151544,
        hongse = 16658223,
        lvse02 = 107265,
    }
    var ColorTable: number[];
    var ColorNameIndexMap: any;
    function GetColorFromName(colorName: string): number;
    function InitColorTable(): void;
}
declare module gui {
    class TouchEvent {
        static TOUCH_LONG: string;
        static TOUCH_SHORT: string;
    }
    const enum GuiLayer {
        Bottom = 0,
        Normal = 1,
        Modal = 2,
        Top = 3,
    }
    enum Flag {
        LEFT = 0,
        H_CENTER = 1,
        RIGHT = 2,
        TOP = 0,
        V_CENTER = 4,
        BOTTOM = 8,
        LEFT_TOP = 0,
        LEFT_CENTER = 4,
        LEFT_BOTTOM = 8,
        CENTER_TOP = 1,
        CENTER_CENTER = 5,
        CENTER_BOTTOM = 9,
        RIGHT_TOP = 2,
        RIGHT_CENTER = 6,
        RIGHT_BOTTOM = 10,
        V_REVERSE = 16,
        H_REVERSE = 32,
    }
    enum FontFlag {
        BOLD = 65536,
        ITALIC = 131072,
        UNDER_LINE = 262144,
        FREE_TYPE_ALL = 983040,
        SHADOW = 1048576,
        STROKE = 2097152,
    }
    function GetFlagFromName(name: string): number;
    function GrayComponent(component: eui.UIComponent, bGray: boolean): void;
}
declare module gui {
    class GUIEvent extends egret.Event {
        window: eui.UIComponent;
        constructor(type: string, window: eui.UIComponent);
    }
    class GUIHyperlinkEvent extends GUIEvent {
        link: string;
        constructor(type: string, window: eui.UIComponent);
        getHyperlink(): string;
        setHyperlink(link: string): void;
    }
    class GUITranslateWordEvent extends GUIEvent {
        word: string;
        constructor(type: string, window: eui.UIComponent);
        getTranslateWord(): string;
        setTranslateWord(word: string): void;
    }
    class GUIDriveEvent extends egret.TouchEvent {
        static BeginDriveEvent: string;
        static EndDriveEvent: string;
        private handler;
        hoverTarget: egret.DisplayObject;
        showDriveTarget: egret.DisplayObject;
        driveOffStageX: number;
        driveOffStageY: number;
        userData: any;
        constructor(type: string, touchTarget: egret.DisplayObject);
        setDriveBegin(bHandle: boolean): void;
        isDriveBegin(): boolean;
        setDriveOffXY(offx: number, offy: number): void;
        setShowDriveTarget(target: egret.DisplayObject): void;
        setUserData(userData: any): void;
    }
}
declare module gui {
    interface GuiTickCallback {
        onTick(): any;
    }
    class GuiManager extends TClass {
        mStage: egret.Stage;
        mUIRootNode: egret.DisplayObjectContainer;
        mBottomLayer: eui.UILayer;
        mNormalLayer: eui.UILayer;
        mModalLayer: eui.UILayer;
        mTopLayer: eui.UILayer;
        mTickList: GuiTickCallback[];
        mTouchTarget: any;
        mTouchX: number;
        mTouchY: number;
        mTouchId: number;
        mTouchBeginTime: number;
        mbFireLongTouch: boolean;
        mDriveTargetSaveData: {
            target: egret.DisplayObject;
            showTarget: egret.DisplayObject;
            parent: egret.DisplayObjectContainer;
            x: number;
            y: number;
            userData: any;
            childIndex: number;
        };
        mDriveDisplayerObject: egret.DisplayObjectContainer;
        mDriveOffsetX: number;
        mDriveOffsetY: number;
        mbTouchMove: boolean;
        mbTouchDown: boolean;
        mbInputEnableDelay: boolean;
        mbInputEnable: boolean;
        mDefaultFont: string;
        initObj(...params: any[]): void;
        init(rootNode: egret.DisplayObjectContainer, stage: egret.Stage): void;
        loadTheme(name: string, callback: (name: string) => void, thisObj: any): void;
        parseLayoutString(content: string): any;
        loadLayoutAsyn(paths: string[], callback: () => void, thisObject: any): void;
        setDefaultFontName(fontName: string): void;
        getDefaultFontName(): string;
        isRootNode(target: egret.DisplayObject): boolean;
        setNodeLayer(node: gui.LayoutNode, layer: GuiLayer): void;
        getLayerNode(layer?: GuiLayer): egret.DisplayObjectContainer;
        addTickCallback(callback: GuiTickCallback): void;
        removeTickCallback(callback: GuiTickCallback): void;
        onUpdate(): void;
        setUIVisible(b: boolean): void;
        isUIVisible(): boolean;
        getPathFromChild(target: egret.DisplayObject): string;
        private getChildFromPathImp(rootNode, pathlist);
        getChildFromPath(path: string): egret.DisplayObject;
        setInputEnable(bEnable: boolean): void;
        isInputEnable(): boolean;
        private startDriveTouch();
        private stopDriveTouch(x, y, touchPointID);
        private moveDriveTouch(x, y, touchPointID);
        private startTouch(x, y, touchPointID);
        private stopTouch(touchPointID);
        isTouchMove(): boolean;
        private onLongTouchEvent();
        private initGuiTouchEvent();
    }
}
declare function OverrideEUIInit(): void;
declare namespace eui.override {
    function _init(): void;
}
declare module gui {
    class AssetAdapter implements eui.IAssetAdapter {
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        getAsset(source: string, compFunc: Function, thisObject: any): void;
    }
}
declare var _EuiJsonVersion_: any;
declare module gui {
    class ThemeAdapter implements eui.IThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void;
    }
}
declare var generateEUI: {
    paths: string[];
    skins: any;
};
declare var generateEUI2: {
    paths: string[];
    skins: any;
};
declare module gui {
    class ActorView extends eui.Component implements GuiTickCallback {
        mContainer: egret.DisplayObjectContainer;
        mActorList: map.SpriteBase[];
        constructor();
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        addActor(actor: map.SpriteBase): void;
        removeActor(actor: map.SpriteBase): boolean;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        $hitTest(stageX: number, stageY: number): egret.DisplayObject;
        private _regsterTimer();
        private clearTimer();
        onTick(): void;
    }
}
declare module gui {
    class AnimBox extends eui.Component implements GuiTickCallback {
        static AnimEndEvent: string;
        private m_intervalTime;
        private m_frameIndex;
        private m_intervalCurrentTime;
        private m_bLoop;
        private m_bPlaying;
        private m_bReverse;
        private m_AnimName;
        private m_AnimInfo;
        private m_AnimChanged;
        m_image: eui.Image;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        setAnimName(animName: string): void;
        play(): void;
        pause(): void;
        reset(): void;
        setLoop(loop: boolean): void;
        setAnimInterval(millisecond: number): void;
        setReverse(bReverse: boolean): void;
        private updateAnimImage();
        onTick(): number;
        animName: string;
        animInterval: number;
    }
}
declare module gui {
    class BatchImage extends eui.Component {
        $beginDraw: boolean;
        mCacheMaxCount: number;
        mCacheImageList: gui.Grid9Image[];
        constructor();
        beginDraw(): void;
        endDraw(): void;
        private _renderImage(name, xPos, yPos);
        private _renderProgress(name, xPos, yPos, progress, isVertical);
        drawNumberString(image_prefix: string, strNumber: string, targetX?: number, targetY?: number, spaceX?: number): number;
        drawImage(image_name: string, targetX?: number, targetY?: number): number;
        drawImageProgress(image_name: string, progress: number, targetX?: number, targetY?: number): void;
        drawImageVProgress(image_name: string, progress: number, targetX?: number, targetY?: number): void;
        $invalidateContentBounds(): void;
    }
}
declare module gui {
    class Button extends eui.Button {
        mBackgroupImage: eui.Image;
        constructor();
        private onCompleteHandler(event);
        invalidateState(): void;
        smallButton(): void;
        normalButton(): void;
        labelColor: number;
        image: string;
        backgroupImage: eui.Image;
        source: string;
        text: string;
        textColor: number;
    }
}
declare module gui {
    class Grid9Image extends eui.Image {
        bAutoScale9Grid: boolean;
        constructor();
        autoScale9Grid: boolean;
        $setTexture(value: egret.Texture): boolean;
    }
}
declare module gui {
    class LayoutNode extends eui.Component {
        mOriginalParent: egret.DisplayObjectContainer;
        mbModal: boolean;
        mModalGroupId: number;
        mLayerId: number;
        mbCanDrag: boolean;
        mbModalMask: boolean;
        constructor();
        removeFromtParent(): void;
        $setX(value: number): boolean;
        $setY(value: number): boolean;
        $setVisible(visible: boolean): void;
        getComponent(idName: string): any;
        setDoModal(b: boolean, groupId?: number): void;
        isDoModal(): boolean;
        getModalGroupId(): number;
        setDoModalMask(b: boolean): void;
        isDoModalMask(): boolean;
        moveToFront(): void;
        moveToBack(): void;
        setLayer(layer: gui.GuiLayer): void;
        getLayer(): number;
        setCanDrag(b: boolean): void;
        onBeginDrive(event: gui.GUIDriveEvent): void;
        onEndDrive(event: gui.GUIDriveEvent): void;
    }
}
declare module gui {
    class ModalColorLayer extends eui.UILayer implements GuiTickCallback {
        mColorNode: eui.Rect;
        mRenderNode: egret.Bitmap;
        mRenderTexture: egret.RenderTexture;
        mMaskNodeContainer: egret.DisplayObjectContainer;
        mLayoutNodeList: gui.LayoutNode[];
        mbMaskNodeChanged: boolean;
        mMaskNodeSaveDataList: any[];
        mbUpdateLock: boolean;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        $cacheDirtyUp(): void;
        addLayoutNode(node: gui.LayoutNode): boolean;
        removeLayoutNode(node: gui.LayoutNode): boolean;
        getMaskNodeList(): gui.LayoutNode[];
        isUpdateLock(): boolean;
        setNodeChange(): void;
        private removeChildSafe(node);
        private addChildSafe(node);
        private onBeginMask(maskNodeList);
        private onUpdateMask(maskNodeList);
        private onFinshMask();
        onTick(): void;
        onModalMaskChange(event: egret.Event): void;
    }
}
declare module gui {
    class ModalLayer extends eui.UILayer {
        colorLayer: gui.ModalColorLayer;
        constructor();
        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject;
        $doRemoveChild(index: number, notifyListeners?: boolean): egret.DisplayObject;
        $hitTest(stageX: number, stageY: number): egret.DisplayObject;
        private updateLayer();
    }
}
declare module gui {
    class ProgressBar extends eui.ProgressBar {
        mBackgroupImage: eui.Image;
        constructor();
        private onCompleteHandler(event);
        image: string;
        backgroupImage: eui.Image;
        thumbImage: string;
    }
}
declare module gui {
    class RichDisplayer extends eui.Group {
        static TagBR: string;
        static TagVerBlank: string;
        static TagHorBlank: string;
        static TagText: string;
        static TagImage: string;
        static TagAnim: string;
        static AttName: string;
        static AttColor: string;
        static AttLink: string;
        static AttValue: string;
        static AttFlag: string;
        static RichDisplayerLinkCmdEvent: string;
        static RichDisplayerTranslateEvent: string;
        private mContainer;
        private mRowInfoList;
        private mLogicInfoList;
        private mTempXmlList;
        private mCacheCtrlList;
        private mDefaultValue;
        private mDefaultFontFlag;
        private mReplaceArr;
        private mAlignFlag;
        private mRowDistance;
        private mbShowLast;
        private mContentChanged;
        private mSizeChanged;
        private mTempXmlNodeList;
        constructor();
        translateWord(text: string): string;
        private replaceSpecial(value);
        private fillLogicInfo(logicInfo, xmlNode);
        setRowDistance(distance: number): void;
        showFirstRow(): void;
        showLastRow(): void;
        private _addXmlNodeImp();
        private _addXmlStringImp(xmlStr);
        addXmlString(xmlStr: string): void;
        addXmlNode(xmlNode: egret.XML): void;
        private finishCurrentRow();
        private getCurrentRow();
        private addPosInfo(logicInfo, width, height);
        private insertImage(logicInfo);
        private insertAnim(logicInfo);
        private insertText(logicInfo);
        clear(): void;
        setAlignFlag(flag: number): void;
        getLogicWidth(): number;
        getLogicHeight(): number;
        getLogicRowCount(): number;
        private refreshLogicShow();
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        private setCtrlVisible(ctrl, b);
        private releaseCtrl(type, ctrl);
        private getSaveLabel(text);
        private getSaveImage();
        private getSaveAnimBox();
        private getLogicInfoFromWindow(window);
        private onRdTouchTapCapture(event);
    }
}
declare module gui {
    class Scroller extends eui.Scroller {
        private touchScrollH;
        private touchScrollV;
        constructor();
        scrollToXY(scrollHor: number, scrollVer: number, anim: boolean): void;
    }
}
declare module gui {
    class ComboBox extends eui.Component {
        private bg;
        private titleLabel;
        private Scroller;
        private DataGroup;
        private isPullDown;
        static onClick: string;
        private _data;
        private _itemData;
        private maxItemCount;
        private scrollY;
        constructor();
        private updateData(key, value);
        private initPullView();
        private onRightIconBg(event);
        getTitleLabe(): eui.Label;
        /**
         * Set the item width of the comboBox
         *
         */
        setItemWidth(width: any): void;
        /**
         * Set the item height of the comboBox
         *
         */
        setItemHeight(height: any): void;
        /**
         * Set the title fontSize of the comboBox
         */
        setItemFontSize(number?: number): void;
        /**
         * Set the title height of the comboBox
         *
         */
        setTitleHeight(height: any): void;
        /**
         * Set the title background of the comboBox
         * example:"reource/picture.png"
         */
        setTitleBackground(src: any): void;
        /**
         * Set the title fontSize of the comboBox
         */
        setTitleFontSize(number: any): void;
        setTitle(title: string): void;
        updatePos(): void;
        /**
         * Show the comboBox
         */
        private show();
        /**
         * Hidden the comboBox
         */
        private hide();
        /**
         * TextAlign:"left";"center";"right"
         */
        setItemTextAlign(align: any): void;
        $setWidth(value: number): void;
        $setHeight(value: number): void;
        setMaxItem(num: number): void;
        data: any[];
        onItemClick(event: egret.Event): void;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        onStageMouseDown(event: egret.Event): void;
    }
}
declare module core {
    class NetSystem extends TClass {
        mTcpListLock: number;
        mTcpList: NetWork[];
        mHttpListLock: number;
        mHttpList: HttpClient[];
        initObj(...params: any[]): void;
        protected destory(): void;
        createNetWork(): NetWork;
        removeNetWork(nw: NetWork): boolean;
        createHttpClient(): HttpClient;
        removeHttpClient(httpnw: HttpClient): boolean;
        onUpdate(): void;
        clearAll(): void;
    }
}
declare module gui {
    class AnimInfo extends TClass {
        w: number;
        h: number;
        count: number;
        interval: number;
    }
    class AnimSet extends TClass {
        mInfoList: any;
        initObj(...params: any[]): void;
        protected destory(): void;
        insertInfo(name: string, w: number, h: number, count: number, interval: number): boolean;
        getAnimInfo(name: string): AnimInfo;
        getAnimSize(name: any): {
            w: number;
            h: number;
        };
        getAnimFrameNum(name: any): number;
    }
}
declare module gui {
    class FontInfo extends TClass {
        fontName: string;
        fontSize: number;
        color: number;
        shadowColor: number;
        flag: number;
        space_x: number;
        space_y: number;
        stroke: number;
        shadownOffset: number;
        initObj(...params: any[]): void;
        protected destory(): void;
        init(fontName: string, fontSize: number, flag: number): void;
        setColor(color: number): void;
        setShadowColor(color: number): void;
        setShadowOffset(shadownOffset: number): void;
        setSpace(space_x: number, space_y: number): void;
        setStroke(stroke: number): void;
        isBold(): boolean;
        isItalic(): boolean;
    }
    class FontSet extends TClass {
        mFontList: any;
        initObj(...params: any[]): void;
        protected destory(): void;
        insertFont(name: string, fontName: string, fontSize: number, color: number, backColor: number, flag: number, space_x: number, space_y: number, stoke: number, shadownOffset: number): boolean;
        getFont(name: string): FontInfo;
        clearAllFont(): void;
        private hasFlag(testValue, flag);
        updateTextField(name: string, text: egret.TextField, colorChange?: boolean): void;
    }
}
declare module gui {
    interface ImageSetLoadCallback {
        onImageSetLoad(name: string): any;
    }
    class ImageInfo extends TClass {
        x: number;
        y: number;
        w: number;
        h: number;
        offX: number;
        offY: number;
        sourceW: number;
        sourceH: number;
        name: string;
        fileName: string;
        subTexture: egret.Texture;
        baseTexture: egret.Texture;
        initObj(...params: any[]): void;
        protected destory(): void;
    }
    class ImageSet extends TClass {
        mResMgr: core.ResManager;
        mTextureMgr: core.TextureManager;
        mInfoList: any;
        initObj(...params: any[]): void;
        protected destory(): void;
        loadImageSet(path: string, callback: ImageSetLoadCallback): void;
        onImageSetInfoLoad(url: string, config: any): void;
        insertInfo(name: string, path: string, imageInfo: ImageInfo): boolean;
        clearInfo(): void;
        getImageInfo(key: string): ImageInfo;
        createSubTexture(baseTexture: egret.Texture, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): egret.Texture;
        loadTextureAsyn(key: string, callback: core.TextureCallback): void;
        onTextureDispose(event: core.TextureEvent): void;
    }
}
declare module map {
    class MapEvent extends core.EventArgs {
        static LOAD_MAP_FINISH: string;
        userData: any;
        initObj(...args: any[]): void;
    }
    class MapManager extends core.EventSet {
        mFileName: string;
        mUserData: any;
        mResMgr: core.ResManager;
        mMapData: MapData;
        mTileMap: TileMap;
        mInputCallback: IMapInputCallback;
        mMapLayerList: MapLayerBase[];
        mbLayersOrderChange: boolean;
        m_pPathMgr: PathMgr;
        m_pLogicMask: LogicMask;
        m_pLogicBlock: LogicBlock;
        m_loadingMapPathList: string[];
        mStaticImageMap: any;
        mAreaAnimMap: any;
        mAreaParticleMap: any;
        m_bBeginLoadTileImage: any;
        m_loadingTileImageList: string[];
        initObj(...params: any[]): void;
        destory(): void;
        init(rootNode: egret.DisplayObjectContainer): void;
        private onMouseDown(evt);
        private onMouseMove(evt);
        private onMouseUp(evt);
        setInputCallback(callback: IMapInputCallback): void;
        getTileMap(): TileMap;
        getCamera(): Camera;
        onUpdate(): void;
        addLoadingTileImage(path: string): void;
        removeLoadingTileImage(path: string): void;
        getLoadingTileImageCount(): number;
        loadMap(filename: string, userData?: any): boolean;
        onLoadMapXml(xmlStr: string, mapfile: string): void;
        _loadMapMetaData(reader: BinaryStream): boolean;
        onLoadMapImp(): void;
        onLoadMapFinish(): void;
        addSpriteLayer(tag: number, layer: SpriteLayer): void;
        removeSpriteLayer(layer: SpriteLayer): void;
        private getSpriteLayer(tag);
        enterMap(sprite: SpriteBase, layerTag: number): boolean;
        leaveMap(sprite: SpriteBase): boolean;
        changeMapLayer(sprite: SpriteBase, tag: number): boolean;
        getPathMgr(): PathMgr;
        getLogicMask(): LogicMask;
        getLogicBlock(): LogicBlock;
        setStaticImage(id: number, path: string, width: number, height: number): void;
        getStaticImagePath(id: number): string;
        addAreaAnimConfig(name: string, animPath: string, animDelay: number, scale: number): void;
        getAreaAnimConfig(name: string): any;
        addAreaParticleConfig(name: string, particlePath: string): void;
        getAreaParticleConfig(name: string): any;
    }
}
declare module map {
    interface IMapInputCallback {
        onMapMouseDownEvent(event: egret.TouchEvent): void;
        onMapMouseUpEvent(event: egret.TouchEvent): void;
        onMapMouseMoveEvent(event: egret.TouchEvent): void;
    }
}
declare module core {
    interface IHttpCallback {
        onHttpResponse(url: string, data: any, userData: any): any;
        onHttpError(url: string, userData: any): any;
    }
    class HttpResult extends TClass {
        url: string;
        listen_list: any[];
        bSucceed: boolean;
        response: any;
        initObj(...params: any[]): void;
        destory(): void;
    }
    class HttpClient extends TClass {
        static FORMAT_BINARY: string;
        static FORMAT_TEXT: string;
        private mRequestId2Url;
        private mUrl2ListernList;
        private _dataFormat;
        private _recycler;
        private _resultList;
        initObj(...params: any[]): void;
        destory(): void;
        send(url: string, callback: IHttpCallback, userData?: any): void;
        cancel(callback: IHttpCallback): void;
        setDataFormat(format: string): void;
        private getRequest();
        onLoadFinish(event: egret.Event): void;
        onUpdate(): void;
    }
}
declare module map {
    function FLOOR(x: any): number;
    var EyeGridSize: number;
    enum MapLayerType {
        NullLayerType = 0,
        TileLayerType = 1,
        AdornmentLayerType = 2,
        MetaLayerType = 3,
        AreaLayerType = 4,
    }
    class MapLayerData {
        layerId: number;
        layerType: number;
        layerFileName: string;
        layerStream: BinaryStream;
        resItem: core.ResItem;
        constructor(layerId: number, layerType: number, layerFileName: string);
    }
    class MapData {
        mapId: number;
        mapName: string;
        colNum: number;
        rowNum: number;
        tileWidth: number;
        tileHeight: number;
        layerNum: number;
        layerDataList: MapLayerData[];
        constructor();
        clear(): void;
    }
}
declare module map {
    class LogicBlock extends TClass {
        bufferSize: number;
        buffer: number[];
        width: number;
        height: number;
        initObj(...params: any[]): void;
        protected destory(): void;
        static getCellX(x: number): number;
        static getCellY(y: number): number;
        static getXFromCell(x: number): number;
        static getYFromCell(y: number): number;
        InitAreaLimit(): void;
        SetBlock(x: number, y: number, block: number): void;
        ClearBlock(): void;
        IsBlock(point: any): boolean;
        IsValid(point: any): boolean;
        HaveBlock(from: any, to: any): boolean;
        FirstBlock(from: any, to: any, firstBlock: any): boolean;
        FirstNotBlock(from: any, to: any, firstNotBlock: any): boolean;
        LastBlock(from: any, to: any, lastBlock: any): boolean;
        LastNotBlock(from: any, to: any, lastNotBlock: any): boolean;
        MaxBlock(pt: any, ptDest: any): void;
    }
}
declare module map {
    class LogicFinder extends TClass {
        static MAX_NODE: number;
        distanceBuffer: number[];
        closeListBuffer: boolean[];
        openListBuffer: number[];
        private rootLink;
        private openNodeList;
        linkBuffer: any;
        iUsed: number;
        width: number;
        height: number;
        endX: number;
        endY: number;
        blockBuffer: number[];
        initObj(...params: any[]): void;
        protected destory(): void;
        ReLoad(block: LogicBlock): boolean;
        memset(buff: any[], val: any): void;
        Find(from: any, to: any, iMaxStep: number): number;
        FindNext(iMaxStep: number): number;
        judge(x: any, y: any): number;
        private addNeighborNode(x, y, h, father);
        addCloseList(x: number, y: number): void;
        removeOpenList(x: number, y: number): void;
        private addOpenList(x, y);
        private getOpenNode(x, y);
        private getOpenLowestCostNode();
        GetPoint(out: any[]): boolean;
    }
}
declare module map {
    class LogicMask extends TClass {
        bufferSize: number;
        buffer: number[];
        width: number;
        height: number;
        enable: boolean;
        initObj(...params: any[]): void;
        protected destory(): void;
        ResetMask(width: number, height: number): void;
        ReloadMask(width: number, height: number, buffer: number[]): void;
        IsMask(x: number, y: number): boolean;
        IsValid(x: number, y: number): boolean;
        SetMaskEnable(enable: boolean): void;
    }
}
declare module map {
    class LogicPath extends TClass {
        m_pBlock: LogicBlock;
        m_pPathFinder: LogicFinder;
        m_ptEnd: any;
        m_iCurThousand: number;
        m_iCurLine: number;
        m_iMaxLine: number;
        private m_pLine;
        m_iMidX: number;
        m_iMidY: number;
        m_iStartX: number;
        m_iStartY: number;
        m_iEndX: number;
        m_iEndY: number;
        m_iSpeed: number;
        m_iDropStep: number;
        m_iMaxStep: number;
        m_iStartDir: number;
        m_bIgnoreBlock: boolean;
        m_bFindNext: boolean;
        m_bSendPos: boolean;
        m_iDirNum: number;
        m_iCurrentTime: number;
        mFindPathState: number;
        m_bSended: boolean;
        m_ptLastSend: any;
        m_dwLastSendPosTime: number;
        firstUpdateTime: boolean;
        timeOffset: number;
        m_bLock: boolean;
        m_ListPoint: any[];
        initObj(...params: any[]): void;
        protected destory(): void;
        init(block: LogicBlock, finder: LogicFinder): void;
        CreatePathLine(listPoint: any[], ptStart: any, ptEnd: any, iStartDir: number, currentTime: number): void;
        UpdateTime(delay: number): void;
        UpdatePos(outValue: any): boolean;
        Clear(): void;
        SetSpeed(speed: number): void;
        GetSpeed(): number;
        private SetLine(ptEnd, iSpeed, pWalkLine);
        _GetStateIsEnd(outValue: any, currentTime: number): boolean;
    }
}
declare module map {
    enum FindPathType {
        eFindPathType_Succeed = 1,
        eFindPathType_FindNext = 2,
        eFindPathType_Fail = 3,
        eFindPathType_Findind = 4,
        eFindPathType_FindNotHandle = 5,
    }
    class PathMgr extends TClass {
        m_pPathFinder: LogicFinder;
        m_pBlock: LogicBlock;
        m_pCurLogicPath: LogicPath;
        m_bBusy: boolean;
        buffer: number[];
        initObj(...params: any[]): void;
        protected destory(): void;
        createLogicPath(): LogicPath;
        releaseLogicPath(logicPath: LogicPath): void;
        createPath(logicPath: LogicPath, from: any, to: any, dir: number, iMaxStep: number, ignoreBlock: boolean): FindPathType;
        updatePath(logicPath: LogicPath, outValue: any): FindPathType;
        clearPath(logicPath: LogicPath): void;
        getLogicBlock(): LogicBlock;
        TryNoBlockPath(from: any, to: any, ignoreBlock: boolean, outValue: any): FindPathType;
        CheckFindPathState(logicPath: LogicPath): FindPathType;
        FindPathPointList(from: any, to: any, iMaxStep: number, ignoreBlock: boolean, listPoint: any[]): FindPathType;
        FindPath(ptTrueStart: any, ptTrueEnd: any, iMaxStep: number, listPoint: any[]): FindPathType;
        FindPathNext(iMaxStep: number, listPoint: any[]): FindPathType;
        GetPathPoint(iPathLen: number, listPoint: any[]): boolean;
        ResetLogicBlock(width: number, height: number): void;
        RefreshLogicBlock(width: number, height: number, buffer: number[]): void;
    }
}
declare var g_CollectGarbage: any;
declare function CollectGarbage(): void;
declare function OverrideEgretInit(): void;
declare module RES {
    function native_init(): any;
}
declare module RES.override {
    function _init(): void;
}
declare module egret.override {
    function _init(): void;
}
declare module map {
    enum OptimizeFlag {
        OPTIMIZE_UPDATE_ONSEE = 1,
        OPTIMIZE_MOVEMENT_ONSEE = 2,
        OPTIMIZE_HIDE_ONMAXACTOR = 4,
        OPTIMIZE_LOAD_SYN = 8,
    }
    enum MoveReportFlag {
        MOVEMENT_PIXEL_CHANGED = 1,
        MOVEMENT_CELL_CHANGED = 2,
        MOVEMENT_DIR_CHANGED = 4,
        MOVEMENT_BEGIN_RUN = 256,
        MOVEMENT_STOPING = 512,
        MOVEMENT_TRACE_PATH = 1024,
        ANIM_NOTIFY = 262144,
    }
    class SpriteMovEvent extends core.EventArgs {
        static MovementEvent: string;
        actor: MovableSprite;
        pixel: {
            x: number;
            y: number;
        };
        dir: number;
        cell: {
            x: number;
            y: number;
        };
        flag: number;
        pathEnd: any[];
        pathList: any[];
        pathListMaxNum: number;
        pathListNum: number;
        walkOnPathIndex: number;
        walkOnPathThousand: number;
        initObj(...params: any[]): void;
        protected destory(): void;
        pixelChanged(): boolean;
        dirChanged(): boolean;
        cellChanged(): boolean;
        isStoping(): boolean;
        beginRun(): boolean;
    }
}
declare module core {
    enum NetWorkResultState {
        Connect = 0,
        Close = 1,
        Normal = 2,
    }
    class NetWorkResult extends TClass {
        buffer: BinaryStream;
        state: number;
        code: number;
        initObj(...params: any[]): void;
        destory(): void;
    }
    class NetConnectEvent extends EventArgs {
        code: number;
        net: NetWork;
    }
    class NetCloseEvent extends EventArgs {
        code: number;
        net: NetWork;
    }
    class NetRecvEvent extends EventArgs {
        reader: BinaryStream;
        msgLen: number;
        net: NetWork;
    }
    class NetWork extends EventSet {
        static ConnectEvent: string;
        static CloseEvent: string;
        static RecvEvent: string;
        private socket;
        private PACKET_HEADER_SIZE;
        private SHORT_SIZE;
        mRecvBuffer: BinaryStream;
        mWriteBuffer: BinaryStream;
        mRecvResultList: NetWorkResult[];
        mConnecting: boolean;
        mClosing: boolean;
        mSocketError: boolean;
        m_encrypt: boolean;
        m_decrypt: boolean;
        m_encryptSeed: number;
        m_decryptSeed: number;
        m_serialNumber: number;
        m_sendSerialNumber: boolean;
        m_initSerialNumber: boolean;
        m_encryptKey: string;
        m_decryptKey: string;
        net_temp: Uint8Array;
        initObj(...params: any[]): void;
        destory(): void;
        createSocket(): egret.WebSocket;
        destorySocket(): void;
        connect(server: string, port: number): boolean;
        disconnect(): boolean;
        isConnect(): boolean;
        beginPack(): BinaryStream;
        endPack(): boolean;
        private sendBuffer(byteArray);
        setEncrypt(encrypt: boolean, decrypt: boolean): void;
        setSeed(encryptSeed: number, decryptSeed: number): void;
        setSendSerialNumber(send: boolean): void;
        getLastErrorCode(): number;
        private onSocketOpen();
        private onSocketClose();
        private onSocketError();
        private onReceiveMessage(e);
        onUpdate(): void;
        fireNetMsg(buffer: BinaryStream): void;
    }
}
declare module map {
    class TileMap extends TClass {
        mId: number;
        mName: string;
        mTileColNum: number;
        mTileRowNum: number;
        mTileWidth: number;
        mTileHeight: number;
        mapW: number;
        mapH: number;
        mLayerList: LayerBase[];
        mCamera: Camera;
        constructor(rooNode: egret.DisplayObjectContainer);
        destory(): void;
        addLayer(layer: LayerBase): boolean;
        removeLayer(layer: LayerBase): boolean;
        removeAllLayer(): void;
        sortLayers(): void;
        setId(id: number): void;
        getId(): number;
        setName(name: string): void;
        getName(): string;
        getCamera(): Camera;
        setMapSize(tileColNum: number, tileRowNum: number, tileWidth: number, tileHeight: number): void;
        getMapWidth(): number;
        getMapHeight(): number;
        getTileColNum(): number;
        getTileRowNum(): number;
        getTileWidth(): number;
        getTileHeight(): number;
        onUpdate(): void;
        updateCameraView(): void;
    }
}
declare module map {
    class Camera extends egret.DisplayObjectContainer {
        static SCREEN_BACKGROUND: number;
        static SCREEN_FOREGROUND: number;
        mTileMap: TileMap;
        mViewRect: egret.Rectangle;
        mViewChanged: boolean;
        mContainer: egret.DisplayObjectContainer;
        mFScreenContainer: egret.DisplayObjectContainer;
        mBScreenContainer: egret.DisplayObjectContainer;
        mbAdjustView: boolean;
        mTempPoint: egret.Point;
        m_linkSprite: SpriteBase;
        mFgColorLayer: egret.Shape;
        mBgColorLayer: egret.Shape;
        mScreenEffectList: SpriteBase[];
        mBgImage: egret.Bitmap;
        mFgImage: egret.Bitmap;
        constructor(tileMap: TileMap);
        addNodeToCamera(node: egret.DisplayObject): void;
        removeNodeFromCamera(node: egret.DisplayObject): void;
        isViewChanged(): boolean;
        setViewChanged(b: boolean): void;
        setViewSize(w: number, h: number): void;
        getViewWidth(): number;
        getViewHeight(): number;
        setAdjustViewCenter(bAdjust: boolean): void;
        setViewCenter(x: number, y: number): void;
        getViewCenterX(): number;
        getViewCenterY(): number;
        getViewBeginX(): number;
        getViewBeginY(): number;
        getViewRect(): egret.Rectangle;
        getAdjustCenter(inCenterX: number, inCenterY: number, outPoint: egret.Point): egret.Point;
        adjustViewCenter(): void;
        setZoomScale(scale: number): void;
        getZoomScale(): number;
        $hitTest(stageX: number, stageY: number): egret.DisplayObject;
        stageXYToMapXY(stageX: number, stageY: number, outPoint: egret.Point): egret.Point;
        mapXYToStageXY(mapX: number, mapY: number, outPoint: egret.Point): egret.Point;
        linkMapSprite(sprite: SpriteBase): void;
        unlinkMapSprite(): void;
        updateLinkSprite(): void;
        onUpdate(): void;
        updateColor(layer: egret.Shape, a: any, r: any, g: any, b: any): void;
        setBgBlendColorEnable(enable: boolean): void;
        setBgBlendColor(a: any, r: any, g: any, b: any): void;
        setFgBlendColorEnable(enable: boolean): void;
        setFgBlendColor(a: any, r: any, g: any, b: any): void;
        _setScreenImageImp(imagePath: string, image: egret.Bitmap, parent: egret.DisplayObjectContainer): void;
        setBgImage(imagePath: string): egret.Bitmap;
        setFgImage(imagePath: string): egret.Bitmap;
        onLayersChange(): void;
        addScreenEffect(sprite: SpriteBase, layer: number): boolean;
        removeScreenEffect(sprite: SpriteBase): boolean;
        updateScreenEffect(): void;
    }
}
declare module map {
    abstract class MapAreaElemDisplayNode extends egret.DisplayObjectContainer {
        abstract initWithName(name: string): any;
        abstract clear(): void;
        positionFromRect(rect: egret.Rectangle): void;
    }
    abstract class MapAreaElemResNode extends MapAreaElemDisplayNode implements core.ResItemCallback, core.TextureCallback {
        mMapMgr: map.MapManager;
        mResMgr: core.ResManager;
        mTextureMgr: core.TextureManager;
        textureRes: core.ResItem;
        jsonRes: core.ResItem;
        constructor();
        abstract initWithName(name: string): any;
        clear(): void;
        loadTextureAndJson(texturePath: string, jsonPath: string): void;
        onAsynTextureSucceed(key: string, texture: egret.Texture, textureRes: core.ResItem): void;
        onResItemLoad(res: core.ResItem): void;
        onResItemError(key: string): void;
        checkLoadComplete(): void;
        protected onLoadComplete(): void;
    }
    class MapAreaAnimNode extends MapAreaElemResNode {
        lastTimeStamp: number;
        frames: any[];
        index: number;
        delay: number;
        during: number;
        animScale: number;
        mFramesTexture: any;
        mBitmap: egret.Bitmap;
        initWithName(name: string): void;
        clear(): void;
        positionFromRect(rect: egret.Rectangle): void;
        protected onLoadComplete(): void;
        private update(timeStamp);
    }
}
declare module map {
    class MapLayerDisplayerNode extends egret.DisplayObjectContainer {
    }
    class SpriteLayerDisplayerNode extends egret.DisplayObjectContainer {
    }
}
declare module map {
    class MapAreaElem extends TClass {
        mId: number;
        mArea: egret.Rectangle;
        mName: string;
        mType: string;
        mRefCount: number;
        mNode: MapAreaElemDisplayNode;
        mMapMgr: MapManager;
        initObj(...params: any[]): void;
        destory(): void;
        initWithParam(id: number, name: string, area: egret.Rectangle, elemType: string): void;
        onElemFound(layer: MapAreaElemLayer): void;
        onElemLost(layer: MapAreaElemLayer): void;
        clearNode(): void;
        createElemNode(objectType: string, name: string): MapAreaElemDisplayNode;
    }
}
declare module map {
    class MapAreaElemLayer extends MapLayerBase {
        mAreaElemList: MapAreaElem[];
        mGrid2ElemListMap: any;
        initObj(...params: any[]): void;
        destory(): void;
        clearAllElems(): void;
        load(stream: BinaryStream): boolean;
        initEyeshot(nMapWidth: number, nMapHeight: number, nGridWidth: number, nGridHeight: number): void;
        getMapAreaElem(nGridX: number, nGridY: number): MapAreaElem[];
        onEyeshotFound(nGridX: number, nGridY: number): void;
        onEyeshotLost(nGridX: number, nGridY: number): void;
    }
}
declare module core {
    class ResGroup extends TClass {
        name: string;
        mResItemMap: any;
        mDelayTime: number;
        mDisposeTime: number;
        mbLoaded: boolean;
        mResCallback: ResItemCallback;
        mTextureCallback: TextureCallback;
        mResGroupMgr: ResGroupManager;
        initObj(...params: any[]): void;
        destory(): void;
        addResItemConfig(path: string, type: string): void;
        setDisposeTime(time: number): void;
        onLoadComplete(): void;
        private onSingleResSucceed(res, count, all);
        load(): void;
        unload(): void;
        onUpdate(): void;
    }
}
declare module map {
    interface IEyeshotCallback {
        onEyeshotFound(nGridX: number, nGridY: number): void;
        onEyeshotLost(nGridX: number, nGridY: number): void;
    }
    class MapLayerEyeShot {
        m_pScrollSheetSink: IEyeshotCallback;
        m_nMapWidth: number;
        m_nMapHeight: number;
        m_nGridWidth: number;
        m_nGridHeight: number;
        m_nMapGridWidth: number;
        m_nMapGridHeight: number;
        m_rcViewportGrid: egret.Rectangle;
        m_rcLastDirtyGrid: egret.Rectangle;
        m_rcViewport: egret.Rectangle;
        m_bForceRefresh: boolean;
        create(pSink: IEyeshotCallback, nMapWidth: number, nMapHeight: number, nGridWidth: number, nGridHeight: number): boolean;
        getGridWidth(): number;
        getGridHeight(): number;
        getGridXCount(): number;
        getGridYCount(): number;
        getGridRect(nGridX: number, nGridY: number): egret.Rectangle;
        getGridByMapRect(mapRect: egret.Rectangle): egret.Rectangle;
        changeViewportSize(viewportWidth: number, viewportHeight: number, notify: boolean): void;
        moveViewportCenterTo(centerX: number, centerY: number): boolean;
        moveViewportTo(x: number, y: number): boolean;
        scrollViewport(dx: number, dy: number): boolean;
    }
}
declare module map {
    class MapTile extends TClass implements core.TextureCallback {
        mCellX: number;
        mCellY: number;
        mImageId: number;
        mFlag: number;
        mImage: egret.Bitmap;
        mRefCount: number;
        mPath: string;
        mMapMgr: MapManager;
        initObj(...params: any[]): void;
        destory(): void;
        setImageId(imageId: number): void;
        setFlag(flag: number): void;
        onTileFound(layer: MapTileLayer): void;
        onTileLost(layer: MapTileLayer): void;
        clearImage(): void;
        onAsynTextureSucceed(key: string, texture: egret.Texture): void;
    }
}
declare module map {
    class MapTileLayer extends MapLayerBase {
        cellSizeW: number;
        cellSizeH: number;
        cellNumW: number;
        cellNumH: number;
        mapSizeH: number;
        mapSizeW: number;
        mTileList: MapTile[];
        mTempViewInfo: any;
        initObj(...params: any[]): void;
        destory(): void;
        clearAllTiles(): void;
        load(stream: BinaryStream): boolean;
        getMapTile(x: number, y: number): MapTile;
        setCellWHAndNum(w: number, h: number, wnum: number, hnum: number): void;
        getCellW(): number;
        getCellH(): number;
        onEyeshotFound(nGridX: number, nGridY: number): void;
        onEyeshotLost(nGridX: number, nGridY: number): void;
        getVisibleCellInfo(nGridX: number, nGridY: number): void;
    }
}
declare class Application extends TClass {
    private mRootNode;
    private mStage;
    private mLastTime;
    init(rootNode: egret.DisplayObjectContainer, stage: egret.Stage): void;
    stop(): void;
    setFps(fps: number): void;
    setDebug(b: boolean): void;
    getRootNode(): egret.DisplayObjectContainer;
    getStageNode(): egret.Stage;
    onUpdate(): void;
}
declare enum UserSettingMode {
    Common = 0,
    Role = 1,
}
declare class UserSetting extends TClass {
    static TYPE_STRING: number;
    static TYPE_NUMBER: number;
    static TYPE_BOOLEAN: number;
    private mStorgeCache;
    mCommonName: string;
    mRoleName: string;
    mOperateType: number;
    initObj(...params: any[]): void;
    setOperationType(type: number): void;
    setRoleName(name: string): void;
    setCommonSetting(type: number, key: string, value: any): any;
    getCommonSetting(type: number, key: string, def?: any): any;
    setRoleSetting(type: number, key: string, value: any): any;
    getRoleSetting(type: number, key: string, def?: any): any;
    private _setSetttingStorage(mode, type, key_, value);
    private _getSettingStorage(mode, type, key_, defValue);
    _getKeyName(mode: number, key_: string): string;
}
declare module core {
    interface ResGroupCallback {
        onResGroupLoad(groupName: string): void;
    }
    class ResGroupManager extends TClass {
        private mResGroupList;
        private mGroupCallbackMap;
        initObj(...params: any[]): void;
        destory(): void;
        getGroup(groupName: string, autoCreate?: boolean): ResGroup;
        addGroupConfig(groupName: string, path: string, type: string): void;
        loadGroup(groupName: string, callback?: ResGroupCallback): void;
        unLoadGroup(groupName: string): void;
        cancelGroup(groupName: string): void;
        _onGroupLoad(groupName: string): void;
        onUpdate(): void;
    }
}
declare module map {
    enum SpriteType {
        TYPE_BONE_SPRITE = 0,
        TYPE_FRMAE_SPRITE = 1,
    }
    enum AnimReportFlag {
        ANIM_NOTIFY = 262144,
        BOUND_NOTIFY = 524288,
    }
    enum ModelLoadState {
        eLoaded = 0,
        eUnLoaded = 1,
        eLoading = 2,
        eUnLoading = 3,
    }
    class SpriteAnimEvent extends core.EventArgs {
        static AnimEvent: string;
        actor: LogicSprite;
        actionId: string;
        notify: string;
        initObj(...params: any[]): void;
        protected destory(): void;
    }
    class SpriteEvent extends core.EventArgs {
        static BoundSizeEvent: string;
        actor: LogicSprite;
        initObj(...params: any[]): void;
        protected destory(): void;
    }
    enum SpriteDisplayNodeType {
        eDisplayNode_UI = 0,
        eDisplayNode_Shadow = 1,
        eDisplayNode_Unknown = 2,
    }
}
declare module map {
    class LogicSpriteManager extends core.EventSet {
        mSpriteList: LogicSprite[];
        mModelInfoMap: any;
        mSkeletonResourceMap: any;
        mTextureResourceMap: any;
        mUnloadingResourceList: SpriteResourceBase[];
        mDisposeTime: number;
        mRelaseSpriteList: LogicSprite[];
        initObj(...params: any[]): void;
        destory(): void;
        createSprite(type: number): LogicSprite;
        removeSprite(sprite: LogicSprite): void;
        defineModelPath(modelName: string, path: string, isbin: boolean): void;
        getFrameTextureResource(modelName: any): FrameSpriteTextureResource;
        getFrameSpriteInfoResource(modelName: string): FrameSpriteInfoResource;
        addUnloadingResource(res: SpriteResourceBase): void;
        removeUnloadingResource(res: SpriteResourceBase): void;
        setAutoDisposeTime(disposeTime: number): void;
        cleanUpCacheRes(): void;
        onUpdate(bForce?: boolean): void;
    }
}
declare module map {
    class SortSpriteLayer extends map.SpriteLayer {
        mCacheHashCodeList: number[];
        initObj(...params: any[]): void;
        destory(): void;
        protected onRenderSpriteList(cam: map.Camera): void;
    }
}
declare module core {
    class ResItem extends TClass {
        mKey: string;
        mData: any;
        mPath: string;
        mFromZip: boolean;
        initObj(...params: any[]): void;
        destory(): void;
        getKey(): string;
        getData(): any;
    }
}
declare module map {
    class FrameSprite extends map.LogicSprite implements FrameSpriteAnimListener {
        mSpriteInfoResource: FrameSpriteInfoResource;
        mTextureResource: FrameSpriteTextureResource;
        mSpriteAnimation: FrameSpriteAnim;
        mSpriteDisplay: FrameSpriteDisplay;
        mbSpriteDisplayLoaded: boolean;
        mJoinPartsTarget: FrameSprite;
        mTransfromProxy: FramSpriteBodyPartDisplayProxy;
        initObj(...params: any[]): void;
        destory(): void;
        getSpriteTexture(): FrameSpriteTextureResource;
        getSpriteDisplay(): FrameSpriteDisplay;
        setTransfromProxy(proxy: FramSpriteBodyPartDisplayProxy): void;
        getTransformProxy(): FramSpriteBodyPartDisplayProxy;
        joinBodyPartsTo(target: FrameSprite): void;
        restoreBodyParts(): void;
        onAnimationEvent(event: string): void;
        onAnimationIndexChange(actionId: string, index: number): void;
        private getSpriteInfo();
        private _clearArmature();
        private _createArmature();
        private _loadTextureResource();
        private _unLoadTextureResource();
        _loadSkeletonResource(): void;
        _unLoadSkeletonResource(): void;
        private _updateAnimation();
        private _updateTexture();
        private _updateBound();
        private _addChidNode(boneName, sprite, order, bTransform?);
        protected _removeChildNode(sprite: FrameSprite): void;
        private _updateDirChange(bForce?);
        onCameraFound(): void;
        onCameraLost(): void;
        protected onMoveDirChange(dirIndex: number): boolean;
        changePartSkin(partName: string, show: string): void;
        changeSkin(skinPath: string): void;
        getSkinName(): string;
        setPositionOffset(x: number, y: number): void;
        protected _updateAlpha(): void;
        protected _updateScale(): void;
        protected _updateRotate(): void;
        protected _updateModel(): void;
        hasActionId(actionId: string): boolean;
        getAnimation(): FrameSpriteAnim;
    }
}
declare module map {
    interface FrameSpriteAnimListener {
        onAnimationEvent(event: string): any;
        onAnimationIndexChange(actionId: string, frameIndex: number): any;
    }
    class FrameSpriteAnim extends TClass {
        mListener: FrameSpriteAnimListener;
        mActionId: string;
        mLoop: boolean;
        mAnimSpeed: number;
        mbPause: boolean;
        mFrameIndex: number;
        mCurIntervalTime: number;
        mAnimChanged: boolean;
        mCurAnimInfo: FrameSpriteAnimInfo;
        mSpriteInfo: FrameSpriteInfo;
        initObj(...params: any[]): void;
        destory(): void;
        loadModelAnim(spriteInfo: FrameSpriteInfo): void;
        unloadAnim(): void;
        changeAction(actionId: string, loop: boolean): void;
        getActionId(): string;
        setAnimSpeed(speed: number): void;
        setPause(pause: boolean): void;
        getAnimationInfoByIndex(index: number): FrameSpriteAnimInfo;
        getAnimationInfo(actionId: string): FrameSpriteAnimInfo;
        getCurAnimationInfo(): FrameSpriteAnimInfo;
        onUpdate(): void;
    }
}
declare module map {
    class FramSpriteBodyPartDisplayBase extends egret.DisplayObjectContainer {
        mActionId: string;
        mDirIndex: number;
        mFrameIndex: number;
        mPartName: string;
        mPartShowName: string;
        mOrder: number;
        constructor();
        setDispalyParent(parent: egret.DisplayObjectContainer, childIndex?: number): void;
        setDirIndex(dir: number): void;
        setAction(actionId: string): void;
        setFrameIndex(index: number): void;
        setPartShow(show: string): void;
        setVisible(b: boolean): void;
        setOrder(order: number): void;
        getOrder(): number;
        updateDislay(): void;
    }
    class FramSpriteBodyPartDisplayBitmap extends FramSpriteBodyPartDisplayBase {
        mLogicSprite: FrameSprite;
        mBodyPartInfo: FrameSpriteBodyPartInfo;
        mBitmap: egret.Bitmap;
        constructor();
        initWithParam(parent: FrameSprite, bodyPartInfo: FrameSpriteBodyPartInfo): void;
        setAction(actionId: string): void;
        setDirIndex(dir: number): void;
        updateDislay(): void;
        $measureChildBounds(bounds: egret.Rectangle): void;
    }
    class FramSpriteBodyPartDisplayProxy extends FramSpriteBodyPartDisplayBase {
        mLogicSprite: FrameSprite;
        mSpriteDisplay: FrameSpriteDisplay;
        mSpriteAnim: FrameSpriteAnim;
        constructor();
        initWithParam(parent: FrameSprite): void;
        setDirIndex(dir: number): void;
        setAction(actionId: string): void;
        setFrameIndex(index: number): void;
        updateDislay(): void;
    }
    class FrameSpriteDisplay extends egret.DisplayObjectContainer {
        mLogicSprite: FrameSprite;
        mBodyPartDisplayList: FramSpriteBodyPartDisplayBase[];
        mAnimation: FrameSpriteAnim;
        mRestoreBodyPartDisplayList: FramSpriteBodyPartDisplayBase[];
        mRestoreSpriteDisplay: FrameSpriteDisplay;
        mActionId: string;
        mDirIndex: number;
        mFrameIndex: number;
        constructor();
        loadModelInfo(parent: FrameSprite, spriteInfo: FrameSpriteInfo): void;
        setDirIndex(dir: number): void;
        setActionAndFrameIndex(actionId: string, index: number): void;
        setPartShow(partName: string, show: string): void;
        restoreBodyPartDisplay(): void;
        joinBodyPartDisplayTo(target: FrameSpriteDisplay): void;
        addBodyPartDisplay(display: FramSpriteBodyPartDisplayBase): boolean;
        removeBodyPartDisplay(display: FramSpriteBodyPartDisplayBase): boolean;
        clearBodyPartDisplay(): void;
        updateDisplay(): void;
    }
}
declare module map {
    class FrameSpriteAnimInfo extends TClass {
        name: string;
        frameCount: number;
        timeInterval: number;
        eventName: string;
        eventFrameIndex: number;
        dirs: number[];
        initObj(...params: any[]): void;
        isDirectionExsit(dir: number): boolean;
    }
    class FrameSpriteBodyPartInfo extends TClass {
        name: string;
        partShowList: string[];
        dirsOrder: {
            [key: number]: number;
        };
        defaultOrder: number;
        defaultShow: string;
        offx: number;
        offy: number;
        initObj(...params: any[]): void;
        destory(): void;
    }
    class FrameSpriteInfo extends TClass {
        name: string;
        mBodyPartInfoList: FrameSpriteBodyPartInfo[];
        mAnimationList: FrameSpriteAnimInfo[];
        initObj(...params: any[]): void;
        destory(): void;
        loadWithJson(rawData: any): void;
        addBodyPart(name: string, order: number): FrameSpriteBodyPartInfo;
        addBodyPartShow(parname: string, showname: string): void;
        getBodyPartInfo(name: string): FrameSpriteBodyPartInfo;
        addAnimation(anim: string, dirs: number[], interval: number, frameCount: number, eventName?: string, eventFrameIndex?: number): FrameSpriteAnimInfo;
        getFrameAnimInfo(anim: string): FrameSpriteAnimInfo;
    }
}
declare module map {
    class FrameSpriteInfoResource extends SpriteResourceBase implements core.ResItemCallback {
        modelJsonPath: string;
        mFrameSpriteInfo: FrameSpriteInfo;
        mBasePath: string;
        initObj(...params: any[]): void;
        protected destory(): void;
        getSpriteInfo(): FrameSpriteInfo;
        protected _loadImp(): void;
        protected _unloadImp(): void;
        _cancelLoadImp(): void;
        onResItemLoad(res: core.ResItem): void;
        onResItemError(key: string): void;
    }
    class FrameSpriteTextureResource extends SpriteResourceBase implements core.ResItemCallback, core.TextureCallback {
        mTextureResMap: {
            [key: string]: {
                textureRes: core.ResItem;
                jsonRes: core.ResItem;
                bloading: boolean;
            };
        };
        mTextureAtlasMap: {
            [key: string]: egret.Texture;
        };
        mBasePath: string;
        modelJsonPath: string;
        initObj(...params: any[]): void;
        protected destory(): void;
        getTexture(name: string): egret.Texture;
        isAnimTextureLoaded(animName: string): boolean;
        requestLoadAnimTexture(animName: string): void;
        protected _loadImp(): void;
        protected _unloadImp(): void;
        _cancelLoadImp(): void;
        onResItemLoad(res: core.ResItem): void;
        onResItemError(key: string): void;
        onAsynTextureSucceed(key: string, texture: egret.Texture, textureRes: core.ResItem): void;
        private _getTexturePath(path);
        private _getTextureJsonPath(path);
        private _checkLoadComplete();
        private _createTextureAtlas(res);
    }
}
declare module core {
    class SdkResultEvent extends core.EventArgs {
        code: number;
        params: string;
        initObj(...params: any[]): void;
        protected destory(): void;
    }
    class GameSdk extends core.EventSet {
        static SHARE_STATUS_CHANGE: string;
        static SHARE_RETURN: string;
        static ATTENTION_STATUS_CHANGE: string;
        static PAY_SDK_EVENT: string;
        static LoginEvent: string;
        static NOT_SUPPORT_ATTENTION: number;
        static NOT_ATTENTION: number;
        static AREADY_ATTENTION: number;
        static sCmdLine: string;
        static sMainClass: string;
        mCmdListValueList: any;
        mConfig: core.ConfigFile;
        mInterGameSdk: InterfaceGameSdk;
        mSupportInvite: boolean;
        mAttentionStatus: number;
        _loginSuccessAppead: string;
        static staticInit(cmdline: string, className: string): void;
        initSdk(json: string): void;
        private initCmdLine();
        getFromCmdLine(key: string): string;
        getStringConfigDef(key: string, def?: string): string;
        getBoolConfigDef(key: string, def?: boolean): boolean;
        reportRoleCreate(serverinfo: any, roleinfo: any): boolean;
        reportRoleLogin(serverinfo: any, roleinfo: any): boolean;
        reportFirstEnter(): boolean;
        reportPayReturn(serverinfo: any, roleinfo: any, payInfo: any): boolean;
        canInvite(): boolean;
        setSupportInvite(invite: boolean): void;
        setAttentionStatus(value: number): void;
        getAttentionStatus(): number;
        canShowAttention(): boolean;
        onLoginReturn(ret: number, params: string): void;
        onInviteReturn(finish: boolean): void;
        onPayReturn(result: number, params: string): void;
        callLogin(params: string): boolean;
        callPay(itemparams: string): boolean;
        callShowShare(params: string): boolean;
        callShowAttention(params: string): boolean;
        callSdk(strFun: string, param?: string): void;
        callRuntimeInterface(eventName: string, param: string): void;
        callEventToGame(eventName: string, param: string): void;
    }
}
declare module core {
    class GameSdkUtil {
        static splitHttpParams(line: string): any;
        static httpParamsToString(params: any): string;
        static getOSTime(): number;
        static toNumber(v: any, def?: number): number;
    }
}
interface InterfaceGameSdk {
    initSdk(): boolean;
    login(params: string): boolean;
    pay(itemparams: string): boolean;
    showShare(params: string): boolean;
    showAttention(params: string): boolean;
    reportRoleCreate(serverinfo: any, roleinfo: any): boolean;
    reportRoleLogin(serverinfo: any, roleinfo: any): boolean;
    reportFirstEnter(): boolean;
    reportPayReturn(serverinfo: any, roleinfo: any, payInfo: any): boolean;
    callSdk(fun: string, param: string): void;
}
