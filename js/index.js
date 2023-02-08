
/* NAV */
const nav = document.querySelector('.nav'),
    navList = document.querySelectorAll('.nav li'),
    totalNavList = navList.length,
    allSection = document.querySelectorAll('.section'),
    totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    navList[i].addEventListener("click", function () {
        removeBackSection()
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].classList.contains("active")) {
                addBackSection(j);
            }
            navList[j].classList.remove("active");
        }
        this.classList.add("active")
        showSection(navList[i].querySelector('a'));
    })
}

function removeBackSection() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section")
    }
}

function addBackSection(num) {
    allSection[num].classList.add('back-section')
}

function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active")
    }
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add('active');
}

function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].classList.remove("active")
        const target = element.getAttribute("href").split("#")[1];
        if (target === navList[i].querySelector("a").getAttribute("href").split('#')[1]) {
            navList[i].classList.add("active")
        }
    }
}

document.querySelector(".hire-me").addEventListener("click", function () {
    const sectionIndex = this.getAttribute("data-section-index");

    showSection(this)
    updateNav(this)
    removeBackSection()
    addBackSection(sectionIndex)
})


/* PORTFOLIO */
const portfolioItemInner = document.querySelectorAll(".portfolio-item-inner")
const portfolioContent = document.querySelectorAll('.portfolio-content')

for (let i = 0; i < portfolioItemInner.length; i++) {
    portfolioItemInner[i].addEventListener('click', function () {
        portfolioContent[i].classList.toggle("active")
    })
}

