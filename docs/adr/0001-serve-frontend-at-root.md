# ADR 0001: Serve the frontend at the root and the API under /api

Date: 2026-10-06

Status: Proposed; implementation and release verification pending.

## Context

[Spacey ADR 0002](https://github.com/cs403bkk-2026/spacey/blob/main/docs/adr/0002-separate-frontend-repository.md)
separates the browser client and prepares removal of backend HTML/form handling.
The frontend currently lives at `/app/`, while root-relative API paths reach
the backend on the same origin. Moving the frontend to `/` creates collisions:
page routes such as `/spaces/:spaceId` and `/bookings/:bookingId` overlap JSON
resource paths.

The product owner requested the root move after HTML cleanup and confirmed on
6 October that there are no other API callers yet. Work is tracked in
[frontend issue #4](https://github.com/cs403bkk-2026/spacey-frontend/issues/4).

## Proposed decision

Serve browser pages and assets at `https://spacey.cs403bkk26.space/` and the
JSON API at `/api/` on that same origin. Route API requests to the backend,
stripping the prefix if its internal paths remain unchanged. Unknown API routes
must not fall through to the frontend HTML page.

Coordinate the frontend base paths, API client, public OpenAPI description and
platform routing after the relevant backend HTML cleanup. Redirect old `/app/`
page links to their new locations, preserving query strings. Explicitly map
health, metrics and reporting routes rather than relying on the frontend fallback.

## Alternatives

- **Keep `/app/`:** preserves current routing with less work, but does not meet
  the requested root-page layout.
- **Use a separate API origin:** separates URL namespaces, but introduces
  browser CORS configuration and additional cookie/authentication considerations.
- **Use `/` and `/api/` on one origin:** chosen proposal; separates page and API
  paths while retaining same-origin browser requests.

## Consequences and verification

Separate deployments retain one public browser origin. This layout does not
require cross-origin API access, but still requires normal authentication and
authorisation. Public API URLs change; the frontend and routing must be released
in a compatible order. No general legacy API compatibility layer is required
for other callers, given the owner's current scope confirmation.

Frontend, backend and platform owners must agree the path mapping and release
order. Rollback must restore a compatible frontend/API/routing combination.
Use issue #4 for implementation ownership and acceptance evidence: nested-page
navigation and refresh, redirects, JSON responses, sessions, the member journey
and recovery at recorded revisions. Acceptance of this ADR does not establish
implementation, deployment or successful verification.
