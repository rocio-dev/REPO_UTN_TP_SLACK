/* Repositorio para la gestión de miembros en la base de datos */
import Miembro from "../models/member.model.js";
import Usuario from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";

class MemberRepository {

    async crearMiembro(user_id,workspace_id,role){
        const resultado= await Miembro.create({
            id_usuario: user_id,
            id_espacio_trabajo: workspace_id,
            rol: role}
        )
        return resultado;
    }

    // 1. Buscar miembros (todos o por ID/filtro)
    async buscarMiembros() {
        const resultado = await Miembro.find()
            .populate('id_usuario')
            .populate('id_espacio_trabajo');
        console.log(resultado);
        return resultado;
    }


    // Buscar miembro por ID específico
    async buscarMiembroPorId(id_miembro) {
        const resultado = await Miembro.findById(id_miembro)
            .populate('id_usuario')
            .populate('id_espacio_trabajo');
        console.log(resultado);
        return resultado;
    }

    // 2. Buscar miembro por el nombre del usuario
    async buscarMiembroPorNombre(nombre) {
        const usuarios = await Usuario.find({
            nombre: { $regex: nombre, $options: 'i' }
        });

        const idsUsuarios = usuarios.map(u => u._id);

        // Buscamos los miembros que pertenezcan a esos usuarios (o por nombre si existiera en el schema)
        const resultado = await Miembro.find({
            $or: [
                { id_usuario: { $in: idsUsuarios } },
                { nombre: { $regex: nombre, $options: 'i' } }
            ]
        })
        .populate(
            'id_usuario',
            'nombre'
        )
        .populate(
            'id_espacio_trabajo',
            'nombre descripcion'
        );

        console.log(resultado);
        return resultado;
    }



    async eliminarMiembroPorId(id_miembro) {
        const resultado = await Miembro.findByIdAndDelete(id_miembro);
        console.log("Miembro eliminado por completo:", resultado);
        return resultado;
    }

    async TodoslosMiemmbrosdeUnEspacioTrabajo(workspace_id) {
        const resultado = await Workspace.find({id_espacio_trabajo:workspace_id})
        .populate(
            'id_usuario',
            'nombre email'
        )
        return resultado

    }
    async traerMiembros_x_UsuarioyEspacioTrabajo(user_id,workspace_id){
        return await Miembro.findOne({id_usuario:user_id,id_espacio_trabajo:workspace_id})
    }

    async eliminarMiembroPorEspacioTrabajo(workspace_id){
        return await Miembro.deleteMany({id_espacio_trabajo:workspace_id})
    }
}

const member_repository = new MemberRepository();

export default member_repository;