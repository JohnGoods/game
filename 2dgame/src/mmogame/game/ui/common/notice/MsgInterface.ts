// TypeScript file

interface IDialogCallback{
    onDialogCallback(result:boolean, userData):void;
}


interface IIconMsgCallBack{
    onIconMsgCallBack(id:number, userData):boolean;
}

interface IActivityRemindListener{
    onCheckRemindShow():boolean;
    onGetRemindTxt():string;
    onCallback():void;
}