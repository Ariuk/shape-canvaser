import React from "react";
import Line from "../handlers/line";
import Polygon from "../handlers/polygon";
import Rectangle from "../handlers/rectangle";
import {
  toolNames,
  convertToObject,
  getArrowPoints,
  getPerpendicularPoints,
} from "../handlers/utils";

const tools = {
  Line,
  Polygon,
  Rectangle,
};

class Canvaser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const { fillerColor, strokeColor, lineWidth, initialData, imgSrc } =
      this.props;
    this.ctx = this.canvasRef.current.getContext("2d");
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillStyle = fillerColor;
    this.ctx.lineWidth = lineWidth;

    if (initialData && imgSrc) {
      this.loadDraw(initialData);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tool !== this.props.tool) {
      if (this.props.tool) {
        this.tool = tools[this.props.tool];
        this.tool.ctx = this.ctx;
      }
    }
    if (prevProps.imgSrc !== this.props.imgSrc) {
      this.loadDraw(this.props.initialData);
    }
  }

  onMouseDown = (event) => {
    const { fillerColor, circularColor } = this.props;
    if (this.tool) {
      this.tool.onMouseDown(this.getCursorPosition(event), {
        fillerColor,
        circularColor,
      });
    }
  };

  onMouseMove = (event) => {
    const { tool } = this.props;
    if (this.tool) {
      this.tool.onMouseMove(
        this.getCursorPosition(event),
        tool === toolNames.POLYGON
          ? (polygonData) => {
              this.tool = null;
            }
          : {}
      );
    }
  };

  onMouseUp = (event) => {
    const { tool, onDataUpdate } = this.props;
    if (this.tool) {
      const newData = this.tool.onMouseUp(this.getCursorPosition(event));
      if (tool === toolNames.POLYGON) return;
      this.tool = null;
      onDataUpdate({ [tool]: newData });
    }
  };

  getCursorPosition = (event) => {
    const { top, left } = this.canvasRef.current.getBoundingClientRect();
    return {
      x: Math.round(event.clientX - left),
      y: Math.round(event.clientY - top),
    };
  };

  loadDraw = (data) => {
    this.ctx.clearRect(
      0,
      0,
      this.canvasRef.current.width,
      this.canvasRef.current.height
    );
    const shapeNames = !!data ? Object.keys(data) : [];
    shapeNames.forEach((key) => {
      this.tool = tools[key];
      this.tool.ctx = this.ctx;
      if (key === "Line" || key === "Rectangle") {
        data[key].forEach((points) => {
          const objectivePoints = convertToObject(points);
          this.tool.draw(objectivePoints[0], objectivePoints[1]);
          if (key === "Line") {
            const data = [points[0], points[1]];
            const perpendicularData = getPerpendicularPoints(data, 10);
            const arrowData = getArrowPoints(
              perpendicularData[0],
              perpendicularData[1],
              20
            );
            this.tool.draw(perpendicularData[0], perpendicularData[1]);
            this.tool.draw(arrowData[1], arrowData[0]);
            this.tool.draw(arrowData[1], arrowData[2]);
          }
        });
      } else {
        data[key].forEach((points) => {
          convertToObject(points).forEach((point, index, array) => {
            const nextPoint = array[index + 1] || array[0];

            if (nextPoint) {
              this.tool.draw(point, nextPoint);
            }
          });
        });
      }
    });
    this.tool = null;
  };

  render() {
    const { width, height, imgSrc } = this.props;
    return (
      <React.Fragment>
        <canvas
          tabIndex="1"
          ref={this.canvasRef}
          width={width}
          height={height}
          style={{
            color: "yellow",
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: "cover",
          }}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        />
      </React.Fragment>
    );
  }
}

Canvaser.propTypes = {};

Canvaser.defaultProps = {
  width: 300,
  height: 300,
  lineWidth: 2,
  color: "#FFFFFF",
  fillerColor: "rgba(255,255,255, 0.1)",
  circularColor: "red",
  strokeColor: "white",
};

export default Canvaser;
