import Tool from "./tool";

const rectangle = { ...Tool };

rectangle.name = "Rectangle";

rectangle.onMouseDown = function onMouseDown(startPoint, options) {
  this.setGeneralState(startPoint, options);
};

rectangle.draw = function draw(start, position) {
  this.ctx.fillRect(
    start.x,
    start.y,
    position.x - start.x,
    position.y - start.y
  );
  this.ctx.strokeRect(
    start.x,
    start.y,
    position.x - start.x,
    position.y - start.y
  );
};

rectangle.onMouseMove = function onMouseMove(position) {
  if (!this.toolState) return;
  this.ctx.putImageData(this.imageData, 0, 0);
  this.draw(this.toolState.startPoint, position);
};

rectangle.onMouseUp = function onMouseUp(position) {
  if (!this.toolState) return;
  const data = [
    [this.toolState.startPoint.x, this.toolState.startPoint.y],
    [position.x, position.y],
  ];
  return data;
};

export default rectangle;
