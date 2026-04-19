import { fmt, fmtSign } from '@/lib/types'
import type { HoldingsFile } from '@/lib/types'
import styles from './StatStrip.module.css'

interface StatStripProps {
  summary: HoldingsFile['summary']
  marketTemp?: number
}

export default function StatStrip({ summary, marketTemp }: StatStripProps) {
  const cashPct = ((summary.cash_balance / summary.portfolio_value) * 100).toFixed(1)
  const isGain = summary.cumulative_pnl >= 0
  const isPnlGain = summary.total_unrealized_pnl >= 0

  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <div className={styles.statLabel}>Portfolio NAV</div>
        <div className={styles.statValue}>${fmt(summary.portfolio_value, 0)}</div>
        <div className={styles.statSub}>持仓 ${fmt(summary.total_market_value, 0)} + 现金 ${fmt(summary.cash_balance, 0)}</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statLabel}>累计收益</div>
        <div className={`${styles.statValue} ${isGain ? styles.gain : styles.loss}`}>
          {fmtSign(summary.cumulative_pnl_pct)}%
        </div>
        <div className={`${styles.statSub} ${isGain ? styles.gain : styles.loss}`}>
          {fmtSign(summary.cumulative_pnl, 0)} since inception
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statLabel}>未实现 P&L</div>
        <div className={`${styles.statValue} ${isPnlGain ? styles.gain : styles.loss}`}>
          {fmtSign(summary.total_unrealized_pnl, 0)}
        </div>
        <div className={`${styles.statSub} ${isPnlGain ? styles.gain : styles.loss}`}>
          {fmtSign(summary.total_unrealized_pnl_pct)}% on cost
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statLabel}>现金储备</div>
        <div className={styles.statValue}>${fmt(summary.cash_balance, 0)}</div>
        <div className={styles.statSub}>{cashPct}% 现金比例</div>
      </div>
      {marketTemp !== undefined && (
        <div className={styles.stat}>
          <div className={styles.statLabel}>市场温度</div>
          <div className={`${styles.statValue} ${styles.amber}`}>
            {marketTemp}<span className={styles.unit}>/100</span>
          </div>
          <div className={`${styles.statSub} ${styles.amber}`}>
            {marketTemp >= 70 ? '热度偏高 · 谨慎' : marketTemp >= 50 ? '舒适 · 温和' : '冷静 · 可加仓'}
          </div>
        </div>
      )}
    </div>
  )
}
