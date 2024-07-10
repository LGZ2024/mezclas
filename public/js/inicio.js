import {abrirMezcla,abrirReceta,abrirFormCerrar} from "../app/FuncionesAlmacen.js"
import { loginCheck } from "../app/loginCheck.js";

if (localStorage.getItem('data')!== null) {
    const objeto =JSON.parse(localStorage.getItem('data'))
    loginCheck(objeto);
  } else {
    window.location.href = "../";
  }
export{abrirMezcla,abrirReceta,abrirFormCerrar}

