import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { CourtActionTypes } from "../redux/actions/courtActions";
import { Court, GameCourt, VirtualCourtMiddle } from "../components/court";
import PlayerCard from "../components/court/PlayerCard";
import { PLAYER_STATUS } from "../utils/players/constants";

export default function Arrange() {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);
  const [courtList, setCourtList] = useState([]);
  const { players } = useSelector((state) => state.players);

  useEffect(() => {
    dispatch({ type: PlayerActionTypes["GET"] });
    dispatch({ type: CourtActionTypes["GET"] });
  }, [dispatch]);

  useEffect(() => {
    setCourtList(courts);
  }, [courts]);

  return (
    <>
      <div className="row gap-2 fixed-bottom p-2 bg-main-light">
        <div>
          <span className="fs-6 fw-bold">準備區</span>
          <div className="player-block  d-flex flex-wrap gap-2">
            {players
              .filter((item) => item.status === PLAYER_STATUS["PREPARE_NEXT"])
              .map((item) => (
                <PlayerCard size="small" player={item} />
              ))}
          </div>
        </div>
        <div>
          <span className="fs-6 fw-bold">休息區</span>
          <div className="player-block d-flex flex-wrap gap-2">
            {players
              .filter((item) => item.status === PLAYER_STATUS["REST"])
              .sort(
                (a, b) => a.count - b.count || (a.time || 0) - (b.time || 0)
              )
              .map((item) => (
                <PlayerCard size="small" player={item} />
              ))}
          </div>
        </div>
        <div>
          <span className="fs-6 fw-bold">暫離區</span>
          <div className="player-block d-flex flex-wrap gap-2">
            {players
              .filter((item) => item.status === PLAYER_STATUS["TEMP_LEAVE"])
              .map((item) => (
                <PlayerCard size="small" player={item} />
              ))}
          </div>
        </div>
      </div>
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
    </>
  );
}
