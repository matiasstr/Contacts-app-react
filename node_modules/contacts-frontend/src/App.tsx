import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import Button from './shared/components/Button';
import { useSignalValue } from './shared/hooks/useSignalValue';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { logout } from './features/auth/services/auth.api';
import { authTokenSignal, authUserSignal } from './features/auth/state/auth.signals';
import ContactDetailsPage from './features/contacts/pages/ContactDetailsPage';
import ContactsPage from './features/contacts/pages/ContactsPage';
import CreateContactPage from './features/contacts/pages/CreateContactPage';
import EditContactPage from './features/contacts/pages/EditContactPage';
import MessagesPage from './features/messages/pages/MessagesPage';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const location = useLocation();
  const token = useSignalValue(authTokenSignal);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function PublicRoute({ children }: { children: ReactElement }) {
  const token = useSignalValue(authTokenSignal);

  if (token) {
    return <Navigate to="/contacts" replace />;
  }

  return children;
}

function AppShell() {
  const navigate = useNavigate();
  const user = useSignalValue(authUserSignal);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-blue-100 text-brand' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xl font-black text-ink">Contacts App</p>
            <p className="text-sm text-muted">Signed in as {user?.displayName || user?.email || 'Current user'}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex rounded-md bg-slate-50 p-1">
              <NavLink className={linkClass} to="/contacts">
                Contacts
              </NavLink>
              <NavLink className={linkClass} to="/messages">
                Messages
              </NavLink>
            </nav>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 rounded-md border border-line bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-muted">Current profile</p>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-ink">{user?.displayName || 'Unnamed user'}</p>
              <p className="text-sm text-muted">{user?.email || 'No email available'}</p>
            </div>
            <p className="break-all rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">User ID: {user?.id || 'unknown'}</p>
          </div>
        </div>

        <Routes>
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/new" element={<CreateContactPage />} />
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          <Route path="/contacts/:id/edit" element={<EditContactPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="*" element={<Navigate to="/contacts" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
