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

      const color = isGain ? '#3d8c52' : '#b54030'

      chart = createChart(ref.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#a0967c',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        },
        grid: {
          vertLines: { color: 'rgba(180,168,148,0.18)', style: LineStyle.Dotted },
          horzLines: { color: 'rgba(180,168,148,0.18)', style: LineStyle.Dotted },
        },
        rightPriceScale: { borderColor: '#d9d3cb' },
        timeScale: { borderColor: '#d9d3cb', visible: false },
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
