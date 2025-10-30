export const orders = getFromStorage() || [];

export function addOrder(order) {
    orders.unshift(order)
    saveToStorage();
}

function saveToStorage () {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getFromStorage() {
    JSON.parse(localStorage.getItem('orders'));
}

export function renderOrdersHTML() {

}

renderOrdersHTML();