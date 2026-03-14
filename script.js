// PRODUCT SEARCH

function searchProduct(){

let input = document.querySelector("input").value.toLowerCase()

let cards = document.querySelectorAll(".product-card")

cards.forEach(function(card){

let name = card.innerText.toLowerCase()

if(name.includes(input)){

card.style.display="block"

}else{

card.style.display="none"

}

})

}


// CART SYSTEM

let cart = []

function addToCart(name,price){

cart.push({name:name,price:price})

alert(name + " added to cart")

localStorage.setItem("nirmanx_cart",JSON.stringify(cart))

}


// SHOW CART

function loadCart(){

let data = localStorage.getItem("nirmanx_cart")

if(data){

cart = JSON.parse(data)

}

let cartBox = document.getElementById("cart-items")

if(cartBox){

cartBox.innerHTML=""

cart.forEach(function(item){

cartBox.innerHTML += `
<div>
<h3>${item.name}</h3>
<p>₹${item.price}</p>
</div>
`

})

}

}