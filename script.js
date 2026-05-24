/* ==================================================
   NovaEdge Landing Page Interactions
================================================== */

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navPanel = document.getElementById("navPanel");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

let countersStarted = false;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  menuToggle.classList.remove("active");
  navPanel.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
}

function setActiveLink() {
  let currentId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1700;
  const startTime = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = `${target}+`;
    }
  }

  requestAnimationFrame(updateCounter);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(animateCounter);
      }
    });
  },
  { threshold: 0.35 }
);

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field, message) {
  const group = field.closest(".field-group");
  const error = group.querySelector(".error-message");

  group.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  let isValid = true;

  setFieldError(name, "");
  setFieldError(email, "");
  setFieldError(message, "");
  formStatus.textContent = "";

  if (name.value.trim().length < 2) {
    setFieldError(name, "Please enter your full name.");
    isValid = false;
  }

  if (!validateEmail(email.value.trim())) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (message.value.trim().length < 12) {
    setFieldError(message, "Please share a little more about your project.");
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = "Please fix the highlighted fields.";
    return;
  }

  formStatus.textContent = "Thanks! Your message is ready to send.";
  contactForm.reset();
}

menuToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  updateHeader();
  setActiveLink();
});

revealItems.forEach((item) => revealObserver.observe(item));

if (counters.length > 0) {
  counterObserver.observe(counters[0].closest(".stats-grid"));
}

if (contactForm) {
  contactForm.addEventListener("submit", handleFormSubmit);
}

updateHeader();
setActiveLink();
