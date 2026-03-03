import { useEffect, useState } from 'react';
import api from '../lib/api';

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  car: {
    id: string;
    brand: string;
    model: string;
    photoUrl: string;
  };
};

const getImageUrl = (brand: string, model: string, id: string, photoUrl?: string) =>
  photoUrl && photoUrl.length > 0
    ? photoUrl
    : `https://picsum.photos/seed/${encodeURIComponent(`${brand}-${model}-${id}`)}/1200/800`;

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get('/bookings/me');
        setBookings(response.data);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="rounded-lg bg-white p-6 shadow">No bookings yet.</div>;
  }

  const handleCancel = async (bookingId: string) => {
    setUpdatingId(bookingId);
    setError('');
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      const response = await api.get('/bookings/me');
      setBookings(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to cancel booking');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">My bookings</h1>
        <p className="text-sm text-slate-500">Track your rental status.</p>
      </div>
      {error && <div className="rounded-lg bg-white p-4 text-sm text-rose-600 shadow">{error}</div>}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="h-32 w-full overflow-hidden rounded-xl md:h-28 md:w-40">
                <img
                  src={getImageUrl(
                    booking.car.brand,
                    booking.car.model,
                    booking.car.id,
                    booking.car.photoUrl,
                  )}
                  alt={`${booking.car.brand} ${booking.car.model}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{booking.car.brand} {booking.car.model}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm text-slate-500">Total: ${booking.totalPrice}</p>
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : booking.status === 'PAID'
                      ? 'bg-blue-100 text-blue-700'
                      : booking.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {booking.status}
                </span>
                {booking.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="mt-4 rounded-full border border-slate-200 px-4 py-1.5 text-sm"
                    disabled={updatingId === booking.id}
                  >
                    {updatingId === booking.id ? 'Cancelling...' : 'Cancel booking'}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MyBookings;
