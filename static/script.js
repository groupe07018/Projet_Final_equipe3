const itemAFacturer = document.querySelector("#menu_frais_fixe");
const prixFacture = document.querySelector("#prixFacture");

itemAFacturer.addEventListener("change", afficherPrix);
function afficherPrix(){
    prixFacture.innerText = itemAFacturer.value
}