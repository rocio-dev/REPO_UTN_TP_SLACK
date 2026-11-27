import workspace_repository from "../repository/Workspace.repository.js"
import member_repository from "../repository/Member.repository.js"
import ServerError from "../utils/error.utils.js"


export async function obtener_espacios_trabajos (request, response) {
    const id_usuario = request.user.id

    const membresias = await workspace_repository.buscarTodoslosEspaciosTrabajos(id_usuario)

    return response.status(200).send({
        ok: true,
        status: 200,
        message: "Obtener los espacios de trabajo del usuario",
        data: {
            Membresias: membresias
        }
    })
}

export async function Crear_Espacio_Trabajo (request, response) {
    const { nombre, descripcion } = request.body

    const crearET = await workspace_repository.crearEspacioTrabajo(nombre, descripcion)
    const membresia_owner = await member_repository.crearMiembro(
        request.user.id,
        crearET._id,
        'owner'
    )

    return response.status(200).send({
        ok: true,
        status: 200,
        message: "Todo bien por ahora",
        data: {
            crearET,
            membresia_owner
        }
    })
}


export async function EliminarEspacioTrabajo(request, response) {

    const espacio_trabajo= await workspace_repository.EliminarEspacioTrabajoporId(request.workspace._id)
    await member_repository.eliminarMiembroPorEspacioTrabajo(request.workspace._id)
        if(!espacio_trabajo){
            throw new ServerError(
                "No se encontro el espacio de trabajo", 404
            )
        }

    return response.status(200).send({
        ok:true,
        status:200,
        message:"Se elimino el Espacio de trabajo correctamente"
    })
}

export async function actualizar_espacio_trabajo(request, response){
    const{workspace_id}= request.params
    const {nombre, descripcion}= request.body
    await workspace_repository.actualizarEspacioTrabajo(workspace_id,{nombre, descripcion})

    return response.status(200).send({
        ok: true,
        status:200,
        message: "Se actualizo el espacio de trabajo"
    })
}

