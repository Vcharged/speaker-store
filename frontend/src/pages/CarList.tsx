import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

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

const CarList = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getImageUrl = (make: string, id: string, photoUrl?: string) =>
    photoUrl && photoUrl.length > 0
      ? photoUrl
      : `https://picsum.photos/seed/${encodeURIComponent(`${make}-${id}`)}/1200/800`;

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await api.get('/cars');
        setCars(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError('Failed to load cars. Check backend API connection.');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading cars...</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-white p-6 shadow text-rose-600">{error}</div>;
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Available cars</h1>
          <p className="text-sm text-slate-500">Pick your ride and book instantly.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {cars.map((car, index) => {
          const make = `${car.brand} ${car.model}`.trim();
          return (
            <article key={car.id} className="rounded-2xl bg-white p-6 shadow">
              <div className="mb-4 overflow-hidden rounded-xl">
                <img
                  src={getImageUrl(make, car.id, car.photoUrl)}
                  alt={make}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h2 className="text-xl font-semibold">{make}</h2>
              {car.description && (
                <p className="mt-2 text-sm text-slate-500">{car.description}</p>
              )}
              <p className="mt-2 text-sm text-slate-500">Color: {car.color}</p>
              <p className="mt-2 text-sm text-slate-500">${car.pricePerDay} per day</p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    car.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {car.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                {user ? (
                  <Link
                    to={`/book/${car.id}`}
                    className="rounded-full bg-ink px-4 py-1.5 text-sm text-white"
                  >
                    Rent now
                  </Link>
                ) : (
                  <Link to="/login" className="text-sm font-medium text-accent">
                    Login to book
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CarList;
