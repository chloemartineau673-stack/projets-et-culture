---
name: japan-app-cache-busting
description: How to ensure projets-et-culture PWA updates reach phone/other devices
metadata:
  type: project
---

The "Projets & Culture" PWA (repo chloemartineau673-stack/projets-et-culture, deployed via GitHub Pages at https://chloemartineau673-stack.github.io/projets-et-culture/) had recurring "changes don't appear on phone/other computers" complaints due to browser caching of style.css and app.js.

Fix applied: index.html has no-cache meta tags AND query-string versioning on assets (`style.css?v=N`, `app.js?v=N`).

**How to apply:** Every time you change style.css or app.js, BUMP the `?v=N` number in both `<link>` and `<script>` tags in index.html, then commit. Currently at v=8. Without bumping, devices keep serving the old cached file.

Note: the user works on a Windows machine without Node/npm (low disk space) — the app is plain HTML/CSS/JS, deployed by pushing to GitHub Pages. The user is non-technical and follows step-by-step instructions in French.
