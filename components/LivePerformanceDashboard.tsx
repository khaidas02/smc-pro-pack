import { useState, useEffect } from 'react'
import { format } from 'date-fns'

// ── Types ────────────────────────────────────────────────────────────────
type Trade = {
  symbol: string
  side: 'buy' | 'sell'
  type: string
  qty: number
  price: number
  filled_at: string
  status: string
}

type TrackRecord = {
  updatedAt: string
  account: {
    equity: number
    buyingPower: number
    cash: number
    openPL: number
    openPositions: number
  }
  performance: {
    winRate: number
    wins: number
    losses: number
    totalTrades: number
  }
  trades: Trade[]
}

// ── Data source ──────────────────────────────────────────────────────────
const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/khaidas02/smc-pro-pack/main/public/live_track_record.json'

// ── Helpers ──────────────────────────────────────────────────────────────
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// ── Dashboard Component ──────────────────────────────────────────────────
export default function LivePerformanceDashboard() {
  const [data, setData] = useState<TrackRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchMetrics = async () => {
      try {
        const res = await fetch(GITHUB_RAW_URL, { cache: 'no-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: TrackRecord = await res.json()
        if (!cancelled) setData(json)
      } catch (e: any) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchMetrics()
    // Poll every 60 seconds
    const interval = setInterval(fetchMetrics, 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // ── Equity curve data points (simulate from openPL + cash) ────────────
  const equityPoints = data
    ? [
        { label: 'Start', value: 100000 },
        { label: 'Current', value: data.account.equity },
      ]
    : []

  const maxEquity = equityPoints.length
    ? Math.max(...equityPoints.map((p) => p.value))
    : 100000
  const minEquity = equityPoints.length
    ? Math.min(...equityPoints.map((p) => p.value))
    : 100000
  const equityRange = maxEquity - minEquity || 1

  // ── Price formatting ──────────────────────────────────────────────────
  const fmtUSD = (n: number) =>
    '$' +
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // ── Loading / Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="text-sm text-red-400">⚠ Live data unavailable — {error}</p>
        <p className="text-xs text-muted mt-1">
          Run <code className="bg-black/20 px-1 rounded">node sync_metrics.js --push</code> to publish first data
        </p>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="rounded-xl border border-purple-500/20 p-8 text-center animate-pulse">
        <div className="h-6 w-48 bg-purple-500/10 rounded mx-auto mb-4" />
        <div className="h-4 w-64 bg-purple-500/10 rounded mx-auto" />
      </div>
    )
  }

  // ── Win rate badge ────────────────────────────────────────────────────
  const winRate = data.performance.winRate
  const winColor =
    winRate >= 65 ? 'text-emerald-400' : winRate >= 55 ? 'text-teal-400' : winRate >= 45 ? 'text-amber-400' : 'text-red-400'
  const winBg =
    winRate >= 65
      ? 'border-emerald-500/40 bg-emerald-500/10'
      : winRate >= 55
        ? 'border-teal-500/40 bg-teal-500/10'
        : winRate >= 45
          ? 'border-amber-500/40 bg-amber-500/10'
          : 'border-red-500/40 bg-red-500/10'

  const strategyVerified = winRate > 55

  return (
    <div className="space-y-6">
      {/* ────────── Strategy Verified Banner ────────── */}
      {strategyVerified && (
        <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 p-5 text-center animate-fade-in">
          <div className="text-2xl mb-1">✅</div>
          <h3 className="text-lg font-bold text-emerald-300">
            Strategy Verified
          </h3>
          <p className="text-sm text-secondary mt-1 max-w-lg mx-auto">
            Live win rate of{' '}
            <span className={cn('font-mono font-semibold', winColor)}>
              {winRate.toFixed(1)}%
            </span>{' '}
            across {data.performance.totalTrades} recorded trades.
          </p>
          <div className="mt-3 inline-block">
            <a
              href="#purchase"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
            >
              🔓 Unlock the source code below
            </a>
          </div>
        </div>
      )}

      {/* ────────── Stats Row ────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Equity */}
        <div className="rounded-xl border border-purple-500/20 p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Equity</p>
          <p className="text-2xl font-bold font-mono">{fmtUSD(data.account.equity)}</p>
          <p className="text-xs text-muted mt-1">
            {data.account.openPL >= 0 ? '+' : ''}{fmtUSD(data.account.openPL)} unrealized
          </p>
        </div>

        {/* Win Rate */}
        <div className={cn('rounded-xl border p-4', winBg)}>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Win Rate</p>
          <p className={cn('text-2xl font-bold font-mono', winColor)}>
            {winRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted mt-1">
            {data.performance.wins}W / {data.performance.losses}L
          </p>
        </div>

        {/* Open Positions */}
        <div className="rounded-xl border border-blue-500/20 p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Open Positions</p>
          <p className="text-2xl font-bold font-mono">{data.account.openPositions}</p>
          <p className="text-xs text-muted mt-1">Currently active</p>
        </div>

        {/* Buying Power */}
        <div className="rounded-xl border border-cyan-500/20 p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Buying Power</p>
          <p className="text-2xl font-bold font-mono">{fmtUSD(data.account.buyingPower)}</p>
          <p className="text-xs text-muted mt-1">
            {fmtUSD(data.account.cash)} cash
          </p>
        </div>
      </div>

      {/* ────────── Equity Curve ────────── */}
      <div className="rounded-xl border border-purple-500/20 p-5">
        <h3 className="text-sm font-semibold mb-4">Equity Curve</h3>
        <div className="relative h-32 flex items-end gap-1">
          {equityPoints.map((pt, i) => {
            const heightPct = ((pt.value - minEquity) / equityRange) * 100
            const isFirst = i === 0
            const isLast = i === equityPoints.length - 1
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end relative group"
              >
                {/* Bar */}
                <div
                  className={cn(
                    'w-full rounded-t transition-all duration-700',
                    isLast ? 'bg-gradient-to-t from-purple-600 to-purple-400' : 'bg-purple-600/40'
                  )}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />
                {/* Label */}
                <div className="text-[10px] text-muted mt-1">{pt.label}</div>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {fmtUSD(pt.value)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ────────── Trade Ledger ────────── */}
      <div className="rounded-xl border border-purple-500/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent Trades</h3>
          <span className="text-[10px] text-muted">
            Last {data.trades.length} closed
          </span>
        </div>

        {data.trades.length === 0 ? (
          <p className="text-muted text-sm text-center py-6">
            No closed trades yet. Start trading to populate the ledger.
          </p>
        ) : (
          <div className="space-y-1.5">
            {/* Header */}
            <div className="grid grid-cols-5 gap-2 text-[10px] text-muted uppercase tracking-wider px-2 pb-1">
              <span>Symbol</span>
              <span>Side</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Date</span>
            </div>
            {/* Rows */}
            {data.trades.map((t, i) => {
              const sideColor = t.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'
              const date = t.filled_at
                ? format(new Date(t.filled_at), 'MMM dd')
                : '—'
              return (
                <div
                  key={i}
                  className={cn(
                    'grid grid-cols-5 gap-2 text-sm px-2 py-1.5 rounded transition-colors',
                    i % 2 === 0 ? 'bg-white/[0.02]' : ''
                  )}
                >
                  <span className="font-mono font-semibold">{t.symbol}</span>
                  <span className={cn('font-mono uppercase text-xs', sideColor)}>
                    {t.side}
                  </span>
                  <span className="font-mono">{t.qty}</span>
                  <span className="font-mono text-muted">
                    {t.price > 0 ? fmtUSD(t.price) : '—'}
                  </span>
                  <span className="text-muted text-xs flex items-center">{date}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ────────── Updated timestamp ────────── */}
      <p className="text-[10px] text-muted text-center">
        Last synced: {format(new Date(data.updatedAt), 'MMM dd yyyy HH:mm')} UTC
        {' · '}
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </p>
    </div>
  )
}