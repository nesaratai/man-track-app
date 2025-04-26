const toggleBtn = document.getElementById("menuToggle");
const navbarRight = document.getElementById("navbarRight");

toggleBtn?.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    navbarRight.classList.toggle("show");
  }
});