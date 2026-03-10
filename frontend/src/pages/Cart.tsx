import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem, clearCart, getCartItems, removeFromCart } from '../lib/cart';

const toMDL = (price: number) => Math.round(price * 0.8);

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + toMDL(item.product.price) * item.quantity, 0);
  }, [items]);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setItems(getCartItems());
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-4">Корзина</h1>
        <p className="text-gray mb-6">Пока пусто. Добавьте товары.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Перейти к товарам
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark">Корзина</h1>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray hover:text-error hover:border-error transition-colors"
        >
          Очистить
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-bold text-dark truncate">
                  {item.product.brand} {item.product.model}
                </div>
                <div className="text-sm text-gray mt-1">
                  {item.product.category === 'SPEAKER' ? '🔊 Колонка' : '🎸 Инструмент'}
                </div>
                <div className="text-sm text-gray mt-1">Количество: {item.quantity}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {(toMDL(item.product.price) * item.quantity).toLocaleString()} MDL
                </div>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="mt-2 text-sm text-error hover:underline"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-dark">Итого</div>
        <div className="text-2xl sm:text-3xl font-bold text-dark">{total.toLocaleString()} MDL</div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={() => alert(`Оплата будет доступна позже. Сумма: ${total.toLocaleString()} MDL`)}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Оплатить
        </button>
      </div>
    </div>
  );
};

export default Cart;

