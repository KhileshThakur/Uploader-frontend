const API_URL = "http://localhost:5000/api/auth";

// Validate Input Fields
function validateInput(id, errorId, condition) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (condition) {
        error.style.display = "block";
        return false;
    } else {
        error.style.display = "none";
        return true;
    }
}

// Register Function
async function register() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    // Validate Inputs
    const isNameValid = validateInput("signupName", "nameError", name === "");
    const isEmailValid = validateInput("signupEmail", "emailError", !email.includes("@"));
    const isPasswordValid = validateInput("signupPassword", "passwordError", password.length < 6);

    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            window.location.href = "login.html";
        }
    } catch (error) {
        alert("Error registering! Try again.");
    }
}

// Login Function
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // Validate Inputs
    const isEmailValid = validateInput("loginEmail", "loginEmailError", !email.includes("@"));
    const isPasswordValid = validateInput("loginPassword", "loginPasswordError", password === "");

    if (!isEmailValid || !isPasswordValid) return;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login Successful!");
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Error logging in! Try again.");
    }
}
