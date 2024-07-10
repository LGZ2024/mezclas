export function mostrarMensaje(msg,type){
    Toastify({
        text: msg,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: type == "success" ? "linear-gradient(to right, #00b09b, #96c93d)" : "red",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}