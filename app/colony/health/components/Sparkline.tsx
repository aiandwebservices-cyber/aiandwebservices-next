'use client'

interface SparklineProps {
  data: number[]
  height?: number
  width?: number
}

export function Sparkline({ data, height = 50, width = 200 }: SparklineProps) {
  const uniqueId = `spark-${Math.random().toString(36).slice(2, 7)}`

  if (data.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="var(--colony-accent)" strokeWidth={1.5} />
      </svg>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return [x, y] as [number, number]
  })

  const polylinePoints = points.map(([x, y]) => `${x},${y}`).join(' ')
  const areaPoints = [
    `0,${height}`,
    ...points.map(([x, y]) => `${x},${y}`),
    `${width},${height}`,
  ].join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', width: '100%', height }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--colony-accent)" stopOpacity={0.2} />
          <stop offset="100%" stopColor="var(--colony-accent)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${uniqueId})`} />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="var(--colony-accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
