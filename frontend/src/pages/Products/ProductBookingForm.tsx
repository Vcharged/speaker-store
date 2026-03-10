import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { addToCart } from '../../lib/cart';

export type Product = {
  id: string;
  category: 'SPEAKER' | 'INSTRUMENT';
  brand: string;
  model: string;
  description: string;
  photoUrl: string;
  price: number;
};

const getImageUrl = (category: string, brand: string, model: string, id: string, photoUrl?: string) =>
  photoUrl && photoUrl.length > 0
    ? photoUrl
    : `https://picsum.photos/seed/${encodeURIComponent(`${category}-${brand}-${model}-${id}`)}/1200/800`;

const ProductBookingForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    };
    loadProduct();
  }, [productId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    if (!product) return;
    addToCart(product, 1);
    setMessage('Добавлено в корзину!');
    setTimeout(() => navigate('/cart'), 350);
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-cardMusic p-8 rounded-xl shadow-lg border-2 border-highlight">
      <img src={getImageUrl(product.category, product.brand, product.model, product.id, product.photoUrl)} alt={product.model} className="w-full h-48 object-cover mb-4 rounded-xl border border-gold" />
      <h2 className="text-2xl font-bold mb-2 text-highlight">{product.brand} {product.model}</h2>
      <p className="mb-2 text-ink">{product.description}</p>
      <span className="block mb-2 text-gold font-semibold">Категория: {product.category === 'SPEAKER' ? 'Колонка' : 'Инструмент'}</span>
      <span className="block mb-4 font-semibold text-accent">
        Цена: {Math.round(product.price * 0.8).toLocaleString()} MDL
      </span>
      <button type="submit" className="bg-accent text-white px-6 py-2 rounded-xl font-bold hover:bg-gold transition">
        Купить
      </button>
      {message && <div className="mt-2 text-center text-green-600 font-semibold">{message}</div>}
    </form>
  );
};

export default ProductBookingForm;
