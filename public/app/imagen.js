import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const firestore = getFirestore();
const imageList = document.getElementById('imageList');

// Obtén una referencia a la colección "fotos" en Firestore
const fotosCollection = collection(firestore, 'fotos');

document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const tituloInput = document.getElementById('tituloInput');
    const descripcionInput = document.getElementById('descripcionInput');
    const uploadButton = document.getElementById('uploadButton');

    if (uploadButton) {
        uploadButton.addEventListener('click', subirImagen);
    }

    // Escucha cambios en la colección 'fotos' en tiempo real
        onSnapshot(fotosCollection, (snapshot) => {
        // Obtén los documentos de la colección 'fotos'
        const fotos = snapshot.docs.map(doc => doc.data());
        // Muestra todas las imágenes en la lista
        mostrarImagenesEnLista(fotos);
    });
});

async function subirImagen() {
    const fileInput = document.getElementById('fileInput');
    const tituloInput = document.getElementById('tituloInput');
    const descripcionInput = document.getElementById('descripcionInput');

    if (fileInput && fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
            const fileName = file.name;
            const storageRef = ref(storage, `fotos/${fileName}`);
            await uploadBytes(storageRef, file);

            // Obtén la URL de descarga
            const downloadURL = await getDownloadURL(storageRef);

            // Agrega la URL y los datos asociados a la colección 'fotos' en Firestore
            await addDoc(fotosCollection, {
                url: downloadURL,
                titulo: tituloInput.value,
                descripcion: descripcionInput.value
            });

            // Limpiar los campos después de la carga
            fileInput.value = '';
            tituloInput.value = '';
            descripcionInput.value = '';
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen');
        }
    } else {
        alert('Por favor, selecciona una imagen');
    }
}

function mostrarImagenesEnLista(fotos) {
    const imageList = document.getElementById('imageList');

    if (imageList) {
        // Limpiar la lista antes de mostrar nuevas imágenes
        imageList.innerHTML = '';

        // Iterar sobre las imágenes y crear elementos de imagen, título y descripción
        fotos.forEach((foto) => {
            // Contenedor para cada elemento
            const container = document.createElement('div');
            container.classList.add('image-container');

            // Imagen
            const imgElement = document.createElement('img');
            imgElement.src = foto.url;
            imgElement.classList.add('uploaded-image');
            container.appendChild(imgElement);

            // Título
            const tituloElement = document.createElement('p');
            tituloElement.textContent = `Título: ${foto.titulo}`;
            tituloElement.classList.add('image-title');
            container.appendChild(tituloElement);

            // Descripción
            const descripcionElement = document.createElement('p');
            descripcionElement.textContent = `Descripción: ${foto.descripcion}`;
            descripcionElement.classList.add('image-description');
            container.appendChild(descripcionElement);

            // Agregar el contenedor al imageList
            imageList.appendChild(container);
        });
    }
}