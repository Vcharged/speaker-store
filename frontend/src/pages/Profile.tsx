import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setBirthDate(user.birthDate ? user.birthDate.slice(0, 10) : '');
    setPhone(user.phone || '');
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.patch('/users/me', { firstName, lastName, birthDate, phone });
      setMessage('Profile updated');
    } catch {
      setError('Unable to update profile');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-2 text-sm text-slate-500">Update your personal details.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Date of birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-ink px-4 py-2 text-white">
          Save changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
