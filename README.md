# spacey-frontend

Browser client for Spacey, served from the same origin as the existing application:

- Public URL: `https://spacey.cs403bkk26.space/app/`
- Everything outside `/app/` (the API, login and the existing interface) is still served by the
  [`spacey`](https://github.com/cs403bkk-2026/spacey) application.

The Frontend team owns the application, its build, its container configuration and its releases.
Shared routing and access are platform work, tracked in
[cs403bkk-2026/spacey#202](https://github.com/cs403bkk-2026/spacey/issues/202). The implementation
work is tracked in [cs403bkk-2026/spacey#201](https://github.com/cs403bkk-2026/spacey/issues/201).

The deployment, logs and rollback procedure will go in this README once the deployment path is
handed over.

## Deployment (proposal under review, see #202)

|                   |                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Image             | `ghcr.io/cs403bkk-2026/spacey-frontend:<commit sha>`, built by CI on every push to `main`                                      |
| Deployment target | Nomad job `spacey-frontend`, namespace `frontend`, course cluster                                                              |
| Public path       | `https://spacey.cs403bkk26.space/app/`. Traefik strips `/app` and forwards to the container; bare `/app` gets a 301 to `/app/` |
| CI credentials    | Repository secrets `NOMAD_ADDR` and `NOMAD_TOKEN`. The token can deploy, read and fetch logs in `frontend` and nothing else    |

**What the application must provide**

- `npm test` and `npm run build` (CI runs `npm ci`, `npm test`, `npm run build`).
- A `Dockerfile` whose image serves the built files over HTTP on port **8080** at `/`, returns 200
  for `GET /`, and does not run the Vite development server.
- Built with base path `/app/` (Vite: `base: '/app/'`), so asset URLs come out as `/app/assets/...`.
- Client-side routes under `/app/...` fall back to `index.html` in the static server, so direct
  navigation works.
- API requests use origin-relative paths (`/spaces`, `/login`, ...), so they reach Spacey on the
  same origin with its existing session cookie. No API base URL, and no credentials in browser code.

**Release.** Merge to `main`. CI tests, builds and pushes the image, then runs
`nomad job run deploy/frontend.nomad.hcl`. If the new version never becomes healthy, Nomad
reverts to the previous version automatically. Deployment is switched on with the repository
variable `DEPLOY_ENABLED=true` once the routing in #202 is approved.

**Inspect and logs**, with a token that has access to `frontend`:

```sh
export NOMAD_ADDR=https://nomad.cs403bkk26.space
nomad job status -namespace=frontend spacey-frontend
nomad alloc logs -namespace=frontend -job spacey-frontend web            # stdout
nomad alloc logs -namespace=frontend -stderr -job spacey-frontend web    # stderr
```

**Roll back** to a known working version without rebuilding:

```sh
nomad job history -namespace=frontend spacey-frontend          # find the version and its meta.revision
nomad job revert  -namespace=frontend spacey-frontend <version>
```

Rolling back the frontend never touches the Spacey application. To make the rollback stick,
revert the change on `main` too, or the next merge redeploys it.
