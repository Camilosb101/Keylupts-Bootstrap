document.addEventListener('DOMContentLoaded', () => {
    const claveProductos = 'productos';
    const modal = document.querySelector('#modal-agregar-producto');
    const abrirModal = document.querySelector('#abrir-modal-producto');
    const cerrarModal = document.querySelectorAll('[data-cerrar-modal]');
    const formulario = document.querySelector('#formulario-producto');
    const tablaProductos = document.querySelector('#tabla-productos');
    const inventarioVacio = document.querySelector('#inventario-vacio');
    const tablaInventarioScroll = document.querySelector('#tabla-inventario-scroll');
    const botonEnviar = formulario.querySelector('[type="submit"]');
    let productoEditandoId = null;

    const leerProductos = () => {
        try {
            return JSON.parse(localStorage.getItem(claveProductos)) || [];
        } catch (error) {
            return [];
        }
    };

    const guardarProductos = (productos) => {
        localStorage.setItem(claveProductos, JSON.stringify(productos));
    };

    const formatearPesos = (valor) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(Number(valor) || 0);

    const nombreCategoria = (categoria) => categoria.charAt(0).toUpperCase() + categoria.slice(1);

    const crearCelda = (contenido, clase = '') => {
        const celda = document.createElement('td');
        celda.className = clase;
        celda.textContent = contenido;
        return celda;
    };

    const renderizarProductos = () => {
        const productos = leerProductos();
        tablaProductos.replaceChildren();
        inventarioVacio.classList.toggle('d-none', productos.length > 0);
        tablaInventarioScroll.classList.toggle('d-none', productos.length === 0);

        productos.forEach((producto) => {
            const fila = document.createElement('tr');
            const productoCelda = document.createElement('td');
            const productoContenido = document.createElement('div');
            const imagen = document.createElement('img');
            const nombre = document.createElement('span');
            const stock = Number(producto.stock) || 0;

            productoContenido.className = 'producto-tabla';
            imagen.className = 'producto-tabla-imagen';
            imagen.src = producto.imagen;
            imagen.alt = `Imagen de ${producto.nombre}`;
            nombre.className = 'producto-tabla-nombre';
            nombre.textContent = producto.nombre;
            productoContenido.append(imagen, nombre);
            productoCelda.append(productoContenido);

            fila.append(
                productoCelda,
                crearCelda(nombreCategoria(producto.categoria)),
                crearCelda(formatearPesos(producto.costo)),
                crearCelda(formatearPesos(producto.precioVenta), 'precio-venta')
            );

            const stockCelda = crearCelda(stock, stock < 8 ? 'stock-bajo' : '');
            if (stock < 8) {
                const alerta = document.createElement('i');
                alerta.className = 'bi bi-exclamation-triangle stock-alerta';
                alerta.setAttribute('aria-label', 'Stock bajo');
                alerta.title = 'Stock menor a 8';
                stockCelda.append(alerta);
            }
            fila.append(stockCelda);
            fila.append(crearCelda(`${producto.stockMinimo} / ${producto.stockMaximo}`));

            const estadoCelda = document.createElement('td');
            const estado = document.createElement('span');
            estado.className = `estado-producto${producto.estado === 'Inactivo' ? ' inactivo' : ''}`;
            estado.textContent = producto.estado || 'Activo';
            estadoCelda.append(estado);
            fila.append(estadoCelda);

            const accionesCelda = document.createElement('td');
            const acciones = document.createElement('div');
            const editar = document.createElement('button');
            const eliminar = document.createElement('button');
            acciones.className = 'acciones-producto';
            editar.className = 'accion-producto accion-editar';
            editar.type = 'button';
            editar.dataset.accion = 'editar';
            editar.dataset.id = producto.id;
            editar.innerHTML = '<i class="bi bi-pencil-square" aria-hidden="true"></i><span class="visually-hidden">Editar producto</span>';
            eliminar.className = 'accion-producto accion-eliminar';
            eliminar.type = 'button';
            eliminar.dataset.accion = 'eliminar';
            eliminar.dataset.id = producto.id;
            eliminar.innerHTML = '<i class="bi bi-x-circle" aria-hidden="true"></i><span class="visually-hidden">Eliminar producto</span>';
            acciones.append(editar, eliminar);
            accionesCelda.append(acciones);
            fila.append(accionesCelda);
            tablaProductos.append(fila);
        });
    };

    const mostrarModal = () => {
        modal.classList.add('visible');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-abierto');
        modal.querySelector('input').focus();
    };

    const ocultarModal = () => {
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-abierto');
        formulario.reset();
        productoEditandoId = null;
        botonEnviar.textContent = 'Agregar Producto';
    };

    abrirModal.addEventListener('click', mostrarModal);
    cerrarModal.forEach((elemento) => elemento.addEventListener('click', ocultarModal));

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && modal.classList.contains('visible')) {
            ocultarModal();
        }
    });

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            ocultarModal();
        }
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const productos = leerProductos();
        const producto = {
            id: productoEditandoId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            nombre: document.querySelector('#nombre-producto').value.trim(),
            categoria: document.querySelector('#categoria-producto').value,
            costo: document.querySelector('#precio-costo').value,
            precioVenta: document.querySelector('#precio-venta').value,
            stock: document.querySelector('#stock-actual').value,
            stockMinimo: document.querySelector('#stock-minimo').value,
            stockMaximo: document.querySelector('#stock-maximo').value,
            descripcion: document.querySelector('#descripcion-producto').value.trim(),
            imagen: document.querySelector('#url-imagen').value.trim(),
            estado: 'Activo'
        };

        const indiceProducto = productos.findIndex((elemento) => elemento.id === producto.id);
        if (indiceProducto === -1) {
            productos.push(producto);
        } else {
            productos[indiceProducto] = producto;
        }

        guardarProductos(productos);
        renderizarProductos();
        ocultarModal();
    });

    tablaProductos.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-accion]');
        if (!boton) {
            return;
        }

        const productos = leerProductos();
        const producto = productos.find((elemento) => elemento.id === boton.dataset.id);
        if (!producto) {
            return;
        }

        if (boton.dataset.accion === 'eliminar') {
            guardarProductos(productos.filter((elemento) => elemento.id !== producto.id));
            renderizarProductos();
            return;
        }

        productoEditandoId = producto.id;
        document.querySelector('#nombre-producto').value = producto.nombre;
        document.querySelector('#categoria-producto').value = producto.categoria;
        document.querySelector('#precio-costo').value = producto.costo;
        document.querySelector('#precio-venta').value = producto.precioVenta;
        document.querySelector('#stock-actual').value = producto.stock;
        document.querySelector('#stock-minimo').value = producto.stockMinimo;
        document.querySelector('#stock-maximo').value = producto.stockMaximo;
        document.querySelector('#descripcion-producto').value = producto.descripcion;
        document.querySelector('#url-imagen').value = producto.imagen;
        botonEnviar.textContent = 'Guardar Cambios';
        mostrarModal();
    });

    renderizarProductos();
});
