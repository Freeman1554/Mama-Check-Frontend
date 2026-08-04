
document.addEventListener("DOMContentLoaded", () => {
  // Authentication Token Logic
  const TOKEN = localStorage.getItem("token") || ""; 
  
  // Elements Selection
  const profileAvatar = document.getElementById("profile-avatar");
  const profileName = document.querySelector(".profile-name");
  const profilePhc = document.getElementById("profile-phc");
  const mainGreeting = document.getElementById("main-greeting");
  const dateDisplay = document.getElementById("date");
  
  const statTotalWomen = document.getElementById("stat-total-women");
  const statActivePregnancies = document.getElementById("stat-active-pregnancies");
  const statMissedVisits = document.getElementById("stat-missed-visits");
  const statHighRisk = document.getElementById("stat-high-risk");
  
  const womenListTableBody = document.getElementById("women-list");
  const alertCardsContainer = document.querySelector(".alert-cards");

  // Set Current Date & Greeting
  const initDateTime = () => {
    const now = new Date();
    
    // Formatting Date: e.g., "Friday, June 19, 2026"
    const options = { weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
 };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);

    // Dynamic Greeting based on time
    const hrs = now.getHours();
    if (hrs < 12) mainGreeting.textContent = "Good morning ☀️";
    else if (hrs < 18) mainGreeting.textContent = "Good afternoon 🌤️";
    else mainGreeting.textContent = "Good evening 🌙";
  };

  // Fetch Current Logged-in User Profile
  const fetchUserProfile = async () => {
    try {
        //const response = await fetch("https://mama-check23.onrender.com/api/v1/auth/me",
        const response = await fetch("http://localhost:3000/api/v1/auth/me", {
        headers: { 
          "Authorization": `Bearer ${TOKEN}`,
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Failed to load profile");
      const user = await response.json();
      
      // Handle nested or flat data schema variations gracefully
      const userData = user.user || user;
      const firstName = userData.firstName || "";
      const lastName = userData.lastName || "";
      const fullName = userData.name || `${firstName} ${lastName}`.trim() || "CHEW User";
      
      localStorage.setItem("chewName", fullName);

      
      profileName.textContent = fullName;

            
      // Format UI locations using LGA and State
      if (userData.lga && userData.state) {
        const formatLocation = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        profilePhc.textContent = `${formatLocation(userData.lga)}, ${formatLocation(userData.state)} State`;
      } else {
        profilePhc.textContent = userData.phc || "Assigned PHC Zone";
      }
      
      // Render 2-letter Avatar
      if (firstName || lastName) {
        profileAvatar.textContent = ((firstName[0] || "") + (lastName[0] || "")).toUpperCase();
      } else if (fullName) {
        const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase();
        profileAvatar.textContent = initials.slice(0, 2);
      }

      // Automatically chain down the specific user ID for contextual data
      const chewId = 
      userData._id || 
      userData.id ||
      userData.userId; 
      console.log(userData);

      localStorage.setItem("chewId", chewId);
      console.log("CHEW ID:", chewId);

      
      if (chewId) {
        fetchChewPregnancies(chewId);
      } else {
        console.warn("CHEW ID context missing in profile payload.");
      }

    } catch (error) {
      console.error("Error fetching profile:", error);
      profileName.textContent = "Error Loading Profile";
      profilePhc.textContent = "Authentication failed";
    }
  };

  // Fetch Summary KPIs Dashboard Module Data
  const fetchDashboardData = async () => {
    try {
      //const response = await fetch(  `http://localhost:3000/api/v1/dashboard/pregnancy/chew/${chewId}`, {
      const response = await fetch("http://localhost:3000/api/v1/dashboard/chew/overview", {
        headers: { 
          "Authorization": `Bearer ${TOKEN}`,
          "Accept": "application/json"
        }
      });
      if (!response.ok) throw new Error("Failed to load dashboard statistics");
      const data = await response.json();

      if (data.success && data.overview) {
        renderStats(data.overview.kpis || {});
        renderAlerts(data.overview.recentAlerts || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
    }
  };



  // Fetch Pregnancies assigned to the logged-in CHEW ID
  const fetchChewPregnancies = async (chewId) => {

    console.log("Fetching pregnancies for CHEW:", chewId);
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/pregnancies/chew/${chewId}`, {
      //const response = await fetch( "http://localhost:3000/api/v1/dashboard/chew/overview", {
        headers: { 
          "Authorization": `Bearer ${TOKEN}`,
          "Accept": "application/json"
        }
      });
      if (!response.ok) throw new Error("Failed to load pregnancies");
      const result = await response.json();
      //const pregnancies = await response.json();
      console.log(result)
      //console.log(result);
      console.log(result.data);
      console.log(Array.isArray(result.data));
      //console.log("Pregnancies:", pregnancies);

    console.log("Patients to render:", result.data);
      renderRecentPatients(result.data);
    } catch (error) {
      console.error("Error fetching pregnancies list:", error);
      showTableError("Failed to fetch assigned patients from registry.");
    }
  };

  // Render KPIs to UI Metric Cards
  const renderStats = (kpis) => {
    statTotalWomen.textContent = kpis.totalWomen ?? 0;
    statActivePregnancies.textContent = kpis.dueThisWeek ?? kpis.activePregnancies ?? 0; 
    statMissedVisits.textContent = kpis.overdueVisits ?? 0;
    statHighRisk.textContent = kpis.highRiskWomen ?? kpis.redFlagsToday ?? 0;
  };

  // Render Patient Registry Table
  const renderRecentPatients = (patients) => {
    console.log("Rendering patients:", patients);
    const listData = Array.isArray(patients) ? patients : (patients.recentRegistrations || []);
  
    if (listData.length === 0) {
      womenListTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 20px; color: #A1A1AA;">No recent patient registrations found.</td>
        </tr>`;
        console.log(womenListTableBody);
      return;
    }
    
    // Cap display items at 5 rows for clean view dashboard presentation
    const itemsToRender = listData.slice(0, 5);

    womenListTableBody.innerHTML = itemsToRender.map(patient => {
      const statusClass = patient.status?.toLowerCase() === 'high risk' ? 'status-red' : 'status-green';
      
      return `
        <td><strong>${patient.womanName || patient.phone || 'Unknown'}</strong></td>
<td>Wk ${patient.gestationalWeek ?? '--'}</td>
<td>${new Date(patient.registrationDate).toLocaleDateString()}</td>
<td><span class="status-pill ${statusClass}">${patient.status}</span></td>
<td><a href="ancTracker.html?id=${patient.id}" class="action-view-btn">Manage</a></td>      `;
    }).join('');
  };

  // Render Live Emergency Red Flags Panel
  const renderAlerts = (alerts) => {
    if (!alerts || alerts.length === 0) {
      alertCardsContainer.innerHTML = `
        <div style="text-align: center; padding: 25px; color: #A1A1AA; font-size: 0.9rem;">
          <p>🎉 All clean! No active emergency red flags found today.</p>
        </div>`;
      return;
    }

    alertCardsContainer.innerHTML = alerts.map(alert => {
      const isUrgent = alert.type === 'red_flag' || alert.severity === 'high';
      const badgeClass = isUrgent ? 'open-red' : 'open-yellow';
      const iconPath = isUrgent ? '/images/alert caution mark.svg' : '/images/alert exclamation mark.svg';

      return `
        <div class="alert-card">
          <div class="alert-left">
            <div class="alert-icon">
              <img src="${iconPath}" alt="alert icon">
            </div>
            <div class="alert-text">
              <h5>${alert.patientName || 'Unknown Patient'}</h5>
              <span>${alert.description || 'System Metric Issue Alert'}</span>
              <span>${alert.timestamp || 'Just now'}</span>
            </div>
          </div>
          <span class="${badgeClass}">OPEN</span>
        </div>
      `;
    }).join('');
  };

  const showTableError = (message) => {
    womenListTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 20px; color: #EF4444;">${message}</td>
      </tr>`;
  };

  // Orchestrated Unified Initialization Sequence
  const initDashboard = () => {
    initDateTime();
    
    // Execute endpoints concurrently 
    Promise.all([
      fetchUserProfile(),
      fetchDashboardData()
    ]).catch(err => console.error("Error during dashboard aggregation sequence:", err));
  };

  initDashboard();
});

document.addEventListener("DOMContentLoaded", () => {
    const enrollBtn = document.getElementById("enrollMamaBtn");

    if (enrollBtn) {
        enrollBtn.addEventListener("click", () => {
            window.location.href = "mama-check.html";
        });
    }
});