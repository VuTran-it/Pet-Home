const toggle = document.querySelector('.toggle')
const navMobile = document.querySelector('.nav')
const boxNav = document.querySelector('.box-nav')
let time = 500

toggle.addEventListener("click",() => {
    if(navMobile.classList.contains("active"))
    {
        navMobile.classList.remove('active')
        setTimeout(() => {
            boxNav.classList.remove('open')
        }, time);
    }
    else
    {
        navMobile.classList.add('active')
        boxNav.classList.add('open')
    }
})

const listBtn = document.querySelectorAll('li')

function activeLink () {
    listBtn.forEach((item) => {
        item.classList.remove('active')
        this.classList.add('active')
        navMobile.classList.remove('active')
        setTimeout(() => {
            boxNav.classList.remove('open')
        },time)
    })
}

listBtn.forEach((item) => {
    item.addEventListener("click", activeLink)
})