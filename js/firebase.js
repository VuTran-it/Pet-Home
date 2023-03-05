 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
 import { getStorage,ref as Sref,getDownloadURL,uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
 import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
 import { getDatabase, ref, onValue, query, limitToLast,set} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

 const firebaseConfig = {
    apiKey: "AIzaSyCZ92xMiEl2xzANh1hJzWioCEZv_POjbAQ",
    authDomain: "raspberry-test-0207.firebaseapp.com",
    databaseURL: "https://raspberry-test-0207-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "raspberry-test-0207",
    storageBucket: "raspberry-test-0207.appspot.com",
    messagingSenderId: "333665348767",
    appId: "1:333665348767:web:9335583220b1c7ce02c6aa",
    measurementId: "G-5XMV3BVGQP"
  };

// var userID = 1

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();
const auth = getAuth();
const database = getDatabase();
const storage = getStorage();
const dataRef = query(ref(database, 'account'), limitToLast(100));

// onValue(dataRef, (snapshot) => {
//   snapshot.forEach((childSnapshot) => {
//     var childKey = childSnapshot.key;
//     var childData = childSnapshot.val();
//     console.log("childKey", childKey)
//     console.log("childData", childData.info.countPet)

//   });
// });

/* ==============================================  ADMIN  ============================================== */

/* ADD USER */
const inputAddUser = document.querySelectorAll('.main-admin .box-add-user .input')
const btnAddUser = document.querySelector('.main-admin .box-add-user .btn-add')
const errorUser = document.querySelector('.main-admin .box-add-user .item.error')

function writeUserData(userId,avatar,name,age,gender,phone,address,quantityPet) {
  set(ref(database, 'account/' + userId + '/info'), {
    avatar: avatar,
    name: name,
    age : age,
    gender : gender,
    phone : phone,
    address : address,
    countPet : quantityPet,
  });
}

if(btnAddUser)
{
  btnAddUser.addEventListener("click",() => {
    let email,password,name,avatar,age,gender,phone,address,quantityPet,fileAvatar
    //get info value
    for(let i = 0; i < inputAddUser.length; i++ )
    {
      email = inputAddUser[0].value ? inputAddUser[0].value : ''
      password = inputAddUser[1].value ? inputAddUser[1].value : ''
      fileAvatar = inputAddUser[2].files[0] ? inputAddUser[2].files[0] : ''
      name = inputAddUser[3].value ? inputAddUser[3].value : ''
      age = inputAddUser[4].value ? inputAddUser[4].value : ''
      phone = inputAddUser[5].value ? inputAddUser[5].value : ''
      address = inputAddUser[6].value ? inputAddUser[6].value : ''
      quantityPet = inputAddUser[7].value ? inputAddUser[7].value : ''
    }
    // get gender value
    for(let i = 0; i < document.getElementsByName('gender').length; i++ )
    {
      if (document.getElementsByName('gender').item(i).checked){
        gender = document.getElementsByName('gender').item(i).value;
      }
    }

    // create an account with email and password
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // upload file to storage firebase
      const date = new Date().getTime();
      let nameFile = 'users/'+ user.uid + '_' + date
      const storageRef = Sref(storage, nameFile);
      uploadBytesResumable(storageRef, fileAvatar).then(async () => {
        await getDownloadURL(storageRef).then((downloadURL) => {
          try {
            avatar = downloadURL
          } catch (err) {
            console.log(err)
          }
        });

        await writeUserData(user.uid,avatar,name,age,gender,phone,address,quantityPet);
      })  

      for(let i = 0; i < inputAddUser.length; i++ )
      {
        inputAddUser[i].value = ''
        inputAddUser[7].value = 0
      }
      
      errorUser.style.display = 'none'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode,errorMessage)
      errorUser.style.display = 'block'
    });
  })
  
}
/* END ADD USER */

/* SHOW LIST USER */
const boxUser = document.querySelector('.main-admin .box-user')

if(boxUser)
{
  onValue(dataRef, (snapshot) => {
    let html = ''
    snapshot.forEach((childSnapshot) => {
      var childData = childSnapshot.val();
      let content = `
        <div class="item">
          <div class="img">
            <img src=`+childData.info.avatar+` alt="">
          </div>
          <div class="content">
            <p>`+childData.info.name+`</p>
            <p>Age : `+childData.info.age+`</p>
            <p>Gender : `+childData.info.gender+`</p>
            <p>Phone : `+childData.info.phone+`</p>
            <p>Address :  `+childData.info.address+`</p>
            <p>Quantity pet : `+childData.info.countPet+`</p>
          </div>
        </div>
      `
      html += content
      boxUser.innerHTML = html
    });
  });
}
/* ADD SHOW LIST USER */

/* SHOW INFO USER */
const userID = sessionStorage.getItem("idUser")
const boxInfoUser = document.querySelector('.content.info-user')
if(userID && userID != '')
{
  onValue(dataRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      if(childKey == userID)
      {
        var childData = childSnapshot.val();
        let infoHTML = `
            <div class="content-left">
              <div class="avatar">
                <img src=`+childData.info.avatar+` alt="" />
              </div>
              <div class="name">
                <h2>`+childData.info.name+`</h2>
              </div>
            </div>

            <div class="content-right">
              <div class="content-right-item">
                  <div class="title">
                    <span></span>
                    <h2 class="text">Information</h2>
                  </div>
                  <div class="detail">
                    <span>Name : `+childData.info.name+`</span>
                    <span>Gender : `+childData.info.gender+`</span>
                    <span>Age : `+childData.info.age+`</span>
                    <span>Phone : `+childData.info.phone+`</span>
                    <span>Address : `+childData.info.address+`</span>
                  </div>
                </div>

                <div class="content-right-item">
                  <div class="title">
                    <span></span>
                    <h2 class="text">My Pets</h2>
                  </div>

                  <div class="detail">
                    <span>Quantity : `+childData.info.countPet+`</span>
                  </div>
                </div>
              </div>
            </div>` 
        if(boxInfoUser)
        {
          boxInfoUser.innerHTML = infoHTML
        }
      }
    });
  });
}

/* END SHOW INFO USER */


/* UPLOAD PET */
const inputInfoPet = document.querySelectorAll('.box-form.box-info-pet .input')
const btnUploadPet = document.querySelector('.box-form.box-info-pet .upload-pet')
function writePetData(petId,name,image,breed,age,gender,neutered) {
  set(ref(database, 'account/' + userID + '/listPet/' + petId), {
    name: name,
    image : image,
    breed : breed,
    age : age,
    gender : gender,
    neutered : neutered,
  });
}

if(btnUploadPet)
{
  btnUploadPet.addEventListener("click",() => {
    let idPet,name,image,breed,age,gender,neutered,fileImage
    const date = new Date().getTime();
    idPet = "Pet_"+date
    for(let i = 0; i < inputInfoPet.length; i++ )
    {
      name = inputInfoPet[0].value ? inputInfoPet[0].value : ''
      fileImage = inputInfoPet[1].files[0] ? inputInfoPet[1].files[0] : ''
      breed = inputInfoPet[2].value ? inputInfoPet[2].value : ''
      age = inputInfoPet[3].value ? inputInfoPet[3].value : ''
    }

    // get gender value
    for(let i = 0; i < document.getElementsByName('pet-gender').length; i++ )
    {
      if (document.getElementsByName('pet-gender').item(i).checked){
        gender = document.getElementsByName('pet-gender').item(i).value;
      }
    }

    // get status neutered value
    for(let i = 0; i < document.getElementsByName('spayed-neutered').length; i++ )
    {
      if (document.getElementsByName('spayed-neutered').item(i).checked){
        neutered = document.getElementsByName('spayed-neutered').item(i).value;
      }
    }
    let nameFile = 'pets/'+ idPet + '_' + date
    const storageRef = Sref(storage, nameFile);
    if(fileImage != '')
    {
      uploadBytesResumable(storageRef, fileImage).then(async () => {
        if(idPet!='' && name!='' && image!='')
        {
          await getDownloadURL(storageRef).then((downloadURL) => {
            try {
              image = downloadURL
            } catch (err) {
              console.log(err)
            }
          });
          await writePetData(idPet,name,image,breed,age,gender,neutered);
          document.querySelector('footer .notification').innerHTML = '<p style="color:green">Successfully added pets</p>'
        }
        else
        {
          document.querySelector('footer .notification').innerHTML = '<p style="color:red">Necessary information has not been receiveds</p>'
        }
      })  
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.querySelector('footer .notification').innerHTML = '<p style="color:red">Looks like something went wrong</p>'
      });
    }
    else
    {
      document.querySelector('footer .notification').innerHTML = '<p style="color:red">No pet pictures yet</p>'
    }
  })
}

/* END UPLOAD PET */

/* SHOW LIST PET FOR USER */
const managerListPet = document.querySelector('.box-manager-list-pet')
const ListPet = document.querySelector('.box-list-pet')
const infoPetRef = query(ref(database, 'account/'+userID+'/listPet'), limitToLast(100));
onValue(infoPetRef,async (snapshot) => {
  let listPetManagerHTML =''
  let listPetHTML =''
  await snapshot.forEach((childSnapshot) => {
    var childData = childSnapshot.val();
    var childKey = childSnapshot.key;
    /* MANAGER LIST PET */
    let contentManager = ` <!-- Manager item start -->
                    <div class="Manager-item swiper-slide">
                      <div class="Manager-item-inner shadow-dark">
                        <span></span>
                        <span></span>
                        <div class="Manager-img">
                          <img src=`+childData.image+` alt="" />
                        </div>

                        <div class="Manager-content">
                          <h2>Name : `+childData.name+`</h2>
                          <div class="detail">
                            <span>Breed : `+childData.breed+`</span>
                            <span>Age: `+childData.age+`</span>
                            <span>Gender : `+childData.gender+`</span>
                            <span>Neutered : `+childData.neutered+`</span>
                          </div>
                        </div>
                      </div>
                      <div class="btn-box">
                        <button>
                          <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <button><i class="fa-solid fa-pen-to-square"></i></button>
                        <button><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </div>
                    <!-- Manager item end -->`;
    listPetManagerHTML += contentManager
    if(managerListPet)
    {
      managerListPet.innerHTML = listPetManagerHTML
    }
    /* END MANAGER LIST PET */

    /* LIST PET */
    let contentListPet = `<!-- Pet item start -->
                          <div class="Pet-item padd-15">
                            <div class="Pet-item-inner">
                              <div class="img">
                                <img src=`+childData.image+` alt="" />
                              </div>
                              <div class="info">
                                <h3 class="name">`+childData.name+`</h3>
                                <div class="detail">
                                <span>Breed : `+childData.breed+`</span>
                                <span>Age: `+childData.age+`</span>
                                <span>Gender : `+childData.gender+`</span>
                                <span>Neutered : `+childData.neutered+`</span>
                              </div>
                              </div>
                              <a href="details_pet.html?id_pet=`+childKey+`">
                                <img src="../img/chanmeo.png" alt=""/>
                              </a>
                            </div>
                          </div>
                          <!-- Pet item End -->`;
    listPetHTML += contentListPet
    if(ListPet)
    {
      ListPet.innerHTML = listPetHTML
    }
    /* END LIST PET */
  });

  const ManagerItem = document.querySelectorAll(".Manager-item")
  const ManagerContent = document.querySelectorAll('.Manager-content')
  const ManagerBTN = document.querySelectorAll('.Manager-item .btn-box')
  for (let i = 0; i < ManagerItem.length; i++) {
    ManagerItem[i].addEventListener('click', function () {
        ManagerContent[i].classList.toggle("active")
        ManagerBTN[i].classList.toggle("active")
    })
  }
});
/* END SHOW LIST PET FOR USER */
