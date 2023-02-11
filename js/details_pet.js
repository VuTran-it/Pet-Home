/* loading */
var mainContainer = document.querySelector(".main-container")
function load()
{
    mainContainer.style.display = 'block';
    mainContainer.style.opacity = 1
}
load();

/* Details pet */
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idPet = params.get("id_pet");
const info_detail_pet = document.getElementById('info-detail-pet')

if(idPet)
{
    info_detail_pet.classList.add('active')
}