import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getAuth,onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

const submit = document.getElementById('submit')
submit.addEventListener('click', (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value
    const topic = document.getElementById('topic').value
    const time = document.getElementById('time').value

    if (!subject || !topic || !time) {
        alert("Please fill in all fields!");
        return;
    }
    const user = auth.currentUser;

    if (user) {
        if (user) {
            console.log("User logged in:", user.email);
            console.log("User ID:", user.uid);
        } else {
            console.log("No user logged in");
        }
    }

    const taskData = {
        subject, topic, time, Date: new Date().toLocaleString(),
        time: new Date().toLocaleTimeString()
    }
    const userTasksRef = ref(database, `users/${user.uid}/tasks`);
    const newTaskRef = push(userTasksRef);
    set(newTaskRef, taskData)
        .then(() => {
            alert(" Task added successfully!");
            document.getElementById('subject').value = "";
            document.getElementById('topic').value = "";
            document.getElementById('time').value = "";
        })
        .catch((error) => {
            console.error("Error adding task:", error);
            alert("Failed to save task!");
        });
})


// 🔹 Get table body
const taskBody = document.getElementById("taskBody");

// 🔹 When user is logged in, fetch their tasks
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    const tasksRef = ref(database, `users/${userId}/tasks`);

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      taskBody.innerHTML = ""; // Clear table

      if (data) {
        let count = 1;
        Object.entries(data).forEach(([key, task]) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${count++}</td>
            <td>${task.subject || "—"}</td>
            <td>${task.topic || "—"}</td>
            <td>${task.time || "—"}</td>
          `;
          taskBody.appendChild(row);
        });
      } else {
        taskBody.innerHTML = `<tr class="empty"><td colspan="4">No tasks added yet</td></tr>`;
      }
    });
  } else {
    taskBody.innerHTML = `<tr class="empty"><td colspan="4">Please login to see your tasks</td></tr>`;
  }
});



