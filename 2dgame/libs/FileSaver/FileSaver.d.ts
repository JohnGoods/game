
interface FileSaver {
    (data:Blob, filename:string, no_auto_bom?:boolean): void
}

declare var saveAs:FileSaver;