import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import { PlayerActionTypes } from "../../redux/actions/playerActions";

export default function MoveableItem({ children, props }) {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "Player",
  });

  const onEnd = (item, monitor) => {
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      const { props } = dropResult;
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          ...props,
        },
      });
    }
  };

  const [{ isDragging }, drag] = useDrag({
    item: { ...props, type: "Player" },
    end: onEnd,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.4 : 1 }}>
      {children}
    </div>
  );
}
