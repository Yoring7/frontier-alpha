import { getHoldings } from '@/lib/data'
import { fmt, fmtSign } from '@/lib/types'
import Header from '@/components/Header'
import Link from 'next/link'
import styles from './identity.module.css'

export const dynamic = 'force-static'

export default async function IdentityPage() {
  const holdings = getHoldings()
  const s = holdings.summary
  const isGain = s.cumulative_pnl >= 0

  return (
    <div className={styles.page}>
      <Header active="identity" />

      {/* ── Cover ── */}
      <div className={styles.cover}>
        <div className={styles.coverTop}>
          <span className={`${styles.a} ${styles.d1}`}>Investment Philosophy · Fund Prospectus · 2026</span>
          <span className={`${styles.a} ${styles.d1}`}>临界点 · The Threshold · Est. 2026</span>
        </div>
        <div className={styles.coverCenter}>
          <h1 className={`${styles.brandMark} ${styles.a} ${styles.d2}`}>
            <span className={styles.brandFrontier}>Frontier</span>
            <span className={styles.brandAlpha}>Alpha</span>
          </h1>
          <div className={`${styles.coverRule} ${styles.a} ${styles.d3}`} />
          <div className={`${styles.a} ${styles.d4}`}>
            <p className={styles.coverEn}>
              Concentrated conviction at the convergence of<br />
              <em>artificial intelligence</em>, <em>orbital economy</em>, and <em>decentralized finance</em>.
            </p>
            <p className={styles.coverZh}>
              我们相信三件事正在同时发生。<br />
              错过其中任何一件，不是投资失误——是文明身份的错位。
            </p>
          </div>
        </div>
        <div className={`${styles.coverBottom} ${styles.a} ${styles.d6}`}>
          <div>
            <span className={styles.coverFundType}>Structured Conviction Fund</span>
            <span>结构化信念基金 · Human × AI Symbiosis</span>
          </div>
          <span>集中即尊重 · 辩论即纪律 · 透明即普惠</span>
        </div>
      </div>

      {/* ── 01 Thesis ── */}
      <section className={styles.section}>
        <div className={styles.label}>01 — 核心信念 / Investment Thesis</div>
        <div className={styles.thesisGrid}>
          <div>
            <div className={styles.sideLabel}>我们相信 · The Conviction</div>
            <blockquote className={styles.philosophyQuote}>
              "分散是不理解的遮羞布。<br />集中是研究的勋章。"
            </blockquote>
            <p className={styles.philosophyAttr}>— Frontier Alpha Philosophy, 2026</p>
            <div className={styles.pillar}>
              <span className={styles.pillarNum}>I</span>
              <span className={styles.pillarText}>AI 正在重写全球算力经济——不是一轮科技周期，是电力级、互联网级的结构性重组。</span>
            </div>
            <div className={styles.pillar}>
              <span className={styles.pillarNum}>II</span>
              <span className={styles.pillarText}>私营航天正在把人类经济版图第一次扩展到地球轨道——一个 $1.8 万亿的新大陆正在成形。</span>
            </div>
            <div className={styles.pillar}>
              <span className={styles.pillarNum}>III</span>
              <span className={styles.pillarText}>金融基础设施正在被可编程货币悄悄掏空又重建——稳定币、去中心化交易是下一代金融 OS。</span>
            </div>
            <div className={styles.pillar}>
              <span className={styles.pillarNum}>IV</span>
              <span className={styles.pillarText}>我们宁愿在 5 个真正理解的赛道重仓，也不在 50 个一知半解的标的上撒钱。</span>
            </div>
          </div>
          <div className={styles.thesisSep} />
          <div>
            <div className={styles.sideLabel}>组合状态 · Fund Snapshot · {holdings.last_updated}</div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Portfolio NAV</span>
              <span className={`${styles.dval} ${styles.dvalStrong}`}>${fmt(s.portfolio_value, 0)}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Cumulative Return</span>
              <span className={`${styles.dval} ${isGain ? styles.dvalGain : styles.dvalLoss}`}>
                {fmtSign(s.cumulative_pnl_pct)}% · {fmtSign(s.cumulative_pnl, 0)}
              </span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Inception Date</span>
              <span className={styles.dval}>2026-04-08</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Active Positions</span>
              <span className={styles.dval}>{holdings.positions.length}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Cash Reserve</span>
              <span className={`${styles.dval} ${styles.dvalStrong}`}>
                ${fmt(s.cash_balance, 0)} · {((s.cash_balance / s.portfolio_value) * 100).toFixed(1)}%
              </span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Highest Conviction</span>
              <span className={styles.dval}>NVDA · RKLB · CRWV</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dlabel}>Decision Model</span>
              <span className={styles.dval}>Scout → Debate → Exec</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 Platforms ── */}
      <section className={styles.section}>
        <div className={styles.label}>02 — 三大赛道 / The Three Platforms · Where We Concentrate</div>
        <div className={styles.platformsGrid}>
          <div className={styles.platformCard}>
            <div className={styles.pcNum}>Platform I</div>
            <div className={styles.pcEn}>AI Infrastructure<br />&amp; Semiconductors</div>
            <div className={styles.pcZh}>算力即石油 · Compute Is the New Oil</div>
            <div className={styles.pcThesis}>
              大型语言模型需要的算力，以年均 4× 的速度增长。GPU、AI 云、高带宽存储器是这场革命的皮卡和铲子。TSMC Q1 利润 +58%、Mag7 承诺 $2,000 亿 AI 资本支出，已充分确认这不是短期热度。
            </div>
            <div className={styles.pcAxiom}>"这是一个文明级的算力重建。"</div>
            <div className={styles.pcHoldings}>
              {['NVDA', 'CRWV', 'NBIS', 'SOXL', 'TQQQ'].map(s => (
                <Link key={s} href={`/position/${s}`} className={styles.pcTag}>{s}</Link>
              ))}
            </div>
          </div>
          <div className={styles.platformCard}>
            <div className={styles.pcNum}>Platform II</div>
            <div className={styles.pcEn}>Orbital Economy<br />&amp; Space Infrastructure</div>
            <div className={styles.pcZh}>太空即基础设施 · Space Is the Next Internet</div>
            <div className={styles.pcThesis}>
              发射成本十年内下降 100 倍，使太空从国家项目变成商业赛道。卫星互联网、激光通信、天基传感是未来全球数字基础设施的物理层。这个市场从 $400B 向 $1.8T 扩张。
            </div>
            <div className={styles.pcAxiom}>"轨道是下一张土地证书。"</div>
            <div className={styles.pcHoldings}>
              {['RKLB', 'ASTS'].map(s => (
                <Link key={s} href={`/position/${s}`} className={styles.pcTag}>{s}</Link>
              ))}
            </div>
          </div>
          <div className={styles.platformCard}>
            <div className={styles.pcNum}>Platform III</div>
            <div className={styles.pcEn}>Financial Disruption<br />&amp; Decentralized Finance</div>
            <div className={styles.pcZh}>金融即代码 · Finance Is Being Rewritten</div>
            <div className={styles.pcThesis}>
              稳定币流通量年均 +72%，链上交易量 +384%。散户交易门槛被制度性拆除（SEC 废除 PDT），加密资产正在进入主流金融。下一代金融 OS 的基础设施提供者仍被市场严重低估。
            </div>
            <div className={styles.pcAxiom}>"真正的普惠不是不冒险，是让所有人分享冒险的果实。"</div>
            <div className={styles.pcHoldings}>
              {['HOOD', 'CRCL'].map(s => (
                <Link key={s} href={`/position/${s}`} className={styles.pcTag}>{s}</Link>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.platformsNote}>
          我们有意不涉足的领域：传统能源、周期性大宗商品、低增长消费品、防御性债券类资产。我们投资的，是未来 10 年经济增长最集中的地方。
        </p>
      </section>

      {/* ── 03 Process ── */}
      <section className={styles.section}>
        <div className={styles.label}>03 — 决策机制 / The Decision Process · Our Structural Moat</div>
        <p className={styles.processIntro}>
          ARK 雇用人类分析师写研究报告。传统基金依赖基金经理的个人判断。<br />
          <strong>我们做的完全不同</strong>：每一笔交易必须通过四角色结构化辩论，在执行前系统性地消灭过度自信。这是把"认知偏见"制度化暴露出来的决策架构。
        </p>
        <div className={styles.processChain}>
          <div className={styles.pcAgent}>
            <div className={styles.agentDot} style={{ background: 'var(--amber)' }} />
            <div className={styles.agentRole}>Agent 01</div>
            <div className={styles.agentName}>Scout</div>
            <div className={styles.agentDesc}>
              独立扫描市场机会，不受当前持仓束缚。识别催化剂、量化论据，提交具体提案（标的、仓位、价格）。只描述机会，不做判断。
            </div>
            <div className={styles.agentScore}>输出：具体买卖提案 + 核心论据</div>
          </div>
          <div className={styles.pcAgent}>
            <div className={styles.agentDot} style={{ background: 'var(--loss)' }} />
            <div className={styles.agentRole}>Agent 02</div>
            <div className={styles.agentName}>Critic</div>
            <div className={styles.agentDesc}>
              专门寻找反对理由。信念越强的提案，它越苛刻。负责识别估值泡沫、执行风险、论据漏洞、黑天鹅场景。给出 0-10 反对强度评分。
            </div>
            <div className={styles.agentScore}>输出：反对理由清单 + 评分（0-10）</div>
          </div>
          <div className={styles.pcAgent}>
            <div className={styles.agentDot} style={{ background: 'var(--gain)' }} />
            <div className={styles.agentRole}>Agent 03</div>
            <div className={styles.agentName}>Bull</div>
            <div className={styles.agentDesc}>
              为提案辩护，必须用事实和数据回应 Critic 的每一条质疑。不允许重复原始论据——必须在 Critic 的框架内反驳。给出 0-10 支持强度评分。
            </div>
            <div className={styles.agentScore}>输出：针对性反驳 + 评分（0-10）</div>
          </div>
          <div className={styles.pcAgent}>
            <div className={styles.agentDot} style={{ background: 'var(--strong)' }} />
            <div className={styles.agentRole}>Agent 04</div>
            <div className={styles.agentName}>Executor</div>
            <div className={styles.agentDesc}>
              综合 Critic 和 Bull 的论据，基于评分差距做最终决策。Critic &gt; Bull → 执行减半或否决；Bull &gt; Critic → 按提案执行。所有推理全部记录归档。
            </div>
            <div className={styles.agentScore}>输出：最终决策 + 完整推理 + 执行记录</div>
          </div>
        </div>
        <div className={styles.processResult}>
          <div className={styles.prQuote}>
            "我们把'过度自信'这个人类最古老的 bug，制度化地交给 AI 去对抗。<br />
            每笔交易都是一场有记录的辩论，而不是一个无法追溯的直觉。"
          </div>
          <div className={styles.prStat}>
            <div className={styles.prStatVal}>100%</div>
            <div className={styles.prStatLabel}>Decision Audit Trail</div>
          </div>
        </div>
      </section>

      {/* ── 04 Convictions ── */}
      <section className={styles.section}>
        <div className={styles.label}>04 — 纪律信条 / The Four Convictions · Non-Negotiable</div>
        <div className={styles.convictionsGrid}>
          <div className={styles.convictionCard}>
            <div className={styles.ccNum}>Conviction 01 — 集中</div>
            <div className={styles.ccTitle}>集中是研究的勋章</div>
            <div className={styles.ccBody}>
              分散让人心安，但心安不会产生超额回报。我们宁愿在 5 个真正理解的赛道重仓，也不在 50 个一知半解的标的上撒钱。不理解的东西，再热的风口也不碰。
            </div>
          </div>
          <div className={styles.convictionCard}>
            <div className={styles.ccNum}>Conviction 02 — 波动</div>
            <div className={styles.ccTitle}>波动是朋友，恐慌是礼物</div>
            <div className={styles.ccBody}>
              前沿科技的本质就是非线性波动。市场下跌时，只要论据未变，我们买得更坚决。我们不怕回撤，我们怕的是在该重仓时踏空。
            </div>
          </div>
          <div className={styles.convictionCard}>
            <div className={styles.ccNum}>Conviction 03 — 透明</div>
            <div className={styles.ccTitle}>我们不卖神秘感</div>
            <div className={styles.ccBody}>
              每一笔交易、每一场辩论、每一次回撤、每一个错误——全部公开。不是摘要，是完整推理过程。传统对冲基金卖的是神秘感，我们卖的是可复制性。
            </div>
          </div>
          <div className={styles.convictionCard}>
            <div className={styles.ccNum}>Conviction 04 — 胜者</div>
            <div className={styles.ccTitle}>让赢家奔跑</div>
            <div className={styles.ccBody}>
              当一个标的翻倍，大多数人想的是锁定利润。我们想的是：这家公司距离它的终局还有多远？如果答案是"还很远"，我们不卖。
              <br /><br />
              <em className={styles.convictionQuote}>"我们不拔掉鲜花去浇灌杂草。"</em>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Closing ── */}
      <section className={`${styles.section} ${styles.closingSection}`}>
        <div>
          <div className={styles.manifestoEyebrow}>Fund Manifesto · 致同行者</div>
          <p className={styles.manifestoLine}>
            我们不保证永远正确。<br />
            我们只保证<em>永远坦诚</em>。
          </p>
          <p className={`${styles.manifestoLine} ${styles.manifestoDim}`}>
            我们不预测未来。<br />
            我们只<em>尽最大努力站在未来的那一边</em>。
          </p>
          <p className={styles.manifestoLine}>
            激进即负责。<br />
            保守地错过 AI 革命，<br />
            才是对资金最大的<em>不尊重</em>。
          </p>
          <p className={`${styles.manifestoLine} ${styles.manifestoDim}`}>
            欢迎跟随。欢迎挑战。<br />
            欢迎在我们犯错时<em>指出</em>。
          </p>
        </div>
        <div className={styles.closingBlock}>
          <div className={styles.closingName}>Frontier <span>Alpha</span></div>
          <div className={styles.closingSub}>
            Structured Conviction Fund · Est. 2026 · Human × AI Symbiosis · 透明即普惠
          </div>
        </div>
      </section>
    </div>
  )
}
