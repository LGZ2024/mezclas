/* variables para ubicacion */
var posLinkElt;
var msg;
/* ontenemos los valores  */
posLinkElt = document.querySelector("#poslink>a");

/* opciones */
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };


//geolocalizacion 
/** @param {GeolocationPosition} pos */
const geoposOK = (pos) => {
    //obtenemos latitud y longitud
    var acuracy = pos.coords.accuracy;
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    //mostramos la posicion
    document.getElementById("latitud").value=`${lat}`;
    document.getElementById("longitud").value=`${lon}`;
    //mostramos link
    posLinkElt.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    posLinkElt.target = "_blank";
    posLinkElt.rel = "noopener noreferrer";
    posLinkElt.textContent = "ver en google";

}

//errro de geolocalizacion
/** @param {GeolocationPositionError} err */
const geoposKO = (err) => {
    console.warn(err.message);
    switch (err.code) {
        case (err.PERMISSION_DENIED):
            return msg = "Permiso denegado";
            break;
        case (err.POSITION_UNAVAILABLE):
            return msg = "Posicion no disponible";
            break;
        case (err.TIMEOUT):
            return msg = "Tiempo de espera agotado";
            break;
        case (err.UNKNOWN_ERROR):
            return msg = "Error desconocido";
            break;
        default:
            return msg = "Error desconocido";
            break;
    }
}
export const obtenerUbicacionO = () => {
    navigator.geolocation.getCurrentPosition(geoposOK, geoposKO,options);
}


//geolocalizacion 
/** @param {GeolocationPosition} pos */
 const geoposOKD = (pos) => {
    //obtenemos latitud y longitud
    var acuracy = pos.coords.accuracy;
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    //pasamaos valores
    document.getElementById('latirudD').value = lat;
    document.getElementById('longitudD').value = lon;
}

//errro de geolocalizacion
/** @param {GeolocationPositionError} err */
const geoposKOD = (err) => {
    console.warn(err.message);
    switch (err.code) {
        case (err.PERMISSION_DENIED):
            return msg = "Permiso denegado";
            break;
        case (err.POSITION_UNAVAILABLE):
            return msg = "Posicion no disponible";
            break;
        case (err.TIMEOUT):
            return msg = "Tiempo de espera agotado";
            break;
        case (err.UNKNOWN_ERROR):
            return msg = "Error desconocido";
            break;
        default:
            return msg = "Error desconocido";
            break;
    }
}

/* exportamos funcion */
export const obtenerUbicacionD = () => {
    navigator.geolocation.getCurrentPosition(geoposOKD, geoposKOD, options);
}