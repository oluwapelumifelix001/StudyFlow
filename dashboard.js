const sidebar = document.querySelector(".sidebar");
const toggles = document.querySelectorAll(".menu-toggle");

toggles.forEach(btn => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
});

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";



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
const database = getDatabase(app);
export const auth = getAuth(app);


onAuthStateChanged(auth, (user) => {
  if (user) {
    const userName = user.displayName || "User";
    const userEmail = user.email;


    document.getElementById("welcomeName").textContent = `Welcome, ${userName}! `;

    console.log("User name:", userName);
    console.log("User email:", userEmail);
  } else {
    window.location.href = "Login.html";
    auth.signOut()
  }
});
const logout = document.getElementById('logout')
if (logout) {
  logout.addEventListener("click", () => {
    logout.textContent = 'Logging Out'
    setTimeout(() => {
      window.location.href = 'index.html'
      auth.signOut()
    }, 2000)
  }
  )
}
const dashboardTasks = document.getElementById("dashboardTasks");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const tasksRef = ref(database, `users/${user.uid}/tasks`);

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      dashboardTasks.innerHTML = "";

      if (data) {

        const allTasks = Object.values(data);
        const lastThree = allTasks.slice(-3);

        lastThree.forEach((task) => {
          const li = document.createElement("li");
          li.textContent = `${task.subject} - ${task.topic}  ${task.time}`;
          dashboardTasks.appendChild(li);
        });
      } else {
        dashboardTasks.innerHTML = "<li>No tasks yet</li>";
      }
    });
  } else {
    dashboardTasks.innerHTML = "<li>Login to see your tasks</li>";
  }
});

const percentText = document.getElementById("percent");
const circle = document.querySelector(".progress-ring .circle");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    const tasksRef = ref(database, `users/${userId}/tasks`);

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const allTasks = Object.values(data);
        const total = allTasks.length;

        const percent = Math.min((total / 10) * 100, 100);

        circle.style.background = `conic-gradient(#4eaaff ${percent * 3.6}deg, #dceeff 0deg)`;
        percentText.textContent = `${Math.round(percent)}%`;
      } else {

        circle.style.background = `conic-gradient(#dceeff 0deg, #dceeff 0deg)`;
        percentText.textContent = "0%";
      }
    });
  } else {
    circle.style.background = `conic-gradient(#dceeff 0deg, #dceeff 0deg)`;
    percentText.textContent = "0%";
  }
});


const quotes = async () => {

  const response = await fetch("https://zenquotes.io/api/random");
  const data = await response.json()

  const quote = data[0].q;
  const author = data[0].a;

  document.getElementById("Quotes").textContent = `"${quote}"`;
  document.getElementById("author").textContent = `"${author}"`;

}

quotes()



