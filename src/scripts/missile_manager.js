const SCRIPT_NAME = "MissileManager";

var missiles = [];
var playerHandle;

function spawnMissile() {
    var newGameObject = scene.addGameObject();
    var scripts = newGameObject.addComponent("Scripts");
    var script = scripts.addScript("scripts/missile.js");
    missiles.push(script);

    if (playerHandle)
        script.callMethod("setPlayerGameObject", playerHandle);
}

function Init() {
    spawnMissile();
    script.setEventListener("scoreChanged", function(score, deltaScore) {
        if (score % 10 == 0)
            spawnMissile();
    });
}

function setPlayerGameObject(hPlayer) {
    playerHandle = hPlayer;
    for (var idx = 0; idx < missiles.length; ++idx) {
        missiles[idx].callMethod("setPlayerGameObject", hPlayer)
    }
}

script.api = {
    spawnMissile,
    setPlayerGameObject,
}
