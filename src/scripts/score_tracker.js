const SCRIPT_NAME = "ScoreTracker";

var score = 0;

function Init() {
    script.setEventListener("foodEaten", function () {
        score++;
        roingine.fireEvent("scoreChanged", score);
    });

    script.setEventListener("goldenFoodEaten", function () {
        const SCORE = 10;
        score += SCORE;
        roingine.println("+", SCORE, "points");
        roingine.fireEvent("scoreChanged", score);
    });
}
