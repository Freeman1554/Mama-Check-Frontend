
const BASE_URL = "http://localhost:3000";

//const BASE_URL = "https://mama-check23.onrender.com";


// API ENDPOINTS
const API = {
    chew: {
        register: `${BASE_URL}/api/v1/auth/register-chew`,
        login: `${BASE_URL}/api/v1/auth/login`
    },
    admin: {
        register: `${BASE_URL}/api/v1/auth/register-admin`,
        login: `${BASE_URL}/api/v1/auth/login`
    }
};

// DOM ELEMENTS

const roleBtns = document.querySelectorAll(".role-btn");
const tabBtns = document.querySelectorAll(".tab-btn");

const cardTitle = document.querySelector(".card-header h2");
const cardText = document.querySelector(".card-header p");
const submitBtn = document.querySelector(".submit-btn");

const signupFields = document.querySelector(".signup-fields");
// const signupInputs = signupFields ? signupFields.querySelectorAll("input") : [];

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const authForm = document.getElementById("authForm");

// STATE

let currentRole = "chew";
let currentTab = "login";


// UI UPDATE
function updateView() {
    const roleLabel = currentRole.toUpperCase();

    submitBtn.textContent =
        currentTab === "login"
            ? `Sign In as ${roleLabel}`
            : `Sign Up as ${roleLabel}`;

    if (currentTab === "login") {
        cardTitle.textContent = "Welcome Back";
        cardText.textContent = "Sign in to continue to your dashboard.";
        signupFields.style.display = "none";
        // signupInputs.forEach(input => {
        //     input.required = false;
        // });
    } else {
        cardTitle.textContent = "Create Account";
        cardText.textContent = "Register to access the platform.";
        signupFields.style.display = "block";
        // signupInputs.forEach(input => {
        //     input.required = true;
        // });
    }
}

// =============================
// ROLE SWITCH
// =============================
roleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        roleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentRole = btn.dataset.role.toLowerCase();
        updateView();
    });
});

// =============================
// TAB SWITCH
// =============================
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentTab = btn.dataset.tab.toLowerCase();
        updateView();
    });
});

// =============================
// PASSWORD TOGGLE
// =============================
if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        passwordInput.type =
            passwordInput.type === "password"
                ? "text"
                : "password";
    });
}

// =============================
// FETCH HELPER
// =============================
async function sendRequest(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", data);

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

// =============================
// FORM SUBMIT
// =============================
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Please wait...";

    try {
        let endpoint;
        let payload;

        // COMMON FIELDS
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

     
        // LOGIN
  
        if (currentTab === "login") {
            endpoint = API[currentRole].login;

            payload = { email, password };
        }

        // REGISTER
    
        else {
            const firstName = document.getElementById("firstName")?.value.trim();
            const lastName = document.getElementById("lastName")?.value.trim();
            const phone = document.getElementById("phone")?.value.trim();
            const state = document.getElementById("state")?.value.trim();
            const lga = document.getElementById("lga")?.value.trim();
            const phcName = document.getElementById("phcName")?.value.trim();

            endpoint = API[currentRole].register;

            payload = {
                firstName,
                lastName,
                email,
                password,
                phone,
                state,
                lga,
                phcName
            };
        }

        console.log("Endpoint:", endpoint);
        console.log("Payload:", payload);

        const result = await sendRequest(endpoint, payload);

        alert(result.message || "Success");

        // =============================
        // TOKEN HANDLING (SAFE)
        // =============================
        const token =
            result.token ||
            result.accessToken ||
            result.data?.token;

        if (token) {
            localStorage.setItem("token", token);
        }

        // =============================
        // REDIRECT AFTER LOGIN
        // =============================
        if (currentTab === "login") {
            window.location.href =
                currentRole === "admin"
                    ? "admin-dashboard.html"
                    : "mama-check.html";
        }

        authForm.reset();

    } catch (error) {
        console.error("AUTH ERROR:", error);
        alert(error.message || "Something went wrong");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// =============================
// INIT
// =============================
updateView();


/// --- Inside your registration/login submit success handler ---
const response = await fetch("https://mama-check.onrender.com/api/v1/auth/register-chew", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
});

if (response.ok) {
    const result = await response.json();
    
    // SAVE THESE EXACT KEYS SO THE OVERVIEW PAGE CAN RETRIEVE THEM:
    localStorage.setItem("firstName", result.user?.firstName || result.firstName);
    localStorage.setItem("lastName", result.user?.lastName || result.lastName);
    localStorage.setItem("phcName", result.user?.phcName || result.phcName);
    localStorage.setItem("accessToken", result.token); // Needed for your overview dashboard metrics call
    
    // Redirect to the dashboard
    window.location.href = "/overview.html";
}