window.addEventListener("load", function() {
    var defaultDrinks = {
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

    var storedLib = localStorage.getItem("customDrinkLibrary");
    window.drinkDatabase = storedLib ? JSON.parse(storedLib) : defaultDrinks;

    var storedTotals = localStorage.getItem("dailyLiquidCalsTrack");
    // Explicit array array parameter assignment values setup parameters to prevent syntax token errors
    window.dailyLiquidTotals = storedTotals ? JSON.parse(storedTotals) :;

    setTimeout(function() {
        window.rebuildDrinkDatalist = function() {
            var oldDl = document.getElementById("drink-search-list");
            if(oldDl) oldDl.remove();
            var dlOptions = "";
            for (var name in window.drinkDatabase) { dlOptions += '<option value="' + name + '">'; }
            document.body.insertAdjacentHTML("beforeend", '<datalist id="drink-search-list">' + dlOptions + '</datalist>');
        };
        window.rebuildDrinkDatalist();

        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-input-" + d)) {
                var liqHTML = '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; flex-wrap:wrap; align-items:center; gap:6px; clear:both;">' +
                    '<label style="margin:0; font-weight:bold; color:#1e3a8a;">🥤 Log Drink:</label>' +
                    '<input type="text" id="liquid-input-' + d + '" list="drink-search-list" placeholder="Type drink name..." style="padding:4px; width:120px; font-size:10px; font-weight:bold; background:#fff; color:#000; border:1px solid #cbd5e1; border-radius:4px;">' +
                    '<input type="number" id="liquid-oz-' + d + '" value="0" min="0" style="padding:4px; width:38px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; text-align:center;">' +
                    '<span style="font-weight:bold; color:#475569;">oz</span>' +
                    '<div id="custom-cal-zone-' + d + '" style="display:none; align-items:center; gap:4px;">' +
                        '<input type="number" id="custom-cal-per-oz-' + d + '" value="0" step="0.1" min="0" placeholder="Cals per 1 oz" style="padding:4px; width:65px; font-size:10px; border:1px solid #ef4444; border-radius:4px; font-weight:bold; color:#000; text-align:center;">' +
                    '</div>' +
                    '<button onclick="addLiquidItem(' + d + ')" style="padding:4px 6px; background:#059669; color:white; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer;">➕ Log</button>' +
                    '<span id="liquid-out-' + d + '" style="font-weight:bold; color:#10b981; background:#f0fdf4; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; margin-left:auto;">Logged Today: 0 cal</span>' +
                    '<span onclick="resetLiquidDay(' + d + ')" style="font-size:9px; color:#ef4444; text-decoration:underline; cursor:pointer; font-weight:bold; margin-left:4px;">[Reset]</span>' +
                '</div>';
                
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
                setupEnterKey(d);
            }
        }

        function setupEnterKey(dayIndex) {
            var items = ["liquid-oz-", "liquid-input-", "custom-cal-per-oz-"];
            items.forEach(function(idPrefix) {
                var el = document.getElementById(idPrefix + dayIndex);
                if (el) { el.addEventListener("keypress", function(e) { if (e.key === "Enter") { e.preventDefault(); addLiquidItem(dayIndex); } }); }
            });
        }

        window.addLiquidItem = function(dayIndex) {
            var inputName = document.getElementById("liquid-input-" + dayIndex);
            var ozInput = document.getElementById("liquid-oz-" + dayIndex);
            var calZone = document.getElementById("custom-cal-zone-" + dayIndex);
            var customCalInput = document.getElementById("custom-cal-per-oz-" + dayIndex);
            
            if (inputName && ozInput) {
                var name = inputName.value.trim();
                var oz = parseFloat(ozInput.value) || 0;
                if(!name || oz <= 0) return;

                if (window.drinkDatabase[name] === undefined) {
                    if (calZone.style.display === "none") {
                        calZone.style.display = "flex";
                        customCalInput.focus();
                        alert("New Drink Detected! Please enter how many calories are in 1 fluid ounce (Total Cals / Container Ounces), then press Log or Enter again to save it permanently.");
                        return;
                    }
                    var customRate = parseFloat(customCalInput.value) || 0;
                    window.drinkDatabase[name] = customRate;
                    localStorage.setItem("customDrinkLibrary", JSON.stringify(window.drinkDatabase));
                    window.rebuildDrinkDatalist();
                }

                var calsPerOz = window.drinkDatabase[name];
                var calculatedCals = Math.round(oz * calsPerOz);
                window.dailyLiquidTotals[dayIndex] += calculatedCals;
                
                localStorage.setItem("dailyLiquidCalsTrack", JSON.stringify(window.dailyLiquidTotals));
                
                inputName.value = "";
                ozInput.value = "0";
                calZone.style.display = "none";
                customCalInput.value = "0";
                
                if(typeof syncAppEngine === "function") { syncAppEngine(); }
            }
        };

        window.resetLiquidDay = function(dayIndex) {
            window.dailyLiquidTotals[dayIndex] = 0;
            localStorage.setItem("dailyLiquidCalsTrack", JSON.stringify(window.dailyLiquidTotals));
            if(typeof syncAppEngine === "function") { syncAppEngine(); }
        };

        var originalSync = window.syncAppEngine;
        window.syncAppEngine = function() {
            var grandLiqCals = 0;
            for (var d = 0; d < 7; d++) {
                var outSpan = document.getElementById("liquid-out-" + d);
                if (outSpan) {
                    outSpan.innerText = "Logged Today: " + window.dailyLiquidTotals[d] + " cal";
                    grandLiqCals += window.dailyLiquidTotals[d];
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
                    if (avgBox) { avgBox.innerText = Math.round(absoluteCombinedTotal / 7) + " CAL"; }
                }
                for (var d = 0; d < 7; d++) {
                    var badge = document.getElementById("day-badge-" + d);
                    if (badge) {
                        var baseFoodText = badge.innerText || "0 cal";
                        var foodNum = parseInt(baseFoodText.replace(" cal", "")) || 0;
                        badge.innerText = (foodNum + window.dailyLiquidTotals[d]) + " cal";
                    }
                }
            }
        };

        if (typeof syncAppEngine === "function") { syncAppEngine(); }
    }, 120);
});
