const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const modal = document.querySelector("[data-gallery-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalTitle = document.querySelector("[data-modal-title]");
const videoModal = document.querySelector("[data-video-modal]");
const modalVideo = document.querySelector("[data-modal-video]");
const toast = document.querySelector("[data-toast]");
const collaboratorCarousel = document.querySelector("[data-collaborator-carousel]");
const galleryTabs = [...document.querySelectorAll("[data-gallery-tab]")];
const galleryPanels = [...document.querySelectorAll("[data-gallery-panel]")];
const pixCopyButton = document.querySelector("[data-copy-pix]");
let toastTimer;

const closeMenu = () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menu.classList.toggle("open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  document.body.classList.toggle("menu-open", !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

const activateGalleryTab = (selectedTab) => {
  const selectedPanel = selectedTab.dataset.galleryTab;

  galleryTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  galleryPanels.forEach((panel) => {
    panel.hidden = panel.dataset.galleryPanel !== selectedPanel;
  });
};

galleryTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateGalleryTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + galleryTabs.length) % galleryTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % galleryTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = galleryTabs.length - 1;

    activateGalleryTab(galleryTabs[nextIndex]);
    galleryTabs[nextIndex].focus();
  });
});

document.querySelectorAll("[data-gallery-item]").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = item.dataset.title;
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});

const closeModal = () => {
  modal.close();
  document.body.classList.remove("modal-open");
};

document.querySelector("[data-modal-close]").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
modal.addEventListener("cancel", () => document.body.classList.remove("modal-open"));

const closeVideoModal = () => {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  videoModal.close();
  document.body.classList.remove("modal-open");
};

document.querySelectorAll("[data-video-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    modalVideo.src = trigger.dataset.videoSrc;
    videoModal.showModal();
    document.body.classList.add("modal-open");
    modalVideo.play().catch(() => {
      /* Os controles permanecem disponíveis caso o navegador bloqueie a reprodução automática. */
    });
  });
});

document.querySelector("[data-video-modal-close]").addEventListener("click", closeVideoModal);
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideoModal();
});
videoModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeVideoModal();
});

document.querySelectorAll("[data-social-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") !== "#") return;
    event.preventDefault();
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
  });
});

if (pixCopyButton) {
  const copyLabel = pixCopyButton.querySelector("[data-copy-label]");
  const copyStatus = document.querySelector("[data-copy-status]");

  pixCopyButton.addEventListener("click", async () => {
    const pixKey = pixCopyButton.dataset.pixKey;
    let copied = false;

    try {
      await navigator.clipboard.writeText(pixKey);
      copied = true;
    } catch {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = pixKey;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      copied = document.execCommand("copy");
      temporaryInput.remove();
    }

    copyLabel.textContent = copied ? "Chave copiada!" : "Copie: 52609619000100";
    copyStatus.textContent = copied ? "CNPJ copiado para a área de transferência." : "Não foi possível copiar automaticamente.";
    window.setTimeout(() => {
      copyLabel.textContent = "Copiar chave Pix";
      copyStatus.textContent = "";
    }, 3200);
  });
}

if (collaboratorCarousel) {
  const viewport = collaboratorCarousel.querySelector("[data-carousel-viewport]");
  const track = collaboratorCarousel.querySelector("[data-carousel-track]");
  const previousButton = collaboratorCarousel.querySelector("[data-carousel-prev]");
  const nextButton = collaboratorCarousel.querySelector("[data-carousel-next]");
  let updateFrame;

  const getStep = () => {
    const card = track.querySelector(".collaborator-card");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const updateCarouselControls = () => {
    previousButton.disabled = viewport.scrollLeft <= 2;
    nextButton.disabled = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
  };

  const moveCarousel = (direction) => {
    viewport.scrollBy({ left: getStep() * direction, behavior: "smooth" });
  };

  previousButton.addEventListener("click", () => moveCarousel(-1));
  nextButton.addEventListener("click", () => moveCarousel(1));
  viewport.addEventListener("scroll", () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(updateCarouselControls);
  }, { passive: true });
  viewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveCarousel(event.key === "ArrowRight" ? 1 : -1);
  });
  window.addEventListener("resize", updateCarouselControls);
  updateCarouselControls();
}

const currentYear = document.querySelector("[data-current-year]");
if (currentYear) currentYear.textContent = new Date().getFullYear();
