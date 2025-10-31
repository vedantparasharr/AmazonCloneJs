// File: scripts/amazon.js
// Purpose: Display all products and handle "Add to Cart" actions.

import { cart } from "../data/cart-class.js";
import { products, loadProducts } from "../data/products.js";

// Load products first, then render them
async function loadHomePage() {
  await loadProducts();
  renderProductsGrid();
}

loadHomePage();

// Render all products on the home page
function renderProductsGrid() {
  let productsHTML = "";

  // Show current cart quantity in the header
  const initialCartQty = cart.getTotalCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = initialCartQty;

  // Build HTML for each product card
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

  // Add all products to the page
  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  // Show "Added" message briefly after clicking Add to Cart
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

  // Handle Add to Cart button click
  document.querySelectorAll(".js-add-to-cart-button").forEach((addToCartButton) => {
    addToCartButton.addEventListener("click", () => {
      const selectedProductId = addToCartButton.dataset.productId;
      const quantitySelector = document.querySelector(`.js-quantity-selector-${selectedProductId}`);
      const selectedQuantity = Number(quantitySelector.value);

      // Show added message and add item to cart
      showAddedMessage(addToCartButton);
      cart.addProductToCart(selectedProductId, selectedQuantity);

      // Update cart quantity in header
      const totalCartQuantity = cart.getTotalCartQuantity();
      document.querySelector(".js-cart-quantity").innerHTML = totalCartQuantity;
    });
  });
}
