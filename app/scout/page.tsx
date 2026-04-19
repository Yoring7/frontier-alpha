import { getScoutPicks } from '@/lib/data'
import Header from '@/components/Header'
import styles from './scout.module.css'

export const dynamic = 'force-static'

const CONVICTION_LABELS: Record<string, string> = {
  high:        '高信念',
  medium:      '中等',
  speculative: '投机',
}

const CONVICTION_CLASS: Record<string, string> = {
  high:        'convHigh',
  medium:      'convMed',
  speculative: 'convSpec',
}

export default async function ScoutPage() {
  const scout = getScoutPicks()

  return (
    <div className={styles.page}>
      <Header active="scout" date={scout.last_updated} session="Scout" />

      <div className={styles.body}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Scout 侦察报告</h1>
          <div className={styles.meta}>更新 {scout.last_updated} · {scout.picks.length} 个候选标的</div>
          {scout.market_snapshot && (
            <div className={styles.snapshot}>{scout.market_snapshot.notes}</div>
          )}
        </div>

        {/* Attention flags */}
        {scout.attention_flags && scout.attention_flags.length > 0 && (
          <div className={styles.flagsRow}>
            {scout.attention_flags.map((f, i) => (
              <div key={i} className={`${styles.flag} ${f.urgency === 'critical' ? styles.flagCritical : ''}`}>
                <span className={styles.flagSymbol}>{f.symbol}</span>
                <span className={styles.flagText}>{f.flag}</span>
              </div>
            ))}
          </div>
        )}

        {/* Picks grid */}
        <div className={styles.grid}>
          {scout.picks.map((pick, i) => (
            <div key={pick.symbol} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.rankSymbol}>
                  <span className={styles.rank}>#{pick.rank ?? i + 1}</span>
                  <span className={styles.symbol}>{pick.symbol.replace('.US', '')}</span>
                </div>
                <span className={`${styles.conviction} ${styles[CONVICTION_CLASS[pick.conviction] ?? 'convMed']}`}>
                  {CONVICTION_LABELS[pick.conviction] ?? pick.conviction}
                </span>
              </div>

              <div className={styles.cardName}>{pick.name}</div>
              <div className={styles.cardSector}>{pick.sector}</div>

              {pick.current_price && (
                <div className={styles.priceRow}>
                  <span className={styles.priceVal}>${pick.current_price.toFixed(2)}</span>
                  {pick.gain_since_pick && (
                    <span className={`${styles.gainBadge} ${pick.gain_since_pick.startsWith('+') ? styles.gain : styles.loss}`}>
                      {pick.gain_since_pick}
                    </span>
                  )}
                </div>
              )}

              <p className={styles.thesis}>{pick.thesis}</p>

              {pick.catalysts.length > 0 && (
                <div className={styles.catalysts}>
                  {pick.catalysts.slice(0, 3).map((c, j) => (
                    <span key={j} className={styles.catalyst}>{c}</span>
                  ))}
                </div>
              )}

              <div className={styles.cardBottom}>
                {pick.suggested_action && (
                  <span className={`${styles.action} ${pick.suggested_action === 'buy_now' ? styles.actionBuy : styles.actionWatch}`}>
                    {pick.suggested_action === 'buy_now' ? '立即买入' :
                     pick.suggested_action === 'watch'   ? '观察' : '加入观察'}
                  </span>
                )}
                {pick.position_sizing && (
                  <span className={styles.sizing}>{pick.position_sizing}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
