document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initialize Profile context configurations
    await personalizeCHEWProfile();
    initializeDate();
    initializeSidebarNavigation();
    
    // 2. Fetch live metrics mapping your actual API layout response
    fetchFullDashboardData();

    // 3. Attach standard interactive UI triggers
    initializeSearch();
    initializeEnrollButton();
    initializeViewButtons();
    initializeAlertCards();
});

/**
 * Personalizes the dashboard greetings and profile fields using registration credentials
 */
async function personalizeCHEWProfile() {
    let firstName = localStorage.getItem("firstName");
    let lastName = localStorage.getItem("lastName");
    let phcName = localStorage.getItem("phcName");
    const token = localStorage.getItem("accessToken");

    // Pull directly from /api/v1/auth/me if local cache storage is currently clean
    if ((!firstName || !lastName || !phcName || phcName === "null") && token) {
        try {
            const response = await fetch("https://mama-check.onrender.com/api/v1/auth/me", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const user = data.user || data;
                firstName = user.firstName;
                lastName = user.lastName;
                phcName = user.phcName || user.facilityName;

                localStorage.setItem("firstName", firstName || "");
                localStorage.setItem("lastName", lastName || "");
                localStorage.setItem("phcName", phcName || "");
            }
        } catch (err) {
            console.error("Error retrieving user context profiles:", err);
        }
    }

    const finalFirst = firstName && firstName !== "null" ? firstName : "CHEW";
    const finalLast = lastName && lastName !== "null" ? lastName : "Provider";
    const finalPhc = phcName && phcName !== "null" ? phcName : "Maternal Care Clinic";

    // Update Top-Bar Dynamic Greeting
    const greetingElement = document.getElementById("main-greeting") || document.querySelector(".top-bar p");
    if (greetingElement) {
        const hour = new Date().getHours();
        let greetingTime = "Good evening";
        if (hour < 12) greetingTime = "Good morning";
        else if (hour < 18) greetingTime = "Good afternoon";

        greetingElement.textContent = `${greetingTime}, Nurse ${finalFirst}`;
    }

    // Update Sidebar Navigation Profiles
    const nameEl = document.getElementById("profile-name") || document.querySelector(".user-profile .info h5");
    const phcEl = document.getElementById("profile-phc") || document.querySelector(".user-profile .info p");
    const avatarEl = document.getElementById("profile-avatar") || document.querySelector(".user-profile .profile h3");

    if (nameEl) nameEl.textContent = `Nurse ${finalFirst} ${finalLast}`;
    if (phcEl) phcEl.textContent = finalPhc;
    if (avatarEl) {
        avatarEl.textContent = `${finalFirst.charAt(0)}${finalLast.charAt(0)}`.toUpperCase();
    }
}

/**
 * Loads values directly from your /api/v1/dashboard/full-dashboard response payload
 */
async function fetchFullDashboardData() {
    const registeredWomenEl = document.getElementById("stat-total-women");
    const dueThisWeekEl = document.getElementById("stat-active-pregnancies");
    const missedVisitsEl = document.getElementById("stat-missed-visits");
    const redFlagsEl = document.getElementById("stat-high-risk");

    try {
        const token = localStorage.getItem("accessToken");
        
        //const response = await fetch("https://mama-check.onrender.com/api/v1/dashboard/full-dashboard?role=chew",
        const response = await fetch("http://localhost:3000/api/v1/dashboard/full-dashboard?role=chew", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP network error! Status: ${response.status}`);

        const result = await response.json();
        
        if (result.success && result.dashboard) {
            const kpis = result.dashboard.kpis;
            
            // Map JSON property metrics directly into your target layout boxes
            if (registeredWomenEl) registeredWomenEl.textContent = kpis.totalWomen ?? 0;
            if (dueThisWeekEl) dueThisWeekEl.textContent = kpis.activePregnancies ?? 0;
            if (redFlagsEl) redFlagsEl.textContent = kpis.highRiskWomen ?? 0;
            
            // Parse missed visits count directly out of the context collection array safely
            if (missedVisitsEl) {
                const missedArray = result.dashboard.missedVisitsByTriage || [];
                const totalMissed = missedArray.reduce((acc, current) => acc + (current.missedVisits || 0), 0);
                missedVisitsEl.textContent = totalMissed;
            }
        }

    } catch (error) {
        console.error("Failed to map API dashboard analytics:", error);
        [registeredWomenEl, dueThisWeekEl, missedVisitsEl, redFlagsEl].forEach(el => {
            if (el) el.textContent = "0";
        });
    }
}

async function fetchMissedVisitStats() {
    const missedVisitsEl = document.getElementById("stat-missed-visits");

    try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
            "http://localhost:3000/api/v1/dashboard/missed-visit/stats",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const result = await response.json();

        console.log(result);

        if (result.success) {
            // Change this depending on your backend response
            missedVisitsEl.textContent =
                result.data.totalMissedVisits ?? 0;
        } else {
            missedVisitsEl.textContent = "0";
        }

    } catch (error) {
        console.error("Failed to load missed visit statistics:", error);
        missedVisitsEl.textContent = "0";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await personalizeCHEWProfile();

    initializeDate();
    initializeSidebarNavigation();

    await fetchFullDashboardData();
    await fetchMissedVisitStats();

    initializeSearch();
    initializeEnrollButton();
    initializeViewButtons();
    initializeAlertCards();
});


if (missedVisitsEl) {
    const missedArray = result.dashboard.missedVisitsByTriage || [];
    const totalMissed = missedArray.reduce(
        (acc, current) => acc + (current.missedVisits || 0),
        0
    );
    missedVisitsEl.textContent = totalMissed;
}

/**
 * Standard utility updates for live clock display tracking
 */
function initializeDate() {
    const dateElement = document.getElementById("date");
    if (!dateElement) return;

    const options = { weekday: "short", day: "2-digit", month: "short", year: "numeric" };
    dateElement.textContent = new Date().toLocaleDateString("en-US", options);
}

/**
 * Local Table Record Target Queries
 */
function initializeSearch() {
    const searchInput = document.querySelector(".input-container input");
    const tableRows = document.querySelectorAll("tbody tr");

    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        tableRows.forEach(row => {
            const patientName = row.querySelector("h5")?.textContent.toLowerCase() || "";
            const location = row.querySelector("td span")?.textContent.toLowerCase() || "";

            const isMatch = patientName.includes(searchTerm) || location.includes(searchTerm);
            row.style.display = isMatch ? "" : "none";
        });
    });
}

function initializeSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll("aside nav a");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", () => {
            sidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

function initializeEnrollButton() {
    const enrollBtn = document.querySelector(".enroll-btn");
    if (enrollBtn) {
        enrollBtn.addEventListener("click", () => {
            window.location.href = "/registeration1.html";
        });
    }
}

function initializeViewButtons() {
    const viewButtons = document.querySelectorAll(".view-btn");
    viewButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            const name = row?.querySelector("td h5")?.innerText;
            if (name) alert(`Opening profile for ${name}`);
        });
    });
}

function initializeAlertCards() {
    const alertCards = document.querySelectorAll(".alert-card");
    alertCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("expanded");
        });
    });
}