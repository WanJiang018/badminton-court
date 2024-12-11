import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import GameCourtContext from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import DropSection from "../common/DropSection";
import MoveableItem from "../common/MoveableItem";
import PlayerCard from "./PlayerCard";
import Court from "./Court";
import GameCourtMiddle from "./GameCourtMiddle";
import IdleCourtAction from "./IdleCourtAction";
import PlayCourtAction from "./PlayCourtAction";
import SelectingCourtAction from "./SelectingCourtAction";

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
      if (selectedPlayers.length > 0) {
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
        players={Array.from({ length: 4 }, (_, index) => index).map((index) => {
          const player = courtPlayers.find((item) => item?.playNo === index);
          return (
            <DropSection
              props={{
                status: PLAYER_STATUS["SELECTING"],
                court: number,
                playNo: index,
              }}
              styles={{
                height: "100%",
              }}
              dropable={!player}
            >
              <div className="d-flex justify-content-center align-items-center h-100">
                {player && (
                  <MoveableItem props={player}>
                    <PlayerCard player={player} />
                  </MoveableItem>
                )}
              </div>
            </DropSection>
          );
        })}
        footer={
          <div className="mt-3">
            <div className="d-flex justify-content-center gap-2">
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
                      <React.Fragment key={item?.id}>
                        <PlayerCard player={item} size="small" />
                        {index === 1 && <span className="fs-6">vs</span>}
                      </React.Fragment>
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
