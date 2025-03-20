document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.getElementById("navbar-toggler");
    const navbarCollapse = document.getElementById("navbarNav");

    navbarToggler.addEventListener("click", function () {
        navbarCollapse.classList.toggle("show");
    });
});
