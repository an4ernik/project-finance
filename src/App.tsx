import {Routes, Route} from 'react-router-dom';
import {Toaster} from 'sonner';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import ThemeProvider from '@/shared/providers/ThemeProvider';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import SettingsPage from '@/pages/SettingsPage';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AccountSettings from './pages/AccountSettings';
import SecuritySettings from './pages/SecuritySettings';
import NotificationsSettings from './pages/NotificationsSettings';
import Landing from './pages/Landing';

function App() {
  return (
    <>
      <ThemeProvider>
        <Toaster />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />}>
              <Route index element={<AccountSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="notifications" element={<NotificationsSettings />} />
            </Route>
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
