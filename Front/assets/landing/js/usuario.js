const cart = [];
const cartList = document.getElementById('lista-carrito');
const counter = document.getElementById('contador-carrito');
const totalTag = document.querySelector('.carrito-footer strong');
const cartPanel = document.querySelector('.panel-carrito');
const openCartButton = document.getElementById('abrir-carrito');
const closeCartButton = document.querySelector('.cerrar-carrito');
const profileMenu = document.getElementById('menu-perfil');
const openMenuButton = document.getElementById('abrir-menu');
const closeMenuButton = document.getElementById('cerrar-menu');
const menuBackdrop = document.getElementById('capa-menu');
const searchForm = document.getElementById('buscador-productos');
const searchInput = document.getElementById('buscar-productos');
const productCards = document.querySelectorAll('.producto-card');
const continueButton = document.getElementById('continuar-pago');
const paymentModal = document.getElementById('modal-pago');
const closePaymentButton = document.getElementById('cerrar-pago');
const paymentForm = document.getElementById('formulario-pago');
const paymentMethod = document.getElementById('medio-pago');
const cardDetails = document.getElementById('datos-tarjeta');
const paymentTotal = document.getElementById('total-pago');

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    }).format(value);
}

function setCartOpen(isOpen) {
    cartPanel.classList.toggle('is-open', isOpen);
    openCartButton.setAttribute('aria-expanded', String(isOpen));
}

function setProfileMenuOpen(isOpen) {
    profileMenu.classList.toggle('is-open', isOpen);
    menuBackdrop.classList.toggle('is-open', isOpen);
    openMenuButton.setAttribute('aria-expanded', String(isOpen));
}

function setPaymentModalOpen(isOpen) {
    paymentModal.classList.toggle('is-open', isOpen);
    paymentModal.setAttribute('aria-hidden', String(!isOpen));
}

function renderCart() {
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="carrito-vacio"><span>Tu carrito está vacío.</span></li>';
        counter.textContent = '0';
        totalTag.textContent = formatCurrency(0);
        return;
    }

    cart.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'carrito-item';
        li.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <small>1 unidad</small>
            </div>
            <div class="item-acciones">
                <span>${formatCurrency(item.price)}</span>
                <button type="button" class="eliminar-item" data-name="${item.name}">Eliminar</button>
            </div>
        `;
        cartList.appendChild(li);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    counter.textContent = String(cart.length);
    totalTag.textContent = formatCurrency(total);
}

function filterProducts() {
    const searchTerm = searchInput.value.trim().toLocaleLowerCase('es');

    productCards.forEach((card) => {
        const cardText = card.textContent.toLocaleLowerCase('es');
        card.hidden = searchTerm !== '' && !cardText.includes(searchTerm);
    });
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    filterProducts();
});

searchInput.addEventListener('input', filterProducts);

continueButton.addEventListener('click', () => {
    if (cart.length === 0) {
        window.alert('Agrega al menos un producto antes de continuar.');
        return;
    }

    paymentTotal.textContent = formatCurrency(cart.reduce((sum, item) => sum + item.price, 0));
    setPaymentModalOpen(true);
});

closePaymentButton.addEventListener('click', () => {
    setPaymentModalOpen(false);
});

paymentModal.addEventListener('click', (event) => {
    if (event.target === paymentModal) setPaymentModalOpen(false);
});

paymentMethod.addEventListener('change', () => {
    cardDetails.hidden = paymentMethod.value !== 'tarjeta';
});

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    window.alert('Pago simulado recibido. Tu pedido ha sido registrado en el prototipo.');
    setPaymentModalOpen(false);
    setCartOpen(false);
});

openCartButton.addEventListener('click', () => {
    const isOpen = !cartPanel.classList.contains('is-open');
    setCartOpen(isOpen);
});

closeCartButton.addEventListener('click', () => {
    setCartOpen(false);
});

openMenuButton.addEventListener('click', () => {
    const isOpen = !profileMenu.classList.contains('is-open');
    setProfileMenuOpen(isOpen);
});

closeMenuButton.addEventListener('click', () => {
    setProfileMenuOpen(false);
});

menuBackdrop.addEventListener('click', () => {
    setProfileMenuOpen(false);
});

profileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        setProfileMenuOpen(false);
    });
});

document.querySelectorAll('.agregar-carrito').forEach((button) => {
    button.addEventListener('click', () => {
        const name = button.dataset.product;
        const price = Number(button.dataset.price);
        const existing = cart.find((item) => item.name === name);

        if (!existing) {
            cart.push({ name, price });
        }

        renderCart();
    });
});

cartList.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.classList.contains('eliminar-item')) return;

    const productName = target.dataset.name;
    const index = cart.findIndex((item) => item.name === productName);
    if (index >= 0) {
        cart.splice(index, 1);
    }

    renderCart();
});

renderCart();
