import Tool from "./tool";
export const LINE = "Line";

const line = { ...Tool };

line.name = "Line";

line.onMouseDown = function onMouseDown(start, options) {
  this.ctx.strokeStyle = "#FFFFFF";
  this.setInitSettings({ start, options });
  if (!this.state.data) {
    // get the start point on mouse down
    // TODO: it is not the best solution
    // revisit later
    this.state.firstMouseDown = start;
    this.state.data = [];
  }
};

line.onMouseMove = function onMouseMove(position) {
  if (!this.state || !this.state.started) return;
  this.ctx.putImageData(this.imageData, 0, 0);
  this.draw(this.state.start, position);
};

// see #3
// Change mechanism to draw line
line.onMouseUp = function onMouseUp(position, callback) {
  if (!this.state) return;
  // NOTE: This state data is just to avoid draw in
  // the first mouse up
  this.state.data.push([position.x, position.y]);
  if (this.state.data.length > 1) {
    const data = [
      [this.state.firstMouseDown.x, this.state.firstMouseDown.y],
      [position.x, position.y],
    ];
    const perpendicularData = getPerpendicularPoints(data, 10);
    const arrowData = getArrowPoints(
      perpendicularData[0],
      perpendicularData[1],
      20
    );
    const start = this.state.start;
    const options = this.state.options;
    this.drawCrossDirection(this.state.data, 10);
    this.draw(perpendicularData[0], perpendicularData[1]);
    this.draw(arrowData[1], arrowData[0]);
    this.draw(arrowData[1], arrowData[2]);
    //this.drawCrossDirection(perpendicularData, 10);
    this.resetState();
    callback();
    return {
      data: data,
      canvas: {
        start,
        end: position,
        options,
      },
    };
  }
};

function getCrossPath(point, size) {
  const path = new Path2D();
  const startHorizontalLine = { x: point.x - size, y: point.y };
  const endHorizontalLine = { x: point.x + size, y: point.y };
  const startVerticalLine = { x: point.x, y: point.y - size };
  const endVerticalLine = { x: point.x, y: point.y + size };

  path.moveTo(startHorizontalLine.x, startHorizontalLine.y);
  path.lineTo(endHorizontalLine.x, endHorizontalLine.y);
  path.moveTo(startVerticalLine.x, startVerticalLine.y);
  path.lineTo(endVerticalLine.x, endVerticalLine.y);
  return path;
}

/* Xt = (X1+X2)/2 + M * sign(Y2-Y1)
Yt = (Y1+Y2)/2 - M * sign(X2-X1) */
line.drawCrossDirection = function (points, pixelDistance) {
  const x1 = points[0][0];
  const x2 = points[1][0];
  const y1 = points[0][1];
  const y2 = points[1][1];

  const xCoord = (x1 + x2) / 2 + pixelDistance * Math.sign(y2 - y1);
  const yCoord = (y1 + y2) / 2 - pixelDistance * Math.sign(x2 - x1);

  const crossPath = getCrossPath({ x: xCoord, y: yCoord }, 6);
  this.ctx.strokeStyle = "#ff0000";
  this.ctx.stroke(crossPath);
  this.ctx.strokeStyle = "#FFFFFF";
};

export default line;

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
