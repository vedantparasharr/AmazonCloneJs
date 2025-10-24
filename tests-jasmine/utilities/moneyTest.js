import { formatCurrency } from "../../scripts/utilities/money.js"
import { addProductToCart, cart, loadFromStorage } from "../../data/cart.js"

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
    it('five', ()=> {
        expect(formatCurrency(2000.4)).toEqual('20.00')
    })
    it('six', ()=> {
        expect(formatCurrency(-500)).toEqual('-5.00')
    })
});