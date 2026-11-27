import express from "express";
import { login, registrarse, verificarEmail } from "../controllers/controllers.registro.js";

const auth_router = express.Router()

auth_router.post('/registro', registrarse)
auth_router.post('/login', login)
auth_router.get('/verifica_email/:token_verificar_email', verificarEmail)


export default auth_router