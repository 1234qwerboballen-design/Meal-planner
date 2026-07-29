window.addEventListener("load", function() {
    setTimeout(function() {
        var originalAdd = window.addLiquidItem;
        window.addLiquidItem = function(dayIndex) {
            var inputName = document.getElementById("liquid-input-" + dayIndex);
            if (inputName && window.drinkDatabase) {
                var name = inputName.value.trim();
                if (name && window.drinkDatabase[name] === undefined) {
                    var rawCals = prompt("🥤 Custom Drink Detected!\n\nHow many total calories are inside the container?");
                    var rawOz = prompt("How many total fluid ounces are inside the container?");
                    var totalCals = parseFloat(rawCals) || 0;
                    var totalOz = parseFloat(rawOz) || 1;
                    
                    window.drinkDatabase[name] = totalCals / totalOz;
                    var oldList = document.getElementById("drink-search-list");
                    if(oldList) oldList.insertAdjacentHTML("beforeend", '<option value="' + name + '">');
                }
            }
            if (originalAdd) originalAdd(dayIndex);
        };
    }, 200);
});
