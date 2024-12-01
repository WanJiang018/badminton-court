import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import GameCourtContext from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import Court from "./Court";
import GameCourtMiddle from "./GameCourtMiddle";
import IdleCourtAction from "./IdleCourtAction";
import PlayCourtAction from "./PlayCourtAction";
import SelectingCourtAction from "./SelectingCourtAction";
import PlayerCard from "./PlayerCard";

export default function GameCourt({ number }) {
  const { players } = useSelector((state) => state.players);
  const intervalRef = useRef();
  const [courtPlayers, setCourtPlayers] = useState([]);

  const nextPlayers = useMemo(
    () =>
      players.filter(
        (item) =>
          item.court === number && item.status === PLAYER_STATUS["PREPARE_NEXT"]
      ),
    [number, players]
  );

  useEffect(() => {
    if (players?.length > 0) {
      const selectedPlayers = players?.filter(
        (item) =>
          item.court === number &&
          (item.status === PLAYER_STATUS["SELECTING"] ||
            item.status === PLAYER_STATUS["GAME"])
      );
      if (selectedPlayers.length === 4) {
        setCourtPlayers(selectedPlayers.sort((a, b) => a.playNo - b.playNo));
      } else {
        setCourtPlayers([]);
      }
    }
  }, [number, players]);

  return (
    <GameCourtContext.Provider value={{ number, courtPlayers, intervalRef }}>
      <Court
        middle={<GameCourtMiddle />}
        players={courtPlayers?.map((player) => (
          <div
            key={player?.id}
            className="d-flex justify-content-center align-items-center h-100"
          >
            <PlayerCard player={player} />
          </div>
        ))}
        footer={
          <div className="mt-3">
            <div className="d-flex justify-content-center gap-3">
              {courtPlayers.length === 0 ? (
                <IdleCourtAction />
              ) : courtPlayers?.every(
                  (item) => item.status === PLAYER_STATUS["GAME"]
                ) ? (
                <PlayCourtAction />
              ) : (
                <SelectingCourtAction />
              )}
            </div>
            {nextPlayers.length > 0 && (
              <div className="mt-3 text-white fw-bold ">
                <span>下一場準備：</span>
                <div className="d-flex gap-2 fs-2">
                  {players
                    .filter(
                      (item) =>
                        item.court === number &&
                        item.status === PLAYER_STATUS["PREPARE_NEXT"]
                    )
                    .sort((a, b) => a.playNo - b.playNo)
                    .map((item, index) => (
                      <>
                        <PlayerCard player={item} key={item?.id} size="small" />
                        {index === 1 && <span className="fs-6">vs</span>}
                      </>
                    ))}
                </div>
              </div>
            )}
          </div>
        }
      />
    </GameCourtContext.Provider>
  );
}
