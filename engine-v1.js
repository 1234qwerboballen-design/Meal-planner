var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; 
var stylesList = ["Chinese / Asian", "Mexican / TexMex", "Italian / Med", "American Comfort", "Diner Breakfast"]; 
var proteinsList = ["Chicken", "Beef", "Turkey", "Seafood", "Pork"]; 
var proteinCals = { "Chicken": 640, "Beef": 710, "Turkey": 610, "Seafood": 380, "Pork": 640 }; 

// Calculate current calendar week dates automatically based on current time (e.g., Week of July 27, 2026)
var currentClockDate = new Date();
var currentDayIndex = currentClockDate.getDay(); 
var distanceToMonday = currentDayIndex === 0 ? -6 : 1 - currentDayIndex; 
var mondayDate = new Date(currentClockDate.getTime() + distanceToMonday * 24 * 60 * 60 * 1000);
var weekLabelString = mondayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

var weekHTML = '<div style="background:#f1f5f9; border:1px solid #cbd5e1; padding:8px; border-radius:8px; margin-bottom:10px; display:block; clear:both; width:100%; box-sizing:border-box;">' +
    '<h3 style="margin:0 0 6px 0; color:#1e3a8a; font-size:11px; text-transform:uppercase; font-weight:bold; text-align:center;">🗓️ Schedule for the Week of ' + weekLabelString + '</h3>' +
    '<button onclick="exportFullWeekToGoogleCalendar()" style="width:100%; padding:5px; background:#1e3a8a; color:white; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer; text-transform:uppercase; box-shadow:0 1px 3px rgba(0,0,0,0.15);">📅 Export Week to Google Calendar</button>' +
'</div>';

for (var d = 0; d < 7; d++) { 
    var rOpt = '<option value="">- Cuisine -</option>'; for (var s = 0; s < 5; s++) rOpt += '<option value="'+stylesList[s]+'">'+stylesList[s]+'</option>'; 
    var pOpt = '<option value="">- Protein -</option>'; for (var p = 0; p < 5; p++) pOpt += '<option value="'+proteinsList[p]+'">'+proteinsList[p]+'</option>'; 
    
    // Calculate calendar dates for each specific single day row box dynamically
    var loopDayDate = new Date(mondayDate.getTime() + d * 24 * 60 * 60 * 1000);
    var dateStampLabel = loopDayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Ultra-compact single-row input container fields layout design
    weekHTML += '<div class="day-box" style="background:#f8fafc; padding:6px 10px; border:1px solid #e2e8f0; border-radius:6px; display:block; margin-bottom:6px; clear:both; width:100%; box-sizing:border-box;">' +
        '<div style="display:flex; justify-content:between; align-items:center; margin-bottom:4px; border-bottom:1px solid #f1f5f9; padding-bottom:2px;">' +
            '<div style="font-weight:bold; font-size:10px; color:#1e3a8a; flex:1;">' + weekDays[d] + ' <span style="color:#64748b; font-weight:normal;">(' + dateStampLabel + ')</span></div>' +
            '<span id="day-badge-' + d + '" style="font-size:9px; font-weight:bold; color:#059669; background:#e6f4ea; padding:1px 4px; border-radius:4px; border:1px solid #a7f3d0;">0 cal</span>' +
        '</div>' +
        '<div style="display:flex; gap:4px; align-items:center; width:100%;">' +
            '<select id="style-m1-' + d + '" onchange="updateMealOptions(' + d + ')" style="padding:4px; font-size:9px; font-weight:bold; flex:1;">' + rOpt + '</select>' +
            '<select id="prot-m1-' + d + '" onchange="updateMealOptions(' + d + ')" style="padding:4px; font-size:9px; font-weight:bold; flex:1;">' + pOpt + '</select>' +
            '<select id="meal-m1-' + d + '" onchange="syncAppEngine()" style="padding:4px; font-size:9px; font-weight:bold; flex:2;"><option value="">- Select Meal -</option></select>' +
        '</div>' +
    '</div>'; 
} 

document.getElementById("weekContainer").innerHTML = weekHTML; 

if(!document.getElementById("weeklyTotalVal")) { 
    var dashHTML = '<div style="background:linear-gradient(to right, #111827, #1f2937); color:#10b981; padding:8px; border-radius:8px; margin-bottom:10px; display:flex; justify-content:space-around; text-align:center; border-left:4px solid #10b981; font-weight:bold;"><div class="tracker-metric" style="font-size:9px;">WEEKLY TOTAL TRACK<div id="weeklyTotalVal" style="font-size:11px; color:#fff; margin-top:1px;">0 CAL</div></div><div style="width:1px; background:#374151; height:22px;"></div><div class="tracker-metric" style="font-size:9px;">DAILY AVERAGE TARGET<div id="dailyAvgVal" style="font-size:11px; color:#fff; margin-top:1px;">0 CAL</div></div></div>'; 
    document.querySelector(".card").insertAdjacentHTML("beforebegin", dashHTML); 
} 

window.updateMealOptions = function(dayIndex) { 
    var sBox = document.getElementById("style-m1-" + dayIndex); 
    var pBox = document.getElementById("prot-m1-" + dayIndex); 
    if (!sBox || !pBox) return; 
    var sVal = sBox.value; var pVal = pBox.value; 
    var mSelect = document.getElementById("meal-m1-" + dayIndex); 
    if (!mSelect) return; mSelect.innerHTML = '<option value="">- Select Meal -</option>'; 
    if (!sVal || !pVal) { syncAppEngine(); return; } 
    var baseCal = proteinCals[pVal] || 600; var cleanStyle = sVal.split(" / "); var optionsHTML = '<option value="">- Select Meal -</option>'; 
    var pMethods = window.prepMethods || ["Standard"]; var sStyles = window.servingStyles || ["Plate"]; 
    for (var i = 0; i < 35; i++) { 
        var calOffset = (i % 2 === 0) ? (i * 2) : -(i * 1.5); 
        var computedCal = Math.round(baseCal + calOffset); 
        var dishName = pMethods[i % pMethods.length] + " " + cleanStyle + " " + pVal + " " + sStyles[(i + dayIndex) % sStyles.length] + " (" + computedCal + " cal)"; 
        optionsHTML += '<option value="' + sVal + '|' + pVal + '|' + dishName + '|' + computedCal + '">' + dishName + '</option>'; 
    } 
    mSelect.innerHTML = optionsHTML; mSelect.selectedIndex = 1; syncAppEngine(); 
}; 

window.exportFullWeekToGoogleCalendar = function() {
    alert("🚀 Google Calendar Link Synced!\n\nThis will now generate your custom daily schedule events. Click OK to open your Google Calendar dashboard overlay link with your logged food plans pre-written!");
    
    // Loop through selections and package them cleanly into custom standard calendar hyperlink URLs
    for (var d = 0; d < 7; d++) {
        var mealBox = document.getElementById("meal-m1-" + d);
        var mealText = mealBox && mealBox.value ? mealBox.value.split("|")[2] : "No food meal logged.";
        var inputLiq = document.getElementById("liquid-total-badge-" + d);
        var liqText = inputLiq ? inputLiq.innerText : "0 cal liquids";
        
        var targetDayDate = new Date(mondayDate.getTime() + d * 24 * 60 * 60 * 1000);
        var isoDateString = targetDayDate.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0,8);
        
        var calendarTitle = encodeURIComponent("🥗 Diet Plan: " + weekDays[d]);
        var calendarDetails = encodeURIComponent("🍽️ Solid Food: " + mealText + "\n🥤 Liquid Tracking: " + liqText);
        var calendarDates = isoDateString + "T120000Z/" + isoDateString + "T130000Z"; // Default logs straight to your lunch hour!
        
        var googleCalendarLink = "https://google.com" + calendarTitle + "&dates=" + calendarDates + "&details=" + calendarDetails + "&sf=true&output=xml";
        
        // Open the calendar event tab natively under your cursor
        window.open(googleCalendarLink, '_blank');
        break; // Opens the first active day link immediately to prevent browser popup block warnings!
    }
};

window.syncAppEngine = function() { 
    var rHTML = "", activeMap = {}, masterGroceries = {}, grandCals = 0; 
    for (var d = 0; d < 7; d++) { 
        var m1Box = document.getElementById("meal-m1-" + d); var m1Val = m1Box ? m1Box.value : ""; 
        var activeToday = [m1Val]; var dayCals = 0; 
        var inputLiq = document.getElementById("liquid-total-badge-" + d); var liqVal = 0; 
        if (inputLiq) { var rawText = inputLiq.innerText || ""; liqVal = parseInt(rawText.replace(/[^0-9]/g, "")) || 0; } 
        dayCals += liqVal; var pGroceries = window.proteinGroceries || {}; var sGroceries = window.styleGroceries || {}; 
        for (var m = 0; m < activeToday.length; m++) { var raw = activeToday[m]; if (!raw) continue; var frags = raw.split("|"); if (frags.length < 4) continue; var style = frags, protein = frags, fullDishName = frags, mealCalories = parseInt(frags) || 0; dayCals += mealCalories; var pData = pGroceries[protein], sData = sGroceries[style]; if (!pData || !sData) continue; if (!activeMap[fullDishName]) { activeMap[fullDishName] = true; rHTML += '<div class="recipe-item" style="padding:8px; background:#f1f5f9; border-radius:6px; margin-bottom:8px; border-left:4px solid #1e3a8a;"><div class="recipe-title" style="font-weight:bold; color:#1e3a8a; text-transform:uppercase;">' + fullDishName + '</div><div class="recipe-steps" style="background:#fff; padding:5px; border-radius:4px; border:1px solid #cbd5e1; margin-top:2px; line-height:1.4;"><strong>Ingredients:</strong> ' + pData.item + ', ' + sData.side + ', ' + sData.prod + ', ' + sData.sauce + '.<br><br><strong>Directions:</strong> ' + sData.steps + '</div></div>'; } var listItems = [{ name: pData.item, aisle: pData.dept }, { name: sData.side, aisle: "🌾 Grains & Pantry Supply" }, { name: sData.prod, aisle: "🥦 Fresh Produce Aisle" }, { name: sData.sauce, aisle: "🥫 Sauces & Seasonings" }]; for (var g = 0; g < listItems.length; g++) { var line = listItems[g]; if (!masterGroceries[line.aisle]) masterGroceries[line.aisle] = {}; masterGroceries[line.aisle][line.name] = (masterGroceries[line.aisle][line.name] || 0) + 1; } } } grandCals += dayCals; var badge = document.getElementById("day-badge-" + d); if(badge) badge.innerHTML = dayCals + " cal"; } 
    var totVal = document.getElementById("weeklyTotalVal"); if(totVal) totVal.innerHTML = grandCals + " CAL"; 
