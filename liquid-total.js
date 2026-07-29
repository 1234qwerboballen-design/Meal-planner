window.addEventListener("load", function() {
    // Complete standard single-serving fitness beverage database profiles dataset (Pre-calculated container totals)
    window.drinkLibrary = {
        "Monster Energy Drink (Regular Can)": 220,
        "Red Bull Energy Drink (Regular Can)": 110,
        "Celsius Energy Drink (Standard Can)": 10,
        "Reign / Bang / Ghost (Zero Sugar Can)": 0,
        "Whey Protein Shake (1 Scoop with Water)": 120,
        "Protein Shake (1 Scoop with Whole Milk)": 270,
        "Glass of Whole Milk (8 fl oz)": 150,
        "Glass of Unsweetened Almond Milk (8 fl oz)": 30,
        "Glass of Oat Milk (8 fl oz)": 120,
        "Glass of Sweet Tea (12 fl oz)": 90,
        "Glass of Kool-Aid (12 fl oz)": 135,
        "Glass of Regular Soda / Cola (12 fl oz)": 150,
        "Glass of Diet Soda / Coke Zero": 0,
        "Glass of 100% Orange Juice (8 fl oz)": 110,
        "Pre-Workout Drink Mix (1 Scoop)": 5,
        "BCAA / Creatine Supplement Mix": 0,
        "Cup of Black Coffee (Zero Sugar)": 2,
        "Bottle of Pure Hydration Water": 0
    };

    // Safe 7-day default numeric parameters initialization to block syntax token crashes completely
    window.liquidLogCals = [0, 0, 0, 0, 0, 0, 0];

    setTimeout(function() {
        var dlOptions = "";
        for (var name in window.drinkLibrary) { dlOptions += '<option value="' + name + '">'; }
        var oldDl = document.getElementById("drink-search-list");
        if(oldDl) oldDl.remove();
        document.body.insertAdjacentHTML("beforeend", '<datalist id="drink-search-list">' + dlOptions + '</datalist>');

        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-input-" + d)) {
                var liqHTML = '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; flex-wrap:wrap; align-items:center; gap:6px; clear:both;">' +
                    '<label style="margin:0; font-weight:bold; color:#1e3a8a;">🥤 Search & Log Drink:</label>' +
                    '<input type="text" id="liquid-input-' + d + '" list="drink-search-list" placeholder="Type drink name..." style="padding:4px; width:160px; font-size:10px; font-weight:bold; background:#fff; color:#000; border:1px solid #cbd5e1; border-radius:4px;">' +
                    '<button onclick="addOneClickLiquid(' + d + ')" style="padding:4px 8px; background:#059669; color:white; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer;">➕ Log Drink</button>' +
                    '<span id="liquid-total-badge-' + d + '" style="font-weight:bold; color:#10b981; background:#f0fdf4; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; margin-left:auto;">Liquid Total: 0 cal</span>' +
                    '<span onclick="resetLiquidDay(' + d + ')" style="font-size:9px; color:#ef4444; text-decoration:underline; cursor:pointer; font-weight:bold; margin-left:4px;">[Clear]</span>' +
                '</div>';
                
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
                setupLiquidEnterHook(d);
            }
        }

        function setupLiquidEnterHook(dayIndex) {
            var input = document.getElementById("liquid-input-" + dayIndex);
            if (input) { input.addEventListener("keypress", function(e) { if (e.key === "Enter") { e.preventDefault(); addOneClickLiquid(dayIndex); } }); }
        }

        window.addOneClickLiquid = function(dayIndex) {
            var inputName = document.getElementById("liquid-input-" + dayIndex);
            if (inputName) {
                var chosenName = inputName.value.trim();
                if(!chosenName) return;

                // Match name parameters directly against pre-compiled calorie registry matrix values
                var matchCals = window.drinkLibrary[chosenName] !== undefined ? window.drinkLibrary[chosenName] : null;
                
                if (matchCals !== null) {
                    window.liquidLogCals[dayIndex] += matchCals;
                    inputName.value = ""; // Instantly reset search field back to fresh state
                    if(typeof syncAppEngine === "function") { syncAppEngine(); }
                } else {
                    alert("🥤 Drink profile not found. Please select an option from the autocomplete dropdown menu list!");
                }
            }
        };

        window.resetLiquidDay = function(dayIndex) {
            window.liquidLogCals[dayIndex] = 0;
            if(typeof syncAppEngine === "function") { syncAppEngine(); }
        };

        var originalSync = window.syncAppEngine;
        window.syncAppEngine = function() {
            var grandLiqAccumulator = 0;
            for (var d = 0; d < 7; d++) {
                var badge = document.getElementById("liquid-total-badge-" + d);
                if (badge) {
                    badge.innerText = "Liquid Total: " + window.liquidLogCals[d] + " cal";
                    grandLiqAccumulator += window.liquidLogCals[d];
                }
            }

            if (originalSync) {
                originalSync();
                var totalBox = document.getElementById("weeklyTotalVal");
                if (totalBox) {
                    var foodTotalNum = parseInt(totalBox.innerText) || 0;
                    var dynamicCombinedWeeklyTotal = foodTotalNum + grandLiqAccumulator;
                    totalBox.innerText = dynamicCombinedWeeklyTotal + " CAL";
                    var avgBox = document.getElementById("dailyAvgVal");
                    if (avgBox) { avgBox.innerText = Math.round(dynamicCombinedWeeklyTotal / 7) + " CAL"; }
                }
                for (var d = 0; d < 7; d++) {
                    var dayBadge = document.getElementById("day-badge-" + d);
                    if (dayBadge) {
                        var baseFoodText = dayBadge.innerText || "0 cal";
                        var foodNum = parseInt(baseFoodText.replace(" cal", "")) || 0;
                        dayBadge.innerText = (foodNum + window.liquidLogCals[d]) + " cal";
                    }
                }
            }
        };

        if (typeof syncAppEngine === "function") { syncAppEngine(); }
    }, 150);
});
