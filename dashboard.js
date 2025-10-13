const sidebar = document.querySelector(".sidebar");
const toggles = document.querySelectorAll(".menu-toggle");

toggles.forEach(btn => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
});

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBwy25TETcpznJ2-rROhCZCcMS4ccSabEc",
    authDomain: "study-flow-d6d80.firebaseapp.com",
    projectId: "study-flow-d6d80",
    storageBucket: "study-flow-d6d80.appspot.com",
    messagingSenderId: "407208799621",
    appId: "1:407208799621:web:bb1f5bed0bacc0f918e8ec",
    measurementId: "G-D1V7PS5PVM"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userName = user.displayName || "User";
        const userEmail = user.email;


        document.getElementById("welcomeName").textContent = `Welcome, ${userName}! 👋`;

        console.log("User name:", userName);
        console.log("User email:", userEmail);
    } else {
        window.location.href = "Login.html";
        auth.signOut()
    }
});
const logout = document.getElementById('logout')
if(logout){
    logout.addEventListener("click" ,() => {
     logout.textContent = 'Logging Out'  
     setTimeout( () => {
        window.location.href = 'index.html'
        auth.signOut()
     },2000) 
}
)
}



