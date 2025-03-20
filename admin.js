// Logout
document.getElementById('logout').addEventListener('click', () => {
    fetch('login.php', { method: 'POST', body: new URLSearchParams('logout=true') })
        .then(() => location.reload());
});

// Load Menu List
async function loadMenuList() {
    const response = await fetch('menu.json');
    const sandwiches = await response.json();
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';

    sandwiches.forEach(s => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
            <img src="${s.img}" alt="${s.name}" loading="lazy">
            <div>
                <strong>${s.name}</strong><br>
                <span>${s.price}</span><br>
                <small>${s.desc}</small>
            </div>
            <button onclick="editSandwich(${s.id})"><i class="fas fa-edit"></i> Editar</button>
            <button onclick="deleteSandwich(${s.id})"><i class="fas fa-trash"></i> Eliminar</button>
        `;
        menuList.appendChild(item);
    });
}

// Load Order List
function loadOrderList() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.forEach(o => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
            <div>
                <strong>ID: ${o.id}</strong><br>
                <small>Dirección: ${o.address} - Fecha: ${o.timestamp}</small><br>
                <p>${o.items.map(i => `${i.name} (${i.quantity})${i.custom ? ' - Personalizado' : ''}`).join('<br>')}</p>
            </div>
            <button onclick="deleteOrder('${o.id}')"><i class="fas fa-trash"></i> Eliminar</button>
        `;
        orderList.appendChild(item);
    });
}

function deleteOrder(id) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrderList();
}

// Edit Sandwich
function editSandwich(id) {
    fetch('menu.json')
        .then(response => response.json())
        .then(sandwiches => {
            const sandwich = sandwiches.find(s => s.id === id);
            document.getElementById('sandwich-id').value = sandwich.id;
            document.getElementById('sandwich-name').value = sandwich.name;
            document.getElementById('sandwich-desc').value = sandwich.desc;
            document.getElementById('sandwich-price').value = sandwich.price;
            document.getElementById('sandwich-img').value = sandwich.img;
        });
}

// Delete Sandwich
function deleteSandwich(id) {
    if (confirm('¿Seguro que querés eliminar este sándwich?')) {
        fetch('menu.json')
            .then(response => response.json())
            .then(sandwiches => {
                const updatedSandwiches = sandwiches.filter(s => s.id !== id);
                fetch('save_menu.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedSandwiches)
                }).then(() => loadMenuList());
            });
    }
}

// Save Sandwich
document.getElementById('menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sandwich = {
        id: parseInt(document.getElementById('sandwich-id').value) || Date.now(),
        name: document.getElementById('sandwich-name').value,
        desc: document.getElementById('sandwich-desc').value,
        price: document.getElementById('sandwich-price').value,
        img: document.getElementById('sandwich-img').value
    };

    fetch('menu.json')
        .then(response => response.json())
        .then(sandwiches => {
            const index = sandwiches.findIndex(s => s.id === sandwich.id);
            if (index !== -1) {
                sandwiches[index] = sandwich;
            } else {
                sandwiches.push(sandwich);
            }
            fetch('save_menu.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sandwiches)
            }).then(() => {
                loadMenuList();
                document.getElementById('menu-form').reset();
            });
        });
});

// Initial Load
loadMenuList();
loadOrderList();