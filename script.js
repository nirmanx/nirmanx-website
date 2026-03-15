// NIRMANX script.js

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];

function saveCart() {
  localStorage.setItem('nirmanx_cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty += 1; }
  else { cart.push({ name, price, qty: 1 }); }
  saveCart();
  showToast('✅ ' + name + ' cart mein add ho gaya!');
}

function showToast(msg) {
  const old = document.getElementById('nx-toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.id = 'nx-toast';
  toast.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1A1208;color:white;padding:13px 24px;border-radius:30px;font-family:'Hind',sans-serif;font-size:15px;font-weight:600;z-index:9999;box-shadow:0 6px 24px rgba(0,0,0,.25);border-left:4px solid #F46F1A;white-space:nowrap;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== NAVBAR MOBILE =====
function toggleNav() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// ===== SEARCH =====
function searchProduct() {
  const query = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  if (!query) { showToast('⚠️ Kuch toh search karo!'); return; }
  const map = { cement: 'pages/cement.html', steel: 'pages/steel.html', sariya: 'pages/steel.html', bricks: 'pages/bricks.html', eent: 'pages/bricks.html', tiles: 'pages/tiles.html', farshi: 'pages/tiles.html' };
  for (const key in map) { if (query.includes(key)) { window.location.href = map[key]; return; } }
  window.location.href = 'pages/products.html';
}

document.addEventListener('DOMContentLoaded', function () {
  const s = document.getElementById('searchInput');
  if (s) s.addEventListener('keypress', e => { if (e.key === 'Enter') searchProduct(); });
});

// ===== CALCULATOR =====
let activeCalc = 'cement';

function switchCalc(type, btn) {
  activeCalc = type;
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const r = document.getElementById('calcResult');
  if (r) r.classList.remove('show');
}

function calculate() {
  const l = parseFloat(document.getElementById('cLength')?.value) || 0;
  const w = parseFloat(document.getElementById('cWidth')?.value) || 0;
  const f = parseFloat(document.getElementById('cFloors')?.value) || 1;
  if (!l || !w) { showToast('⚠️ Length aur width daalein!'); return; }
  const area = l * w * f;
  const grid = document.getElementById('resultGrid');
  let html = '';
  if (activeCalc === 'cement') {
    const bags = Math.ceil(area * 0.4), steel = Math.ceil(area * 4), sand = Math.ceil(area * 0.6), cost = bags * 380;
    html = `<div class="result-item"><div class="r-val">${bags}</div><div class="r-lbl">Cement Bags</div></div><div class="result-item"><div class="r-val">${steel} kg</div><div class="r-lbl">Steel/Sariya</div></div><div class="result-item"><div class="r-val">${sand} CFT</div><div class="r-lbl">Sand/Baalu</div></div><div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  } else if (activeCalc === 'bricks') {
    const b = Math.ceil(area * 55), m = Math.ceil(area * 0.25), cost = b * 8;
    html = `<div class="result-item"><div class="r-val">${b.toLocaleString('en-IN')}</div><div class="r-lbl">Bricks/Eent</div></div><div class="result-item"><div class="r-val">${m} bags</div><div class="r-lbl">Mortar Cement</div></div><div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  } else if (activeCalc === 'tiles') {
    const t = Math.ceil(area * 1.1), a = Math.ceil(area / 40), cost = t * 45;
    html = `<div class="result-item"><div class="r-val">${t} sqft</div><div class="r-lbl">Tiles (+10%)</div></div><div class="result-item"><div class="r-val">${a} bags</div><div class="r-lbl">Tile Adhesive</div></div><div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  } else if (activeCalc === 'paint') {
    const lt = Math.ceil(area / 80 * 2), pr = Math.ceil(lt / 0.8), cost = lt * 280;
    html = `<div class="result-item"><div class="r-val">${lt} L</div><div class="r-lbl">Paint (2 coats)</div></div><div class="result-item"><div class="r-val">${pr} L</div><div class="r-lbl">Primer</div></div><div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  }
  if (grid) grid.innerHTML = html;
  const res = document.getElementById('calcResult');
  if (res) res.classList.add('show');
}

// ===== WHATSAPP BUBBLE =====
setTimeout(() => {
  const b = document.getElementById('waBubble');
  if (b) { b.classList.add('show'); setTimeout(() => b.classList.remove('show'), 5000); }
}, 3500);