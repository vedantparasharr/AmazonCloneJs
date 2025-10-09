export const cart = [

]

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
}