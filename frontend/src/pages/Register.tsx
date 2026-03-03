import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(email, password, firstName, lastName, birthDate, phone);
      navigate('/');
    } catch {
      setError('Unable to register');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <p className="mt-2 text-sm text-slate-500">Start booking premium cars.</p>
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
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
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
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-ink px-4 py-2 text-white">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
