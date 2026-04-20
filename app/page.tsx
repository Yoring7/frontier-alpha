import { getHoldings, getPerformanceSeries, getBestSession, getScoutPicks } from '@/lib/data'
import { getLatestPostmarketReport } from '@/lib/reports'
import { fmt, fmtSign, stripSuffix } from '@/lib/types'
import Header from '@/components/Header'
import Link from 'next/link'
import PerformanceChart from '@/components/PerformanceChart'
import styles from './home.module.css'

export const dynamic = 'force-static'

export default async function HomePage() {
  const holdings = getHoldings()
  const series = getPerformanceSeries()
  const latestReport = getLatestPostmarketReport()
  const bestSession = getBestSession()
  const scoutPicks = getScoutPicks()
  const s = holdings.summary
  const isGain = s.cumulative_pnl >= 0

  const alertFlag =
    scoutPicks.attention_flags?.find(f => f.urgency === 'critical') ??
    scoutPicks.attention_flags?.find(f => f.urgency === 'high')

  const topPos = holdings.positions.length > 0
    ? [...holdings.positions].sort((a, b) => b.unrealized_pnl_pct - a.unrealized_pnl_pct)[0]
    : null

  const aiAlloc = s.sector_allocation['ai_semiconductor']
  const symbolList = holdings.positions.map(p => stripSuffix(p.symbol)).slice(0, 5).join(' · ')
  const inceptionDate = series.length > 0 ? series[0].date : '—'
  const tradingDays = series.length

  return (
    <div className={styles.page}>
      <Header active="overview" date={holdings.last_updated} session="盘后" />

      {/* Alert bar */}
      {alertFlag && (
        <div className={styles.alertBar}>
          <span className={styles.alertIcon}>📡</span>
          <span className={styles.alertText}>{alertFlag.flag}</span>
          <span className={styles.alertTime}>
            {alertFlag.urgency === 'critical' ? '最高优先级' : '高优先级'}
          </span>
        </div>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>Structured Conviction Fund · 结构化信念基金 · Est. 2026</div>
        <h1 className={styles.heroBrand}>
          <span className={styles.brandF}>Frontier</span>
          <span className={styles.brandA}>Alpha</span>
        </h1>
        <p className={styles.heroTagline}>
          Concentrated conviction at the convergence of{' '}
          <strong>artificial intelligence, orbital economy &amp; decentralized finance.</strong>
          <span className={styles.heroTaglineSub}>每一笔交易都有辩论记录。每一个决策都完整公开。</span>
        </p>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Portfolio NAV</div>
          <div className={styles.statValue}>${fmt(s.portfolio_value, 0)}</div>
          <div className={styles.statSub}>初始资金 $100,000</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>累计收益</div>
          <div className={`${styles.statValue} ${isGain ? styles.gain : styles.loss}`}>
            {fmtSign(s.cumulative_pnl_pct)}%
          </div>
          <div className={`${styles.statSub} ${isGain ? styles.gain : styles.loss}`}>
            {fmtSign(s.cumulative_pnl, 0)} USD · since inception
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>持仓数 · 现金</div>
          <div className={styles.statValue}>
            {holdings.positions.length}
            <span className={styles.statValueSub}> / ${fmt(s.cash_balance, 0)}</span>
          </div>
          <div className={styles.statSub}>现金占比 {((s.cash_balance / s.portfolio_value) * 100).toFixed(1)}%</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>最后更新</div>
          <div className={`${styles.statValue} ${styles.statValueDate}`}>{holdings.last_updated}</div>
          <div className={styles.statSub}>每日盘后更新</div>
        </div>
      </div>

      {/* Performance section: chart + metrics sidebar */}
      <div className={styles.perfSection}>
        <div className={styles.perfChartCol}>
          <div className={styles.perfTop}>
            <span className={styles.sectionLabel}>
              收益概览 / Performance Since Inception · {inceptionDate} → {holdings.last_updated} · Indexed to 100
            </span>
          </div>
          <PerformanceChart series={series} />
        </div>
        <div className={styles.perfMetricsCol}>
          <div className={styles.perfColLabel}>绩效指标</div>
          <div className={styles.perfMetric}>
            <div className={styles.perfMLabel}>Inception Return</div>
            <div className={`${styles.perfMVal} ${styles.amber}`}>
              {fmtSign(s.cumulative_pnl_pct)}%
            </div>
            <div className={styles.perfMSub}>
              {fmtSign(s.cumulative_pnl, 0)} · {tradingDays} trading days
            </div>
          </div>
          <div className={styles.perfMetric}>
            <div className={styles.perfMLabel}>Active Positions</div>
            <div className={styles.perfMVal}>{holdings.positions.length}</div>
            <div className={styles.perfMSub}>
              Cash {((s.cash_balance / s.portfolio_value) * 100).toFixed(1)}% reserve
            </div>
          </div>
          {topPos && (
            <div className={styles.perfMetric}>
              <div className={styles.perfMLabel}>Best Position</div>
              <div className={`${styles.perfMVal} ${styles.gain}`}>
                {fmtSign(topPos.unrealized_pnl_pct)}%
              </div>
              <div className={styles.perfMSub}>
                {stripSuffix(topPos.symbol)} · {fmtSign(topPos.unrealized_pnl, 0)} USD
              </div>
            </div>
          )}
          {bestSession && (
            <div className={styles.perfMetric}>
              <div className={styles.perfMLabel}>Best Session</div>
              <div className={`${styles.perfMVal} ${styles.gain}`}>
                +{bestSession.pct.toFixed(2)}%
              </div>
              <div className={styles.perfMSub}>{bestSession.date}</div>
            </div>
          )}
          <div className={styles.perfMetric}>
            <div className={styles.perfMLabel}>Current NAV</div>
            <div className={styles.perfMVal}>${fmt(s.portfolio_value, 0)}</div>
            <div className={styles.perfMSub}>Initial capital $100,000</div>
          </div>
        </div>
      </div>

      {/* Nav grid: 4 cards in a row */}
      <div className={styles.navGrid}>
        <Link href="/dashboard" className={styles.navCard}>
          <div className={styles.cardNum}>01 — 持仓</div>
          <div className={styles.cardTitle}>Dashboard<br /><span>Holdings</span></div>
          <div className={styles.cardDesc}>
            实时持仓概览，板块配置，个股走势 sparkline，近期交易记录与关键事件。
          </div>
          <div className={styles.cardMeta}>
            {topPos && (
              <div className={`${styles.cardStat} ${styles.hi}`}>
                最强 {stripSuffix(topPos.symbol)} {fmtSign(topPos.unrealized_pnl_pct)}%
              </div>
            )}
            <div className={styles.cardStat}>{symbolList}</div>
            {aiAlloc && aiAlloc.pct > 60 && (
              <div className={`${styles.cardStat} ${styles.warn}`}>
                ⚠ AI 超配 {aiAlloc.pct}% &gt; 60% 软上限
              </div>
            )}
          </div>
          <div className={styles.cardArrow}>→ 进入持仓</div>
        </Link>

        <Link href="/reports" className={styles.navCard}>
          <div className={styles.cardNum}>02 — 报告</div>
          <div className={styles.cardTitle}>Reports<br /><span>Analysis</span></div>
          <div className={styles.cardDesc}>
            每日盘前/盘后复盘 + 每周深度研究报告。赛道分析，宏观判断，信念更新。
          </div>
          <div className={styles.cardMeta}>
            {latestReport && (
              <div className={styles.cardStat}>最新：{latestReport.date} 盘后复盘</div>
            )}
            <div className={`${styles.cardStat} ${styles.warn}`}>
              关键：7/24 关税截止日风险窗口
            </div>
          </div>
          <div className={styles.cardArrow}>→ 阅读报告</div>
        </Link>

        <Link href="/identity" className={styles.navCard}>
          <div className={styles.cardNum}>03 — 品牌</div>
          <div className={styles.cardTitle}>Brand<br /><span>Identity</span></div>
          <div className={styles.cardDesc}>
            基金投资哲学，三大平台论据，辩论决策机制，四大纪律信条与宣言。
          </div>
          <div className={styles.cardMeta}>
            <div className={styles.cardStat}>Structured Conviction Fund</div>
            <div className={styles.cardStat}>AI · Space · Fintech</div>
            <div className={`${styles.cardStat} ${styles.amber}`}>Scout → Critic → Bull → Exec</div>
          </div>
          <div className={styles.cardArrow}>→ 阅读投资哲学</div>
        </Link>

        <Link href="/scout" className={styles.navCard}>
          <div className={styles.cardNum}>04 — 侦察</div>
          <div className={styles.cardTitle}>Scout<br /><span>Intelligence</span></div>
          <div className={styles.cardDesc}>
            独立选股侦察员，发现观察列表外的新机会。每周二 + 周六更新。
          </div>
          <div className={styles.cardMeta}>
            <div className={styles.cardStat}>{scoutPicks.picks.length} 个候选标的</div>
            {alertFlag && (
              <div className={`${styles.cardStat} ${alertFlag.urgency === 'critical' ? styles.warn : ''}`}>
                📡 {alertFlag.symbol.replace('.US', '')} · {alertFlag.urgency === 'critical' ? '最高优先级' : '高优先级'}
              </div>
            )}
          </div>
          <div className={styles.cardArrow}>→ 查看侦察</div>
        </Link>
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

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerBrand}>Frontier <span>Alpha</span></div>
        <div className={styles.footerMeta}>
          Est. 2026 · 人机共生 · 透明即普惠 · Structured Conviction Fund
        </div>
      </div>
    </div>
  )
}
