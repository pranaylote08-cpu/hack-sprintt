import { Link } from 'react-router-dom';
import { ArrowRightIcon, HandshakeIcon, UsersIcon } from 'lucide-react';
import { inr } from '../utils/format';

interface DirectSaleCardProps {
  cropName: string;
  bestNet: number;
  buyerAsk: number | null;
  activeBuyers: number;
  role: 'farmer' | 'buyer';
}

export function DirectSaleCard({ cropName, bestNet, buyerAsk, activeBuyers, role }: DirectSaleCardProps) {
  const premium = buyerAsk ? buyerAsk - bestNet : null;

  return (
    <section className="flex flex-col rounded-2xl border border-line bg-leaf-900 p-6 text-white shadow-card" aria-labelledby="direct-heading">
      <p className="flex items-center gap-2 text-sm font-medium text-leaf-200">
        <HandshakeIcon className="h-4 w-4" aria-hidden="true" />
        Sell direct instead
      </p>
      <h2 id="direct-heading" className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight">
        {buyerAsk ?
        `Buyers here are settling ${cropName} at ${inr(buyerAsk)}/qtl` :
        `No direct ${cropName} deals on the board yet`}
      </h2>

      {premium !== null &&
      <p className="mt-3 text-sm text-leaf-100">
          {premium > 0 ?
        <>
              That is <span className="tnum font-semibold text-white">{inr(premium)}/qtl above</span> the best mandi
              take-home, with no commission cut and no waiting in the yard.
            </> :

        <>
              Mandi take-home is currently{' '}
              <span className="tnum font-semibold text-white">{inr(Math.abs(premium))}/qtl better</span> — worth
              comparing before you commit a lot.
            </>
        }
        </p>
      }

      <p className="mt-4 flex items-center gap-2 text-sm text-leaf-100">
        <UsersIcon className="h-4 w-4" aria-hidden="true" />
        <span className="tnum font-semibold text-white">{activeBuyers}</span> verified buyers sourcing this week
      </p>

      <Link
        to={role === 'farmer' ? '/produce' : '/marketplace'}
        className="mt-auto inline-flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-leaf-900 transition-colors duration-150 ease-swift hover:bg-leaf-50">
        
        {role === 'farmer' ? 'List your produce' : 'Browse farmer lots'}
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>);

}