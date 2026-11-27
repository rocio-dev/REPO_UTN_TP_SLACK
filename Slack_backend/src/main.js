import connectMongoDB from "./config/connectDB.js";

connectMongoDB();

import express, { request, response } from 'express'
import middleware_error_server from "./middleware/error.middleware.js";
import auth_router from "./routes/auth.routers.js";
import usuarios_router from "./routes/usuarios.routers.js";
import authMiddleware from "./middleware/auth.middleware.js";
import workspaces_router from "./routes/workspaces.routers.js";
import cors from "cors"



const PORT = 8080

const app= express()

//Configuramos nuestra API para que el body pueda ser tipo de dato JSON
//A esto se le llama "Middleware"
app.use(cors())
app.use(express.json())


app.use(
    '/api/auth', auth_router
)

app.use(
    '/api/usuarios', usuarios_router
)

app.use(
    '/api/workspaces',authMiddleware, workspaces_router
)

app.use(
        middleware_error_server
    )

app.listen(
        PORT,
        () => {
            console.log(
                `El servidor se esta escuchando perfectamente de http://localhost:${PORT}`)
        }
    )

