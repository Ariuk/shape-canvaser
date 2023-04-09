export const toolNames = {
  LINE: "Line",
  POLYGON: "Polygon",
  RECTANGLE: "Rectangle",
};

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

export const getPerpendicularPoints = (points) => {
  const [p1, p2] = points;
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const width = Math.sqrt(dx * dx + dy * dy) / 2;
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitDx = dx / length;
  const unitDy = dy / length;
  const centerX = (p1[0] + p2[0]) / 2;
  const centerY = (p1[1] + p2[1]) / 2;

  const perpendicularDx = unitDy * (width / 2);
  const perpendicularDy = -unitDx * (width / 2);

  const p3 = {
    x: centerX + perpendicularDx,
    y: centerY + perpendicularDy,
  };

  const p4 = {
    x: centerX,
    y: centerY,
  };

  return [p3, p4];
};

export const getArrowPoints = (start, end, size) => {
  const angle = Math.atan2(start.y - end.y, start.x - end.x);
  const x1 = start.x - size * Math.cos(angle - Math.PI / 6);
  const y1 = start.y - size * Math.sin(angle - Math.PI / 6);
  const x2 = start.x - size * Math.cos(angle + Math.PI / 6);
  const y2 = start.y - size * Math.sin(angle + Math.PI / 6);

  return [{ x: x1, y: y1 }, start, { x: x2, y: y2 }];
};
