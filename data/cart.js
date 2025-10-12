export let cart = JSON.parse(localStorage.getItem('cart')) || [];

cart.forEach(item => {
    if (!item.deliverOptionsId) {
        item.deliverOptionsId = 1;  // default as number
    } else {
        item.deliverOptionsId = Number(item.deliverOptionsId); // normalize type
    }
});
localStorage.setItem('cart', JSON.stringify(cart));


localStorage.setItem('cart', JSON.stringify(cart));

export function ifCartEmpty(cart) {
    let cartQuantity = getTotalCartQuantity(cart);
    if (cartQuantity === 0) {
        document.querySelector('.js-order-summary').innerHTML =
            `
            <p class = "view-products-p">Your cart is empty</p>
            <a href = "/amazon.html" class = "view-products-button">View Products</a>
               
        `
    }
}

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
            quantity: selectedQuantity,
            deliverOptionsId: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

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