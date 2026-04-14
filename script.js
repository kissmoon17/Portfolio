const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section");
const reveals = document.querySelectorAll(".reveal");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
  });
});

const setActiveNav = () => {
  let currentId = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentId}`) {
      link.classList.add("active");
    }
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => revealObserver.observe(el));

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);
