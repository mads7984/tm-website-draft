# Tower Medic Pharmacy Website

A responsive, multi-page website for Tower Medic Pharmacy. The site is built with plain HTML, CSS, and JavaScript and does not require a build system or external framework.

## Pages

- `index.html` — Home page
- `medications.html` — Compounded medication categories
- `lab.html` — Laboratory and quality information
- `history.html` — Pharmacy history
- `contact.html` — Contact and refill information
- `privacy.html` — HIPAA Notice of Privacy Practices

## Shared files

- `styles.css` — Site-wide layout, colors, typography, and responsive styles
- `script.js` — Mobile navigation and footer links
- `images/` — Tower Medic logo and other local image assets

## Preview locally

The HTML files can be opened directly in a browser. To preview the site through a local web server, run this command from the project directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in a browser.

## Updating shared information

The navigation and footer are included in each HTML file. When changing company information such as the address, phone number, fax number, email, or store hours, update every page so the details remain consistent.

The primary brand color is `#034694`. The site uses a system font stack and does not load Google Fonts or another external font service.

## External links

- Prescription refill portal: `https://4520513.winrxrefill.com/`
- Google review page: `https://g.page/r/CbZ0r3sUOhBYEB0/review`

## Technology

- HTML5
- CSS3
- Vanilla JavaScript

