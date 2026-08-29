const tones: Record<string, string> = {
  available: 'bg-leaf-50 text-leaf-700 border-leaf-200',
  reserved: 'bg-clay-50 text-clay-700 border-clay-100',
  sold: 'bg-canvas text-ink-muted border-line-strong',
  placed: 'bg-clay-50 text-clay-700 border-clay-100',
  'in-transit': 'bg-leaf-50 text-leaf-700 border-leaf-200',
  delivered: 'bg-canvas text-ink-muted border-line-strong',
  pending: 'bg-clay-50 text-clay-700 border-clay-100',
  accepted: 'bg-leaf-50 text-leaf-700 border-leaf-200',
  declined: 'bg-canvas text-ink-muted border-line-strong'
};

const labels: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  placed: 'Order placed',
  'in-transit': 'In transit',
  delivered: 'Delivered',
  pending: 'Awaiting you',
  accepted: 'Accepted',
  declined: 'Declined'
};

export function StatusBadge({ status }: {status: string;}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
      tones[status] ?? tones.sold}`
      }>
      
      {labels[status] ?? status}
    </span>);

}