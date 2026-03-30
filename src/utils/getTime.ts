export const remainingTimeInMinutes = (remainingMoves: number, secondsPerMove = 6) => {
    const totalSeconds = remainingMoves * secondsPerMove;
    return (totalSeconds / 60).toFixed(1);
};