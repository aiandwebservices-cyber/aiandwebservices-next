import { listTemplates } from '@/lib/colony/sequences/templates'
import { qdrantFetchEnrollmentsForCohort } from '@/lib/colony/sequences/qdrant-store'
import SequenceTemplateEditor from './components/SequenceTemplateEditor'
import ActiveEnrollmentTable from './components/ActiveEnrollmentTable'
import { getCohortId } from '@/app/colony/lib/cohort'

export const dynamic = 'force-dynamic'

export default async function AdminSequencesPage() {
  const cohortId = await getCohortId()
  const [templates, enrollments] = await Promise.all([
    listTemplates(cohortId),
    qdrantFetchEnrollmentsForCohort(cohortId),
  ])

  const templateMap = new Map(templates.map(t => [t.id, t.name]))
  const enriched = enrollments
    .map(e => ({ ...e, template_name: templateMap.get(e.template_id) ?? e.template_id }))
    .sort((a, b) => (b.enrolled_at ?? '').localeCompare(a.enrolled_at ?? ''))

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            Sequence templates
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
            Pause stops all active enrollments on next tick. Editing step bodies requires Phase 15B.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {templates.map(t => (
            <SequenceTemplateEditor key={t.id} template={t} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            Enrollments
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
            All sequence enrollments for this cohort, grouped by status.
          </p>
        </div>
        <ActiveEnrollmentTable initial={enriched} />
      </section>

      <section>
        <div
          className="rounded-xl p-4 text-sm"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            color: 'var(--colony-text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--colony-warning)' }}>Scheduler note:</strong>{' '}
          Sequences only fire when an external cron hits <code className="font-mono">/api/colony/sequences/tick</code>{' '}
          every 10 minutes with <code className="font-mono">X-Scheduler-Secret</code>. Vercel Cron users should add a cron entry; Hobby-tier users can use cron-job.org or GitHub Actions.
        </div>
      </section>
    </div>
  )
}
