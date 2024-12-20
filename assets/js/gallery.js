import { imagenes } from './params_img.js';
import { guardarCarritoLocalStorage } from './carrito.js';

// Función para generar dinámicamente las galerías
function generarGaleria() {
    var galleryContainer = document.getElementById('gallery-container');

    imagenes.forEach(function(imagen) {
        var galleryItem = document.createElement('div');
        galleryItem.className = 'col-xl-3 col-lg-4 col-md-6 col-6';

        galleryItem.innerHTML = `
            <div class="gallery-item h-100 position-relative">
                <!-- Triángulo "Preordenar" si imagen.preorden es true -->
                ${imagen.preorden ? `
                    <div class="preorder-triangle">
                        <span>Preordenar</span>
                    </div>
                ` : ''}

                <img src="${imagen.principal}" class="img-fluid" alt="">
                <img src="${imagen.interna}" class="img-hover img-fluid" alt="">

                ${!imagen.disponible ? `
                    <div class="overlay-not-available">
                        <span>No disponible</span>
                    </div>
                ` : ''}
                <div class="gallery-links d-flex align-items-center justify-content-center">
                    ${imagen.disponible ? `
                        <button class="btn-modal" data-bs-toggle="modal" data-bs-target="#detailModal">
                            <i class="bi bi-link-45deg"></i>Ver
                        </button>
                    ` : ''}
                </div>
                <div class="image-details">
                    <figcaption>${imagen.referencia}</figcaption>
                    <div class="price">$${imagen.precio}</div>
                    <div class="size-chart">
                        <div class="size-boxes">
                            <div class="size-box">M</div>
                            <div class="size-box">L</div>
                            <div class="size-box">XL</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        galleryContainer.appendChild(galleryItem);

        if (imagen.disponible) {
            var btnModal = galleryItem.querySelector('.btn-modal');
            btnModal.addEventListener('click', function() {
                mostrarDetallesModal(imagen);
            });
        }
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

    // mensaje a las que tienen preordenar
    var preorden = modal.querySelector('#preorden');

    modalImg.src = imagen.imagen_carrousel;
    modalImg2.src = imagen.imagen_carrousel_2;
    modalTitle.innerHTML = imagen.referencia;
    modalPrice.innerHTML = `Precio: $${imagen.precio}`;

    // si es preordenar
    if (imagen.preorden) {
        preorden.innerHTML = '<span class="text-warning">Pre ordenar, lanzamiento en 5 días</span>';
    }
    else {
        preorden.innerHTML = '';
    }

    // Agregar evento de clic al botón para mostrar SweetAlert antes de enviar a WhatsApp
    modalWhatsapp.addEventListener('click', function() {
        // Obtener la talla seleccionada directamente al hacer clic
        var tallaSeleccionada = modal.querySelector('#talla').value;
        // obtener cantidad seleccionada
        var cantidadSeleccionada = modal.querySelector('#quantity').value;
        // Convertir la cadena a un número entero
        var cantidadSeleccionada = parseInt(cantidadSeleccionada);

        // Validar que cantidad sea mayor a 0
        if (cantidadSeleccionada <= 0) {
            Swal.fire({
                icon: 'error',
                title: '¡La cantidad debe ser mayor a 0!',
                text: 'su cantidad Ingresada es: ' + cantidadSeleccionada,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

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