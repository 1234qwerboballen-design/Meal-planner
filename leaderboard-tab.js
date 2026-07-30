window.addEventListener("DOMContentLoaded", function() {
    var panel = document.getElementById("panel-leaderboard");
    if (panel) {
        panel.innerHTML = '<div class="card" style="text-align:left;"><h2 style="color:#1e3a8a; font-size:10px; font-weight:bold; margin:0 0 8px 0; border-bottom:2px solid #e2e8f0; padding-bottom:4px; text-transform:uppercase;">🏆 Shred Season Community Standings</h2>' +
            '<div class="list-item-row" style="color:#059669; display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Rank Name</span><span>🔥 Deficit Streaks</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>🥇 1. Bob Allen (You)</span><span>42 Days Active</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>🥈 2. Coach Muscle Stack</span><span>38 Days Active</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>🥉 3. Shredder Gym Bro</span><span>29 Days Active</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>🏅 4. Iron Lift Master</span><span>21 Days Active</span></div>' +
        '</div>';
    }
});
