import SystemHealthClient from './components/SystemHealthClient'

export default function SystemPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          System health
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Refreshes every 30 seconds. Each check runs server-side.
        </p>
      </div>
      <SystemHealthClient />
    </div>
  )
}
