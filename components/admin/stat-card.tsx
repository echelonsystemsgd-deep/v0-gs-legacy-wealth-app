interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  accentColor?: 'gold' | 'green' | 'blue' | 'rose'
}

const accentMap = {
  gold: {
    icon: 'bg-gold/10 border-gold/20 text-gold',
    value: 'text-gold',
  },
  green: {
    icon: 'bg-green-500/10 border-green-500/20 text-green-400',
    value: 'text-green-400',
  },
  blue: {
    icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    value: 'text-blue-400',
  },
  rose: {
    icon: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    value: 'text-rose-400',
  },
}

export function StatCard({ label, value, icon, trend, trendUp, accentColor = 'gold' }: StatCardProps) {
  const accent = accentMap[accentColor]

  return (
    <div className="glass rounded-2xl p-5 border border-gold/10 hover:border-gold/20 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className={`font-serif text-3xl font-bold ${accent.value} transition-colors`}>{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trendUp ? 'text-green-400' : 'text-muted-foreground'}`}>
              {trendUp ? '↑' : '→'} {trend}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300 ${accent.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
