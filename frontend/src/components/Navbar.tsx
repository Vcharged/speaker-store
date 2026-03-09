import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-highlight bg-cardMusic">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-highlight flex items-center gap-2">
          🎵 Music Store
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/products" className="hover:text-accent text-highlight">
            Товары
          </Link>
          {user && (
            <Link to="/bookings" className="hover:text-accent text-highlight">
              Мои бронирования
            </Link>
          )}
          {user && (
            <Link to="/profile" className="hover:text-accent text-highlight">
              Профиль
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin/products" className="hover:text-accent text-highlight font-bold">
              Админ-панель
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="rounded-full border border-highlight px-4 py-1.5 text-highlight hover:bg-accent hover:text-white transition">
              Выйти
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full border border-highlight px-4 py-1.5 text-highlight hover:bg-accent hover:text-white transition">
                Войти
              </Link>
              <Link to="/register" className="rounded-full bg-accent px-4 py-1.5 text-white hover:bg-gold transition">
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
