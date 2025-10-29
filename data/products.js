// Purpose: Product catalog and helper to fetch a product by id (no logic changes).
import { formatCurrency } from "../scripts/utilities/money.js";
// --- Helpers ---
export function getProduct(productId) {
  let matchingProduct;
  products.forEach((item) => {
    if (item.id === productId) {
      matchingProduct = item;
    }
  });
  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsURL() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return ``;
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(clothingDetails) {
    super(clothingDetails);
    this.sizeChartLink = clothingDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `<a href="/images/clothing-size-chart.png" target="_blank">Size Chart</a>`
  }
};

export let products = [];
export async function loadProducts() {
  const response = await fetch('https://supersimplebackend.dev/products');
  const productsData = await response.json();
  products = productsData.map((productDetails) => {
    if(productDetails.type === 'clothing') {
      return new Clothing(productDetails);
    } else {
      return new Product(productDetails);
    }
  });
  console.log('Products are loaded');
}