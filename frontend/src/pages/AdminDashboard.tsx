import { useEffect, useState } from 'react';
import api from '../lib/api';

type Car = {
  id: string;
  brand: string;
  model: string;
  color: string;
  description: string;
  photoUrl: string;
  pricePerDay: number;
  isAvailable: boolean;
};

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  user: { email: string; firstName?: string; lastName?: string; phone?: string };
  car: { brand: string; model: string };
};

const getImageUrl = (brand: string, model: string, id: string, photoUrl?: string) =>
  photoUrl && photoUrl.length > 0
    ? photoUrl
    : `https://picsum.photos/seed/${encodeURIComponent(`${brand}-${model}-${id}`)}/1200/800`;

const AdminDashboard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingQuery, setBookingQuery] = useState('');
  const [bookingSort, setBookingSort] = useState('startDate');
  const [bookingSortDir, setBookingSortDir] = useState<'asc' | 'desc'>('desc');

  const loadCars = async () => {
    const response = await api.get('/cars');
    setCars(response.data);
  };

  const loadBookings = async () => {
    const response = await api.get('/bookings');
    setBookings(response.data);
  };

  useEffect(() => {
    loadCars();
    loadBookings();
  }, []);

  const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/cars/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url as string;
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/cars', {
      brand,
      model,
      color,
      description,
      photoUrl,
      pricePerDay: Number(pricePerDay),
      isAvailable,
    });
    setBrand('');
    setModel('');
    setColor('');
    setDescription('');
    setPhotoUrl('');
    setPricePerDay('');
    setIsAvailable(true);
    loadCars();
  };

  const handleUpdate = async (car: Car) => {
    await api.patch(`/cars/${car.id}`, {
      brand: car.brand,
      model: car.model,
      color: car.color,
      description: car.description,
      photoUrl: car.photoUrl,
      pricePerDay: car.pricePerDay,
      isAvailable: car.isAvailable,
    });
    loadCars();
    setEditingCarId(null);
  };

  const handleDelete = async (carId: string) => {
    await api.delete(`/cars/${carId}`);
    loadCars();
  };

  const handleBookingStatus = async (bookingId: string, status: Booking['status']) => {
    await api.patch(`/bookings/${bookingId}/status`, { status });
    loadBookings();
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">Admin car management</h1>
        <form onSubmit={handleCreate} className="mt-6 grid gap-4 md:grid-cols-7">
          <input
            placeholder="Brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
          <input
            placeholder="Model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
          <input
            placeholder="Color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                setPhotoUploading(true);
                setPhotoError('');
                try {
                  const url = await uploadPhoto(file);
                  setPhotoUrl(url);
                } catch {
                  setPhotoError('Photo upload failed');
                } finally {
                  setPhotoUploading(false);
                }
              }}
              className="rounded-lg border border-slate-200 px-3 py-2"
            />
            {photoUrl && <span className="text-xs text-emerald-600">Photo ready</span>}
            {photoUploading && <span className="text-xs text-slate-500">Uploading...</span>}
            {photoError && <span className="text-xs text-rose-600">{photoError}</span>}
          </div>
          <input
            placeholder="Price per day"
            type="number"
            value={pricePerDay}
            onChange={(event) => setPricePerDay(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
          <button className="rounded-lg bg-ink px-4 py-2 text-white">Add car</button>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(event) => setIsAvailable(event.target.checked)}
            />
            Available
          </label>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold">Fleet</h2>
        <div className="mt-4 space-y-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
            >
              <div className="h-24 w-full overflow-hidden rounded-lg md:h-20 md:w-28">
                <img
                  src={getImageUrl(car.brand, car.model, car.id, car.photoUrl)}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{car.brand} {car.model}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <label className="flex items-center gap-2">
                    <span>Brand</span>
                    <input
                      type="text"
                      value={car.brand}
                      disabled={editingCarId !== car.id}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCars((prev) =>
                          prev.map((item) => (item.id === car.id ? { ...item, brand: value } : item)),
                        );
                      }}
                      className="w-36 rounded border border-slate-200 px-2 py-1 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span>Model</span>
                    <input
                      type="text"
                      value={car.model}
                      disabled={editingCarId !== car.id}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCars((prev) =>
                          prev.map((item) => (item.id === car.id ? { ...item, model: value } : item)),
                        );
                      }}
                      className="w-36 rounded border border-slate-200 px-2 py-1 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span>Color</span>
                    <input
                      type="text"
                      value={car.color}
                      disabled={editingCarId !== car.id}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCars((prev) =>
                          prev.map((item) => (item.id === car.id ? { ...item, color: value } : item)),
                        );
                      }}
                      className="w-32 rounded border border-slate-200 px-2 py-1 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span>Description</span>
                    <input
                      type="text"
                      value={car.description}
                      disabled={editingCarId !== car.id}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCars((prev) =>
                          prev.map((item) => (item.id === car.id ? { ...item, description: value } : item)),
                        );
                      }}
                      className="w-48 rounded border border-slate-200 px-2 py-1 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span>Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={editingCarId !== car.id}
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) {
                          return;
                        }
                        try {
                          const url = await uploadPhoto(file);
                          setCars((prev) =>
                            prev.map((item) => (item.id === car.id ? { ...item, photoUrl: url } : item)),
                          );
                        } catch {
                          setPhotoError('Photo upload failed');
                        }
                      }}
                      className="w-52 rounded border border-slate-200 px-2 py-1 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span>Price</span>
                    <input
                      type="number"
                      value={car.pricePerDay}
                      disabled={editingCarId !== car.id}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setCars((prev) =>
                          prev.map((item) => (item.id === car.id ? { ...item, pricePerDay: value } : item)),
                        );
                      }}
                      className="w-28 rounded border border-slate-200 px-2 py-1 disabled:bg-slate-100"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={car.isAvailable}
                      disabled={editingCarId !== car.id}
                      onChange={(event) => {
                        const value = event.target.checked;
                        setCars((prev) =>
                          prev.map((item) => (item.id === car.id ? { ...item, isAvailable: value } : item)),
                        );
                      }}
                    />
                    Available
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editingCarId === car.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(car)}
                      className="rounded-full border border-slate-200 px-4 py-1.5 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCarId(null);
                        loadCars();
                      }}
                      className="rounded-full border border-slate-200 px-4 py-1.5 text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingCarId(car.id)}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-sm"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(car.id)}
                  className="rounded-full bg-rose-500 px-4 py-1.5 text-sm text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold">Bookings</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
            <input
              placeholder="Search by email, name, phone, car, booking id"
              value={bookingQuery}
              onChange={(event) => setBookingQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 md:max-w-md"
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <select
              value={bookingSort}
              onChange={(event) => setBookingSort(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="startDate">Start date</option>
              <option value="endDate">End date</option>
              <option value="totalPrice">Total</option>
              <option value="status">Status</option>
              <option value="email">User email</option>
              <option value="car">Car</option>
            </select>
            <button
              type="button"
              onClick={() => setBookingSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {bookingSortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No bookings yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {[...bookings]
              .filter((booking) => {
                const query = bookingQuery.trim().toLowerCase();
                if (!query) {
                  return true;
                }
                const user = booking.user;
                const values = [
                  booking.id,
                  booking.car.brand,
                  booking.car.model,
                  user.email,
                  user.firstName || '',
                  user.lastName || '',
                  user.phone || '',
                  booking.status,
                ]
                  .join(' ')
                  .toLowerCase();
                return values.includes(query);
              })
              .sort((a, b) => {
                const direction = bookingSortDir === 'asc' ? 1 : -1;
                if (bookingSort === 'startDate') {
                  return (
                    (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) *
                    direction
                  );
                }
                if (bookingSort === 'endDate') {
                  return (
                    (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * direction
                  );
                }
                if (bookingSort === 'totalPrice') {
                  return (a.totalPrice - b.totalPrice) * direction;
                }
                if (bookingSort === 'status') {
                  return a.status.localeCompare(b.status) * direction;
                }
                if (bookingSort === 'email') {
                  return a.user.email.localeCompare(b.user.email) * direction;
                }
                if (bookingSort === 'car') {
                  const aCar = `${a.car.brand} ${a.car.model}`.trim();
                  const bCar = `${b.car.brand} ${b.car.model}`.trim();
                  return aCar.localeCompare(bCar) * direction;
                }
                return 0;
              })
              .map((booking) => (
              <div key={booking.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{booking.car.brand} {booking.car.model}</p>
                    <p className="text-sm text-slate-500">User: {booking.user.email}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500">Total: ${booking.totalPrice}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        handleBookingStatus(booking.id, event.target.value as Booking['status'])
                      }
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PAID">PAID</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
