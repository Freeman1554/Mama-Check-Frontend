
//     //registration page 2 

// const form = document.getElementById("registration-form2");

// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const lmp = document.getElementById("lmp").value;
//     // const edd = document.getElementById("edd").value;
//     const clinicName = document.getElementById("clinicName").value;
//     const assignedChew = document.getElementById("assignedChew").value;

//     if (!lmp || !clinicName || !assignedChew) {
//         alert("Please complete all fields.");
//         return;
//     }

//     // Get data from Step 1
//     const registrationData = JSON.parse(
//         localStorage.getItem("registrationData")
//     ) || {};

//     // Add Step 2 data
//     registrationData.lmp = lmp;
//     // registrationData.edd = edd;
//     registrationData.clinicName = clinicName;
//     registrationData.assignedChew = assignedChew;

//     // Save updated data
//     localStorage.setItem(
//         "registrationData",
//         JSON.stringify(registrationData)
//     );

//     // Move to Step 3
//     window.location.href = "registration3.html";
// });

// Ensure this matches the ID in your HTML <form id="registration-form2">
const form = document.getElementById("registration-form2");

document.getElementById("assignedChew").value =
    localStorage.getItem("chewName");

form.addEventListener("submit", (e) => {
    // 1. Prevent the page from refreshing
    e.preventDefault();

    // 2. Get the values from the inputs
    const lmp = document.getElementById("lmp").value;
    const clinicName = document.getElementById("clinicName").value;
    const assignedChew = document.getElementById("assignedChew").value;

    // 3. Simple validation (if you want to force these fields)
    if (!lmp || !clinicName || !assignedChew) {
        alert("Please complete all required fields.");
        return;
    }

    // 4. Save data to localStorage
    const registrationData = JSON.parse(localStorage.getItem("registrationData")) || {};
    registrationData.lmp = lmp;
    registrationData.clinicName = clinicName;
    registrationData.assignedChew = assignedChew;
    
    localStorage.setItem("registrationData", JSON.stringify(registrationData));

    // 5. Move to the next page
    window.location.href = "registration3.html"; 
});