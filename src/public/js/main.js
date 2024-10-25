const btnAddToCart = document.getElementById('btnAddToCart');

var carrito = localStorage.getItem('carrito') ?? [];

function mostrarMsj(tipo = 'success', texto = 'Genial!') {
  Swal.fire({
    position: "top-end",
    icon: tipo,
    text: texto,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    confirmButtonText: "Aceptar"
  });
}

function addToCart(id) {
  console.log(id);
}

