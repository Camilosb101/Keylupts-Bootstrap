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


// --- Gestion de productos (solo catalogo-admin): editar y eliminar ---
// Los cambios se aplican en la vista (prototipo), no persisten al recargar.

const editModal = document.getElementById('modal-editar');
const editForm = document.getElementById('formulario-editar');
const closeEditButton = document.getElementById('cerrar-editar');
const editName = document.getElementById('editar-nombre');
const editCategory = document.getElementById('editar-categoria');
const editDescription = document.getElementById('editar-descripcion');
const editPrice = document.getElementById('editar-precio');

// Card que se esta editando en este momento.
let currentCard = null;

function formatCLP(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    }).format(value);
}

// Convierte "$18.500" en el numero 18500.
function parsePrice(text) {
    const digits = text.replace(/[^\d]/g, '');
    return digits ? Number(digits) : 0;
}

function setEditModalOpen(isOpen) {
    if (!editModal) return;
    editModal.classList.toggle('is-open', isOpen);
    editModal.setAttribute('aria-hidden', String(!isOpen));
}

function openEditModal(card) {
    currentCard = card;
    editName.value = card.querySelector('h3').textContent.trim();
    editDescription.value = card.querySelector('.producto-contenido p').textContent.trim();
    editCategory.value = card.querySelector('.categoria').textContent.trim();
    editPrice.value = parsePrice(card.querySelector('.producto-pie strong').textContent);
    setEditModalOpen(true);
}

if (editModal && editForm) {
    // Delegacion de eventos sobre la grilla de productos.
    document.querySelector('.productos-grid').addEventListener('click', (event) => {
        const editButton = event.target.closest('.accion-producto.editar');
        const deleteButton = event.target.closest('.accion-producto.eliminar');
        const card = event.target.closest('.producto-card');
        if (!card) return;

        if (editButton) {
            openEditModal(card);
        } else if (deleteButton) {
            const name = card.querySelector('h3').textContent.trim();
            if (window.confirm(`¿Eliminar "${name}" del catálogo?`)) {
                // Quita la columna que envuelve la card.
                card.closest('.col').remove();
            }
        }
    });

    // Guardar cambios del formulario en la card.
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!currentCard) return;

        currentCard.querySelector('h3').textContent = editName.value.trim();
        currentCard.querySelector('.producto-contenido p').textContent = editDescription.value.trim();
        currentCard.querySelector('.categoria').textContent = editCategory.value;
        currentCard.querySelector('.producto-pie strong').textContent = formatCLP(Number(editPrice.value) || 0);

        setEditModalOpen(false);
        currentCard = null;
    });

    closeEditButton.addEventListener('click', () => setEditModalOpen(false));
    editModal.addEventListener('click', (event) => {
        if (event.target === editModal) setEditModalOpen(false);
    });
}
