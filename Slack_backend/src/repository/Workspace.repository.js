import Workspace from "../models/workspace.model.js"
import Miembro from "../models/member.model.js"

class WorkspaceRepository {

    async crearEspacioTrabajo(nombre, descripcion) {
        const resultado = await Workspace.create({ nombre: nombre, descripcion: descripcion })
        return resultado
    }
    async BuscarEspaciosTrabajo() {
        const resultado = await Workspace.find()
        console.log(resultado)
        return resultado
    }

    async BuscarEspacioTrabajoporId(id_espacio_trabajo) {
        const resultado = await Workspace.findById(id_espacio_trabajo)
        console.log(resultado)
        return resultado
    }

    async buscarTodoslosEspaciosTrabajos(id_usuario) {
        const resultado = await Miembro
        .find({ id_usuario: id_usuario })
        .select('role fecha_de_creacion id_espacio_trabajo')
        .populate(
                'id_espacio_trabajo',
                'nombre descripcion fecha_de_creacion'
            )
        return resultado.map(
            membresia =>{
                return{
                    member_id: membresia._id,
                    member_rol:membresia._rol,
                    workspace_id: membresia.id_espacio_trabajo._id,
                    workspace_nombre:membresia.id_espacio_trabajo._nombre,
                    workspace_fecha_de_creacion:membresia.id_espacio_trabajo._fecha_de_creacion
                }
            }
        )
    }

    async EliminarEspacioTrabajoporId(id_espacio_trabajo) {
        const resultado = await Workspace.findByIdAndDelete(id_espacio_trabajo)
        return resultado
    }

    async actualizarEspacioTrabajo(id_espacio_trabajo, update_data){
        const resultado= await Workspace.findByIdAndUpdate(id_espacio_trabajo, update_data)
        return resultado
    }

}

const workspace_repository = new WorkspaceRepository()

export default workspace_repository
