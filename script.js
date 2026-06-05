const body = document.body;

window.addEventListener("load", () => {
  body.classList.add("is-loaded");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    navLinks.forEach((navLink) => {
      navLink.classList.toggle("is-active", navLink.getAttribute("href") === targetId);
    });
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", targetId);
  });
});

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateActiveNav = () => {
  const current = sections.reduce((active, section) => {
    const top = section.getBoundingClientRect().top;
    return top <= 170 ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
  });
};

let activeFrame = null;

window.addEventListener("scroll", () => {
  if (activeFrame) {
    return;
  }

  activeFrame = window.requestAnimationFrame(() => {
    updateActiveNav();
    activeFrame = null;
  });
});

updateActiveNav();

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    const label = image.classList.contains("profile-photo") ? "Profile Photo" : "Artwork preview";
    const placeholder =
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 900'%3E%3Crect width='1200' height='900' fill='%23f1f1f3'/%3E%3Cpath d='M0 0 1200 900M1200 0 0 900' stroke='%23d7d7dc' stroke-width='3'/%3E%3Ctext x='600' y='455' text-anchor='middle' font-family='Arial, sans-serif' font-size='34' fill='%2377777c'%3E${label}%3C/text%3E%3C/svg%3E`;

    image.src = placeholder;
    image.classList.add("is-missing");
    image.alt = `${image.alt || "Artwork"} image placeholder`;
  });
});
