import fs from 'fs'
import path from 'path'
import type { HoldingsFile, Snapshot, TransactionsFile, WatchlistFile, ScoutFile } from './types'

const ROOT = process.cwd()

function readJSON<T>(relPath: string): T {
  const full = path.join(ROOT, relPath)
  return JSON.parse(fs.readFileSync(full, 'utf-8')) as T
}

export function getHoldings(): HoldingsFile {
  return readJSON<HoldingsFile>('portfolio/sim_holdings.json')
}

export function getTransactions(): TransactionsFile {
  const data = readJSON<TransactionsFile>('portfolio/sim_transactions.json')
  return {
    transactions: data.transactions.filter(t => t.quantity > 0),
  }
}

export function getWatchlist(): WatchlistFile {
  return readJSON<WatchlistFile>('strategies/watchlist.json')
}

export function getScoutPicks(): ScoutFile {
  return readJSON<ScoutFile>('strategies/scout-picks.json')
}

export function getSnapshots(): Snapshot[] {
  const dir = path.join(ROOT, 'portfolio/snapshots/sim')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Snapshot)
}

export function getSparklineForSymbol(symbol: string): number[] {
  const snapshots = getSnapshots().slice(-10)
  return snapshots
    .map(snap => {
      const pos = snap.positions.find(p => p.symbol === symbol)
      return pos?.close_price ?? null
    })
    .filter((v): v is number => v !== null)
}

export function getLatestSnapshot(): Snapshot | null {
  const snaps = getSnapshots()
  return snaps.length > 0 ? snaps[snaps.length - 1] : null
}

export function getBestSession(): { date: string; pct: number } | null {
  const snaps = getSnapshots()
  if (snaps.length < 2) return null
  let best: { date: string; pct: number } | null = null
  for (let i = 1; i < snaps.length; i++) {
    const prev = snaps[i - 1].summary.portfolio_value
    const curr = snaps[i].summary.portfolio_value
    const pct = (curr - prev) / prev * 100
    if (best === null || pct > best.pct) {
      best = { date: snaps[i].snapshot_date, pct }
    }
  }
  return best
}

export function getPerformanceSeries(): Array<{ date: string; nav: number; navPct: number }> {
  const snaps = getSnapshots()
  if (snaps.length === 0) return []
  return snaps.map(s => ({
    date: s.snapshot_date,
    nav: s.summary.portfolio_value,
    navPct: s.summary.cumulative_pnl_pct,
  }))
}
