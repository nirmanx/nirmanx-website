// ============================================
//  NIRMANX — script.js — UPDATED
// ============================================

// ===== GLOBAL QUANTITY POPUP =====
let pendingItem = null;
let popupQty = 1;

// Popup HTML inject karo agar nahi hai
function injectQtyPopup(){
  if(document.getElementById('globalQtyOverlay')) return;
  const popup = document.createElement('div');
  popup.id = 'globalQtyOverlay';
  popup.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;align-items:center;justify-content:center;';
  popup.innerHTML = `
    <div style="background:white;border-radius:20px;padding:36px;text-align:center;max-width:340px;width:90%;animation:popIn .3s ease">
      <h3 style="font-family:'Baloo 2';font-size:22px;font-weight:800;margin-bottom:6px">📦 Quantity Chuno</h3>
      <div id="gPopupProdName" style="font-size:14px;color:#6B6259;margin-bottom:6px"></div>
      <div id="gPopupProdPrice" style="font-family:'Baloo 2';font-size:20px;font-weight:800;color:#F46F1A;margin-bottom:20px"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px">
        <button onclick="changeGPopupQty(-1)" style="width:44px;height:44px;border-radius:10px;border:2px solid #EAD9C8;background:white;font-size:22px;cursor:pointer;font-weight:700">−</button>
        <span id="gPopupQtyNum" style="font-family:'Baloo 2';font-size:32px;font-weight:800;min-width:50px;text-align:center">1</span>
        <button onclick="changeGPopupQty(1)" style="width:44px;height:44px;border-radius:10px;border:2px solid #EAD9C8;background:white;font-size:22px;cursor:pointer;font-weight:700">+</button>
      </div>
      <div style="font-size:14px;color:#6B6259;margin-bottom:20px">Total: <span id="gPopupTotal" style="color:#F46F1A;font-weight:700;font-family:'Baloo 2';font-size:16px">₹0</span></div>
      <button onclick="confirmGlobalCart()" style="width:100%;background:#F46F1A;color:white;border:none;border-radius:12px;padding:14px;font-family:'Baloo 2';font-size:17px;font-weight:700;cursor:pointer;margin-bottom:10px">✅ Cart Mein Daalo</button>
      <button onclick="closeGQtyPopup()" style="width:100%;background:#FDF8F3;color:#6B6259;border:1.5px solid #EAD9C8;border-radius:12px;padding:12px;font-family:'Hind';font-size:14px;cursor:pointer">❌ Cancel</button>
    </div>`;
  popup.addEventListener('click', function(e){ if(e.target===this) closeGQtyPopup(); });
  document.body.appendChild(popup);

  // Add animation style
  if(!document.getElementById('popInStyle')){
    const style = document.createElement('style');
    style.id = 'popInStyle';
    style.textContent = '@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}';
    document.head.appendChild(style);
  }
}

function addToCart(name, price){
  injectQtyPopup();
  pendingItem = {name, price};
  popupQty = 1;
  document.getElementById('gPopupProdName').textContent = name;
  document.getElementById('gPopupProdPrice').textContent = '₹' + price.toLocaleString('en-IN') + ' per unit';
  document.getElementById('gPopupQtyNum').textContent = 1;
  document.getElementById('gPopupTotal').textContent = '₹' + price.toLocaleString('en-IN');
  const overlay = document.getElementById('globalQtyOverlay');
  overlay.style.display = 'flex';
}

function changeGPopupQty(d){
  popupQty = Math.max(1, popupQty + d);
  document.getElementById('gPopupQtyNum').textContent = popupQty;
  document.getElementById('gPopupTotal').textContent = '₹' + (pendingItem.price * popupQty).toLocaleString('en-IN');
}

function closeGQtyPopup(){
  const overlay = document.getElementById('globalQtyOverlay');
  if(overlay) overlay.style.display = 'none';
  pendingItem = null;
}

function confirmGlobalCart(){
  if(!pendingItem) return;
  let cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];
  const ex = cart.find(i => i.name === pendingItem.name);
  if(ex){ ex.qty += popupQty; }
  else { cart.push({name: pendingItem.name, price: pendingItem.price, qty: popupQty}); }
  localStorage.setItem('nirmanx_cart', JSON.stringify(cart));
  closeGQtyPopup();
  showToast('✅ ' + pendingItem.name + ' (×' + popupQty + ') cart mein add ho gaya!');
}

// ===== TOAST =====
function showToast(msg){
  const old = document.getElementById('nx-toast');
  if(old) old.remove();
  const toast = document.createElement('div');
  toast.id = 'nx-toast';
  toast.style.cssText = `
    position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
    background:#1A1208;color:white;padding:13px 24px;border-radius:30px;
    font-family:'Hind',sans-serif;font-size:15px;font-weight:600;
    z-index:99999;box-shadow:0 6px 24px rgba(0,0,0,.25);
    border-left:4px solid #F46F1A;white-space:nowrap;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== NAVBAR MOBILE =====
function toggleNav(){
  const links = document.getElementById('navLinks');
  if(links) links.classList.toggle('open');
}

// ===== SEARCH =====
function searchProduct(){
  const query = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  if(!query){ showToast('⚠️ Kuch toh search karo!'); return; }
  const map = {
    cement: 'pages/cement.html',
    steel: 'pages/steel.html',
    sariya: 'pages/steel.html',
    bricks: 'pages/bricks.html',
    eent: 'pages/bricks.html',
    tiles: 'pages/tiles.html',
    farshi: 'pages/tiles.html',
  };
  for(const key in map){
    if(query.includes(key)){
      window.location.href = map[key];
      return;
    }
  }
  window.location.href = 'pages/products.html';
}

document.addEventListener('DOMContentLoaded', function(){
  const s = document.getElementById('searchInput');
  if(s) s.addEventListener('keypress', e => { if(e.key==='Enter') searchProduct(); });
});

// ===== CALCULATOR =====
let activeCalc = 'cement';

function switchCalc(type, btn){
  activeCalc = type;
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const r = document.getElementById('calcResult');
  if(r) r.classList.remove('show');
}

function calculate(){
  const l = parseFloat(document.getElementById('cLength')?.value) || 0;
  const w = parseFloat(document.getElementById('cWidth')?.value) || 0;
  const f = parseFloat(document.getElementById('cFloors')?.value) || 1;
  if(!l || !w){ showToast('⚠️ Length aur width daalein!'); return; }
  const area = l * w * f;
  const grid = document.getElementById('resultGrid');
  let html = '';

  if(activeCalc==='cement'){
    const bags=Math.ceil(area*0.4), steel=Math.ceil(area*4), sand=Math.ceil(area*0.6), cost=bags*380;
    html=`<div class="result-item"><div class="r-val">${bags}</div><div class="r-lbl">Cement Bags</div></div>
          <div class="result-item"><div class="r-val">${steel} kg</div><div class="r-lbl">Steel/Sariya</div></div>
          <div class="result-item"><div class="r-val">${sand} CFT</div><div class="r-lbl">Sand/Baalu</div></div>
          <div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  } else if(activeCalc==='bricks'){
    const b=Math.ceil(area*55), m=Math.ceil(area*0.25), cost=b*8;
    html=`<div class="result-item"><div class="r-val">${b.toLocaleString('en-IN')}</div><div class="r-lbl">Bricks/Eent</div></div>
          <div class="result-item"><div class="r-val">${m} bags</div><div class="r-lbl">Mortar Cement</div></div>
          <div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  } else if(activeCalc==='tiles'){
    const t=Math.ceil(area*1.1), a=Math.ceil(area/40), cost=t*45;
    html=`<div class="result-item"><div class="r-val">${t} sqft</div><div class="r-lbl">Tiles (+10%)</div></div>
          <div class="result-item"><div class="r-val">${a} bags</div><div class="r-lbl">Tile Adhesive</div></div>
          <div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  } else if(activeCalc==='paint'){
    const lt=Math.ceil(area/80*2), pr=Math.ceil(lt/0.8), cost=lt*280;
    html=`<div class="result-item"><div class="r-val">${lt} L</div><div class="r-lbl">Paint (2 coats)</div></div>
          <div class="result-item"><div class="r-val">${pr} L</div><div class="r-lbl">Primer</div></div>
          <div class="result-item"><div class="r-val">₹${cost.toLocaleString('en-IN')}</div><div class="r-lbl">Approx Cost</div></div>`;
  }

  if(grid) grid.innerHTML = html;
  const res = document.getElementById('calcResult');
  if(res) res.classList.add('show');
}

// ===== WHATSAPP BUBBLE =====
setTimeout(() => {
  const b = document.getElementById('waBubble');
  if(b){ b.classList.add('show'); setTimeout(()=>b.classList.remove('show'), 5000); }
}, 3500);

// ===== USER BADGE — Har Page Par =====
document.addEventListener('DOMContentLoaded', function(){
  const nxUser = JSON.parse(localStorage.getItem('nx_user'));
  if(nxUser){
    const lb = document.getElementById('loginNavBtn');
    const ub = document.getElementById('userBadge');
    const un = document.getElementById('userName');
    if(lb) lb.style.display = 'none';
    if(ub) ub.style.display = 'inline-flex';
    if(un) un.textContent = nxUser.name.split(' ')[0];
  }
});

function logoutUser(){
  localStorage.removeItem('nx_user');
  window.location.reload();
}