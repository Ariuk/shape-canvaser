import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Layer, Transformer, Line as KonvaLine } from "react-konva";

import { TOOL_NAMES } from "../../util.consts";

const Line = forwardRef((props, ref) => {
  const { onTransform, index, onClearSelection, ...rest } = props;
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
    shape: TOOL_NAMES.Line,
  }));

  const { points } = rest;

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

  const handleDragEnd = (event) => {
    const distanceX = Math.round(event.target.x());
    const distanceY = Math.round(event.target.y());
    const newPosition = [
      [points[0] + distanceX, points[1] + distanceY],
      [points[2] + distanceX, points[3] + distanceY],
    ];
    onTransform(newPosition, TOOL_NAMES.Line, index);
  };

  const handleTransform = () => {
    const node = shapeRef.current;
    const scaleX = Math.round(node.scaleX());
    const scaleY = Math.round(node.scaleY());
    const newPosition = [
      [
        Math.round(node.x()) + node.points()[0] * scaleX,
        Math.round(node.y()) + node.points()[1] * scaleY,
      ],
      [
        Math.round(node.x()) + node.points()[2] * scaleX,
        Math.round(node.y()) + node.points()[3] * scaleY,
      ],
    ];
    onTransform(newPosition, TOOL_NAMES.Line, index);
  };

  return (
    <Layer style={{ backgroundColor: "orange" }} ref={layerRef}>
      <KonvaLine
        onClick={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        draggable
        lineCap="round"
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
        {...rest}
      />
      {selected && (
        <Transformer anchorSize={5} borderDash={[6, 2]} ref={transformerRef} />
      )}
    </Layer>
  );
});

export default Line;
