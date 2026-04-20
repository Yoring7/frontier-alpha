import fs from 'fs'
import path from 'path'
import type { ReportMeta, ReportType } from './types'
import { REPORT_TYPE_LABELS } from './types'

const REPORTS_DIR = path.join(process.cwd(), 'reports')

function parseFilename(filename: string): { date: string; type: ReportType } | null {
  // e.g. "2026-04-18-postmarket.md"
  const name = filename.replace('.md', '')
  const lastDash = name.lastIndexOf('-')
  if (lastDash === -1) return null
  // Handle multi-word types: "weekly-research" → just read after date prefix
  // Date is always YYYY-MM-DD (10 chars)
  const date = name.slice(0, 10)
  const typePart = name.slice(11) // after "YYYY-MM-DD-"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  // Normalize known types
  let type: ReportType = 'postmarket'
  if (typePart.startsWith('postmarket'))  type = 'postmarket'
  else if (typePart.startsWith('premarket'))  type = 'premarket'
  else if (typePart.startsWith('midsession')) type = 'midsession'
  else if (typePart.startsWith('weekly'))     type = 'weekly'
  else if (typePart.startsWith('scout'))      type = 'scout'
  return { date, type }
}

export function getAllReports(): ReportMeta[] {
  if (!fs.existsSync(REPORTS_DIR)) return []
  return fs.readdirSync(REPORTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .reduce<ReportMeta[]>((acc, filename) => {
      const parsed = parseFilename(filename)
      if (!parsed) return acc
      const content = fs.readFileSync(path.join(REPORTS_DIR, filename), 'utf-8')
      acc.push({
        filename,
        date: parsed.date,
        type: parsed.type,
        label: REPORT_TYPE_LABELS[parsed.type] ?? parsed.type,
        content,
        slug: filename.replace('.md', ''),
      })
      return acc
    }, [])
}

export function getLatestPostmarketReport(): ReportMeta | null {
  const all = getAllReports()
  return all.find(r => r.type === 'postmarket') ?? null
}

/** Latest report of any type — used for the session badge in the header */
export function getLatestReport(): ReportMeta | null {
  const all = getAllReports()
  return all.length > 0 ? all[0] : null
}

const SESSION_BADGE_LABELS: Record<string, string> = {
  postmarket: '盘后',
  premarket:  '盘前',
  midsession: '盘中',
  weekly:     '周研',
  scout:      'Scout',
}

/** Returns short Chinese session label from the latest report file, e.g. "盘前" */
export function getLatestSessionLabel(): string {
  const latest = getLatestReport()
  if (!latest) return ''
  return SESSION_BADGE_LABELS[latest.type] ?? latest.type
}

export function getReportBySlug(slug: string): ReportMeta | null {
  const all = getAllReports()
  return all.find(r => r.slug === slug) ?? null
}
