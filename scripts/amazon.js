// File: scripts/amazon.js
// Purpose: Show all products and handle Add to Cart UI.

import { cart } from "../data/cart-class.js";
import { products, loadProducts } from "../data/products.js";

async function loadHomePage() {
  await loadProducts();
  renderProductsGrid();
}

loadHomePage();

function renderProductsGrid() {
  // --- Create product grid HTML ---
  let productsHTML = "";

  // --- Set initial cart count ---
  const initialCartQty = cart.getTotalCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = initialCartQty;

  // --- Build product cards ---
  products.forEach((product) => {
    productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="${product.getStarsURL()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
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

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>
      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button
        class="add-to-cart-button button-primary js-add-to-cart-button"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
  });

  // --- Add grid to page ---
  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  // --- Show “Added” briefly after click ---
  function showAddedMessage(addToCartButton) {
    const addedMessageElement = addToCartButton
      .closest(".product-container")
      .querySelector(".added-to-cart");

    addedMessageElement.style.opacity = "1";

    clearTimeout(addToCartButton.timeoutId);
    addToCartButton.timeoutId = setTimeout(() => {
      addedMessageElement.style.opacity = "0";
    }, 1250);
  }

  // --- Handle Add to Cart clicks ---
  document.querySelectorAll(".js-add-to-cart-button").forEach((addToCartButton) => {
    addToCartButton.addEventListener("click", () => {
      const selectedProductId = addToCartButton.dataset.productId;
      const quantitySelector = document.querySelector(`.js-quantity-selector-${selectedProductId}`);
      const selectedQuantity = Number(quantitySelector.value);

      showAddedMessage(addToCartButton);
      cart.addProductToCart(selectedProductId, selectedQuantity);

      // Update cart count
      const totalCartQuantity = cart.getTotalCartQuantity();
      document.querySelector(".js-cart-quantity").innerHTML = totalCartQuantity;
    });
  });
}
