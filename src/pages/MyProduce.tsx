import { useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { NewListingForm } from '../components/NewListingForm';
import { StatusBadge } from '../components/StatusBadge';
import { NewListingInput, useMarket } from '../contexts/MarketContext';
import { inr } from '../utils/format';
import { getCrop, topModalForCrop } from '../utils/market';

export function MyProduce() {
  const { myListings, offers, addListing, withdrawListing, respondToOffer } = useMarket();
  const [composing, setComposing] = useState(false);

  const myOffers = offers.filter((offer) => myListings.some((listing) => listing.id === offer.listingId));
  const pending = myOffers.filter((offer) => offer.status === 'pending');
  const activeLots = myListings.filter((listing) => listing.status !== 'sold');
  const listedQuintals = activeLots.reduce((sum, listing) => sum + listing.quantityQuintal, 0);

  const handleCreate = (input: NewListingInput) => {
    const listing = addListing(input);
    setComposing(false);
    toast.success(`${getCrop(listing.cropId).name} lot published`, {
      description: `${listing.quantityQuintal} qtl at ${inr(listing.pricePerQuintal)}/qtl is now visible to buyers.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">My produce</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {activeLots.length} active lots · {listedQuintals} quintal listed · {pending.length} offers waiting on you
          </p>
        </div>
        {!composing &&
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600">
          
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            New lot
          </button>
        }
      </div>

      {composing && <NewListingForm onCreate={handleCreate} onCancel={() => setComposing(false)} />}

      <section aria-labelledby="offers-heading" className="rounded-2xl border border-line bg-surface shadow-card">
        <div className="border-b border-line px-6 py-5">
          <h2 id="offers-heading" className="font-display text-lg font-semibold tracking-tight">
            Offers from buyers
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Compare each offer against the mandi rate before you accept.
          </p>
        </div>

        {myOffers.length ?
        <ul className="divide-y divide-line">
            {myOffers.map((offer) => {
            const listing = myListings.find((item) => item.id === offer.listingId);
            const crop = listing ? getCrop(listing.cropId) : null;
            const reference = listing ? topModalForCrop(listing.cropId) : 0;
            const gap = offer.pricePerQuintal - reference;

            return (
              <li key={offer.id} className="flex flex-wrap items-start gap-x-6 gap-y-4 px-6 py-5">
                  <div className="min-w-[220px] flex-1">
                    <p className="flex items-center gap-2 text-[15px] font-semibold">
                      {offer.buyerName}
                      <span className="text-xs font-medium text-ink-muted">{offer.company}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">{offer.message}</p>
                    <p className="mt-2 text-xs text-ink-faint">
                      {crop?.name} · lot {offer.listingId} · {offer.placedAgo}
                    </p>
                  </div>

                  <div className="min-w-[150px]">
                    <p className="tnum text-lg font-semibold">
                      {inr(offer.pricePerQuintal)}
                      <span className="ml-1 text-xs font-medium text-ink-muted">/qtl</span>
                    </p>
                    <p className="tnum text-xs text-ink-muted">
                      {offer.quantityQuintal} qtl · {inr(offer.quantityQuintal * offer.pricePerQuintal)}
                    </p>
                    <p className={`tnum mt-1 text-xs font-semibold ${gap >= 0 ? 'text-rise' : 'text-fall'}`}>
                      {inr(Math.abs(gap))}/qtl {gap >= 0 ? 'above' : 'below'} top mandi rate
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    {offer.status === 'pending' ?
                  <>
                        <button
                      type="button"
                      onClick={() => {
                        respondToOffer(offer.id, 'declined');
                        toast(`Offer from ${offer.buyerName} declined`);
                      }}
                      className="rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-ink-muted transition-colors duration-150 ease-swift hover:text-ink">
                      
                          Decline
                        </button>
                        <button
                      type="button"
                      onClick={() => {
                        respondToOffer(offer.id, 'accepted');
                        toast.success(`Deal locked with ${offer.buyerName}`, {
                          description: `${offer.quantityQuintal} qtl at ${inr(offer.pricePerQuintal)}/qtl. Lot marked reserved.`
                        });
                      }}
                      className="rounded-xl bg-leaf-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600">
                      
                          Accept
                        </button>
                      </> :

                  <StatusBadge status={offer.status} />
                  }
                  </div>
                </li>);

          })}
          </ul> :

        <p className="px-6 py-10 text-center text-sm text-ink-muted">
            No offers yet. Lots priced close to the mandi rate usually get a response within a day.
          </p>
        }
      </section>

      <section aria-labelledby="lots-heading" className="rounded-2xl border border-line bg-surface shadow-card">
        <div className="border-b border-line px-6 py-5">
          <h2 id="lots-heading" className="font-display text-lg font-semibold tracking-tight">
            Your lots
          </h2>
        </div>

        {myListings.length ?
        <ul className="divide-y divide-line">
            {myListings.map((listing) => {
            const crop = getCrop(listing.cropId);
            return (
              <li key={listing.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
                  <img
                  src={listing.image}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover"
                  loading="lazy" />
                
                  <div className="min-w-[180px] flex-1">
                    <p className="text-[15px] font-semibold">
                      {crop.name} <span className="text-ink-faint">{crop.nameHi}</span>
                    </p>
                    <p className="tnum text-xs text-ink-muted">
                      Grade {listing.grade} · harvested {listing.harvestedOn} · lot {listing.id}
                    </p>
                  </div>
                  <p className="tnum min-w-[110px] text-sm font-semibold">
                    {inr(listing.pricePerQuintal)}
                    <span className="ml-1 text-xs font-medium text-ink-muted">/qtl</span>
                  </p>
                  <p className="tnum min-w-[90px] text-sm text-ink-muted">{listing.quantityQuintal} qtl</p>
                  <StatusBadge status={listing.status} />
                  <button
                  type="button"
                  onClick={() => {
                    withdrawListing(listing.id);
                    toast(`${crop.name} lot withdrawn`);
                  }}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink-muted transition-colors duration-150 ease-swift hover:text-fall">
                  
                    <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                    Withdraw
                  </button>
                </li>);

          })}
          </ul> :

        <p className="px-6 py-10 text-center text-sm text-ink-muted">
            You have no lots listed. Publish one to reach buyers directly.
          </p>
        }
      </section>
    </div>);

}