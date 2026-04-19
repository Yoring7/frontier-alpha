import { getHoldings, getTransactions, getSparklineForSymbol } from '@/lib/data'
import { getAllReports } from '@/lib/reports'
import { SECTOR_LABELS, SECTOR_ORDER, fmt, fmtSign, stripSuffix } from '@/lib/types'
import Header from '@/components/Header'
import StatStrip from '@/components/StatStrip'
import Sparkline from '@/components/Sparkline'
import Link from 'next/link'
import styles from './dashboard.module.css'

export const dynamic = 'force-static'

const BADGE_MAP: Record<string, string> = {
  ai_semiconductor: 'Core',
  space: 'Core',
  fintech_crypto: 'Tact',
  index_etf: 'Tact',
  fintech: 'Tact',
}

export default async function DashboardPage() {
  const holdings = getHoldings()
  const { transactions } = getTransactions()
  const latestReport = getAllReports().find(r => r.type === 'postmarket') ?? null

  // Build sparkline data per position
  const positionsWithSpark = holdings.positions.map(p => ({
    ...p,
    sparkline: getSparklineForSymbol(p.symbol),
  }))

  // Group by sector in display order
  const sectorOrder = SECTOR_ORDER.filter(s =>
    positionsWithSpark.some(p => p.sector === s)
  )
  // Add any sectors not in the predefined order
  const extraSectors = [...new Set(positionsWithSpark.map(p => p.sector))].filter(
    s => !SECTOR_ORDER.includes(s)
  )
  const orderedSectors = [...sectorOrder, ...extraSectors]

  const recentTrades = transactions.slice(0, 5)

  // Parse some bullets from latest report
  const reportBullets = latestReport
    ? latestReport.content
        .split('\n')
        .filter(l => l.startsWith('- '))
        .slice(0, 5)
        .map(l => l.replace(/^- \*\*[^*]+\*\*：?/, '').replace(/^- /, ''))
    : []

  return (
    <div className={styles.page}>
      <Header active="dashboard" date={holdings.last_updated} session="盘后" />
      <StatStrip summary={holdings.summary} />

      <div className={styles.main}>
        {/* Holdings Column */}
        <div className={styles.holdingsCol}>
          <div className={styles.colTop}>
            <div className={styles.colHeading}>
              <span className={styles.colTitle}>持仓 · {holdings.positions.length} Positions</span>
              <span className={styles.colSub}>总市值 ${fmt(holdings.summary.total_market_value, 0)}</span>
            </div>
            <div className={`${styles.hGrid} ${styles.colHeaders}`}>
              <div className={styles.ch}>代码</div>
              <div className={styles.ch}>名称</div>
              <div className={`${styles.ch} ${styles.r}`}>现价</div>
              <div className={`${styles.ch} ${styles.r}`}>今日</div>
              <div className={`${styles.ch} ${styles.r}`}>累计</div>
              <div className={`${styles.ch} ${styles.r}`}>仓位</div>
              <div className={`${styles.ch} ${styles.r}`}>走势</div>
            </div>
          </div>

          <div>
            {orderedSectors.map(sector => {
              const sectorPositions = positionsWithSpark.filter(p => p.sector === sector)
              if (sectorPositions.length === 0) return null
              const alloc = holdings.summary.sector_allocation[sector]
              const warn = !!alloc?.warning

              return (
                <div key={sector}>
                  <div className={styles.sectorHeader}>
                    <span className={styles.sectorName}>{SECTOR_LABELS[sector] ?? sector}</span>
                    {alloc && <span className={styles.sectorPct}>{alloc.pct}%</span>}
                    {warn && <span className={styles.sectorWarn}>⚠ 超配</span>}
                  </div>
                  {sectorPositions.map(pos => {
                    const ticker = stripSuffix(pos.symbol)
                    const isGain = pos.unrealized_pnl_pct >= 0
                    const weight = ((pos.market_value / holdings.summary.portfolio_value) * 100).toFixed(1)
                    const badge = BADGE_MAP[pos.sector] ?? 'Tact'

                    return (
                      <Link
                        key={pos.symbol}
                        href={`/position/${ticker}`}
                        className={styles.hRow}
                      >
                        <div className={styles.hGrid}>
                          <div className={styles.hTicker}>{ticker}</div>
                          <div className={styles.hNameWrap}>
                            <div className={styles.hName}>{pos.notes?.split('。')[0] ?? ticker}</div>
                            <span className={`${styles.hBadge} ${badge === 'Core' ? styles.badgeCore : styles.badgeTact}`}>
                              {badge}
                            </span>
                          </div>
                          <div className={styles.hPrice}>${fmt(pos.last_price)}</div>
                          <div className={`${styles.hChange} ${isGain ? styles.gain : styles.loss}`}>
                            {/* day change not directly in holdings, derive from notes if available */}
                            {isGain ? '+' : ''}{pos.unrealized_pnl_pct.toFixed(1)}%*
                          </div>
                          <div className={`${styles.hCumul} ${isGain ? styles.gain : styles.loss}`}>
                            {fmtSign(pos.unrealized_pnl_pct, 1)}%
                          </div>
                          <div className={styles.hWeight}>{weight}%</div>
                          <div className={styles.hSpark}>
                            <Sparkline prices={pos.sparkline} isGain={isGain} />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Sector Allocation */}
          <div className={styles.sbSection}>
            <div className={styles.sbLabel}>赛道配置</div>
            {Object.entries(holdings.summary.sector_allocation).map(([key, alloc]) => (
              <div key={key} className={styles.allocRow}>
                <div className={styles.allocName}>{SECTOR_LABELS[key] ?? key}</div>
                <div className={styles.allocTrack}>
                  <div
                    className={`${styles.allocFill} ${alloc.pct > 50 ? styles.warn : ''}`}
                    style={{ width: `${Math.min(alloc.pct, 100)}%` }}
                  />
                </div>
                <div className={styles.allocPct}>{alloc.pct}%</div>
              </div>
            ))}
          </div>

          {/* Latest report summary */}
          {latestReport && (
            <div className={styles.sbSection}>
              <div className={styles.sbLabel}>最新快报 · {latestReport.date}</div>
              {reportBullets.slice(0, 4).map((b, i) => (
                <div key={i} className={styles.reportItem}>
                  <span className={styles.reportText}>{b}</span>
                </div>
              ))}
              <Link href="/reports" className={styles.reportLink}>查看完整报告 →</Link>
            </div>
          )}

          {/* Recent trades */}
          <div className={styles.sbSection}>
            <div className={styles.sbLabel}>近期交易</div>
            {recentTrades.map(t => (
              <div key={t.id} className={styles.tradeRow}>
                <span className={`${styles.tradeAction} ${t.action === 'buy' ? styles.gain : styles.loss}`}>
                  {t.action === 'buy' ? 'BUY' : 'SELL'}
                </span>
                <span className={styles.tradeDetail}>
                  {stripSuffix(t.symbol)} {t.quantity}股 @${fmt(t.price)}
                </span>
                <span className={styles.tradeTime}>{t.date.slice(5)}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className={styles.sbQuote}>
            <div className={styles.qText}>&ldquo;We invest in the future before the present catches up.&rdquo;</div>
            <div className={styles.qAttr}>— Frontier Alpha</div>
          </div>
        </div>
      </div>
    </div>
  )
}
