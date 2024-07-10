const setPost = (data) => {
    const centroCoste = document.getElementById('centroCoste');
    centroCoste.innerHTML = '';
    if (data.length) {
        centroCoste.append(new Option('Selecciona Centro de Coste', 0));
        data.forEach(doc => {   //con esta funcion recorrecmos los documentos traidos desde firebase 
            centroCoste.append(new Option(doc.centroCoste, doc.id));
        });
    } else {
        centroCoste.append(new Option('Error al cargar los datos', 0));
    }
}

const setPostVariedad = (data) => {
    const variedades = document.getElementById('variedad');
    variedades.innerHTML = '';
    if (data.length) {
        variedades.append(new Option('Seleccione una variedad', 0));

        // Definir la cadena de datos
        let cadena =data[0].variedad

        // Separar los elementos de la cadena en un array
        let elementos = cadena.split(',');

        // Recorrer el array e imprimir cada elemento
        elementos.forEach(function (elemento) {
             variedades.append(new Option(elemento,elemento));
        });


    } else {
        variedades.append(new Option('Error al cargar los datos', 0));
    }
}

export { setPost, setPostVariedad }
