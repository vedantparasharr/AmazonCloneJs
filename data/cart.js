export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function getTotalCartQuantity(cart) {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.quantity;
  });
  return total;
}

// ✅ Add product to cart
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
            quantity: selectedQuantity
        });
    }
    localStorage.setItem('cart',JSON.stringify(cart));
}

export function removeFromCart(productId) {
    let index = -1;
    for(let i = 0; i < cart.length; i++){
        if(productId === cart[i].productId){
            index = i;
            break;
        }
    }
    if(index !== -1){
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
}