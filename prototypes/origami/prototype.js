const variants = {
  1: {
    name: "01 Ridge",
    axis: "Axial fold: one cobalt spine turns ambiguity into evidence."
  },
  2: {
    name: "02 Aperture",
    axis: "Nested aperture: folds progressively frame the core claim."
  },
  3: {
    name: "03 Pleat",
    axis: "Continuous pleat: a vertical fold carries the narrative between scenes."
  }
};

const params = new URLSearchParams(window.location.search);
const selected = variants[params.get("variant")] ? params.get("variant") : "1";
const variantName = document.querySelector("#variant-name");
const variantAxis = document.querySelector("#variant-axis");
const motionToggle = document.querySelector(".motion-toggle");
const motionLabel = document.querySelector(".motion-label");

document.body.dataset.variant = selected;
variantName.textContent = variants[selected].name;
variantAxis.textContent = variants[selected].axis;
document.title = `${variants[selected].name} | Structural Origami Prototype`;

document.querySelectorAll("[data-variant-button]").forEach((link) => {
  const isCurrent = link.dataset.variantButton === selected;
  if (isCurrent) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
  link.title = variants[link.dataset.variantButton].axis;
});

motionToggle.addEventListener("click", () => {
  const isReduced = document.body.dataset.motion === "reduced";
  document.body.dataset.motion = isReduced ? "full" : "reduced";
  motionToggle.setAttribute("aria-pressed", String(!isReduced));
  motionLabel.textContent = isReduced ? "Motion on" : "Static";
});

const sections = document.querySelectorAll(".proof, .system");
const railSteps = document.querySelectorAll(".rail-step");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.28 });

  sections.forEach((section) => revealObserver.observe(section));

  const railObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      railSteps.forEach((step) => {
        step.classList.toggle("is-current", step.hash === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.55 });

  document.querySelectorAll(".scene").forEach((scene) => railObserver.observe(scene));
} else {
  sections.forEach((section) => section.classList.add("is-visible"));
}
