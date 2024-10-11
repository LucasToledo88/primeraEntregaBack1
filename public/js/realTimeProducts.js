const socket = io();

const formAgregarProducto = document.getElementById('formAgregarProducto');
const formEditarProducto = document.getElementById('formEditarProducto');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');
const btnEditarProducto = document.getElementById('btnEditarProducto');
const btnBorrarProducto = document.getElementById('btnBorrarProducto');

const lstProductos = document.getElementById('lstProductos');

function editarProducto(id, title, category, price, stock, thumbnail) {
  formEditarProducto.product_id.value = id;
  formEditarProducto.product_title.value = title;
  formEditarProducto.product_category.value = category;
  formEditarProducto.product_price.value = price;
  formEditarProducto.product_stock.value = stock;
  formEditarProducto.product_thumbnail.value = thumbnail;
}

function borrarProducto(id) {
  Swal.fire({
    title: "¿Estás seguro de eliminar el producto?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit('borrarProducto', id);
    }
  });
}

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

btnAgregarProducto.addEventListener('click', (e) => {

  if (formAgregarProducto.product_title.value.length == 0) return;
  if (formAgregarProducto.product_category.value.length == 0) return;
  if (formAgregarProducto.product_price.value.length == 0) return;
  if (formAgregarProducto.product_stock.value.length == 0) return;

  const datos = {
    name: formAgregarProducto.product_title.value,
    category: formAgregarProducto.product_category.value,
    price: formAgregarProducto.product_price.value,
    stock: formAgregarProducto.product_stock.value,
  };

  socket.emit('agregarProducto', datos);
});

btnEditarProducto.addEventListener('click', (e) => {

  if (formEditarProducto.product_id.value.length == 0) return;
  if (formEditarProducto.product_title.value.length == 0) return;
  if (formEditarProducto.product_category.value.length == 0) return;
  if (formEditarProducto.product_price.value.length == 0) return;
  if (formEditarProducto.product_stock.value.length == 0) return;
  if (formEditarProducto.product_thumbnail.value.length == 0) return;

  const datos = {
    _id: formEditarProducto.product_id.value,
    title: formEditarProducto.product_title.value,
    category: formEditarProducto.product_category.value,
    price: formEditarProducto.product_price.value,
    stock: formEditarProducto.product_stock.value,
    thumbnail: formEditarProducto.product_thumbnail.value,
  };

  socket.emit('editarProducto', datos);
});

socket.on('agregarProductoAgregado', (producto) => {
  mostrarMsj('success', `Se ha agregado un nuevo producto: ${producto.title}.`);

  const nuevoProductoCol = `<div id="product_${producto._id}" class="col">
    <div class="card shadow-sm">
      <img src="../img/productos/${producto.thumbnail}" class="card-img-top" alt="${producto.title}">
      <div class="card-body">
        <p id="product_${producto._id}_title" class="card-text">${producto.title}}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" onclick="editarProducto('${producto._id}', '${producto.title}', '${producto.category}', '${producto.price}', '${producto.stock}', '${producto.thumbnail}')" class="btn btn-sm btn-success">Editar</button>
            <button type="button" onclick="borrarProducto('${producto._id}')" class="btn btn-sm btn-danger">Eliminar</button>
          </div>
          <small id="product_${producto._id}_price" class="text-body-secondary">$ ${producto.price}</small>
        </div>
      </div>
    </div>
  </div>`;
  lstProductos.innerHTML += nuevoProductoCol;
});

socket.on('editarProductoEditado', (producto) => {
  mostrarMsj('success', `Se ha editado el producto: ${producto.title}.`);
  const elementotitle = document.getElementById(`product_${producto._id}_title`);
  if (elementotitle) elementotitle.innerHTML = producto.title;

  const elementoCategory = document.getElementById(`product_${producto._id}_category`);
  if (elementoCategory) elementoCategory.innerHTML = producto.category;

  const elementoPrice = document.getElementById(`product_${producto._id}_price`);
  if (elementoPrice) elementoPrice.innerHTML = producto.price;

  const elementoStock = document.getElementById(`product_${producto._id}_stock`);
  if (elementoStock) elementoStock.innerHTML = `$ {producto.stock}`;
});

socket.on('borrarProductoBorrado', (producto) => {
  mostrarMsj('success', `Se ha eliminado un producto.`);
  const elemento = document.getElementById('product_' + producto);
  if (elemento) {
    elemento.parentNode.removeChild(elemento);
  } else {
    console.log('Elemento no encontrado');
  }
});

socket.on('mostrarMsj', (data) => {
  mostrarMsj(data.tipo, data.mensaje);
});
