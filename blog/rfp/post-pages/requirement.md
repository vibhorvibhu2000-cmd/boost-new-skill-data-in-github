# Requirement: Post pages

| Field | Value |
|---|---|
| RFT ID | RFT-003 (feature) / RFT-002 (header dropdown) |
| Feature slug | `post-pages` |
| Branch | `feature/post-pages` |
| Status | DONE — merged into `main` |
| Merged | 2026-10-22 via PR (feature/post-pages → main) |
| Owner | Vibhor |
| Created | 2026-10-22 |
| Last updated | 2026-10-22 |

## 1. Requirement

**Goal:** 10 real blog posts, each on its own page, linked from the header "Writing" dropdown.

**Problem:** The header dropdown listed 10 posts but every link was a dead `#post-*` anchor — the blog had no actual post content.

**Scope**
- Content source: `data/posts.json` (single source of truth, 10 posts)
- Build step (`build.mjs`) generates `posts/<slug>.html` for each post + `posts/index.html`
- Header dropdown items injected from the same data source (no drift)
- Post page layout: back link, meta (tag / date / read time), H1, lede, body
- Header/nav (with the 10-post dropdown) present on every page

**Non-goals**
- Search, comments, tag archives, RSS
- A CMS or markdown pipeline

**Actors**
| Actor | Behaviour |
|---|---|
| Reader | Reads the latest posts from the header dropdown |
| Reader | Browses all posts from `/posts/` |

**Data**
| Source | Field | Type | Notes |
|---|---|---|---|
| `data/posts.json` | `slug` | string | URL segment, kebab-case, unique |
| `data/posts.json` | `title` | string | post H1 + dropdown title |
| `data/posts.json` | `tag` | string | category chip |
| `data/posts.json` | `date` | ISO date | shown as "Oct 14, 2026" |
| `data/posts.json` | `readTime` | number | minutes |
| `data/posts.json` | `excerpt` | string | lede + card text |
| `data/posts.json` | `body` | string[] | paragraphs |

## 2. Acceptance criteria (Given / When / Then)

| # | Given | When | Then |
|---|---|---|---|
| AC1 | user opens the Writing menu | sees the items | exactly 10 items, each with title + `tag · N min` |
| AC2 | user clicks a dropdown item | page navigates | HTTP 200, H1 equals the post title, tag/lede/body visible |
| AC3 | user visits `/posts/` | page loads | index lists 10 cards, each linking to its post page |
| AC4 | user is on a 390px viewport | opens hamburger then Writing | accordion expands, 10 posts listed |
| AC5 | developer runs the build | build completes | `public/` contains `index.html`, `assets/`, `posts/` (10 + index) |
| AC6 | user presses Escape | Writing menu is open | menu closes, button `aria-expanded=false` |

**Edge cases**
- Post page loaded directly (no home page visit) → header dropdown still has 10 posts
- Mobile: menu hidden until hamburger clicked
- Invalid email in subscribe form → error message, no success state

## 3. Test cases

| # | Test case | Type | Spec file | Test name |
|---|---|---|---|---|
| TC1 | posts index lists 10 posts | happy | `tests/RFT-003-post-pages.spec.js` | `posts index lists all 10 posts` |
| TC2 | each post page renders with matching H1 | happy (x10) | same | `post page renders: <title>` |
| TC3 | post page keeps the 10-post dropdown | edge | same | `post page header dropdown still lists 10 posts` |
| TC4 | back link returns to the posts index | happy | same | `post page links back to the posts index` |
| TC5 | dropdown closed by default, opens on click | happy | `tests/RFT-002-header-menu.spec.js` | `Writing menu is closed by default and opens on click` |
| TC6 | dropdown shows 10 posts with meta | happy | same | `Writing menu lists 10 posts with title and meta` |
| TC7 | Escape closes the dropdown | a11y | same | `Writing menu closes on Escape` |
| TC8 | dropdown links resolve to real pages | happy | same | `Writing menu links point to real post pages` |
| TC9 | mobile: hamburger + accordion shows 10 posts | responsive | same | `mobile: hamburger opens nav and Writing accordion lists 10 posts` |
| TC10 | subscribe rejects invalid email | error | `tests/RFT-001-home.spec.js` | `subscribe rejects an invalid email` |

Full list: `test-cases.md`

## 4. Files touched

| File | Change |
|---|---|
| `data/posts.json` | added — 10 posts (title, slug, tag, date, readTime, excerpt, body) |
| `build.mjs` | modified — injects dropdown items, generates `posts/*.html`, copies `public/` |
| `index.html` | modified — dropdown list injected from data, absolute asset paths |
| `posts/*.html` | added — 10 post pages + posts index (generated) |
| `assets/css/styles.css` | modified — `.post`, `.post-lede`, `.back-link` styles |
| `tests/RFT-002-header-menu.spec.js` | modified — expects real `/posts/<slug>.html` links |
| `tests/RFT-003-post-pages.spec.js` | added — 13 post page tests |
| `package.json` | modified — `build` / `serve` / `test` / `deploy` scripts |
| `firebase.json`, `.firebaserc` | added — hosting config for project `blog22oct` |
| `.gitignore` | added |

## 5. Verification

| Command | Result |
|---|---|
| `npm.cmd run build` | Built 10 posts -> posts/ and public/ |
| `npx.cmd playwright test` | 42 passed, 6 skipped (desktop-chromium + mobile-chromium) |
| `playwright.cmd screenshot https://blog22oct.web.app/` | live page renders correctly |
| `firebase.cmd deploy --only hosting --project blog22oct` | Deploy complete — https://blog22oct.web.app |

## 6. Status

- [x] Requirement discussed & approved
- [x] Branch created (`feature/post-pages`)
- [x] Test cases written (red run confirmed)
- [x] Implementation done
- [x] All tests passing
- [x] Build green
- [x] Deployed — https://blog22oct.web.app
- [x] Merged into `main` (PR: feature/post-pages → main)
