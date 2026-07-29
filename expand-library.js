window.addEventListener("load", function() {
    setTimeout(function() {
        // Intercept and wrap the existing one-click liquid logging function safely
        var originalLogButtonFunction = window.addOneClickLiquid;
        
        window.addOneClickLiquid = function(dayIndex) {
            var inputField = document.getElementById("liquid-input-" + dayIndex);
            if (inputField) {
                var typedValue = inputField.value.trim().toLowerCase();
                
                // Intercept the specific triggering target keyword "new" seamlessly
                if (typedValue === "new") {
                    inputField.value = ""; // Instantly reset search field to clean layout state
                    
                    var customName = prompt("🥤 CUSTOM LIBRARY EXPANDER:\n\nWhat is the name of your new beverage or workout shake?");
                    if (!customName || customName.trim() === "") return;
                    customName = customName.trim();
                    
                    var customCalsStr = prompt("How many total calories are inside a single serving/container of " + customName + "?");
                    var customCalsNum = parseFloat(customCalsStr) || 0;
                    
                    // Inject newly calibrated profiles directly into your local database dictionary
                    if (!window.drinkLibrary) window.drinkLibrary = {};
                    window.drinkLibrary[customName] = customCalsNum;
                    
                    // Save custom drink rows to permanent browser storage so they don't erase on go
                    localStorage.setItem("customDrinkLibrary", JSON.stringify(window.drinkLibrary));
                    
                    // Instantly append the new profile straight into your active autocomplete datalist dropdown options
                    var searchDatalistGrid = document.getElementById("drink-search-list");
                    if (searchDatalistGrid) {
                        searchDatalistGrid.insertAdjacentHTML("beforeend", '<option value="' + customName + '">');
                    }
                    
                    // Automatically log the newly created asset into today's calorie totals right on the spot!
                    if (window.liquidLogCals) {
                        window.liquidLogCals[dayIndex] += customCalsNum;
                        if (typeof syncAppEngine === "function") syncAppEngine();
                    }
                    return;
                }
            }
            
            // Fallback back to standard preloaded drink library processing checks if keyword isn't typed
            if (originalLogButtonFunction) originalLogButtonFunction(dayIndex);
        };

        // Load your saved library expansions on page boot so your phone app completely remembers them on the go
        var savedCustomDrinks = localStorage.getItem("customDrinkLibrary");
        if (savedCustomDrinks && window.drinkLibrary) {
            var parsedDrinks = JSON.parse(savedCustomDrinks);
            var searchDatalistGrid = document.getElementById("drink-search-list");
            for (var name in parsedDrinks) {
                if (window.drinkLibrary[name] === undefined) {
                    window.drinkLibrary[name] = parsedDrinks[name];
                    if (searchDatalistGrid) {
                        searchDatalistGrid.insertAdjacentHTML("beforeend", '<option value="' + name + '">');
                    }
                }
            }
        }
    }, 250);
});
