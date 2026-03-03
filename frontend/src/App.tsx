import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import BookingForm from './pages/BookingForm';
import CarList from './pages/CarList';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Register from './pages/Register';

const App = () => {
  return (
    <div className="min-h-screen bg-stone text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <Routes>
          <Route path="/" element={<CarList />} />
          <Route path="/cars" element={<CarList />} />
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
            path="/book/:carId"
            element={
              <ProtectedRoute>
                <BookingForm />
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
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
