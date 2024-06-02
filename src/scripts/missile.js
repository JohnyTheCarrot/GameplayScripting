const SCRIPT_NAME = "Missile";

const utils = require("utils.js");

const MISSILE_SIZE = 20;
var maxSpeed;

const RADIUS = 100;

var missileSpeed = 0;
var targetPos = {
    x: 50,
    y: 50,
}

var transform;

function Init() {
    maxSpeed = utils.randomRange(10, 150);
    roingine.println("Spawning missile with a max speed of", maxSpeed);

    transform = current.addComponent("Transform", -MISSILE_SIZE, -MISSILE_SIZE);
    current.addComponent("Rect", MISSILE_SIZE, MISSILE_SIZE);
    current.addComponent("RectRenderer");
    current.addComponent("RectCollider", MISSILE_SIZE, MISSILE_SIZE);
}

function FixedUpdate() {
    const worldPos = transform.getWorldPosition();
    var speed = missileSpeed * roingine.FIXED_UPDATE_DELTATIME;
    const distance = Math.sqrt((worldPos.x - targetPos.x) ** 2 + (worldPos.y - targetPos.y) ** 2);
    const xFactor = -(worldPos.x - targetPos.x) / distance;
    const yFactor = -(worldPos.y - targetPos.y) / distance;

    if (worldPos.x < targetPos.x)
        transform.translate(speed * xFactor, 0);
    else
        transform.translate(speed * xFactor, 0);

    if (worldPos.y < targetPos.y)
        transform.translate(0, speed * yFactor);
    else
        transform.translate(0, speed * yFactor);
}

function setTargetPos(x, y) {
    targetPos.x = x;
    targetPos.y = y;
}

function incrementSpeed() {
    missileSpeed = utils.min(missileSpeed + 10, maxSpeed);
}

script.api = {
    setTargetPos,
    incrementSpeed,
};
