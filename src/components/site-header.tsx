import { Link } from 'react-router'

import { useLogoutMutation } from '@/features/auth/api/useLogoutMutation'
import { NavLink } from '@/components/nav-link'
import { useAuthStore } from '@/store/useAuthStore'
import type { User } from '@/types/api'

function AccountLinks({ user }: { user: User | null }) {
  const logout = useLogoutMutation()

  if (!user) {
    return (
      <>
        <Link
          to="/login"
          className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-soft"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-soft"
        >
          Register
        </Link>
      </>
    )
  }

  return (
    <>
      <p className="truncate px-3 py-2 text-sm text-muted">{user.email}</p>
      <Link
        to="/bookings"
        className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-soft"
      >
        Bookings
      </Link>
      <button
        type="button"
        disabled={logout.isPending}
        onClick={() => logout.mutate()}
        className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-soft disabled:text-muted-soft"
      >
        {logout.isPending ? 'Logging out…' : 'Log out'}
      </button>
    </>
  )
}

export function SiteHeader() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-6 desktop:px-10">
        <Link
          to="/"
          className="text-[22px] font-medium tracking-[-0.44px] text-ink"
        >
          Spacy
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 tablet:flex">
          <NavLink href="/">Spaces</NavLink>
          <NavLink href="/membership">Membership</NavLink>
        </nav>
        <div className="ml-auto hidden items-center gap-6 tablet:flex">
          <NavLink href="/dashboard">Metrics</NavLink>
          <NavLink href="/host">Host</NavLink>
          <details className="relative">
            <summary className="flex h-10 max-w-48 cursor-pointer items-center truncate rounded-full border border-hairline px-4 text-sm font-medium">
              {user ? user.email : 'Account'}
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-60 rounded-card bg-canvas p-2 shadow-card">
              <AccountLinks user={user} />
            </div>
          </details>
        </div>
        <details className="relative ml-auto tablet:hidden">
          <summary className="flex h-10 cursor-pointer items-center rounded-full border border-hairline px-4 text-sm font-medium">
            Menu
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-64 rounded-card bg-canvas p-2 shadow-card">
            <NavLink href="/" className="block rounded-lg px-3 py-2">
              Spaces
            </NavLink>
            <NavLink href="/membership" className="block rounded-lg px-3 py-2">
              Membership
            </NavLink>
            <NavLink href="/dashboard" className="block rounded-lg px-3 py-2">
              Metrics
            </NavLink>
            <NavLink href="/host" className="block rounded-lg px-3 py-2">
              Host
            </NavLink>
            <AccountLinks user={user} />
          </div>
        </details>
      </div>
    </header>
  )
}
