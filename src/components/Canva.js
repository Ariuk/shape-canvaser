import React, { useRef } from "react";
import { Layer, Stage, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Polygon, Line, Rectangle } from "./Shapes";

export default function Canva(props) {
  const { imgSrc, tool } = props;
  const [image] = useImage(imgSrc);
  const polygonRef = useRef(null);

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

  return (
    <Stage
      {...props}
      onClick={() => {
        console.log("clicked");
      }}
      onMouseDown={handleClick}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        <KonvaImage image={image} {...props} />
      </Layer>
      {tool === "Polygon" && <Polygon ref={polygonRef} />}
      {tool === "Line" && <Line {...props} />}
      {tool === "Rectangle" && <Rectangle {...props} />}
    </Stage>
  );
}
