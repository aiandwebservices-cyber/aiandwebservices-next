import Image from 'next/image'

interface FeatureBlockProps {
  screenshot: string
  alt: string
  title: string
  description: string
  reverse?: boolean
}

export default function FeatureBlock({
  screenshot,
  alt,
  title,
  description,
  reverse = false,
}: FeatureBlockProps) {
  return (
    <div
      className={`flex flex-col gap-10 lg:items-center lg:gap-16 ${
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
      }`}
    >
      <div className="lg:flex-1">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          }}
        >
          <Image
            src={screenshot}
            alt={alt}
            width={720}
            height={480}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
      <div className="lg:flex-1">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-lg leading-relaxed" style={{ color: '#94a3b8' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
