function goToEnrollPage() {
    window.location.href = "mama-check.html";
}

const dateElement = document.getElementById("date");
const totalWomenElement = document.getElementById("totalWomen");
const redFlagsElement = document.getElementById("redFlags");
const dueThisWeekElement = document.getElementById("dueThisWeek");

function formatDate() {
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  };

  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}

dateElement.textContent = formatDate();




const womenList = document.getElementById("women-list");

/* =========================
   DUMMY DATA
========================= */

async function viewWoman(pregnancyId) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/v1/pregnancies/${pregnancyId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to fetch pregnancy");
        }

        const result = await response.json();

        const pregnancy = result.data;
        const woman = pregnancy.woman;

        console.log(result);

        alert(`
Name: ${woman.firstName} ${woman.lastName}
Phone: ${woman.phone}
Language: ${woman.preferredLanguage}
Week: ${pregnancy.gestationalWeek}
Status: ${pregnancy.status}
        `);

    } catch (err) {

        console.error(err);

    }

}

let womenData = [];

async function loadPregnancies() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/pregnancies", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` // if your API requires authentication
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load pregnancies");
    }

    womenData = await response.json();

    renderWomenList();

  } catch (error) {
    console.error(error);
  }
}

// const womenData = [
//   {
//     id: 1,
//     name: "Success Olamide",
//     location: "Lagos",
//     phone: "+234 803 211 0045",
//     week: 28,
//     language: "Igbo",
//     progress: 85,
//     date: "18 May 2026"
//   },
//   {
//     id: 2,
//     name: "Salam Yusuf",
//     location: "Ikeja",
//     phone: "+234 805 111 2222",
//     week: 24,
//     language: "Hausa",
//     progress: 20,
//     date: "20 May 2026"
//   },
//   {
//     id: 3,
//     name: "Ngozi Kalu",
//     location: "Surulere",
//     phone: "+234 802 999 1111",
//     week: 18,
//     language: "Igbo",
//     progress: 10,
//     date: "20 May 2026"
//   },
//   {
//     id: 4,
//     name: "Chioma Eze",
//     location: "Ikeja",
//     phone: "+234 805 332 7781",
//     week: 24,
//     language: "Hausa",
//     progress: 70,
//     date: "20 May 2026"
//   },
//   {
//     id: 5,
//     name: "Thanks promise",
//     location: "Ikeja",
//     phone: "+234 805 111 2222",
//     week: 24,
//     language: "Hausa",
//     progress: 85,
//     date: "20 May 2026"
//   },
//   {
//     id: 6,
//     name: "Anuoluwa Maryam",
//     location: "Ota",
//     phone: "+234 805 111 2222",
//     week: 24,
//     language: "pigin",
//     progress: 20,
//     date: "20 May 2026"
//   }
// ];

/* =========================
   STATUS SYSTEM (ONE SOURCE OF TRUTH)
========================= */
function getStatus(progress) {
  if (progress >= 80) {
    return {
      label: "Safe",
      color: "#16A34A",
      bg: "#DCFCE7"
    };
  }

  if (progress >= 40) {
    return {
      label: "Not Severe",
      color: "#2563EB",
      bg: "#DBEAFE"
    };
  }

  if (progress >= 20) {
    return {
      label: "Severe",
      color: "#FBBF24",
      bg: "#FEF9C3"
    };
  }

  return {
    label: "Red Alert",
    color: "#DC2626",
    bg: "#FEE2E2"
  };
}

/* =========================
   VIEW DETAILS
========================= */


/* =========================
   RENDER FUNCTION
========================= */
function renderWomenList() {
  womenList.innerHTML = "";

  womenData.forEach((woman) => {
    const status = getStatus(woman.progress);

    const card = document.createElement("div");
    card.className = "profile-details";

    card.innerHTML = `
      <div class="card-name">
        <h2>${woman.name}</h2>
        <h4>${woman.location}</h4>
      </div>

      <div class="card-number">
        ${woman.phone}
      </div>

      <div class="card-week">
        Wk ${woman.week}
      </div>

      <div class="card-lang">
        ${woman.language}
      </div>

      <div class="anc-metrics">
        <div class="metrics"
          style="width:${woman.progress}%; background:${status.color};">
        </div>
      </div>

      <div class="card-date">
        ${woman.date}
      </div>

      <div class="btn-visit">
        <div class="card-nextvisit"
          style="background:${status.bg}; color:${status.color};">
          ${status.label}
        </div>

        <div class="card-view-btn" onclick="viewWoman(${woman.id})">
          View
        </div>
      </div>
    `;

    womenList.appendChild(card);
  });
}

/* =========================
   INIT
========================= */
renderWomenList();