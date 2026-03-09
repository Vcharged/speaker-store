import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export type Product = {
  id: string;
  category: 'speaker' | 'instrument';
  brand: string;
  model: string;
  description: string;
  photoUrl: string;
  price: number;
  isAvailable: boolean;
};

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'speaker' | 'instrument'>('all');

  const getImageUrl = (category: string, id: string, photoUrl?: string) =>
    photoUrl && photoUrl.length > 0
      ? photoUrl
      : `https://picsum.photos/seed/${encodeURIComponent(`${category}-${id}`)}/1200/800`;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: filter !== 'all' ? { category: filter } : {}
        });
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError('Failed to load products. Check backend API connection.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filter]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {/* Фильтр категорий */}
      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'all' 
              ? 'bg-accent text-white' 
              : 'bg-cardMusic text-highlight border-2 border-highlight hover:border-gold'
          }`}
        >
          Все товары
        </button>
        <button
          onClick={() => setFilter('speaker')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'speaker' 
              ? 'bg-accent text-white' 
              : 'bg-cardMusic text-highlight border-2 border-highlight hover:border-gold'
          }`}
        >
          Колонки
        </button>
        <button
          onClick={() => setFilter('instrument')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'instrument' 
              ? 'bg-accent text-white' 
              : 'bg-cardMusic text-highlight border-2 border-highlight hover:border-gold'
          }`}
        >
          Инструменты
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-cardMusic rounded-xl shadow-lg p-6 border-2 border-highlight hover:border-gold transition-all flex flex-col">
            <div className="flex justify-between items-center mb-2">
              {user?.role === 'ADMIN' && (
                <Link to={`/admin/products/edit/${product.id}`} className="text-highlight hover:text-gold font-semibold">Редактировать</Link>
              )}
              <span className={product.isAvailable ? 'text-green-600' : 'text-red-600 font-bold'}>
                {product.isAvailable ? 'В наличии' : 'Нет в наличии'}
              </span>
            </div>
            <img src={getImageUrl(product.category, product.id, product.photoUrl)} alt={product.model} className="w-full h-48 object-cover mb-4 rounded-xl border border-gold" />
            <h3 className="text-xl font-bold text-highlight mb-1">{product.brand} {product.model}</h3>
            <p className="text-sm text-ink mb-2">{product.description}</p>
            <span className="block mb-2 text-gold font-semibold">{product.category === 'speaker' ? 'Колонка' : 'Инструмент'}</span>
            <span className="block mb-4 font-semibold text-accent">Цена: {product.price} ₽</span>
            {user && product.isAvailable && (
              <Link 
                to={`/book/${product.id}`}
                className="mt-auto bg-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-gold transition text-center"
              >
                Забронировать
              </Link>
            )}
            {!user && (
              <div className="mt-auto text-center text-sm text-ink">
                <Link to="/login" className="text-highlight hover:text-gold font-semibold">Войдите</Link>, чтобы забронировать
              </div>
            )}
          </div>
        ))}
      </div>
      <footer className="mt-12 py-6 text-center text-highlight bg-cardMusic rounded-xl shadow-lg">
        <span>© 2026 Music Store. Все права защищены. Магазин музыкальных инструментов и колонок.</span>
      </footer>
    </>
  );
};

export default ProductList;
