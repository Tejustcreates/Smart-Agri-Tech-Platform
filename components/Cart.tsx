import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId:string) => void;
  onProceedToCheckout: (total: number) => void;
  onBackToShopping: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout, onBackToShopping }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <section id="cart" className="py-20 bg-gray-100 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center px-4">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet.</p>
          <button onClick={onBackToShopping} className="mt-6 px-8 py-3.5 min-h-[48px] bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold transition-colors duration-300">
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="cart" className="py-20 bg-gray-100 pb-24 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8 sm:mb-12">
          Your Shopping <span className="text-brand-600">Cart</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Items in Cart ({cartItems.length})</h3>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                  <div className="flex items-center flex-grow gap-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="text-sm text-gray-500">{item.name}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">₹{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-19 sm:pl-0">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="min-h-[48px] min-w-[48px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold text-xl transition-colors"
                    >
                      <i className="fas fa-minus text-sm"></i>
                    </button>
                    <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="min-h-[48px] min-w-[48px] flex items-center justify-center bg-brand-600 hover:bg-brand-700 rounded-lg text-white font-bold text-xl transition-colors"
                    >
                      <i className="fas fa-plus text-sm"></i>
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="min-h-[48px] min-w-[48px] flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    >
                      <i className="fas fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (5%)</span>
                <span className="font-semibold text-gray-800">₹{tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-brand-600">₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => onProceedToCheckout(total)}
              className="w-full py-3.5 min-h-[48px] text-white bg-brand-600 rounded-lg hover:bg-brand-700 font-bold text-lg transition-colors"
            >
              Proceed to Checkout
            </button>
            <button onClick={onBackToShopping} className="w-full mt-4 min-h-[48px] text-center text-brand-600 hover:text-brand-700 font-medium transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
