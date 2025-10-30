// Import files
import { formatCurrency } from "../scripts/utilities/money.js";
import { getProduct, loadProducts } from "./products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { cart } from "./cart-class.js";

// Get orders from local storage
export const orders = getFromStorage() || [];

// Get cart quantity element
const cartQuantityElement = document.querySelector('.js-cart-quantity');

// Update cart quantity in header
function updateCartQuantityUI() {
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = `${cart.getTotalCartQuantity() || 0}`;
  }
}
updateCartQuantityUI();

// Add new order
export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

// Save orders to local storage
function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Get orders from local storage
function getFromStorage() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

// Render all orders on page
export function renderOrdersHTML() {
  const ordersGrid = document.querySelector(".js-orders-grid");

  // If orders section not found, stop
  if (!ordersGrid) {
    console.error("Element .js-orders-grid not found!");
    return;
  }

  // If no orders, show empty message
  if (!orders.length) {
    ordersGrid.innerHTML = `
      <div class="empty-message">You haven’t placed any orders yet.</div>
    `;
    return;
  }

  let ordersHTML = "";

  // Loop through each order
  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format("MMMM D");
    const totalCost = `${formatCurrency(order.totalCostCents)}`;
    const orderId = order.id;

    let productsHTML = "";

    // Loop through products in this order
    order.products.forEach((product) => {
      const p = getProduct(product.productId);

      // If product not found, skip
      if (!p) {
        console.warn("Product not found for ID:", product.productId, "in order:", order.id);
        return;
      }

      const deliveryDate = dayjs(product.estimatedDeliveryTime).format("MMMM D");

      // Product section HTML
      productsHTML += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${p.image}">
          </div>

          <div class="product-details">
            <div class="product-name">${p.name}</div>
            <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
            <div class="product-quantity">Quantity: ${product.quantity}</div>

            <!-- Buy again button -->
            <button class="buy-again-button js-buy-again-button button-primary" data-product-id="${p.id}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html">
              <button class="track-package-button button-secondary">Track package</button>
            </a>
          </div>
        </div>
      `;
    });

    // Order container HTML
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${totalCost}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderId}</div>
          </div>
        </div>

        ${productsHTML}
      </div>
    `;
  });

  // Show final HTML
  ordersGrid.innerHTML = ordersHTML;

  // Handle buy again button clicks
  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      cart.addProductToCart(productId, 1);

      // Update cart count
      updateCartQuantityUI();

      // Show "added" message
      button.innerHTML = `
        <div class="added-to-cart-orders">
          <img src="images/icons/checked.png">
          <p>Added to cart</p>
        </div>
      `;

      // Disable button for short time
      button.disabled = true;

      setTimeout(() => {
        // Reset button back to normal
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
        button.disabled = false;
      }, 1250);
    });
  });
}

// Load products first, then show orders
async function loadOrders() {
  await loadProducts();
  renderOrdersHTML();
}

// Run on page load
loadOrders();
