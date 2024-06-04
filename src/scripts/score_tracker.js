const SCRIPT_NAME = "ScoreTracker";

var score = 0;

function Init() {
    script.setEventListener("foodEaten", function () {
        score++;
        roingine.println("score:", score);
        roingine.fireEvent("scoreChanged", score);
    });
}
