 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
 //import { getDatabase, ref, onValue, query, limitToLast } from "./firebase/database";
 import { getDatabase, ref, onValue, query, limitToLast  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 function formaterDate(s) {
     var parts = s.split(':');
     return parts[3] + ':' + parts[4] + ' ' + parts[2] + '/' + parts[1] + '/' + parts[0]; 
 }

 function formaterDateChart(s) {
   var parts = s.split(':');
   return parts[0]  + '-' + parts[1] + '-' + parts[2] + ' ' + parts[3] + ':' + parts[4];
 }

 const database = getDatabase(app);
 const dataRef = query(ref(database, 'floor1'), limitToLast(30));

 onValue(dataRef, (snapshot) => {
   var timeArray = [];
   var humidityArray = [];
   var temperatureArray = [];
   var tableData = "";
   var datachart = [];
   var dataTemp = [];
   snapshot.forEach((childSnapshot) => {
       var childKey = childSnapshot.key;
       var childData = childSnapshot.val();
                        
       if(childKey != 'current' && childKey != 'fan') {
           var parts = childKey.split(':');
           childKey = new Date(parts[0], parts[1], parts[2]);
           childKey = childKey.toDateString();

           timeArray.push(childKey.toString());
           humidityArray.push(childData.humidity);
           temperatureArray.push(childData.temperature);
           datachart.push({y: formaterDateChart(childSnapshot.key), humi: childData.humidity});
           dataTemp.push({y: formaterDateChart(childSnapshot.key), temp: childData.temperature});

           tableData += "<tr>" +
                    "<td>" + formaterDate(childSnapshot.key)+ "</td>"
                   + "<td >" + childData.temperature +" &#186; C</td>"
                   + "<td >" + childData.humidity + " %</td>"
               + "</tr>";
       }
   });

   if(datachart.length >10){
     datachart = datachart.slice(datachart.length-10,datachart.length);
   }
   if(dataTemp.length >10){
     dataTemp = dataTemp.slice(dataTemp.length-10,dataTemp.length);
   }

   localStorage.setItem("tableData",tableData);

   //document.getElementById("tableData").innerHTML = tableData;

   var area = new Morris.Line({
     element: "revenue-chart",
     resize: true,
     data: datachart,
     xkey: "y",
     ykeys: ["humi"],
     labels: ["Humi "],
     lineColors: ["#3c8dbc"],
     hideHover: "auto",

   });

   var line = new Morris.Line({
     element: "line-chart",
     resize: true,
     data: dataTemp,
     xkey: "y",
     ykeys: ["temp"],
     labels: ["Temp"],
     lineColors: ["#3c8dbc"],
     hideHover: "auto",

   });

});
