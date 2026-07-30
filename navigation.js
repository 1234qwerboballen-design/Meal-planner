window.addEventListener("load", function() {
    setTimeout(function() {
        // 1. Dynamic Dropdown Trigger Core Engine Hook
        window.toggleNavMenu = function() {
            var menu = document.getElementById("navDropdownMenu");
            if (!menu) return;
            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        };

        // 2. Tab Router Navigation State Management Controller
        window.navigateHubTab = function(tabKey) {
            document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove('active'));
            
            var targetLink = document.getElementById("lnk-" + tabKey);
            var targetPanel = document.getElementById("panel-" + tabKey);
            
            if (targetLink) targetLink.classList.add('active');
            if (targetPanel) targetPanel.classList.add('active');
            
            var dropdown = document.getElementById("navDropdownMenu");
            if (dropdown) dropdown.style.display = "none";
        };

        // 3. Automated External Event Area Click Guard Closer
        document.addEventListener("click", function(event) {
            var menu = document.getElementById("navDropdownMenu");
            var trigger = document.querySelector(".menu-trigger");
            if (menu && menu.style.display === "block" && event.target !== menu && event.target !== trigger && !menu.contains(event.target)) {
                menu.style.display = "none";
            }
        });

        // 4. Live Version Tracker Initialization System Check
        var buildLabel = document.getElementById("liveBuildTime");
        if (buildLabel) {
            var dateObj = new Date();
            var dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            var timeLabel = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            buildLabel.innerText = dayLabel + " at " + timeLabel;
        }
    }, 100);
});
