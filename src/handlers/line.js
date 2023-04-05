import Tool from "./tool";
export const LINE = "Line";

const line = { ...Tool };

line.name = "Line";

line.onMouseDown = function onMouseDown(startPoint, options) {
  this.setGeneralState(startPoint, options);
};

line.onMouseMove = function onMouseMove(position) {
  if (!this.toolState || !this.toolState.started) return;
  this.ctx.putImageData(this.imageData, 0, 0);
  this.draw(this.toolState.startPoint, position);
};

line.onMouseUp = function onMouseUp(position) {
  if (!this.toolState) return;
  const data = [
    [this.toolState.startPoint.x, this.toolState.startPoint.y],
    [position.x, position.y],
  ];
  const perpendicularData = getPerpendicularPoints(data, 10);
  const arrowData = getArrowPoints(
    perpendicularData[0],
    perpendicularData[1],
    20
  );
  this.draw(perpendicularData[0], perpendicularData[1]);
  this.draw(arrowData[1], arrowData[0]);
  this.draw(arrowData[1], arrowData[2]);
  return data;
};

const getPerpendicularPoints = (points) => {
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

const getArrowPoints = (start, end, size) => {
  const angle = Math.atan2(start.y - end.y, start.x - end.x);
  const x1 = start.x - size * Math.cos(angle - Math.PI / 6);
  const y1 = start.y - size * Math.sin(angle - Math.PI / 6);
  const x2 = start.x - size * Math.cos(angle + Math.PI / 6);
  const y2 = start.y - size * Math.sin(angle + Math.PI / 6);

  return [{ x: x1, y: y1 }, start, { x: x2, y: y2 }];
};

export default line;
