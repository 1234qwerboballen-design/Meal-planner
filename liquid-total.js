window.addEventListener("load", function() {
    window.drinkLibrary = {
        "Monster Energy Drink (Regular Can)": 13.75,
        "Red Bull Energy Drink (Regular Can)": 13.75,
        "Celsius Energy Drink (Standard Can)": 0.83,
        "Reign / Bang / Ghost (Zero Sugar Can)": 0,
        "Whole Milk (Full Fat)": 18.75,
        "2% Reduced Fat Milk": 15.0,
        "Skim Milk (Fat Free)": 10.0,
        "Unsweetened Almond Milk": 3.75,
        "Oat Milk (Standard)": 15.0,
        "Soy Milk (Original)": 13.75,
        "Kool-Aid (Avg Sugared)": 11.25,
        "Gatorade / Powerade (Regular)": 7.5,
        "Gatorade Zero / Powerade Zero": 0,
        "Coca-Cola / Pepsi / Regular Soda": 12.5,
        "Diet Soda / Coke Zero": 0,
        "100% Orange Juice": 13.75,
        "Whey Protein Shake (with Water)": 15.0,
        "Pre-Workout Drink Mix (1 Scoop)": 5,
        "BCAA / Creatine Supplement Mix": 0,
        "Cup of Black Coffee (Zero Sugar)": 0.2,
        "Bottle of Pure Hydration Water": 0
    };

    var storedLib = localStorage.getItem("customDrinkLibrary");
    if(storedLib) { window.drinkLibrary = JSON.parse(storedLib); }

    window.liquidLogCals = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };

    setTimeout(function() {
        window.rebuildDrinkDatalist = function() {
            var oldDl = document.getElementById("drink-search-list");
            if(oldDl) oldDl.remove();
            var dlOptions = "";
            for (var name in window.drinkLibrary) { dlOptions += '<option value="' + name + '">'; }
            document.body.insertAdjacentHTML("beforeend", '<datalist id="drink-search-list">' + dlOptions + '</datalist>');
        };
        window.rebuildDrinkDatalist();

        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-input-" + d)) {
                var liqHTML = '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; flex-wrap:wrap; align-items:center; gap:6px; clear:both;">' +
                    '<label style="margin:0; font-weight:bold; color:#1e3a8a;">🥤 Search & Log Drink:</label>' +
                    '<input type="text" id="liquid-input-' + d + '" list="drink-search-list" placeholder="Type drink name..." style="padding:4px; width:130px; font-size:10px; font-weight:bold; background:#fff; color:#000; border:1px solid #cbd5e1; border-radius:4px;">' +
                    '<input type="number" id="liquid-oz-' + d + '" value="12" min="1" style="padding:4px; width:42px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; text-align:center;">' +
                    '<span style="font-weight:bold; color:#475569;">oz</span>' +
                    '<button onclick="addOneClickLiquid(' + d + ')" style="padding:4px 8px; background:#059669; color:white; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer;">➕ Log Drink</button>' +
                    '<span id="liquid-total-badge-' + d + '" style="font-weight:bold; color:#10b981; background:#f0fdf4; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; margin-left:auto;">Liquid Total: 0 cal</span>' +
                    '<span onclick="resetLiquidDay(' + d + ')" style="font-size:9px; color:#ef4444; text-decoration:underline; cursor:pointer; font-weight:bold; margin-left:4px;">[Clear]</span>' +
                '</div>';
                
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
                setupLiquidEnterHook(d);
            }
        }

        function setupLiquidEnterHook(dayIndex) {
            var items = ["liquid-input-", "liquid-oz-"];
            items.forEach(function(prefix) {
                var input = document.getElementById(prefix + dayIndex);
                if (input) { input.addEventListener("keypress", function(e) { if (e.key === "Enter") { e.preventDefault(); addOneClickLiquid(dayIndex); } }); }
            });
        }

        window.addOneClickLiquid = function(dayIndex) {
            var inputName = document.getElementById("liquid-input-" + dayIndex);
            var ozInput = document.getElementById("liquid-oz-" + dayIndex);
            
            if (inputName && ozInput) {
                var chosenName = inputName.value.trim();
                var currentOzAmount = parseFloat(ozInput.value) || 0;
                if(!chosenName || currentOzAmount <= 0) return;

                if (chosenName.toLowerCase() === "new") {
                    inputName.value = "";
                    var customName = prompt("🥤 CUSTOM LIBRARY EXPANDER:\n\nWhat is the name of your new beverage or workout shake?");
                    if (!customName || customName.trim() === "") return;
                    customName = customName.trim();
                    
                    var totalCalsStr = prompt("How many TOTAL calories are inside the full standard container/can of " + customName + "?");
                    var totalCalsNum = parseFloat(totalCalsStr) || 0;

                    var totalOzStr = prompt("How many TOTAL fluid ounces are inside that full standard container/can? (e.g. 12, 16, 20)");
                    var totalOzNum = parseFloat(totalOzStr) || 1;
                    
                    // Store the mathematically accurate calorie weight rating value per single fluid ounce
                    window.drinkLibrary[customName] = totalCalsNum / totalOzNum;
                    localStorage.setItem("customDrinkLibrary", JSON.stringify(window.drinkLibrary));
                    window.rebuildDrinkDatalist();
                    
                    // Immediately log based on the current ounces entered in the box row
                    var customComputedCals = Math.round(currentOzAmount * window.drinkLibrary[customName]);
                    window.liquidLogCals[dayIndex] += customComputedCals;
                    localStorage.setItem("dailyLiquidCalsTrack", JSON.stringify(window.liquidLogCals));
                    if (typeof syncAppEngine === "function") syncAppEngine();
                    return;
                }

                var calsPerOz = window.drinkLibrary[chosenName] !== undefined ? window.drinkLibrary[chosenName] : null;
                
                if (calsPerOz !== null) {
                    var finalComputedCals = Math.round(currentOzAmount * calsPerOz);
                    window.liquidLogCals[dayIndex] += finalComputedCals;
                    localStorage.setItem("dailyLiquidCalsTrack", JSON.stringify(window.liquidLogCals));
                    inputName.value = ""; 
                    if(typeof syncAppEngine === "function") { syncAppEngine(); }
                } else {
                    alert("🥤 Drink profile not found. Please select an option from the autocomplete list, or type 'new' to add a custom profile!");
                }
            }
        };

        window.resetLiquidDay = function(dayIndex) {
            window.liquidLogCals[dayIndex] = 0;
            localStorage.setItem("dailyLiquidCalsTrack", JSON.stringify(window.liquidLogCals));
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
