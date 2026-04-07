import React, { useState } from 'react';
import { Section } from '../types';

interface PaymentProps {
  total: number;
  onPaymentSuccess: () => void;
  onBackToCart: () => void;
}

const Payment: React.FC<PaymentProps> = ({ total, onPaymentSuccess, onBackToCart }) => {
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentState('processing');
    setTimeout(() => {
      setPaymentState('success');
      // In a real app, you'd wait for a success callback from the payment provider.
      setTimeout(() => {
          onPaymentSuccess();
      }, 1500); // Give user time to see success message before redirect
    }, 2000);
  };

  if (paymentState === 'success') {
    return (
        <section id={Section.PAYMENT} className="py-20 bg-gray-100 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center bg-white p-10 rounded-xl shadow-lg animate-fade-in-up">
                <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-gray-800">Payment Successful!</h2>
                <p className="text-gray-600 mt-2">Redirecting you to the home page...</p>
            </div>
        </section>
    );
  }

  return (
    <section id={Section.PAYMENT} className="py-20 bg-gray-100 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <button onClick={onBackToCart} className="text-sm text-gray-600 hover:text-green-600 mb-6">
                    <i className="fas fa-arrow-left mr-2"></i>Back to Cart
                </button>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
                    Checkout
                </h2>
                <p className="text-center text-gray-500 mb-8">Please enter your payment details</p>
                <form onSubmit={handlePayment}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input type="text" className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="John Doe" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                            <input type="text" className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="•••• •••• •••• ••••" required />
                            <i className="fab fa-cc-visa text-gray-400 text-2xl absolute right-3 top-1/2 -translate-y-1/2"></i>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input type="text" className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="MM / YY" required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input type="text" className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="•••" required />
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold text-gray-800">Total</span>
                            <span className="text-xl font-bold text-gray-800">₹{total.toFixed(2)}</span>
                        </div>
                        <button type="submit" className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold text-lg disabled:bg-green-400" disabled={paymentState === 'processing'}>
                            {paymentState === 'processing' ? <><i className="fas fa-spinner fa-spin mr-2"></i>Processing...</> : `Pay ₹${total.toFixed(2)}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
  );
};

export default Payment;
