import React from "react";
import { useDrop } from "react-dnd";

export default function DropSection({
  children,
  dropable = true,
  props,
  styles,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "Player",
    drop: () => ({ props }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (item) => dropable,
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return "rgb(188,251,255)";
      } else if (!canDrop) {
        return "rgb(255,188,188)";
      }
    } else {
      return "";
    }
  };

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: getBackgroundColor(),
        ...styles,
      }}
    >
      {children}
    </div>
  );
}
