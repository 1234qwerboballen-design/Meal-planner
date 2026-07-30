window.addEventListener("load", function() {
    // Automatically locate the live update tracking element on your home page tab panel
    var buildLabel = document.getElementById("liveBuildTime");
    if (buildLabel) {
        var dateObj = new Date();
        var dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        var timeLabel = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        buildLabel.innerText = dayLabel + " at " + timeLabel;
    }

    var container = document.getElementById("bmiCalculatorContainerPlaceholder");
    if (container) {
        container.innerHTML = "";
        var calcHTML = '<div style="background:#f8fafc; padding:4px; clear:both; box-sizing:border-box; text-align:left;"><h2 style="color:#1e3a8a; border-bottom:2px solid #2563eb; margin:0 0 8px 0; padding-bottom:4px; font-weight:bold; font-size:10px; text-transform:uppercase;">🧮 Personalized Fitness Goal Calculator</h2><div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;"><div style="flex:1; min-width:60px;"><label style="font-weight:bold; font-size:10px; color:#000; display:block;">Weight (lbs):</label><input type="number" id="fit-weight" value="180" style="width:100%; padding:4px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; box-sizing:border-box; background:#fff;"></div><div style="flex:1; min-width:60px;"><label style="font-weight:bold; font-size:10px; color:#000; display:block;">Height (in):</label><input type="number" id="fit-height" value="70" style="width:100%; padding:4px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; box-sizing:border-box; background:#fff;"></div><div style="flex:1; min-width:70px;"><label style="font-weight:bold; font-size:10px; color:#000; display:block;">Daily Steps:</label><input type="number" id="fit-steps" value="8000" style="width:100%; padding:4px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; box-sizing:border-box; background:#fff;"></div><div style="flex:1; min-width:100px;"><label style="font-weight:bold; font-size:10px; color:#000; display:block;">Workout Effort:</label><select id="fit-effort" style="width:100%; padding:4px; font-size:10px; font-weight:bold; background:#fff; color:#000; border:1px solid #cbd5e1; border-radius:4px; box-sizing:border-box;"><option value="1.2">Sedentary (Desk Job)</option><option value="1.375" selected>Light (1-3 days/wk)</option><option value="1.55">Moderate (3-5 days/wk)</option><option value="1.725">Intense (6-7 days/wk)</option></select></div></div><button onclick="runFitCalculations()" style="width:100%; padding:6px; background:#2563eb; color:white; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer; margin-bottom:8px; text-transform:uppercase;">📊 Calculate Target Intakes</button><div id="fitResultsBox" style="display:none; background:white; padding:8px; border:1px solid #cbd5e1; border-radius:6px; font-size:10px; font-weight:bold; line-height:1.5; color:#000;"><div style="color:#4b5563;">⚖️ Maintenance Calories: <span id="res-maintain" style="color:#1e3a8a; font-weight:bold;">0 cal</span></div><div style="color:#dc2626;">🔥 Weight Loss Goal (Cut): <span id="res-lose" style="color:#dc2626; font-weight:bold;">0 cal</span></div><div style="color:#059669;">💪 Weight Gain Goal (Bulk): <span id="res-gain" style="color:#059669; font-weight:bold;">0 cal</span></div></div></div>';
        container.innerHTML = calcHTML;
    }

    window.runFitCalculations = function() {
        var weight = parseFloat(document.getElementById("fit-weight").value) || 0;
        var height = parseFloat(document.getElementById("fit-height").value) || 0;
        var steps = parseFloat(document.getElementById("fit-steps").value) || 0;
        var activity = parseFloat(document.getElementById("fit-effort").value) || 1.2;
        
        var bmr = (10 * (weight * 0.453592)) + (6.25 * (height * 2.54)) - (5 * 25) + 5;
        var tdee = bmr * activity;
        var stepBonus = (steps / 10000) * 150;
        var finalMaintain = Math.round(tdee + stepBonus);
        
        document.getElementById("res-maintain").innerText = finalMaintain + " cal/day";
        document.getElementById("res-lose").innerText = (finalMaintain - 500) + " cal/day";
        document.getElementById("res-gain").innerText = (finalMaintain + 500) + " cal/day";
        document.getElementById("fitResultsBox").style.display = "block";
    };
});
