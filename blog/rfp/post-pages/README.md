# post-pages

| Field | Value |
|---|---|
| RFT ID | RFT-003 (tests) / RFT-002 (header menu) |
| Feature slug | `post-pages` |
| Branch | `feature/post-pages` |
| Status | DONE — merged into `main` |
| Live | https://blog22oct.web.app |
| Merged | 2026-10-22 via PR (feature/post-pages → main) |

## Goal
10 real blog post pages, reachable from the header "Writing" dropdown, each with its own content and styling.

## Scope
- 10 posts with title, tag, date, read time, excerpt and body
- Generated post pages at `/posts/<slug>.html` + a posts index at `/posts/`
- Header dropdown items link to the real pages
- Same header/nav (with 10-post dropdown) on every page

## Non-goals
- Comments, search, tags archive, RSS feed
- CMS / markdown authoring pipeline (content lives in `data/posts.json`)

## Acceptance criteria
| # | Given | When | Then |
|---|---|---|---|
| AC1 | user opens the Writing menu | sees 10 items | each item shows title + tag/read-time |
| AC2 | user clicks a menu item | navigates | the matching post page opens (HTTP 200) with matching H1 |
| AC3 | user visits `/posts/` | page loads | index lists all 10 posts, each linking to its page |
| AC4 | user is on mobile | opens hamburger then Writing | accordion expands and lists 10 posts |
| AC5 | any page loads | build runs | `public/` contains index.html, assets, posts |

## Status board
| Item | Status |
|---|---|
| Requirement approved | [x] |
| Branch created | [x] |
| Test cases written | [x] |
| Implementation | [x] |
| All tests passing | [x] — 42 passed, 6 skipped (desktop + mobile) |
| Build green | [x] |
| Deployed | [x] — https://blog22oct.web.app |

Files: `requirement.md` - `test-cases.md` - `tests/RFT-003-post-pages.spec.js`
