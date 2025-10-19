
  // Import Firebase SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
  const db = getDatabase(app);
  const auth = getAuth(app);

  
  const chatContainer = document.getElementById("chatContainer");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");

  let currentUser = "Anonymous";

  // ✅ Check if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user.displayName || user.email || "user";
    }
  });

  
  sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message === "") return;

    const chatRef = ref(db, "studyconnect/messages");
    push(chatRef, {
      name: currentUser,
      text: message,
      timestamp: new Date().toISOString()
    });

    messageInput.value = "";
  });


  const chatRef = ref(db, "studyconnect/messages");
  onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    displayMessage(data.name, data.text);
  });
  
  function displayMessage(name, text) {
    const div = document.createElement("div");
    div.classList.add("message");
    if (name === currentUser) div.classList.add("user");

    div.innerHTML = `
      <div class="name">${name}</div>
      ${text}
    `;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

