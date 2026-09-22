// dshb2 stats
const adminDshb2Stats = {
    women: 1422,
    anc: 1025,
    missed: 67,
    flags: 30,
}

function updateAdminDshb2Stats() {
    Object.keys(adminDshb2Stats).forEach(stat => {
       document.getElementById(stat).textContent = adminDshb2Stats[stat];
    });
}
updateAdminDshb2Stats()

// phc stats
const phcStats = {
    phcwomen: 198,
    phcanc: 142,
    phcmissed: 18,
    phcflags: 8
}

function animateCounter(id, target) {
  const element = document.getElementById(id);
  let current = 0;
  const increment = Math.ceil(target / 60)
  const timer = setInterval (() => {
            current += increment
            if( current >= target) {
                current = target
                 clearInterval(timer) 
            }
          element.textContent = current.toLocaleString();
  }, 20)
}
animateCounter("phcwomen", phcStats.phcwomen);
animateCounter("phcanc", phcStats.phcanc);
animateCounter("phcmissed", phcStats.phcmissed);
animateCounter("phcflags", phcStats.phcflags);

// chew Data
const chewData = [
    {
        initial: "AM",
        name: "Aisha Mohammed",
        women: 62,
        visits: 68,
        missed: 3,
        flags: 2,
        status: "Active"
    },
    {
        initial: "CS",
        name: "Charles Stella",
        women: 62,
        visits: 41,
        missed: 5,
        flags: 4,
        status: "Active"
    },
    {
        initial: "YC",
        name: "Yusuf Christiana",
        women: 62,
        visits: 39,
        missed: 1,
        flags: 0,
        status: "Active"
    },
    {
        initial: "MS",
        name: "Maryam Sani",
        women: 62,
        visits: 38,
        missed: 3,
        flags: 2,
        status: "Active"
    },
    {
        initial: "FI",
        name: "Fatima Ibrahim",
        women: 62,
        visits: 40,
        missed: 6,
        flags: 2,
        status: "On leave"
    }
];

function loadChews() {
    const tbody = document.getElementById("chewTable");
    tbody.innerHTML = "";

    chewData.forEach(chew => {
        // flag badge color
        let flagBg = chew.flags === 0 ? "#333" : "#FDECEA";
        let flagColor = chew.flags === 0 ? "white" : "#E53935";

        // status badge color
        let statusBg = chew.status === "Active" ? "#E8F5E9" : "white";
        let statusColor = chew.status === "Active" ? "#2E7D32" : "#E53935";
        let statusBorder = chew.status === "Active" ? "none" : "1px solid #E53935";

        tbody.innerHTML += `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="chew-avatar">${chew.initial}</div>
                        <span>${chew.name}</span>
                    </div>
                </td>
                <td>${chew.women}</td>
                <td style="color:#2E7D32; font-weight:600;">${chew.visits}</td>
                <td>${chew.missed}</td>
                <td>
                    <span style="background-color:${flagBg}; color:${flagColor}; padding:4px 10px; border-radius:20px; font-weight:600;">
                        ${chew.flags}
                    </span>
                </td>
                <td>
                    <span style="background-color:${statusBg}; color:${statusColor}; border:${statusBorder}; padding:4px 12px; border-radius:20px;">
                        ${chew.status}
                    </span>
                </td>
                <td style="color:#999;">›</td>
            </tr>
        `;
    });
}

loadChews();