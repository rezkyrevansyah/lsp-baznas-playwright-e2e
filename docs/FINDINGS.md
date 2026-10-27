# Findings – Exploratory Testing Report

**Target:** https://lsp.baznas.go.id (public pages only)
**Date:** October 2026
**Method:** Exploratory testing + automated checks (this repository)

Every issue below has a matching automated test in
[`tests/known-issues/known-issues.spec.ts`](../tests/known-issues/known-issues.spec.ts),
written against the _expected_ behaviour and marked `test.fail()`. When an issue is fixed,
the test passes unexpectedly and Playwright flags it, so the suite stays up to date.

| ID     | Title                                                                 | Area                | Severity | Priority |
| ------ | --------------------------------------------------------------------- | ------------------- | -------- | -------- |
| BUG-01 | Spelling mistakes in homepage copy                                    | Content             | Low      | Low      |
| BUG-02 | "Pemegang Sertifikat" menu item is a dead link (`href="#"`)           | Navigation          | Medium   | High     |
| BUG-03 | Non-existent news article shows generic "Whoops" error instead of 404 | Error handling      | Medium   | Medium   |
| BUG-04 | Scheme names on homepage differ from the official scheme list         | Content consistency | Medium   | Medium   |
| BUG-05 | `<html lang="en">` on Indonesian-language pages                       | Accessibility / SEO | Low      | Medium   |
| BUG-06 | Most pages share the same `<title>` "LSP BAZNAS"                      | SEO                 | Low      | Low      |
| BUG-07 | Only `<h1>` on each page is the logo, with no text                    | Accessibility / SEO | Low      | Low      |
| BUG-08 | "Legalitas" page shows a broken image (`<img src="">`)                | Content             | Medium   | Medium   |
| BUG-09 | News article pages download ~68 MB of images                          | Performance         | High     | High     |

---

### BUG-01 – Spelling mistakes in homepage copy

- **Steps:** Open the homepage and read the intro and the "Proses Uji Kompetensi" section.
- **Actual:** The copy contains typos: "kompten" (→ _kompeten_), "menguupload" (→ _mengunggah/mengupload_), "terhadapa" (→ _terhadap_), "melalu metode" (→ _melalui_).
- **Expected:** Copy is free of spelling mistakes.

### BUG-02 – "Pemegang Sertifikat" is a dead link

- **Steps:** Hover **Sertifikasi** → click **Pemegang Sertifikat**.
- **Actual:** The link is `href="#"`; nothing happens. The homepage still advertises 3000 certificate holders.
- **Expected:** The link opens a list or search page for certificate holders, or the item is hidden until the page exists.

### BUG-03 – Invalid news ID shows a generic error page

- **Steps:** Open `/berita/999999/artikel-tidak-ada`.
- **Actual:** The page shows "Whoops! We seem to have hit a snag. Please try again later..."
- **Expected:** A 404 "not found" page, like the one shown for other unknown URLs.

### BUG-04 – Inconsistent scheme names

- **Steps:** Compare the scheme cards on the homepage with `/skema_sertifikasi`.
- **Actual (examples):**
  - Homepage: "Manager Pendistribusian dan **Pemberdayaan** Zakat". Skema page: "MANAJER PENDISTRIBUSIAN DAN **PEDAYAGUNAAN** ZAKAT".
  - Homepage: "**Pelaksana Kepala** Daerah". Skema page: "**KEPALA PELAKSANA** BAZNAS DAERAH".
  - "Manager" vs "Manajer".
- **Expected:** The same official scheme names are used everywhere.

### BUG-05 – Wrong document language

- **Actual:** `<html lang="en">` while all content is in Bahasa Indonesia.
- **Impact:** Screen readers use English pronunciation, and search engines may mis-classify the language (WCAG 3.1.1).
- **Expected:** `<html lang="id">`.

### BUG-06 – Non-unique page titles

- **Actual:** `/`, `/skema_sertifikasi`, `/asesor_kompetensi`, `/jadwal`, `/faq` and news detail pages all use the title "LSP BAZNAS".
- **Expected:** Descriptive titles, for example "Jadwal Uji Kompetensi | LSP BAZNAS" (WCAG 2.4.2).

### BUG-07 – Empty `<h1>`

- **Actual:** The only `<h1>` wraps the logo image and has no text; page titles are `<h2>`.
- **Expected:** Exactly one meaningful `<h1>` per page.

### BUG-08 – Broken image on the "Legalitas" page

- **Steps:** Hover **Profil** → click **Legalitas** (`/profile/5/legalitas-lsp`).
- **Actual:** Directly under the "Legalitas" heading the page renders `<img src="" class="img-fluid text-center">`. The browser shows a broken image, and the empty `src` makes it request the page URL again. The other Profil pages (Sejarah, Visi & Misi, Struktur Organisasi) have no broken images.
- **Expected:** The legality document image is shown, or the `<img>` is left out when no image has been uploaded.

### BUG-09 – News article pages are extremely heavy

- **Steps:** Open `/berita` → open any article, for example `/berita/177/...`.
- **Actual (measured Oct 2026, desktop Chromium):** 92 requests, **~68 MB** transferred, and the `load` event fires after **~25 s**. 73 of the 75 images belong to the "Berita Terkait" sidebar, which lists ~70 articles. Each 75 px thumbnail loads the original upload, up to 4000×3000 px and ~2 MB (for example a 2372×2965 PNG shown at 75×94). No image uses `loading="lazy"`.
- **Impact:** Very slow on mobile data and expensive for visitors on metered connections. A single article view costs more data than most full websites.
- **Expected:** "Berita Terkait" shows a handful of items with resized thumbnails (a few KB each) and lazy loading. The whole page stays within a few MB.

---

## Other observations (not automated as bugs)

- The DataTables UI (Search, "Showing x to y of z entries", "No matching records found") is in English on an Indonesian site.
- On the registration form only **Username** has HTML5 `required`. Other mandatory fields (marked `*`) are not validated client-side. Server-side validation was **not** tested, because the form is never submitted on production.
- The register page footer shows "© 2024".
- The homepage transfers ~9.6 MB. The hero image `Cover_Web_LSP_-_2.png` alone is ~4.5 MB, and three more carousel PNGs are ~1.3–1.9 MB each. These are lighter than BUG-09 but would benefit from the same resizing and WebP/JPEG conversion.
- Positive: homepage statistics (7 schemes, 14 TUK, 73 assessors) **match** the published data (see `data-consistency.spec.ts`).
