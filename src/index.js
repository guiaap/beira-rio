const header = document.querySelector("header");
const logo = document.querySelector(".logo");

window.addEventListener("scroll", () => {

    if(window.scrollY > 90) {
        header.style.backgroundColor = "var(--cinza-escuro)";
        logo.setAttribute("src", "src/imagens/favicon.png");
        logo.style.height = "5rem";
    } else {
        header.style.backgroundColor = "transparent";
        logo.setAttribute("src", "src/imagens/logo.png");
        logo.style.height = "9rem";
    }

});


const copyrightYear = document.getElementById("copyright-year");
copyrightYear.textContent = new Date().getFullYear();