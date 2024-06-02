function translate(transform, x, y) {
    const transX = roingine.getDeltaTime() * x;
    const transY = roingine.getDeltaTime() * y;

    transform.translate(transX, transY);
}

function max(val, max) {
    return val > max ? val : max;
}

function min(val, min) {
    return val < min ? val : min;
}

function randomRange(min, max) {
    const rand = Math.random();

    return min * (1 - rand) + max * rand;
}

module.exports = {
    translate,
    max,
    min,
    randomRange,
};
