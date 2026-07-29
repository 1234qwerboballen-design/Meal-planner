window.addEventListener("load", function() {
    // Massive preloaded baseline fitness beverage database directory array profiles (calories per single fluid ounce)
    window.drinkDatabase = {
        "Water": 0,
        "Monster Energy Drink (Regular)": 13.75,
        "Red Bull Energy Drink": 13.75,
        "Celsius Energy Drink": 0.83,
        "Reign / Bang / Ghost Zero Sugar": 0,
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
        "Diet Soda / Coke Zero / Sprite Zero": 0,
        "Sweet Tea": 11.25,
        "Unsweetened Iced Tea": 0.2,
        "Lemonade": 12.5,
        "100% Orange Juice": 13.75,
        "100% Apple Juice": 14.3,
        "Whey Protein Shake (with Water)": 15.0,
        "Protein Shake (with Whole Milk)": 33.75,
        "Pre-Workout Drink": 0.5,
        "BCAA / Creatine Drink Mix": 0,
        "Black Coffee": 0.2
    };

    setTimeout(function() {
        // Generate a reusable search list container block asset natively
        var dlOptions = "";
        for (var name in window.drinkDatabase) {
            dlOptions += '<option value="' + name + '">';
        }
        var datalistHTML = '<datalist id="drink-search-list">' + dlOptions + '</datalist>';
        document.body.insertAdjacentHTML("beforeend", datalistHTML);

        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-input-" + d)) {
                var liqHTML = '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; flex-wrap:wrap; align-items:center; gap:6px; clear:both;">' +
                    '<label style="margin:0; font-weight:bold; color:#1e3a8a;">🥤 Search/Type Drink:</label>' +
                    '<input type="text" id="liquid-input-' + d + '" list="drink-search-list" placeholder="Type drink name..." oninput="syncAppEngine()" style="padding:4px; width:150px; font-size:10px; font-weight:bold; background:#fff; color:#000; border:1px solid #cbd5e1; border-radius:4px;">' +
                    '<input type="number" id="liquid-oz-' + d + '" value="0" min="0" oninput="syncAppEngine()" style="padding:4px; width:45px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; text-align:center;">' +
                    '<span style="font-weight:bold; color:#475569;">fl oz =</span>' +
                    '<span id="liquid-out-' + d + '" style="font-weight:bold; color:#dc2626; background:#fef2f2; padding:2px 6px; border-radius:4px; border:1px solid #fee2e2;">0 cal</span>' +
                '</div>';
                
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
            }
        }

        // Intercept and patch the main synchronization engine loop safely
        var originalSync = window.syncAppEngine;
        window.syncAppEngine = function() {
            var grandLiqCals = 0;
            for (var d = 0; d < 7; d++) {
                var inputName = document.getElementById("liquid-input-" + d);
                var ozInput = document.getElementById("liquid-oz-" + d);
                var outSpan = document.getElementById("liquid-out-" + d);
                
                if (inputName && ozInput && outSpan) {
                    var typedName = inputName.value;
                    var ozVal = parseFloat(ozInput.value) || 0;
                    var calsPerOz = window.drinkDatabase[typedName] !== undefined ? window.drinkDatabase[typedName] : 0;
                    
                    var computedDrinkCals = Math.round(ozVal * calsPerOz);
                    outSpan.innerText = computedDrinkCals + " cal";
                    grandLiqCals += computedDrinkCals;
                }
            }

            if (originalSync) {
                originalSync();
                
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
                
                for (var d = 0; d < 7; d++) {
                    var ozInput = document.getElementById("liquid-oz-" + d);
                    var inputName = document.getElementById("liquid-input-" + d);
                    var badge = document.getElementById("day-badge-" + d);
                    if (ozInput && inputName && badge) {
                        var typedName = inputName.value;
                        var ozVal = parseFloat(ozInput.value) || 0;
                        var calsPerOz = window.drinkDatabase[typedName] !== undefined ? window.drinkDatabase[typedName] : 0;
                        var computedDrinkCals = Math.round(ozVal * calsPerOz);
                        
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
