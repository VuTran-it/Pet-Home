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

/* Open Fullscreen  and close Fullscreen*/
var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

window.addEventListener('load', () =>{
  openFullscreen()
});

/* Xử lí nhấn nút fullscreen */
const btn_fullscreen = document.getElementById('btn_fullscreen')
const icon_fullscreen = document.querySelector('#btn_fullscreen .fa-solid')
let defaul_fullscreen = "Open";

btn_fullscreen.addEventListener("click", () => {
    if (defaul_fullscreen == "Open") {
        defaul_fullscreen = "Close"; 
        openFullscreen();
        icon_fullscreen.classList.remove('fa-expand');
        icon_fullscreen.classList.add('fa-compress');
    } else {
        defaul_fullscreen = "Open"; 
        closeFullscreen();
        icon_fullscreen.classList.remove('fa-compress');
        icon_fullscreen.classList.add('fa-expand');
    }
})