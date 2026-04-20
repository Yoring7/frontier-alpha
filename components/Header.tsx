import Link from 'next/link'
import styles from './Header.module.css'

interface HeaderProps {
  active: 'overview' | 'dashboard' | 'reports' | 'position' | 'scout' | 'identity'
  date?: string
  session?: string
}

export default function Header({ active, date, session }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandF}>Frontier</span>
        &thinsp;
        <span className={styles.brandA}>Alpha</span>
      </div>
      <nav className={styles.navTabs}>
        <Link href="/"          className={`${styles.navTab} ${active === 'overview'   ? styles.active : ''}`}>总览</Link>
        <Link href="/dashboard" className={`${styles.navTab} ${active === 'dashboard'  ? styles.active : ''}`}>持仓</Link>
        <Link href="/reports"   className={`${styles.navTab} ${active === 'reports'    ? styles.active : ''}`}>报告</Link>
        <Link href="/scout"     className={`${styles.navTab} ${active === 'scout'      ? styles.active : ''}`}>Scout</Link>
        <Link href="/identity"  className={`${styles.navTab} ${active === 'identity'   ? styles.active : ''}`}>品牌</Link>
      </nav>
      <div className={styles.headerRight}>
        {session && <span className={styles.sessionBadge}>{session}</span>}
        {date && <span className={styles.headerMeta}>{date}</span>}
      </div>
    </header>
  )
}
