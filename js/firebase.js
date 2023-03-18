 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
 import { getStorage,ref as Sref,getDownloadURL,uploadBytesResumable,deleteObject,listAll } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
 import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
 import { getDatabase, ref, onValue, query,get, limitToLast,set,update,remove,child} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

 const firebaseConfig = {
    apiKey: "AIzaSyCZ92xMiEl2xzANh1hJzWioCEZv_POjbAQ",
    authDomain: "raspberry-test-0207.firebaseapp.com",
    databaseURL: "https://raspberry-test-0207-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "raspberry-test-0207",
    storageBucket: "raspberry-test-0207.appspot.com",
    messagingSenderId: "333665348767",
    appId: "1:333665348767:web:9335583220b1c7ce02c6aa",
    measurementId: "G-5XMV3BVGQP",
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());
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

async function removePet(userID, petID)
{
  get(child(dbRef, `account/`+userID+`/listPet/`+petID)).then(async (snapshot) => {
    if (snapshot.exists()) {
      let imagePet =snapshot.val().image
      const desertRef = Sref(storage, imagePet);
      // Delete the file
      await deleteObject(desertRef).then(() => {
        // File deleted successfully
        // remove database of pet in realtime database
        remove(ref(database,`account/`+ userID +`/listPet/`+ petID)).then(() => {
          // update countpet of user
          get(child(dbRef, `account/`+userID+`/info/countPet`)).then((snapshot) => {
            if (snapshot.exists()) {
              let countPet = Number(snapshot.val()) - 1
              update(ref(database,'/account/' + userID + '/info'),{
                countPet : countPet,
              })
            }
          })
        })
      })
    } else {
      console.log("err");
    }
  })
}

/* ============================================== FUNCTION ============================================= */

/* ADD USER */
const inputAddUser = document.querySelectorAll('.main-admin .box-add-user .input')
const btnAddUser = document.querySelector('.main-admin .box-add-user .btn-add')
const errorUser = document.querySelector('.main-admin .box-add-user .error-add-user')

function writeUserData(email,password,userId,avatar,name,age,gender,phone,address,countPet) {
  set(ref(database, 'account/' + userId + '/info'), {
    email:email,
    password:password,
    avatar: avatar,
    name: name,
    age : age,
    gender : gender,
    phone : phone,
    address : address,
    countPet:countPet
  })
}

if(btnAddUser)
{
  btnAddUser.addEventListener("click",() => {
    btnAddUser.setAttribute("disabled","")
    let email,password,name,avatar,age,gender,phone,address,fileAvatar
    let countPet = "0"
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
    }
    // get gender value
    for(let i = 0; i < document.getElementsByName('gender').length; i++ )
    {
      if (document.getElementsByName('gender').item(i).checked){
        gender = document.getElementsByName('gender').item(i).value;
      }
    }
    if(email != '' && password != '')
    {
      if(fileAvatar && fileAvatar != '')
      {
        // create an account with email and password
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          password = Base64.encode(password)
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

            await writeUserData(email,password,user.uid,avatar,name,age,gender,phone,address,countPet);
            
          })  

          for(let i = 0; i < inputAddUser.length; i++ )
          {
            inputAddUser[i].value = ''
          }
          errorUser.innerHTML = "<p style='color:green'>Add user to public</p>"
          setTimeout(()=>{
            errorUser.innerHTML = ""
          },2000)
          btnAddUser.removeAttribute("disabled")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode,errorMessage)
          errorUser.innerHTML = "<p style='color:red'>Looks like something went wrong</p>"
          setTimeout(()=>{
            errorUser.innerHTML = ""
          },2000)
          btnAddUser.removeAttribute("disabled")
        });
      }
      else
      {
        errorUser.innerHTML = "<p style='color:red'>Please choose a profile picture</p>"
        setTimeout(()=>{
          errorUser.innerHTML = ""
        },2000)
        btnAddUser.removeAttribute("disabled")
      }
    }
    else
    {
      errorUser.innerHTML = "<p style='color:red'>You have not entered your email and password</p>"
      setTimeout(()=>{
        errorUser.innerHTML = ""
      },2000)
    }
  })
  
}
/* END ADD USER */

/* SHOW LIST USER, REMOVE USER*/
const boxUser = document.querySelector('.main-admin .box-user')

if(boxUser)
{
  onValue(dataRef,(snapshot) => {
    let html = ''
    let checkDatabase = false
    snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if(childData.info)
      {
        checkDatabase = true
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
            <div class="control">
              <button id="removeUser" iduser="`+childKey+`"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `
        html += content
        boxUser.innerHTML = html
      }
    });
    if(checkDatabase == false)
    {
      boxUser.innerHTML = '<p class="defaul">Data is not displayed or data has not been updated</p>'
    }

    // remove user 
    const btnRemoveUser = document.querySelectorAll("#removeUser")
    if(btnRemoveUser)
    {
      btnRemoveUser.forEach((item) => {
        item.addEventListener("click",async (event) => {
          event.preventDefault()
          let idUser = item.getAttribute('iduser');
          await get(child(dbRef, `account/`+idUser +`/info`)).then(async (snapshot) => {
              if (snapshot.exists()) {
                let avatarUser =snapshot.val().avatar
                const desertAvatar = Sref(storage, avatarUser);
                let email = snapshot.val().email
                let password = snapshot.val().password
                password = Base64.decode(password)
                let floderPet = 'pets/' + idUser
                const desertListPet= Sref(storage, floderPet);
                // delete all user data in realtime database
                await remove(ref(database,`account/`+ idUser))
                // delete image avatar of user
                await deleteObject(desertAvatar)
                //list and delete all pet pictures
                listAll(desertListPet).then((res) => {
                  res.items.forEach((itemRef) => {
                    // All the items under listRef.
                    deleteObject(itemRef)
                  });
                })
                
                //log in and delete account of user
                await signInWithEmailAndPassword(auth,email, password).then(async(userCredential) => {
                  // User signed in, so we can delete the account
                  await userCredential.user.delete().then(() => {
                    // User account deleted successfully
                    console.log("User account deleted successfully");
                  })
                })
                
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error( error);
            });
          // remove account,info of user
        })
      })
    }
  });
}
/* ADD SHOW LIST USER,REMOVE USER */

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


/* ADD PET */
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
  const notification = document.querySelector('footer .notification')
  btnUploadPet.addEventListener("click",(event) => {
    event.preventDefault();
    btnUploadPet.setAttribute("disabled", "");
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

    let nameFile = 'pets/' +userID+ '/'+ idPet + '_' + date
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

          //update the number of pet of the user 
          get(child(dbRef, `account/`+userID+`/info/countPet`)).then((snapshot) => {
            if (snapshot.exists()) {
              let countPet = Number(snapshot.val()) + 1
              update(ref(database,'/account/' + userID + '/info'),{
                countPet : countPet,
              })
            } else {
              console.log("No data available");
            }
          })
          // delete value and notification
          for(let i = 0; i < inputInfoPet.length; i++ )
          {
            inputInfoPet[i].value = ''
          }
          notification.innerHTML = '<p style="color:green">Successfully added pets</p>'
          setTimeout(() => {
            notification.innerHTML = ""
          }, 2000)
          btnUploadPet.removeAttribute("disabled")
        }
        else
        {
          notification.innerHTML = '<p style="color:red">Necessary information has not been receiveds</p>'
          setTimeout(() => {
            notification.innerHTML = ""
          }, 2000)
        }
      })  
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
        notification.innerHTML = '<p style="color:red">Looks like something went wrong</p>'
        setTimeout(() => {
          notification.innerHTML = ""
        }, 2000)
        btnUploadPet.removeAttribute("disabled")
      });
    }
    else
    {
      notification.innerHTML = '<p style="color:red">No pet pictures yet</p>'
      setTimeout(() => {
        notification.innerHTML = ""
      }, 2000)
      btnUploadPet.removeAttribute("disabled")
    }
  })
}

/* END ADD PET */

/* SHOW LIST PET OF USER */
const managerListPet = document.querySelector('.box-manager-list-pet')
const ListPet = document.querySelector('.box-list-pet')
const infoPetRef = query(ref(database, 'account/'+userID+'/listPet'), limitToLast(100));
onValue(infoPetRef,async (snapshot) => {
  let listPetManagerHTML =''
  let listPetHTML =''
  let checkDatabase = false
  await snapshot.forEach((childSnapshot) => {
    checkDatabase = true
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
                        <button id="showInfo" idpet="`+childKey+`"><i class="fa-solid fa-magnifying-glass"></i></button>
                        <button><i class="fa-solid fa-pen-to-square"></i></button>
                        <button id="removePet" idpet="`+childKey+`"><i class="fa-solid fa-trash"></i></button>
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
                              <a href="details_pet.html?idPet=`+childKey+`">
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
  if(managerListPet && checkDatabase == false)
  {
    managerListPet.innerHTML = '<p class="defaul">Data is not displayed or data has not been updated</p>'
  }

  if(ListPet && checkDatabase == false)
  {
    ListPet.innerHTML = '<p class="defaul">Data is not displayed or data has not been updated</p>'
  }

   /* SHOW,EDIT,REMOVE PET */
   const btnShowPets = document.querySelectorAll("#showInfo")
   const btnRemovePets =document.querySelectorAll("#removePet")
   if(btnShowPets)
   {
    btnShowPets.forEach((item) => {
      item.addEventListener("click",() => {
        let url = hosting + '/html/details_pet.html?idPet=' + item.getAttribute('idpet')
        
        window.location.href = url
      })
    })
   }
   if(btnRemovePets)
   {
    btnRemovePets.forEach((item) => {
      item.addEventListener("click",async () => {
        let idPet = item.getAttribute('idpet')
        get(child(dbRef, `account/`+userID+`/listPet/`+idPet)).then((snapshot) => {
          if (snapshot.exists()) {
            let imagePet =snapshot.val().image
            const desertRef = Sref(storage, imagePet);
            // Delete the file
            deleteObject(desertRef).then(() => {
              // File deleted successfully
              // remove database of pet in realtime database
              remove(ref(database,`account/`+ userID +`/listPet/`+ idPet)).then(() => {
                // update countpet of user
                get(child(dbRef, `account/`+userID+`/info/countPet`)).then((snapshot) => {
                  if (snapshot.exists()) {
                    let countPet = Number(snapshot.val()) - 1
                    update(ref(database,'/account/' + userID + '/info'),{
                      countPet : countPet,
                    })
                  }
                })
              })
            })
          } else {
            console.log("err");
          }
        })
      })
    })
   }
    
   /* END SHOW,EDIT,REMOVE PET */

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
/* END SHOW LIST PET OF USER */

/* SHOW INFOMATION SYSTEM */
const infoSystem = query(ref(database, 'account/'+userID+'/system'), limitToLast(100));
const boxSystem = document.querySelector('.system-content')
/* END SHOW INFOMATION SYSTEM */
//console.log(infoSystem)
onValue(infoSystem,async (snapshot) => {
  let systemHTML ='',systemWater='',systemFood='',statusLedWater,statusMachinesWater,statusAutoWater,statusLedFood,statusMachinesFood
  let checkDatabase = false
  await snapshot.forEach((childSnapshot) => {
    checkDatabase = true
    var childData = childSnapshot.val();
    var childKey = childSnapshot.key;
    //console.log(childKey, childData)
    /* SYSTEM WATER*/
    if(childKey == 'water')
    {
      statusLedWater = childData.btnLed;
      statusMachinesWater = childData.machies;
      statusAutoWater = childData.auto;
      systemWater = `<!-- System item start -->
                        <div class="System-item padd-15">
                          <div class="System-item-inner">
                            <div class="img">
                              <img src="../img/machine1.png" alt="" />
                            </div>
                            <div class="info">
                              <h3 class="name">Drinking</h3>
                              <div class="detail">
                                <div>
                                  <p>Led Green :</p><span>`+(Number(childData.ledGreen) == 1 && statusLedWater == 1 ? 'On' : 'Off')+`</span>
                                </div>
                                <div>
                                  <p>Led Red :</p><span>`+(Number(childData.ledRed) == 1 && statusLedWater == 1 ? 'On' : 'Off')+`</span>
                                </div>
                                <div>
                                  <p>Status Pump :</p><span>`+(Number(childData.machies) == 1 ? 'On' : 'Off')+`</span>
                                </div>
                                <div>
                                  <p>Percent :</p><span>`+childData.percent+`%</span>
                                </div>
                              </div>
                            </div>
                            <div class="box-icon">
                              <div class="`+(childData.btnLed == 1?'active' : '')+`" id="light-switch-water"> 
                                `+(childData.btnLed == 1?'<i class="fa-solid fa-lightbulb"></i>' : '<i class="fa-regular fa-lightbulb"></i>')+`
                              </div>
                              <div class="`+(childData.machies == 1?'active' : '')+`" id="machines-switch-water"> 
                                `+(childData.machies == 1?'<i class="fa-solid fa-droplet"></i>' : '<i class="fa-solid fa-droplet-slash"></i>')+`
                              </div>
                              <div class="`+(childData.auto == 1?'active' : '')+`" id="auto-switch-water"> 
                                <i class="fa-brands fa-autoprefixer"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- System item End -->`;
      systemHTML += systemWater
    }
    if(childKey == 'food')
    {
      statusLedFood = childData.btnLed
      statusMachinesFood = childData.machies;
      systemFood = ` <!-- System item start -->
                        <div class="System-item padd-15">
                          <div class="System-item-inner">
                            <div class="img">
                              <img src="../img/machine1.png" alt="" />
                            </div>
                            <div class="info">
                              <h3 class="name">Feeding</h3>
                              <div class="detail">
                                <div>
                                  <p>Led Green :</p><span>`+(Number(childData.ledGreen) == 1 && statusLedFood == 1 ? 'On' : 'Off')+`</span>
                                </div>
                                <div>
                                  <p>Led Red :</p><span>`+(Number(childData.ledRed == 1)&& statusLedFood == 1 ? 'On' : 'Off')+`</span>
                                </div>
                                <div>
                                  <p>Status Pump :</p><span>`+(Number(childData.machies) == 1 ? 'On' : 'Off')+`</span>
                                </div>
                                <div>
                                  <p>Percent :</p><span>`+childData.percent+`%</span>
                                </div>
                              </div>
                            </div>
                            <div class="box-icon">
                              <div class="`+(childData.btnLed == 1?'active' : '')+`" id="light-switch-food"> 
                                `+(childData.btnLed == 1?'<i class="fa-solid fa-lightbulb"></i>' : '<i class="fa-regular fa-lightbulb"></i>')+`
                              </div>
                              <div class="`+(childData.machies == 1?'active' : '')+`" id="machines-switch-food"> 
                                `+(childData.machies == 1?'<i class="fa-solid fa-bowl-food"></i>' : '<i class="fa-solid fa-bowl-rice"></i>')+`
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- System item End -->`;
      systemHTML += systemFood
    }
    /* END SYSTEM WATER */
    if(boxSystem)
    {
      boxSystem.innerHTML = systemHTML
    }
    const ledWater = document.querySelector("#light-switch-water")
    const machinesWater = document.querySelector("#machines-switch-water")
    const autoWater = document.querySelector("#auto-switch-water")
    const ledFood = document.querySelector("#light-switch-food")
    const machinesFood = document.querySelector("#machines-switch-food")
    if(ledWater)
    {
      ledWater.addEventListener("click",()=>{
        update(ref(database,'/account/' + userID + '/system/water'),{
          btnLed : (statusLedWater == 1 ? 0 : 1),
        })
      })
    }
    if(machinesWater)
    {
      machinesWater.addEventListener("click",()=>{
        update(ref(database,'/account/' + userID + '/system/water'),{
          machies : (statusMachinesWater == 1 ? 0 : 1),
        })
      })
    }
    if(autoWater)
    {
      autoWater.addEventListener("click",()=>{
        update(ref(database,'/account/' + userID + '/system/water'),{
          auto : (statusAutoWater == 1 ? 0 : 1),
        })
        if(statusAutoWater == 1)
        {
          console.log(132123);
          machinesWater.style.opacticy = 0.5;
          machinesWater.style.pointerEvents = "none";
          machinesWater.style.cursor = 'no-drop';
        }
      })
    }
    if(ledFood)
    {
      ledFood.addEventListener("click",()=>{
        update(ref(database,'/account/' + userID + '/system/food'),{
          btnLed : (statusLedFood == 1 ? 0 : 1),
        })
      })
    }
    if(machinesFood)
    {
      machinesFood.addEventListener("click",()=>{
        update(ref(database,'/account/' + userID + '/system/food'),{
          machies : (statusMachinesFood == 1 ? 0 : 1),
        })
      })
    }
  });

  if(boxSystem && checkDatabase == false)
  {
    boxSystem.innerHTML = '<p class="defaul">Data is not displayed or data has not been updated</p>'
  }
});