interface SparklineProps {
  prices: number[]
  isGain: boolean
  width?: number
  height?: number
}

export default function Sparkline({ prices, isGain, width = 64, height = 22 }: SparklineProps) {
  if (prices.length < 2) return null
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const W = width, H = height

  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * W
    const y = H - ((p - min) / range) * (H - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const last = prices[prices.length - 1]
  const dotX = W.toFixed(1)
  const dotY = (H - ((last - min) / range) * (H - 4) - 2).toFixed(1)
  const color = isGain ? 'oklch(0.38 0.120 145)' : 'oklch(0.42 0.150 25)'

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx={dotX} cy={dotY} r="2" fill={color} opacity="0.9" />
    </svg>
  )
}
