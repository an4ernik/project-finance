import {Routes, Route} from 'react-router-dom';
import {lazy, Suspense} from 'react';
import {Toaster} from 'sonner';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeProvider from '@/shared/providers/ThemeProvider';
import {PageSkeleton} from './components/PageSkeleton';
import TransactionOverviewPage from './pages/TransactionOverviewPage';

// Lazy load all page components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Income = lazy(() => import('@/pages/income/Income'));
const Expense = lazy(() => import('@/pages/Expense'));
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const SecuritySettings = lazy(() => import('./pages/SecuritySettings'));
const NotificationsSettings = lazy(
  () => import('./pages/NotificationsSettings'),
);
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expense />} />
            <Route
              path="/:transactionType/:id"
              element={<TransactionOverviewPage />}
            />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
