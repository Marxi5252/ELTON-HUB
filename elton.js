document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 0. Auth Session & Profile Management
    // ==========================================================================
    const userHandleDisplay = document.getElementById('userHandleDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    const savedHandle = localStorage.getItem('userHandle');
    if (savedHandle && userHandleDisplay) {
        userHandleDisplay.textContent = savedHandle;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userHandle');
            window.location.href = 'elton_login.html';
        });
    }

    // ==========================================================================
    // 1. Product Search & Category Filter Logic
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('strainSearch');
    const noResults = document.getElementById('noResults');
    let currentFilter = 'all';

    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visibleCount = 0;

        productCards.forEach(card => {
            const name = (card.getAttribute('data-name') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();
            const category = card.getAttribute('data-category') || '';
            const stock = card.getAttribute('data-stock') || '';

            const matchesFilter =
                currentFilter === 'all' ||
                (currentFilter === 'instock' && stock === 'in') ||
                category.includes(currentFilter);

            const matchesSearch = name.includes(searchTerm) || desc.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            filterProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // ==========================================================================
    // 2. Shopping Cart Logic (Persisted in LocalStorage)
    // ==========================================================================
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('eltonCart')) || [];
    } catch {
        cart = [];
    }

    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const lowerCartTotal = document.getElementById('lowerCartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function saveAndRenderCart() {
        localStorage.setItem('eltonCart', JSON.stringify(cart));

        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const formattedTotal = `$${totalPrice.toFixed(2)}`;

        if (cartCount) cartCount.textContent = totalQty;
        if (cartTotal) cartTotal.textContent = formattedTotal;
        if (lowerCartTotal) lowerCartTotal.textContent = formattedTotal;

        if (!cartItemsList) return;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="no-results">Your cart is empty.</p>';
            return;
        }

        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>$${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="cart-qty-controls">
                    <button type="button" class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button type="button" class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    window.updateQty = (id, delta) => {
        const index = cart.findIndex(item => item.id === id);
        if (index === -1) return;

        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveAndRenderCart();
    };

    function addToCart(card) {
        if (!card || card.getAttribute('data-stock') !== 'in') return;

        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price')) || 0;
        const img = card.getAttribute('data-img');

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, img, qty: 1 });
        }

        saveAndRenderCart();
    }

    if (cartToggleBtn && cartOverlay) {
        cartToggleBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
    }
    if (cartCloseBtn && cartOverlay) {
        cartCloseBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Your cart is empty.');
            const lines = cart.map(i => `• ${i.name} (x${i.qty}) - $${(i.price * i.qty).toFixed(2)}`);
            const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);
            const msg = encodeURIComponent(`Hello Elton City Hub! I'd like to order:\n\n${lines.join('\n')}\n\nTotal: $${total}`);
            window.open(`https://wa.me/1234567890?text=${msg}`, '_blank');
        });
    }

    // ==========================================================================
    // 3. Product Quick-View Modal & Card Click Events
    // ==========================================================================
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalStockBadge = document.getElementById('modalStockBadge');
    const modalPrice = document.getElementById('modalPrice');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalAddCartBtn = document.getElementById('modalAddCartBtn');
    let activeCard = null;

    function openModal(card) {
        if (!modal) return;
        activeCard = card;
        const inStock = card.getAttribute('data-stock') === 'in';

        if (modalImg) modalImg.src = card.getAttribute('data-img') || '';
        if (modalTitle) modalTitle.textContent = card.getAttribute('data-name') || '';
        if (modalPrice) modalPrice.textContent = card.getAttribute('data-price-label') || '';
        if (modalDesc) modalDesc.textContent = card.getAttribute('data-desc') || '';

        if (modalStockBadge) {
            modalStockBadge.textContent = inStock ? '● ON STOCK' : '✕ OUT OF STOCK';
            modalStockBadge.className = `stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`;
        }

        if (modalAddCartBtn) {
            modalAddCartBtn.disabled = !inStock;
            modalAddCartBtn.textContent = inStock ? '🛒 Add to Cart' : 'Out of Stock';
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    productCards.forEach(card => {
        const addBtn = card.querySelector('.btn-cart-add');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(card);
            });
        }

        card.addEventListener('click', () => openModal(card));
    });

    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
            if (activeCard) {
                addToCart(activeCard);
                closeModal();
            }
        });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (cartOverlay) cartOverlay.classList.remove('active');
        }
    });

    // Initial render of saved cart
    saveAndRenderCart();
});
