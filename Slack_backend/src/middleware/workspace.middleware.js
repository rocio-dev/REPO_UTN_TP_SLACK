import member_repository from "../repository/Member.repository.js"
import workspace_repository from "../repository/Workspace.repository.js"
import ServerError from "../utils/error.utils.js"

function workspaceMiddleware(valid_roles){ 
    return async function (request, response,next){
    const {workspace_id}= request.params
        const espacio_trabajo= await  workspace_repository.BuscarEspacioTrabajoporId(workspace_id)

        const membresia_trabajo= await member_repository.traerMiembros_x_UsuarioyEspacioTrabajo(request.user.id, workspace_id)
    
        if(!espacio_trabajo){
            throw new ServerError(
                "No se encontro el Espacio de trabajo",
                404
            )
        }

        if(!membresia_trabajo){
            throw new ServerError(
                "No estas en este espacio de trabajo",
                403
            )
        }

        if (valid_roles.length > 0 && !valid_roles.includes(membresia_trabajo.rol)){
            throw new ServerError(
                "No tenes permiso para hacer esta operación",
                403
            )
        }
        
        request.workspace= espacio_trabajo
        next()
}
}
export default workspaceMiddleware