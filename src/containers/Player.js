import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import {
  ACTIVE_PLAYER_TABLE_COLUMNS,
  INACTIVE_PLAYER_TABLE_COLUMNS,
} from "../utils/players/constants";
import { isActiveStatus } from "../utils/players/functions";
import PlayerTable from "../components/PlayerTable";

export default function Player() {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const [playerList, setPlayerList] = useState([]);

  const activePlayers = useMemo(
    () => playerList.filter((item) => isActiveStatus(item.status)),
    [playerList]
  );

  const inactivePlayers = useMemo(
    () => playerList.filter((item) => !isActiveStatus(item.status)),
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
      <div className="mb-5">
        {activePlayers.length > 0 && (
          <>
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <span className="fw-bold">出席球友</span>
                <span className="text-muted fs-7">
                  ({activePlayers.length})
                </span>
              </div>
              <button className="btn btn-create" onClick={handleClean}>
                清除上場次數及狀態
              </button>
            </div>
            <PlayerTable
              playerList={activePlayers}
              columns={ACTIVE_PLAYER_TABLE_COLUMNS}
            />
          </>
        )}
        <button className="btn btn-edit" onClick={handleCreate}>
          + 新增球友
        </button>
      </div>
      {inactivePlayers.length > 0 && (
        <div className="mb-5">
          <div className="d-flex align-items-center">
            <span className="fw-bold">未出席球友</span>
            <span className="text-muted fs-7">({inactivePlayers.length})</span>
          </div>
          <PlayerTable
            playerList={inactivePlayers}
            columns={INACTIVE_PLAYER_TABLE_COLUMNS}
          />
        </div>
      )}
    </>
  );
}
