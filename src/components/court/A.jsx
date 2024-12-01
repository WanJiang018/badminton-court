import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDraggable,
  useDroppable,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import PlayerCard from "./PlayerCard";

export default function A() {
  const { players } = useSelector((state) => state.players);
  const containers = ["0", "1", "2", "3"];
  const [parent, setParent] = useState("0");
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {!parent && (
        <Draggable key={players[0]?.id} id={players[0]?.id}>
          <div
            style={{
              filter:
                isDragging && activeId === players[0]?.id
                  ? "opacity(0.5)"
                  : "none",
            }}
          >
            <PlayerCard player={players[0]} />
          </div>
        </Draggable>
      )}
      {containers.map((id) => (
        <Droppable key={id} id={id}>
          <div
            style={{
              width: "100px",
              height: "50px",
              border: "1px solid",
            }}
          >
            {parent === id && (
              <Draggable key={players[0]?.id} id={players[0]?.id}>
                <div
                  style={{
                    filter:
                      isDragging && activeId === players[0]?.id
                        ? "opacity(0.5)"
                        : "none",
                  }}
                >
                  <PlayerCard player={players[0]} />
                </div>
              </Draggable>
            )}
          </div>
        </Droppable>
      ))}
    </DndContext>
  );

  function handleDragStart(event) {
    setIsDragging(true);
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { over } = event;
    setParent(over ? over.id : null);
    setIsDragging(false);
    setActiveId(null);
  }
}

export function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    background: isOver ? "#d6d485" : undefined,
    width: "fit-content",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

// function Draggable(props) {
//   const { attributes, listeners, setNodeRef } = useDraggable({
//     id: props.id,
//   });

//   return (
//     <div ref={setNodeRef} {...listeners} {...attributes}>
//       {props.children}
//     </div>
//   );
// }

// function Droppable(props) {
//   const { isOver, setNodeRef } = useDroppable({
//     id: "droppable",
//   });
//   const style = {
//     color: isOver ? "green" : undefined,
//     width: "100px",
//     height: "100px",
//     border: "1px solid",
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       {props.children}
//     </div>
//   );
// }
