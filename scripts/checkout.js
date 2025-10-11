import { addProductToCart, cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utilities/money.js";
import { getTotalCartQuantity } from "../data/cart.js";


document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;

let cartSummaryHTML = ``;

cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });
    cartSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = ${matchingProduct.id}>
                    Update
                  </span>
                  <input type="number" class="quantity-input" min="1" max="99" step="1">
                  <span class = "save-quantity-link link-primary js-save-quantity-link" data-product-id = "${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-button" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
`;
});


const orderSummary = document.querySelector('.js-order-summary');
    orderSummary.innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-quantity-button').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;
  })
})

document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const inputField = container.querySelector('.quantity-input');
    
    inputField.value = container.querySelector('.quantity-label').innerHTML;

    container.classList.add('is-editing-quantity');
  });
});

document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
     const productId = link.dataset.productId;
     const container = document.querySelector(`.js-cart-item-container-${productId}`);
     
     const inputField = container.querySelector('.quantity-input');
     const newValue = Number(inputField.value);
     if(newValue === 0){
      const cartItem = cart.find(item => item.productId === productId);
      removeFromCart(productId);
      container.remove();
      localStorage.setItem('cart', JSON.stringify(cart));
     }
     else if(newValue > 0) {
      container.classList.remove(`is-editing-quantity`);
      const cartItem = cart.find(item => item.productId === productId);
      if(cartItem){
        cartItem.quantity = newValue;
      }
      container.querySelector('.quantity-label').innerHTML = newValue;
      document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;
      localStorage.setItem('cart', JSON.stringify(cart));
     } else {
      alert('Not a valid input');
     }
  });

});

