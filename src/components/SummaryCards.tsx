import type { ReconciliationSummary } from '../env';

interface SummaryCardsProps {
  summary: ReconciliationSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { label: 'Nuevos', value: summary.new, icon: '✨', bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Modificados', value: summary.modified, icon: '📝', bgColor: 'bg-amber-50 text-amber-700 border-amber-100' },
    { label: 'Agotados', value: summary.outOfStock, icon: '🛑', bgColor: 'bg-rose-50 text-rose-700 border-rose-100' },
    { label: 'Sin Cambios', value: summary.unchanged, icon: '✅', bgColor: 'bg-gray-50 text-gray-600 border-gray-100' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div 
          key={card.label} 
          className={`${card.bgColor} p-3 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] flex flex-col justify-between`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xl p-1.5 bg-white/80 rounded-xl shadow-xs select-none">
              {card.icon}
            </span>
            <span className="text-2xl font-black tracking-tight">{card.value}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{card.label}</p>
        </div>
      ))}
    </div>
  );
}