
/* NAV */
const nav = document.querySelector('.nav'),
    navList = document.querySelectorAll('.nav .list'),
    navAdmin = document.querySelector('.navAdmin'),
    navAdminList = document.querySelectorAll('.navAdmin .list'),
    totalNavList = navList.length,
    totalNavAdminList = navAdminList.length,
    allSection = document.querySelectorAll('.section'),
    allSectionAdmin = document.querySelectorAll('.main-admin .section'),
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
for (let i = 0; i < totalNavAdminList; i++) {
    navAdminList[i].addEventListener("click", function () {
        removeBackSection()
        for (let j = 0; j < totalNavAdminList; j++) {
            if (navAdminList[j].classList.contains("active")) {
                addBackSection(j);
            }
            navAdminList[j].classList.remove("active");
        }
        this.classList.add("active")
        showSection(navAdminList[i].querySelector('a'));
    })
}


function removeBackSection() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section")
    }
    for (let i = 0; i < totalNavAdminList; i++) {
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
    for (let i = 0; i < totalNavAdminList; i++) {
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
    for (let i = 0; i < totalNavAdminList; i++) {
        navAdminList[i].classList.remove("active")
        const target = element.getAttribute("href").split("#")[1];
        if (target === navAdminList[i].querySelector("a").getAttribute("href").split('#')[1]) {
            navAdminList[i].classList.add("active")
        }
    }
}


/* Manager */
const box_form = document.querySelector(".Manager .box-form");
const close_box = document.querySelector(".Manager .close-box");
const upload_pet = document.querySelector(".Manager .upload-pet");
const add_pet = document.querySelector(".Manager .box--pen .button--pen");

if(add_pet && close_box)
{
    add_pet.addEventListener('click',()=>{
        box_form.classList.toggle("active")
    })
    
    close_box.addEventListener('click',()=>{
        box_form.classList.remove("active")
    })
    
}
/* LOGOUT*/
const logout = document.getElementById('logout');
if(logout)
{
    logout.addEventListener("click", () => {
        sessionStorage.removeItem("idUser")
        window.location.href = "http://127.0.0.1:5500/html/login.html"
    })
}
/* END LOGOUT*/