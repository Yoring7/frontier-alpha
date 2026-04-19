import { getHoldings, getTransactions, getSparklineForSymbol } from '@/lib/data'
import { SECTOR_LABELS, fmt, fmtSign, stripSuffix } from '@/lib/types'
import Header from '@/components/Header'
import Link from 'next/link'
import styles from './position.module.css'
import PositionChart from '@/components/PositionChart'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const holdings = getHoldings()
  return holdings.positions.map(p => ({
    symbol: stripSuffix(p.symbol),
  }))
}

interface Props { params: Promise<{ symbol: string }> }

export default async function PositionPage({ params }: Props) {
  const { symbol } = await params
  const holdings = getHoldings()
  const { transactions } = getTransactions()

  const pos = holdings.positions.find(p => stripSuffix(p.symbol) === symbol.toUpperCase())
  if (!pos) notFound()

  const fullSymbol = pos.symbol
  const sparkline = getSparklineForSymbol(fullSymbol)
  const isGain = pos.unrealized_pnl >= 0

  const posTransactions = transactions
    .filter(t => stripSuffix(t.symbol) === symbol.toUpperCase())
    .sort((a, b) => b.date.localeCompare(a.date))

  const allSymbols = holdings.positions.map(p => stripSuffix(p.symbol))

  return (
    <div className={styles.page}>
      <Header active="position" date={holdings.last_updated} />

      <div className={styles.main}>
        {/* Left: main content */}
        <div className={styles.leftCol}>
          {/* Hero */}
          <div className={styles.hero}>
            <div className={styles.heroTop}>
              <div>
                <div className={styles.sectorTag}>{SECTOR_LABELS[pos.sector] ?? pos.sector}</div>
                <h1 className={styles.ticker}>{symbol.toUpperCase()}</h1>
              </div>
              <div className={styles.priceBlock}>
                <div className={styles.price}>${fmt(pos.last_price)}</div>
                <div className={`${styles.pnlPct} ${isGain ? styles.gain : styles.loss}`}>
                  {fmtSign(pos.unrealized_pnl_pct, 2)}% 累计
                </div>
              </div>
            </div>

            {/* Mini chart */}
            {sparkline.length > 1 && (
              <div className={styles.chartWrap}>
                <PositionChart prices={sparkline} isGain={isGain} />
              </div>
            )}
          </div>

          {/* P&L stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>持仓数量</div>
              <div className={styles.statVal}>{pos.quantity} 股</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>市值</div>
              <div className={styles.statVal}>${fmt(pos.market_value, 0)}</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>未实现 P&L</div>
              <div className={`${styles.statVal} ${isGain ? styles.gain : styles.loss}`}>
                {fmtSign(pos.unrealized_pnl, 0)}
              </div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>仓位占比</div>
              <div className={styles.statVal}>
                {((pos.market_value / holdings.summary.portfolio_value) * 100).toFixed(1)}%
              </div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>均价</div>
              <div className={styles.statVal}>${fmt(pos.avg_cost)}</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>建仓日期</div>
              <div className={styles.statVal}>{pos.entry_date}</div>
            </div>
          </div>

          {/* Notes / thesis */}
          {pos.notes && (
            <div className={styles.notesSection}>
              <div className={styles.notesLabel}>最新分析</div>
              <p className={styles.notesText}>{pos.notes}</p>
            </div>
          )}

          {/* Transaction history */}
          {posTransactions.length > 0 && (
            <div className={styles.txSection}>
              <div className={styles.txLabel}>交易记录</div>
              {posTransactions.map(t => (
                <div key={t.id} className={styles.txRow}>
                  <span className={`${styles.txAction} ${t.action === 'buy' ? styles.gain : styles.loss}`}>
                    {t.action === 'buy' ? 'BUY' : 'SELL'}
                  </span>
                  <span className={styles.txDetail}>{t.quantity} 股 @${fmt(t.price)}</span>
                  <span className={styles.txAmt}>${fmt(t.amount, 0)}</span>
                  <span className={styles.txDate}>{t.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <div className={styles.rightCol}>
          {/* Cost analysis */}
          <div className={styles.sbSection}>
            <div className={styles.sbLabel}>成本分析</div>
            <div className={styles.costRow}>
              <span className={styles.costKey}>持仓成本</span>
              <span className={styles.costVal}>${fmt(pos.cost_basis, 0)}</span>
            </div>
            <div className={styles.costRow}>
              <span className={styles.costKey}>当前市值</span>
              <span className={styles.costVal}>${fmt(pos.market_value, 0)}</span>
            </div>
            <div className={styles.costRow}>
              <span className={styles.costKey}>未实现 P&L</span>
              <span className={`${styles.costVal} ${isGain ? styles.gain : styles.loss}`}>
                {fmtSign(pos.unrealized_pnl, 0)} ({fmtSign(pos.unrealized_pnl_pct, 1)}%)
              </span>
            </div>
          </div>

          {/* Symbol switcher */}
          <div className={styles.sbSection}>
            <div className={styles.sbLabel}>切换持仓</div>
            <div className={styles.symbolGrid}>
              {allSymbols.map(s => (
                <Link
                  key={s}
                  href={`/position/${s}`}
                  className={`${styles.symbolChip} ${s === symbol.toUpperCase() ? styles.symbolActive : ''}`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Back */}
          <div className={styles.sbSection}>
            <Link href="/dashboard" className={styles.backLink}>← 返回持仓总览</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
