export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function totalAmountToBePaid(investment) {
    return investment + 0.05 * investment;
}
