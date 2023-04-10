import React, { useRef, useEffect, useState } from "react";
import { Layer, Transformer, Line as KonvaLine } from "react-konva";

export default function Line(props){
  const {
    fill = "rgba(255,255,255, 0.1)",
    stroke = "white",
    coords = { x: 15, y: 10 },
  } = props;
  const [selected, select] = useState(false);
  const [points, setPoints] = useState([0, 0, 100, 100]);
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);

  useEffect(() => {
    if (selected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selected]);

  const handleSelect = (event) => {
    event.cancelBubble = true;
    select(true);
  };

  const handleDrag = (event) => {
    setPoints([
      event.target.x(),
      event.target.y(),
      event.target.x() + 100,
      event.target.y() + 100,
    ]);
  };
  const handleTransform = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    setPoints([
      node.points()[0] * scaleX,
      node.points()[1] * scaleY,
      node.points()[2] * scaleX,
      node.points()[3] * scaleY,
    ]);
  };

  const boundBoxCallbackForRectangle = (oldBox, newBox) => {
    return newBox;
  };
  return (
    <Layer>
      <KonvaLine
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        points={points}
        ref={shapeRef}
        stroke={stroke}
        strokeWidth={5}
        draggable
        onDragEnd={handleDrag}
        onTransformEnd={handleTransform}
        boundBoxFunc={boundBoxCallbackForRectangle}
      />
      {selected && (
        <Transformer anchorSize={5} borderDash={[6, 2]} ref={transformerRef} />
      )}
    </Layer>
  );
}
