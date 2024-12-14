import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import MultiBackend, {
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { CourtActionTypes } from "../redux/actions/courtActions";
import { PLAYER_STATUS } from "../utils/players/constants";
import { Court, GameCourt, VirtualCourtMiddle } from "../components/court";
import PlayerPanel from "../components/court/PlayerPanel";

export default function Arrange() {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);
  const { players } = useSelector((state) => state.players);
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

  const handleClean = () => {
    const userConfirmed = window.confirm("確定要結束排場嗎?");
    if (userConfirmed) {
      dispatch({ type: PlayerActionTypes["CLEAN_ALL_STATUS"] });
    }
  };

  useEffect(() => {
    dispatch({ type: PlayerActionTypes["GET"] });
    dispatch({ type: CourtActionTypes["GET"] });
  }, [dispatch]);

  useEffect(() => {
    setCourtList(courts);
  }, [courts]);

  useEffect(() => {
    players
      .filter((item) => item.status === PLAYER_STATUS["REST"] && !item.time)
      .forEach((item, _index) => {
        dispatch({
          type: PlayerActionTypes["UPDATE"],
          payload: {
            ...item,
            time: new Date().getTime(),
          },
        });
      });
  }, [dispatch, players]);

  return (
    <DndProvider backend={MultiBackend} options={CustomHTML5toTouch}>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-danger" onClick={handleClean}>
          結束排場
        </button>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 g-lg-4">
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
