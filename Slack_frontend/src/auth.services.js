/* 
Aca va a estar la interaccion con nuestra API
*/

export async function login(email, password) {


        const respuesta_http= await fetch('http://localhost:8080/api/auth/login',
            {
                method: 'POST',
                headers:{
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    contraseña: password
                })
            }
        )
        const respuesta_body= await respuesta_http.json()

        
        if(!respuesta_body.ok){
            throw new Error(respuesta_body.message)
        }

        return respuesta_body

}