// Admin Report 

// admin report stats
const adminReportStats = {
    womenreport: 1422,
    ancreport: 1025,
    missedreport: 67,
    flagsreport: 30
}

// a function with object.keys(objectVar) to get the keys of the object and loop through them using forEach(), getting the ids and changing the text  to populate the stats in the html number elements with the corresponding ids
function populateAdminReportStats() {
    Object.keys(adminReportStats).forEach(key => {
        document.getElementById(key).textContent = adminReportStats[key]
    })
}
populateAdminReportStats();

// SPHCDA  stats
const sphcdaReportStats = {
    sphwomen: 58,
    sphanc: 287,
    sphmissed: 54,
    sphflags: 11
}

// animate function to animate the numbers in the html number elements with the corresponding ids, using setInterval() to increment the numbers until they reach the target value
function animateCounter(id, target) {
    // step 1 Grabs the HTML element whose id was passed in. So when you call animateCounter("sphwomen", 58), element is the h1 with id sphwomen.
    const elementId = document.getElementById(id);
    // step 2 This is the number that will visually count up on screen. It starts at 0 and increases until it hits the target. It's let because it gets reassigned every step.
    let current = 0;
    // This figures out how much to jump per step. Dividing by 60 because the animation runs in roughly 60 steps. So for a target of 58, increment is Math.ceil(58/60) = Math.ceil(0.96) = 1. For 287 it's Math.ceil(287/60) = Math.ceil(4.78) = 5. Math.ceil ensures you never get a decimal step size.
    const increment = Math.ceil(target / 60);
    // setinterval() runs the callback function repeatedly every 20 milliseconds until told to stop. Think of it as a heartbeat — every 20ms it wakes up and runs your code. timer stores a reference to it so you can stop it later.
    const timer = setInterval(() => {
        //Every heartbeat, add the increment to current. So current grows: 0 → 5 → 10 → 15 and so on until it reaches the target. 
        current += increment 
      //Checks if current has reached or overshot the target. It checks >= not === because increment jumps might skip over the exact target number.    
        if(current >= target) {
            // Snaps current to the exact target so it doesn't display a number slightly above it.
            current = target;
            // Stops the heartbeat. Without this the counter would keep going past the target forever.
            clearInterval(timer)
        }
        // Every heartbeat updates what's displayed on screen with the current value. toLocaleString() adds commas for thousands — so 1422 displays as 1,422.
         elementId.textContent = current.toLocaleString();
    }, 20);
}
animateCounter("sphwomen", sphcdaReportStats.sphwomen);
animateCounter("sphanc", sphcdaReportStats.sphanc);
animateCounter("sphmissed", sphcdaReportStats.sphmissed);
animateCounter("sphflags", sphcdaReportStats.sphflags);

// pdf button 
// opens the browser's print dialog — the user can then save as PDF from there. No extra library needed:
document.getElementById("exportPdf").addEventListener("click", () => {
    window.print();
});

// bar stats 
const barStats = [
    {
        phc: "PHC Kano Central",
        visits: 289,
        total: 312,
        percentage: 90
    },
    {
        phc: "PHC Kano Central",
        visits: 251,
        total: 273,
        percentage: 92
    },
    {
        phc: "PHC Kano Central",
        visits: 270,
        total: 303,
        percentage: 89
    },
    {
        phc: "PHC Kano Central",
        visits: 142,
        total: 150,
        percentage: 83
    },
    {
        phc: "PHC Kano Central",
        visits: 124,
        total: 128,
        percentage: 97
    }
]
// writing the full loadBarStats function to populate the bar stats in the html, and also to get the average of the percentage and set it to the avgCompletion element
function loadBarStats() {
    // loop through barStats array of objects with forEach
   document.getElementById("bar-stats").innerHTML = "";
   barStats.forEach((stats) => {
    // inside the loop, decide the bar color. If facility.percentage >= 90 color is green, otherwise orange.
    let color = "#f59e0b";
    if(stats.percentage >= 90) {
        color = "#22c55e";
    } else if(stats.percentage < 89) {
        color = "#f59e0b";
    }
    // create a new div element for each bar stat, and set its innerHTML to the bar stat html, and append it to the bar-stats element
    const statsContaineer = document.createElement("div")
    //Step 4 — create a div, give it innerHTML with:
// A p tag for the facility name
// A track div containing a fill div — the fill div gets style = width: ${facility.percentage}%  and a class for the color or set a variable to store the color
// A span   showing the numbers like  248 /312 and another showing  96%   
    statsContaineer.innerHTML = `
                                 <div style="display: flex; justify-content:space-between; align-items: center; margin-bottom: 10px;">
                                 <p>${stats.phc}</p> <div><small>${stats.visits}</small> <small>/</small> <small>${stats.total}</small> <small style="color: ${color}; font-weight: bold;">${stats.percentage}%</small></div>
                                 </div>
                                    <div style="width: 100%; height: 10px; background-color: #e0e0e0; border-radius: 5px;">
                                        <div style="width: ${stats.percentage}%; height: 100%; background-color: ${color}; border-radius: 5px;"></div>
                                    </div>
                                 </div>
                                `
        // Step 5 — append each div to the container
        document.getElementById("bar-stats").appendChild(statsContaineer);
   })  
// to get the total of the percentage using reduce, check the array to get the sum, the zero start value, then dividing by the length of the array to get the average, and then setting the text content of the avgCompletion element to the average percentage with one decimal place
  const average = barStats.reduce((total, stat) => total + stat.percentage, 0) / barStats.length;
  document.getElementById("avgCompletion").textContent = average.toFixed(1) + "%";
}
loadBarStats();