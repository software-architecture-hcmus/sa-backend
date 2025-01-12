const convertTimeToPoint = (startTime: number, totalSeconds: number): number => {
  let points = 10000;

  const actualTime = Date.now();
  const elapsedTimeInSeconds = (actualTime - startTime) / 1000;

  // Tính điểm dựa trên thời gian đã trôi qua
  points -= (1000 / totalSeconds) * elapsedTimeInSeconds;
  points = Math.max(0, points); // Đảm bảo điểm không âm
  points = Math.ceil(points); // Làm tròn điểm lên hàng đơn vị

  return points;
};

export default convertTimeToPoint;