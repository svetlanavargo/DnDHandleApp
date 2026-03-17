export const remainingTimeInMinutes = (remainingMoves: number, secondsPerMove = 6) => {
    const totalSeconds = remainingMoves * secondsPerMove;
    return (totalSeconds / 60).toFixed(1); // показываем с 1 знаком после запятой
};