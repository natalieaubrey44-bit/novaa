import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Personal from './pages/Personal';
import Business from './pages/Business';
import LoansPage from './pages/LoansPage';
import Investments from './pages/Investments';
import ResourcesPage from './pages/ResourcesPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveChatWidget from './components/LiveChatWidget';
import AdminShell from './admin/layout/AdminShell';
import AdminDashboard from './admin/pages/AdminDashboard';
import UsersPage from './admin/pages/UsersPage';
import AccountsPage from './admin/pages/AccountsPage';
import TransactionsPage from './admin/pages/TransactionsPage';
import ReportsPage from './admin/pages/ReportsPage';
import SettingsPage from './admin/pages/SettingsPage';

// Route guards moved to components/ProtectedUserRoute and components/ProtectedAdminRoute

function AppShell() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-light dark:bg-brand-navy text-brand-primary dark:text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/business" element={<Business />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedUserRoute /> }>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedAdminRoute />}>
            <Route path="" element={<AdminShell />} />
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isDashboard && !isLoggedIn && <LiveChatWidget />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}