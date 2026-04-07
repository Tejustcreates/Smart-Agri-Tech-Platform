import React from 'react';
import { Section, CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId:string) => void;
  onProceedToCheckout: (total: number) => void;
  onBackToShopping: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout, onBackToShopping }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <section id={Section.CART} className="py-20 bg-gray-100 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet.</p>
          <button onClick={onBackToShopping} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id={Section.CART} className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Your Shopping <span className="text-green-600">Cart</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Items in Cart ({cartItems.length})</h3>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center flex-grow">
                    <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Unit Price: ₹{item.price.toFixed(2)}</p>
                       <p className="text-sm text-gray-500 font-bold">Item Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-16 text-center border rounded-md mx-4 py-1"
                      min="1"
                    />
                    <button onClick={() => onRemoveItem(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                      <i className="fas fa-trash fa-lg"></i>
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
                <span className="text-xl font-bold text-gray-800">₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => onProceedToCheckout(total)}
              className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold text-lg"
            >
              Proceed to Checkout
            </button>
             <button onClick={onBackToShopping} className="w-full mt-4 text-center text-green-600 hover:underline">
                or Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
