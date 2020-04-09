var closeButton = document.querySelector(".close");
var alertClass = document.querySelector(".alert-wrap");

closeButton.addEventListener("click", () => {
    alertClass.innerHTML = "";
})