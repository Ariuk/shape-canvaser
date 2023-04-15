import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Layer, Rect as KonvaRectangle, Transformer } from "react-konva";

import {
  getPointsFromRectangularPositionAndSize,
  convertToArray,
  TOOL_NAMES,
} from "../../util.consts";

const Rectangle = forwardRef((props, ref) => {
  const { onTransform, index, onClearSelection, ...rest } = props;
  const { width, height } = rest;
  const [selected, select] = useState(false);
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);
  const layerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    unSelect: () => {
      select(false);
    },
    selected,
    index,
    shape: TOOL_NAMES.Rectangle,
  }));

  useEffect(() => {
    if (selected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selected]);

  const handleSelect = (event) => {
    event.cancelBubble = true;
    if (selected) return;
    onClearSelection(() => select(true));
  };

  const handleDragStart = (event) => {
    event.cancelBubble = true;
    if (selected) return;
    onClearSelection(() => select(true));
  };

  const handleDragEnd = (event) => {
    const data = {
      x: event.target.x(),
      y: event.target.y(),
      width,
      height,
    };
    onTransform(
      convertToArray(getPointsFromRectangularPositionAndSize(data)),
      TOOL_NAMES.Rectangle,
      index
    );
  };

  const handleTransform = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const data = {
      x: node.x(),
      y: node.y(),
      width: node.width() * scaleX,
      height: node.height() * scaleY,
    };
    onTransform(
      convertToArray(getPointsFromRectangularPositionAndSize(data)),
      TOOL_NAMES.Rectangle,
      index
    );
  };

  const handleTransformStart = () => {
    const node = shapeRef.current;
    node.setAttrs({
      strokeWidth:1,
    });
  };

  return (
    <Layer ref={layerRef}>
      <KonvaRectangle
        onClick={handleSelect}
        onDragStart={handleDragStart}
        ref={shapeRef}
        draggable
        onDragEnd={handleDragEnd}
        onTransformStart={handleTransformStart}
        onTransformEnd={handleTransform}
        {...rest}
      />
      {selected && (
        <Transformer anchorSize={5} borderDash={[6, 2]} ref={transformerRef} />
      )}
    </Layer>
  );
});

export default Rectangle;
