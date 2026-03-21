<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cart – NirmanX</title>
  <link rel="stylesheet" href="../style.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Hind:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    .page-hero{background:linear-gradient(135deg,#1A1208,#2D2010);padding:40px 24px;text-align:center}
    .page-hero h1{font-family:'Baloo 2';font-size:36px;font-weight:800;color:white}
    .page-hero h1 span{color:var(--orange)}
    .page-hero p{color:#C4B5A5;margin-top:8px}
    .cart-page{max-width:900px;margin:40px auto;padding:0 24px}
    .cart-empty{text-align:center;padding:60px 20px}
    .empty-icon{font-size:70px;margin-bottom:20px}
    .cart-empty h2{font-family:'Baloo 2';font-size:26px;margin-bottom:12px}
    .cart-empty p{color:var(--gray);margin-bottom:24px}
    .cart-item{background:white;border:1.5px solid var(--border);border-radius:16px;padding:18px 20px;display:flex;align-items:center;gap:16px;margin-bottom:14px;transition:all .2s;flex-wrap:wrap}
    .cart-item:hover{border-color:var(--orange);box-shadow:0 4px 16px var(--orange-glow)}
    .cart-item-icon{font-size:38px;width:60px;height:60px;background:var(--orange-light);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .cart-item-info{flex:1;min-width:140px}
    .cart-item-name{font-family:'Baloo 2';font-size:16px;font-weight:700;margin-bottom:4px}
    .cart-item-price{color:var(--orange);font-family:'Baloo 2';font-size:17px;font-weight:800}
    .qty-controls{display:flex;align-items:center;gap:10px}
    .qty-btn{width:34px;height:34px;border-radius:8px;border:1.5px solid var(--border);background:white;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-weight:700}
    .qty-btn:hover{background:var(--orange);color:white;border-color:var(--orange)}
    .qty-num{font-family:'Baloo 2';font-size:18px;font-weight:700;min-width:28px;text-align:center}
    .remove-btn{background:#FEE2E2;color:#DC2626;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s}
    .remove-btn:hover{background:#DC2626;color:white}
    .cart-summary{background:white;border:2px solid var(--border);border-radius:20px;padding:26px;margin-top:24px}
    .cart-summary h3{font-family:'Baloo 2';font-size:22px;font-weight:800;margin-bottom:18px}
    .summary-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:15px}
    .summary-row.total{font-family:'Baloo 2';font-size:20px;font-weight:800;color:var(--orange);border-bottom:none;margin-top:6px}
    .checkout-btns{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap}
    .btn-checkout{flex:1;background:var(--orange);color:white;border:none;border-radius:12px;padding:15px;font-family:'Baloo 2';font-size:17px;font-weight:700;cursor:pointer;transition:all .2s;min-width:200px}
    .btn-checkout:hover{background:var(--orange-dark)}
    .btn-wa-checkout{background:var(--whatsapp);color:white;border:none;border-radius:12px;padding:15px 20px;font-size:20px;cursor:pointer;text-decoration:none;display:flex;align-items:center;transition:all .2s}
    .btn-wa-checkout:hover{background:#1EB858}
    /* QUANTITY POPUP */
    .qty-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;align-items:center;justify-content:center}
    .qty-overlay.show{display:flex}
    .qty-popup-box{background:white;border-radius:20px;padding:36px;text-align:center;max-width:340px;width:90%;animation:popIn .3s ease}
    @keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    .qty-popup-box h3{font-family:'Baloo 2';font-size:22px;font-weight:800;margin-bottom:6px}
    .qty-popup-box .prod-name-popup{font-size:14px;color:var(--gray);margin-bottom:6px}
    .qty-popup-box .prod-price-popup{font-family:'Baloo 2';font-size:20px;font-weight:800;color:var(--orange);margin-bottom:20px}
    .qty-controls-popup{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:20px}
    .qty-btn-big{width:44px;height:44px;border-radius:10px;border:2px solid var(--border);background:white;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-weight:700}
    .qty-btn-big:hover{background:var(--orange);color:white;border-color:var(--orange)}
    .qty-num-big{font-family:'Baloo 2';font-size:32px;font-weight:800;color:var(--black);min-width:50px;text-align:center}
    .qty-total{font-size:14px;color:var(--gray);margin-bottom:20px}
    .qty-total span{color:var(--orange);font-weight:700;font-family:'Baloo 2';font-size:16px}
    .btn-add-confirm{width:100%;background:var(--orange);color:white;border:none;border-radius:12px;padding:14px;font-family:'Baloo 2';font-size:17px;font-weight:700;cursor:pointer;transition:all .2s;margin-bottom:10px}
    .btn-add-confirm:hover{background:var(--orange-dark)}
    .btn-cancel-qty{width:100%;background:var(--light);color:var(--gray);border:1.5px solid var(--border);border-radius:12px;padding:12px;font-family:'Hind';font-size:14px;font-weight:600;cursor:pointer}
    .login-notice{background:var(--orange-light);border:1.5px solid var(--orange);border-radius:12px;padding:14px 16px;margin-bottom:16px;font-size:14px;color:var(--dark)}
    .login-notice a{color:var(--orange);font-weight:700;text-decoration:none}
  </style>
</head>
<body>

  <!-- QUANTITY POPUP -->
  <div class="qty-overlay" id="qtyOverlay">
    <div class="qty-popup-box">
      <h3>📦 Quantity Chuno</h3>
      <div class="prod-name-popup" id="popupProdName"></div>
      <div class="prod-price-popup" id="popupProdPrice"></div>
      <div class="qty-controls-popup">
        <button class="qty-btn-big" onclick="changePopupQty(-1)">−</button>
        <span class="qty-num-big" id="popupQtyNum">1</span>
        <button class="qty-btn-big" onclick="changePopupQty(1)">+</button>
      </div>
      <div class="qty-total">Total: <span id="popupTotal">₹0</span></div>
      <button class="btn-add-confirm" onclick="confirmCart()">✅ Cart Mein Daalo</button>
      <button class="btn-cancel-qty" onclick="closeQtyPopup()">Cancel</button>
    </div>
  </div>

  <div class="ticker-wrap"><div class="ticker"><span>🛒 Free Delivery on orders above ₹5000</span><span>Delhi NCR Same Day Delivery</span><span>WhatsApp: +91 96541 71005</span><span>🛒 Free Delivery on orders above ₹5000</span><span>Delhi NCR Same Day Delivery</span></div></div>

  <nav>
    <div class="nav-inner">
      <a href="../index.html" class="logo">Nirman<span>X</span></a>
      <div class="nav-links" id="navLinks">
        <a href="../index.html">🏠 Home</a>
        <a href="products.html">📦 Products</a>
        <a href="track.html">🔄 Track Order</a>
        <a href="contact.html">📞 Contact</a>
        <a href="login.html" id="loginNavBtn">👤 Login</a>
        <span id="userBadge" style="display:none;background:var(--orange);color:white;font-size:13px;font-weight:700;padding:6px 14px;border-radius:20px;cursor:pointer;" onclick="logoutUser()">👤 <span id="userName"></span> ✕</span>
        <a href="cart.html" class="nav-cta">🛒 Cart</a>
      </div>
      <button class="hamburger" onclick="toggleNav()">☰</button>
    </div>
  </nav>

  <div class="page-hero">
    <h1>Aapka <span>Cart</span></h1>
    <p>Order review karo aur checkout karo</p>
  </div>

  <div class="cart-page" id="cartPage"></div>

  <div class="wa-float">
    <div class="wa-bubble" id="waBubble">💬 <strong>Help chahiye?</strong><br><small>+91 96541 71005</small></div>
    <a href="https://wa.me/919654171005" target="_blank" class="wa-btn" id="waBtn">💬</a>
  </div>

  <script src="../script.js"></script>
  <script>
    const { createClient } = supabase;
    const sb = createClient(
      'https://ddgwdesqicrneikxrcnj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ3dkZXNxaWNybmVpa3hyY25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzc1MTksImV4cCI6MjA4OTMxMzUxOX0.AFH7Sfat5XnYFYocdbjZlYhL5iLG1dO6wXm_FHycAqo'
    );

    // User badge
    const nxUser = JSON.parse(localStorage.getItem('nx_user'));
    if(nxUser){
      const lb = document.getElementById('loginNavBtn');
      const ub = document.getElementById('userBadge');
      const un = document.getElementById('userName');
      if(lb) lb.style.display='none';
      if(ub) ub.style.display='inline-flex';
      if(un) un.textContent = nxUser.name.split(' ')[0];
    }
    function logoutUser(){
      localStorage.removeItem('nx_user');
      window.location.reload();
    }

    // Pending item for popup
    let pendingItem = null;
    let popupQty = 1;

    // Override global addToCart
    function addToCart(name, price){
      pendingItem = {name, price};
      popupQty = 1;
      document.getElementById('popupProdName').textContent = name;
      document.getElementById('popupProdPrice').textContent = '₹' + price.toLocaleString('en-IN') + ' per unit';
      document.getElementById('popupQtyNum').textContent = 1;
      document.getElementById('popupTotal').textContent = '₹' + price.toLocaleString('en-IN');
      document.getElementById('qtyOverlay').classList.add('show');
    }

    function changePopupQty(delta){
      popupQty = Math.max(1, popupQty + delta);
      document.getElementById('popupQtyNum').textContent = popupQty;
      document.getElementById('popupTotal').textContent = '₹' + (pendingItem.price * popupQty).toLocaleString('en-IN');
    }

    function closeQtyPopup(){
      document.getElementById('qtyOverlay').classList.remove('show');
      pendingItem = null;
    }

    function confirmCart(){
      if(!pendingItem) return;
      let cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];
      const existing = cart.find(i => i.name === pendingItem.name);
      if(existing){
        existing.qty += popupQty;
      } else {
        cart.push({name: pendingItem.name, price: pendingItem.price, qty: popupQty});
      }
      localStorage.setItem('nirmanx_cart', JSON.stringify(cart));
      closeQtyPopup();
      showToast('✅ ' + pendingItem.name + ' (×' + popupQty + ') cart mein add ho gaya!');
      renderCart();
    }

    // Close on outside click
    document.getElementById('qtyOverlay').addEventListener('click', function(e){
      if(e.target === this) closeQtyPopup();
    });

    // RENDER CART
    function renderCart(){
      const cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];
      const container = document.getElementById('cartPage');

      if(cart.length === 0){
        container.innerHTML = `
          <div class="cart-empty">
            <div class="empty-icon">🛒</div>
            <h2>Cart Khali Hai!</h2>
            <p>Koi product add nahi kiya abhi tak.</p>
            <a href="products.html" class="btn-primary" style="text-decoration:none">📦 Products Dekho</a>
          </div>`;
        return;
      }

      const icons = {cement:'🏗️',steel:'⚙️',sariya:'⚙️',bricks:'🧱',eent:'🧱',tiles:'🪟',farshi:'🪟',sand:'🪣',baalu:'🪣',paint:'🎨',hardware:'🔩',plumbing:'🪛'};
      let total = 0;
      let itemsHTML = '';

      cart.forEach((item, i) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        const key = Object.keys(icons).find(k => item.name.toLowerCase().includes(k));
        const icon = key ? icons[key] : '📦';
        itemsHTML += `
          <div class="cart-item">
            <div class="cart-item-icon">${icon}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty} = ₹${subtotal.toLocaleString('en-IN')}</div>
            </div>
            <div class="qty-controls">
              <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${i})">🗑️ Hatao</button>
          </div>`;
      });

      const delivery = total >= 5000 ? 0 : 200;
      const grandTotal = total + delivery;
      const waMsg = encodeURIComponent('Namaste! Main NirmanX se order karna chahta hoon:\n' + cart.map(i=>`• ${i.name} ×${i.qty} = ₹${(i.price*i.qty).toLocaleString('en-IN')}`).join('\n') + `\n\nTotal: ₹${grandTotal.toLocaleString('en-IN')}`);

      const loginNotice = !nxUser ? `
        <div class="login-notice">
          ⚠️ Checkout ke liye <a href="login.html">Login karo</a> ya <a href="login.html">Sign Up karo</a> — bilkul free!
        </div>` : '';

      container.innerHTML = itemsHTML + `
        <div class="cart-summary">
          <h3>🧾 Order Summary</h3>
          <div class="summary-row"><span>Subtotal (${cart.length} items)</span><span>₹${total.toLocaleString('en-IN')}</span></div>
          <div class="summary-row"><span>Delivery</span><span>${delivery===0?'<span style="color:#27AE60;font-weight:700">FREE ✅</span>':'₹'+delivery}</span></div>
          <div class="summary-row total"><span>Total Amount</span><span>₹${grandTotal.toLocaleString('en-IN')}</span></div>
          ${delivery>0?`<p style="color:var(--orange);font-size:13px;margin-top:10px;text-align:center">💡 ₹${(5000-total).toLocaleString('en-IN')} aur add karo — FREE delivery milegi!</p>`:''}
          ${loginNotice}
          <div class="checkout-btns">
            <button class="btn-checkout" onclick="placeOrder()">💳 Order Place Karo</button>
            <a href="https://wa.me/919654171005?text=${waMsg}" target="_blank" class="btn-wa-checkout">💬</a>
          </div>
        </div>`;
    }

    function changeQty(index, delta){
      let cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];
      cart[index].qty += delta;
      if(cart[index].qty <= 0) cart.splice(index, 1);
      localStorage.setItem('nirmanx_cart', JSON.stringify(cart));
      renderCart();
    }

    function removeItem(index){
      let cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];
      cart.splice(index, 1);
      localStorage.setItem('nirmanx_cart', JSON.stringify(cart));
      renderCart();
      showToast('🗑️ Product cart se hata diya!');
    }

    async function placeOrder(){
      if(!nxUser){
        showToast('⚠️ Pehle login karo!');
        setTimeout(()=> window.location.href='login.html', 1500);
        return;
      }
      const cart = JSON.parse(localStorage.getItem('nirmanx_cart')) || [];
      if(cart.length===0){ showToast('⚠️ Cart khali hai!'); return; }

      const total = cart.reduce((s,i)=>s+(i.price*i.qty),0);
      const delivery = total>=5000?0:200;
      const items = cart.map(i=>`${i.name} ×${i.qty}`).join(', ');
      const orderId = 'NX-' + Date.now().toString().slice(-6);

      const {error} = await sb.from('orders').insert([{
        order_id: orderId,
        customer_phone: nxUser.phone,
        customer_name: nxUser.name,
        items: items,
        total: total+delivery,
        status: 'pending'
      }]);

      if(error){ showToast('❌ Order error: '+error.message); return; }

      localStorage.removeItem('nirmanx_cart');
      showToast('🎉 Order place ho gaya! Order ID: ' + orderId);
      setTimeout(()=> window.location.href='track.html', 2000);
    }

    renderCart();
  </script>
</body>
</html>