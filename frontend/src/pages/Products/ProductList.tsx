import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from '../../lib/cart';

export type Product = {
  id: string;
  category: 'SPEAKER' | 'INSTRUMENT';
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
  const [filter, setFilter] = useState<'all' | 'SPEAKER' | 'INSTRUMENT'>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const getImageUrl = (category: string, id: string, photoUrl?: string) =>
    photoUrl && photoUrl.length > 0
      ? photoUrl
      : `https://picsum.photos/seed/${encodeURIComponent(`${category}-${id}`)}/400/300`;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: filter !== 'all' ? { category: filter } : {},
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

  const handleBuy = (product: Product) => {
    addToCart(
      {
        id: product.id,
        category: product.category,
        brand: product.brand,
        model: product.model,
        description: product.description,
        photoUrl: product.photoUrl,
        price: product.price,
      },
      1,
    );

    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === product.id ? null : current));
    }, 700);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-error text-lg font-semibold mb-2">Ошибка загрузки</div>
      <div className="text-gray">{error}</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Музыкальный магазин
        </h1>
        <p className="text-gray text-lg max-w-2xl mx-auto">
          Найдите идеальные инструменты и колонки для вашей музыки
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {[
          { value: 'all', label: 'Все товары', icon: '🎵' },
          { value: 'SPEAKER', label: 'Колонки', icon: '🔊' },
          { value: 'INSTRUMENT', label: 'Инструменты', icon: '🎸' }
        ].map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value as any)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
              filter === value 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                : 'bg-white border-2 border-gray text-gray hover:border-primary hover:text-primary'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group animate-slide-up ${
              justAddedId === product.id ? 'ring-2 ring-secondary/60 animate-pulse' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Product Image */}
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              <Link to={`/book/${product.id}`} aria-label={`Купить ${product.brand} ${product.model}`}>
                <img 
                  src={getImageUrl(product.category, product.id, product.photoUrl)} 
                  alt={product.model} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                />
              </Link>
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.isAvailable 
                    ? 'bg-success text-white' 
                    : 'bg-error text-white'
                }`}>
                  {product.isAvailable ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>
              {user?.role === 'ADMIN' && (
                <div className="absolute top-3 left-3">
                  <Link 
                    to={`/admin/products/edit/${product.id}`}
                    className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Редактировать
                  </Link>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                  product.category === 'SPEAKER' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <span className="mr-1">
                    {product.category === 'SPEAKER' ? '🔊' : '🎸'}
                  </span>
                  {product.category === 'SPEAKER' ? 'Колонка' : 'Инструмент'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-dark line-clamp-1">
                {product.brand} {product.model}
              </h3>

              <p className="text-gray text-sm line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {Math.round(product.price * 0.8).toLocaleString()} MDL
                </span>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {user && product.isAvailable ? (
                  <button
                    type="button"
                    onClick={() => handleBuy(product)}
                    className="block w-full py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Купить
                  </button>
                ) : !user ? (
                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="inline-block px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      Войдите чтобы бронировать
                    </Link>
                  </div>
                ) : (
                  <div className="text-center text-gray text-sm">
                    Товар временно недоступен
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-dark mb-2">Товары не найдены</h3>
          <p className="text-gray">Попробуйте изменить фильтры</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
