import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { PLAYER_STATUS } from "../../utils/players/constants";

export default function MoveableItem({ children, props: playerProps }) {
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
          ...(playerProps?.status === PLAYER_STATUS["GAME"] &&
            (props?.status === PLAYER_STATUS["REST"] ||
              props?.status === PLAYER_STATUS["TEMP_LEAVE"]) && {
              time: new Date().getTime(),
            }),
        },
      });
    }
  };

  const [{ isDragging }, drag] = useDrag({
    item: { ...playerProps, type: "Player" },
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
