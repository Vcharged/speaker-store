import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl sm:text-3xl transform transition-transform group-hover:scale-110">🎵</span>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Music Store
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/products" 
              className="text-gray hover:text-primary font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Товары
            </Link>
            <Link
              to="/cart"
              className="text-gray hover:text-primary font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Корзина
            </Link>
            {user && (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray hover:text-primary font-medium transition-colors duration-200 hover:scale-105 transform"
                >
                  Профиль
                </Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <Link 
                to="/admin/products" 
                className="text-gray hover:text-secondary font-bold transition-colors duration-200 hover:scale-105 transform"
              >
                Админ-панель
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <button 
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-error to-red-500 text-white rounded-full text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Выйти
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-3 sm:px-4 py-2 bg-ink text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Войти
                </Link>
                <Link 
                  to="/register"
                  className="px-3 sm:px-4 py-2 bg-white/95 text-dark border border-dark/10 rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-105"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray hover:text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
