// TypeScript file

class UITabWndList extends TClass {

    mLayoutNode: gui.LayoutNode;
    mElemList: any;
    tabName: string;
    subWndList: any[];

    selectedCallback:Function;
    selectedCallbackObj:any;
    radioGroup: eui.RadioButtonGroup;

    public initObj(...args: any[]): void {
        this.mLayoutNode = args[0]
        this.mElemList = args[1]
        this.subWndList = checkNull(args[2], [])  // {name:tabName, wnd:wnd}
        this.tabName = null
        TLog.Assert(Array.isArray(this.subWndList))

        let radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup;
        radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onTabSelected, this);

        this.radioGroup = radioGroup
        if (this.subWndList.length > 0) {
            for (let v of this.subWndList) {
                //TLog.Assert(v.wnd != null)

                let radioBtn = <eui.RadioButton>this.mElemList[v.name]
                radioBtn.group = radioGroup;
                radioBtn.value = v.name;
            }

            this.tabName = this.subWndList[0].name
            this.mElemList[this.tabName].selected = true
        }
    }

    destory() {
        this.radioGroup = null
    }


    private _getWndWithName(index: string) {
        for (let v of this.subWndList) {
            if (v.name == index) {
                return v.wnd
            }
        }

        return null;
    }

    private _getSubWithName(index: string) {
        for (let v of this.subWndList) {
            if (v.name == index) {
                return v
            }
        }

        return null;
    }

    onTabSelected(event: egret.Event) {
        var radioGroup: eui.RadioButtonGroup = event.target;
        let radiobtn = radioGroup.selection

        let name = radiobtn.name
        let [enable, tips] = CheckMainFrameFunction(name)
        if (!enable) {
            MsgSystem.addTagTips(tips)
            return
        }

        let subInfo = this._getSubWithName(name)
        if (subInfo.check) {
            if (subInfo.check.call(subInfo.obj)) {
                this.changeTab(radiobtn.value)
            } else {
                this.changeTab(this.tabName)
            }
        } else {
            this.changeTab(radiobtn.value)
        }

        if(this.selectedCallbackObj){
            this.selectedCallback.call(this.selectedCallbackObj, event)
        }
        
    }

    setSelectedCallback(callback:Function, obj:any) {
        this.selectedCallback = callback
        this.selectedCallbackObj = obj
    }


    ////////////////////公共接口///////////////////////////////

    setTabVisible(numbIndex: number, b: boolean) {

        let info = this.subWndList[numbIndex]
        if (info) {
            let radioBtn: eui.RadioButton = this.mElemList[info.name]
            UiUtil.setVisible(radioBtn, b, b)
        }
    }

    setWndVisible(b: boolean) {
        let wnd = this._getWndWithName(this.tabName);
        if (wnd) {
            if (b) {
                this.mElemList[this.tabName].selected = true
                wnd.showWnd()
            } else {
                wnd.hideWnd();
            }
        }
    }

    //radiobtn传入控件名
    changeTab(index: string, forceShow?: boolean) {
        if (forceShow == null || forceShow == false) {
            if (index == this.tabName && this.mElemList[this.tabName]) {
                this.mElemList[this.tabName].selected = true
                return;
            } else if (index == this.tabName || this.mElemList[this.tabName] == null) {
                return;
            }
        }

        let wnd = this._getWndWithName(this.tabName);
        this.mElemList[this.tabName].selected = false
        if (wnd) {
            wnd.hideWnd();
        }

        this.tabName = index;
        this.mElemList[this.tabName].selected = true
        wnd = this._getWndWithName(this.tabName)
        if (wnd) {
            wnd.showWnd();
        }
    }


    //数字索引，以0开头
    changeTabWithIndex(numbIndex: number) {
        if (numbIndex < 0) {
            return;
        }

        let info = this.subWndList[numbIndex]
        if (info) {
            this.changeTab(info.name)
        }
    }


    getTabIndex() {
        let index = -1;
        for (let i = 0; i < this.subWndList.length; i++) {
            let v = this.subWndList[i]
            if (v.name == this.tabName) {
                index = i
                break;
            }
        }
        return index;
    }

    getTabName() {
        return this.tabName;
    }

    getWndWithIndex(numbIndex: number) {
        if (numbIndex < 0) {
            return;
        }

        let info = this.subWndList[numbIndex]
        if (info) {
            return this._getWndWithName(info.name)
        }
        return null;
    }

    getCurrentWnd() {
        return this._getWndWithName(this.tabName)
    }

    insertTabWnd(name, wnd) {                       //name为radio按钮的mElemList里的索引，wnd为对应wndCtrl
        // let index = -1
        // for (var k in this.subWndList) {            // {name:tabName, wnd:wnd}
        //     var v = this.subWndList[k];
        //     if (v.name == name) 
        //         index = tonumber(k);
        // }
        
        this.tabName = checkNull(this.tabName, name)
        // if (index >= 0) {                           //存在
        //     this.changeTab(this.tabName)
        //     return
        // }

        let radioBtn = <eui.RadioButton>this.mElemList[name]
        radioBtn.group = this.radioGroup;
        radioBtn.value = name;

        // this.radioGroup.$addInstance(radioBtn)
        table_insert(this.subWndList, {name: name, wnd: wnd})

        this.changeTab(this.tabName)
    }

    removeTabWnd(name) {                       //name为radio按钮的mElemList里的索引
        let index = -1
        for (var k in this.subWndList) {            // {name:tabName, wnd:wnd}
            var v = this.subWndList[k];
            if (v.name == name) 
                index = tonumber(k);
        }
    
        if (index < 0) {                           //不存在
            return
        }

        let radioBtn = <eui.RadioButton>this.mElemList[name]
        radioBtn.group = null;
        radioBtn.groupName = null;

        // this.radioGroup.$removeInstance(radioBtn)

        JsUtil.arrayRemove(this.subWndList, index);
        if (radioBtn.selected == true) {
            this.changeTabWithIndex(0)
        }
    }

    clearTabWnd() {
        for (let k in this.subWndList) {
            let name = this.subWndList[k].name
            let radioBtn = <eui.RadioButton>this.mElemList[name]
            radioBtn.group = null;
            radioBtn.groupName = null;
            radioBtn.selected = false

            let wnd = this.subWndList[k].wnd
            if (wnd) {
                wnd.hideWnd()
            }
        }
        this.subWndList = []
        this.tabName = null
    }

    // initTabGroupHandle() {
    //     if (this.radioGroup) {
    //         let func = function() {
    //             this.radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onTabSelected, this);
    //         }
    //         DelayEvecuteFunc(0, func, this)
    //     }
    // }
}