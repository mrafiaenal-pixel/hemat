document.addEventListener("DOMContentLoaded", () => {
  // 1. INJEKSI KELAS CSS ANIMASI (Otomatis tanpa perlu edit CSS di atas)
  const style = document.createElement("style");
  style.innerHTML = `
        .fade-in-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `;
  document.head.appendChild(style);

  // 2. ANIMASI SCROLL (Muncul Halus saat di-scroll ke bawah)
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Pemicu Animasi Angka IoT khusus saat bagian IoT terlihat
        if (entry.target.classList.contains("telemetry-grid")) {
          animateNumbers();
        }

        observer.unobserve(entry.target); // Animasi cukup jalan sekali
      }
    });
  }, observerOptions);

  // Mendaftarkan elemen mana saja yang diberi efek muncul halus
  const elementsToAnimate = document.querySelectorAll(
    ".hero-text, .hero-img-container, .card, .telemetry-grid, .teaser-box",
  );
  elementsToAnimate.forEach((el) => {
    el.classList.add("fade-in-up");
    observer.observe(el);
  });

  // 3. ANIMASI ANGKA TELEMETRI IoT (Memberikan kesan Real-Time)
  let isAnimated = false;
  function animateNumbers() {
    if (isAnimated) return;
    isAnimated = true;

    const valueElements = document.querySelectorAll(".telemetry-value");

    valueElements.forEach((el) => {
      // Mengambil angka asli dan satuannya
      const originalHTML = el.innerHTML;
      const targetNumber = parseFloat(el.innerText);
      const unitMatch = originalHTML.match(/<span.*<\/span>/);
      const unitHTML = unitMatch ? unitMatch[0] : "";

      if (isNaN(targetNumber)) return;

      let startNumber = 0;
      const duration = 1500; // Durasi animasi 1.5 detik
      const frameRate = 30; // Milidetik per pembaruan angka
      const totalFrames = Math.round(duration / frameRate);
      const increment = targetNumber / totalFrames;

      const counter = setInterval(() => {
        startNumber += increment;

        if (startNumber >= targetNumber) {
          clearInterval(counter);
          startNumber = targetNumber;
        }

        // Menjaga presisi angka desimal (seperti 1.89 A)
        const isDecimal = targetNumber % 1 !== 0;
        const displayValue = isDecimal
          ? startNumber.toFixed(2)
          : Math.round(startNumber);

        el.innerHTML = displayValue + unitHTML;
      }, frameRate);
    });
  }

  // 4. GULIR MULUS (Smooth Scrolling) UNTUK MENU NAVIGASI
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Memberikan sedikit ruang (offset) karena ada header sticky
        const headerOffset = 72;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
