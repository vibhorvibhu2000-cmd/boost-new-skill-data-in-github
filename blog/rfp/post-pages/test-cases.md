# Test cases — Post pages

RFT: RFT-003 (feature) / RFT-002 (header dropdown) · Branch: `feature/post-pages`
Runner: Playwright · Specs: `tests/RFT-003-post-pages.spec.js`, `tests/RFT-002-header-menu.spec.js`, `tests/RFT-001-home.spec.js`

Conventions:
- 1 feature = 1 spec file
- locator priority: `data-testid` → role → text
- mobile: open `#navToggle` before `#blogMenuBtn`
- verification sirf Playwright suite se — ad-hoc scripts nahi

## TC1 — Posts index lists all 10 posts
| | |
|---|---|
| Type | Happy path |
| Preconditions | homepage loaded |
| Steps | 1. go to `/posts/` 2. count `.grid .card` |
| Expected | 10 cards, each with title + tag + "Read →" link |
| Spec test | `posts index lists all 10 posts` |
| Status | [x] |

## TC2 — Each post page renders its own content
| | |
|---|---|
| Type | Happy path (10 cases) |
| Preconditions | build generated `posts/*.html` |
| Steps | 1. go to `/posts/<slug>.html` 2. check status 3. check H1 / tag / lede / body |
| Expected | HTTP 200, H1 === post title, tag + lede + ≥1 paragraph visible |
| Spec test | `post page renders: <title>` |
| Status | [x] |

## TC3 — Post page keeps the 10-post dropdown
| | |
|---|---|
| Type | Edge (direct navigation) |
| Preconditions | none |
| Steps | 1. open a post page directly 2. (mobile: open hamburger) 3. click Writing |
| Expected | 10 items listed |
| Spec test | `post page header dropdown still lists 10 posts` |
| Status | [x] |

## TC4 — Back link returns to the posts index
| | |
|---|---|
| Type | Happy path |
| Preconditions | on a post page |
| Steps | 1. click `.back-link` 2. check URL + cards |
| Expected | URL ends with `/posts/`, 10 cards visible |
| Spec test | `post page links back to the posts index` |
| Status | [x] |

## TC5 — Writing menu closed by default, opens on click
| | |
|---|---|
| Type | Happy path |
| Steps | 1. assert `#blogMenu` hidden 2. click `#blogMenuBtn` 3. assert visible + `aria-expanded=true` |
| Expected | menu opens, ARIA state correct |
| Spec test | `Writing menu is closed by default and opens on click` |
| Status | [x] |

## TC6 — Writing menu shows 10 posts with meta
| | |
|---|---|
| Type | Happy path |
| Steps | 1. open menu 2. count `li` 3. check each title + meta |
| Expected | 10 items, each with a title and `tag · N min` |
| Spec test | `Writing menu lists 10 posts with title and meta` |
| Status | [x] |

## TC7 — Escape closes the dropdown
| | |
|---|---|
| Type | Accessibility |
| Steps | 1. open menu 2. press Escape |
| Expected | menu hidden, `aria-expanded=false` |
| Spec test | `Writing menu closes on Escape` |
| Status | [x] |

## TC8 — Dropdown links resolve to real post pages
| | |
|---|---|
| Type | Happy path |
| Steps | 1. open menu 2. read all `href` |
| Expected | 10 hrefs, each `/posts/<kebab-slug>.html` |
| Spec test | `Writing menu links point to real post pages` |
| Status | [x] |

## TC9 — Mobile: hamburger + accordion
| | |
|---|---|
| Type | Responsive (390×844) |
| Steps | 1. click `#navToggle` 2. assert nav visible 3. click `#blogMenuBtn` 4. count items |
| Expected | nav opens, accordion expands with 10 posts |
| Spec test | `mobile: hamburger opens nav and Writing accordion lists 10 posts` |
| Status | [x] |

## TC10 — Subscribe form validation
| | |
|---|---|
| Type | Error + happy |
| Steps | 1. submit invalid email 2. submit valid email |
| Expected | error class + "valid email" message; success message contains the email |
| Spec test | `subscribe rejects an invalid email` / `subscribe accepts a valid email` |
| Status | [x] |

---

## Coverage matrix

| AC | Covered by |
|---|---|
| AC1 | TC6 |
| AC2 | TC2 |
| AC3 | TC1 |
| AC4 | TC9 |
| AC5 | build + deploy verification |
| AC6 | TC7 |
