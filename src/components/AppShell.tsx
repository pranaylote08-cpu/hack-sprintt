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
  role === 'farmer' ?
  [
  { to: '/', label: 'Mandi prices' },
  { to: '/produce', label: 'My produce' },
  { to: '/marketplace', label: 'Buyers' }] :

  [
  { to: '/marketplace', label: 'Buy produce' },
  { to: '/', label: 'Mandi prices' },
  { to: '/purchases', label: 'My purchases' }];


  return (
    <div className="min-h-screen w-full bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center gap-8 px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf-700 text-white">
              <SproutIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-[19px] font-semibold tracking-tight">Mandi Setu</span>
          </div>

          <nav aria-label="Main" className="flex items-center gap-1">
            {links.map((link) =>
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-swift ${
              isActive ? 'bg-leaf-50 text-leaf-700' : 'text-ink-muted hover:bg-white hover:text-ink'}`

              }>
              
                {link.label}
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-5">
            <span className="hidden items-center gap-1.5 text-xs font-medium text-ink-muted lg:inline-flex">
              <RadioIcon className="h-3.5 w-3.5 text-leaf-600" aria-hidden="true" />
              Live rates · {priceUpdatedAt}
            </span>
            <span className="hidden items-center gap-1.5 text-xs font-medium text-ink-muted md:inline-flex">
              <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {currentFarmer.village}, {currentFarmer.district}
            </span>
            <div className="flex items-center gap-2.5 border-l border-line pl-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay-100 text-xs font-semibold text-clay-700">
                {role === 'farmer' ? 'RP' : 'GS'}
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-semibold">{role === 'farmer' ? currentFarmer.name : 'Greenline Sourcing'}</span>
                <span className="block text-[11px] uppercase tracking-wide text-ink-faint">
                  {role === 'farmer' ? 'Farmer' : 'Buyer'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-6 py-8">{children}</main>

      <footer className="mx-auto w-full max-w-[1320px] px-6 pb-10 pt-2">
        <p className="border-t border-line pt-4 text-xs text-ink-faint">
          Rates sourced from APMC yard reports and verified commission agents. Prices are per quintal and change through
          the trading day.
        </p>
      </footer>
    </div>);

}