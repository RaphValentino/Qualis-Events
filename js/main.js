const CONTACT_EMAIL = "";

const galleryItems = [
  { src: "images/guitar-neon.png", caption: "Neon guitar backdrop" },
  { src: "images/notorious-zion.png", caption: "Notorious Zion" },
  { src: "images/cristina-sweet16.png", caption: "Sweet sixteen" },
  { src: "images/marquee-2025.png", caption: "Marquee 2025" },
  { src: "images/pink-bow.png", caption: "Blush arch" },
  { src: "images/tea-cart.png", caption: "Tea cart" },
  { src: "images/candy-cart.png", caption: "Candy cart" },
  { src: "images/autumn-dessert.png", caption: "Autumn soirée" },
  { src: "images/pumpkin-crates.png", caption: "Harvest display" },
  { src: "images/holiday-tree.png", caption: "Holiday tree" },
];

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
const menuLinks = menu.querySelectorAll("a");

function setMenu(open) {
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}

toggle.addEventListener("click", () => setMenu(menu.hidden));
menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
let activeIndex = 0;

function openLightbox(index) {
  activeIndex = index;
  const item = galleryItems[activeIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function stepLightbox(delta) {
  activeIndex = (activeIndex + delta + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption;
}

document.querySelectorAll(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => openLightbox(Number(button.dataset.index)));
});

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => stepLightbox(-1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});

const form = document.getElementById("inquire-form");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusEl.classList.remove("is-error");

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    statusEl.classList.add("is-error");
    statusEl.textContent = "Please add your name, email, and a few details.";
    return;
  }

  const phone = String(data.get("phone") || "").trim();
  const date = String(data.get("date") || "").trim();
  const type = String(data.get("type") || "").trim();

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    date && `Event date: ${date}`,
    type && `Event type: ${type}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = encodeURIComponent(`Event inquiry from ${name}`);
  const to = CONTACT_EMAIL ? encodeURIComponent(CONTACT_EMAIL) : "";
  window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`;

  statusEl.textContent = "Your email app should open with the inquiry. If it doesn’t, copy your details and send them directly.";
  form.reset();
});
