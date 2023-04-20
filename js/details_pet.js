// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getStorage,ref as Sref,getDownloadURL,uploadBytesResumable,deleteObject,listAll } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
import { getDatabase, ref, onValue, query,get, limitToLast,set,update,remove,child} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

const userID = sessionStorage.getItem("idUser")

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
const listPet = query(
  ref(database, "account/" + userID + "/listPet"),
  limitToLast(100)
);

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idPet = params.get("idPet");

/* loading */
var mainContainer = document.querySelector(".main-container");
function load() {
  mainContainer.style.display = "block";
  mainContainer.style.opacity = 1;
}
load();

/* Details pet */
const info_detail_pet = document.getElementById("info-detail-pet");
if (idPet) {
  info_detail_pet.classList.add("active");
}

/* SHOW DETAIL INFO PET */
onValue(listPet, async (snapshot) => {
  let detailPetHTML = "";
  const headerContentLeft = document.querySelector("#info-detail-pet .content .content-left .header");
  await snapshot.forEach((childSnapshot) => {
    var childData = childSnapshot.val();
    var childKey = childSnapshot.key;
    if (childKey == idPet) {
      let content =
        `<div class="avatar_box">
                            <div class="avatar">
                                <img src=` +childData.image +` alt="">
                            </div>
                            <div class="name">
                                <h2>` +childData.name +`</h2>
                            </div>
                        </div>

                        <div class="info">
                            <div class="title">
                                <span></span>
                                <h2 class="text">Information</h2>
                            </div>

                            <div class="detail">
                                <span>Age : ` +childData.age +` week </span>
                                <span>Gender : ` +childData.gender +`</span>
                                <span>Breed : ` +childData.breed +`</span>
                                <span>Neutered : ` +childData.neutered +`</span>
                                <span>Weight : `+childData.health.weight+`KG</span>
                            </div>
                        </div> `;
      detailPetHTML = content;
      if (headerContentLeft) {
        headerContentLeft.innerHTML = detailPetHTML;
      }
    }
  });
});

/* END SHOW DETAIL INFO PET */

/* CHAR  */
function sumWeight(data)
{
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].weight;
  }
  return sum;
}
function sumArray(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function formaterDate(s) {
  var parts = s.split(":");
  return (
    parts[3] + ":" + parts[4] + " " + parts[2] + "/" + parts[1] + "/" + parts[0]
  );
}
function getDate(s) {
  var parts = s.split(":");
  return parts[0] + "-" + parts[1] + "-" + parts[2];
}

function lastArray(array) {
  let last = array[array.length - 1];
  return last;
}

const infoPetRef = query(
  ref(database, "account/" + userID + "/listPet/" + idPet),
  limitToLast(100)
);

onValue(infoPetRef, async (snapshot) => {
  let dataWeightFood = [],
    dataWeightPet = [],
    rightHTML = "";
  const contentRight = document.querySelector(
    "#info-detail-pet .content .content-right"
  );
  await snapshot.forEach((childSnapshot) => {
    var childData = childSnapshot.val();
    var childKey = childSnapshot.key;
    if (childKey == "foodManagement") {
      const newObj = {};
      for (let key in childData) {
        if (childData.hasOwnProperty(key)) {
          if (newObj[getDate(key)]) {
            newObj[getDate(key)].push(childData[key]);
          } else {
            newObj[getDate(key)] = [childData[key]];
          }
        }
      }
      for (let item in newObj) {
        dataWeightFood.push({ y: item, weight: sumArray(newObj[item]) });
      }
    }
    if (childKey == "weightManagement") {
      const newObj = {};
      for (let key in childData) {
        if (childData.hasOwnProperty(key)) {
          if (newObj[getDate(key)]) {
            newObj[getDate(key)].push(childData[key]);
          } else {
            newObj[getDate(key)] = [childData[key]];
          }
        }
      }
      for (let item in newObj) {
        dataWeightPet.push({ y: item,weight: newObj[item][newObj[item].length - 1]});
      }
    }
  });
  if (dataWeightFood.length > 7) {
    dataWeightFood = dataWeightFood.slice(
      dataWeightFood.length - 7,
      dataWeightFood.length
    );
  }
  if (dataWeightPet.length > 7) {
    dataWeightPet = dataWeightPet.slice(
      dataWeightPet.length - 7,
      dataWeightPet.length
    );
  }
  // UPDATE WEIGHT PET
  get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/health/`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      if(snapshot.val().weightPet != dataWeightPet[dataWeightPet.length - 1].weight )
      {
        update(ref(database,`account/`+userID+`/listPet/`+idPet+`/health/`),{
          weight : dataWeightPet[dataWeightPet.length - 1].weight
        })
      }
    } else {
      console.log("err");
    }
  })
  let caloriesNecessary = 30*(sumWeight(dataWeightPet)/dataWeightPet.length).toFixed(2) + 70;

  let caloriesFood = 1.2 // 1.2 calo / 1g
  let caloriesDay = ((caloriesFood * sumWeight(dataWeightFood)) / dataWeightFood.length).toFixed(2);

  let weightStatus;
  
  if(caloriesDay)
  {
    weightStatus = ' ';
  }
  else
  {
    if(caloriesDay > caloriesNecessary)
    {
      weightStatus = 'Fat';
    }
    else
    {
      weightStatus = 'Weak';
    }
  }

  let advice 
  if(weightStatus == '')
  {
    if(weightStatus == 'Fat')
    {
      advice = 'Reduce food, Reduce calories, Increase exercise';
    }
    else
    {
      advice = 'Increase project volume, Increase calories, Improve food quality';
    }
  }
  else
  {
    advice = ''
  }
  
  let sumWeightSub = sumWeight(dataWeightFood) ? sumWeight(dataWeightFood) : 0
  let Average = sumWeightSub ? (sumWeight(dataWeightPet)/dataWeightPet.length).toFixed(2) : 0
  let caloriesNecessarySub = caloriesNecessary ? caloriesNecessary : 0
  let caloriesDaySub = caloriesNecessarySub ? caloriesDay : 0

  let synthetic = `<div class="content-right-item">
                        <div class="title">
                            <span></span>
                            <h2 class="text">Synthetic</h2>
                        </div>
                        <div class="detail">
                              <span>Weight of food per week : `+sumWeightSub+` Gram</span>
                              <span>Average weight of pet per week : `+Average+` KG</span>  
                              <span>Needed calories for cats per day : `+caloriesNecessarySub+` Calo</span>
                              <span>Actual calories consumed per day : `+caloriesDaySub+` Calo</span>
                              <span>Pet care keyword : `+advice+`</span>
                              <span style="color:#e68d03">Weight status : `+weightStatus+`</span>
                              <span class="statusWeightAge" style="color:#e68d03"></span>
                        </div>
                    </div>`;
  // <div class="detail">
  //     <span>Weight of food for the week : 30KG</span>
  //     <span>The weight of the cat at the beginning of the week : 13.5</span>
  //     <span>The weight of the cat at the weekend : 16KG</span>
  //     <span>Health status : Gaining weight too fast</span>
  //     <span>Suggestion: Reduce the amount of food </span>
  // </div>
  let charWeightFood = `  <div class="content-right-item">
                                <div class="title">
                                    <span></span>
                                    <h2 class="text">Food Weight</h2>
                                </div>
                                <div class="Chart">
                                    <div class="box box-primary" >
                                        </div>
                                        <div class="box-body chart-responsive">
                                        <div class="chart" id="revenue-chart" style="height: 300px;width: 100%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
  let charWeightPet = `  <div class="content-right-item">
                                <div class="title">
                                    <span></span>
                                    <h2 class="text">Pet Weight</h2>
                                </div>
                                <div class="Chart">
                                    <div class="box box-primary" >
                                        </div>
                                        <div class="box-body chart-responsive">
                                        <div class="chart" id="line-chart" style="height: 300px;width: 100%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

  rightHTML += synthetic;
  rightHTML += charWeightFood;
  rightHTML += charWeightPet;

  if (rightHTML && rightHTML != "") {
    contentRight.innerHTML = rightHTML;
  }

  var area = new Morris.Line({
    element: "revenue-chart",
    resize: true,
    data: dataWeightFood,
    xkey: "y",
    ykeys: ["weight"],
    labels: ["weight"],
    lineColors: ["#3c8dbc"],
    hideHover: "auto",
  });

  var line = new Morris.Line({
    element: "line-chart",
    resize: true,
    data: dataWeightPet,
    xkey: "y",
    ykeys: ["weight"],
    labels: ["weight"],
    lineColors: ["#3c8dbc"],
    hideHover: "auto",
  });
});
/*END  CHAR */


/* SAVE TIME EAT */
function getTime()
{
  onValue(listPet,(snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if(childKey == idPet)
      {
        document.getElementById('monday').value = childData.timeEat.monday;
        document.getElementById('midday').value = childData.timeEat.midday;
        document.getElementById('night').value = childData.timeEat.night;
      }
    })
  });
}
getTime();

const save_time = document.getElementById('save-time')
const delete_time = document.getElementById('delete-time')
var error = false;

save_time.addEventListener('click',()=>{
  let monday = document.getElementById('monday').value
  let midday = document.getElementById('midday').value
  let night = document.getElementById('night').value

  if(monday.split(':')[0]  < 11)
  {
    get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/timeEat/monday`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        if(snapshot.val().monday != monday)
        {
          update(ref(database,`account/`+userID+`/listPet/`+idPet+`/timeEat`),{
            monday : monday,
          })
        }
      } else {
        console.log("err");
      }
    })
  }
  else
  {
    error = true
  }

  if(midday.split(':')[0]  >= 11 && midday.split(':')[0] <= 12 )
  {
    get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/timeEat/midday`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        if(snapshot.val().midday != midday)
        {
          update(ref(database,`account/`+userID+`/listPet/`+idPet+`/timeEat`),{
            midday : midday,
          })
        }
      } else {
        console.log("err");
      }
    })
  }
  else
  {
    error = true
  }
  if(night.split(':')[0]  >= 13  && night.split(':')[0]  < 24 )
  {
    get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/timeEat/night`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        if(snapshot.val().night != night)
        {
          update(ref(database,`account/`+userID+`/listPet/`+idPet+`/timeEat`),{
            night : night,
          })
        }
      } else {
        console.log("err");
      }
    })
  }
  else
  {
    error = true
  }

  if(error)
  {
    document.querySelector('.container-error-time').style.display = 'flex';
    error = false
  }
  else
  {
    document.querySelector('.container-success-time').style.display = 'flex';
  }

  
})

delete_time.addEventListener('click',()=>{
  update(ref(database,`account/`+userID+`/listPet/`+idPet+`/timeEat`),{
    monday:'',
    midday:'',
    night :''
  })
})

const close_error = document.querySelector('.close-error')
const close_success = document.querySelector('.close-success')

close_error.addEventListener('click',()=>{
  document.querySelector('.container-error-time').style.display = 'none';
  getTime();
})
close_success.addEventListener('click',()=>{
  document.querySelector('.container-success-time').style.display = 'none';
  getTime();
})
/* END SAVE TIME EAT */
