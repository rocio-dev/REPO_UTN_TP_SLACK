import React, { useState } from "react";
import useForm from "../../hooks/useForm";
import { login } from "../../auth.services";

function LoginScreen(){

    const initial_state= {email: '', password: ''}
    const {formState, handleChangeInput}= useForm(initial_state)
    const [ApiResponse, setApiResponse]= useState({response:null,error:null,loading:false})

    async function handleSubmit(event){
        event.preventDefault()
        console.log('Un usuario intenta logearse', formState)
        try{
            setApiResponse ({loading:true, error:null, response: null})
            const respuesta= await login(formState.email, formState.password)
            setApiResponse ({loading:false, error:null, response: respuesta})
        }
        catch(error){
            setApiResponse({loading:false, error: error.message, response:null})
        }
    }
    
    console.log('[Estado de Login]',ApiResponse)

    
    return(
        <div>
            <h1>
                Inicia tu sesión
            </h1>
            <p>
                Pone tu email y contraseña de tu cuenta para iniciar sesión
            </p>

            <form onSubmit={handleSubmit}>
                <div>

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formState.email} 
                    onChange={handleChangeInput}/>

                </div>
                <div>

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" value={formState.password}
                    onChange={handleChangeInput}/>

                </div>

                {
                    ApiResponse.error && !ApiResponse.loading && <span style={{color:'red'}}>ERROR: {ApiResponse.error} </span>
                }
                {
                    ApiResponse.loading
                    ? <button type="submit" disabled={true}>Cargando...</button>
                    : <button type="submit">Iniciar sesión</button>
                }
                {
                    ApiResponse.response && !ApiResponse.loading && <span style={{color:'greenyellow'}}> Inicio de sesion exitosa</span>
                }
            </form>
        </div>
    )
    }

export default LoginScreen