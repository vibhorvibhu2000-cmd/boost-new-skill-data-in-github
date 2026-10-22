// Static site build for Emberlog.
// - injects the 10-post header dropdown into index.html (source, in place)
// - generates posts/<slug>.html and posts/index.html (source, in place)
// - copies everything into public/ for Firebase Hosting
//
// Usage: node build.mjs
import { mkdirSync, rmSync, cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

const { posts } = JSON.parse(read('data/posts.json'));
const MARKER = '<!-- BLOG_POSTS_ITEMS -->';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });

const menuItems = posts
  .map(
    (p) => `              <li role="none"><a role="menuitem" href="/posts/${p.slug}.html"><span class="blog-title">${esc(
      p.title
    )}</span><span class="blog-meta">${esc(p.tag)} · ${p.readTime} min</span></a></li>`
  )
  .join('\n');

const nav = (current) => `      <nav class="nav" id="nav" aria-label="Main navigation">
        <div class="nav-item has-menu">
          <button class="nav-link nav-trigger" id="blogMenuBtn" aria-expanded="false" aria-controls="blogMenu">
            Writing <span class="caret" aria-hidden="true">▾</span>
          </button>
          <div class="nav-menu" id="blogMenu" role="menu" aria-labelledby="blogMenuBtn">
            <p class="nav-menu-title">Latest posts</p>
            <ul class="blog-list" id="blogList">
${menuItems}
            </ul>
            <a class="nav-menu-all" href="/posts/">View all posts →</a>
          </div>
        </div>
        <a href="/#topics"${current === 'topics' ? ' aria-current="page"' : ''}>Topics</a>
        <a href="/#about"${current === 'about' ? ' aria-current="page"' : ''}>About</a>
        <a href="/#newsletter" class="btn btn-sm btn-primary">Subscribe</a>
      </nav>

      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>`;

const header = (current) => `  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/">
        <span class="brand-mark" aria-hidden="true">◐</span>
        <span class="brand-name">Emberlog</span>
      </a>

${nav(current)}
    </div>
  </header>`;

const footer = `  <footer class="site-footer">
    <div class="container footer-inner">
      <p class="footer-brand">© 2026 Emberlog</p>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="#">RSS</a>
        <a href="#">GitHub</a>
        <a href="#">Mastodon</a>
        <a href="#">Email</a>
      </nav>
    </div>
  </footer>

  <script src="/assets/js/main.js"></script>`;

// ---------- 1. index.html: inject dropdown items (idempotent) ----------
let indexHtml = read('index.html');
const listBlock = /<ul class="blog-list" id="blogList">[\s\S]*?<\/ul>/;
if (!listBlock.test(indexHtml)) {
  console.error('blog-list <ul> block not found in index.html — nothing injected.');
  process.exit(1);
}
indexHtml = indexHtml.replace(
  listBlock,
  `<ul class="blog-list" id="blogList">\n${menuItems}\n            </ul>`
);
writeFileSync(join(root, 'index.html'), indexHtml, 'utf8');

// ---------- 2. generate post pages ----------
const postsDir = join(root, 'posts');
rmSync(postsDir, { recursive: true, force: true });
mkdirSync(postsDir, { recursive: true });

for (const post of posts) {
  const body = post.body.map((p) => `      <p>${esc(p)}</p>`).join('\n');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(post.title)} — Emberlog</title>
<meta name="description" content="${esc(post.excerpt)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

${header('posts')}

  <main id="main">
    <article class="post">
      <div class="container post-inner">
        <a class="link back-link" href="/posts/">← All posts</a>
        <div class="meta">
          <span class="tag">${esc(post.tag)}</span>
          <time datetime="${post.date}">${fmtDate(post.date)}</time>
          <span>·</span>
          <span>${post.readTime} min read</span>
        </div>
        <h1>${esc(post.title)}</h1>
        <p class="post-lede">${esc(post.excerpt)}</p>
${body}
      </div>
    </article>
  </main>

${footer}
</body>
</html>
`;
  writeFileSync(join(postsDir, `${post.slug}.html`), html, 'utf8');
}

// ---------- 3. posts index ----------
const listItems = posts
  .map(
    (p) => `        <article class="card">
          <div class="meta"><span class="tag">${esc(p.tag)}</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span>·</span><span>${p.readTime} min</span></div>
          <h3><a href="/posts/${p.slug}.html">${esc(p.title)}</a></h3>
          <p>${esc(p.excerpt)}</p>
          <a class="link" href="/posts/${p.slug}.html">Read →</a>
        </article>`
  )
  .join('\n');

const postsIndex = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>All posts — Emberlog</title>
<meta name="description" content="Every post on Emberlog." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

${header('posts')}

  <main id="main">
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>All posts</h2>
          <span class="link">${posts.length} articles</span>
        </div>
        <div class="grid">
${listItems}
        </div>
      </div>
    </section>
  </main>

${footer}
</body>
</html>
`;
writeFileSync(join(postsDir, 'index.html'), postsIndex, 'utf8');

// ---------- 4. copy to public/ ----------
const out = join(root, 'public');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const item of ['index.html', 'assets', 'data', 'posts']) {
  const src = join(root, item);
  if (existsSync(src)) cpSync(src, join(out, item), { recursive: true });
}

console.log(`Built ${posts.length} posts -> posts/ and public/`);
