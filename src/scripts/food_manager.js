const SCRIPT_NAME = "FoodManager";

function Init(numFood) {
    for (var i = 0; i < numFood; ++i) {
        var newGameObject = scene.addGameObject();
        var scripts = newGameObject.addComponent("Scripts");
        scripts.addScript("scripts/food.js");
    }
}
