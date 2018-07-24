module RpcLogic {



    export function G2C_ItemList(itemInfoList: any[]) {
        for (let k = 0; k < itemInfoList.length; k++) {
            let v = itemInfoList[k]

            let logicItem = Item.newObj(v)
            ItemSystem.getInstance().addItem(logicItem)
        }
        ItemSystem.getInstance().onGetItemList()
        FireEvent(EventDefine.ITEM_UPDATE, null)
    }


    export function G2C_ItemUpdate(itemInfoList: any[]) {
        for (let k = 0; k < itemInfoList.length; k++) {
            let v = itemInfoList[k]

            let logicItem = Item.newObj(v)
            // let itemEntryId = logicItem["propertyInfo"]["entry"]
            // let itemId = logicItem["id"]
            //TLog.Debug("UPDATE", itemEntryId, itemId)

            ItemSystem.getInstance().addItem(logicItem)

        }
        //FireEvent(EventDefine.ITEM_UPDATE_LIST, ItemUpdateListEvent.new(message.ItemList))
        FireEvent(EventDefine.ITEM_UPDATE, null)
    }
    export function G2C_ItemDrop(itemId) {
        ItemSystem.getInstance().removeItem(itemId)
        FireEvent(EventDefine.ITEM_UPDATE, null)
    }

    export function G2C_ItemAddTips(itementryid, num, quality) {
        let itementry = GameConfig.itemConfig[itementryid]
        if(itementry == null)
            return;
        let itemtype = itementry.type
        if (itemtype == opItemType.COMMON_EQUIP || itemtype == opItemType.ROLE_EQUIP || itemtype == opItemType.ROLE_ALLSMAN) {
            if(quality >= 5 && itemtype != opItemType.ROLE_ALLSMAN){
                let item = Item.newObj({entry : itementryid, quality : quality})
                MsgSystem.addGetGoldEquipTips(item)
            }else{
                MsgSystem.addGetItemTips([itementryid, num, quality])
            }
        } else {
            MsgSystem.addGetItemTips([itementryid, num])
        }
    }

    export function G2C_ItemDropTips(itementryid, num, quality) {
        let itementry = GameConfig.itemConfig[itementryid]
        if(itementry == null)
            return;
        let itemtype = itementry.type
        if (itemtype == opItemType.COMMON_EQUIP || itemtype == opItemType.ROLE_EQUIP || itemtype == opItemType.ROLE_ALLSMAN) {
            MsgSystem.addDropItemTips([itementryid, num, quality])
        } else {
            MsgSystem.addDropItemTips([itementryid, num])
        }
    }

    export function G2C_ItemSellList(shopIndex, itemInfoList: any[]) {
        let itemList: Item[] = []
        for (let k = 0; k < itemInfoList.length; k++) {
            let v = itemInfoList[k]

            let logicItem = Item.newObj(v)
            itemList.push(logicItem)
        }

        ItemSystem.getInstance().setShopSellItemList(shopIndex, itemList)

        let message: any = {}
        message.shopIndex = shopIndex
        message.itemList = itemList
        FireEvent(EventDefine.ITEM_SELL_LIST, NetMessageEvent.newObj(message))
    }

    export function G2C_ItemLottery(posList: number[], itemInfoList: any[]) {
        for (let i = 0; i < posList.length; i++) {
            itemInfoList[i].lottoPos = posList[i]
        }

        FireEvent(EventDefine.RESOLVE_ITEM_RESULT, ResolveResult.newObj(itemInfoList.length, itemInfoList))
    }

    //通用物品奖励
    export function G2C_CommonItemPrize(itemList) {
        let wnd = WngMrg.getInstance().getWindow("PrizeShowFrame")
        wnd.showAndSetData(itemList)
    }


}