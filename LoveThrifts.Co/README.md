# LoveThrifts.Co — Starter

A no-build, static starter website for your thrift store. Edit in VS Code, deploy in minutes.

## Quickstart
1. Open this folder in VS Code.
2. Edit `index.html`, `assets/css/styles.css`, and `assets/js/main.js` with your content.
3. Run locally by simply opening `index.html` in your browser, or serve with a local server:
   ```bash
   # from this folder
   python3 -m http.server 8080
   # or (Node required)
   npx serve .
   ```
4. Deploy (Netlify easiest):
   - Create an account at Netlify.
   - Drag & drop this folder in **Add new site → Deploy manually**.
   - Forms work automatically thanks to `data-netlify="true"`.
   - Optionally connect a GitHub repo for automatic redeploys on push.

## Custom Domain
- If you own a domain (e.g., `lovethrifts.co`), add it in Netlify's **Domain settings** and follow the DNS instructions from your registrar. 
- If `lovethrifts.co` isn't available, consider variants like `lovethrifts.in` or `shoplovethrifts.com`.

## Update Products
Open `assets/js/main.js` and edit the `products` array:
```js
{
  id: "LT-200",
  title: "Blue Mom Jeans",
  price: 749,
  condition: "Great",
  size: "M",
  img: "https://placehold.co/600x800?text=Mom+Jeans"
}
```
Images use remote placeholders; swap with your hosted images or a CDN.

## Contact Form
The form in `index.html` is pre-configured for Netlify Forms. After your first submission, Netlify will create the form entry in your dashboard.

## Analytics & SEO
- Add Google Analytics or Plausible by pasting the script snippet into `index.html` before `</head>`.
- Update meta title/description and Open Graph tags in `<head>`.

## License
This starter is MIT-licensed. © 2025 LoveThrifts.Co
