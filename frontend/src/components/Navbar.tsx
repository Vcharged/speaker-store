import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-ink">
          Car Rental
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/cars" className="hover:text-accent">
            Cars
          </Link>
          {user && (
            <Link to="/bookings" className="hover:text-accent">
              My bookings
            </Link>
          )}
          {user && (
            <Link to="/profile" className="hover:text-accent">
              Profile
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="hover:text-accent">
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="rounded-full border border-slate-200 px-4 py-1.5">
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full border border-slate-200 px-4 py-1.5">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-ink px-4 py-1.5 text-white">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
