const SCRIPT_NAME = "FoodManager";
const GOLDEN_FOOD_SPAWN_INTERVAL = 12;
var scoreSinceGoldenSpawn = 0;

function Init(numFood, hPlayer) {
    for (var i = 0; i < numFood; ++i) {
        var newGameObject = scene.addGameObject();
        var foodScripts = newGameObject.addComponent("Scripts");
        foodScripts.addScript("scripts/food.js");
    }

    script.setEventListener("scoreChanged", function(score) {
        scoreSinceGoldenSpawn++;

        if (scoreSinceGoldenSpawn >= GOLDEN_FOOD_SPAWN_INTERVAL) {
            var goldenFood = scene.addGameObject();
            var goldenScripts = goldenFood.addComponent("Scripts");
            goldenScripts.addScript("scripts/golden_food.js", hPlayer);
            scoreSinceGoldenSpawn = 0;
        }
    });
}
