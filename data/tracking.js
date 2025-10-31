// Imports
import { orders } from "./orders.js";
import { getProduct, loadProducts } from "./products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

// Main render function
function renderTrackingHTML() {
  // Get order and product IDs from URL
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  // Get HTML elements
  const deliveryDateHTML = document.querySelector(".js-delivery-date");
  const productNameHTML = document.querySelector(".js-product-name");
  const productQuantityHTML = document.querySelector(".js-product-quantity");
  const productImageHTML = document.querySelector(".js-product-image");
  const progressBar = document.querySelector(".js-progress-bar");

  // Find order
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    document.querySelector("main").innerHTML = `<p>Order not found!</p>`;
    throw new Error("Order not found");
  }

  // Find product in order
  const productData = order.products.find((p) => p.productId === productId);
  if (!productData) {
    document.querySelector("main").innerHTML = `<p>Product not found!</p>`;
    throw new Error("Order not found");
  }

  // Get product info
  const product = getProduct(productId);
  const orderPlaced = dayjs(order.orderTime);
  const deliveryEstimate = dayjs(productData.estimatedDeliveryTime);

  // Set product details
  deliveryDateHTML.innerHTML = `Arriving on ${deliveryEstimate.format(
    "dddd, MMMM DD"
  )}`;
  productNameHTML.innerHTML = `${product.name}`;
  productQuantityHTML.innerHTML = `Quantity: ${productData.quantity}`;
  productImageHTML.src = `${product.image}`;

  // Calculate progress
  const now = dayjs();
  const totalDuration = deliveryEstimate.diff(orderPlaced);
  const elapsed = now.diff(orderPlaced);
  let progressPercent = Math.min(100, (elapsed / totalDuration) * 100);

  if (progressPercent < 0) progressPercent = 0;
  if (progressPercent > 100) progressPercent = 100;

  // Update progress bar
  progressBar.style.width = `${progressPercent}%`;
  if (progressPercent < 33) {
    progressBar.style.backgroundColor = "orange"; // preparing
  } else if (progressPercent < 66) {
    progressBar.style.backgroundColor = "gold"; // shipped
  } else {
    progressBar.style.backgroundColor = "green"; // delivered
  }
}

// Load products first, then render
loadProducts().then(() => {
  renderTrackingHTML();
});
