// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    const navMobile = document.querySelector('.nav-mobile');
    navMobile.classList.toggle('active');
});

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    const icon = document.querySelector('#dark-mode-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelector('#dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
}

// Load Menu from JSON
async function loadMenu() {
    const response = await fetch('menu.json');
    const sandwiches = await response.json();
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    sandwiches.forEach(s => {
        const item = document.createElement('div');
        item.classList.add('menu-item', 'animate-item');
        item.dataset.id = s.id;
        item.innerHTML = `
            <img src="${s.img}" alt="${s.name}" loading="lazy">
            <div class="menu-info">
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <span class="price">${s.price}</span>
                <button class="add-to-cart" data-id="${s.id}"><i class="fas fa-plus"></i> Agregar</button>
            </div>
        `;
        menuContainer.appendChild(item);
    });

    // Add to Cart Event Listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const sandwich = sandwiches.find(s => s.id === id);
            addToCart(sandwich);
        });
    });
}

// Load Favorites
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const container = document.getElementById('favorites-container');
    container.innerHTML = '';
    favorites.forEach((f, i) => {
        const item = document.createElement('div');
        item.classList.add('menu-item', 'animate-item');
        item.innerHTML = `
            <div class="menu-info">
                <h3>Favorito #${i + 1}</h3>
                <p>${Object.entries(f).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${Array.isArray(v) ? v.join(', ') : v}`).join('<br>')}</p>
                <button class="add-to-cart" data-fav="${i}"><i class="fas fa-plus"></i> Agregar</button>
            </div>
        `;
        container.appendChild(item);
    });
    document.querySelectorAll('#favorites .add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const favIndex = btn.dataset.fav;
            addToCart({ id: Date.now(), name: `Favorito #${parseInt(favIndex) + 1}`, sandwich: favorites[favIndex], custom: true });
        });
    });
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(item) {
    const existing = cart.find(i => i.id === item.id && !i.custom);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...item, quantity: 1, custom: item.custom || false });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.img || 'assets/hero-sandwich.webp'}" alt="${item.name}" loading="lazy">
            <div>
                <strong>${item.name}</strong>
                <p>${item.custom ? 'Personalizado' : item.price}</p>
                <span>Cantidad: ${item.quantity}</span>
            </div>
            <button onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
        `;
        cartItems.appendChild(div);
    });

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCountMobile.textContent = totalItems;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Cart Modal Toggle
document.getElementById('cart-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('cart-modal').classList.toggle('active');
});

document.getElementById('cart-toggle-mobile').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('cart-modal').classList.toggle('active');
});

document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.remove('active');
});

document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
});

document.getElementById('checkout').addEventListener('click', () => {
    const address = document.getElementById('delivery-address').value.trim();
    const promoCode = document.getElementById('promo-code').value;
    if (!address || address.length < 5) {
        alert('Por favor, ingresá una dirección válida (mínimo 5 caracteres).');
        return;
    }
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    const orderId = `AP${Date.now().toString().slice(-6)}`;
    let discountMessage = '';
    if (promoCode === 'ALTA10') {
        discountMessage = 'Descuento 10% aplicado!\n';
    }
    let message = `${discountMessage}Nuevo pedido (ID: ${orderId}):\nDirección: ${address}\n\n`;
    cart.forEach(item => {
        if (item.custom) {
            message += `Sándwich Personalizado (${item.quantity}):\n`;
            for (let key in item.sandwich) {
                message += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(item.sandwich[key]) ? item.sandwich[key].join(', ') : item.sandwich[key]}\n`;
            }
        } else {
            message += `${item.name} (${item.quantity}) - ${item.price}\n`;
        }
        message += '\n';
    });
    message += `Fecha: ${new Date().toLocaleString()}`;

    // Guardar pedido
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({ id: orderId, address, items: cart, timestamp: new Date().toLocaleString() });
    localStorage.setItem('orders', JSON.stringify(orders));

    const whatsappMessage = encodeURIComponent(message);
    window.open(`https://wa.me/56912345678?text=${whatsappMessage}`, '_blank');

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('delivery-address').value = '';
    document.getElementById('promo-code').value = '';
    updateCart();
    document.getElementById('cart-modal').classList.remove('active');
});

// Initial Load
loadMenu();
loadFavorites();
updateCart();