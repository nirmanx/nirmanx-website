let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product,price){

cart.push({product,price});

localStorage.setItem("cart",JSON.stringify(cart));

alert(product + " added to cart");

}

function loadCart(){

let container=document.getElementById("cart-items");

if(!container) return;

container.innerHTML="";

cart.forEach(item=>{

container.innerHTML+=`<p>${item.product} - ₹${item.price}</p>`;

});

}

window.onload=loadCart;