# Antonella D'Angelo — AI Creative Director (static site)

Hand-written static site: **plain HTML + CSS + vanilla JavaScript**. No framework, no bundler, no build step.
The only external dependency is Google Fonts (Barlow Condensed, Cormorant Garamond, IBM Plex Mono).

```
public/                    ← everything Cloudflare serves (the "output directory")
├─ index.html              homepage (served at /)
├─ 404.html                custom not-found page
├─ css/styles.css          all styling
├─ js/main.js              scroll reveals, carousels, slider, menu, reel playback
├─ assets/img/             68 photos (content-hashed names → cached forever)
├─ assets/video/           reel .mp4 + poster
├─ og-image.jpg            1200×630 social-share image
├─ favicon.svg  robots.txt  sitemap.xml
└─ _headers                security + cache headers for Cloudflare Pages
package.json  wrangler.toml  scripts/  README.md
```

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | **(leave empty)** — if the dashboard insists on a value, use `exit 0` |
| Build output directory | **`public`** |
| Root directory | `/` (repository root) |

## 1. Before you deploy

1. Run once (replace with your real domain, no `https://`):
   `npm run set-domain -- yourdomain.com`
   (or find-and-replace `YOUR-DOMAIN.com` in `public/index.html`, `public/sitemap.xml`, `public/robots.txt`)
2. Optional check: `npm run check` (confirms every image, link and anchor resolves).
3. Optional preview: `npm run dev` → http://localhost:3000

## 2. Deploy (pick one)

**A. Drag-and-drop (no Git, no terminal)**
Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Upload assets* → name the project → drag the **`public` folder** in → *Deploy*.
Make sure `index.html` ends up at the top level of the upload.

**B. Git (auto-deploys on every push)**
Push this folder to GitHub/GitLab → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → select the repo → use the settings table above → *Save and Deploy*.

**C. Command line**
`npm run deploy` (uses Wrangler; log in with `npx wrangler login` the first time).

You get a free `https://<project>.pages.dev` address immediately. Test the site there first.

## 3. Custom domain from Namecheap

Cloudflare Pages needs Cloudflare to run the DNS for a root domain (`yourdomain.com`), so the cleanest setup is to point the Namecheap nameservers at Cloudflare. You keep the domain registered at Namecheap.

1. **Cloudflare** → *Add a domain* → enter `yourdomain.com` → choose the **Free** plan. Cloudflare shows two nameservers (e.g. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
2. **Namecheap** → *Domain List* → *Manage* next to the domain → *Nameservers* → **Custom DNS** → paste the two Cloudflare nameservers → click the ✓.
   If *DNSSEC* is enabled in Namecheap, turn it off first. Remove any old DNS records you don't need once Cloudflare imports them.
3. Wait for Cloudflare to email you that the domain is active (usually minutes, up to 24 h).
4. **Cloudflare** → *Workers & Pages* → your project → *Custom domains* → *Set up a custom domain* → enter `yourdomain.com` → confirm. Cloudflare creates the DNS record and issues the HTTPS certificate automatically.
5. Repeat step 4 for `www.yourdomain.com`.
6. Make `www` redirect to the root domain: *Rules* → *Redirect Rules* → create a rule: if hostname equals `www.yourdomain.com` → redirect (301) to `https://yourdomain.com/` keeping the path.
7. *SSL/TLS* → *Edge Certificates* → turn **Always Use HTTPS** on.
8. Re-run `npm run set-domain -- yourdomain.com` if you haven't, then redeploy so canonical/Open Graph/sitemap use the real domain.

If you prefer to keep Namecheap DNS, only a **subdomain** (e.g. `www`) can point at Pages, via a CNAME to `<project>.pages.dev`. The root domain cannot.

## 4. Editing

* **Text/links:** `public/index.html` (email and Instagram are in the contact section).
* **Swap a photo:** replace the file in `public/assets/img/` (keep the name, or update the matching `url(../assets/img/…)` in `public/css/styles.css`). If you keep the same file name after changing the content, rename it (or add `?v=2` to the url) because images are cached for a year.
* **Colours/fonts:** CSS variables at the top of `public/css/styles.css`.

## Notes

* "View project →" buttons currently scroll to the contact section; point them at real case-study pages when you have them.
* The site loads Google Fonts from Google's servers. If you need a fully self-hosted setup (privacy/GDPR), download the three font families and replace the `<link>` with local `@font-face` rules.
* Optional stricter security header (add to `/*` in `public/_headers` after testing):
  `Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; script-src 'self'; frame-ancestors 'self'; base-uri 'self'`
