import React from "react";
import { Layer, Line as KonvaLine, Rect } from "react-konva";
import PolygonEdge from "./PolygonEdge";

export default class Polygon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
      curMousePos: [0, 0],
      isMouseOverStartPoint: false,
      isFinished: false,
    };
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleOnFinishDraw = this.handleOnFinishDraw.bind(this);
  }

  componentDidMount() {
    console.log(window.innerHeight);
  }

  getMousePos = (stage) => {
    return [
      Math.round(stage.getPointerPosition().x),
      Math.round(stage.getPointerPosition().y),
    ];
  };

  handleOnFinishDraw(event) {
    const { points, isFinished } = this.state;
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    this.setState({
      isMouseOverStartPoint: true,
    });
  }

  handleOnMouseOut = (event) => {
    event.target.scale({ x: 1, y: 1 });
  };

  handleDragMove = (event) => {
    const {points } = this.state;
    const index = event.target.index - 1;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    this.setState({
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)],
    });
  };

  render() {
    const {
      state: { points, isFinished, curMousePos },
      handleOnMouseOut,
      handleDragMove,
      handleOnFinishDraw,
    } = this;

    const flattenedPoints = points
      .concat(isFinished ? [] : curMousePos)
      .reduce((a, b) => a.concat(b), []);
    return (
      <Layer>
        <KonvaLine
          points={flattenedPoints}
          stroke="white"
          fill="rgba(255,255,255, 0.1)"
          strokeWidth={5}
          closed={isFinished}
          draggable
        />
        {!isFinished &&
          points.map((point, index) => {
            const width = 6;
            const x = point[0] - width / 2;
            const y = point[1] - width / 2;
            let edgeProps = {
              x,
              y,
              width,
              height: width,
              shapeProps: { fill: "white", stroke: "black", strokeWidth: 3 },
            };
            if (index === 0) {
              edgeProps.onMouseOver = handleOnFinishDraw;
              edgeProps.onMouseOut = handleOnMouseOut;
              edgeProps.hitStrokeWidth = 12;
            }
            return (
              <PolygonEdge
                key={index}
                {...edgeProps}
                onDragMove={handleDragMove}
              />
            );
          })}
      </Layer>
    );
  }
}
