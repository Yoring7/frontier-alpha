'use client'

import { useEffect, useRef } from 'react'

interface DataPoint { date: string; nav: number; navPct: number }
interface Props {
  series: DataPoint[]
  height?: number
}

export default function PerformanceChart({ series, height = 260 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || series.length === 0) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null
    let ro: ResizeObserver | null = null

    import('lightweight-charts').then(({ createChart, ColorType }) => {
      if (!containerRef.current) return

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#a0967c',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: 'rgba(180,168,148,0.18)' },
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: { top: 0.10, bottom: 0.02 },
        },
        timeScale: {
          borderVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
        },
        crosshair: {
          vertLine: { color: 'rgba(140,120,80,0.35)', labelBackgroundColor: '#c09030' },
          horzLine: { color: 'rgba(140,120,80,0.35)', labelBackgroundColor: '#c09030' },
        },
        handleScroll: false,
        handleScale: false,
        width: containerRef.current.clientWidth,
        height,
      })

      const areaSeries = chart.addAreaSeries({
        lineColor: '#c09030',
        topColor: 'rgba(192,144,48,0.18)',
        bottomColor: 'rgba(192,144,48,0)',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: '#c09030',
      })

      const data = series.map(p => ({
        time: p.date as unknown as import('lightweight-charts').Time,
        value: parseFloat((100 + p.navPct).toFixed(2)),
      }))

      areaSeries.setData(data)
      chart.timeScale().fitContent()

      ro = new ResizeObserver(() => {
        if (containerRef.current && chart) {
          chart.applyOptions({
            width: containerRef.current.clientWidth,
            height,
          })
        }
      })
      ro.observe(containerRef.current)
    })

    return () => {
      chart?.remove()
      ro?.disconnect()
    }
  }, [series, height])

  return <div ref={containerRef} style={{ width: '100%', height }} />
}
