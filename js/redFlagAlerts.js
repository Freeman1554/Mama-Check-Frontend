
const dateElement = document.getElementById("date");

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

// RED FLAG ALERTS ROWS
 const rFlagAlerts = [
  {
    image: "/images/alert caution mark.svg",
    name: "Adaeze Okonkwo",
    week: "Wk 28",
    number: "+234 803 211 0045",
    phc: "PHC",
    reported: "Reported today 08:42",
    symptom1: "Heavy Bleeding",
    symptom2: "Severe abdominal pain",
    alert: "CHEW alerted: 08:42",
    contact: "Trusted contact alerted: 08:42",
    sms: "CHEW SMS delivered",
    day: "yesterday",
    time: "08:42"
  },
  {
    image: "/images/alert caution mark.svg",
    name: "Blessing Nwosu",
    week: "Wk 32",
    number: "+234 808 445 2201",
    phc: "PHC Akwa",
    reported: "Reported today 14:05",
    symptom1: "Severe headache",
    symptom2: "Blurry vision",
    alert: "CHEW alerted: 14:05",
    contact: "Trusted contact alerted: 14:05",
    sms: "CHEW SMS delivered",
    day: "yesterday",
    time: "14:05"
  },
  {
    image: "/images/alert caution mark.svg",
    name: "Ngozi Obi",
    week: "Wk 36",
    number: "+234 806 338 7712",
    phc: "Akwa PHC",
    reported: "Reported today 07:18",
    symptom1: "Conclusion",
    alert: "CHEW alerted: 07:18",
    contact: "Trusted contact alerted: 07:18",
    sms: "CHEW SMS delivered",
    day: "yesterday",
    time: "07:18"
  }
] 

function populateRflagAlerts() {
   const rflagCards = document.querySelector(".redflag-cards")
   rflagCards.innerHTML = "";
   rFlagAlerts.forEach(rflagcard => {
      const rflag = document.createElement("div");
      rflag.innerHTML = `
                         <!-- redflag card -->
                <div class="redflag-card">
                    <!-- redflag left -->
                    <div class="redflag-left">
                        <div class="redflag-icon">
                            <img src="${rflagcard.image}" alt="caution icon">
                        </div>
                        <div class="redflag-text">
                            <h5>${rflagcard.name}</h5>
                           <div class="redflag-info">
                                       <small>${rflagcard.week}</small> 
                                       <span>•</span> 
                                       <small>${rflagcard.number}</small> 
                                       <span>•</span> 
                                       <small>${rflagcard.phc}</small>
                                       </div>
                            <div class="redflag-pills">
                             <span class="redflag-pill">${rflagcard.symptom1}</span> 
                             ${rflagcard.symptom2 ? `<span class="redflag-pill">${rflagcard.symptom2}</span>` : ""}
                            </div>
                            <div class="redflag-info">
                                       <small>${rflagcard.alert}</small> 
                                       <span>•</span> 
                                       <small>${rflagcard.contact}</small> 
                                       <span>•</span> 
                                       <small>${rflagcard.sms}✓</small>
                                       </div>
                        </div>
                    </div>
                    <!-- redflag right -->
                     <div class="redflag-right">
                        <a href="#">Open</a>
                        <span>${rflagcard.day}</span>
                        <span>${rflagcard.time}</span>
                        <button class="close-red">Close case</button>
                     </div>
                </div>
                        `
                        rflagCards.appendChild(rflag);
   })
}
populateRflagAlerts()