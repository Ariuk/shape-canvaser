import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Layer, Transformer, Line as KonvaLine } from "react-konva";

import { TOOL_NAMES } from "../../util.consts";

const Line = forwardRef((props, ref) => {
  const {
    onTransform,
    index,
    onClearSelection,
    points: poinsProp,
    ...rest
  } = props;
  const [selected, select] = useState(false);
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);
  const layerRef = useRef(null);

  const [points, setPoints] = useState(poinsProp?.flat(1));

  useImperativeHandle(ref, () => ({
    unSelect: () => {
      select(false);
    },
    selected,
    index,
    shape: TOOL_NAMES.Line,
    setPoints,
    points,
  }));

  useEffect(() => {
    if (selected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selected]);

  const handleSelect = useCallback(
    (event) => {
      event.cancelBubble = true;
      if (selected) return;
      onClearSelection(() => select(true));
    },
    [onClearSelection, selected]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const distanceX = Math.round(event.target.x());
      const distanceY = Math.round(event.target.y());
      const newPosition = [
        [poinsProp[0] + distanceX, poinsProp[1] + distanceY],
        [poinsProp[2] + distanceX, poinsProp[3] + distanceY],
      ];
      onTransform(newPosition, TOOL_NAMES.Line, index);
    },
    [index, onTransform, poinsProp]
  );

  const handleTransform = useCallback(() => {
    const node = shapeRef.current;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    // Get the original points of the shape
    const originalPoints = node.points();

    // Convert the rotation angle from degrees to radians
    const rotationRad = (rotation * Math.PI) / 180;

    // Calculate the cosine and sine of the rotation angle
    const cosTheta = Math.cos(rotationRad);
    const sinTheta = Math.sin(rotationRad);

    // Calculate the new positions of the points after transformation
    const newPoints = originalPoints.map((point, index) => {
      // Check if the index is even (x coordinate)
      if (index % 2 === 0) {
        return Math.round(
          node.x() + (cosTheta * point - sinTheta * point) * scaleX
        );
      }
      // Check if the index is odd (y coordinate)
      else {
        return Math.round(
          node.y() + (sinTheta * point + cosTheta * point) * scaleY
        );
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
  }, [index, onTransform]);

  const handleTransformStart = useCallback(() => {
    const node = shapeRef.current;
    node.setAttrs({
      strokeWidth: 5,
    });
  }, []);

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
        points={points}
        {...rest}
        strokeWidth={10}
        stroke="white"
      />
      {selected && (
        <Transformer anchorSize={5} borderDash={[6, 2]} ref={transformerRef} />
      )}
    </Layer>
  );
});

export default Line;
