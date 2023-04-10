import React, { useRef, useEffect, useState } from "react";
import {
    Layer, Rect as KonvaRectangle,
    Transformer
} from "react-konva";

export default function Rectangle(props){
    const {
      fill = "rgba(255,255,255, 0.1)",
      stroke = "white",
      coords = { x: 15, y: 10 },
    } = props;
    const [selected, select] = useState(false);
    const [coordinates, setCoordinates] = useState(coords);
    const [sizes, setSizes] = useState({ width: 150, height: 100 });
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
      setCoordinates({ x: event.target.x(), y: event.target.y() });
    };
  
    const handleTransform = (editor) => {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
  
      setCoordinates({ x: node.x(), y: node.y() });
  
      setSizes({
        width: node.width() * scaleX,
        height: node.height() * scaleY,
      });
    };
  
    const boundBoxCallbackForRectangle = (oldBox, newBox) => {
      return newBox;
    };
    return (
      <Layer>
        <KonvaRectangle
          onClick={handleSelect}
          onTap={handleSelect}
          onDragStart={handleSelect}
          ref={shapeRef}
          {...sizes}
          fill={fill}
          stroke={stroke}
          rotation={0}
          {...coordinates}
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
  };
  