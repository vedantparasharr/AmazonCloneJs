import { formatCurrency } from "../scripts/utilities/money.js"
import { addProductToCart, cart, loadFromStorage } from "../data/cart.js"

describe('test', () => {
    it('one', () => {
        expect(formatCurrency(2095)).toEqual('20.95');
    });
    it('two', () => {
        expect(formatCurrency(3098)).toEqual('30.98');
    });
    it('three', () => {
        expect(formatCurrency(0)).toEqual('0.00')
    })

    it('four', () => {
        expect(formatCurrency(2000.5)).toEqual('20.01')
    })

    it('five', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1,
                deliveryOptionId: '1'
            }
            ]);
        });
        loadFromStorage();

        addProductToCart
            ('15b6fc6f-327a-4ec4-896f-486349e85a3d', 1);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
        expect(cart[0].quantity).toEqual(2);
    })

    it('six', () => {

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
    })
});