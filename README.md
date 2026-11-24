# Payload 3.x admin accessibility reproduction

Minimal reproduction of eight accessibility defects in the Payload 3.x admin panel
(`@payloadcms/ui`, `@payloadcms/next`, `@payloadcms/richtext-lexical`), found with Lighthouse
(axe-core) on the collection list view and the document edit view.

Created with `pnpx create-payload-app@latest -t blank` (Payload **3.94.1**, SQLite adapter), plus:

- a `posts` collection with a `title` text field, an `author` relationship to `users`, a
  `publishedAt` date field and a Lexical `content` rich text field (`src/collections/Posts.ts`);
- an `onInit` seed that, on an empty database, creates one user and 15 posts with an author and a
  date set, so the list paginates with the default limit of 10 (`src/seed.ts`);
- `admin.autoLogin` in development, so the admin opens signed in (`src/payload.config.ts`).

## Run

```bash
cp .env.example .env
pnpm i
pnpm dev
```

The SQLite file is created and seeded on first start. If auto-login is off, sign in with
`dev@payloadcms.com` / `test`.

Open:

- List view: http://localhost:3000/admin/collections/posts
- Edit view: http://localhost:3000/admin/collections/posts/1

## See the failures

Either:

- Chrome DevTools, **Lighthouse** panel, category **Accessibility**, mode **Navigation**, device
  **Desktop**, on each of the two URLs (DevTools reuses the signed-in session); or
- the **axe DevTools** browser extension, **Scan all of my page**, on each URL.

Measured on 3.94.1 with Lighthouse 13.6 (desktop preset): accessibility score **84** on the list
view and **77** on the edit view.

| # | Defect | View | axe rule | Failing node |
|---|---|---|---|---|
| 1 | Pagination arrows have no accessible name | List | `button-name` | `button.clickable-arrow` |
| 2 | Row selection checkboxes render `aria-label=""` | List | `label` | `input[type=checkbox][aria-label=""]` in each row |
| 3 | Document "more options" (three dots) button has no name | Edit | `button-name` | `.doc-controls__controls-wrapper button.popup-button` |
| 4 | react-select indicators are `aria-hidden` yet focusable | Edit | `aria-hidden-focus` | `div.clear-indicator[aria-hidden][tabindex=0]`, `button.dropdown-indicator[aria-hidden]` |
| 5 | Relationship and date field labels point at a wrapper `div`, inputs unnamed | Edit | `label` | `input.rs__input` (relationship), date picker `input[type=text]` |
| 6 | Lexical editor has no accessible name | Edit | `aria-input-field-name` | `div.ContentEditable__root[role=textbox]` |
| 7 | Document tabs are `<a>` directly inside `<ul>` | Edit | `list` | `ul.doc-tabs__tabs` |
| 8 | List view has no `main` landmark | List | `landmark-one-main` | `html` (root is `div.collection-list`) |

Also flagged by Lighthouse on these pages, not part of the eight: `target-size` on the list's sort
buttons (`.sort-column__asc` / `__desc`), and `button-name` plus `target-size` on the date field's
clear button (`button.date-time-picker__clear-button`).
