// registro.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth,db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { mostrarMensaje } from "./mensajes.js";


const registrationForm = document.getElementById('registration-form');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los datos del formulario
    const tipoUser = registrationForm.tipoUser.value;
    const nombre = registrationForm.nombre.value;
    const apellidoP = registrationForm.apellidoP.value;
    const apellidoM = registrationForm.apellidoM.value;
    const email = registrationForm.email.value;
    const password = registrationForm.password.value;
    try {
        // Crear el usuario con correo y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        mostrarMensaje('Registrado con exito'+user.email,'success')
        // Aquí podrías guardar la información adicional del conductor en Firestore
        const docRef = await addDoc(collection(db, "users"), {
            idUsuario: user.uid,
            nombre: nombre,
            apellidoP: apellidoP,
            apellidoM: apellidoM,
            correo: user.email,
            estado: true,
            tipoUser:tipoUser,
          });
           
          //creamos condicion para rediriguir a la pagina principal dependiendo el tipo de usuario
          if(tipoUser==='Conductor'){
            window.location.href = 'inicioC.html';
          }else if(tipoUser==='Pasajero'){
            window.location.href = 'inicioP.html';
          }else if(tipoUser==='Administrador'){
            window.location.href = 'inicio.html';
          }else{
            window.location.href = 'index.html';
          }
          
    } catch (error) {
        console.log(error.message);
        if (error.code ==='auth/invalid-email'){
            mostrarMensaje('Correo invalido','warning')
        }else if (error.code==='auth/weak-password'){
            mostrarMensaje('Registrado La contraseña debe tener al menos 6 caracteres','warning')
        }else if(error.code==='auth/email-already-in-use'){
            mostrarMensaje('Correo ya se encuentra registrado','warning')
        }
    }
});
