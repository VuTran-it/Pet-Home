let valLoader = document.querySelector('.value-loader');

let progressValue = 0;
let progressEndValue = 100;
let speed = 20;

let progress = setInterval(() =>{
    progressValue++;
    valLoader.textContent = `${progressValue}%`;

    if(progressValue == progressEndValue)
    {
        clearInterval(progress);
    }
},speed)

var loader = document.querySelector('#loader-background')
var mainContainer = document.querySelector(".main-container")
var styleSwitcher = document.querySelector('.style-switcher')

function loading()
{
    setTimeout(() => {
        loader.style.opacity = 0;
        loader.style.display = 'none';

        mainContainer.style.display = 'block';
        mainContainer.style.opacity = 1
    },0)
}

loading();