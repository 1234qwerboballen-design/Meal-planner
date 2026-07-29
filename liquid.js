window.addEventListener("load", function() {
    // Standard baseline fitness dataset database calibration row values (calories per single fluid ounce)
    window.drinkDatabase = {
        "water": { name: "💧 Pure Water / Zero-Cal", calsPerOz: 0 },
        "energy": { name: "⚡ Energy Drink (Avg Premium)", calsPerOz: 13.75 },
        "energy-zero": { name: "🍹 Zero-Sugar Energy Drink", calsPerOz: 0.6 },
        "milk-whole": { name: "🥛 Whole Milk (Full Fat)", calsPerOz: 18.75 },
        "milk-almond": { name: "🥑 Unsweetened Almond Milk", calsPerOz: 3.75 },
        "koolaid": { name: "🍒 Kool-Aid (Avg Sugared)", calsPerOz: 11.25 },
        "juice-orange": { name: "🍊 100% Orange Juice", calsPerOz: 13.75 },
        "soda-regular": { name: "🥤 Regular Cola / Soda", calsPerOz: 12.5 },
        "shake-whey": { name: "🏋️ Whey Protein Shake (Water)", calsPerOz: 15 }
    };

    setTimeout(function() {
        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-type-" + d)) {
                var dOptions = "";
                for (var key in window.drinkDatabase) {
                    dOptions += '<option value="' + key + '">' + window.drinkDatabase[key].name + '</option>';
                }

                var liqHTML = '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; flex-wrap:wrap; align-items:center; gap:6px; clear:both;">' +
                    '<label style="margin:0; font-weight:bold; color:#1e3a8a;">🥤 Liquid Log:</label>' +
                    '<select id="liquid-type-' + d + '" onchange="syncAppEngine()" style="padding:4px; width:150px; font-size:10px; font-weight:bold; background:#fff; color:#000;">' + dOptions + '</select>' +
                    '<input type="number" id="liquid-oz-' + d + '" value="0" min="0" oninput="syncAppEngine()" style="padding:4px; width:45px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; text-align:center;">' +
                    '<span style="font-weight:bold; color:#475569;">fl oz =</span>' +
                    '<span id="liquid-out-' + d + '" style="font-weight:bold; color:#dc2626; background:#fef2f2; padding:2px 6px; border-radius:4px; border:1px solid #fee2e2;">0 cal</span>' +
                '</div>';
                
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
            }
        }

        // Intercept and patch the main synchronization loop safely
        var originalSync = window.syncAppEngine;
        window.syncAppEngine = function() {
            var grandLiqCals = 0;
            for (var d = 0; d < 7; d++) {
                var typeInput = document.getElementById("liquid-type-" + d);
                var ozInput = document.getElementById("liquid-oz-" + d);
                var outSpan = document.getElementById("liquid-out-" + d);
                
                if (typeInput && ozInput && outSpan) {
                    var drinkKey = typeInput.value;
                    var ozVal = parseFloat(ozInput.value) || 0;
                    var databaseProfile = window.drinkDatabase[drinkKey];
                    
                    var computedDrinkCals = 0;
                    if (databaseProfile) {
                        computedDrinkCals = Math.round(ozVal * databaseProfile.calsPerOz);
                    }
                    
                    outSpan.innerText = computedDrinkCals + " cal";
                    grandLiqCals += computedDrinkCals;
                }
            }

            if (originalSync) {
                // Execute standard core food math calculations
                originalSync();
                
                // Add the new fluid metrics directly into the active dashboard registers
                var totalBox = document.getElementById("weeklyTotalVal");
                if (totalBox) {
                    var foodTotalNum = parseInt(totalBox.innerText) || 0;
                    var absoluteCombinedTotal = foodTotalNum + grandLiqCals;
                    totalBox.innerText = absoluteCombinedTotal + " CAL";
                    
                    var avgBox = document.getElementById("dailyAvgVal");
                    if (avgBox) {
                        avgBox.innerText = Math.round(absoluteCombinedTotal / 7) + " CAL";
                    }
                }
                
                // Add individual fluid calorie layers straight into today's green sub-badges
                for (var d = 0; d < 7; d++) {
                    var ozInput = document.getElementById("liquid-oz-" + d);
                    var typeInput = document.getElementById("liquid-type-" + d);
                    var badge = document.getElementById("day-badge-" + d);
                    if (ozInput && typeInput && badge) {
                        var drinkKey = typeInput.value;
                        var ozVal = parseFloat(ozInput.value) || 0;
                        var computedDrinkCals = Math.round(ozVal * (window.drinkDatabase[drinkKey] ? window.drinkDatabase[drinkKey].calsPerOz : 0));
                        
                        var baseFoodText = badge.innerText || "0 cal";
                        var foodNum = parseInt(baseFoodText.replace(" cal", "")) || 0;
                        badge.innerText = (foodNum + computedDrinkCals) + " cal";
                    }
                }
            }
        };

        if (typeof syncAppEngine === "function") {
            syncAppEngine();
        }
    }, 120);
});
