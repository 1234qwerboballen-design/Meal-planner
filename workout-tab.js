window.addEventListener("DOMContentLoaded", function() {
    var panel = document.getElementById("panel-workouts");
    if (panel) {
        panel.innerHTML = '<div class="card" style="text-align:left;"><h2 style="color:#1e3a8a; font-size:10px; font-weight:bold; margin:0 0 8px 0; border-bottom:2px solid #e2e8f0; padding-bottom:4px; text-transform:uppercase;">🏋️ Weekly Strength Split & Routine Deck</h2>' +
            '<div class="list-item-row" style="color:#2563eb; display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span style="text-transform:uppercase;">📅 Day Split</span><span>💪 Routine Focus Area</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Monday</span><span>Chest & Triceps Heavy Push Split</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Tuesday</span><span>Back & Biceps Hypertrophy Pull Split</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Wednesday</span><span>Active Recovery Cardio & Core Abs</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Thursday</span><span>Shoulders & Arms Traps Overhead Split</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Friday</span><span>Quad Focus Heavy Squat Leg Split</span></div>' +
            '<div class="list-item-row" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-weight:bold; font-size:10px;"><span>Weekend</span><span>Complete Fasting Rest & Muscle Repair</span></div>' +
        '</div>';
    }
});
