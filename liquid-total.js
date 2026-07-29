window.addEventListener("load", function() {
    setTimeout(function() {
        // Initialize an isolated 7-day memory register array for running liquid totals
        window.liquidLogCals = [0, 0, 0, 0, 0, 0, 0];

        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-cal-" + d)) {
                var liqHTML = '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; align-items:center; gap:6px; clear:both;">' +
                    '<label style="margin:0; font-weight:bold; color:#1e3a8a;">🥤 Add Liquid Calories:</label>' +
                    '<input type="number" id="liquid-cal-' + d + '" value="0" min="0" style="padding:4px; width:65px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000; text-align:center;">' +
                    '<button id="log-liq-btn-' + d + '" style="padding:4px 8px; background:#059669; color:white; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer;">➕ Log</button>' +
                    '<span id="liquid-total-badge-' + d + '" style="font-weight:bold; color:#10b981; background:#f0fdf4; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; margin-left:auto;">Liquid Total: 0 cal</span>' +
                '</div>';
                
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
                setupLiquidLoggerEvents(d);
            }
        }

        function setupLiquidLoggerEvents(dayIndex) {
            var input = document.getElementById("liquid-cal-" + dayIndex);
            var btn = document.getElementById("log-liq-btn-" + dayIndex);
            
            if(btn) {
                btn.addEventListener("click", function() {
                    executeLiquidLogging(dayIndex);
                });
            }
            if(input) {
                input.addEventListener("keypress", function(e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        executeLiquidLogging(dayIndex);
                    }
                });
            }
        }

        window.executeLiquidLogging = function(dayIndex) {
            var input = document.getElementById("liquid-cal-" + dayIndex);
            if (input) {
                var addedCals = parseInt(input.value) || 0;
                if(addedCals > 0) {
                    window.liquidLogCals[dayIndex] += addedCals;
                    input.value = "0"; // Reset the input box immediately back to a clean state
                    if(typeof syncAppEngine === "function") {
                        syncAppEngine();
                    }
                }
            }
        };

        // Inject our custom parameters seamlessly into the core calculation engine loop
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
                    if (avgBox) {
                        avgBox.innerText = Math.round(dynamicCombinedWeeklyTotal / 7) + " CAL";
                    }
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

        if (typeof syncAppEngine === "function") {
            syncAppEngine();
        }
    }, 150);
});
