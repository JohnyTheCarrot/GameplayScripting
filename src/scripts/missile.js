const SCRIPT_NAME = "Missile";

const utils = require("utils.js");

const MISSILE_SIZE = 20;
var maxSpeed;

const RADIUS = 100;
const TIME_BEFORE_ACTIVE_SEC = 1;

var missileSpeed = 0;

var transform;
var playerGameObject;
var playerTransform;

function incrementSpeed() {
    missileSpeed = utils.min(missileSpeed + 10, maxSpeed);
}

function Init() {
    maxSpeed = utils.randomRange(10, 150);
    roingine.println("Spawning missile with a max speed of", maxSpeed);

    transform = current.addComponent("Transform", -MISSILE_SIZE, -MISSILE_SIZE);
    var renderer = current.addComponent("RectRenderer", MISSILE_SIZE, MISSILE_SIZE);
    renderer.setColor(0xd83a3a);
    current.addComponent("RectCollider", MISSILE_SIZE, MISSILE_SIZE);
    current.setLabel("Missile");

    script.setEventListener("foodEaten", incrementSpeed);
}

function FixedUpdate() {
    if (!playerTransform)
        return;

    const worldPos = transform.getWorldPosition();
    var speed = missileSpeed * roingine.FIXED_UPDATE_DELTATIME;
    const targetPos = playerTransform.getWorldPosition();

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

function setPlayerGameObject(hPlayer) {
    playerGameObject = scene.getGameObject(hPlayer);
    if (!playerGameObject)
        throw new Error("Player gameobject not found");

    playerTransform = playerGameObject.getComponent("Transform");
    if (!playerTransform)
        throw new Error("Player transform not found");
}

script.api = {
    setPlayerGameObject,
};
