let cart = {};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderCategories();
    renderItems(Object.keys(menuData)[0]); // First category active
}

function renderCategories() {
    const nav = document.getElementById('category-list');
    Object.keys(menuData).forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${idx === 0 ? 'active' : ''}`;
        btn.innerText = cat;
        btn.onclick = (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderItems(cat);
        };
        nav.appendChild(btn);
    });
}

function renderItems(category) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    menuData[category].forEach(item => {
        const qty = cart[item.id] ? cart[item.id].qty : 0;
        grid.innerHTML += `
            <div class="menu-card">
                <h4>${item.name}</h4>
                <p class="price">₹${item.price}</p>
                <div class="controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1, '${item.name}', ${item.price})">-</button>
                    <span id="q-${item.id}">${qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1, '${item.name}', ${item.price})">+</button>
                </div>
            </div>
        `;
    });
}

function updateQty(id, delta, name, price) {
    if (!cart[id]) cart[id] = { name, price, qty: 0 };
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    
    updateCartUI();
    const currentCat = document.querySelector('.category-btn.active').innerText;
    renderItems(currentCat);
}

function updateCartUI() {
    let total = 0;
    let count = 0;
    Object.values(cart).forEach(i => {
        total += (i.price * i.qty);
        count += i.qty;
    });

    const bar = document.getElementById('cart-bar');
    if (count > 0) {
        bar.classList.remove('hidden');
        document.getElementById('item-count').innerText = `${count} Items`;
        document.getElementById('cart-total').innerText = `₹${total}`;
    } else {
        bar.classList.add('hidden');
    }
}

function sendWhatsAppOrder() {
    let msg = "☕ *New Order: Cafe Bucks*%0a--------------------%0a";
    let total = 0;
    Object.values(cart).forEach(i => {
        msg += `• ${i.name} x${i.qty} = ₹${i.price * i.qty}%0a`;
        total += (i.price * i.qty);
    });
    msg += `--------------------%0a*Total: ₹${total}*`;
    window.open(`https://wa.me/918888682686?text=${msg}`);
}

function bookVIP(slot) {
    const msg = `Hi Cafe Bucks! I'd like to book the *VIP Suite* for a *${slot}* celebration. Is it available?`;
    window.open(`https://wa.me/918888682686?text=${encodeURIComponent(msg)}`);
}
