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

// age : week, weight : Gram
const catWeightByAge = [
    { age: 1, weight: 212},
    { age: 2, weight: 311},
    { age: 3, weight: 391.5},
    { age: 4, weight: 470},
    { age: 5, weight: 598},
    { age: 6, weight: 675},
    { age: 7, weight: 770},
    { age: 8, weight: 965},
    { age: 9, weight: 1010},
    { age: 10, weight: 1100},
    { age: 11, weight: 1200},
    { age: 12, weight: 1400},
    { age: 16, weight: 1900},
    { age: 20, weight: 1900},
    { age: 28, weight: 2000},
    { age: 38, weight: 2100},
    { age: 50, weight: 2200},
    { age: 52, weight: 3600}, // 1y
    { age: 104, weight: 4100}, // 2y
    { age: 156, weight: 4900}, // 3y
    { age: 234, weight: 5100}, // 4.5y
    { age: 338, weight: 5600}, // 6.5y
    { age: 442, weight: 7200}, // 8.5y
    { age: 546, weight: 8100}, // 10.5y
    { age: 650, weight: 9400}, // 10.5y
    { age: 728, weight: 10000}, // > 14y
];
var arrayWeight = []
var statusWeightAge = '';

function compareWeight(age,weight,arrayWeight)
{
    if(age < 50)
    {
        if( weight - arrayWeight >= 0 && weight - arrayWeight < 50 )
        {
            statusWeightAge = "Symmetrical"
        }
        else if ( weight - arrayWeight < 0 )
        {
            statusWeightAge = "Overweight"
        }
        else
        {
            statusWeightAge = "Underweight"
        }
    }
    else
    {
        if( weight - arrayWeight >= 0 && weight - arrayWeight < 150 )
        {
            statusWeightAge = "Symmetrical"
        }
        else if ( weight - arrayWeight < 0 )
        {
            statusWeightAge = "Overweight"
        }
        else
        {
            statusWeightAge = "Underweight"
        }
    }
}
let agePet = [];
get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/age`)).then(async (snapshot) => {
    if (snapshot.exists()) {
        agePet.push(+snapshot.val())
    } else {
        console.log("err");
    }
})

get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/health`)).then(async (snapshot) => {
    if (snapshot.exists()) {
        arrayWeight.push(snapshot.val().weight)
    } else {
        console.log("err");
    }
})

 // UPDATE WEIGHT PET
get(child(dbRef, `account/`+userID+`/listPet/`+idPet+`/DateCreate/`)).then(async (snapshot) => {
    var now = moment();
    var birthday = 0;
    var age = 0;
    if (snapshot.exists()) {
        birthday = snapshot.val().replace(/:/g, "-");
        age = now.diff(birthday, 'weeks');
        agePet[0] = age + agePet[0]
        update(ref(database,`account/`+userID+`/listPet/`+idPet+`/`),{
            ageNow : agePet[0]
        })
        catWeightByAge.forEach((cat,index) => {
            if(agePet[0] < 12)
            {
                if(agePet[0] == cat.age)
                {
                    compareWeight(agePet[0],cat.weight,arrayWeight[0])
                }
            }
            else
            {
                const filteredWeights = catWeightByAge.filter((item) => item.age < agePet[0]);
                const maxWeight = filteredWeights.reduce((max, item) => (item.age > max.age ? item : max), filteredWeights[0]).weight;
                compareWeight(agePet[0],maxWeight,arrayWeight[0])
            }
        })
        if(statusWeightAge != '')
        {
            document.querySelector('.statusWeightAge').innerHTML = 'Weight status of pets by age : '+statusWeightAge
        }
    } else {
      console.log("err");
    }
})
