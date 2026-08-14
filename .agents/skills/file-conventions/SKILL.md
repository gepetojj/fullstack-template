---
name: file-conventions
description: Enforce file placement, kebab-case naming, and colocation rules for Next.js App Router. Use when creating, moving, renaming, or reviewing components, routes, hooks, lib, or server modules — especially before putting files under components/.
---

# File conventions

Colocate by usage. Shared folders are the exception, not the default.

## Placement decision

Ask: **who imports this?**

| Who imports it | Where it goes |
| --- | --- |
| One route only (e.g. `/login`) | `app/<segment>/_components/` next to that route |
| Several routes in one group (e.g. auth) | `app/(group)/_components/` |
| Several areas of the app (design system / primitives) | `components/ui/` |
| Shared non-UI helpers (client-safe) | `lib/` |
| Shared React hooks | `hooks/` |
| Server-only (auth, db, env) | `server/` |
| Eve agent | `agent/` |

**Never** create feature folders under `components/` (e.g. `components/dashboard/`) for code that only one segment uses. Prefer `app/(dashboard)/_components/`.

```
✅ app/(dashboard)/_components/home-workspace.tsx
✅ app/(auth)/login/_components/form.tsx
✅ app/(auth)/_components/last-used-method-badge.tsx
✅ components/ui/button.tsx

❌ components/dashboard/home-workspace.tsx
❌ components/auth/login-form.tsx
```

## Naming

- **Files and directories:** `kebab-case`, short.
- **Drop redundant path context** when the folder already names the feature:
  - `app/(auth)/login/_components/form.tsx` — not `login-form.tsx`
  - `app/(auth)/login/_components/google.tsx` — not `google-login-button.tsx`
- Keep a short descriptor when the folder is generic (`_components/`):
  - `home-workspace.tsx`, `audio-context-bar.tsx`, `app-sidebar.tsx`
- **Exports** stay idiomatic TS/React (`PascalCase` components, `camelCase` functions).
- Route files keep Next.js names: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`.
- Route groups use parentheses: `(auth)`, `(dashboard)` — organization only, no URL segment.
- Private App Router folders start with `_` (e.g. `_components`).

## Imports

- **Within the same segment:** relative (`./form`, `../_components/...`).
- **Shared UI / lib / hooks / server:** alias `@/` (`@/components/ui/button`, `@/lib/utils`, `@/server/auth`).
- Do not deep-import another route’s `_components` to “reuse” — either move the file up to the shared group folder or extract to `components/ui` / `lib` if it is truly cross-app.

## App Router layout

```
app/
  layout.tsx                 # root shell
  globals.css
  (auth)/
    _components/             # shared across auth routes only
    login/
      page.tsx
      _components/           # login-only
    register/
      ...
  (marketing)/
    page.tsx                 # public landing at /
  (dashboard)/
    layout.tsx
    new/page.tsx             # authenticated home at /new
    _components/             # dashboard-only
  api/
    auth/[...all]/route.ts
```

## Other roots

| Path | Role |
| --- | --- |
| `components/ui/` | Design-system primitives (shadcn/Base UI). Broad reuse only. |
| `lib/` | Client-safe utilities and clients (e.g. `auth.ts`, `utils.ts`). |
| `hooks/` | Shared hooks (`use-mobile.ts`). |
| `server/` | Server-only modules (`auth.ts`, `db/`, `env.ts`, `lib/`). |
| `agent/` | Eve agent definition, channels, instructions. |

## Checklist before adding a file

1. Is this only used by one route or group? → put it under that segment’s `_components/`.
2. Is the name kebab-case and free of path-duplicated words?
3. Would putting it in `components/` imply false reuse? → don’t.
4. Imports: relative locally, `@/` for shared roots.
5. After a move, delete empty feature folders under `components/`.

## Anti-patterns

- Feature silos in `components/<feature>/` for single-segment UI
- `PascalCase` or `camelCase` filenames for modules
- `LoginForm.tsx` sitting in a global components folder
- Copy-pasting a colocated component into another route instead of promoting it to the correct shared level
