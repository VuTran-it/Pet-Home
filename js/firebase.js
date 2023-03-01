 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
 import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
 import { getDatabase, ref, onValue, query, limitToLast  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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
const analytics = getAnalytics(app);
const auth = getAuth(app);

//  function formaterDate(s) {
//      var parts = s.split(':');
//      return parts[3] + ':' + parts[4] + ' ' + parts[2] + '/' + parts[1] + '/' + parts[0]; 
//  }

//  function formaterDateChart(s) {
//    var parts = s.split(':');
//    return parts[0]  + '-' + parts[1] + '-' + parts[2] + ' ' + parts[3] + ':' + parts[4];
//  }

//  const database = getDatabase(app);
//  const dataRef = query(ref(database, 'account'), limitToLast(30));

//  onValue(dataRef, (snapshot) => {
//    var timeArray = [];
//    var humidityArray = [];
//    var temperatureArray = [];
//    var tableData = "";
//    var datachart = [];
//    var dataTemp = [];
//    snapshot.forEach((childSnapshot) => {
//       var childKey = childSnapshot.key;
//       var childData = childSnapshot.val();
//       var count = 0;
//       if(userID == childKey)
//       {
//         console.log(childData)
//         Object.keys(childData).forEach((item) =>{
//           console.log(item)
//         })
//       }

//        if(childKey != 'current' && childKey != 'fan') {
//            var parts = childKey.split(':');
//            childKey = new Date(parts[0], parts[1], parts[2]);
//            childKey = childKey.toDateString();

//            timeArray.push(childKey.toString());
//            humidityArray.push(childData.humidity);
//            temperatureArray.push(childData.temperature);
//            datachart.push({y: formaterDateChart(childSnapshot.key), humi: childData.humidity});
//            dataTemp.push({y: formaterDateChart(childSnapshot.key), temp: childData.temperature});

//            tableData += "<tr>" +
//                     "<td>" + formaterDate(childSnapshot.key)+ "</td>"
//                    + "<td >" + childData.temperature +" &#186; C</td>"
//                    + "<td >" + childData.humidity + " %</td>"
//                + "</tr>";
//        }
//    });

//    if(datachart.length >10){
//      datachart = datachart.slice(datachart.length-10,datachart.length);
//    }
//    if(dataTemp.length >10){
//      dataTemp = dataTemp.slice(dataTemp.length-10,dataTemp.length);
//    }

//    localStorage.setItem("tableData",tableData);

//    //document.getElementById("tableData").innerHTML = tableData;

//    var area = new Morris.Line({
//      element: "revenue-chart",
//      resize: true,
//      data: datachart,
//      xkey: "y",
//      ykeys: ["humi"],
//      labels: ["Humi "],
//      lineColors: ["#3c8dbc"],
//      hideHover: "auto",

//    });

//    var line = new Morris.Line({
//      element: "line-chart",
//      resize: true,
//      data: dataTemp,
//      xkey: "y",
//      ykeys: ["temp"],
//      labels: ["Temp"],
//      lineColors: ["#3c8dbc"],
//      hideHover: "auto",

//    });

// });



// btn_singin.addEventListener("click",()=>{
//   var email = document.getElementById('value_email').value
//   var password = document.getElementById('value_password').value
//   console.log("email",email)
//   console.log("password",password)
//   createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });
// })

/* END LOGIN */