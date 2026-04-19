import { getAllReports } from '@/lib/reports'
import Header from '@/components/Header'
import ReportsClient from './ReportsClient'
import styles from './reports.module.css'

export const dynamic = 'force-static'

export default async function ReportsPage() {
  const reports = getAllReports()

  return (
    <div className={styles.page}>
      <Header active="reports" />
      <ReportsClient reports={reports} />
    </div>
  )
}
