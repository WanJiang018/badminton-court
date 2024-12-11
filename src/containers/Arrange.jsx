import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import MultiBackend, {
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { CourtActionTypes } from "../redux/actions/courtActions";
import { Court, GameCourt, VirtualCourtMiddle } from "../components/court";
import PlayerPanel from "../components/court/PlayerPanel";
import { DndActionTypes } from "../redux/actions/dndActions";

export default function Arrange() {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);
  const [courtList, setCourtList] = useState([]);

  const CustomHTML5toTouch = {
    backends: [
      {
        backend: HTML5Backend,
        transition: MouseTransition,
      },
      {
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        transition: TouchTransition,
        skipDispatchOnTransition: true,
      },
    ],
  };

  useEffect(() => {
    dispatch({ type: PlayerActionTypes["GET"] });
    dispatch({ type: CourtActionTypes["GET"] });
  }, [dispatch]);

  useEffect(() => {
    setCourtList(courts);
  }, [courts]);

  return (
    <DndProvider backend={MultiBackend} options={CustomHTML5toTouch}>
      <div className="row row-cols-1 row-cols-lg-3 g-4 g-lg-4">
        {courtList?.map((number) => (
          <div key={number} className="col">
            <GameCourt number={number} />
          </div>
        ))}
        <div className="col">
          <Court middle={<VirtualCourtMiddle />} virtual />
        </div>
      </div>
      <PlayerPanel />
    </DndProvider>
  );
}
