import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useMarket } from '../contexts/MarketContext';
import { inr } from '../utils/format';
import { getCrop } from '../utils/market';

export function Purchases() {
  const { orders, offers } = useMarket();
  const myOffers = offers.filter((offer) => offer.buyerName === 'You');
  const spend = orders.reduce((sum, order) => sum + order.quantityQuintal * order.pricePerQuintal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">My purchases</h1>
          <p className="tnum mt-1 text-sm text-ink-muted">
            {orders.length} orders · {inr(spend)} committed · {myOffers.length} offers pending with farmers
          </p>
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600">
          
          Source more produce
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <section aria-labelledby="orders-heading" className="rounded-2xl border border-line bg-surface shadow-card">
        <div className="border-b border-line px-6 py-5">
          <h2 id="orders-heading" className="font-display text-lg font-semibold tracking-tight">
            Orders
          </h2>
        </div>

        {orders.length ?
        <ul className="divide-y divide-line">
            {orders.map((order) => {
            const crop = getCrop(order.cropId);
            return (
              <li key={order.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
                  <div className="min-w-[200px] flex-1">
                    <p className="text-[15px] font-semibold">
                      {crop.name} <span className="text-ink-faint">{crop.nameHi}</span>
                    </p>
                    <p className="text-xs text-ink-muted">
                      {order.farmerName} · lot {order.listingId} · placed {order.placedAgo}
                    </p>
                  </div>
                  <p className="tnum min-w-[110px] text-sm text-ink-muted">{order.quantityQuintal} qtl</p>
                  <p className="tnum min-w-[110px] text-sm font-semibold">
                    {inr(order.pricePerQuintal)}
                    <span className="ml-1 text-xs font-medium text-ink-muted">/qtl</span>
                  </p>
                  <p className="tnum min-w-[120px] text-sm font-semibold">
                    {inr(order.quantityQuintal * order.pricePerQuintal)}
                  </p>
                  <span className="ml-auto">
                    <StatusBadge status={order.status} />
                  </span>
                </li>);

          })}
          </ul> :

        <p className="px-6 py-10 text-center text-sm text-ink-muted">
            No orders yet. Browse farmer lots to place your first direct purchase.
          </p>
        }
      </section>

      {myOffers.length > 0 &&
      <section aria-labelledby="sent-heading" className="rounded-2xl border border-line bg-surface shadow-card">
          <div className="border-b border-line px-6 py-5">
            <h2 id="sent-heading" className="font-display text-lg font-semibold tracking-tight">
              Offers you sent
            </h2>
          </div>
          <ul className="divide-y divide-line">
            {myOffers.map((offer) =>
          <li key={offer.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
                <p className="min-w-[180px] flex-1 text-sm font-semibold">Lot {offer.listingId}</p>
                <p className="tnum min-w-[110px] text-sm text-ink-muted">{offer.quantityQuintal} qtl</p>
                <p className="tnum min-w-[110px] text-sm font-semibold">{inr(offer.pricePerQuintal)}/qtl</p>
                <p className="min-w-[100px] text-xs text-ink-faint">{offer.placedAgo}</p>
                <span className="ml-auto">
                  <StatusBadge status={offer.status} />
                </span>
              </li>
          )}
          </ul>
        </section>
      }
    </div>);

}