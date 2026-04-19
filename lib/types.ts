export interface Position {
  symbol: string
  quantity: number
  avg_cost: number
  cost_basis: number
  last_price: number
  market_value: number
  unrealized_pnl: number
  unrealized_pnl_pct: number
  currency?: string
  sector: string
  entry_date: string
  entry_session?: string
  notes?: string
}

export interface SectorAllocation {
  value: number
  pct: number
  warning?: string
}

export interface HoldingsFile {
  schema_version: string
  last_updated: string
  last_updated_source?: string
  base_currency: string
  account_type: string
  initial_capital: number
  cash_balance: number
  positions: Position[]
  pending_orders: unknown[]
  summary: {
    total_market_value: number
    total_cost_basis: number
    total_unrealized_pnl: number
    total_unrealized_pnl_pct: number
    cash_balance: number
    portfolio_value: number
    cumulative_pnl: number
    cumulative_pnl_pct: number
    sector_allocation: Record<string, SectorAllocation>
    note?: string
  }
}

export interface SnapshotPosition {
  symbol: string
  quantity: number
  avg_cost: number
  cost_basis?: number
  close_price: number
  market_value: number
  unrealized_pnl: number
  unrealized_pnl_pct: number
  pct_change_day?: number
  sector: string
}

export interface Snapshot {
  snapshot_date: string
  trading_date_us?: string
  session?: string
  initial_capital: number
  cash_balance: number
  positions: SnapshotPosition[]
  summary: {
    total_market_value: number
    portfolio_value: number
    cumulative_pnl_pct: number
  }
  reference_prices?: Record<string, number>
  sector_allocation?: Record<string, number>
  notes?: string
}

export interface Transaction {
  id: string
  date: string
  time?: string
  session?: string
  action: 'buy' | 'sell'
  symbol: string
  quantity: number
  price: number
  amount: number
  fees?: number
  currency?: string
  order_id?: string
  reasoning?: string
  critic_score?: number
  bull_score?: number
  debate_summary?: string
  status?: string
}

export interface TransactionsFile {
  transactions: Transaction[]
}

export interface WatchlistSector {
  thesis: string
  symbols: string[]
  notes?: string
}

export interface WatchlistFile {
  last_updated: string
  sectors: Record<string, WatchlistSector>
  removed?: Array<{ symbol: string; removed_date?: string; reason?: string }>
  all_symbols?: string[]
}

export interface ScoutPick {
  rank?: number
  symbol: string
  name: string
  current_price?: number
  prev_price?: number
  gain_since_pick?: string
  sector: string
  thesis: string
  catalysts: string[]
  risk?: string
  conviction: 'high' | 'medium' | 'speculative'
  suggested_action?: string
  position_sizing?: string
  source?: string
}

export interface ScoutFile {
  last_updated: string
  market_snapshot?: { date: string; notes: string }
  picks: ScoutPick[]
  attention_flags?: Array<{ symbol: string; flag: string; urgency?: string }>
}

export type ReportType = 'postmarket' | 'premarket' | 'midsession' | 'weekly' | 'scout'

export interface ReportMeta {
  filename: string
  date: string
  type: ReportType
  label: string
  content: string
  slug: string
}

export const SECTOR_LABELS: Record<string, string> = {
  ai_semiconductor: 'AI 基础设施',
  space:            '太空航天',
  fintech_crypto:   '金融科技',
  index_etf:        '杠杆 ETF',
  fintech:          '金融科技',
}

export const SECTOR_ORDER = ['ai_semiconductor', 'space', 'index_etf', 'fintech_crypto', 'fintech']

export const REPORT_TYPE_LABELS: Record<string, string> = {
  postmarket:  '盘后复盘',
  premarket:   '盘前计划',
  midsession:  '盘中快报',
  weekly:      '周度研究',
  scout:       'Scout 侦察',
}

export function stripSuffix(symbol: string): string {
  return symbol.replace(/\.US$/, '')
}

export function fmt(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function fmtSign(n: number, decimals = 2): string {
  const sign = n >= 0 ? '+' : ''
  return sign + fmt(n, decimals)
}
