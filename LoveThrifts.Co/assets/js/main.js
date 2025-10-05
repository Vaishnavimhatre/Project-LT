// ---------------- Products ----------------
const products = [
  { id: "LT-101", title: "Denim Overshirt", price: 399, condition: "Great", size: "M", img: "images/Denim Overshirt.jpg" },
  { id: "LT-102", title: "Black Slip Dress", price: 699, condition: "Excellent", size: "S", img: "images/Black Slip Dress.jpg" },
  { id: "LT-103", title: "Varsity Jacket", price: 1299, condition: "Good", size: "L", img: "images/Varsity Jacket.jpg" },
  { id: "LT-104", title: "Wide-Leg Trousers", price: 449, condition: "Excellent", size: "M", img: "images/Wide-Leg Trousers.jpg" },
  { id: "LT-105", title: "Cropped Cardigan", price: 249, condition: "Great", size: "S", img: "images/Cropped Cardigan.jpg" },
  { id: "LT-106", title: "Vintage band tshirt", price: 249, condition: "Excellent", size: "XL", img: "images/Vintage band tshirt.jpg" },
  { id: "LT-107", title: "Pleated Skirt", price: 249, condition: "Great", size: "S", img: "images/Pleated Skirt.jpg" },
  { id: "LT-108", title: "Biker Jacket", price: 699, condition: "Excellent", size: "XS", img: "images/Biker Jacket.jpg" },
  { id: "LT-109", title: "Bucket Hat", price: 149, condition: "Great", size: "FREE", img: "images/Bucket Hat.jpg" },
  { id: "LT-110", title: "Joggers", price: 249, condition: "Good", size: "M", img: "images/Joggers.jpg" },
  { id: "LT-111", title: "Knit vest", price: 449, condition: "Excellent", size: "S", img: "images/Knit vest.jpg" },
  { id: "LT-112", title: "Vintage jeans", price: 449, condition: "Great", size: "M", img: "images/Vintage jeans.jpg" }

];

let cart = [];

// ---------------- Toast ----------------
let toast = document.createElement('div');
toast.id = 'toast';
document.body.appendChild(toast);

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2000);
}

// ---------------- Render Products ----------------
function renderProducts(list){
  const wrap = document.getElementById("products");
  wrap.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="img"><img src="${p.img}" alt="${p.title}" loading="lazy"></div>
      <div class="body">
        <h3 class="title">${p.title}</h3>
        <div class="meta">
          <span class="price">₹${p.price}</span>
          <span class="badge">${p.condition}</span>
        </div>
        <div class="meta" style="margin-top:.3rem">
          <span>Size: ${p.size}</span>
          <button class="btn outline add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    wrap.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn=>{
    btn.addEventListener("click", e=>{
      addToCart(e.currentTarget.dataset.id);
      openCart();
      const prod = products.find(p=>p.id===e.currentTarget.dataset.id);
      showToast(`${prod.title} added to cart!`);
    });
  });
}

// ---------------- Sorting / Filtering ----------------
function sortProducts(mode, list){
  const copy = [...list];
  if(mode==="low") copy.sort((a,b)=>a.price-b.price);
  if(mode==="high") copy.sort((a,b)=>b.price-a.price);
  return copy;
}
function filterProducts(query, list){
  if(!query) return list;
  const q = query.toLowerCase();
  return list.filter(p=>[p.title,p.condition,p.size,p.id].join(" ").toLowerCase().includes(q));
}

// ---------------- Cart Helpers ----------------
function findProduct(id){ return products.find(p=>p.id===id); }

// Load user cart
function getUserCart(){
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(!currentUser) return [];
  return JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
}

// Save user cart
function saveUserCart(){
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(!currentUser) return;
  localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
}

// ---------------- Cart Functions ----------------
function addToCart(productId){
  const existing = cart.find(item=>item.id===productId);
  if(existing) existing.quantity++;
  else cart.push({id: productId, quantity:1});
  updateCartCount();
  renderCartItems();
  saveUserCart();
}

function removeFromCart(productId){
  cart = cart.filter(item=>item.id!==productId);
  updateCartCount();
  renderCartItems();
  saveUserCart();
}

function changeQty(productId, delta){
  const item = cart.find(i=>i.id===productId);
  if(!item) return;
  item.quantity += delta;
  if(item.quantity<1) removeFromCart(productId);
  else renderCartItems();
  updateCartCount();
  saveUserCart();
}

function updateCartCount(){
  document.getElementById("cart-count").textContent = cart.reduce((sum,i)=>sum+i.quantity,0);
}

function renderCartItems(){
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  const subtotalEl = document.getElementById("cart-subtotal");
  let subtotal = 0;

  if(cart.length===0) container.innerHTML="<p>Your cart is empty.</p>";
  else {
    cart.forEach(item=>{
      const prod = findProduct(item.id);
      const itemTotal = prod.price * item.quantity;
      subtotal += itemTotal;

      const card = document.createElement("article");
      card.className="card";
      card.innerHTML=`
        <div class="img"><img src="${prod.img}" alt="${prod.title}" loading="lazy"></div>
        <div class="body">
          <h3 class="title">${prod.title}</h3>
          <div class="meta">
            <span>₹${prod.price}</span>
            <div class="qty-controls">
              <button data-id="${prod.id}" class="dec">-</button>
              <span>${item.quantity}</span>
              <button data-id="${prod.id}" class="inc">+</button>
            </div>
          </div>
          <div class="meta" style="margin-top:.5rem; justify-content:space-between;">
            <span>Total: ₹${itemTotal}</span>
            <button class="btn outline remove-btn" data-id="${prod.id}">Remove</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  subtotalEl.textContent=subtotal;

  document.querySelectorAll(".remove-btn").forEach(btn=>{
    btn.addEventListener("click", e=>removeFromCart(e.currentTarget.dataset.id));
  });
  document.querySelectorAll(".inc").forEach(btn=>{
    btn.addEventListener("click", e=>changeQty(e.currentTarget.dataset.id,1));
  });
  document.querySelectorAll(".dec").forEach(btn=>{
    btn.addEventListener("click", e=>changeQty(e.currentTarget.dataset.id,-1));
  });
}

// ---------------- Checkout ----------------
function checkout(){
  if(cart.length===0){ alert("Your cart is empty!"); return; }
  let msg="Hi, I want to order:\n";
  cart.forEach(item=>{
    const prod=findProduct(item.id);
    msg+=`• ${prod.title} (ID:${prod.id}) × ${item.quantity} = ₹${prod.price*item.quantity}\n`;
  });
  const subtotal = cart.reduce((s,item)=>s+findProduct(item.id).price*item.quantity,0);
  msg+=`Subtotal: ₹${subtotal}\nThank you!`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/7977387499?text=${encoded}`,"_blank");
}

// ---------------- Cart Panel ----------------
const cartPanel=document.getElementById("my-orders");
const cartOverlay=document.getElementById("cart-overlay");
const cartToggleBtn=document.getElementById("cart-toggle");
const cartCloseBtn=document.querySelector("#my-orders .close-cart");

function openCart(){ cartPanel.classList.add("open"); cartOverlay?.classList.add("active"); }
function closeCart(){ cartPanel.classList.remove("open"); cartOverlay?.classList.remove("active"); }

cartToggleBtn.addEventListener("click",e=>{ e.preventDefault(); openCart(); });
cartCloseBtn?.addEventListener("click",closeCart);
cartOverlay?.addEventListener("click",closeCart);

// ---------------- Main DOMContentLoaded ----------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  toggle?.addEventListener("click",()=>{
    const open = nav.style.display==="block";
    nav.style.display=open?"none":"block";
    toggle.setAttribute("aria-expanded",String(!open));
  });

  const search = document.getElementById("search");
  const sort = document.getElementById("sort");

  function refresh(){
    const filtered = filterProducts(search.value, products);
    const sorted = sortProducts(sort.value, filtered);
    renderProducts(sorted);
  }

  search.addEventListener("input", refresh);
  sort.addEventListener("change", refresh);

  // --- Render products first ---
  refresh();

  // --- Load user cart next ---
  cart = getUserCart();
  updateCartCount();
  renderCartItems();

  document.getElementById("checkout-btn").addEventListener("click", e=>{ e.preventDefault(); checkout(); });

  // ---------------- Auth ----------------
  const authModal = document.getElementById("authModal");
  const closeBtn = document.querySelector(".close-btn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showLogin = document.getElementById("showLogin");
  const showSignup = document.getElementById("showSignup");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(currentUser){
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" id="logoutBtn" class="btn outline">Logout (${currentUser.username})</a>`;
    nav.querySelector("ul").appendChild(li);
  } else {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" id="loginBtn" class="btn outline">Login</a>`;
    nav.querySelector("ul").appendChild(li);
  }

  // Login Button
  const loginBtn = document.getElementById("loginBtn");
  loginBtn?.addEventListener("click", e=>{
    e.preventDefault();
    authModal.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  // Close modal
  closeBtn.addEventListener("click", () => authModal.classList.add("hidden"));
  window.addEventListener("click", (e)=>{ if(e.target===authModal) authModal.classList.add("hidden"); });

  // Switch forms
  showSignup.addEventListener("click", e=>{ e.preventDefault(); loginForm.classList.add("hidden"); signupForm.classList.remove("hidden"); });
  showLogin.addEventListener("click", e=>{ e.preventDefault(); signupForm.classList.add("hidden"); loginForm.classList.remove("hidden"); });

  // Signup
  signupForm.addEventListener("submit", e=>{
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if(users.find(u=>u.email===email)){ alert("Email already registered!"); return; }

    users.push({username,email,password});
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({username,email}));

    alert(`Welcome to LoveThrifts.Co, ${username}! 💕`);
    location.reload();
  });

  // Login
  loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u=>u.email===email && u.password===password);

    if(!user){ alert("Invalid credentials!"); return; }

    localStorage.setItem("currentUser", JSON.stringify({username:user.username,email:user.email}));
    alert(`Welcome back, ${user.username}! 💖`);
    location.reload();
  });

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", e=>{
    e.preventDefault();
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    location.reload();
  });

});
