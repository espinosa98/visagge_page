// Función para confirmar la compra y enviar el mensaje a WhatsApp
function confirmarCompra() {
    // Generar mensaje con detalles del carrito
    let mensajePedido = 'Detalles del Pedido:\n';

    carrito.forEach((item) => {
        mensajePedido += `
            Nombre: ${item.nombre}
            Referencia: ${item.referencia}
            Precio: ${item.precio}
            Talla: ${item.talla}\n
        `;
    });

    // Redirigir a WhatsApp con el detalle del pedido
    window.location.href = `https://wa.me/573054608795?text=${encodeURIComponent(mensajePedido)}`;
}


// funcion para almacenar el carrito en el localstorage
function guardarCarritoLocalStorage(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    return carrito;
}

export { confirmarCompra , guardarCarritoLocalStorage };