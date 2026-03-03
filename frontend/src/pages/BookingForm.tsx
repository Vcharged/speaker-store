import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

type Car = {
  id: string;
  brand: string;
  model: string;
  description: string;
  photoUrl: string;
  pricePerDay: number;
};

const getImageUrl = (brand: string, model: string, id: string, photoUrl?: string) =>
  photoUrl && photoUrl.length > 0
    ? photoUrl
    : `https://picsum.photos/seed/${encodeURIComponent(`${brand}-${model}-${id}`)}/1200/800`;

const BookingForm = () => {
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCar = async () => {
      const response = await api.get(`/cars/${carId}`);
      setCar(response.data);
    };

    loadCar();
  }, [carId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await api.post('/bookings', {
        carId,
        startDate,
        endDate,
      });
      setMessage('Booking created. Await confirmation.');
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Unable to create booking');
    }
  };

  if (!car) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading car...</div>;
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow">
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={getImageUrl(car.brand, car.model, car.id, car.photoUrl)}
          alt={`${car.brand} ${car.model}`}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      </div>
      <h1 className="text-2xl font-semibold">Book {car.brand} {car.model}</h1>
      {car.description && (
        <p className="mt-2 text-sm text-slate-500">{car.description}</p>
      )}
      <p className="mt-2 text-sm text-slate-500">${car.pricePerDay} per day</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        {message && <p className="text-sm text-slate-600">{message}</p>}
        <button type="submit" className="w-full rounded-lg bg-ink px-4 py-2 text-white">
          Confirm booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
