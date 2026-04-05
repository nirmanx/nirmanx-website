// ===== GROUTGROVE — MAIN SCRIPT =====

// Supabase Config
const SUPABASE_URL = 'https://ddgwdesqicrneikxrcnj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ3dkZXNxaWNybmVpa3hyY25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzc1MTksImV4cCI6MjA4OTMxMzUxOX0.AFH7Sfat5XnYFYocdbjZlYhL5iLG1dO6wXm_FHycAqo';

// ===== NAVBAR =====
function toggleNav() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

// Close nav on outside click
document.addEventListener('click', function(e) {
  const nav = document.getElementById('navLinks');
  const hamburger = document.querySelector('.hamburger');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && e.target !== hamburger) {
      nav.classList.remove('open');
    }
  }
});

// ===== TOAST NOTIFICATION =====
function showToast(msg, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== CART SYSTEM =====
const CART_KEY = 'nirmanx_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline' : 'none';
  }
}

// Global addToCart — works on all pages
window.addToCart = function(name, price) {
  // If on cart page, handle directly
  if (window.location.pathname.includes('cart.html')) {
    let cart = getCart();
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
      saveCart(cart);
      showToast('✅ Quantity updated in cart!');
    } else {
      cart.push({ name, price, qty: 1 });
      saveCart(cart);
      showToast('✅ Added to cart!');
    }
    if (typeof renderCart === 'function') renderCart();
    return;
  }

  // Show quantity popup
  showQtyPopup(name, price);
};

function showQtyPopup(name, price) {
  // Remove existing popup
  const existing = document.querySelector('.qty-popup-overlay');
  if (existing) existing.remove();

  let qty = 1;

  const overlay = document.createElement('div');
  overlay.className = 'qty-popup-overlay';
  overlay.innerHTML = `
    <div class="qty-popup">
      <h3>${name}</h3>
      <div class="qp-price">₹${parseFloat(price).toLocaleString('en-IN')}</div>
      <div class="qty-controls">
        <button id="qp-minus">−</button>
        <span id="qp-num">1</span>
        <button id="qp-plus">+</button>
      </div>
      <div class="qp-total" id="qp-total">Total: ₹${parseFloat(price).toLocaleString('en-IN')}</div>
      <div class="qp-btns">
        <button class="qp-cancel" id="qp-cancel">Cancel</button>
        <button class="qp-add" id="qp-add">🛒 Add to Cart</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  function updateTotal() {
    document.getElementById('qp-num').textContent = qty;
    document.getElementById('qp-total').textContent =
      'Total: ₹' + (price * qty).toLocaleString('en-IN');
  }

  document.getElementById('qp-minus').addEventListener('click', () => {
    if (qty > 1) { qty--; updateTotal(); }
  });

  document.getElementById('qp-plus').addEventListener('click', () => {
    if (qty < 999) { qty++; updateTotal(); }
  });

  document.getElementById('qp-cancel').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.getElementById('qp-add').addEventListener('click', () => {
    let cart = getCart();
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price: parseFloat(price), qty });
    }
    saveCart(cart);
    overlay.remove();
    showToast(`✅ ${name} added to cart (×${qty})!`);
  });
}

// ===== CALCULATOR =====
let currentCalcType = 'cement';

function switchCalc(type, btn) {
  currentCalcType = type;
  document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const result = document.getElementById('calcResult');
  if (result) {
    result.classList.remove('show');
    result.style.display = 'none';
  }
}

function calculate() {
  const length = parseFloat(document.getElementById('cLength')?.value);
  const width = parseFloat(document.getElementById('cWidth')?.value);
  const floors = parseFloat(document.getElementById('cFloors')?.value) || 1;

  if (!length || !width || length <= 0 || width <= 0) {
    showToast('⚠️ Please enter valid length and width!');
    return;
  }

  if (length > 500 || width > 500) {
    showToast('⚠️ Please enter area in feet (max 500)!');
    return;
  }

  const area = length * width * floors;
  let results = [];

  switch (currentCalcType) {
    case 'cement':
      const cementBags = Math.ceil(area * 0.4);
      const sandCFT = Math.ceil(area * 0.6);
      const gritCFT = Math.ceil(area * 1.2);
      results = [
        { val: cementBags + ' Bags', lbl: 'Cement (50kg)', icon: '🏗️' },
        { val: sandCFT + ' CFT', lbl: 'Sand (Baalu)', icon: '🪣' },
        { val: gritCFT + ' CFT', lbl: 'Grit/Stone', icon: '🪨' },
        { val: '₹' + (cementBags * 380).toLocaleString('en-IN'), lbl: 'Est. Cost', icon: '💰' }
      ];
      break;

    case 'bricks':
      const bricks = Math.ceil(area * 55);
      const mortar = Math.ceil(area * 0.3);
      results = [
        { val: bricks.toLocaleString('en-IN'), lbl: 'Bricks Needed', icon: '🧱' },
        { val: mortar + ' Bags', lbl: 'Cement for Mortar', icon: '🏗️' },
        { val: '₹' + (bricks * 8).toLocaleString('en-IN'), lbl: 'Est. Brick Cost', icon: '💰' },
        { val: area + ' sqft', lbl: 'Total Area', icon: '📐' }
      ];
      break;

    case 'tiles':
      const tiles = Math.ceil(area * 1.1);
      const adhesive = Math.ceil(area / 40);
      const grout = Math.ceil(area / 50);
      results = [
        { val: tiles + ' sqft', lbl: 'Tiles Required (+10%)', icon: '🪟' },
        { val: adhesive + ' Bags', lbl: 'Tile Adhesive', icon: '🧴' },
        { val: grout + ' Bags', lbl: 'Grout/Filler', icon: '⬜' },
        { val: '₹' + (tiles * 45).toLocaleString('en-IN'), lbl: 'Est. Cost', icon: '💰' }
      ];
      break;

    case 'paint':
      const wallArea = area * 3.5;
      const paintLtr = Math.ceil(wallArea / 40);
      const primer = Math.ceil(wallArea / 80);
      results = [
        { val: paintLtr + ' Litres', lbl: 'Paint Needed (2 coats)', icon: '🎨' },
        { val: primer + ' Litres', lbl: 'Primer', icon: '🖌️' },
        { val: wallArea + ' sqft', lbl: 'Wall Area', icon: '📐' },
        { val: '₹' + (paintLtr * 280).toLocaleString('en-IN'), lbl: 'Est. Cost', icon: '💰' }
      ];
      break;
  }

  const grid = document.getElementById('resultGrid');
  if (grid) {
    grid.innerHTML = results.map(r => `
      <div class="result-item">
        <div style="font-size:24px;margin-bottom:6px">${r.icon}</div>
        <div class="r-val">${r.val}</div>
        <div class="r-lbl">${r.lbl}</div>
      </div>`).join('');
  }

  const result = document.getElementById('calcResult');
  if (result) {
    result.style.display = 'block';
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ===== SEARCH =====
function searchProduct() {
  const query = document.getElementById('searchInput')?.value?.trim();
  if (!query) {
    showToast('⚠️ Please enter a product name!');
    return;
  }
  // Redirect to products page with search query
  const base = window.location.pathname.includes('/pages/') ? 'products.html' : 'pages/products.html';
  window.location.href = `${base}?search=${encodeURIComponent(query)}`;
}

// Enter key on search
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('searchInput') === document.activeElement) {
    searchProduct();
  }
});

// ===== WHATSAPP FLOAT =====
setTimeout(() => {
  const bubble = document.getElementById('waBubble');
  if (bubble) {
    bubble.style.display = 'block';
    setTimeout(() => { bubble.style.display = 'none'; }, 5000);
  }
}, 3000);

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  updateCartBadge();

  // Handle search query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery && typeof loadProducts === 'function') {
    const input = document.querySelector('.filter-search');
    if (input) input.value = searchQuery;
  }
});