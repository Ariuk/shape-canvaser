export const DRAW_TOOLS = ["Line", "Polygon", "Rectangle"];

export const TOOL_NAMES = {
  Line: "Line",
  Polygon: "Polygon",
  Rectangle: "Rectangle",
};

export const convertToArray = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    result.push([obj.x, obj.y]);
  }
  return result;
};

export const convertToObjectArray = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const innerArr = arr[i];
    const obj = { x: innerArr[0], y: innerArr[1] };
    result.push(obj);
  }
  return result;
};

export const getRectangularPositionAndSize = (points) => {
  const RTOarray = convertToObjectArray(points);
  const height = Math.abs(RTOarray[1].y - RTOarray[0].y);
  const width = Math.abs(RTOarray[1].x - RTOarray[0].x);
  const { x, y } = RTOarray[0];
  return { x, y, width, height };
};

export const getPointsFromRectangularPositionAndSize = (data) => {
  const { x, y, width, height } = data;
  const point1 = { x: x, y: y };
  const point2 = { x: x + width, y: y + height };
  const points = [point1, point2];
  return points;
};

export const getPerpendicularPoints = (points) => {
  const dx = points[2] - points[0];
  const dy = points[3] - points[1];
  const width = Math.sqrt(dx * dx + dy * dy) / 2;
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitDx = dx / length;
  const unitDy = dy / length;
  const centerX = (points[0] + points[2]) / 2;
  const centerY = (points[1] + points[3]) / 2;
  const perpendicularDx = unitDy * (width / 2);
  const perpendicularDy = -unitDx * (width / 2);
  const p3 = [centerX + perpendicularDx, centerY + perpendicularDy];
  const p4 = [centerX, centerY];
  return [...p3, ...p4];
};
