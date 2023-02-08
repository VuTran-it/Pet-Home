import database, {
    navValue,
    homeValue,
    aboutValue,
    serviceValue,
    portfolioValue,
    contactValue
} from "./database.js"

const languageBtn = document.querySelector('.language')
let defaultLanguage = "EN";
const spanLanguage = document.querySelector('.language span')
//Render nội dung khi trang web được load
window.addEventListener("load", () => {
    if(defaultLanguage === "EN")
    {
        spanLanguage.innerHTML = "VN";
        handleEnglish();
    }
    else
    {
        spanLanguage.innerHTML = "EN";
        handleVietnamese();
    }
})

/* Xử lí nút */
languageBtn.addEventListener("click", () => {
    if (spanLanguage.innerHTML === "VN") {
        defaultLanguage = "VN";   
        handleVietnamese();
        spanLanguage.innerHTML = "EN";
    } else {
        defaultLanguage = "EN";
        handleEnglish();
        spanLanguage.innerHTML = "VN";
    }
})


/* nav */
let listMenuSpan = document.querySelectorAll("#menu li span")

/* nav */
let listNavSpan = document.querySelectorAll(".list span")

/* home */
const textHello = document.querySelector('.home .home-info .hello span')
const textMyProfession = document.querySelector('.home .home-info .my-profession span')
const text_p = document.querySelector('.home .home-info p')
const text_a = document.querySelector('.home .home-info a')

/* About */
const aboutSectionTitle = document.querySelector('.about .section-title h2')
const aboutSectionSubTitle = document.querySelector('.about .section-title h3')
const aboutTitle1 = document.querySelector('.about-content .about-text .aboutTitle1')
const aboutText1 = document.querySelector('.about-content .about-text .aboutText1')
const infoItem = document.querySelectorAll('.personal-info .info-item p')
const hireMe = document.querySelector('.buttons .hire-me')
const aboutTitle2 = document.querySelector('.about-content .about-text .aboutTitle2')
/* education */
const education = document.querySelector('.education .title-glow')
const EducationTimelineDate = document.querySelectorAll('.education .timeline-item .timeline-date')
const EducationTimelineTitle = document.querySelectorAll('.education .timeline-item .timeline-title')
const EducationTimelineItem = document.querySelectorAll('.education .timeline-item .timeline-text')

/* experience */
const experience = document.querySelector('.experience .title-glow')
const ExperienceTimelineDate = document.querySelectorAll('.experience .timeline-item .timeline-date')
const ExperienceTimelineTitle = document.querySelectorAll('.experience .timeline-item .timeline-title')
const ExperienceTimelineItem = document.querySelectorAll('.experience .timeline-item .timeline-text')


/* service */
const serviceSectionTitle = document.querySelector('.service .section-title h2')
const serviceSectionSubTitle = document.querySelector('.service .section-title h3')
const serviceItemInnerH4 = document.querySelectorAll('.service .service-item h4')
const serviceItemInnerP = document.querySelectorAll('.service .service-item p')


/* Portfolio */
const portfolioSectionTitle = document.querySelector('.portfolio .section-title h2')
const portfolioSectionSubTitle = document.querySelector('.portfolio .section-title h3')
const portfolioHeading = document.querySelector('.portfolio-heading h2')
const portfolioContentH2 = document.querySelectorAll('.portfolio-content h2')
const portfolioContentP = document.querySelectorAll('.portfolio-content p')
const portfolioContentBtn = document.querySelectorAll('.portfolio-content .btn-liveDemo a')

/* contact */
const contactSectionTitle = document.querySelector('.contact .section-title h2')
const contactSectionSubTitle = document.querySelector('.contact .section-title h3')
const contactTitle = document.querySelectorAll('.contact-title')
const contactSubTitle = document.querySelectorAll('.contact-sub-title')
const contactInfoItemTextH4 = document.querySelectorAll('.contact-info-item h4')
const formItem = document.querySelectorAll('.contact-form .form-item span')
const formItemBtn = document.querySelector('.contact-form .form-item button')
const formError = document.querySelector('.contact-form .form-item .error')



function handleVietnamese() {
    /* menu */
    listMenuSpan[0].innerHTML = navValue.vn.spanHome
    listMenuSpan[1].innerHTML = navValue.vn.spanAbout
    listMenuSpan[2].innerHTML = navValue.vn.spanService
    listMenuSpan[3].innerHTML = navValue.vn.spanPortfolio
    listMenuSpan[4].innerHTML = navValue.vn.spanContact
    /* nav */
    listNavSpan[0].innerHTML = navValue.vn.spanHome
    listNavSpan[1].innerHTML = navValue.vn.spanAbout
    listNavSpan[2].innerHTML = navValue.vn.spanService
    listNavSpan[3].innerHTML = navValue.vn.spanPortfolio
    listNavSpan[4].innerHTML = navValue.vn.spanContact
    /* home */
    textHello.innerHTML = homeValue.vn.hello
    textMyProfession.innerHTML = homeValue.vn.myprofession
    text_p.innerHTML = homeValue.vn.pText
    text_a.innerHTML = homeValue.vn.aText
    /* about */
    aboutSectionTitle.innerHTML = aboutValue.vn.aboutSectionTitle
    aboutSectionSubTitle.innerHTML = aboutValue.vn.aboutSectionSubTitle
    aboutTitle1.innerHTML = aboutValue.vn.aboutTitle1
    aboutText1.innerHTML = aboutValue.vn.aboutText1
    infoItem[0].innerHTML = aboutValue.vn.infoItemName
    infoItem[1].innerHTML = aboutValue.vn.infoItemBirday
    infoItem[2].innerHTML = aboutValue.vn.infoItemAge
    infoItem[3].innerHTML = aboutValue.vn.infoItemEmail
    infoItem[4].innerHTML = aboutValue.vn.infoItemDegree
    infoItem[5].innerHTML = aboutValue.vn.infoItemPhone
    infoItem[6].innerHTML = aboutValue.vn.infoItemCity
    infoItem[7].innerHTML = aboutValue.vn.infoItemSocialMedia
    hireMe.innerHTML = aboutValue.vn.hireMe
    aboutTitle2.innerHTML = aboutValue.vn.aboutTitle2
    /* education */
    education.innerHTML = aboutValue.vn.Education
    EducationTimelineDate[0].innerHTML = aboutValue.vn.EducationTimelineDate1
    EducationTimelineTitle[0].innerHTML = aboutValue.vn.EducationTimelineTitle1
    EducationTimelineItem[0].innerHTML = aboutValue.vn.EducationTimelineItem1
    EducationTimelineDate[1].innerHTML = aboutValue.vn.EducationTimelineDate2
    EducationTimelineTitle[1].innerHTML = aboutValue.vn.EducationTimelineTitle2
    EducationTimelineItem[1].innerHTML = aboutValue.vn.EducationTimelineItem2
    EducationTimelineDate[2].innerHTML = aboutValue.vn.EducationTimelineDate3
    EducationTimelineTitle[2].innerHTML = aboutValue.vn.EducationTimelineTitle3
    /* experience */
    experience.innerHTML = aboutValue.vn.Experience
    ExperienceTimelineDate[0].innerHTML = aboutValue.vn.ExperienceTimelineDate1
    ExperienceTimelineTitle[0].innerHTML = aboutValue.vn.ExperienceTimelineTitle1
    ExperienceTimelineItem[0].innerHTML = aboutValue.vn.ExperienceTimelineItem1
    /* service */
    serviceSectionTitle.innerHTML = serviceValue.vn.serviceSectionTitle
    serviceSectionSubTitle.innerHTML = serviceValue.vn.serviceSectionSubTitle
    serviceItemInnerH4[0].innerHTML = serviceValue.vn.serviceItemInnerTitle1
    serviceItemInnerP[0].innerHTML = serviceValue.vn.serviceItemInnerText1
    serviceItemInnerH4[1].innerHTML = serviceValue.vn.serviceItemInnerTitle2
    serviceItemInnerP[1].innerHTML = serviceValue.vn.serviceItemInnerText2
    serviceItemInnerH4[2].innerHTML = serviceValue.vn.serviceItemInnerTitle3
    serviceItemInnerP[2].innerHTML = serviceValue.vn.serviceItemInnerText3
    serviceItemInnerH4[3].innerHTML = serviceValue.vn.serviceItemInnerTitle4
    serviceItemInnerP[3].innerHTML = serviceValue.vn.serviceItemInnerText4
    serviceItemInnerH4[4].innerHTML = serviceValue.vn.serviceItemInnerTitle5
    serviceItemInnerP[4].innerHTML = serviceValue.vn.serviceItemInnerText5
    serviceItemInnerH4[5].innerHTML = serviceValue.vn.serviceItemInnerTitle6
    serviceItemInnerP[5].innerHTML = serviceValue.vn.serviceItemInnerText6
    /* Portfolio */
    portfolioSectionTitle.innerHTML = portfolioValue.vn.portfolioSectionTitle
    portfolioSectionSubTitle.innerHTML = portfolioValue.vn.portfolioSectionSubTitle
    portfolioHeading.innerHTML = portfolioValue.vn.portfolioHeading
    portfolioContentBtn.forEach((item) => {
        item.innerHTML = portfolioValue.vn.portfolioContentBtn
    })
    portfolioContentH2[0].innerHTML = portfolioValue.vn.portfolioContentTitle1
    portfolioContentP[0].innerHTML = portfolioValue.vn.portfolioContentText1
    portfolioContentH2[1].innerHTML = portfolioValue.vn.portfolioContentTitle2
    portfolioContentP[1].innerHTML = portfolioValue.vn.portfolioContentText2
    portfolioContentH2[2].innerHTML = portfolioValue.vn.portfolioContentTitle3
    portfolioContentP[2].innerHTML = portfolioValue.vn.portfolioContentText3
    portfolioContentH2[3].innerHTML = portfolioValue.vn.portfolioContentTitle4
    portfolioContentP[3].innerHTML = portfolioValue.vn.portfolioContentText4

    /* contact */
    contactSectionTitle.innerHTML = contactValue.vn.contactSectionTitle
    contactSectionSubTitle.innerHTML = contactValue.vn.contactSectionSubTitle
    contactTitle[0].innerHTML = contactValue.vn.contactTitleL
    contactSubTitle[0].innerHTML = contactValue.vn.contactSubTitleL
    contactInfoItemTextH4[0].innerHTML = contactValue.vn.contactInfoItemText1
    contactInfoItemTextH4[1].innerHTML = contactValue.vn.contactInfoItemText2
    contactTitle[1].innerHTML = contactValue.vn.contactTitleR
    contactSubTitle[1].innerHTML = contactValue.vn.contactSubTitleR
    formItem[0].innerHTML = contactValue.vn.formItemName
    formItem[2].innerHTML = contactValue.vn.formItemSubject
    formItemBtn.innerHTML = contactValue.vn.formItemBtn
    formError.innerHTML = contactValue.vn.formError

}

function handleEnglish() {
    /* menu */
    listMenuSpan[0].innerHTML = navValue.en.spanHome
    listMenuSpan[1].innerHTML = navValue.en.spanAbout
    listMenuSpan[2].innerHTML = navValue.en.spanService
    listMenuSpan[3].innerHTML = navValue.en.spanPortfolio
    listMenuSpan[4].innerHTML = navValue.en.spanContact
    /* nav */
    listNavSpan[0].innerHTML = navValue.en.spanHome
    listNavSpan[1].innerHTML = navValue.en.spanAbout
    listNavSpan[2].innerHTML = navValue.en.spanService
    listNavSpan[3].innerHTML = navValue.en.spanPortfolio
    listNavSpan[4].innerHTML = navValue.en.spanContact
    /* home */
    textHello.innerHTML = homeValue.en.hello
    textMyProfession.innerHTML = homeValue.en.myprofession
    text_p.innerHTML = homeValue.en.pText
    text_a.innerHTML = homeValue.en.aText
    /* about */
    aboutSectionTitle.innerHTML = aboutValue.en.aboutSectionTitle
    aboutSectionSubTitle.innerHTML = aboutValue.en.aboutSectionSubTitle
    aboutTitle1.innerHTML = aboutValue.en.aboutTitle1
    aboutText1.innerHTML = aboutValue.en.aboutText1
    infoItem[0].innerHTML = aboutValue.en.infoItemName
    infoItem[1].innerHTML = aboutValue.en.infoItemBirday
    infoItem[2].innerHTML = aboutValue.en.infoItemAge
    infoItem[3].innerHTML = aboutValue.en.infoItemEmail
    infoItem[4].innerHTML = aboutValue.en.infoItemDegree
    infoItem[5].innerHTML = aboutValue.en.infoItemPhone
    infoItem[6].innerHTML = aboutValue.en.infoItemCity
    infoItem[7].innerHTML = aboutValue.en.infoItemSocialMedia
    hireMe.innerHTML = aboutValue.en.hireMe
    aboutTitle2.innerHTML = aboutValue.en.aboutTitle2
    /* education */
    education.innerHTML = aboutValue.en.Education
    EducationTimelineDate[0].innerHTML = aboutValue.en.EducationTimelineDate1
    EducationTimelineTitle[0].innerHTML = aboutValue.en.EducationTimelineTitle1
    EducationTimelineItem[0].innerHTML = aboutValue.en.EducationTimelineItem1
    EducationTimelineDate[1].innerHTML = aboutValue.en.EducationTimelineDate2
    EducationTimelineTitle[1].innerHTML = aboutValue.en.EducationTimelineTitle2
    EducationTimelineItem[1].innerHTML = aboutValue.en.EducationTimelineItem2
    EducationTimelineDate[2].innerHTML = aboutValue.en.EducationTimelineDate3
    EducationTimelineTitle[2].innerHTML = aboutValue.en.EducationTimelineTitle3
    /* experience */
    experience.innerHTML = aboutValue.en.Experience
    ExperienceTimelineDate[0].innerHTML = aboutValue.en.ExperienceTimelineDate1
    ExperienceTimelineTitle[0].innerHTML = aboutValue.en.ExperienceTimelineTitle1
    ExperienceTimelineItem[0].innerHTML = aboutValue.en.ExperienceTimelineItem1
    /* service */
    serviceSectionTitle.innerHTML = serviceValue.en.serviceSectionTitle
    serviceSectionSubTitle.innerHTML = serviceValue.en.serviceSectionSubTitle
    serviceItemInnerH4[0].innerHTML = serviceValue.en.serviceItemInnerTitle1
    serviceItemInnerP[0].innerHTML = serviceValue.en.serviceItemInnerText1
    serviceItemInnerH4[1].innerHTML = serviceValue.en.serviceItemInnerTitle2
    serviceItemInnerP[1].innerHTML = serviceValue.en.serviceItemInnerText2
    serviceItemInnerH4[2].innerHTML = serviceValue.en.serviceItemInnerTitle3
    serviceItemInnerP[2].innerHTML = serviceValue.en.serviceItemInnerText3
    serviceItemInnerH4[3].innerHTML = serviceValue.en.serviceItemInnerTitle4
    serviceItemInnerP[3].innerHTML = serviceValue.en.serviceItemInnerText4
    serviceItemInnerH4[4].innerHTML = serviceValue.en.serviceItemInnerTitle5
    serviceItemInnerP[4].innerHTML = serviceValue.en.serviceItemInnerText5
    serviceItemInnerH4[5].innerHTML = serviceValue.en.serviceItemInnerTitle6
    serviceItemInnerP[5].innerHTML = serviceValue.en.serviceItemInnerText6
    /* Portfolio */
    portfolioSectionTitle.innerHTML = portfolioValue.en.portfolioSectionTitle
    portfolioSectionSubTitle.innerHTML = portfolioValue.en.portfolioSectionSubTitle
    portfolioHeading.innerHTML = portfolioValue.en.portfolioHeading
    portfolioContentBtn.forEach((item) => {
        item.innerHTML = portfolioValue.en.portfolioContentBtn
    })
    portfolioContentH2[0].innerHTML = portfolioValue.en.portfolioContentTitle1
    portfolioContentP[0].innerHTML = portfolioValue.en.portfolioContentText1
    portfolioContentH2[1].innerHTML = portfolioValue.en.portfolioContentTitle2
    portfolioContentP[1].innerHTML = portfolioValue.en.portfolioContentText2
    portfolioContentH2[2].innerHTML = portfolioValue.en.portfolioContentTitle3
    portfolioContentP[2].innerHTML = portfolioValue.en.portfolioContentText3
    portfolioContentH2[3].innerHTML = portfolioValue.en.portfolioContentTitle4
    portfolioContentP[3].innerHTML = portfolioValue.en.portfolioContentText4

    /* contact */
    contactSectionTitle.innerHTML = contactValue.en.contactSectionTitle
    contactSectionSubTitle.innerHTML = contactValue.en.contactSectionSubTitle
    contactTitle[0].innerHTML = contactValue.en.contactTitleL
    contactSubTitle[0].innerHTML = contactValue.en.contactSubTitleL
    contactInfoItemTextH4[0].innerHTML = contactValue.en.contactInfoItemText1
    contactInfoItemTextH4[1].innerHTML = contactValue.en.contactInfoItemText2
    contactTitle[1].innerHTML = contactValue.en.contactTitleR
    contactSubTitle[1].innerHTML = contactValue.en.contactSubTitleR
    formItem[0].innerHTML = contactValue.en.formItemName
    formItem[2].innerHTML = contactValue.en.formItemSubject
    formItemBtn.innerHTML = contactValue.en.formItemBtn
    formError.innerHTML = contactValue.en.formError

}