const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.querySelector("#toggle-login-password");
if (togglePasswordBtn && passwordInput) {
    let isVisible = false;
    const eye = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3.5" stroke="#888" stroke-width="2"/></svg>';
    const eyeOff = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" stroke-width="2" d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.8M23 12s-4 7-11 7c-2.5 0-4.7-.7-6.5-1.8"/><circle cx="12" cy="12" r="3.5" stroke="#888" stroke-width="2"/></svg>';
    togglePasswordBtn.parentElement.addEventListener("click", function (e) {
        e.preventDefault();
        isVisible = !isVisible;
        if (isVisible) {
            passwordInput.type = "text";
            togglePasswordBtn.outerHTML = eyeOff;
            // Replace the SVG
            togglePasswordBtn.parentElement.innerHTML = eyeOff;
        } else {
            passwordInput.type = "password";
            togglePasswordBtn.parentElement.innerHTML = eye;
        }
    });
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, getRedirectResult, FacebookAuthProvider, TwitterAuthProvider } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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
const analytics = getAnalytics(app);
const auth = getAuth();
const user = auth.currentUser;
let btn = document.getElementById('btn')
const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const auth = getAuth(app);
        const firstName = document.getElementById('first-name').value;
        const message = document.getElementById("message");
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(userCredential);
                const btn = document.getElementById("btn");
                updateProfile(user, { displayName: firstName });
                message.textContent = "Sign up successful! Welcome, " + user.email;
                message.style.color = "green";
                console.log(user);
                btn.textContent = "Creating Account...";
                setTimeout(() => {

                    window.location.href = "Login.html";
                }, 2000);
            })
            .catch((error) => {
                if (error.code === 'auth/account-exists-with-different-credential') {
                    message.textContent = "This email is already registered with another sign-in method. Please use the correct provider.";
                } else if (error.code === 'auth/invalid-email') {
                    message.textContent = "Please input valid credentials";
                }
                else if (error.code === 'auth/popup-closed-by-user') {
                    message.textContent = "Authenthication cancelled by user"
                } else if (error.code === 'auth/network-request-failed') {
                    message.textContent = "Connection error"
                }
                else {
                    message.textContent = error.message;
                }

                message.style.color = "red";
            });
    });
}
const googleBtn = document.getElementById('googleBtn')
if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // User info
                const user = result.user;
                console.log("Signed in user:", user);
                message.textContent = "Sign in successful! Welcome, " + user.email;
                message.style.color = "green";
                window.location.href = "dashboard.html"
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
            })
            .catch((error) => {
                if (error.code === 'auth/account-exists-with-different-credential') {
                    message.textContent = "This email is already registered with another sign-in method. Please use the correct provider.";
                } else if (error.code === 'auth/invalid-email') {
                    message.textContent = "Please input valid credentials";
                }
                else if (error.code === 'auth/popup-closed-by-user') {
                    message.textContent = "Authenthication cancelled by user"
                }
                else if (error.code === 'auth/network-request-failed') {
                    message.textContent = "Connection error"
                }
                else {
                    message.textContent = error.message;
                }
                message.style.color = "red";
            });
    })
}

const githubBtn = document.getElementById('githubBtn')
githubBtn.addEventListener("click", () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const message = document.getElementById("message");
            const user = result.user;
            console.log("GitHub signed in:", user);
            message.textContent = "Sign in successful! Welcome, " + user.email;
            message.style.color = "green";
            window.location.href = "dashboard.html"
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            console.log("GitHub Token:", token);
        })
        .catch((error) => {
            if (error.code === 'auth/account-exists-with-different-credential') {
                message.textContent = "This email is already registered with another sign-in method. Please use the correct provider.";
                message.style.color = "red";
            }
            else if (error.code === 'auth/popup-closed-by-user') {
                message.textContent = "Authenthication cancelled by user"
            }
            else if (error.code === 'auth/network-request-failed') {
                message.textContent = "Connection error"
            }
            else {
                message.textContent = error.message;
                message.style.color = "red";
            }
        });
});

const twitterBtn = document.getElementById('twitterBtn')
twitterBtn.addEventListener("click", () => {
    const twitterProvider = new TwitterAuthProvider();
    signInWithPopup(auth, twitterProvider)
        .then((result) => {
            const user = result.user;
            console.log("Twitter signed in:", user);
            const credential = TwitterAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const secret = credential.secret;
            console.log("Twitter Token:", accessToken, "Secret:", secret);
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Twitter Login Error:", error.code, error.message);
            if (error.code === 'auth/account-exists-with-different-credential') {
                message.textContent = "This email is already registered with another sign-in method. Please use the correct provider.";
                message.style.color = "red";
            }
            if (error.code === 'auth/popup-closed-by-user') {
                console.log("The popup was closed before completing the sign-in.");
            }
            if (error.code === 'auth/invalid-email') {
                message.textContent = " Please input valid credentials";
                message.style.color = "red";
            }
            else if (error.code === 'auth/popup-closed-by-user') {
                message.textContent = "Authenthication cancelled by user"
            }
            else if (error.code === 'auth/network-request-failed') {
                message.textContent = "Connection error"
            }
            else {
                message.textContent = error.message;
                message.style.color = "red";
            }

        });
});

