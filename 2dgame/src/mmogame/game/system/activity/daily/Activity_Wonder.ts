// TypeScript file
class Activity_Wonder extends ActivityBase {

     public initObj(...args: any[]): void {

     }

     getOpenActivityList(config) {
        let list = []
        for (let _ in config) {
            if (ActivitySystem.getInstance().checkActivityIsOpen(_)) {
                table_insert(list, _)
            }
        }

        return list
    }
}