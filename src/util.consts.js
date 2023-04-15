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
  const point2 = { x: x+width, y: y+height };
  const points = [point1, point2];
  return points;
};
