import React from "react";

export default function Rectangle({
  width = 32,
  height = 32,
  onDragStart,
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
    >
      <svg
        fill="#000000"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22,2H4A1,1,0,0,0,3,3V21a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V3A1,1,0,0,0,22,2ZM21,20H5V4H21Z" />
      </svg>
    </div>
  );
}
