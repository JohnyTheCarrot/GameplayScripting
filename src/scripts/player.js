const SCRIPT_NAME = "Player";

var rigidbody;

const FLY_SPEED = 10;
const DEFLATE_SPEED = 20;
const MOVEMENT_SPEED = 20;
const MAX_FLY_SPEED = 500;
const MAX_FALL_SPEED = 500;
const PLAYER_SIZE = 50;

const utils = require("utils.js");

var transform;

input.onKeyHeld(input.KEY_SPACE, function () {
    const currentSpeed = rigidbody.getProperty("speedY");

    rigidbody.setProperty("speedY", utils.min(currentSpeed + FLY_SPEED, MAX_FLY_SPEED));
});

input.onKeyHeld(input.KEY_S, function () {
    const currentSpeed = rigidbody.getProperty("speedY");

    rigidbody.setProperty("speedY", utils.max(currentSpeed - DEFLATE_SPEED, -MAX_FALL_SPEED));
    roingine.println(rigidbody.getProperty("speedY"));
});

input.onKeyHeld(input.KEY_A, function () {
    const currentSpeed = rigidbody.getProperty("speedX");

    rigidbody.setProperty("speedX", utils.max(currentSpeed - MOVEMENT_SPEED, -MAX_FLY_SPEED));
});

input.onKeyHeld(input.KEY_D, function () {
    const currentSpeed = rigidbody.getProperty("speedX");

    rigidbody.setProperty("speedX", utils.min(currentSpeed + MOVEMENT_SPEED, MAX_FLY_SPEED));
});

function die() {
    roingine.print("======================\n")
    roingine.print("\n");
    roingine.print("You died\n");
    roingine.print("\n");
    roingine.println("======================")
    roingine.fireEvent("playerDied");
    scene.load("scenes/main.json");
}

function Init(hMissileManager) {
    transform = current.addComponent("Transform", 100, 100);
    current.addComponent("Rect", PLAYER_SIZE, PLAYER_SIZE);
    current.addComponent("RectRenderer");

    var collider = current.addComponent("RectCollider", PLAYER_SIZE, PLAYER_SIZE);
    collider.onCollision(function(other) {
        var scripts = other.getComponent("Scripts");
        if (!scripts)
            return;

        var foodScript = scripts.getScript("Food");
        if (!foodScript) {
            var missileScript = scripts.getScript('Missile');
            if (!missileScript)
                return;

            die();
            return;
        }

        foodScript.callMethod("eat");
    });

    var scripts = current.getComponent("Scripts");
    scripts.addScript("scripts/rigidbody.js");
    rigidbody = scripts.getScript("Rigidbody");
    const missileManagerObject = scene.getGameObject(hMissileManager);
    const missileManager = missileManagerObject.getComponent("Scripts").getScript("MissileManager");
    missileManager.callMethod("setPlayerGameObject", current.handle);
}

function Update() {
    var worldPos = transform.getWorldPosition();
    var newPos = worldPos;

    if (worldPos.x < 0) {
        newPos.x = 0;
        rigidbody.setProperty("speedX", 0);
    }
    else if (worldPos.x > 800 - PLAYER_SIZE) {
        newPos.x = 800 - PLAYER_SIZE;
        rigidbody.setProperty("speedX", 0);
    }

    if (worldPos.y < 0) {
        newPos.y = 0;
        rigidbody.setProperty("speedY", 0);
    }
    else if (worldPos.y > 600 - PLAYER_SIZE) {
        newPos.y = 600 - PLAYER_SIZE;
        rigidbody.setProperty("speedY", 0);
    }

    transform.setLocalPosition(newPos.x, newPos.y);
}
