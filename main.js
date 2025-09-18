document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card.selectable");
  const continueBtn = document.getElementById("continueBtn");

  let selectedPackage = null;

  const params = new URLSearchParams(window.location.search);
  const preselected = params.get("package");

  if (preselected) {
    const card = document.querySelector(`.card[data-package="${preselected}"]`);
    if (card) {
      selectCard(card);
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      selectCard(card);
    });
  });

  continueBtn.addEventListener("click", () => {
    if (selectedPackage) {
      window.location.href = `details.html?package=${selectedPackage}`;
    }
  });

  function selectCard(card) {
    cards.forEach((c) => {
      c.classList.remove("border-warning", "border-3", "selected");
      const badge = c.querySelector(".check-badge");
      if (badge) badge.style.display = "none";
    });

    card.classList.add("border-warning", "border-3", "selected");

    const badge = card.querySelector(".check-badge");
    if (badge) badge.style.display = "block";

    selectedPackage = card.getAttribute("data-package");

    continueBtn.disabled = false;
    continueBtn.classList.remove("btn-secondary");
    continueBtn.classList.add("btn-warning");
  }
});
