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

/* LOGIN */
const btn_singin = document.getElementById('btn_login')
if(btn_singin)
{
  btn_singin.addEventListener("click",() => {
    var email = document.getElementById('value_email').value
    var password = document.getElementById('value_password').value
    console.log("email",email)
    console.log("password",password)
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      sessionStorage.setItem("idUser", user.uid)
      if(user.uid != 'JfPgQnku8zemR0jQcNUxfYfdtsa2')
      {
        window.location.href="https://vutran-it.github.io/Pet-Home/html/index.html"
      }
      else
      {
        window.location.href="https://vutran-it.github.io/Pet-Home/html/admin.html"
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  })
}