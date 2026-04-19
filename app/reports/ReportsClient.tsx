'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReportMeta } from '@/lib/types'
import styles from './reports.module.css'

const TYPE_COLORS: Record<string, string> = {
  postmarket:  '#c09030',
  premarket:   '#5a8fa0',
  midsession:  '#7a7a9a',
  weekly:      '#5a8a5a',
  scout:       '#9a6a4a',
}

interface Props { reports: ReportMeta[] }

export default function ReportsClient({ reports }: Props) {
  const [selected, setSelected] = useState<string>(reports[0]?.slug ?? '')
  const current = reports.find(r => r.slug === selected) ?? reports[0]

  return (
    <div className={styles.body}>
      {/* Left: report list */}
      <div className={styles.listCol}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>报告存档</span>
          <span className={styles.listCount}>{reports.length} 份</span>
        </div>
        <div className={styles.list}>
          {reports.map(r => (
            <button
              key={r.slug}
              className={`${styles.listItem} ${r.slug === selected ? styles.listItemActive : ''}`}
              onClick={() => setSelected(r.slug)}
            >
              <div className={styles.listItemTop}>
                <span className={styles.listDate}>{r.date}</span>
                <span
                  className={styles.listBadge}
                  style={{ color: TYPE_COLORS[r.type] ?? '#999', borderColor: TYPE_COLORS[r.type] ?? '#999' }}
                >
                  {r.label}
                </span>
              </div>
              <div className={styles.listSnippet}>
                {r.content.split('\n').find(l => l.startsWith('- '))?.replace(/^- /, '').slice(0, 60) ?? ''}…
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: report content */}
      <div className={styles.contentCol}>
        {current && (
          <article className={styles.article}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {current.content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  )
}
