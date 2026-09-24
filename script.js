const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section");
const reveals = document.querySelectorAll(".reveal");
const themeToggle = document.getElementById("themeToggle");

const updateThemeToggle = () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", isDark ? "#20231f" : "#f4f1e9");
};

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateThemeToggle();
});
updateThemeToggle();

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav?.classList.contains("open")) {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    menuToggle?.focus();
  }
});

const setActiveNav = () => {
  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 130) currentId = section.id;
  });
  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("show"));
}

const yearNode = document.getElementById("year");
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

window.addEventListener("scroll", setActiveNav, { passive: true });
window.addEventListener("load", setActiveNav);
setActiveNav();
