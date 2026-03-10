import { useEffect, useMemo, useState } from 'react';
import api from '../../lib/api';

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

export type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  user: { email: string; firstName?: string; lastName?: string; phone?: string };
  product: { brand: string; model: string };
};

export type AdminUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  createdAt: string;
  bookings: { id: string; totalPrice: number; status: Booking['status']; startDate: string; endDate: string }[];
};

const getImageUrl = (category: string, brand: string, model: string, id: string, photoUrl?: string) =>
  photoUrl && photoUrl.length > 0
    ? photoUrl
    : `https://picsum.photos/seed/${encodeURIComponent(`${category}-${brand}-${model}-${id}`)}/1200/800`;

const AdminProductsDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [category, setCategory] = useState<'SPEAKER' | 'INSTRUMENT'>('SPEAKER');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
    api.get('/bookings').then(res => setBookings(res.data));
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  const userStats = useMemo(
    () =>
      users.map((u) => {
        const ordersCount = u.bookings.length;
        const totalSpent = u.bookings.reduce((sum, b) => sum + b.totalPrice, 0);
        return { ...u, ordersCount, totalSpent };
      }),
    [users],
  );

  const handleCreateProduct = async () => {
    try {
      await api.post('/products', {
        category,
        brand,
        model,
        description,
        photoUrl,
        price,
      });
      // Reset form
      setCategory('SPEAKER');
      setBrand('');
      setModel('');
      setDescription('');
      setPhotoUrl('');
      setPrice(0);
      setIsAvailable(true);
      // Refresh products
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleUpdateProduct = async (productId: string) => {
    try {
      await api.patch(`/products/${productId}`, {
        category,
        brand,
        model,
        description,
        photoUrl,
        price,
      });
      setEditingProductId(null);
      // Reset form
      setCategory('SPEAKER');
      setBrand('');
      setModel('');
      setDescription('');
      setPhotoUrl('');
      setPrice(0);
      setIsAvailable(true);
      // Refresh products
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await api.delete(`/products/${productId}`);
        // Refresh products
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setCategory(product.category);
    setBrand(product.brand);
    setModel(product.model);
    setDescription(product.description);
    setPhotoUrl(product.photoUrl);
    setPrice(product.price);
    setIsAvailable(product.isAvailable);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setCategory('SPEAKER');
    setBrand('');
    setModel('');
    setDescription('');
    setPhotoUrl('');
    setPrice(0);
    setIsAvailable(true);
  };

  return (
    <div className="p-8 bg-bgMusic min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-highlight">Админ-панель товаров</h1>
      
      {/* Форма добавления/редактирования товара */}
      <div className="mb-8 bg-cardMusic p-6 rounded-xl shadow-lg border-2 border-highlight">
        <h2 className="text-xl font-semibold mb-4 text-accent">
          {editingProductId ? 'Редактировать товар' : 'Добавить новый товар'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-highlight">Категория:</label>
            <select value={category} onChange={e => setCategory(e.target.value as 'SPEAKER' | 'INSTRUMENT')} className="border border-highlight rounded px-2 py-1 w-full">
              <option value="SPEAKER">Колонка</option>
              <option value="INSTRUMENT">Инструмент</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-highlight">Бренд:</label>
            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="border border-highlight rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block mb-1 text-highlight">Модель:</label>
            <input type="text" value={model} onChange={e => setModel(e.target.value)} className="border border-highlight rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block mb-1 text-highlight">Цена:</label>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="border border-highlight rounded px-2 py-1 w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-highlight">Описание:</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="border border-highlight rounded px-2 py-1 w-full" rows={3} />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-highlight">URL фото:</label>
            <input type="text" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="border border-highlight rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="mr-2" />
              <span className="text-highlight">В наличии</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {editingProductId ? (
            <>
              <button onClick={() => handleUpdateProduct(editingProductId)} className="bg-accent text-white px-4 py-2 rounded font-bold hover:bg-gold transition">
                Сохранить изменения
              </button>
              <button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600 transition">
                Отмена
              </button>
            </>
          ) : (
            <button onClick={handleCreateProduct} className="bg-accent text-white px-4 py-2 rounded font-bold hover:bg-gold transition">
              Добавить товар
            </button>
          )}
        </div>
      </div>

      {/* Список товаров */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-cardMusic rounded-xl shadow-lg p-6 border-2 border-highlight hover:border-gold transition-all">
              <img src={getImageUrl(product.category, product.brand, product.model, product.id, product.photoUrl)} alt={product.model} className="w-full h-48 object-cover mb-4 rounded-xl border border-gold" />
              <h3 className="text-xl font-bold text-highlight mb-1">{product.brand} {product.model}</h3>
              <p className="text-sm text-ink mb-2">{product.description}</p>
              <span className="block mb-2 text-gold font-semibold">{product.category === 'SPEAKER' ? 'Колонка' : 'Инструмент'}</span>
              <span className="block mb-2 font-semibold text-accent">Цена: {Math.round(product.price * 0.8)} MDL</span>
              <span className={product.isAvailable ? 'text-green-600' : 'text-red-600 font-bold'}>
                {product.isAvailable ? 'В наличии' : 'Нет в наличии'}
              </span>
              <div className="mt-4 flex gap-2">
                <button className="text-highlight hover:text-gold font-semibold" onClick={() => startEdit(product)}>Редактировать</button>
                <button className="text-red-600 hover:text-red-800 font-semibold" onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Список бронирований */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-accent">Покупки</h2>
        <table className="w-full table-auto bg-cardMusic rounded-xl shadow-lg">
          <thead className="bg-highlight text-white">
            <tr>
              <th className="p-2">Товар</th>
              <th className="p-2">Пользователь</th>
              <th className="p-2">Даты</th>
              <th className="p-2">Статус</th>
              <th className="p-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="border-b border-bgMusic">
                <td className="p-2 text-highlight">{booking.product.brand} {booking.product.model}</td>
                <td className="p-2 text-ink">{booking.user.email}</td>
                <td className="p-2">{booking.startDate} - {booking.endDate}</td>
                <td className="p-2 text-accent font-bold">{booking.status}</td>
                <td className="p-2 text-gold font-semibold">{Math.round(booking.totalPrice * 0.8)} MDL</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Список пользователей */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Пользователи</h2>
        <div className="overflow-x-auto bg-cardMusic rounded-xl shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-highlight text-white">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Имя</th>
                <th className="p-2 text-left">Телефон</th>
                <th className="p-2 text-left">Роль</th>
                <th className="p-2 text-right">Покупок</th>
                <th className="p-2 text-right">Сумма (MDL)</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((user) => (
                <tr key={user.id} className="border-b border-bgMusic">
                  <td className="p-2 text-ink">{user.email}</td>
                  <td className="p-2 text-ink">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-2 text-ink">{user.phone}</td>
                  <td className="p-2 text-ink">{user.role}</td>
                  <td className="p-2 text-right text-accent font-semibold">{user.ordersCount}</td>
                  <td className="p-2 text-right text-gold font-semibold">
                    {Math.round(user.totalSpent * 0.8).toLocaleString()} MDL
                  </td>
                </tr>
              ))}
              {userStats.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray" colSpan={6}>
                    Пользователи пока не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsDashboard;
