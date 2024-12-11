import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { PLAYER_STATUS } from "../utils/players/constants";
import PlayerCard from "../components/court/PlayerCard";
import MoveableItem from "../components/common/MoveableItem";
import DropSection from "../components/common/DropSection";

export const COLUMN_NAMES = {
  DO_IT: "Do it",
  IN_PROGRESS: "In Progress",
  AWAITING_REVIEW: "Awaiting review",
  DONE: "Done",
};

export default function History() {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);

  const [items, setItems] = useState([
    { id: 1, name: "Item 1", column: COLUMN_NAMES["DO_IT"] },
    { id: 2, name: "Item 2", column: COLUMN_NAMES["DO_IT"] },
    { id: 3, name: "Item 3", column: COLUMN_NAMES["DO_IT"] },
    { id: 4, name: "Item 4", column: COLUMN_NAMES["DO_IT"] },
  ]);

  console.log(items);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return coppiedStateArray;
      });
    }
  };

  const returnItemsForColumn = (columnName) => {
    return items
      .filter((item) => item.column === columnName)
      .map((item, index) => (
        <MovableItem
          key={item.id}
          name={item.name}
          currentColumnName={item.column}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));
  };

  const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;

  const onEnd = (item, monitor) => {
    const dropResult = monitor.getDropResult();

    console.log("item", item);
    console.log("dropResult", dropResult);

    if (dropResult) {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["TEMP_LEAVE"],
        },
      });
    }
  };

  return (
    <div className="container d-flex">
      {players
        .filter((item) => item.status === PLAYER_STATUS["REST"])
        .sort((a, b) => a.count - b.count || (a.time || 0) - (b.time || 0))
        .map((item) => (
          <MoveableItem props={item} onEnd={onEnd}>
            <PlayerCard size="small" key={item.id} player={item} />
          </MoveableItem>
        ))}
      <DropSection>
        <div
          style={{
            width: "200px",
            height: "200px",
            border: "1px solid black",
          }}
        >
          {players
            .filter((item) => item.status === PLAYER_STATUS["TEMP_LEAVE"])
            .sort((a, b) => a.count - b.count || (a.time || 0) - (b.time || 0))
            .map((item) => (
              <MoveableItem props={item} onEnd={onEnd}>
                <PlayerCard size="small" key={item.id} player={item} />
              </MoveableItem>
            ))}
        </div>
      </DropSection>
      <Column title={DO_IT} className="column do-it-column">
        {returnItemsForColumn(DO_IT)}
      </Column>
      <Column title={IN_PROGRESS} className="column in-progress-column">
        {returnItemsForColumn(IN_PROGRESS)}
      </Column>
      <Column title={AWAITING_REVIEW} className="column awaiting-review-column">
        {returnItemsForColumn(AWAITING_REVIEW)}
      </Column>
      <Column title={DONE} className="column done-column">
        {returnItemsForColumn(DONE)}
      </Column>
    </div>
  );
}

const Column = ({ children, className, title }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "Our first type",
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    // Override monitor.canDrop() function
    canDrop: (item) => {
      const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
      const { currentColumnName } = item;
      return (
        currentColumnName === title ||
        (currentColumnName === DO_IT && title === IN_PROGRESS) ||
        (currentColumnName === IN_PROGRESS &&
          (title === DO_IT || title === AWAITING_REVIEW)) ||
        (currentColumnName === AWAITING_REVIEW &&
          (title === IN_PROGRESS || title === DONE)) ||
        (currentColumnName === DONE && title === AWAITING_REVIEW)
      );
    },
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
      className={className}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <p>{title}</p>
      {children}
    </div>
  );
};

const MovableItem = ({
  name,
  index,
  currentColumnName,
  moveCardHandler,
  setItems,
}) => {
  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          column: e.name === currentItem.name ? columnName : e.column,
        };
      });
    });
  };

  const onEnd = (item, monitor) => {
    const dropResult = monitor.getDropResult();
    console.log("dropResult", dropResult);

    if (dropResult) {
      const { name } = dropResult;
      const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
      switch (name) {
        case IN_PROGRESS:
          changeItemColumn(item, IN_PROGRESS);
          break;
        case AWAITING_REVIEW:
          changeItemColumn(item, AWAITING_REVIEW);
          break;
        case DONE:
          changeItemColumn(item, DONE);
          break;
        case DO_IT:
          changeItemColumn(item, DO_IT);
          break;
        default:
          break;
      }
    }
  };

  return M({
    index,
    name,
    currentColumnName,
    onEnd,
    children: <>{name}</>,
  });
};

const M = ({ index, name, currentColumnName, onEnd, children }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "Our first type",
  });

  const [{ isDragging }, drag] = useDrag({
    item: { index, name, currentColumnName, type: "Our first type" },
    end: onEnd,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }}>
      {children}
    </div>
  );
};
