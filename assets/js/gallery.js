var imagenes = [
    { principal: "assets/img/gallery/galeria_camisetas.webp", interna: "assets/img/gallery/galeria_camisetas_2.webp",
     imagen_carrousel: "assets/img/gallery/galeria_camisetas.webp", imagen_carrousel_2: "assets/img/gallery/galeria_camisetas_2.webp" },
];

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
                    <figcaption>Descripción breve de la imagen</figcaption>
                    <div class="price">$99.99</div>
                    <div class="size-chart">
                        <!-- Cuadro de tallas en recuadros horizontales -->
                        <div class="size-boxes">
                            <div class="size-box">XS</div>
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

// Función para mostrar detalles en el modal
function mostrarDetallesModal(imagen) {

    var modal = document.getElementById('detailModal');

    // Imagen carrousel
    var modalImg = modal.querySelector('.modal-body #img1');
    var modalImg2 = modal.querySelector('.modal-body #img2');

    modalImg.src = imagen.imagen_carrousel;
    modalImg2.src = imagen.imagen_carrousel;
}
