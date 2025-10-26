class Cart {
    cartItems;
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;

        // Normalize cart items
        this.#loadFromStorage();
        this.normalizeItems();
    }

    #getFromStorage() {
        return JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
    }

    #saveToStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems))
    }

    saveToStorage() {
        this.#saveToStorage();
    }

    // Load cart items from local storage
    #loadFromStorage() {
        this.cartItems = this.#getFromStorage();
    }

    // Add a product to the cart
    addProductToCart(selectedProductId, selectedQuantity) {
        let existingCartItem;

        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId === selectedProductId) {
                existingCartItem = cartItem;
            }
        });

        if (existingCartItem) {
            existingCartItem.quantity += selectedQuantity;
        } else {
            this.cartItems.push({
                productId: selectedProductId,
                quantity: selectedQuantity,
                deliveryOptionId: 1,
            });
        }
        this.#saveToStorage();
    }

    // Remove a product from the cart
    removeFromCart(productId) {
        let index = -1;
        for (let i = 0; i < this.cartItems.length; i++) {
            if (productId === this.cartItems[i].productId) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this.cartItems.splice(index, 1);
            this.ifCartEmpty();
            this.#saveToStorage();
        }
    }

    // Show "empty cart" message
    ifCartEmpty() {
        const cartItemsQuantity = this.getTotalCartQuantity();
        if (cartItemsQuantity === 0) {
            document.querySelector('.js-order-summary').innerHTML = `
                <p class="view-products-p">Your cart is empty</p>
                <a href="/amazon.html" class="view-products-button">View Products</a>
            `;
        }
    }

    // Get total quantity of all items
    getTotalCartQuantity() {
        let total = 0;
        this.cartItems.forEach((cartItem) => {
            total += cartItem.quantity;
        });
        return total;
    }

    // Update delivery option for a product
    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;
        this.cartItems.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });
        matchingItem.deliveryOptionId = Number(deliveryOptionId);
        this.#saveToStorage();
    }

    normalizeItems() {
        this.cartItems.forEach((item) => {
            item.deliveryOptionId = Number(item.deliveryOptionId) || 1;
        });
        this.#saveToStorage();
    }

}


const cart = new Cart('cart-oop');


export { cart };
