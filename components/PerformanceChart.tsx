'use client'

import { useEffect, useRef } from 'react'

interface DataPoint { date: string; nav: number; navPct: number }
interface Props { series: DataPoint[] }

export default function PerformanceChart({ series }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || series.length === 0) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null

    import('lightweight-charts').then(({ createChart, ColorType, LineStyle }) => {
      if (!containerRef.current) return

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'oklch(0.52 0.010 68)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        },
        grid: {
          vertLines: { color: 'oklch(0.85 0.010 74)', style: LineStyle.Dotted },
          horzLines: { color: 'oklch(0.85 0.010 74)', style: LineStyle.Dotted },
        },
        rightPriceScale: {
          borderColor: 'oklch(0.85 0.010 74)',
        },
        timeScale: {
          borderColor: 'oklch(0.85 0.010 74)',
          tickMarkFormatter: (t: number) => {
            const d = new Date(t * 1000)
            return `${d.getMonth() + 1}/${d.getDate()}`
          },
        },
        crosshair: {
          vertLine: { color: 'oklch(0.50 0.140 65)', width: 1 },
          horzLine: { color: 'oklch(0.50 0.140 65)', width: 1 },
        },
        handleScroll: false,
        handleScale: false,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || 220,
      })

      const lineSeries = chart.addLineSeries({
        color: 'oklch(0.50 0.140 65)',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: 'oklch(0.50 0.140 65)',
      })

      const data = series.map(p => ({
        time: p.date as unknown as import('lightweight-charts').Time,
        value: parseFloat((100 + p.navPct).toFixed(2)),
      }))

      lineSeries.setData(data)
      chart.timeScale().fitContent()

      const ro = new ResizeObserver(() => {
        if (containerRef.current && chart) {
          chart.applyOptions({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight || 220,
          })
        }
      })
      if (containerRef.current) ro.observe(containerRef.current)

      return () => ro.disconnect()
    })

    return () => { chart?.remove() }
  }, [series])

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, minHeight: 180 }}
    />
  )
}
