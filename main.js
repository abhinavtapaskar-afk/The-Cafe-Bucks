let cart = [];
let currentCategory = "";

document.addEventListener("DOMContentLoaded", () => {
    if (typeof menuData !== 'undefined' && menuData.length > 0) {
        currentCategory = menuData[0].category;
        renderCategories();
        renderMenu(currentCategory);
    }
});

function renderCategories() {
    const container = document.getElementById("categoryContainer");
    if (!container) return;
    container.innerHTML = "";

    menuData.forEach(cat => {
        const btn = document.createElement("button");
        btn.innerText = cat.category;
        btn.className = `category-btn ${cat.category === currentCategory ? 'active' : ''}`;
        btn.onclick = () => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = cat.category;
            renderMenu(currentCategory);
        };
        container.appendChild(btn);
    });
}

function renderMenu(categoryName) {
    const container = document.getElementById("menuContainer");
    if (!container) return;
    container.innerHTML = "";

    const categoryObj = menuData.find(cat => cat.category === categoryName);
    if (!categoryObj) return;

    categoryObj.items.forEach(item => {
        const cartItem = cart.find(i => i.id === item.id);
        const displayQty = cartItem ? cartItem.qty : 0;

        const card = document.createElement("div");
        card.className = "menu-item";
        card.innerHTML = `
            <img src="assets/${item.id}.jpg" alt="${item.name}" class="item-img" onerror="this.src='https://placehold.co/200x150/1e3932/cba258?text=${item.name}'">
            <h3>${item.name}</h3>
            <p class="price">₹${item.price}</p>
            <div class="qty-controls">
                <button onclick="changeQty(${item.id}, -1)">−</button>
                <span id="qty-${item.id}">${displayQty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function changeQty(itemId, delta) {
    let itemDetails = null;
    menuData.forEach(cat => {
        const found = cat.items.find(i => i.id === itemId);
        if (found) itemDetails = found;
    });

    const cartItem = cart.find(i => i.id === itemId);

    if (cartItem) {
        cartItem.qty += delta;
        if (cartItem.qty <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
    } else if (delta > 0) {
        cart.push({ ...itemDetails, qty: 1 });
    }

    const qtySpan = document.getElementById(`qty-${itemId}`);
    if (qtySpan) {
        const updatedItem = cart.find(i => i.id === itemId);
        qtySpan.innerText = updatedItem ? updatedItem.qty : 0;
    }
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>${item.name} x${item.qty}</span>
                <span>₹${item.price * item.qty}</span>
            </div>
        `;
    });

    totalPrice.innerText = `₹${total}`;
}

function sendWhatsAppOrder() {
    if (cart.length === 0) return alert("Your cart is empty");

    let message = `🛒 *New Order – THE CAFE BUCKS*%0A%0A`;
    let total = 0;

    cart.forEach(item => {
        message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
        total += item.price * item.qty;
    });

    message += `%0A💰 *Grand Total: ₹${total}*`;
    
    // Your specific Delivery Policy
  message += `%0A%0A🚚 *DELIVERY INFO:*%0A_Free delivery within 2km (MGM Area)._%0A_Small charge apply for long distances._`;
  
  // Your specific Smart Location Instructions
  message += `%0A%0A📍 *SHARE LOCATION:*%0A_Please tap ( 📎 ) or ( ➕ ) and share your "Live Location" so we can deliver to your doorstep!_`;

  message += `%0A%0A💬 Please confirm my order!`;

    window.open(`https://wa.me/918888682686?text=${message}`, "_blank");
}

function sendBookingRequest() {
    // Your official Cafe Bucks number
    const phoneNumber = "918888682686"; 
    
    let bookingMessage = `✨ *VIP SUITE INQUIRY - THE CAFE BUCKS* ✨%0A%0A`;
    bookingMessage += `I want to check availability for a special celebration!%0A%0A`;
    bookingMessage += `🎈 *Event:* [Birthday / Anniversary / Friends Meet]%0A`;
    bookingMessage += `👥 *Group Size:* [e.g. 6 People]%0A`;
    bookingMessage += `📅 *Preferred Date:* [Enter Date]%0A`;
    bookingMessage += `🕒 *Preferred Time:* [Enter Time]%0A%0A`;
    bookingMessage += `🎊 _Does this slot have availability for decoration?_%0A%0A`;
    bookingMessage += `Please confirm so I can finalize my plans! 🙏`;

    const url = `https://wa.me/${phoneNumber}?text=${bookingMessage}`;
    window.open(url, '_blank');
}
