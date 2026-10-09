# ardeleanuthea.github.io

The personal site and CV of Thea Ardeleanu, in English and French.

**Live at:** https://ardeleanuthea.github.io · **Level:** Essential · **Status:** live

## What it does

A one-page site that presents my work, with a switch between English and French, and a printable CV that
can be downloaded as a PDF in both languages.

## What is in this repository

| Folder or file | What it is |
|---|---|
| `index.html` | The site: one page, both languages. |
| `cv.html` | The printable CV. `cv.html?lang=en` and `cv.html?lang=fr` choose the language. |
| `assets/site.css`, `assets/site.js` | Look and behaviour of the site. |
| `assets/cv.css`, `assets/cv.js` | Look and behaviour of the CV. |
| `assets/docs/` | The CV as PDF, in English and French, and certificates. |
| `assets/img/` | Images. |
| `about.html`, `services.html` and the other small pages | Addresses of the previous version of the site. They send visitors to the new page. |
| `robots.txt`, `sitemap.xml` | Information for search engines. |

## Run it on your computer

No installation. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## How it gets published

GitHub Pages serves the `main` branch. A push to `main` is live in about a minute.

After any change to `cv.html`, print the two PDFs in `assets/docs/` again from `cv.html?lang=en` and
`cv.html?lang=fr`, so the downloads match the page. Each stays at two pages at most.

## Who

Built by Thea Ardeleanu.
