/* toggle style switcher */
const styleSwitcherToggle = document.querySelector('.style-switcher-toggler');

styleSwitcherToggle.addEventListener('click', () => {
    document.querySelector('.style-switcher').classList.toggle("open")
})

window.addEventListener("scroll", () =>{
    if(document.querySelector(".style-switcher").classList.contains("open"))
    {
        document.querySelector(".style-switcher").classList.remove("open")
    }
})

/* Theme colors */
const alternateStyles = document.querySelectorAll('.alternate-style');

function setActiveStyle(color)
{
    alternateStyles.forEach((style) => {
        if(color === style.getAttribute("title"))
        {
            style.removeAttribute("disabled");
        }
        else
        {
            style.setAttribute("disabled","true");
        }
    })
}

/* Theme light and dark mode */
const remoteControl = document.querySelector('.remote-control .dark-light');
remoteControl.addEventListener("click", () => {
    remoteControl.querySelector("i").classList.toggle("fa-moon")
    remoteControl.querySelector("i").classList.toggle("fa-sun")
    document.body.classList.toggle("light")
})

window.addEventListener("load" ,() => {
    if(document.body.classList.contains("light"))
    {
        remoteControl.querySelector("i").classList.add("fa-sun");
    }
    else
    {
        remoteControl.querySelector("i").classList.add("fa-moon")
    }

})