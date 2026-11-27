import usuario_repository from "../repository/Usuario.repository.js"
import ServerError from "../utils/error.utils.js"
import { comprobar_hash, incriptacion_contraseña } from "../utils/bcrypt.utils.js"
import jwt from "jsonwebtoken";
import mailer_transporter from "../config/mailer.config.js";
import ENVIRONMENT from "../config/environment.config.js";

export async function registrarse (request, response) {


            console.log("[Registro]",request.body)
    
            const {nombre, contraseña, email}= request.body
    
            if(!nombre|| !contraseña || !email){
                throw new ServerError(
                "Es requerido el Nombre, contraseña y email para registrarte",
                400
                )
            }
    
            if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
                throw new ServerError(
                    "Email es incorrecto",
                    400
                )

        }
    
            const email_utilizado = await usuario_repository.BuscarUsuarioporEmail(email)
            if(email_utilizado){
                throw new ServerError(
                    "Ya hay una cuenta con este Email",
                    400
                )
            }

            const contraseña_hash = await incriptacion_contraseña(contraseña)
    
            await usuario_repository.crearUsuario(nombre, contraseña_hash, email)

            const token_verificar_email= jwt.sign(
                {
                    email:email
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: '7d'
                }
            )

            await mailer_transporter.sendMail(
                {
                    to: email,
                    from: ENVIRONMENT.GMAIL_USER,
                    subject:'Verifica tu cuenta',
                    html:`
                    <body>
                        <h1>Bienvenido a nuestra plataforma </h1>
                        <p>Necesitamos que verifiques tu correo de gmail</p>
                        <a href='${ENVIRONMENT.URL_BACKEND}/api/auth/verifica_email/${token_verificar_email}>
                        Click aqui para verificar tu cuenta</a href>
                    </body>
                    `
                }
            )
    
            return response.send({
                message: "Ya estas registrado. Bienvenido",
                ok:true,
                status: 201
        })
    
        }


export async function login(request, response) {

    const {email, contraseña} = request.body

        if (
        !email || !contraseña || typeof email !== "string" || typeof contraseña !== "string"
            ){
        throw new ServerError(
            "La contraseña y el email son requeridos",
            400
        )
    }

        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
                throw new ServerError(
                    "Email es incorrecto",
                    400
                )
            }
    
    const user= await usuario_repository.BuscarUsuarioporEmail(email)
        if(!user){
            throw new ServerError(
                "Usuario no encontrado",
                404
            )
        }

        if(!user.email_verificado){
            throw new ServerError(
                "Email no verificado",
                403
            )
        }
    const contraseñaValida= await comprobar_hash(contraseña, user.contraseña)
        if (!contraseñaValida){
            throw new ServerError(
                "Credencial incorrecta",
                400
            )
        }
    
    const credencial_token= jwt.sign(
        {
            id: user._id,
            nombre: user.nombre,
            email: user.email
        },
        ENVIRONMENT.JWT_SECRET_KEY
    )
    
    return response.send({
        message: "Te pudiste logear correctamente",
        ok:true,
        status:200,
        data:{
            credencial_token
        }
})
}
export async function verificarEmail(request, response){
    const {token_verificar_email}= request.params
    
    const{email}=jwt.verify(token_verificar_email, ENVIRONMENT.JWT_SECRET_KEY)

    const usuario_encontrado= await usuario_repository.BuscarUsuarioporEmail(email)
        if (!usuario_encontrado){
            throw new ServerError("Usuario no encontrado",404)
        }

        if(!usuario_encontrado.activo){
            throw new ServerError(
                "El Usuario esta desactivado de la plataforma. Si esto lo consideras un error contactate con nuestro soporte",
                400
            )
        }

        if(usuario_encontrado.email_verificado){
            throw new ServerError("Ya estas verificado", 400)
        }

        await usuario_repository.actualizarX_ID(usuario_encontrado._id,{email_verificado: true})

return response.status(200).send({
    ok: true,
    status: 200,
    message:"Usuario verificado existosamente"
})
}