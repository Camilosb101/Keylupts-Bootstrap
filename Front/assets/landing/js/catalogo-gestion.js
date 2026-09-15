// Logica ligera para los catalogos de admin y empleado.
// Maneja el menu de perfil lateral y el buscador de productos.
// No incluye carrito ni pasarela de pago: esos son exclusivos del cliente.

const profileMenu = document.getElementById('menu-perfil');
const openMenuButton = document.getElementById('abrir-menu');
const closeMenuButton = document.getElementById('cerrar-menu');
const menuBackdrop = document.getElementById('capa-menu');
const searchForm = document.getElementById('buscador-productos');
const searchInput = document.getElementById('buscar-productos');
const productCards = document.querySelectorAll('.producto-card');

function setProfileMenuOpen(isOpen) {
    profileMenu.classList.toggle('is-open', isOpen);
    menuBackdrop.classList.toggle('is-open', isOpen);
    openMenuButton.setAttribute('aria-expanded', String(isOpen));
}

function filterProducts() {
    const searchTerm = searchInput.value.trim().toLocaleLowerCase('es');

    productCards.forEach((card) => {
        const cardText = card.textContent.toLocaleLowerCase('es');
        card.hidden = searchTerm !== '' && !cardText.includes(searchTerm);
    });
}

if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        filterProducts();
    });
    searchInput.addEventListener('input', filterProducts);
}

if (openMenuButton) {
    openMenuButton.addEventListener('click', () => {
        const isOpen = !profileMenu.classList.contains('is-open');
        setProfileMenuOpen(isOpen);
    });
    closeMenuButton.addEventListener('click', () => setProfileMenuOpen(false));
    menuBackdrop.addEventListener('click', () => setProfileMenuOpen(false));

    profileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setProfileMenuOpen(false));
    });
}
