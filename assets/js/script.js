document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const skillsBar = document.querySelector(".skills-bar");
  const navbar = document.querySelector(".navbar");
  const backToTop = document.querySelector(".back-to-top");

  // Typing effect setup
  const typedSpan = document.querySelector(".typed-text");
  if (typedSpan) {
    const texts = JSON.parse(typedSpan.getAttribute("data-text"));
    let textIndex = 0;
    let charIndex = 0;
    let currentText = "";
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenTexts = 1500;

    function type() {
      if (textIndex >= texts.length) textIndex = 0;
      const fullText = texts[textIndex];

      if (isDeleting) {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
      }
      typedSpan.textContent = currentText;

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, delayBetweenTexts);
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        textIndex++;
        setTimeout(type, 300);
      } else {
        setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
      }
    }

    type();
  }

  let ticking = false;
  function handleScroll() {
    const scrollY = window.scrollY;

    // Hero shrink & skills bar reveal
    if (scrollY > 150) {
      hero?.classList.add("shrink");
      if (skillsBar) {
        skillsBar.style.opacity = "1";
        skillsBar.style.pointerEvents = "auto";
      }
    } else {
      hero?.classList.remove("shrink");
      if (skillsBar) {
        skillsBar.style.opacity = "0";
        skillsBar.style.pointerEvents = "none";
      }
    }

    // Navbar background change
    if (scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    // Back to top button visibility
    if (scrollY > 300) {
      if (backToTop) {
        backToTop.style.opacity = "1";
        backToTop.style.visibility = "visible";
      }
    } else {
      if (backToTop) {
        backToTop.style.opacity = "0";
        backToTop.style.visibility = "hidden";
      }
    }
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const floatingIdentity = document.getElementById("floatingIdentity");

  if (!floatingIdentity) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 420) {
      floatingIdentity.classList.add("show");
    } else {
      floatingIdentity.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".copy-link-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const url = button.getAttribute("data-copy-url");
      if (!url) return;

      try {
        await navigator.clipboard.writeText(url);
        button.classList.add("copied");
        setTimeout(() => button.classList.remove("copied"), 1400);
      } catch (error) {
        window.prompt("Copy this article link:", url);
      }
    });
  });
});

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});