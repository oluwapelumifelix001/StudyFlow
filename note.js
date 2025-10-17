
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

    // Your Firebase config
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

    const notesContainer = document.getElementById("notesContainer");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const notesRef = ref(db, "notes/" + user.uid);
        onValue(notesRef, (snapshot) => {
          notesContainer.innerHTML = ""; // clear old notes
          const notes = snapshot.val();

          if (!notes) {
            notesContainer.innerHTML = "<p>No notes found yet 📝</p>";
            return;
          }

          Object.values(notes).forEach((note) => {
            const noteDiv = document.createElement("div");
            noteDiv.classList.add("note-card");

            const date = new Date(note.createdAt).toLocaleString();

            noteDiv.innerHTML = `
              <h4>🗒️ Note</h4>
              <p>${note.text}</p>
              <small>Saved on: ${date}</small>
            `;

            notesContainer.appendChild(noteDiv);
          });
        });
      } else {
        notesContainer.innerHTML = "<p>Please log in to see your notes 🔒</p>";
      }
    });
  