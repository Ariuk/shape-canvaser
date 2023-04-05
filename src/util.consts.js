export const DRAW_TOOLS = ["Line", "Polygon", "Rectangle"];

export const convertToArray = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    result.push([obj.x, obj.y]);
  }
  return result;
};

export const convertToObject = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const innerArr = arr[i];
    const obj = { x: innerArr[0], y: innerArr[1] };
    result.push(obj);
  }
  return result;
};
