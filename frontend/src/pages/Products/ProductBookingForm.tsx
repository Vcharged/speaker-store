import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';

export type Product = {
  id: string;
  category: 'speaker' | 'instrument';
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
  const [product, setProduct] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    };
    loadProduct();
  }, [productId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await api.post('/bookings', {
        productId,
        startDate,
        endDate,
      });
      setMessage('Бронирование успешно отправлено!');
    } catch {
      setMessage('Ошибка при бронировании.');
    }
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-cardMusic p-8 rounded-xl shadow-lg border-2 border-highlight">
      <img src={getImageUrl(product.category, product.brand, product.model, product.id, product.photoUrl)} alt={product.model} className="w-full h-48 object-cover mb-4 rounded-xl border border-gold" />
      <h2 className="text-2xl font-bold mb-2 text-highlight">{product.brand} {product.model}</h2>
      <p className="mb-2 text-ink">{product.description}</p>
      <span className="block mb-2 text-gold font-semibold">Категория: {product.category === 'speaker' ? 'Колонка' : 'Инструмент'}</span>
      <span className="block mb-2 font-semibold text-accent">Цена: {product.price} ₽</span>
      <label className="block mb-2">
        <span className="text-highlight">Дата начала:</span>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-highlight rounded px-2 py-1 w-full" required />
      </label>
      <label className="block mb-2">
        <span className="text-highlight">Дата окончания:</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-highlight rounded px-2 py-1 w-full" required />
      </label>
      <button type="submit" className="bg-accent text-white px-6 py-2 rounded-xl font-bold hover:bg-gold transition">Забронировать</button>
      {message && <div className="mt-2 text-center text-green-600 font-semibold">{message}</div>}
    </form>
  );
};

export default ProductBookingForm;
