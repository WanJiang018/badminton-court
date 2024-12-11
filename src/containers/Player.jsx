import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { isActiveStatus } from "../utils/players/functions";
import PlayerTable from "../components/player/PlayerTable";

export default function Player() {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const [playerList, setPlayerList] = useState([]);

  const activePlayers = useMemo(
    () => playerList.filter((item) => isActiveStatus(item.status)),
    [playerList]
  );

  const handleCreate = () => {
    dispatch({ type: PlayerActionTypes["CREATE"] });
  };

  const handleClean = () => {
    const userConfirmed = window.confirm("確定要清除嗎?");
    if (userConfirmed) {
      dispatch({ type: PlayerActionTypes["CLEAN_ALL_STATUS"] });
    }
  };

  useEffect(() => {
    dispatch({ type: PlayerActionTypes["GET"] });
  }, [dispatch]);

  useEffect(() => {
    if (players) {
      setPlayerList(players);
    }
  }, [players]);

  return (
    <>
      <div className="d-flex flex-column gap-4">
        {players.length > 0 && (
          <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between">
              <div>
                <span className="fw-bold">本日出席 </span>
                <span className="text-muted fs-7">
                  ({activePlayers.length})
                </span>
              </div>
              <button className="btn btn-create" onClick={handleClean}>
                清除上場數及狀態
              </button>
            </div>
            <PlayerTable />
          </div>
        )}
        <button className="btn btn-edit" onClick={handleCreate}>
          + 新增球友
        </button>
      </div>
    </>
  );
}
