// ==========================================
// MamaCheck Admin Dashboard
// dashboard.js
// ==========================================

// Dashboard Statistics
const dashboardStats = {
    women: 1422,
    anc: 1025,
    missed: 67,
    flags: 30
};

// Facility Data
const facilities = [
    {
        name: "PHC Kano Central",
        women: 412,
        anc: 298,
        missed: 14,
        flags: 6,
        chews: 8
    },
    {
        name: "PHC Nassarawa",
        women: 367,
        anc: 251,
        missed: 22,
        flags: 11,
        chews: 6
    },
    {
        name: "PHC Oyo",
        women: 289,
        anc: 210,
        missed: 9,
        flags: 3,
        chews: 5
    },
    {
        name: "PHC Lagos",
        women: 198,
        anc: 142,
        missed: 18,
        flags: 8,
        chews: 4
    },
    {
        name: "PHC Abia",
        women: 156,
        anc: 124,
        missed: 4,
        flags: 2,
        chews: 3
    }
];


// ==========================================
// Counter Animation
// ==========================================

function animateCounter(id, target) {

    const element = document.getElementById(id);

    let current = 0;

    const increment = Math.ceil(target / 60);

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        element.textContent = current.toLocaleString();

    }, 20);

}

// ==========================================
// Badge Generator
// ==========================================

function badge(value, type) {

    return `<span class="badge ${type}">
            ${value}
            </span>`;

}

// ==========================================
// Populate Facility Table
// ==========================================

function loadFacilities(data = facilities) {

    const tbody = document.getElementById("facilityTable");

    tbody.innerHTML = "";

    data.forEach(facility => {

        let missedColor = "green";

        if (facility.missed >= 10)
            missedColor = "orange";

        if (facility.missed >= 20)
            missedColor = "red";


        let flagColor = "green";

        if (facility.flags >= 5)
            flagColor = "orange";

        if (facility.flags >= 10)
            flagColor = "red";


        tbody.innerHTML += `

        <tr>

            <td>${facility.name}</td>

            <td>${facility.women}</td>

            <td>${facility.anc}</td>

            <td>
                ${badge(facility.missed, missedColor)}
            </td>

            <td>
                ${badge(facility.flags, flagColor)}
            </td>

            <td>${facility.chews}</td>

        </tr>

        `;

    });

}

// ==========================================
// Search
// ==========================================

const searchInput = document.querySelector(".search input");

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const filtered = facilities.filter(facility =>

        facility.name.toLowerCase().includes(keyword)

    );

    loadFacilities(filtered);

});

// ==========================================
// Notification Button
// ==========================================

document.querySelector(".notify")
.addEventListener("click", () => {

    alert(
        "You have 4 new notifications."
    );

});

// ==========================================
// Card Hover Effect
// ==========================================

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow =
        "0 20px 40px rgba(91,44,160,.20)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow =
        "0 8px 20px rgba(0,0,0,.05)";

    });

});

// ==========================================
// Initialize Dashboard
// ==========================================

animateCounter("women", dashboardStats.women);
animateCounter("anc", dashboardStats.anc);
animateCounter("missed", dashboardStats.missed);
animateCounter("flags", dashboardStats.flags);

loadFacilities();