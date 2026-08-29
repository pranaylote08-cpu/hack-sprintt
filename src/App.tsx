import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from './components/AppShell';
import { MarketProvider, Role } from './contexts/MarketContext';
import { Marketplace } from './pages/Marketplace';
import { MyProduce } from './pages/MyProduce';
import { Prices } from './pages/Prices';
import { Purchases } from './pages/Purchases';

interface AppProps {
  /** Whose side of the market is being viewed. */
  role?: Role;
}

export function App({ role = 'farmer' }: AppProps) {
  return (
    <BrowserRouter>
      <MarketProvider role={role}>
        <AppShell role={role}>
          <Routes>
            <Route path="/" element={<Prices />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route
              path="/produce"
              element={role === 'farmer' ? <MyProduce /> : <Navigate to="/purchases" replace />}
            />
            <Route
              path="/purchases"
              element={role === 'buyer' ? <Purchases /> : <Navigate to="/produce" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
        <Toaster position="bottom-right" richColors closeButton />
      </MarketProvider>
    </BrowserRouter>
  );
}