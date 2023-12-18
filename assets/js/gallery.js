import { imagenes } from './params_img.js';
import { guardarCarritoLocalStorage } from './carrito.js';

// Función para generar dinámicamente las galerías
function generarGaleria() {
    var galleryContainer = document.getElementById('gallery-container');

    imagenes.forEach(function(imagen) {
        var galleryItem = document.createElement('div');
        galleryItem.className = 'col-xl-3 col-lg-4 col-md-6 col-6';

        galleryItem.innerHTML = `
            <div class="gallery-item h-100">
                <img src="${imagen.principal}" class="img-fluid" alt="">
                <img src="${imagen.interna}"  class="img-hover img-fluid" alt="">
                <div class="gallery-links d-flex align-items-center justify-content-center">
                    <button class="btn-modal" data-bs-toggle="modal" data-bs-target="#detailModal">
                        <i class="bi bi-link-45deg"></i>Ver
                    </button>
                </div>
                <div class="image-details">
                    <figcaption> ${imagen.referencia} </figcaption>
                    <div class="price">$${imagen.precio}</div>
                    <div class="size-chart">
                        <div class="size-boxes">
                            <div class="size-box">S</div>
                            <div class="size-box">M</div>
                            <div class="size-box">L</div>
                            <div class="size-box">XL</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        galleryContainer.appendChild(galleryItem);

        // Agregar evento de clic al botón para abrir el modal
        var btnModal = galleryItem.querySelector('.btn-modal');
        btnModal.addEventListener('click', function() {
            // Obtener datos de la imagen actual y mostrarlos en el modal
            mostrarDetallesModal(imagen);
        });
    });
}

// Llama a la función para generar la galería al cargar la página
window.onload = generarGaleria;

// obtener el carrito del localstorage

function obtenerCarritoLocalStorage() {
    let carritoLS;

    if (localStorage.getItem('carrito') === null) {
        carritoLS = [];
    } else {
        carritoLS = JSON.parse(localStorage.getItem('carrito'));
    }
    return carritoLS;

}

// obtener el carrito del localstorage
let carrito = obtenerCarritoLocalStorage();
// Función para mostrar detalles en el modal
function mostrarDetallesModal(imagen) {

    var modal = document.getElementById('detailModal');

    // Imagen carrousel
    var modalImg = modal.querySelector('.modal-body #img1');
    var modalImg2 = modal.querySelector('.modal-body #img2');

    // tituo del modal
    var modalTitle = modal.querySelector('.modal-body h5');
    // precio modal
    var modalPrice = modal.querySelector('.modal-body .price');
    // mensaje whatsapp
    var modalWhatsapp = modal.querySelector('.modal-body .btn-modal');
    // obtener talla seleccionada
    var tallaSeleccionada = modal.querySelector('#talla').value;

    modalImg.src = imagen.imagen_carrousel;
    modalImg2.src = imagen.imagen_carrousel_2;
    modalTitle.innerHTML = imagen.referencia;
    modalPrice.innerHTML = `Precio: $${imagen.precio}`;

    // Agregar evento de clic al botón para mostrar SweetAlert antes de enviar a WhatsApp
    modalWhatsapp.addEventListener('click', function() {
        // Obtener la talla seleccionada directamente al hacer clic
        var tallaSeleccionada = modal.querySelector('#talla').value;
        // obtener cantidad seleccionada
        var cantidadSeleccionada = modal.querySelector('#quantity').value;

        // Mensaje de confirmación antes de enviar
        Swal.fire({
            title: '¿Confirmar pedido?',
            html: `
                    Detalles del Pedido:<br>
                    Referencia: ${imagen.referencia}<br>
                    Precio: ${imagen.precio}<br>
                    Talla: ${tallaSeleccionada}<br>
                    Cantidad: ${cantidadSeleccionada}<br>
                `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            confirmButtonColor: '#4CAF50',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                // verificar si ya existe el producto en el carrito
                const existe = carrito.some(item => item.referencia === imagen.referencia);
                if (existe) {
                    // enviar mensaje de que ya existe el producto en el carrito
                    Swal.fire({
                        icon: 'info',
                        title: '¡El producto ya existe en el carrito!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    return;
                }

                // Agregar al carrito
                carrito.push({
                    imagen: imagen.imagen_carrousel,
                    referencia: imagen.referencia,
                    precio: imagen.precio,
                    talla: tallaSeleccionada,
                    cantidad: cantidadSeleccionada,
                });

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto agregado al carrito!',
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Guardar carrito en el localstorage
                guardarCarritoLocalStorage(carrito);
                // Mostrar el numero de productos
                const contadorCarrito = document.querySelector('#contador-carrito');
                contadorCarrito.innerHTML = obtenerCarritoLocalStorage().length;
            }
        });
    });
}

export { carrito };