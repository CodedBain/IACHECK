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

// Load Options from JSON
async function loadOptions() {
    const response = await fetch('options.json');
    const options = await response.json();
    const groups = {
        'pan': document.getElementById('pan-options'),
        'proteina': document.getElementById('proteina-options'),
        'queso': document.getElementById('queso-options'),
        'vegetales': document.getElementById('vegetales-options'),
        'salsas': document.getElementById('salsas-options')
    };

    for (let category in options) {
        const group = groups[category];
        options[category].forEach(o => {
            const div = document.createElement('div');
            div.classList.add('option');
            div.innerHTML = `
                <img src="${o.img || 'assets/hero-sandwich.webp'}" alt="${o.name}" loading="lazy">
                <label><input type="${category === 'pan' || category === 'proteina' ? 'radio' : 'checkbox'}" name="${category}" value="${o.name}"> ${o.name}</label>
            `;
            group.appendChild(div);
        });
    }

    // Add Event Listeners
    document.querySelectorAll('.option input').forEach(input => {
        input.addEventListener('change', () => {
            const option = input.closest('.option');
            if (input.type === 'radio' && input.checked) {
                option.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            }
            option.classList.toggle('selected', input.checked);
            updatePreview();
        });
    });
}

// Update Preview
function updatePreview() {
    const previewList = document.getElementById('preview-list');
    previewList.innerHTML = '';

    ['pan', 'proteina', 'queso', 'vegetales', 'salsas'].forEach(category => {
        const selected = Array.from(document.querySelectorAll(`input[name="${category}"]:checked`));
        if (selected.length) {
            const li = document.createElement('li');
            li.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${selected.map(s => s.value).join(', ')}`;
            previewList.appendChild(li);
        }
    });
}

// Order Form Submission
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const sandwich = {};
    ['pan', 'proteina', 'queso', 'vegetales', 'salsas'].forEach(category => {
        if (category === 'pan' || category === 'proteina') {
            const selected = document.querySelector(`input[name="${category}"]:checked`);
            if (selected) sandwich[category] = selected.value;
        } else {
            const selected = Array.from(document.querySelectorAll(`input[name="${category}"]:checked`));
            if (selected.length) sandwich[category] = selected.map(s => s.value);
        }
    });

    if (!sandwich.pan || !sandwich.proteina) {
        alert('Por favor, selecciona al menos un pan y una proteína.');
        return;
    }

    const order = {
        id: Date.now(),
        name: 'Sándwich Personalizado',
        sandwich: sandwich,
        quantity: 1,
        custom: true
    };

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.custom && JSON.stringify(i.sandwich) === JSON.stringify(order.sandwich));
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(order);
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('¡Sándwich añadido al carrito! Revisa tu pedido en el carrito.');
    document.getElementById('order-form').reset();
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    updatePreview();
});

// Save Favorite
document.getElementById('save-favorite').addEventListener('click', () => {
    const sandwich = {};
    ['pan', 'proteina', 'queso', 'vegetales', 'salsas'].forEach(category => {
        if (category === 'pan' || category === 'proteina') {
            const selected = document.querySelector(`input[name="${category}"]:checked`);
            if (selected) sandwich[category] = selected.value;
        } else {
            const selected = Array.from(document.querySelectorAll(`input[name="${category}"]:checked`));
            if (selected.length) sandwich[category] = selected.map(s => s.value);
        }
    });
    if (!sandwich.pan || !sandwich.proteina) {
        alert('Por favor, selecciona al menos un pan y una proteína para guardar.');
        return;
    }
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.push(sandwich);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('¡Sándwich guardado como favorito!');
});

// Cart Management (repetido para personaliza.html)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

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
loadOptions();
updateCart();