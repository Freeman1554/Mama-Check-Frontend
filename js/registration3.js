// const form = document.getElementById("registration-form3");
// const skipBtn = document.querySelector(".skip-btn");

// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const trustedContactName =
//         document.getElementById("trustedContactName").value.trim();

//     const trustedContactRelationship =
//         document.getElementById("relationship").value;

//     const trustedContactPhone =
//         document.getElementById("trustedContactPhone").value.trim();

//     const trustedContactLanguage =
//         document.getElementById("trustedContactLanguage").value;

//     let registrationData = JSON.parse(
//         localStorage.getItem("registrationData")
//     );

//     if (!registrationData) {
//         alert("Registration data missing. Please restart.");
//         window.location.href = "registration.html";
//         return;
//     }

//     registrationData.trustedContactName = trustedContactName;
//     registrationData.trustedContactRelationship =
//         trustedContactRelationship;
//     registrationData.trustedContactPhone =
//         trustedContactPhone;
//     registrationData.trustedContactLanguage =
//         trustedContactLanguage;

//     localStorage.setItem(
//         "registrationData",
//         JSON.stringify(registrationData)
//     );

//     window.location.href = "registration4.html";
// });

// // Skip button
// skipBtn.addEventListener("click", () => {
//     window.location.href = "registration4.html";
// });



// //Made adjustments to the code to ensure that the trusted contact information is saved and the user can proceed to the next step, even if they choose to skip entering this information. The form submission now saves the trusted contact details into localStorage and navigates to the next registration step. The skip button allows users to bypass this step while still preserving any previously entered registration data. 
// const form = document.getElementById("registration-form3");
// const skipBtn = document.querySelector(".skip-btn");

// function saveAndProceed() {
//     // 1. Retrieve existing data
//     let data = JSON.parse(localStorage.getItem("registrationData")) || {};
    
//     // 2. Add Trusted Contact details from the current form
//     data.trustedContactName = document.getElementById("trustedContactName").value.trim();
//     data.trustedContactPhone = document.getElementById("trustedContactPhone").value.trim();
//     data.trustedContactRelationship = document.getElementById("relationship").value;
//     data.trustedContactLanguage = document.getElementById("trustedContactLanguage").value;
    
//     // 3. Save the updated object back to localStorage
//     localStorage.setItem("registrationData", JSON.stringify(data));

//     // 4. Navigate to the final step
//     window.location.href = "registration4.html";
// }

// // Event Listeners
// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     saveAndProceed();
// });

// skipBtn.addEventListener("click", (e) => {
//     e.preventDefault(); // Prevents button from acting like a submit if inside a form
//     saveAndProceed();
// });


const form = document.getElementById("registration-form3");
const skipBtn = document.querySelector(".skip-btn");

async function submitRegistration() {
    // Retrieve previous steps
    const data = JSON.parse(localStorage.getItem("registrationData")) || {};

    // Add trusted contact
    data.trustedContactName = document
        .getElementById("trustedContactName")
        .value
        .trim();

    data.trustedContactPhone = document
        .getElementById("trustedContactPhone")
        .value
        .trim();

    data.trustedContactRelationship = document.getElementById("relationship").value;

    data.trustedContactLanguage = document.getElementById(
        "trustedContactLanguage"
    ).value;

    localStorage.setItem("registrationData", JSON.stringify(data));
    
    const token = localStorage.getItem("token");
    if(!token) {
        alert("Your session is missing. Please log in again.");
        window.location.href = "login.html";
        return;
    }
    console.log("Phone:", data.phone);
    //console.log("Payload:", payload);
    console.log("payload been sent:");
    console.log(JSON.stringify(data, null, 2));
    try {
        
        const response = await fetch(
            "http://localhost:3000/api/v1/pregnancies/register",
            //"https://mama-check.onrender.com/api/v1/pregnancies/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            }
        );
                

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Registration failed");
            return;
        }

    //Save phone for verification page
      localStorage.setItem("phone", data.phone);



// Save phone for OTP verification
    localStorage.setItem("phone", data.phone);

    alert(result.message)

//Go to OTP verification page
window.location.href = "registration4.html"
    } catch(error){
        console.error(error);
        alert("Unable to connect to server")
    }
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitRegistration();
});

skipBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitRegistration();
});

//         // Save phone for OTP verification
//         localStorage.setItem("phone", data.phone);

//         alert(result.message);

//         window.location.href = "registration4.html";

//     } catch (error) {
//         console.error(error);
//         alert("Unable to connect to the server.");
//     }
// }

