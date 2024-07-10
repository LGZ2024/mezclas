import { mostrarMensaje } from "./mensajes.js";
inicioDeSesion()
function inicioDeSesion() {
  const formLogin = document.getElementById('form-login');
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {

    const response=await fetchLogin(email, pass)
    validarUsuario(response)
  } catch (error) {
      mostrarMensaje('ocurrio algun errro', 'error');
    }
  });
}

//hacemos peticion fecht
async function fetchLogin(email, pass) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, pass })
  };
    const response = await fetch(`/login`,options);
    const data = await response.json();
    return data;
}

//validamos el usuario
function validarUsuario(response){
  if(response.mensaje==='Autorizado'){
    mostrarMensaje('Bienvenido','success');
    //guardamos nuestro objeto en el localStorage
    localStorage.setItem('data',JSON.stringify(response));
    setTimeout(() => {
      window.location.href = '../view/main.html';
    },2000)
    
  }else{
    mostrarMensaje('Verificar datos de usuario y contraseña','error');
  }
}


export { inicioDeSesion }

