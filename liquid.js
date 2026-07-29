window.addEventListener("load", function() {
    setTimeout(function() {
        for (var d = 0; d < 7; d++) {
            var dayBoxes = document.querySelectorAll(".day-box");
            if (dayBoxes[d] && !document.getElementById("liquid-cal-" + d)) {
                var liqHTML = '<div style="margin-top:6px; display:flex; align-items:center; gap:6px;"><label style="margin:0; white-space:nowrap; font-weight:bold; color:#475569;">🥤 Liquid Calories:</label><input type="number" id="liquid-cal-' + d + '" value="0" min="0" style="padding:4px; width:60px; font-size:10px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#000;" oninput="syncAppEngine()"></div>';
                dayBoxes[d].insertAdjacentHTML("beforeend", liqHTML);
            }
        }
        if (typeof syncAppEngine === "function") {
            syncAppEngine();
        }
    }, 100);
});
