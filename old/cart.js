// File: data/cart.js
// Purpose: Cart state, persistence, and basic operations (no logic changes).

export let cart;
loadFromStorage();
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

// Normalize saved items: ensure deliveryOptionId exists and is a number
cart.forEach((item) => {
  if (!item.deliveryOptionId) {
    item.deliveryOptionId = 1; // default as number
  } else {
    item.deliveryOptionId = Number(item.deliveryOptionId); // normalize type
  }
});
localStorage.setItem('cart', JSON.stringify(cart));

// Persist again (duplicate kept intentionally to avoid altering behavior)
localStorage.setItem('cart', JSON.stringify(cart));

// Render "empty cart" message into order summary when needed
export function ifCartEmpty(cart) {
  const cartQuantity = getTotalCartQuantity(cart);
  if (cartQuantity === 0) {
    document.querySelector('.js-order-summary').innerHTML = `
      <p class="view-products-p">Your cart is empty</p>
      <a href="/amazon.html" class="view-products-button">View Products</a>
    `;
  }
}

// Total quantity helper
export function getTotalCartQuantity(cart) {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.quantity;
  });
  return total;
}

// Add product to cart
export function addProductToCart(selectedProductId, selectedQuantity) {
  let existingCartItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === selectedProductId) {
      existingCartItem = cartItem;
    }
  });

  if (existingCartItem) {
    existingCartItem.quantity += selectedQuantity;
  } else {
    cart.push({
      productId: selectedProductId,
      quantity: selectedQuantity,
      deliveryOptionId: 1,
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove product from cart
export function removeFromCart(productId) {
  let index = -1;
  for (let i = 0; i < cart.length; i++) {
    if (productId === cart[i].productId) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    cart.splice(index, 1);
    ifCartEmpty(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Update delivery option for a cart item
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });
  matchingItem.deliveryOptionId = Number(deliveryOptionId);
  localStorage.setItem('cart', JSON.stringify(cart));
}
