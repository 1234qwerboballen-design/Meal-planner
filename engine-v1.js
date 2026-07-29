var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var stylesList = ["Chinese / Asian", "Mexican / TexMex", "Italian / Med", "American Comfort", "Diner Breakfast"];
var proteinsList = ["Chicken", "Beef", "Turkey", "Seafood", "Pork"];
var proteinCals = { "Chicken": 640, "Beef": 710, "Turkey": 610, "Seafood": 380, "Pork": 640 };
var prepMethods = ["Szechuan Spiced", "Spicy Chili", "Fiery Ginger", "Chipotle Infused", "Zesty Pan-Fried", "Peppery Seared", "Cajun Style","Crispy Baked", "Garlic Seared", "Slow Cooked", "Flame Grilled", "Honey Glazed", "Crumbled Skillet", "Garlic Butter Glazed","Herb Crust", "Lemon Infused", "Flaked Skillet", "Shredded", "Sheet-Pan Slices", "House Special", "Citrus Marinated","Teriyaki Glazed", "Sweet Chili", "Sizzling", "Savory Braised", "Diced Skillet", "Toasted", "Browned","Oven-Roasted", "Searing-Hot", "Slow-Simmered", "Crispy Air-Fried", "Sweet BBQ Coat", "Cracked-Pepper", "Basil-Infused"];
var servingStyles = ["Fajita Platter", "Taco Boat", "Salsa Boat", "Grill Basket", "Baja Plate", "Spicy Skillet", "Chili Bowl","Comfort Tray", "Crave Bowl", "Omelet Wrap", "Diner Special", "Skillet Pack", "Macro Plate", "Quesadilla Melt","Lettuce Wrap", "Salad Bowl", "Asparagus Bed", "Broccoli Bed", "Low-Carb Pocket", "Cutting Grid Tray", "Veggie Medley Tray","Jasmine Rice Bowl", "Potato Skillet", "Brown Rice Melt", "Wheat Toast Stack", "Sweet Potato Box", "Carb-Load Plate", "Cauliflower Rice Bowl","Quinoa Toss Bed", "Fuel Block", "Déficit Pack", "Harvest Bowl", "Skewer Plate", "G pantry Box", "Marinara Bed"];
var proteinGroceries = {"Chicken": { item: "8oz Chicken Breast", dept: "🥩 Meat Department" },"Beef": { item: "6oz Lean Ground Beef", dept: "🥩 Meat Department" },"Turkey": { item: "Two 4oz Turkey Patties", dept: "🥩 Meat Department" },"Seafood": { item: "6oz Tilapia Fillet", dept: "🥩 Meat Department" },"Pork": { item: "7oz Boneless Pork Chop", dept: "🥩 Meat Department" }};
var styleGroceries = {"Chinese / Asian": { side: "1 cup Jasmine Rice", prod: "1 cup Broccoli", sauce: "2 tbsp Soy Sauce", steps: "Stir-fry protein strips over extreme high-heat 4m. Pour soy sauce coat and plate over jasmine rice with steamed broccoli crowns." },"Mexican / TexMex": { side: "1 cup Brown Rice", prod: "1/2 cup Salsa", sauce: "2 tbsp Taco Spices", steps: "Brown ground or sliced protein inside skillet using taco seasoning dust. Toss over brown rice base with salsa portions." },"Italian / Med": { side: "1 cup Pasta Noodles", prod: "1 cup Asparagus", sauce: "1/2 cup Marinara", steps: "Pan-sear protein thoroughly with Italian herb coatings. Melt butter over skillet and toss over noodles with fresh asparagus sticks." },"American Comfort": { side: "1 Large Potato", prod: "1/2 can Green Beans", sauce: "2 tbsp BBQ Sauce", steps: "Flame grill meat cut and brush surface with smoky BBQ glaze. Microwave potato 6m until soft, fluff and plate with green beans." },"Diner Breakfast": { side: "2 slices Wheat Bread", prod: "4 Large Eggs", sauce: "1 tbsp Fruit Jelly", steps: "Crisp meat base in heated frying pan. Whisk eggs and scramble inside skillet with melted butter. Serve with hot fruit jelly toast slides." }};
var weekHTML = "";
for (var d = 0; d < 7; d++) {
    var rOpt = '<option value="">-- Choose Style --</option>'; for (var s = 0; s < 5; s++) rOpt += '<option value="'+stylesList[s]+'">'+stylesList[s]+'</option>';
    var pOpt = '<option value="">-- Choose Protein --</option>'; for (var p = 0; p < 5; p++) pOpt += '<option value="'+proteinsList[p]+'">'+proteinsList[p]+'</option>';
    weekHTML += '<div class="day-box"><div class="day-header"><div class="day-name">' + weekDays[d] + ' <span id="day-badge-' + d + '" class="day-cal-badge">0 cal</span></div><button id="toggle-btn-' + d + '" class="toggle-btn btn-add" onclick="toggleSecondMeal(' + d + ')">➕ Add Meal 2</button></div><label>Meal Choice 1</label><div class="flex-row"><select id="style-m1-' + d + '" onchange="updateMealOptions(' + d + ', 1)">' + rOpt + '</select><select id="prot-m1-' + d + '" onchange="updateMealOptions(' + d + ', 1)">' + pOpt + '</select></div><div class="filter-row"><select id="mood-m1-' + d + '" onchange="updateMealOptions(' + d + ', 1)"><option value="ALL">📋 Show All 35 Options</option><option value="SPICY">🌶️ Mood: Give Me Heat (Spicy)</option><option value="COMFORT">🧀 Mood: Comfort Food (Savory)</option><option value="LIGHT">🥑 Mood: Keep It Light (Low Carb)</option><option value="CARBS">🍚 Mood: Need Carbs (Fueling)</option></select></div><div class="meal-select-container"><label>Specific Meal (Name & Calories)</label><select id="meal-m1-' + d + '" onchange="syncAppEngine()"><option value="">-- Select Meal --</option></select></div><div id="m2-wrapper-' + d + '" class="m2-wrapper"><label>Meal Choice 2</label><div class="flex-row"><select id="style-m2-' + d + '" onchange="updateMealOptions(' + d + ', 2)">' + rOpt + '</select><select id="prot-m2-' + d + '" onchange="updateMealOptions(' + d + ', 2)">' + pOpt + '</select></div><div class="filter-row"><select id="mood-m2-' + d + '" onchange="updateMealOptions(' + d + ', 2)"><option value="ALL">📋 Show All 35 Options</option><option value="SPICY">🌶️ Mood: Give Me Heat (Spicy)</option><option value="COMFORT">🧀 Mood: Comfort Food (Savory)</option><option value="LIGHT">🥑 Mood: Keep It Light (Low Carb)</option><option value="CARBS">🍚 Mood: Need Carbs (Fueling)</option></select></div><div class="meal-select-container"><label>Specific Meal (Name & Calories)</label><select id="meal-m2-' + d + '" onchange="syncAppEngine()"><option value="">-- Select Meal --</option></select></div></div></div>';
}
document.getElementById("weekContainer").innerHTML = weekHTML;
window.toggleSecondMeal = function(dayIndex) {
    var wrapper = document.getElementById("m2-wrapper-" + dayIndex); var button = document.getElementById("toggle-btn-" + dayIndex);
    if (wrapper.style.display === "block") { wrapper.style.display = "none"; button.innerHTML = "➕ Add Meal 2"; button.className = "toggle-btn btn-add"; document.getElementById("style-m2-" + dayIndex).value = ""; document.getElementById("prot-m2-" + dayIndex).value = ""; document.getElementById("meal-m2-" + dayIndex).value = ""; }
    else { wrapper.style.display = "block"; button.innerHTML = "❌ Remove Meal 2"; button.className = "toggle-btn btn-remove"; document.getElementById("style-m2-" + dayIndex).value = "American Comfort"; document.getElementById("prot-m2-" + dayIndex).value = "Chicken"; updateMealOptions(dayIndex, 2); }
    syncAppEngine();
};
window.updateMealOptions = function(dayIndex, mealNum) {
    var sVal = document.getElementById("style-m" + mealNum + "-" + dayIndex).value; var pVal = document.getElementById("prot-m" + mealNum + "-" + dayIndex).value;
    var mVal = document.getElementById("mood-m" + mealNum + "-" + dayIndex).value; var mSelect = document.getElementById("meal-m" + mealNum + "-" + dayIndex);
    if (!mSelect) return; mSelect.innerHTML = '<option value="">-- Select Meal --</option>'; if (!sVal || !pVal) { syncAppEngine(); return; }
    var baseCal = proteinCals[pVal] || 600; var cleanStyle = sVal.split(" / "); var optionsHTML = '<option value="">-- Select Meal --</option>';
    var startIdx = 0, endIdx = 35; if (mVal === "SPICY") { startIdx = 0; endIdx = 7; } if (mVal === "COMFORT") { startIdx = 7; endIdx = 14; } if (mVal === "LIGHT") { startIdx = 14; endIdx = 21; } if (mVal === "CARBS") { startIdx = 21; endIdx = 28; }
    for (var i = startIdx; i < endIdx; i++) {
        var calOffset = (i % 2 === 0) ? (i * 2) : -(i * 1.5); if (mVal === "LIGHT") calOffset -= 45; if (mVal === "CARBS") calOffset += 45;
        var computedCal = Math.round(baseCal + calOffset); var dishName = prepMethods[i] + " " + cleanStyle[0] + " " + pVal + " " + servingStyles[(i + dayIndex) % 35] + " (" + computedCal + " cal)";
        optionsHTML += '<option value="' + sVal + '|' + pVal + '|' + dishName + '|' + computedCal + '">' + dishName + '</option>';
    }
    mSelect.innerHTML = optionsHTML; mSelect.selectedIndex = 1; syncAppEngine();
};
window.syncAppEngine = function() {
    var rHTML = "", activeMap = {}, masterGroceries = {}, grandCals = 0;
    for (var d = 0; d < 7; d++) {
        var m1Val = document.getElementById("meal-m1-" + d).value; var m2W = document.getElementById("m2-wrapper-" + d);
        var m2Val = (m2W && m2W.style.display === "block") ? document.getElementById("meal-m2-" + d).value : "";
        var activeToday = [m1Val, m2Val], dayCals = 0;
        for (var m = 0; m < activeToday.length; m++) {
            var raw = activeToday[m]; if (!raw) continue; var frags = raw.split("|");
            var style = frags[0], protein = frags[1], fullDishName = frags[2], mealCalories = parseInt(frags[3]) || 0;
            dayCals += mealCalories; grandCals += mealCalories; var pData = proteinGroceries[protein], sData = styleGroceries[style];
            if (!pData || !sData) continue;
            if (!activeMap[fullDishName]) { activeMap[fullDishName] = true; rHTML += '<div class="recipe-item"><div class="recipe-title">' + fullDishName + '</div><div class="recipe-steps"><strong>Ingredients:</strong> ' + pData.item + ', ' + sData.side + ', ' + sData.prod + ', ' + sData.sauce + '.<br><br><strong>Directions:</strong> ' + sData.steps + '</div></div>'; }
            var listItems = [{ name: pData.item, aisle: pData.dept }, { name: sData.side, aisle: "🌾 Grains & Pantry Supply" }, { name: sData.prod, aisle: "🥦 Fresh Produce Aisle" }, { name: sData.sauce, aisle: "🥫 Sauces & Seasonings" }];
            for (var g = 0; g < listItems.length; g++) { var line = listItems[g]; if (!masterGroceries[line.aisle]) masterGroceries[line.aisle] = {}; masterGroceries[line.aisle][line.name] = (masterGroceries[line.aisle][line.name] || 0) + 1; }
        }
        document.getElementById("day-badge-" + d).innerHTML = dayCals + " cal";
    }
