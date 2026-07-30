window.addEventListener("DOMContentLoaded", function() {
    var panel = document.getElementById("panel-home");
    if (panel) {
        panel.innerHTML = '<div style="background:linear-gradient(to right, #065f46, #047857); color:white; padding:10px; border-radius:8px; margin-bottom:12px; font-weight:bold; font-size:10px; border-left:4px solid #34d399; box-shadow:0 2px 4px rgba(0,0,0,0.1);">' +
            '<div style="color:#34d399; font-size:10px; letter-spacing:0.5px; margin-bottom:2px; font-weight:black; text-transform:uppercase;">🔥 System Directory Update Implemented!</div>' +
            '<div style="font-size:10px; color:#fff;">Active System Compile Sync Timestamp: <span id="liveBuildTime" style="color:#a7f3d0; font-family:monospace; font-weight:bold;">V5.0.0 (COMPLETE MULTI-FILE SEPARATION)</span></div>' +
        '</div>' +
        '<div class="card" style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border-left: 5px solid #2563eb; text-align:left; padding:12px; border-radius:10px; box-shadow:0 1px 4px rgba(0,0,0,0.1);">' +
            '<h2 style="margin:0 0 6px 0; color:#1e3a8a; font-size:10px; font-weight:bold; text-transform:uppercase;">⚡ Welcome Back, Champ!</h2>' +
            '<p style="color:#1e3a8a; font-size:10px; font-weight:bold; margin:0; line-height:1.4;">Your training matrix is fully synchronized. Tap the three dots (⋮) in the top-left corner to access your diet plans, customize exercise schedules, or analyze your current BMI targets!</p>' +
        '</div>';
    }
});
