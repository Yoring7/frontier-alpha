import { getHoldings, getPerformanceSeries } from '@/lib/data'
import { getLatestPostmarketReport } from '@/lib/reports'
import { fmt, fmtSign } from '@/lib/types'
import Header from '@/components/Header'
import Link from 'next/link'
import PerformanceChart from '@/components/PerformanceChart'
import styles from './home.module.css'

export const dynamic = 'force-static'

export default async function HomePage() {
  const holdings = getHoldings()
  const series = getPerformanceSeries()
  const latestReport = getLatestPostmarketReport()
  const s = holdings.summary
  const isGain = s.cumulative_pnl >= 0

  return (
    <div className={styles.page}>
      <Header active="overview" date={holdings.last_updated} session="盘后" />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLabel}>Structured Conviction Fund · 模拟账户</div>
          <div className={styles.heroBrand}>
            <span className={styles.brandF}>Frontier</span>
            <span className={styles.brandA}>Alpha</span>
          </div>
          <div className={styles.heroTagline}>
            前沿科技的信仰者 — AI、太空、金融科技。<br />
            我们投资的不是股票，是文明的方向。
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroNav}>
            {[
              { href: '/dashboard', label: '持仓总览 →' },
              { href: '/reports',   label: '报告存档 →' },
              { href: '/scout',     label: 'Scout 侦察 →' },
            ].map(n => (
              <Link key={n.href} href={n.href} className={styles.heroNavLink}>{n.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Portfolio NAV</div>
          <div className={styles.statValue}>${fmt(s.portfolio_value, 0)}</div>
          <div className={styles.statSub}>初始 $100,000</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>累计收益</div>
          <div className={`${styles.statValue} ${isGain ? styles.gain : styles.loss}`}>
            {fmtSign(s.cumulative_pnl_pct)}%
          </div>
          <div className={`${styles.statSub} ${isGain ? styles.gain : styles.loss}`}>
            {fmtSign(s.cumulative_pnl, 0)} USD
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>持仓数</div>
          <div className={styles.statValue}>{holdings.positions.length}</div>
          <div className={styles.statSub}>
            现金 {((s.cash_balance / s.portfolio_value) * 100).toFixed(1)}%
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>最后更新</div>
          <div className={styles.statValue} style={{ fontSize: '1.1rem' }}>{holdings.last_updated}</div>
          <div className={styles.statSub}>每日盘后更新</div>
        </div>
      </div>

      {/* Chart + nav grid */}
      <div className={styles.contentRow}>
        {/* Performance chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartLabel}>组合净值走势</div>
          <PerformanceChart series={series} />
        </div>

        {/* Nav cards */}
        <div className={styles.navGrid}>
          <Link href="/dashboard" className={styles.navCard}>
            <div className={styles.cardNum}>01</div>
            <div className={styles.cardTitle}>持仓<span> 总览</span></div>
            <div className={styles.cardDesc}>
              {holdings.positions.length} 个持仓，实时 P&L、赛道配置、走势图
            </div>
            <div className={styles.cardMeta}>
              <span className={`${styles.cardMetaVal} ${isGain ? styles.gain : styles.loss}`}>
                {fmtSign(s.cumulative_pnl_pct)}% 累计
              </span>
            </div>
          </Link>

          <Link href="/reports" className={styles.navCard}>
            <div className={styles.cardNum}>02</div>
            <div className={styles.cardTitle}>分析<span> 报告</span></div>
            <div className={styles.cardDesc}>
              每日盘后复盘、赛道分析、交易辩论摘要
            </div>
            {latestReport && (
              <div className={styles.cardMeta}>
                <span className={styles.cardMetaLabel}>最新：{latestReport.date}</span>
              </div>
            )}
          </Link>

          <Link href="/scout" className={styles.navCard}>
            <div className={styles.cardNum}>03</div>
            <div className={styles.cardTitle}>Scout<span> 侦察</span></div>
            <div className={styles.cardDesc}>
              独立选股侦察员，发现观察列表外的新机会
            </div>
          </Link>

          <Link href="/dashboard#positions" className={styles.navCard}>
            <div className={styles.cardNum}>04</div>
            <div className={styles.cardTitle}>赛道<span> 配置</span></div>
            <div className={styles.cardDesc}>
              AI 基础设施 · 太空航天 · 金融科技 · 杠杆 ETF
            </div>
            <div className={styles.cardMeta}>
              {Object.entries(s.sector_allocation).slice(0, 2).map(([k, v]) => (
                <span key={k} className={styles.cardMetaLabel}>
                  {k === 'ai_semiconductor' ? 'AI' : k === 'space' ? '太空' : k} {v.pct}%
                </span>
              ))}
            </div>
          </Link>
        </div>
      </div>

      {/* Latest report excerpt */}
      {latestReport && (
        <div className={styles.reportStrip}>
          <div className={styles.reportStripLabel}>最新盘后快报 · {latestReport.date}</div>
          <div className={styles.reportBullets}>
            {latestReport.content.split('\n')
              .filter(l => l.startsWith('- '))
              .slice(0, 4)
              .map((l, i) => (
                <div key={i} className={styles.reportBullet}>
                  <span className={styles.bulletDot}>·</span>
                  <span>{l.replace(/^- /, '').replace(/\*\*/g, '')}</span>
                </div>
              ))}
          </div>
          <Link href="/reports" className={styles.reportMore}>查看完整报告 →</Link>
        </div>
      )}
    </div>
  )
}
