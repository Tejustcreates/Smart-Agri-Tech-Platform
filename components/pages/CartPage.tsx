import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types';
import Cart from '../Cart';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: (total: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Cart
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onProceedToCheckout={onProceedToCheckout}
        onBackToShopping={() => navigate('/', { state: { scrollTo: 'mandi' } })}
      />
    </div>
  );
};

export default CartPage;
