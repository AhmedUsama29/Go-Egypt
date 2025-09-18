document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const selectedPackage = params.get("package");

  // packages
  const packages = {
    cairo: {
      name: "Cairo & Giza Explorer",
      days: "3 days",
      desc: "Explore the wonders of Cairo and Giza, including the Great Pyramids, Sphinx, and Egyptian Museum.",
      price: "$499 per person",
      img: "Giza.jpg",
    },
    nile: {
      name: "Nile Adventure",
      days: "3 days",
      desc: "Cruise down the Nile River and discover the ancient temples of Luxor and Aswan.",
      price: "$599 per person",
      img: "Nile.jpg",
    },
    redsea: {
      name: "Red Sea Retreat",
      days: "4 days",
      desc: "Relax on the beautiful beaches of Hurghada and snorkel in the crystal-clear waters of the Red Sea.",
      price: "$799 per person",
      img: "Redsea.jpg",
    },
  };

  const imgEl = document.getElementById("packageImage");
  const nameEl = document.getElementById("packageName");
  const daysEl = document.getElementById("packageDays");
  const descEl = document.getElementById("packageDesc");
  const priceEl = document.getElementById("packagePrice");

  if (selectedPackage && packages[selectedPackage]) {
    const pkg = packages[selectedPackage];
    imgEl.src = pkg.img;
    nameEl.textContent = pkg.name;
    daysEl.textContent = pkg.days;
    descEl.textContent = pkg.desc;
    priceEl.textContent = pkg.price;
  } else {
    nameEl.textContent = "No package selected!";
  }
  // back to package
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (selectedPackage) {
        window.location.href = `index.html?package=${selectedPackage}`;
      } else {
        window.location.href = "index.html";
      }
    });
  }
});
