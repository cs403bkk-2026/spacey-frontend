import { Link } from 'react-router'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 tablet:grid-cols-3 desktop:px-20">
        <div>
          <h2 className="text-base font-medium text-ink">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Spaces
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:underline">
                Membership
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="hover:underline">
                Bookings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-medium text-ink">Hosting</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/host" className="hover:underline">
                List a space
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:underline">
                Business metrics
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-medium text-ink">Spacy</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-body">
            Find a space, book it, pay once or subscribe, and get an access code
            for the door.
          </p>
        </div>
      </div>
      <div className="border-t border-hairline-soft">
        <p className="mx-auto max-w-7xl px-6 py-4 text-[13px] text-muted desktop:px-20">
          © 2026 Spacy
        </p>
      </div>
    </footer>
  )
}
