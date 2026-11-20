document.addEventListener('DOMContentLoaded', () => {
    // Search & Filter Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const strainCards = document.querySelectorAll('.strain-card');
    const searchInput = document.getElementById('strainSearch');
    const noResults = document.getElementById('noResults');

    // Modal Elements
    const modal = document.getElementById('strainModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    const modalTHC = document.getElementById('modalTHC');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalEffects = document.getElementById('modalEffects');

    let currentCategory = 'all';

    // ==========================================================================
    // 1. Filter & Search Logic
    // ==========================================================================
    function filterStrains() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visibleCount = 0;

        strainCards.forEach(card => {
            const strainName = card.getAttribute('data-name')?.toLowerCase() || card.querySelector('h3').textContent.toLowerCase();
            const cardCategories = card.getAttribute('data-category');

            const matchesCategory = (currentCategory === 'all' || cardCategories.includes(currentCategory));
            const matchesSearch = strainName.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        if (noResults) {
            noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.getAttribute('data-filter');
            filterStrains();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterStrains);
    }

    // ==========================================================================
    // 2. Modal Popup Logic
    // ==========================================================================
    function openModal(card) {
        const name = card.getAttribute('data-name');
        const tag = card.getAttribute('data-tag');
        const thc = card.getAttribute('data-thc');
        const price = card.getAttribute('data-price');
        const desc = card.getAttribute('data-desc');
        const effects = card.getAttribute('data-effects');

        // Populate Modal Fields
        modalTitle.textContent = name;
        modalTHC.textContent = thc;
        modalPrice.textContent = price;
        modalDesc.textContent = desc;
        modalEffects.textContent = effects;

        // Apply Tag styling (Sativa, Indica, Hybrid)
        modalTag.textContent = tag;
        modalTag.className = `strain-tag ${tag.toLowerCase()}`;

        // Show Modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Click Strain Card -> Open Modal
    strainCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    // Close Actions
    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Close when clicking overlay backdrop
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 0. Auth Session & Profile Management
    // ==========================================================================
    const userHandleDisplay = document.getElementById('userHandleDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    // Retrieve logged-in user handle from LocalStorage
    const savedHandle = localStorage.getItem('userHandle');
    if (savedHandle && userHandleDisplay) {
        userHandleDisplay.textContent = savedHandle;
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear session data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userHandle');

            // Redirect back to login page
            window.location.href = 'elton_login.html';
        });
    }

    // ... (rest of your existing strain filter, search, and modal code) ...
});
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
            const name = card.getAttribute('data-name').toLowerCase();
            const desc = card.getAttribute('data-desc').toLowerCase();
            const category = card.getAttribute('data-category');
            const stock = card.getAttribute('data-stock');

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
    let cart = JSON.parse(localStorage.getItem('eltonCart')) || [];

    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function saveAndRenderCart() {
        localStorage.setItem('eltonCart', JSON.stringify(cart));

        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        cartCount.textContent = totalQty;
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

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
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
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
        if (card.getAttribute('data-stock') !== 'in') return;

        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price'));
        const img = card.getAttribute('data-img');

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, img, qty: 1 });
        }

            const lowerCartTotal = document.getElementById('lowerCartTotal');

    function saveAndRenderCart() {
        localStorage.setItem('eltonCart', JSON.stringify(cart));

        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const formattedTotal = `$${totalPrice.toFixed(2)}`;

        cartCount.textContent = totalQty;
        cartTotal.textContent = formattedTotal;
        if (lowerCartTotal) lowerCartTotal.textContent = formattedTotal;

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
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }


    cartToggleBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
    cartCloseBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Your cart is empty.');
        const lines = cart.map(i => `• ${i.name} (x${i.qty}) - $${(i.price * i.qty).toFixed(2)}`);
        const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);
        const msg = encodeURIComponent(`Hello Elton City Hub! I'd like to order:\n\n${lines.join('\n')}\n\nTotal: $${total}`);
        window.open(`https://wa.me/1234567890?text=${msg}`, '_blank');
    });

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
        activeCard = card;
        const inStock = card.getAttribute('data-stock') === 'in';

        modalImg.src = card.getAttribute('data-img');
        modalTitle.textContent = card.getAttribute('data-name');
        modalPrice.textContent = card.getAttribute('data-price-label');
        modalDesc.textContent = card.getAttribute('data-desc');

        modalStockBadge.textContent = inStock ? '● ON STOCK' : '✕ OUT OF STOCK';
        modalStockBadge.className = `stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`;

        modalAddCartBtn.disabled = !inStock;
        modalAddCartBtn.textContent = inStock ? '🛒 Add to Cart' : 'Out of Stock';

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    productCards.forEach(card => {
        const addBtn = card.querySelector('.btn-cart-add');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(card);
        });

        card.addEventListener('click', () => openModal(card));
    });

    modalAddCartBtn.addEventListener('click', () => {
        if (activeCard) {
            addToCart(activeCard);
            closeModal();
        }
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            cartOverlay.classList.remove('active');
        }
    });

    // Initial render of saved cart
    saveAndRenderCart();
});
