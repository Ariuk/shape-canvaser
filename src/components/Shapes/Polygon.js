import React from "react";
import { Layer, Line as KonvaLine } from "react-konva";
import PolygonEdge from "./PolygonEdge";
import { TOOL_NAMES } from "../../util.consts";

export default class Polygon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: props.points?.length > 0 ? props.points : [],
      curMousePos: [0, 0],
      isMouseOverStartPoint: false,
      isFinished: props.points?.length > 0,
    };
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleOnFinishDraw = this.handleOnFinishDraw.bind(this);
    this.unSelect = this.unSelect.bind(this);
    this.shapeRef = React.createRef();
    this.shape = TOOL_NAMES.Polygon;
    this.index = props.index;
  }

  unSelect() {
    this.setState({ selected: false });
  }


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
    const { points } = this.state;
    const index = event.target.index - 1;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    this.setState({
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)],
    });
  };

  handleSelect = (event) => {
    event.cancelBubble = true;
    const { selected } = this.state;
    if (selected) return;
    this.props.onClearSelection(() => this.setState({ selected: true }));
  };

  handleDragEnd = (event) => {
    const { index, onTransform, points } = this.props;
    const distanceX = Math.round(event.target.x());
    const distanceY = Math.round(event.target.y());
    const newPosition = points.map(([x, y]) => [x + distanceX, y + distanceY]);
    onTransform(newPosition, TOOL_NAMES.Polygon, index);
  };

  render() {
    const {
      state: { points, isFinished, curMousePos, selected },
      handleOnMouseOut,
      handleDragMove,
      handleOnFinishDraw,
      handleSelect,
      handleDragEnd,
      shapeRef,
      props,
    } = this;
    
    const flattenedPoints = points
      .concat(isFinished ? [] : curMousePos)
      .reduce((a, b) => a.concat(b), []);

    let lineProps = {
      fill: props.fill,
      strokeWidth: props.strokeWidth,
      stroke: props.stroke,
    };
    if (selected)
      lineProps = {
        ...lineProps,
        shadowColor: "aqua",
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      };
    return (
      <Layer>
        <KonvaLine
          ref={shapeRef}
          onClick={handleSelect}
          points={flattenedPoints}
          draggable
          {...lineProps}
          onDragEnd={handleDragEnd}
          strokeWidth={10}
          stroke="white"
          closed={isFinished}
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
