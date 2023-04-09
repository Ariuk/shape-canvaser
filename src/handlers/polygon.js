import Tool from "./tool";

const polygon = { ...Tool };

polygon.name = "Polygon";

polygon.onMouseDown = function onMouseDown(startPoint, options) {
  if (!this.toolState) {
    this.toolState = {
      initialCircle: this.createStartPoint(
        startPoint,
        5,
        options.circularColor
      ),
      pathData: [],
    };
  }
  this.setGeneralState(startPoint, options);
};

polygon.onMouseMove = function onMouseMove(position, callback) {
  if (!this.toolState) return;
  this.ctx.putImageData(this.imageData, 0, 0);
  this.draw(this.toolState.startPoint, position);
  if (
    this.ctx.isPointInPath(
      this.toolState.initialCircle,
      position.x,
      position.y
    ) &&
    this.toolState.pathData.length >= 3
  ) {
    this.fillGeometry(this.toolState.pathData);
    callback(this.toolState.pathData);
  }
};

polygon.fillGeometry = function fillGeometry(pathData) {
  const path = new Path2D();
  const startPoint = pathData[0][0];
  path.moveTo(startPoint[0], startPoint[1]);
  pathData.forEach((el, index) => {
    if (pathData[index + 1]) {
      path.lineTo(pathData[index + 1][0], pathData[index + 1][1]);
    } else {
      path.lineTo(pathData[0][0], pathData[0][1]);
    }
  });
  this.ctx.fillStyle = this.toolState.fillerColor;
  this.ctx.fill(path);
};

polygon.onMouseUp = function onMouseUp() {
  if (!this.toolState) return;
  const data = [this.toolState.startPoint.x, this.toolState.startPoint.y];
  this.toolState.pathData.push(data);
};

export default polygon;
