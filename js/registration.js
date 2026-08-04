// // registration.js

// const form = document.getElementById("registrationForm");

// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const fullName = document.getElementById("fullname").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const address = document.getElementById("address").value.trim();
//     const lga = document.getElementById("lga").value.trim();
//     const language = document.getElementById("language").value;

//     if (!fullName || !phone || !address || !lga || !language) {
//         alert("Please fill in all fields.");
//         return;
//     }

//     // Split full name into firstName and lastName
//     const names = fullName.split(" ");
//     const firstName = names[0];
//     const lastName = names.slice(1).join(" ") || "";

//     const registrationData = {
//         firstName,
//         lastName,
//         phone,
//         residentialAddress: address,
//         lga,
//         preferredLanguage: language.toLowerCase()
//     };

//     // Save data for next steps
//     localStorage.setItem(
//         "registrationData",
//         JSON.stringify(registrationData)
//     );

//     // Go to Step 2
//     window.location.href = "registration2.html";
// });

const form = document.getElementById("registrationForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

     //window.location.href = "registration2.html";

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

// Now use this 'fullName' variable for your registrationData object
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const lga = document.getElementById("lga").value.trim();
    const language = document.getElementById("language").value;
    const email = document.getElementById("email").value.trim();

    // Manual validation
    if (!firstName || !lastName || !phone || !address || !lga || !language ) {
        alert("Please fill in all fields.");
        return; // Stops execution if fields are missing
    }

    // Save and Proceed
    const registrationData = { 
    firstName,
    lastName,
    phone,
    email,
    residentialAddress: address,
    lga,
    preferredLanguage: language
 };
    localStorage.setItem("registrationData", JSON.stringify(registrationData));
    console.log("Language selected:", language);
    console.log(registrationData);
    window.location.href = "registration2.html";
});