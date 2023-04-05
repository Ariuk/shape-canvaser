const Tool = {
  setGeneralState(startPoint, { fillerColor, circularColor }) {
    this.toolState = {
      ...this.toolState,
      started: true,
      startPoint,
      fillerColor,
      circularColor
    };
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  },

  draw(start, position) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(position.x, position.y);
    this.ctx.stroke();
  },

  onMouseDown() {
    throw new Error("onMouseDown must be implemented.");
  },

  onMouseMove() {
    throw new Error("onMouseMove must be implemented.");
  },

  onMouseUp() {
    throw new Error("onMouseUp must be implemented.");
  },

  createStartPoint(start, radius = 5, circularColor) {
    const circle = new Path2D();
    circle.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    if (this.ctx) {
      this.ctx.fillStyle = circularColor;
      this.ctx.fill(circle);
    }
    return circle;
  },
};

export default Tool;
