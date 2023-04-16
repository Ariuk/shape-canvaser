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

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Get the original points of the shape
    const originalPoints = node.points();

    // Calculate the new positions of the points after transformation
    const newPoints = originalPoints.map((point, index) => {
      // Check if the index is even (x coordinate)
      if (index % 2 === 0) {
        return Math.round(node.x() + point * scaleX);
      }
      // Check if the index is odd (y coordinate)
      else {
        return Math.round(node.y() + point * scaleY);
      }
    });
    onTransform(
      [
        [newPoints[0], newPoints[1]],
        [newPoints[2], newPoints[3]],
      ],
      TOOL_NAMES.Line,
      index
    );
  };

  const handleTransformStart = () => {
    const node = shapeRef.current;
    node.setAttrs({
      strokeWidth: 1,
    });
  };

  return (
    <Layer style={{ backgroundColor: "orange" }} ref={layerRef}>
      <KonvaLine
        onClick={handleSelect}
        ref={shapeRef}
        draggable
        lineCap="round"
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

export default Line;
