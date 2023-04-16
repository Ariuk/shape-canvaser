import React, { useRef, useCallback, useState } from "react";
import { Layer, Stage, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import {
  getRectangularPositionAndSize,
  getPointsFromRectangularPositionAndSize,
  convertToArray,
  TOOL_NAMES,
} from "../util.consts";

import Controller from "./Controller";
import { Polygon, Line, Rectangle } from "./Shapes";

const Canva = (props) => {
  const stageRef = useRef(null);
  const {
    imgSrc,
    isLineSelected,
    height,
    width,
    onAddRectangle,
    source,
    onDelete,
    ...shapeProps
  } = props;

  const rectangleStartData = useRef(null);
  const myRefs = useRef([]);
  const [image] = useImage(imgSrc);
  const polygonRef = useRef(null);
  const [toolIndex, setToolIndex] = useState(-1);

  const handleClick = (event) => {
    if (!polygonRef.current) return;
    const {
      state: { points, isMouseOverStartPoint, isFinished },
      getMousePos,
    } = polygonRef.current;
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) {
      polygonRef.current.setState({
        isFinished: true,
      });
    } else {
      polygonRef.current.setState({
        points: [...points, mousePos],
      });
    }
  };
  const handleMouseMove = (event) => {
    if (!polygonRef.current) return;
    const { getMousePos } = polygonRef.current;
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    polygonRef.current.setState({
      curMousePos: mousePos,
    });
  };

  const handleDrop = useCallback((event) => {
    if (rectangleStartData.current) {
      const { offsetX, offsetY, clientWidth, clientHeight } = JSON.parse(
        rectangleStartData.current
      );
      stageRef.current.setPointersPositions(event);

      const coords = stageRef.current.getPointerPosition();
      const data = {
        x: coords.x - offsetX,
        y: coords.y - offsetY,
        width: clientWidth,
        height: clientHeight,
      };
      onAddRectangle(
        convertToArray(getPointsFromRectangularPositionAndSize(data))
      );
    }
  }, []);

  const handleDragOver = (event) => event.preventDefault();

  const handleDragStart = (event) => {
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    const clientWidth = event.target.clientWidth;
    const clientHeight = event.target.clientHeight;

    rectangleStartData.current = JSON.stringify({
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
    });
  };

  const handleOnDelete = () => {
    const indexRef = myRefs.current.findIndex((ref) => ref.selected);
    if (indexRef !== -1) {
      const { unSelect, shape, index } = myRefs.current[indexRef];
      typeof unSelect === "function" && unSelect();
      onDelete(shape, index);
    }
  };

  const clearSelection = (callback) => {
    myRefs.current?.forEach(
      (ref) => typeof ref?.unSelect === "function" && ref.unSelect()
    );
    typeof callback === "function" && callback();
  };

  const handleOnSelectTool = (index) => {
    setToolIndex(index);
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <Controller
        onClear={handleOnDelete}
        onSelect={handleOnSelectTool}
        selectedIndex={toolIndex}
        onDragStart={handleDragStart}
      />
      <Stage
        ref={stageRef}
        onClick={clearSelection}
        onMouseDown={handleClick}
        height={height}
        width={width}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <KonvaImage image={image} height={height} width={width} />
        </Layer>
        {Object.keys(source).map((key) =>
          source[key].map((points, index) => {
            const randomKey = Math.random();
            switch (key) {
              default:
                break;
              case TOOL_NAMES.Line:
                return (
                  <Line
                    points={[...points[0], ...points[1]]}
                    key={`${TOOL_NAMES.Line}-${randomKey}`}
                    index={index}
                    onClearSelection={clearSelection}
                    ref={(ref) => {
                      renewRef(myRefs.current, ref);
                    }}
                    {...shapeProps}
                    height={height}
                    width={width}
                  />
                );
              case TOOL_NAMES.Rectangle:
                return (
                  <Rectangle
                    {...getRectangularPositionAndSize(points)}
                    index={index}
                    key={`${Rectangle}-${randomKey}`}
                    onClearSelection={clearSelection}
                    ref={(ref) => {
                      renewRef(myRefs.current, ref);
                    }}
                    {...shapeProps}
                  />
                );
            }
          })
        )}
        {TOOL_NAMES.Polygon === Object.values(TOOL_NAMES)[toolIndex] && (
          <Polygon ref={polygonRef} />
        )}
      </Stage>
    </div>
  );
};

Canva.defaultProps = {
  fill: "rgba(255, 0, 0, 0.1)",
  stroke: "white",
  strokeWidth: 10,
};

export default Canva;

function renewRef(refArray, ref) {
  if (!ref) return;
  if (refArray.length === 0) {
    refArray.push(ref);
    return;
  }
  const { index, shape } = ref;
  const indexRef = refArray.findIndex(
    (ref) => ref.index === index && ref.shape === shape
  );
  if (indexRef > -1) {
    refArray[indexRef] = ref;
  } else {
    refArray.push(ref);
  }
}
