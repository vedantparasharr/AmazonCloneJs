import { cart, addProductToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utilities/money.js';
import { getTotalCartQuantity } from '../data/cart.js';
let productsHTMLContent = '';

const totalCartQuantity = getTotalCartQuantity(cart);
document.querySelector('.js-cart-quantity').innerHTML = totalCartQuantity;

products.forEach((product) => {
  productsHTMLContent += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>           
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTMLContent;

// ✅ Display "Added" message
function showAddedMessage(addToCartButton) {
  const addedMessageElement = addToCartButton.closest('.product-container').querySelector('.added-to-cart');
  addedMessageElement.style.opacity = '1';

  clearTimeout(addToCartButton.timeoutId);
  addToCartButton.timeoutId = setTimeout(() => {
    addedMessageElement.style.opacity = '0';
  }, 1250);
}

// ✅ Event Listener for Add to Cart button
document.querySelectorAll('.js-add-to-cart-button').forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', () => {

    const selectedProductId = addToCartButton.dataset.productId;
    const quantitySelector = document.querySelector(`.js-quantity-selector-${selectedProductId}`);
    let selectedQuantity = Number(quantitySelector.value);

    showAddedMessage(addToCartButton);
    addProductToCart(selectedProductId, selectedQuantity);

    // ✅ Update cart UI count

    const totalCartQuantity = getTotalCartQuantity(cart);
    document.querySelector('.js-cart-quantity').innerHTML = totalCartQuantity;
  });
});


