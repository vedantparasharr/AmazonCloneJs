import { addProductToCart, cart, loadFromStorage } from "../../data/cart.js";

describe('test suite: addToCart', () => {

    it('add existing to cart', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1
            }])
        })

        loadFromStorage();
        addProductToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d', 1);
        expect(cart.length).toEqual(1);
        expect(cart[0].quantity).toEqual(2);
        expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');

    })

    it('add new product to cart', () => {

        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });
        loadFromStorage();
        addProductToCart
            ('15b6fc6f-327a-4ec4-896f-486349e85a3d', 1);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
        expect(cart[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{ productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1, deliveryOptionId: 1 }]
        ));
    })
});