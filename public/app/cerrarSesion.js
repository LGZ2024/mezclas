
const cerrarSesion=document.getElementById('cerrarSesion')
cerrarSesion.addEventListener('click',async()=>{
  // Eliminar caché
  window.location.reload(true);

  // Eliminar almacenamiento local
  localStorage.clear();

  // Redirigir a la página de inicio de sesión
  window.location.href = '../index.html'

})

