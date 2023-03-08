
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

/* ENCODE BASE64 */
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
