import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProductsDashboard from './pages/Products/AdminProductsDashboard';
import ProductBookingForm from './pages/Products/ProductBookingForm';
import ProductList from './pages/Products/ProductList';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Register from './pages/Register';

const App = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:productId"
            element={
              <ProtectedRoute>
                <ProductBookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminProductsDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="bg-dark text-light py-6 sm:py-8 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🎵 Music Store
              </span>
            </div>
            <p className="text-gray text-sm sm:text-base mb-2">
              Магазин музыкальных инструментов и колонок
            </p>
            <div className="flex justify-center space-x-4 text-xs sm:text-sm text-gray">
              <span>© 2026 Music Store</span>
              <span>•</span>
              <span>Все права защищены</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
