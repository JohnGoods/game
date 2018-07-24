// TypeScript file
class UIPetListBox extends TClass {
    mParentNode: eui.Component;
    parentWnd: any;
    //scroll: UIScrollList;
    mElemList: any;
    mCallbackFunc: Function;
    mCallbackObj: any;
    mCallbackData: any;
    oldPetList: any;
    petlist: any[];
    select: number

    euiList:eui.List;
    euiScroll:gui.Scroller;
    dotTipsPetList:number[];

    public initObj(...args: any[]): void {
        this.mParentNode = args[0]
        let name = args[1]
        let x = args[2]
        let y = args[3]
        let w = args[4]
        let h = args[5]

        this.parentWnd = args[6]

        this.mElemList = {}
        this.select = 0 //默认

        this.petlist = []
        this.dotTipsPetList = [];

        // this.scroll = UIScrollList.newObj(this.mParentNode, "scroll" + name, x, y, w, h, this.parentWnd, UIScrollList.DIR_HORIZON)
        // this.scroll.scroller.addEventListener(egret.Event.CHANGE, this.scrollOnMove, this)

        let mElemInfo: any = [
            { ["index_type"]: eui.List, ["name"]: "list" + name, ["w"] : w ,["h"] : h, ["event_name"]: null, ["fun_index"]: null },
            {["index_type"] : gui.Scroller,	      ["name"] : "scoll" + name,    ["viewport"]:"list" + name,		["x"] : x, ["y"] : y,		["w"] : w ,["h"] : h, ["event_name"] : null, ["fun_index"] :null},		
        ]
        UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, this.parentWnd)

        this.euiList = this.mElemList["list"+name]
        this.euiList.itemRenderer = itemRender.UiPetItem
        this.euiList.layout = new eui.HorizontalLayout();

        this.euiScroll = this.mElemList["scoll"+name]
        this.euiScroll.addEventListener(egret.Event.CHANGE, this.scrollOnMove, this)



        //RegisterEvent(EventDefine.PET_UPDATE, this.setPetList, this)
        //RegisterEvent(EventDefine.PET_LIST_UPDATE, this.setPetList, this)
    }

    // _initItemWindow(window, k) {
    //     let name = window.name

    //     if (!this.mElemList["group_" + name]) {
    //         let ElemInfo = [
    //             { ["index_type"]: eui.Group, ["name"]: "group_" + name, ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 150 },
    //             { ["index_type"]: eui.Group, ["name"]: "petwnd_" + name, ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 150 },
    //             // { ["index_type"]: gui.RichDisplayer, ["name"]: "nameRd_" + name, ["parent"]: "group_" + name, ["x"]: 0, ["y"]: 90, ["w"]: 100, ["h"]: 25, ["messageFlag"]: true },
    //             { ["index_type"]: eui.Label, ["name"]: "nameRd_" + name, ["parent"]: "group_" + name, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.yellow, ["x"]: 0, ["y"]: 80, ["w"]: 100, ["h"]: 25, ["messageFlag"]: true },
    //             { ["index_type"]: eui.Label, ["name"]: "lv_" + name, ["parent"]: "group_" + name, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.yellow, ["x"]: 0, ["y"]: 105, ["w"]: 100, ["h"]: 25, ["messageFlag"]: true },
    //         ]
    //         UiUtil.createElem(ElemInfo, this.mParentNode, this.mElemList, this, window)

    //         this.mElemList["petBox_" + name] = UIPetBox.newObj(this.mParentNode, "petBox_" + name, 8, 0, this.mElemList["petwnd_" + name])
    //         this.mElemList["petBox_" + name].setClickListner(this.onPetCallBack, this, k)
    //     }
    // }

    // _refreshItemWindow(window, entry, index) {
    //     let name = window.name
    //     let data = PetSystem.getInstance().getPetEntryInfo(entry)
    //     let netData = PetSystem.getInstance().getPetInfo(entry)

    //     let petId = data.Id
    //     let petName = data.name
    //     let quality = data.quality

    //     this.mElemList["petBox_" + name].select(false)

    //     //更新
    //     this.mElemList["petBox_" + name].updateByEntry(entry)

    //     // this.mElemList["nameRd_" + name].setAlignFlag(gui.Flag.H_CENTER)
    //     // let color = GetQualityColorStr(quality)
    //     // AddRdContent(this.mElemList["nameRd_" + name], petName, "ht_20_cc_stroke", color)
    //     let nameLabel: eui.Label = this.mElemList["nameRd_" + name]
    //     nameLabel.textColor = GetQualityColorGui(quality)
    //     nameLabel.text = petName

    //     this.mElemList["lv_" + name].text = ""

    //     //更新网络
    //     this.mElemList["petBox_" + name].setEnable(false)
    //     if (netData) {
    //         //激活
    //         this.mElemList["petBox_" + name].setEnable(true)

    //         let petLevel = netData.stage
    //         this.mElemList["lv_" + name].text = "Lv." + petLevel

    //         if (netData.name != null && netData.name != "") {
    //             petName = netData.name
    //             //AddRdContent(this.mElemList["nameRd_" + name], petName, "ht_20_cc_stroke", color)
    //             //nameLabel.textColor = GetQualityColorGui(quality)
    //             nameLabel.text = petName
    //         }
    //     }
    // }

    onPetCallBack(entryId) {

        let index = this.petlist.indexOf(entryId);

        if (this.select == index) return true;

        this.select = index
        this.refreshPetListInternval()

        // let max = size_t(this.petlist)
        // for (let i = 0; i < max; i++) {
        //     let [window, flag] = this.scroll.getItemWindow(i, 100, 150, 0, 0, 0)
        //     let name = window.name
        //     this.mElemList["petBox_" + name].select(false)
        //     if (this.select == i) {
        //         this.mElemList["petBox_" + name].select(true)
        //     }
        // }

        if (this.mCallbackFunc && this.mCallbackObj) {
            this.mCallbackFunc.call(this.mCallbackObj, this.petlist[this.select])
            this.mCallbackObj.refreshDotTips()
        }

        return true
    }

    getSelectPetId() {
        return this.petlist[this.select]
    }

    clearPetList() {
        this.petlist = []
    }

    /////////////////////////////////////////////////////////////////////////////
    setPetList() {
        this.oldPetList = this.petlist

        this.petlist = []
        let list = []
        let activeList = PetSystem.getInstance().getPetActiveList()
        let tiredlist = PetSystem.getInstance().getPetTiredList()
        table_merge(list, activeList)
        table_merge(list, tiredlist)
        this.petlist = list

        return this.updateBoxWithList()
    }

    //获取神宠
    setGodPetList() {
        this.oldPetList = this.petlist

        this.petlist = []
        let list = PetSystem.getInstance().getPetGodList()
        this.petlist = list

        return this.updateBoxWithList()
    }

    refreshPetListInternval(){
        
        let dataList = []
        for (let i = 0; i < this.petlist.length; i++) {
            let entry = this.petlist[i]
            let bDotTips = this.dotTipsPetList.indexOf(entry) != -1

            let info:any = {}
            info.entry = entry;
            info.parent = this;
            info.bSelect = this.select == i;
            info.bDotTips = bDotTips;

            dataList.push(info);
        }
        UiUtil.updateList(this.euiList, dataList);
    }

    updateBoxWithList() {
        //更新拥有
        let max = size_t(this.petlist)
        // for (let i = 0; i < max; i++) {
        //     let v = this.petlist[i]
        //     let [window, flag] = this.scroll.getItemWindow(i, 100, 150, 0, 0, 0)
        //     if (flag == true) {
        //         this._initItemWindow(window, i)
        //     }
        //     this._refreshItemWindow(window, v, i)
        // }
        // this.scroll.refreshScroll()

        

        this.checkLeft()
        this.checkRight()

        // for (let i = 0; i < 5; i++) {
        //     let [window, flag] = this.scroll.getItemWindow(i, 100, 150, 0, 0, 0)
        //     this.mElemList["petBox_" + window.name].updateByEntry(this.petlist[i])
        // }

        //更新选中
        let isMove = true
        if (this.oldPetList[this.select]) {
            for (let i = 0; i < max; i++) {
                let v = this.petlist[i]
                if (this.oldPetList[this.select] == v) {
                    if (this.select == i) {
                        isMove = false
                    }
                    this.select = i
                    break
                }
            }
        } else {
            for (let i = 0; i < max; i++) {
                let v = this.petlist[i]
                let petInfo = PetSystem.getInstance().getPetInfo(v)
                if (petInfo && (petInfo.combatpos != opPetCombatPos.Rest)) {
                    let combatList = PetSystem.getInstance().getEmbattlePosList()
                    if (combatList[opPetCombatPos.Battle]) {
                        if (v == combatList[opPetCombatPos.Battle].entryid) {
                            this.select = i
                        }
                    } else if (combatList[opPetCombatPos.Prepare1]) {
                        if (v == combatList[opPetCombatPos.Prepare1].entryid) {
                            this.select = i
                        }
                    } else if (combatList[opPetCombatPos.Prepare2]) {
                        if (v == combatList[opPetCombatPos.Prepare2].entryid) {
                            this.select = i
                        }
                    }
                }
            }
        }
        this.refreshPetListInternval()
        // let [window, flag] = this.scroll.getItemWindow(this.select, 100, 150, 0, 0, 0)
        // this.mElemList["petBox_" + window.name].select(true)
        if (isMove) {
            this.moveToScrollIndex(this.select, false)
        }

        return this.petlist[this.select]
    }

    setClickListner(func, obj) {
        this.mCallbackFunc = func
        this.mCallbackObj = obj
    }

    rightMove() {
        let elem = <eui.Scroller>this.euiScroll
        let moveDis = elem.viewport.scrollH
        let index = Math.floor(moveDis / 100)
        let limit = size_t(this.petlist)
        let moveTo = ((index + 6) > limit) ? (limit - 5) : (index + 5)
        this.moveToScrollIndex(moveTo, true)
    }


    moveToScrollIndex(index, anim){
        let part = 6 //间隔

        let x = index * (part + 100);
        let y = 0;
        this.euiScroll.scrollToXY(x, y, anim)
    }

    leftMove() {
        let part = 6 //间隔

        let elem = <eui.Scroller>this.euiScroll
        let moveDis = elem.viewport.scrollH
        let index = Math.floor(moveDis / (100 + part))
        let moveTo = (index - 5) < 0 ? 0 : (index - 5)

        if (moveTo > size_t(this.petlist) - 5) {
            moveTo = size_t(this.petlist) - 5
        }
        this.moveToScrollIndex(moveTo, true)
    }

    refreshPetDotTips(wnd: BaseWnd, index) {
        this.dotTipsPetList = [];
        for (let i in this.petlist) {
            let petId = this.petlist[i]

            let check = false
            if (index == 0) { //宠物升级
                check = GuideFuncSystem.getInstance().checkPetUpgradeWnd(petId)
            } else if (index == 1) { //宠物技能
                check = GuideFuncSystem.getInstance().checkPetSkillWnd(petId)
            }

            if (GuideFuncSystem.getInstance().checkPetFullLv(petId)) {
                check = false
            }

            if (check) {
                // let [window, flag] = this.scroll.getItemWindow(tonumber(i), 100, 150, 0, 0, 0)
                // wnd.createDotTipsUI(this.mElemList["petBox_" + window.name].rootWnd)
                if(this.dotTipsPetList.indexOf(petId) == -1){
                    this.dotTipsPetList.push(petId)
                }
            }
        }

        this.refreshPetListInternval();
        this.scrollOnMove(null)
    }

    scrollOnMove(event: egret.TouchEvent) {
        this.checkLeft()
        this.checkRight()
    }

    checkLeft() {
        let elem = <eui.Scroller>this.euiScroll
        let moveDis = elem.viewport.scrollH
        let index = (Math.floor(moveDis / 103) - 1) || 0

        let wnd = WngMrg.getInstance().getWindow("PetFrame")
        let isHide = true

        for (let i = 0; i < index; i++) {
            let petId = this.petlist[i]
            let petInfo = PetSystem.getInstance().getPetInfo(petId)

            if (GuideFuncSystem.getInstance().checkPetActive(petId)) {
                wnd.createDotTipsUI(wnd.mElemList["top_left_btn"])
                isHide = false
                return
            }

            if (!petInfo) {
                continue
            }

            let combatList = PetSystem.getInstance().getEmbattlePosList()
            if (size_t(combatList) < 3 && petInfo.combatpos == opPetCombatPos.Rest) {
                wnd.createDotTipsUI(wnd.mElemList["top_left_btn"])
                isHide = false
                return
            }

            if (GuideFuncSystem.getInstance().checkPetUpgrade(petId)) {
                wnd.createDotTipsUI(wnd.mElemList["top_left_btn"])
                isHide = false
                return
            }

            if (GuideFuncSystem.getInstance().checkPetNaturl(petId)) {
                wnd.createDotTipsUI(wnd.mElemList["top_left_btn"])
                isHide = false
                return
            }
        }

        if (isHide) {
            wnd.hideDotTipsUI(wnd.mElemList["top_left_btn"])
        }

        if (moveDis < 5) {
            wnd.mElemList["top_left_btn"].visible = false
        } else {
            wnd.mElemList["top_left_btn"].visible = true
        }
    }

    checkRight() {
        let elem = <eui.Scroller>this.euiScroll
        let moveDis = elem.viewport.scrollH
        let index = (Math.floor(moveDis / 103) + 5) || 0

        // if (this.petlist[index]) {
        //     let [window, flag] = this.scroll.getItemWindow(index, 100, 150, 0, 0, 0)
        //     this.mElemList["petBox_" + window.name].updateByEntry(this.petlist[index])
        // }

        let wnd = WngMrg.getInstance().getWindow("PetFrame")
        let isHide = true

        for (let i = index; i <= size_t(this.petlist) - 1; i++) {
            let petId = this.petlist[i]
            let petInfo = PetSystem.getInstance().getPetInfo(petId)

            if (GuideFuncSystem.getInstance().checkPetActive(petId)) {
                wnd.createDotTipsUI(wnd.mElemList["top_right_btn"])
                isHide = false
                return
            }

            if (!petInfo) {
                continue
            }

            let combatList = PetSystem.getInstance().getEmbattlePosList()
            if (size_t(combatList) < 3 && petInfo.combatpos == opPetCombatPos.Rest) {
                wnd.createDotTipsUI(wnd.mElemList["top_right_btn"])
                isHide = false
                return
            }

            if (GuideFuncSystem.getInstance().checkPetUpgrade(petId)) {
                wnd.createDotTipsUI(wnd.mElemList["top_right_btn"])
                isHide = false
                return
            }

            if (GuideFuncSystem.getInstance().checkPetNaturl(petId)) {
                wnd.createDotTipsUI(wnd.mElemList["top_right_btn"])
                isHide = false
                return
            }
        }

        if (isHide) {
            wnd.hideDotTipsUI(wnd.mElemList["top_right_btn"])
        }

        if (moveDis >= (elem.viewport.contentWidth - 520 - 5)) { //elem.viewport.width
            wnd.mElemList["top_right_btn"].visible = false
        } else {
            wnd.mElemList["top_right_btn"].visible = true
        }
    }
}    



module itemRender {
    export class UiPetItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = "item"

            let ElemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group_" + name, ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 150 },
                { ["index_type"]: eui.Group, ["name"]: "petwnd_" + name, ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 150 },
                // { ["index_type"]: gui.RichDisplayer, ["name"]: "nameRd_" + name, ["parent"]: "group_" + name, ["x"]: 0, ["y"]: 90, ["w"]: 100, ["h"]: 25, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "nameRd_" + name, ["parent"]: "group_" + name, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.yellow, ["x"]: 0, ["y"]: 80, ["w"]: 100, ["h"]: 25, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "lv_" + name, ["parent"]: "group_" + name, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.yellow, ["x"]: 0, ["y"]: 105, ["w"]: 100, ["h"]: 25, ["messageFlag"]: true },
            ]
            UiUtil.createElem(ElemInfo, this, this.mElemList, this)

            this.mElemList["petBox_" + name] = UIPetBox.newObj(this, "petBox_" + name, 8, 0, this.mElemList["petwnd_" + name])
            this.mElemList["petBox_" + name].setClickListner(this.onPetCallBack, this)

            let petBox:UIPetBox = this.mElemList["petBox_" + name];

            let dotElemInfo = [
                { ["index_type"]: eui.Image, ["name"]: "btnTips", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: -5, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
            ]
            petBox.createElem(dotElemInfo, this.mElemList, this );
            
        }


    

        protected dataChanged(): void {
            let v = this.data;
            let entry = v.entry
            let parent = v.parent
            let bSelect = v.bSelect
            let bDotTips = v.bDotTips


            let name =  "item"
            let data = PetSystem.getInstance().getPetEntryInfo(entry)
            let netData = PetSystem.getInstance().getPetInfo(entry)

            let petId = data.Id
            let petName = data.name
            let quality = data.quality

            this.mElemList["petBox_" + name].select(false)

            //更新
            this.mElemList["petBox_" + name].updateByEntry(entry)

            // this.mElemList["nameRd_" + name].setAlignFlag(gui.Flag.H_CENTER)
            // let color = GetQualityColorStr(quality)
            // AddRdContent(this.mElemList["nameRd_" + name], petName, "ht_20_cc_stroke", color)
            let nameLabel: eui.Label = this.mElemList["nameRd_" + name]
            nameLabel.textColor = GetQualityColorGui(quality)
            nameLabel.text = petName

            this.mElemList["lv_" + name].text = ""

            this.mElemList["petBox_" + name].select(bSelect)
            this.mElemList["btnTips"].visible = bDotTips

            //更新网络
            this.mElemList["petBox_" + name].setEnable(false)
            if (netData) {
                //激活
                this.mElemList["petBox_" + name].setEnable(true)

                let petLevel = netData.stage
                this.mElemList["lv_" + name].text = "Lv." + petLevel

                if (netData.name != null && netData.name != "") {
                    petName = netData.name
                    //AddRdContent(this.mElemList["nameRd_" + name], petName, "ht_20_cc_stroke", color)
                    //nameLabel.textColor = GetQualityColorGui(quality)
                    nameLabel.text = petName
                }
            }

        }

        onPetCallBack(entryId) {
            let parent = this.data.parent
            parent.onPetCallBack(entryId)
            // if (this.select == index) return true;

            // this.select = index

            // let max = size_t(this.petlist)
            // for (let i = 0; i < max; i++) {
            //     let [window, flag] = this.scroll.getItemWindow(i, 100, 150, 0, 0, 0)
            //     let name = window.name
            //     this.mElemList["petBox_" + name].select(false)
            //     if (this.select == i) {
            //         this.mElemList["petBox_" + name].select(true)
            //     }
            // }

            // if (this.mCallbackFunc && this.mCallbackObj) {
            //     this.mCallbackFunc.call(this.mCallbackObj, this.petlist[this.select])
            //     this.mCallbackObj.refreshDotTips()
            // }

            return true
        }

    }
}