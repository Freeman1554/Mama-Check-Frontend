
// // --- DOM Elements ---
// const verifyBtn = document.querySelector(".verify-btn");
// const resendBtn = document.querySelector(".resend-btn");
// const otpInputs = document.querySelectorAll(".otp-input");

// // Target the span we just created to display the phone number
// const displayPhoneSpan = document.getElementById("display-phone"); 

// let countdownInterval;

// // --- 1. Get Data from Step 1 & Initialize Page ---
// function getRegistrationData() {
//     // This fetches the object you saved in Step 1
//     const registrationData = JSON.parse(localStorage.getItem("registrationData"));
    
//     if (!registrationData || !registrationData.phone) {
//         alert("Registration details missing. Please restart registration.");
//         window.location.href = "registration.html";
//         return null;
//     }
//     return registrationData;
// }

// // Automatically display the phone number when Step 4 loads
// document.addEventListener("DOMContentLoaded", () => {
//     const registrationData = getRegistrationData();
    
//     // If the data exists and we found the HTML element, inject the phone number
//     if (registrationData && displayPhoneSpan) {
//         // Targets the 'phone' constant saved in Step 1
//         displayPhoneSpan.textContent = registrationData.phone; 
//     }
// });

// // --- 2. Automatic Input Focus Handling ---
// otpInputs.forEach((input, index) => {
//     input.addEventListener("input", () => {
//         if (input.value.length === 1 && index < otpInputs.length - 1) {
//             otpInputs[index + 1].focus();
//         }
//     });

//     // Handle backspace to move focus backward
//     input.addEventListener("keydown", (e) => {
//         if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
//             otpInputs[index - 1].focus();
//         }
//     });
// });

// // --- 3. Helper Functions ---
// function startResendCooldown(durationInSeconds) {
//     let timeLeft = durationInSeconds;
//     resendBtn.disabled = true;

//     countdownInterval = setInterval(() => {
//         if (timeLeft <= 0) {
//             clearInterval(countdownInterval);
//             resendBtn.disabled = false;
//             resendBtn.textContent = "Resend OTP";
//         } else {
//             resendBtn.textContent = `Resend OTP (${timeLeft}s)`;
//             timeLeft--;
//         }
//     }, 1000);
// }

// // --- 4. Verify OTP & Submit Registration ---
// verifyBtn.addEventListener("click", async () => {
//     const otp = [...otpInputs].map(input => input.value.trim()).join("");
//     if (otp.length !== 6) {
//         alert("Please enter a valid 6-digit OTP.");
//         return;
//     }

//     const registrationData = getRegistrationData();
//     if (!registrationData) return;

//     try {
//         verifyBtn.disabled = true;
//         verifyBtn.textContent = "Verifying & Registering...";

//         // Combine the registration data from previous steps with the OTP
//         const finalPayload = {
//             ...registrationData,
//             otp: otp
//         };

//         // Make a SINGLE request to the register endpoint
//         const registerResponse = await fetch("https://mama-check23.onrender.com/api/v1/pregnancies/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(finalPayload)
//         });

//         let registerData = await registerResponse.json().catch(() => ({
//             message: "Unable to read registration response."
//         }));

//         if (registerResponse.ok) {
//             alert("Registration successful!");
//             localStorage.setItem("registeredMother", JSON.stringify(registerData));
//             localStorage.removeItem("registrationData"); // Clear the temp data now that it's submitted
//             window.location.replace("overview.html");
//         } else {
//             alert(registerData.message || "Registration failed. Please check your OTP and try again.");
//         }

//     } catch (error) {
//         console.error("Registration Error:", error);
//         alert("Network error. Please check your connection and try again.");
//     } finally {
//         verifyBtn.disabled = false;
//         verifyBtn.textContent = "Verify Number";
//     }
// });

// // --- 5. Resend OTP Logic ---
// resendBtn.addEventListener("click", async () => {
//     const registrationData = getRegistrationData();
//     if (!registrationData) return;

//     try {
//         resendBtn.disabled = true;
//         resendBtn.textContent = "Sending...";

//         const response = await fetch("https://mama-check23.onrender.com/api/v1/auth/request-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             // Uses the same phone number targeted from step 1
//             body: JSON.stringify({ phone: registrationData.phone }) 
//         });

//         let data = await response.json().catch(() => ({
//             message: "Failed to read server response."
//         }));

//         if (response.ok) {
//             alert("A new verification code has been sent!");
            
//             // Clear current inputs and refocus
//             otpInputs.forEach(input => input.value = "");
//             otpInputs[0].focus();

//             startResendCooldown(60); // 60-second lock
//         } else {
//             alert(data.message || "Failed to resend OTP.");
//             resendBtn.disabled = false;
//             resendBtn.textContent = "Resend OTP";
//         }

//     } catch (error) {
//         console.error("Resend Error:", error);
//         alert("Network error. Could not request a new OTP.");
//         resendBtn.disabled = false;
//         resendBtn.textContent = "Resend OTP";
//     }
// });

// --- DOM Elements ---
const verifyBtn = document.querySelector(".verify-btn");
const otpInputs = document.querySelectorAll(".otp-input");
const resendBtn = document.getElementById("resendBtn");
const countdown = document.getElementById("countdown");

//Countdown Variables
let seconds = 60;
let countdownInterval = null;

//Countdown functions
function startCountdown() {
    clearInterval(countdownInterval);

    resendBtn.disabled = true;

    countdown.textContent = `Resend available in ${seconds}s`;

    countdownInterval = setInterval(() => {
        seconds--;

        countdown.textContent = `Resend available in ${seconds}s`;

        if (seconds <= 0) {
            clearInterval(countdownInterval);
            resendBtn.disabled = false;
            resendBtn.textContent = "Resend Code";
            countdown.textContent = "";
        }
    }, 1000);
}

//Start Countdown once page opens
window.addEventListener("DOMContentLoaded", () => {
    seconds = 60;
    startCountdown();
});


// --- 1. Auto-focus Logic ---
otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
});

// --- 2. Verify Button Event Listener ---

verifyBtn.addEventListener("click", async () => {

    const otp = [...otpInputs]
        .map(input => input.value.trim())
        .join("");

    if (otp.length !== 6) {
        alert("Please enter the complete verification code.");
        return;
    }

    const phone = localStorage.getItem("phone")
    
    if(!phone){
        alert("Registration information missing")
        window.location.href = "registration.html";
        return;
    }

    try {

        verifyBtn.disabled = true;
        verifyBtn.textContent = "Verifying...";
        
        console.log("Phone:", phone);
        console.log("OTP:", otp);
        const response = await fetch(
            "http://localhost:3000/api/v1/auth/verify-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: phone,
                    otp: otp
                })
            }
        );
       
        const result = await response.json();
         console.log("Verify response", result);

        if (!response.ok) {
            console.error("Backend Error:", result.error)
            alert(result.error);
            return;
        }

        //localStorage.setItem("token", result.token);
        localStorage.setItem("phone", phone);
        localStorage.removeItem("registrationData");

        alert("Patient phone verified successfully.");

        console.log("Redirecting...")

        window.location.href = "registration-success.html";

        //window.location.href = "overview.html";

    } catch (error) {

        console.error("Verification Error", error);

        alert(error.message);

    } finally {

        verifyBtn.disabled = false;
        verifyBtn.textContent = "Verify Number";

    }

});

    resendBtn.addEventListener("click", async () => {
    const phone = localStorage.getItem("phone");

    if (!phone) {
        alert("Phone number not found. Please register again.");
        return;
    }

    try {
        resendBtn.disabled = true;
        resendBtn.textContent = "Sending...";

        const response = await fetch(
            "http://localhost:3000/api/v1/auth/request-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Unable to resend verification code.");
            return;
        }

        alert("A new verification code has been sent.");

        // Restart your countdown
        seconds = 60;
        startCountdown();

    } catch (error) {
        console.error(error);
        alert("Network error.");
    } finally {
        //resendBtn.disabled = false;
        resendBtn.textContent = "Resend Code";
    }
});

// verifyBtn.addEventListener("click", async () => {
//     const otp = [...otpInputs].map(input => input.value.trim()).join("");
    
//     if (otp.length !== 6) {
//         alert("Please enter the full 6-digit OTP.");
//         return;
//     }

//     const registrationData = JSON.parse(localStorage.getItem("registrationData"));
//     if (!registrationData) {
//         alert("Registration data lost. Please restart the process.");
//         window.location.href = "registration.html";
//         return;
//     }

//     try {
//         verifyBtn.disabled = true;
//         verifyBtn.textContent = "Verifying...";

//         const finalPayload = { phone: registrationData.phone, otp: otp };

//         const response = await fetch("http://localhost:3000/api/v1/auth/verify-otp", {

//         //const response = await fetch("https://mama-check23.onrender.com/api/v1/auth/request-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(finalPayload) 
//         });

//         const result = await response.json().catch(() => ({}));

//         if (response.ok) {
//             alert("Registration successful!");
//             localStorage.removeItem("registrationData");
            
//             // NAVIGATION: Ensure overview.html is in the same directory
//             console.log("Redirecting to overview.html...");
//             window.location.replace("overview.html"); 
//         } else {
//             alert(result.message || "Registration failed. Please check your OTP.");
//         }
//     } catch (error) {
//         console.error("Registration Error:", error);
//         alert("Network error. Please check your connection.");
//     } finally {
//         verifyBtn.disabled = false;
//         verifyBtn.textContent = "Verify Number";
//     }
// });