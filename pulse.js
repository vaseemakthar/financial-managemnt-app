document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  let cards = Array.from(document.querySelectorAll(".deconstructed-card"));
  const prevBtn = document.querySelector(".carousel-button.prev");
  const nextBtn = document.querySelector(".carousel-button.next");
  const dotsContainer = document.querySelector(".dots-container");

  const cardMargin = 40;
  let cardWidth = cards[0].offsetWidth;
  let totalCardWidth = cardWidth + cardMargin;

  let isTransitioning = false;
  let currentIndex = 0;

  function cloneCards() {
    const clones = document.querySelectorAll(".deconstructed-card.clone");
    clones.forEach(clone => clone.remove());

    const cloneCount = cards.length;
    for (let i = 0; i < cloneCount; i++) {
      const cloneStart = cards[i].cloneNode(true);
      const cloneEnd = cards[i].cloneNode(true);
      cloneStart.classList.add("clone");
      cloneEnd.classList.add("clone");
      track.appendChild(cloneEnd);
      track.insertBefore(cloneStart, track.firstChild);
    }
    cards = Array.from(track.querySelectorAll(".deconstructed-card"));
    currentIndex = cloneCount;
    updateCarousel(false);
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < cards.length / 3; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToCard(i + cards.length / 3));
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel(animated = true) {
    const translateX = -currentIndex * totalCardWidth;
    if (!animated) {
      track.style.transition = "none";
    } else {
      track.style.transition = "transform 0.6s ease";
    }
    track.style.transform = `translateX(${translateX}px)`;

    const dotIndex = (currentIndex % (cards.length / 3));
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === dotIndex);
    });
  }

  function goToCard(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    updateCarousel(true);
  }

  track.addEventListener("transitionend", () => {
    const originalLength = cards.length / 3;
    if (currentIndex >= cards.length - originalLength) {
      currentIndex = originalLength;
      updateCarousel(false);
    } else if (currentIndex < originalLength) {
      currentIndex = cards.length - (2 * originalLength);
      updateCarousel(false);
    }
    isTransitioning = false;
  });

  prevBtn.addEventListener("click", () => goToCard(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToCard(currentIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToCard(currentIndex - 1);
    else if (e.key === "ArrowRight") goToCard(currentIndex + 1);
  });

  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    if (touchStartX - touchEndX > 50) goToCard(currentIndex + 1);
    else if (touchEndX - touchStartX > 50) goToCard(currentIndex - 1);
  }

  window.addEventListener("resize", () => {
    cardWidth = cards[0].offsetWidth;
    totalCardWidth = cardWidth + cardMargin;
    updateCarousel(false);
  });

  cloneCards();
  createDots();
});

