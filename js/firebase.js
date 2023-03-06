 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
 import { getStorage,ref as Sref,getDownloadURL,uploadBytesResumable,deleteObject } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
 import { getAuth,createUserWithEmailAndPassword,deleteUser} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
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

// var userID = 1

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

/* ADD USER */
const inputAddUser = document.querySelectorAll('.main-admin .box-add-user .input')
const btnAddUser = document.querySelector('.main-admin .box-add-user .btn-add')
const errorUser = document.querySelector('.main-admin .box-add-user .item.error')

function writeUserData(userId,avatar,name,age,gender,phone,address,countPet) {
  set(ref(database, 'account/' + userId + '/info'), {
    avatar: avatar,
    name: name,
    age : age,
    gender : gender,
    phone : phone,
    address : address,
    countPet:countPet
  });
}

if(btnAddUser)
{
  btnAddUser.addEventListener("click",() => {
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

        await writeUserData(user.uid,avatar,name,age,gender,phone,address,countPet);
      })  

      for(let i = 0; i < inputAddUser.length; i++ )
      {
        inputAddUser[i].value = ''
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
  onValue(dataRef, async (snapshot) => {
    let html = ''
    await snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
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
          <div class="control">
            <button id="removeUser" iduser="`+childKey+`"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `
      html += content
      boxUser.innerHTML = html
    });

    const btnRemoveUser = document.querySelectorAll("#removeUser")
    if(btnRemoveUser)
    {
      btnRemoveUser.forEach((item) => {
        item.addEventListener("click",() => {
          let idUser = item.getAttribute('iduser');
          console.log(idUser)
          //remove all infomation for user
          // get(child(dbRef, `account/`+idUser)).then((snapshot) => {
          //   if (snapshot.exists()) {
          //     let avatarUser =snapshot.val().avatar
          //     const desertRef = Sref(storage, avatarUser);
          //     // Delete the file
          //     deleteObject(desertRef).then(() => {
          //       // File deleted successfully
          //       // remove database for pet in realtime database
          //       remove(ref(database,`account/`+ idUser)).then(() => {
          //         //reload page
          //         location.reload()
          //       }).catch((error) => {
          //         const errorCode = error.code;
          //         const errorMessage = error.message;
          //         console.error(errorCode,errorMessage)
          //       });
          //     }).catch((error) => {
          //       const errorCode = error.code;
          //       const errorMessage = error.message;
          //       console.error(errorCode,errorMessage)
          //     });
    
          //   } else {
          //     console.log("No data available");
          //   }
          // })

          //remove account for user
          const user = auth.currentUser;
          auth().deleteUser(idUser).then(() => {
            console.log('Successfully deleted user');
          })
          .catch((error) => {
            console.log('Error deleting user:', error);
          });

        })
      })
    }
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
      });
    }
    else
    {
      notification.innerHTML = '<p style="color:red">No pet pictures yet</p>'
      setTimeout(() => {
        notification.innerHTML = ""
      }, 2000)
    }
  })
}

/* END ADD PET */

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

   /* SHOW,EDIT,REMOVE PET */
   const btnShowPets = document.querySelectorAll("#showInfo")
   const btnRemovePets =document.querySelectorAll("#removePet")
   if(btnShowPets)
   {
    btnShowPets.forEach((item) => {
      item.addEventListener("click",() => {
        let url = 'http://127.0.0.1:5500/html/details_pet.html?idPet=' + item.getAttribute('idpet')
        
        window.location.href = url
      })
    })
   }
   if(btnRemovePets)
   {
    btnRemovePets.forEach((item) => {
      item.addEventListener("click",() => {
        let idPet = item.getAttribute('idpet')
        get(child(dbRef, `account/`+userID+`/listPet/`+idPet)).then((snapshot) => {
          if (snapshot.exists()) {
            let imagePet =snapshot.val().image
            const desertRef = Sref(storage, imagePet);
            // Delete the file
            deleteObject(desertRef).then(() => {
              // File deleted successfully
              // remove database for pet in realtime database
              remove(ref(database,`account/`+ userID +`/listPet/`+ idPet)).then(() => {
                // update countpet for user
                get(child(dbRef, `account/`+userID+`/info/countPet`)).then((snapshot) => {
                  if (snapshot.exists()) {
                    let countPet = Number(snapshot.val()) - 1
                    update(ref(database,'/account/' + userID + '/info'),{
                      countPet : countPet,
                    })
                  } else {
                    console.log("No data available");
                  }
                })
  
                //reload page
                location.reload()
              }).catch((error) => {
                // Uh-oh, an error occurred!
              });
            }).catch((error) => {
              // Uh-oh, an error occurred!
            });
  
          } else {
            console.log("No data available");
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
/* END SHOW LIST PET FOR USER */

/* SHOW DETAIL INFO PET */
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

const IDPET = urlParams.get('idPet')

onValue(infoPetRef,async (snapshot) => {
  let detailPetHTML =''
  const boxDetailInfoPet = document.querySelector('#info-detail-pet .content')
  await snapshot.forEach((childSnapshot) => {
    var childData = childSnapshot.val();
    var childKey = childSnapshot.key;
    if(childKey == IDPET)
    {
      console.log(boxDetailInfoPet)
      let content = `<div class="content-left">
                        <div class="avatar_box">
                            <div class="avatar">
                                <img src=`+childData.image+` alt="">
                            </div>
                            <div class="name">
                                <h2>`+childData.name+`</h2>
                            </div>
                        </div>

                        <div class="info">
                            <div class="title">
                                <span></span>
                                <h2 class="text">Information</h2>
                            </div>

                            <div class="detail">
                                <span>Age : `+childData.age+`</span>
                                <span>Gender : `+childData.gender+`</span>
                                <span>Breed : `+childData.breed+`</span>
                                <span>Neutered : `+childData.neutered+`</span>
                                <span>Weight : 10KG</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-right">
                        <div class="content-right-item">
                            <div class="title">
                                <span></span>
                                <h2 class="text">Synthetic</h2>
                            </div>
                            <div class="detail">
                                <span>Weight of food for the week : 30KG</span>
                                <span>The weight of the cat at the beginning of the week : 13.5</span>
                                <span>The weight of the cat at the weekend : 16KG</span>
                                <span>Health status : Gaining weight too fast</span>
                                <span>Suggestion: Reduce the amount of food </span>
                            </div>
                        </div>
                        
                        <div class="content-right-item">
                            <div class="title">
                                <span></span>
                                <h2 class="text">Chart</h2>
                            </div>
                            <div class="Chart">
                                
                            </div>
                        </div>
                    </div>`;
      detailPetHTML = content
      if(boxDetailInfoPet)
      {
        boxDetailInfoPet.innerHTML = detailPetHTML
      }
    }
  });
});

/* END SHOW DETAIL INFO PET */