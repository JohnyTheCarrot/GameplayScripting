const SCRIPT_NAME = "Food";
const FOOD_SIZE = 10;
const SPAWN_RANGE_X = 750;
const SPAWN_RANGE_Y = 550;

const utils = require("utils.js");

var transfrom;

function pickRandomLocation() {
    const x = utils.randomRange(50, SPAWN_RANGE_X);
    const y = utils.randomRange(50, SPAWN_RANGE_Y);

    return {x, y};
}

function Init() {
    const randomLocation = pickRandomLocation();

    transform = current.addComponent("Transform", randomLocation.x, randomLocation.y);
    current.addComponent("Rect", FOOD_SIZE, FOOD_SIZE);
    current.addComponent("RectRenderer");
    current.addComponent("RectCollider", FOOD_SIZE, FOOD_SIZE);
}

function eat() {
    roingine.fireEvent("foodEaten");

    const randomLocation = pickRandomLocation();
    transform.setLocalPosition(randomLocation.x, randomLocation.y);
}

script.api = {
    eat,
}
