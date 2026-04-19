'use client'

import { useEffect, useRef } from 'react'

interface Props { prices: number[]; isGain: boolean }

export default function PositionChart({ prices, isGain }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || prices.length < 2) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null

    import('lightweight-charts').then(({ createChart, ColorType, LineStyle }) => {
      if (!ref.current) return

      const color = isGain ? 'oklch(0.38 0.120 145)' : 'oklch(0.42 0.150 25)'

      chart = createChart(ref.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'oklch(0.52 0.010 68)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        },
        grid: {
          vertLines: { color: 'oklch(0.91 0.006 75)', style: LineStyle.Dotted },
          horzLines: { color: 'oklch(0.91 0.006 75)', style: LineStyle.Dotted },
        },
        rightPriceScale: { borderColor: 'oklch(0.85 0.010 74)' },
        timeScale: { borderColor: 'oklch(0.85 0.010 74)', visible: false },
        handleScroll: false,
        handleScale: false,
        width: ref.current.clientWidth,
        height: ref.current.clientHeight || 140,
      })

      const line = chart.addLineSeries({
        color,
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
        crosshairMarkerRadius: 3,
        crosshairMarkerBackgroundColor: color,
      })

      line.setData(
        prices.map((p, i) => ({ time: i as unknown as import('lightweight-charts').Time, value: p }))
      )
      chart.timeScale().fitContent()

      const ro = new ResizeObserver(() => {
        if (ref.current && chart) {
          chart.applyOptions({
            width: ref.current.clientWidth,
            height: ref.current.clientHeight || 140,
          })
        }
      })
      if (ref.current) ro.observe(ref.current)
      return () => ro.disconnect()
    })

    return () => { chart?.remove() }
  }, [prices, isGain])

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}
