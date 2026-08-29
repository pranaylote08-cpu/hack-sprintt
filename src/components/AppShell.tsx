import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { MapPinIcon, RadioIcon, SproutIcon } from 'lucide-react';
import { priceUpdatedAt } from '../data/prices';
import { currentFarmer } from '../data/listings';
import { Role } from '../contexts/MarketContext';

interface AppShellProps {
  role: Role;
  children: ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  const links =
    role === 'farmer'
      ? [
        { to: '/', label: 'Mandi prices' },
        { to: '/produce', label: 'My produce' },
        { to: '/marketplace', label: 'Buyers' }
      ]
      : [
        { to: '/marketplace', label: 'Buy produce' },
        { to: '/', label: 'Mandi prices' },
        { to: '/purchases', label: 'My purchases' }
      ];

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-leaf-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-600 text-white shadow-sm">
                <SproutIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              KrishiSetu
            </NavLink>

            <nav className="hidden items-center gap-1 sm:flex" aria-label="Main Navigation">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-swift ${isActive ? 'bg-leaf-50 text-leaf-700 font-semibold' : 'text-ink-muted hover:text-ink hover:bg-canvas'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-ink-muted sm:inline-flex">
              <RadioIcon className="h-3 w-3 text-leaf-500 animate-pulse" aria-hidden="true" />
              Live rates: {priceUpdatedAt}
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold shadow-sm">
              <MapPinIcon className="h-3.5 w-3.5 text-clay-500" aria-hidden="true" />
              <span>{currentFarmer.village}, {currentFarmer.district}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-line bg-surface py-6 text-center text-xs text-ink-faint">
        KrishiSetu · Transparent Mandi Realisations &amp; Farm-Gate Marketplace
      </footer>
    </div>
  );
}