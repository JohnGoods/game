// TypeScript file

declare function stringformat(message?:any, ...optionalParams: any[]): string;

// declare namespace String{
//       function format(msg:string, ...params:any[]):string;
// }

// declare interface String{
//     format(msg:string, ...params:any[]):string;
// }

declare interface StringConstructor{
    format(msg:string, ...params:any[]):string;
}
