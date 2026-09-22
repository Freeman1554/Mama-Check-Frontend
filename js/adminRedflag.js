// RED FLAG STATS
const adminRflagStats = {
    womenredflag: 1422,
    ancredflag: 1025,
    missedredflag: 67,
    openredflag: 30
}

function animateCount(id, target) {
   const elementid = document.getElementById(id);
   let current = 0;
   const increment = Math.ceil(target / 60);
   const timer = setInterval(() => {
        current += increment
     if(current >= target) {
        current = target
        clearInterval(timer)
     }
     elementid.textContent = current.toLocaleString();
   }, 20)
}
animateCount("womenredflag", adminRflagStats.womenredflag);
animateCount("ancredflag", adminRflagStats.ancredflag);
animateCount("missedredflag", adminRflagStats.missedredflag);
animateCount("openredflag", adminRflagStats.openredflag);

// OPEN REDFLAG DATA
const openRflagData = [
    {
    img: "images/redcaution.png",
    name: "Halima A",
    symptom: "Severe headache + blurred vision",
    phc:  "PHC Nassarawa",
    chew: "CHEW Fatima Ibrahim",
    time: "raised 2 hours ago"
    },
    {
    img: "images/redcaution.png",
    name: "Zainab M",
    symptom: "Heavy bleeding",
    phc:  "PHC Kano Central",
    chew: "CHEW Aisha Mohammed",
    time: "raised 5 hours ago"
    },
    {
    img: "images/overduecaution.png",
    name: "Ramatu B",
    overdue: "Overdue needs intervention",
    symptom: "Reduced fetal movement",
    phc:  "PHC Tarauni",
    chew: "CHEW Maryam Sani",
    time: "raised 1 day 4 hours ago"
    },
    {
    img: "images/overduecaution.png",
    name: "Amina S",
     overdue: "Overdue needs intervention",
    symptom: "High fever >38.5℃",
    phc:  "PHC Nassarawa",
    chew: "CHEW Fatima Ibrahim",
    time: "raised 1 day 8 hours  ago"
    },
    {
    img: "images/redcaution.png",
    name: "Khadija O",
    symptom: "Swollen hands and face",
    phc:  "PHC Dala",
    chew: "CHEW Hausa Yusuf",
    time: "raised 3 hours ago"
    }
]

 function populateRflagData() {
        const openRedflagData = document.querySelector(".openRflag-data");
         openRedflagData.innerHTML = "";
       openRflagData.forEach(openRf => {
        let bgRed = openRf.overdue ? "#fff3f3" : "white";
        let btnColor = openRf.overdue ? "white" : "#239D6A";
        let btnBgColor = openRf.overdue ? "#239D6A" : "#E9F5F0";
        const redflagContainer = document.createElement("div");
        redflagContainer.innerHTML = `
                                      <div class="rflagdata" style="background-color: ${bgRed}"> 
                                      <div class="rflagleft">
                                      <!--img first-->
                                      <img src="${openRf.img}" alt="caution-icon" class="rflag-image" />    
                                      <!--second -->
                                      <div class="rflag-text">
                                       <div class="rflag-head"> <h3>${openRf.name}</h3>
                                        ${openRf.overdue ? `<span class="rflagP">${openRf.overdue}</span>` : ""}
                                         </div>
                                       <small>${openRf.symptom}</small>
                                       <div class="rflag-details">
                                       <small>${openRf.phc}</small> 
                                       <span>•</span> 
                                       <small>${openRf.chew}</small> 
                                       <span>•</span> 
                                       <small>${openRf.time}</small>
                                       </div>
                                      </div>
                                      </div>
                                                                             
                                      <div class="rflagBtns">
                                      <button class="rflagPlain">Contact Chew</button>
                                      <button class="rflagGreen" style="background-color: ${btnBgColor}; color: ${btnColor}">Intervene</button></div>
                                      </div>                   
                                     `        

             openRedflagData.appendChild(redflagContainer)                                     
       });
    }

    populateRflagData();

