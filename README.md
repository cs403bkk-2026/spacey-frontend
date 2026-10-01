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
