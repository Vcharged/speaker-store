export type CartProduct = {
  id: string;
  category: 'SPEAKER' | 'INSTRUMENT';
  brand: string;
  model: string;
  description: string;
  photoUrl?: string;
  price: number;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
  addedAt: string;
};

const CART_KEY = 'music_store_cart_v1';

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function addToCart(product: CartProduct, quantity = 1) {
  const items = readCart();
  const idx = items.findIndex((i) => i.product.id === product.id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
  } else {
    items.push({ product, quantity, addedAt: new Date().toISOString() });
  }
  writeCart(items);

  // уведомляем остальные компоненты (например, Navbar) об изменении корзины
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((i) => i.product.id !== productId));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
}

export function clearCart() {
  writeCart([]);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

