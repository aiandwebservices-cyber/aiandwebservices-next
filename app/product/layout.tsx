import Nav from '@/components/Nav'

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <footer className="svc-page-footer">
        <p>
          &copy; 2026{' '}
          <a href="/">AIandWEBservices</a>. Built personally by David Pulis.
        </p>
      </footer>
    </>
  )
}
