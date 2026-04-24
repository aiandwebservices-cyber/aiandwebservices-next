import { validateUnsubscribeToken } from '@/lib/colony/email/unsubscribe'

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; success?: string; error?: string }>
}) {
  const { token, success, error } = await searchParams

  if (success === '1') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full border rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-xl font-bold mb-2">You&apos;re unsubscribed</h1>
          <p className="text-sm text-gray-600">
            You won&apos;t receive any more outreach emails from AIandWEBservices.
          </p>
        </div>
      </main>
    )
  }

  if (error === 'invalid' || error === 'failed') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full border rounded-lg p-6 text-center">
          <h1 className="text-xl font-bold mb-2">
            {error === 'failed' ? 'Something went wrong' : 'Invalid or expired link'}
          </h1>
          <p className="text-sm text-gray-600">
            {error === 'failed'
              ? 'We couldn\'t process your request. Please try again or contact david@aiandwebservices.com.'
              : 'This unsubscribe link is invalid or has expired. Please contact david@aiandwebservices.com directly.'}
          </p>
        </div>
      </main>
    )
  }

  const valid = token ? validateUnsubscribeToken(token) : null

  if (!valid) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full border rounded-lg p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Invalid or expired unsubscribe link</h1>
          <p className="text-sm text-gray-600">
            Please contact david@aiandwebservices.com directly.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full bg-white border rounded-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-3">Unsubscribe?</h1>
        <p className="text-sm text-gray-600 mb-6">
          You&apos;ll stop receiving outreach emails from AIandWEBservices.
        </p>
        <form method="POST" action={`/api/colony/email/unsubscribe?token=${encodeURIComponent(token!)}`}>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Yes, unsubscribe me
          </button>
        </form>
      </div>
    </main>
  )
}
