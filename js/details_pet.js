/* loading */
var mainContainer = document.querySelector(".main-container")
function load()
{
    mainContainer.style.display = 'block';
    mainContainer.style.opacity = 1
}
load();

/* Details pet */
const url = window.location.href;
const newUrl = new URL(url.replace("#Pet&",""))
const params = new URLSearchParams(newUrl.search);
const idPet = params.get("id_pet");
const info_detail_pet = document.getElementById('info-detail-pet')

window.addEventListener("load", function() {
    let target = url.split("#")[1];
    target = target.slice(0,target.indexOf("&"))
    document.querySelector("#" + target).classList.add('active');

    if(idPet)
    {
        info_detail_pet.classList.add('active')
    }
});

