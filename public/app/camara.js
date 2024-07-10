
const tieneSoporteUserMedia = () => !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 640, height: 360 } })) || navigator.webkitGetUserMedia || navigator.msGetUserMedia);
const _getUserMedia = (...rest) => (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 640, height: 360 } })) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, rest);

// Declaramos elementos del DOM para solicitador
const $video = document.querySelector("#video"),
    $canvas = document.querySelector("#canvas"),
    $estado = document.querySelector("#estado"),
    $boton = document.querySelector(".btnTomarFoto"),
    $botonOtra = document.querySelector(".btnOtraFoto"),
    $photo = document.querySelector(".photo"),
    $listaDeDispositivos = document.querySelector("#listaDeDispositivos"),
    $input = document.querySelector("#fileInput");
// Declaramos elementos del DOM para mezclador
const $videoC = document.querySelector("#videoC"),
    $canvasC = document.querySelector("#canvasC"),
    $estadoC = document.querySelector("#estadoC"),
    $botonC = document.querySelector(".btnTomarFotoCerrar"),
    $botonOtraC = document.querySelector(".btnOtraFotoCerrar"),
    $photoC = document.querySelector(".photoC"),
    $listaDeDispositivosC = document.querySelector("#listaDeDispositivosC"),
    $inputC = document.querySelector("#imagenEntrega");

/* limpiamos select de dispositivos */
const limpiarSelect = () => {
    for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--)
        $listaDeDispositivos.remove(x);
};
/* limpiamos select de dispositivos de formulario Cerrar*/
const limpiarSelectC = () => {
    for (let x = $listaDeDispositivosC.options.length - 1; x >= 0; x--)
        $listaDeDispositivosC.remove(x);
};

const obtenerDispositivos = async () => navigator
    .mediaDevices
    .enumerateDevices();

// Lo que hace es llenar el select con los dispositivos obtenidos
const llenarSelectConDispositivosDisponibles = () => {

    limpiarSelect();
    obtenerDispositivos()
        .then(dispositivos => {
            const dispositivosDeVideo = [];
            dispositivos.forEach(dispositivo => {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });

            // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
            if (dispositivosDeVideo.length > 0) {
                // Llenar el select
                dispositivosDeVideo.forEach(dispositivo => {
                    const option = document.createElement('option');
                    option.value = dispositivo.deviceId;
                    option.text = dispositivo.label;
                    $listaDeDispositivos.appendChild(option);
                });
            }
        });
}
// Lo que hace es llenar el select con los dispositivos obtenidos
const llenarSelectConDispositivosDisponiblesC = () => {

    limpiarSelectC();
    obtenerDispositivos()
        .then(dispositivos => {
            const dispositivosDeVideo = [];
            dispositivos.forEach(dispositivo => {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });

            // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
            if (dispositivosDeVideo.length > 0) {
                // Llenar el select
                dispositivosDeVideo.forEach(dispositivo => {
                    const option = document.createElement('option');
                    option.value = dispositivo.deviceId;
                    option.text = dispositivo.label;
                    $listaDeDispositivosC.appendChild(option);
                });
            }
        });
}

// La función que es llamada después de que ya se dieron los permisos formulario de solicitud
const camara = async () => {
    if (!tieneSoporteUserMedia()) {
        alert("Lo siento. Tu navegador no soporta esta característica");
        $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
        return;
    }
    //Aquí guardaremos el stream globalmente
    let stream;


    // Comenzamos pidiendo los dispositivos
    obtenerDispositivos()
        .then(dispositivos => {
            // Vamos a filtrarlos y guardar aquí los de vídeo
            const dispositivosDeVideo = [];

            // Recorrer y filtrar
            dispositivos.forEach(function (dispositivo) {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });

            // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
            // y le pasamos el id de dispositivo
            if (dispositivosDeVideo.length > 0) {
                // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
                mostrarStream(dispositivosDeVideo[0].deviceId);
            }
        });


    const mostrarStream = idDeDispositivo => {
        _getUserMedia({
            video: {
                // Justo aquí indicamos cuál dispositivo usar
                deviceId: idDeDispositivo,
            }
        },
            (streamObtenido) => {
                // pues si no, no nos daría el nombre de los dispositivos
                llenarSelectConDispositivosDisponibles();
                // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
                $listaDeDispositivos.onchange = () => {
                    // Detener el stream
                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    }
                    // Mostrar el nuevo stream con el dispositivo seleccionado
                    mostrarStream($listaDeDispositivos.value);
                }


                // Simple asignación
                stream = streamObtenido;

                // Mandamos el stream de la cámara al elemento de vídeo
                $video.srcObject = stream;
                $video.play();


                //Escuchar el click del botón para tomar la foto
                $boton.addEventListener("click", function () {
                    $botonOtra.style.display = "block";
                    //Pausar reproducción
                    $video.pause();

                    //Obtener contexto del canvas y dibujar sobre él
                    let contexto = $canvas.getContext("2d");
                    $canvas.width = $video.videoWidth; //tamaño de la imagen
                    $canvas.height = $video.videoHeight;
                    contexto.drawImage($video, 0, 0, $canvas.width, $canvas.height);
                    let foto = $canvas.toDataURL(); //Esta es la foto, en base 64
                    /* pasamos foto a imagen */
                    $photo.setAttribute('src', foto)
                    $input.value = foto;
                    /* ocultamos boton para tomar foto y mostramos el de tomar otra */
                    $boton.style.display = "none";
                    $botonOtra.style.display = "block";
                    /* accione de boton de tomar otra foto */
                    $botonOtra.addEventListener('click', () => {
                        $video.play();
                        $boton.style.display = "block";
                        $botonOtra.style.display = "none";
                        $input.value = "";
                    })
                });
            }, (error) => {
                console.log("Permiso denegado o error: ", error);
                $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
            });
    };
};

// La función que es llamada después de que ya se dieron los permisos formulario de solicitud
const camaraC = async () => {
    if (!tieneSoporteUserMedia()) {
        alert("Lo siento. Tu navegador no soporta esta característica");
        $estadoC.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
        return;
    }
    //Aquí guardaremos el stream globalmente
    let stream;


    // Comenzamos pidiendo los dispositivos
    obtenerDispositivos()
        .then(dispositivos => {
            // Vamos a filtrarlos y guardar aquí los de vídeo
            const dispositivosDeVideo = [];

            // Recorrer y filtrar
            dispositivos.forEach(function (dispositivo) {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });

            // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
            // y le pasamos el id de dispositivo
            if (dispositivosDeVideo.length > 0) {
                // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
                mostrarStream(dispositivosDeVideo[0].deviceId);
            }
        });


    const mostrarStream = idDeDispositivo => {
        _getUserMedia({
            video: {
                // Justo aquí indicamos cuál dispositivo usar
                deviceId: idDeDispositivo,
            }
        },
            (streamObtenido) => {
                // pues si no, no nos daría el nombre de los dispositivos
                llenarSelectConDispositivosDisponiblesC();
                // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
                $listaDeDispositivosC.onchange = () => {
                    // Detener el stream
                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    }
                    // Mostrar el nuevo stream con el dispositivo seleccionado
                    mostrarStream($listaDeDispositivosC.value);
                }


                // Simple asignación
                stream = streamObtenido;

                // Mandamos el stream de la cámara al elemento de vídeo
                $videoC.srcObject = stream;
                $videoC.play();


                //Escuchar el click del botón para tomar la foto
                $botonC.addEventListener("click", function () {
                    $botonOtraC.style.display = "block";
                    //Pausar reproducción
                    $videoC.pause();

                    //Obtener contexto del canvas y dibujar sobre él
                    let contexto = $canvasC.getContext("2d");
                    $canvasC.width = $videoC.videoWidth; //tamaño de la imagen
                    $canvasC.height = $videoC.videoHeight;
                    contexto.drawImage($videoC, 0, 0, $canvasC.width, $canvasC.height);
                    let foto = $canvasC.toDataURL(); //Esta es la foto, en base 64
                    /* pasamos foto a imagen */
                    $photoC.setAttribute('src', foto)
                    $inputC.value = foto;
                    /* ocultamos boton para tomar foto y mostramos el de tomar otra */
                    $botonC.style.display = "none";
                    $botonOtraC.style.display = "block";
                    /* accione de boton de tomar otra foto */
                    $botonOtraC.addEventListener('click', () => {
                        $videoC.play();
                        $botonC.style.display = "block";
                        $botonOtraC.style.display = "none";
                        $inputC.value = "";
                    })
                });
            }, (error) => {
                console.log("Permiso denegado o error: ", error);
                $estadoC.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
            });
    };

};

//Funcion para continuar videos
function continuarVideos() {
    $video.play();
    $boton.style.display = "block";
    $botonOtra.style.display = "none";
    $input.value = "";
}
function continuarVideosC() {
    $videoC.play();
    $botonC.style.display = "block";
    $botonOtraC.style.display = "none";
    $inputC.value = "";
}

const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      $video.srcObject = null;
      $video.pause();
    }
  };
  
  const detenerCamaraC = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      $videoC.srcObject = null;
      $videoC.pause();
    }
  };

export {camara,camaraC,continuarVideos,continuarVideosC,detenerCamara,detenerCamaraC }