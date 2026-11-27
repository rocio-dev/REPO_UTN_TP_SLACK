import express, { request, response } from "express";
import { actualizar_espacio_trabajo, Crear_Espacio_Trabajo, EliminarEspacioTrabajo, obtener_espacios_trabajos } from "../controllers/controllers.workspace.js";
import workspaceMiddleware from "../middleware/workspace.middleware.js";

const workspaces_router = express.Router()

workspaces_router.post('/', Crear_Espacio_Trabajo)
workspaces_router.get('/', obtener_espacios_trabajos)
workspaces_router.get('/:workspace_id', workspaceMiddleware([]),
    async (request,response) =>{

            return response.send({
                message: "Consegui los detalles del usuario exitosamente",
                ok: true,
                status: 200,
                data: {
                    Workspace: request.workspace
                }
            })
    }
)

workspaces_router.delete('/:workspace_id', workspaceMiddleware(['owner']),EliminarEspacioTrabajo)
workspaces_router.put('/:workspace_id',workspaceMiddleware(['owner', 'admin']),actualizar_espacio_trabajo )

export default workspaces_router
