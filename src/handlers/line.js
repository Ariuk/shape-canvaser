import Tool from "./tool";
import { getArrowPoints, getPerpendicularPoints } from "./utils";

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

export default line;
