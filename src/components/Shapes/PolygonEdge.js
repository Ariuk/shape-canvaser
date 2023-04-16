import React from "react";
import { Rect as PolygonRectangle } from "react-konva";

export default function PolygonEdge(props) {
  return <PolygonRectangle {...props} {...props.shapeProps} draggable />;
}
