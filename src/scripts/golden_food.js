const SCRIPT_NAME = "GoldenFood";

const utils = require("utils.js");

const SIZE = 20;
const SPAWN_RANGE_X = 750;
const SPAWN_RANGE_Y = 550;

const START_COLOR = [0xf9, 0xf9, 0x3e];
const END_COLOR = [0x00, 0x00, 0x00];
const FADE_TIME_SEC = 5;
const SPEED = 100;
var age = 0;

var start = {x: -800, y: -800};
var goal;
var goalDistance;

var renderer, transform;
var playerTransform;

function pickRandomLocation() {
    var x;
    var y;
    var iterations = 0;

    var playerPos = playerTransform.getWorldPosition();
    var distanceToPlayer, distanceFromStart;

    do {
        x = utils.randomRange(50, SPAWN_RANGE_X);
        y = utils.randomRange(50, SPAWN_RANGE_Y);
        distanceToPlayer = Math.sqrt((x - playerPos.x) ** 2 + (y - playerPos.y) ** 2);
        distanceFromStart = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2);
    } while ((distanceToPlayer <= 300 || distanceFromStart <= 300) && ++iterations < 10);

    return {x, y};
}

function Init(hPlayer) {
    var playerObj = scene.getGameObject(hPlayer);
    playerTransform = playerObj.getComponent("Transform");

    const randomLocation = pickRandomLocation();
    start = randomLocation;
    goal = pickRandomLocation();

    transform = current.addComponent("Transform", randomLocation.x, randomLocation.y);
    renderer = current.addComponent("RectRenderer", SIZE, SIZE);
    renderer.setColor(0xf9f93e);
    current.addComponent("RectCollider", SIZE, SIZE);
    current.setLabel("GoldenFood");
}

function Update(dt) {
    age += dt;
    if (age >= FADE_TIME_SEC) {
        current.destroy();
        return;
    }

    const t = age / FADE_TIME_SEC;
    const newR = START_COLOR[0] * (1 - t) + END_COLOR[0];
    const newG = START_COLOR[1] * (1 - t) + END_COLOR[1];
    const newB = START_COLOR[2] * (1 - t) + END_COLOR[2];

    renderer.setColor(newR, newG, newB);

    const worldPos = transform.getWorldPosition();
    const distance = Math.sqrt((worldPos.x - goal.x) ** 2 + (worldPos.y - goal.y) ** 2);

    if (distance <= 20) {
        current.destroy();
        return;
    }

    const xFactor = -(worldPos.x - goal.x) / distance;
    const yFactor = -(worldPos.y - goal.y) / distance;
    const speed = SPEED * dt;

    if (worldPos.x < goal.x)
        transform.translate(speed * xFactor, 0);
    else
        transform.translate(speed * xFactor, 0);

    if (worldPos.y < goal.y)
        transform.translate(0, speed * yFactor);
    else
        transform.translate(0, speed * yFactor);
}

function eat() {
    roingine.fireEvent("goldenFoodEaten");

    current.destroy();
}

script.api = {
    eat,
}
