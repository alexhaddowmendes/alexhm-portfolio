/* Shared header and footer for every page.
   Edit the markup here once and every page picks it up.
   Pages use <site-header active="projects"></site-header> and <site-footer></site-footer>. */

// Links are built from this script's own location, so they work from the root and from projects/.
const SITE_ROOT = new URL("./", document.currentScript.src).href;

// Your CV lives on Google Drive so it's always the latest version. Full web addresses open in a new tab.
const CV_URL = "https://drive.google.com/file/d/1YiyVjwCXGZ6nIqOoYl5G3VqDIDrIgFuC/view?usp=sharing";

const NAV = [
  { id: "projects", label: "Projects", href: "index.html" },
  { id: "about", label: "About Me", href: "index.html#about" },
  { id: "cv", label: "CV / Resume", href: CV_URL },
];

const isExternal = (href) => /^https?:\/\//.test(href);

// On the home page, links to a home-page section (like About Me) just scroll down instead of reloading.
const HOME_PATH = new URL(SITE_ROOT).pathname;
const onHomePage = () => location.pathname === HOME_PATH || location.pathname === `${HOME_PATH}index.html`;
const navHref = (href) => (onHomePage() && href.startsWith("index.html#") ? href.slice("index.html".length) : SITE_ROOT + href);

// Icons are drawn inline (not as image files), so they take the colour of the text around them.
const ICONS = {
  linkedin:
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
};

// Social profiles shown in the footer. Only LinkedIn for now; add more here (and an icon above) if they're worth showing.
const SOCIAL = [
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://uk.linkedin.com/pub/alex-haddow-mendes/a8/337/6b7",
  },
];

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active");
    const links = NAV.map(
      (item) =>
        isExternal(item.href)
          ? `<a href="${item.href}" target="_blank" rel="noopener">${item.label}</a>`
          : `<a href="${navHref(item.href)}" data-nav="${item.id}"${item.id === active ? ' class="active" aria-current="page"' : ""}>${item.label}</a>`,
    ).join("");
    this.innerHTML = `
      <header class="site">
        <a class="brand" href="${SITE_ROOT}index.html">
          <p class="name">Alex Haddow-Mendes</p>
          <p class="role">Senior Technical Game Designer</p>
        </a>
        <nav class="main" aria-label="Main">${links}</nav>
      </header>`;

    // Show a thin line under the header once the page has scrolled (style.css draws it).
    const update = () => this.classList.toggle("scrolled", window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });

    // Share the bar's height with the CSS, so things that stick below it (section headings) sit flush.
    const setHeight = () => document.documentElement.style.setProperty("--header-h", `${this.offsetHeight}px`);
    setHeight();
    new ResizeObserver(setHeight).observe(this);
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const links = NAV.map((item) =>
      isExternal(item.href)
        ? `<a href="${item.href}" target="_blank" rel="noopener">${item.label}</a>`
        : `<a href="${navHref(item.href)}">${item.label}</a>`,
    ).join("");
    const social = SOCIAL.map(
      (item) =>
        `<a href="${item.href}" target="_blank" rel="noopener">${ICONS[item.icon]}${item.label}</a>`,
    ).join("");
    this.innerHTML = `
      <footer class="site">
        <div class="footer-brand">
          <p class="name">Alex Haddow-Mendes</p>
          <p class="role">Senior Technical Game Designer</p>
        </div>
        <nav class="footer-links" aria-label="Footer">${links}${social}</nav>
        <div class="footer-base">
          <p>&copy; ${new Date().getFullYear()} Alex Haddow-Mendes</p>
          <a href="#" class="to-top">Back to top</a>
        </div>
      </footer>`;
    // Share the footer's height with the CSS, so the About section can fill exactly what's left of the screen.
    const setHeight = () => document.documentElement.style.setProperty("--footer-h", `${this.offsetHeight}px`);
    setHeight();
    document.fonts.ready.then(setHeight);
    new ResizeObserver(setHeight).observe(this);
    this.querySelector(".to-top").addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0 });
    });
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

/* Projects only show as an overlay on the home page. The projects/*.html files are the overlay's content,
   so anyone who lands on one directly (an old link, a reload) is sent to the home page with it open. */
const PROJECT_PATH = new URL("projects/", SITE_ROOT).pathname;
const PROJECT_HASH = "#project=";
if (location.pathname.startsWith(PROJECT_PATH)) {
  const slug = location.pathname.split("/").pop().replace(/\.html$/, "");
  location.replace(`${SITE_ROOT}index.html${PROJECT_HASH}${slug}`);
}

/* Videos: <div class="video" data-youtube="ID"> (or data-vimeo="ID") becomes the player. Add data-autoplay
   to the main one and it starts playing automatically with the sound off (browsers only allow muted autoplay). */
function embedVideos(root = document) {
  for (const box of root.querySelectorAll("[data-youtube], [data-vimeo]")) {
    const autoplay = box.hasAttribute("data-autoplay");
    const youtube = box.dataset.youtube;
    const params = new URLSearchParams();
    if (youtube) {
      params.set("rel", "0");
      if (autoplay) for (const [k, v] of [["autoplay", "1"], ["mute", "1"], ["playsinline", "1"]]) params.set(k, v);
    } else if (autoplay) {
      for (const [k, v] of [["autoplay", "1"], ["muted", "1"], ["playsinline", "1"]]) params.set(k, v);
    }
    const frame = document.createElement("iframe");
    frame.src = youtube
      ? `https://www.youtube.com/embed/${youtube}?${params}`
      : `https://player.vimeo.com/video/${box.dataset.vimeo}?${params}`;
    frame.title = box.dataset.title || "Video";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    if (!autoplay) frame.loading = "lazy";
    box.replaceChildren(frame);
  }
}

// Home page About: make the photo a square as tall as the text beside it, with the text filling the rest of the width
// (not on phones, where the photo stacks above). A wider text column is shorter and a bigger photo narrows it,
// so nudge the size a few times until the two settle.
function sizeAboutPhoto() {
  const text = document.querySelector(".about-body > div");
  if (!text) return;
  const root = document.documentElement;
  const stacked = window.matchMedia("(max-width: 900px)");
  const setSize = () => {
    if (stacked.matches) return root.style.setProperty("--about-h", "140px");
    let size = 240;
    for (let i = 0; i < 6; i++) {
      root.style.setProperty("--about-h", `${size}px`);
      size = Math.min(text.offsetHeight, text.parentElement.offsetWidth * 0.4);
    }
    root.style.setProperty("--about-h", `${size}px`);
  };
  setSize();
  document.fonts.ready.then(setSize); // web fonts change the text height once they arrive
  window.addEventListener("resize", setSize);
}

// Home page: highlight About Me in the top bar once the About section fills most of the screen,
// and Projects the rest of the time.
function highlightSectionInNav() {
  const about = document.getElementById("about");
  if (!about) return;
  const update = () => {
    const current = about.getBoundingClientRect().top < window.innerHeight / 2 ? "about" : "projects";
    for (const link of document.querySelectorAll("site-header [data-nav]")) {
      const isCurrent = link.dataset.nav === current;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Home page: clicking a project tile opens that project in an overlay instead of a new page.
   The address bar switches to index.html#project=<name>, so links can be shared and the browser's Back button
   closes the overlay; opening such a link (or the old projects/<name>.html one) shows the overlay over the home page.
   The window has a close button in its top right corner, and previous / next arrows either side of it
   (the arrow keys work too). Both arrows wrap round at the ends of the gallery. */
function setUpProjectOverlays() {
  const tiles = [...document.querySelectorAll("a.tile")];
  const order = tiles.map((tile) => tile.href);
  const homeTitle = document.title;
  let overlay = null;
  let current = null;
  let returnFocus = null;

  async function show(url) {
    let page;
    try {
      page = new DOMParser().parseFromString(await fetch(url).then((r) => r.text()), "text/html");
    } catch {
      return void close(); // if the project can't be loaded (e.g. the site opened straight from disk), stay on the home page
    }
    const article = page.querySelector("main article");
    if (!article) return void close();

    // The project page's paths are relative to projects/, so make them absolute before moving them here
    for (const el of article.querySelectorAll("[src]")) el.src = new URL(el.getAttribute("src"), url).href;
    for (const el of article.querySelectorAll(".project-copy a[href]:not([target])")) {
      el.href = new URL(el.getAttribute("href"), url).href; // links to sibling projects
    }
    // The arrows replace these two
    article.querySelector(".back")?.remove();
    article.querySelector(".next")?.remove();

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML = `
        <button class="overlay-arrow overlay-prev" type="button" aria-label="Previous project">&#8249;</button>
        <div class="overlay-window">
          <button class="overlay-close" type="button" aria-label="Close project">&times;</button>
          <div class="overlay-panel"></div>
        </div>
        <button class="overlay-arrow overlay-next" type="button" aria-label="Next project">&#8250;</button>`;
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay || event.target.closest(".overlay-close")) close();
        else if (event.target.closest(".overlay-prev")) step(-1);
        else if (event.target.closest(".overlay-next")) step(1);
        else {
          // A link to another project inside the write-up (e.g. Old World -> Fight The Light) stays in the overlay
          const link = event.target.closest(".project-copy a");
          const target = link && order.find((href) => href === link.href);
          if (target) {
            event.preventDefault();
            open(target);
          }
        }
      });
      document.body.append(overlay);
      document.documentElement.classList.add("has-overlay");
      overlay.querySelector(".overlay-close").focus();
    }
    current = url;
    const panel = overlay.querySelector(".overlay-panel");
    panel.replaceChildren(article);
    panel.scrollTop = 0;
    embedVideos(panel);
    overlay.setAttribute("aria-label", page.title);
    document.title = page.title;
  }

  function hide() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    current = null;
    document.documentElement.classList.remove("has-overlay");
    document.title = homeTitle;
    returnFocus?.focus({ preventScroll: true });
  }

  // Opening adds a history entry; closing steps back through it, so Back and the close button do the same thing.
  function open(url) {
    const hash = PROJECT_HASH + url.split("/").pop().replace(/\.html$/, "");
    if (history.state?.project) history.replaceState({ project: url }, "", hash);
    else history.pushState({ project: url }, "", hash);
    show(url);
  }

  function close() {
    if (history.state?.project) history.back();
    else hide();
  }

  function step(direction) {
    const i = order.indexOf(current);
    if (i !== -1) open(order[(i + direction + order.length) % order.length]);
  }

  window.addEventListener("popstate", (event) => {
    if (event.state?.project) show(event.state.project);
    else hide();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
  });

  for (const tile of tiles) {
    tile.addEventListener("click", (event) => {
      // Let ctrl/cmd/shift-click and middle-click open the full page as usual
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = tile;
      open(tile.href);
    });
  }
  return open;
}

function setUpHomePage() {
  sizeAboutPhoto();
  highlightSectionInNav();
  const openProject = setUpProjectOverlays();
  // A shared link (index.html#project=<name>): start from the plain home page so Back and close return to it
  if (location.hash.startsWith(PROJECT_HASH)) {
    const url = [...document.querySelectorAll("a.tile")].map((tile) => tile.href).find((href) => href.endsWith(`/${location.hash.slice(PROJECT_HASH.length)}.html`));
    history.replaceState(null, "", location.pathname + location.search);
    if (url) openProject(url);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  for (const link of document.querySelectorAll("a[data-cv]")) link.href = CV_URL;
  if (document.querySelector("a.tile")) setUpHomePage();
});
