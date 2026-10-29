# Alex HM Portfolio

Source for Alex Haddow-Mendes's portfolio website.

## Get set up in VS Code (Windows)

You only need to do this once.

1. **Install the tools.** Install [VS Code](https://code.visualstudio.com/) and [Git for Windows](https://git-scm.com/download/win) if you don't have them.
2. **Clone the repo.** In VS Code, press `Ctrl+Shift+P`, run **Git: Clone**, paste `https://github.com/alexhaddowmendes/alexhm-portfolio.git`, and pick a folder (for example `Documents\Code`). Choose **Open** when it asks.
3. **Install the recommended extensions.** VS Code shows a pop-up offering the recommended extensions for this repo. Click **Install All**. If you miss it, open the Extensions view (`Ctrl+Shift+X`) and type `@recommended`.
4. **Copy your site files in.** Copy everything from your existing `alexhm-site` folder (your `index.html`, CSS, JS and the `img` folder) into the root of the cloned `alexhm-portfolio` folder, so `index.html` sits next to this README.
5. **Save the first version.** Open the Source Control view (`Ctrl+Shift+G`), type a message such as `Add existing site files`, click **Commit**, then **Sync Changes** to push it to GitHub.

## Preview the site locally

Open `index.html` and click **Go Live** in the bottom-right status bar (or right-click the file and choose **Open with Live Server**). The site opens at <http://localhost:5500> and reloads every time you save a file. Click **Port: 5500** in the status bar to stop it.

## How the site is organised

The site has two kinds of page:

- **Home** (`index.html`): a short intro, then every project as a tile (image, name, year) in two sections, Professional Work and Personal Projects, each newest first, then a short About Me section (photo, bio, skills). "About Me" in the top bar scrolls down to it.
- **Project pages** (`projects/<name>.html`): one page per project, all built from the same template. On the home page, clicking a tile opens the project in an overlay (close with the ✕ in its top right corner, Esc, a click outside, or Back; arrows either side, or the left and right arrow keys, go to the previous and next project); the address bar shows `index.html#project=<name>`, so it can be shared. The project files are only the overlay's content: opening one directly (an old link, a reload) redirects to the home page with that project open, so there are no standalone project pages.

The header (name, nav) and footer (social icons, copyright) are drawn by `site.js`, so you change them in that one file. Each page just has `<site-header></site-header>` and `<site-footer></site-footer>`; add `active="projects"` to the header to highlight that nav link.

Styles live in `style.css`. Images live in `img/`. The CV / Resume link points at the Google Drive copy of the CV (set as `CV_URL` in `site.js`), so update the file on Drive and the site stays current. `_redirects` keeps old URLs (from the previous version of the site and from before this layout) pointing at the right pages once the site is hosted.

## Adding a project

Every project page has the same layout: the name, then **Year / Platform / Engine**, then two columns. The left column is the trailer (or a screenshot) plus any extra videos and images. The right column is a one-line description of the game, **My role**, and **What I did** bullets, with any longer write-up and links underneath.

1. Copy an existing page in `projects/` that's close to what you want, and rename it (lowercase, hyphens, for example `my-new-game.html`).
2. Change the `<title>`, the `description`, the `<h1>`, and the Year, Platform and Engine in the `<dl class="facts">` row.
3. Left column (`project-media`), first item is the main one:
   - a trailer: `<div class="video" data-youtube="VIDEO_ID" data-autoplay data-title="Name: trailer"></div>`. `data-autoplay` makes it start playing automatically with the sound off. For Vimeo use `data-vimeo="ID"`. Leave out `data-autoplay` on any other videos on the page.
   - or a screenshot: `<figure class="figure"><img src="../img/..." alt="..."></figure>`
   - more images go in `<div class="gallery">` as several `figure`s.
4. Right column (`project-copy`): fill in the description (`lead`), your role and the bullets. Use `<h2>` for any extra sections and `<p class="link"><a href="...">...</a></p>` for links.
5. Put the project's images in `img/` (WebP works best).
6. Add a tile for it on `index.html`, in the Professional Work or Personal Projects section, in the right place by year (newest at the top). The previous and next arrows follow the order of these tiles, so they pick the new project up automatically.

## What's in the editor setup

- **Live Server** for the local preview with auto-reload.
- **Prettier** formats HTML, CSS and JS on save, so the code stays tidy.
- **HTML CSS Support** gives class-name autocomplete from your stylesheets.
- **Auto Rename Tag** renames the matching closing tag when you edit an opening one.
- **Code Spell Checker** (British English) catches typos in your page text.

Settings live in `.vscode/settings.json`; `.editorconfig` and `.gitattributes` keep indentation and line endings consistent.
