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
  const contentLeft = document.querySelector(
    "#info-detail-pet .content .content-left"
  );
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
                                <span>Age : ` +childData.age +`</span>
                                <span>Gender : ` +childData.gender +`</span>
                                <span>Breed : ` +childData.breed +`</span>
                                <span>Neutered : ` +childData.neutered +`</span>
                                <span>Weight : `+childData.health.weight+`KG</span>
                            </div>
                        </div> `;
      detailPetHTML = content;
      if (contentLeft) {
        contentLeft.innerHTML = detailPetHTML;
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
  if(caloriesDay > caloriesNecessary)
  {
    weightStatus = 'Fat';
  }
  else
  {
    weightStatus = 'Weak';
  }

  let advice 
  if(weightStatus == 'Fat')
  {
    advice = 'Reduce food, Reduce calories, Increase exercise';
  }
  else
  {
    advice = 'Increase project volume, Increase calories, Improve food quality';
  }

  let synthetic = `<div class="content-right-item">
                        <div class="title">
                            <span></span>
                            <h2 class="text">Synthetic</h2>
                        </div>
                        <div class="detail">
                              <span>Weight of food for the week : `+sumWeight(dataWeightFood)+` Gram</span>
                              <span>Average pet weight for the week : `+(sumWeight(dataWeightPet)/dataWeightPet.length).toFixed(2)+` KG</span>  
                              <span>Calories needed for cats in 1 day : `+caloriesNecessary+` Calo</span>
                              <span>Actual calories consumed in 1 day : `+caloriesDay+` Calo</span>
                              <span>Weight status : `+weightStatus+`</span>
                              <span>Pet care keyword : `+advice+`</span>
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
