import React, { useState } from 'react';

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
      setTimeout(() => {
          onPaymentSuccess();
      }, 1500);
    }, 2000);
  };

  if (paymentState === 'success') {
    return (
      <section id="payment" className="py-20 bg-gray-100 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg animate-fade-in-up px-4">
          <i className="fas fa-check-circle text-6xl text-brand-500 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">Redirecting you to the home page...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="payment" className="py-20 bg-gray-100 min-h-[calc(100vh-64px)] pb-24 lg:pb-20">
      {/* Brand-900 header bar */}
      <div className="bg-brand-900 px-4 py-3 flex items-center gap-3">
        <button onClick={onBackToCart} className="text-white/70 hover:text-white min-h-[48px] min-w-[48px] flex items-center justify-center" aria-label="Back to cart">
          <i className="fas fa-arrow-left text-lg"></i>
        </button>
        <div className="flex items-center gap-2">
          <i className="fas fa-leaf text-brand-400"></i>
          <span className="text-white font-bold">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-5 sm:p-8">
          {/* Demo payment badge — prominent amber */}
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-flask text-amber-600 text-lg"></i>
            </div>
            <div>
              <p className="font-bold text-amber-800 text-sm">Demo Payment</p>
              <p className="text-amber-700 text-xs">No real money will be charged. This is a test checkout.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Checkout</h2>
          <p className="text-center text-gray-500 mb-6">Please enter your payment details</p>

          <form onSubmit={handlePayment}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input type="text" className="w-full p-3.5 min-h-[48px] bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="John Doe" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3.5 min-h-[48px] bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  pattern="[\d ]{16,19}"
                  inputMode="numeric"
                  required
                />
                <i className="fab fa-cc-visa text-gray-400 text-2xl absolute right-3 top-1/2 -translate-y-1/2"></i>
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  className="w-full p-3.5 min-h-[48px] bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="MM / YY"
                  maxLength={7}
                  pattern="\d{2}\s*/?\s*\d{2}"
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full p-3.5 min-h-[48px] bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="123"
                  maxLength={4}
                  pattern="\d{3,4}"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-brand-600">₹{total.toFixed(2)}</span>
              </div>
              <button type="submit" className="w-full py-3.5 min-h-[48px] text-white bg-brand-600 rounded-lg hover:bg-brand-700 font-bold text-lg disabled:bg-brand-400 transition-colors" disabled={paymentState === 'processing'}>
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
