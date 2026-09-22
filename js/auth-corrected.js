
const BASE_URL = "http://localhost:3000";

//const BASE_URL = "https://mama-check.onrender.com";

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
const phcNameGroup = document.getElementById("phcName")?.closest(".form-group");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const authForm = document.getElementById("authForm");

// STATE
let currentRole = "chew";
let currentTab = "login";

// UI UPDATE
function updateView() {
    const roleLabel = currentRole.toUpperCase();

    // 1. Update Submit Button Text
    submitBtn.textContent =
        currentTab === "login"
            ? `Sign In as ${roleLabel}`
            : `Sign Up as ${roleLabel}`;

    // 2. Query inputs dynamically inside the signup container
    const signupInputs = signupFields ? signupFields.querySelectorAll("input") : [];

    if (currentTab === "login") {
        cardTitle.textContent = "Welcome Back";
        cardText.textContent = "Sign in to continue to your dashboard.";
        signupFields.style.display = "none";
        
        // Disable required validation so login isn't blocked by hidden fields
        signupInputs.forEach(input => {
            input.required = false;
        });
    } else {
        cardTitle.textContent = "Create Account";
        cardText.textContent = "Register to access the platform.";
        signupFields.style.display = "block";
        
        // Enable required validation for visible signup fields
        signupInputs.forEach(input => {
            if (input.id !== "firstName" && input.id !== "lastName") {
                input.required = true;
            }
        });

        // 3. Admin registration does not use PHC Name
        if (currentRole === "admin") {
            if (phcNameGroup) phcNameGroup.style.display = "none";
            const phcInput = document.getElementById("phcName");
            if (phcInput) phcInput.required = false;
        } else {
            if (phcNameGroup) phcNameGroup.style.display = "block";
            const phcInput = document.getElementById("phcName");
            if (phcInput) phcInput.required = true;
        }
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
            passwordInput.type === "password" ? "text" : "password";
    });
}

// =============================
// FETCH HELPER
// =============================
async function sendRequest(url, payload) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
            credentials: "include"
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = { message: "Invalid response format from server" };
        }

        if (!response.ok) {
            throw new Error(data.error || data.message || `HTTP Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timeout - Server is not responding. Please check your internet connection.");
        } else if (error instanceof TypeError) {
            throw new Error("Network error - Failed to reach the server. Please check your internet connection.");
        } else {
            throw error;
        }
    }
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

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

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

            if (!firstName || !lastName || !phone || !state || !lga) {
                throw new Error("All basic details are required for registration");
            }

            endpoint = API[currentRole].register;

            payload = {
                firstName,
                lastName,
                email,
                password,
                phone,
                state,
                lga
            };

            // Conditionally append phcName only if registering a CHEW
            if (currentRole === "chew") {
                const phcName = document.getElementById("phcName")?.value.trim();
                if (!phcName) {
                    throw new Error("PHC Name is required for CHEW registration");
                }
                payload.phcName = phcName;
            }
        }

        const result = await sendRequest(endpoint, payload);
        alert(result.message || "Success");

        const token = result.token || result.accessToken || result.data?.token;
        if (token) {
            localStorage.setItem("token", token);
        }

        // UPDATED: Proper routing for both Login and Registration actions
        window.location.href = currentRole === "chew" ? "mama-check.html" : "overview.html";
        window.location.href = currentTab === "login" ? (currentRole === "admin" ? "admin-dashboard.html" : "mama-check.html") : (currentRole === "admin" ? "overview.html" : "mama-check.html");

        authForm.reset();
        updateView();

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