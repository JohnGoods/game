// TypeScript file

module RpcLogic{

    // export function CHeroLevelUp(){
        
    // }

    // export function G2C_EquipRefine(name:string, id:number){
    //     TLog.Debug("===========CEquipRefine", name, id)
    // }

    
    //队伍信息更新
    export function G2C_UpdateTeamInfo(teamInfo){
        TLog.Debug("===========G2C_UpdateTeamInfo")
        let list = teamInfo.members || []
        teamInfo.members = {}
        for (let i = 0; i < list.length; i++) {
            let v = list[i]
            teamInfo.members[v.plrId] = v
        }
        teamInfo.count = list.length

        TeamSystem.getInstance().setTeamInfo(teamInfo)
    }
    
    export function G2C_LeaveTeam(plrId){
        TLog.Debug("===========G2C_LeaveTeam")
        if (plrId == GetHeroProperty("id")) {
            TeamSystem.getInstance().leaveTeam()
        } else {
            TeamSystem.getInstance().removeMember(plrId)
        }
    }

    export function G2C_Disband(roleinfolist){
        TLog.Debug("===========G2C_Disband")
        TeamSystem.getInstance().emptyTeamInfo()
    }
}