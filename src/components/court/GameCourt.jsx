import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import GameCourtContext from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import {
  selectInitialPlayers,
  balancePlayerLevels,
  adjustPlayerGroups,
} from "../../utils/courts/functions";
import Court from "./Court";
import GameCourtMiddle from "./GameCourtMiddle";
import IdleCourtAction from "./IdleCourtAction";
import PlayCourtAction from "./PlayCourtAction";
import SelectingCourtAction from "./SelectingCourtAction";
import PlayerCard from "./PlayerCard";

export default function GameCourt({ number }) {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const intervalRef = useRef();
  const [courtPlayers, setCourtPlayers] = useState([]);

  const onRandom = () => {
    const restPlayers = players
      ?.filter(
        (player) =>
          player.name &&
          (player.status === PLAYER_STATUS["REST"] ||
            (player.status === PLAYER_STATUS["SELECTED"] &&
              player.court === number))
      )
      .sort((a, b) => a.count - b.count || (a.time || 0) - (b.time || 0));

    if (!restPlayers || restPlayers.length < 4) {
      alert("人數不足，無法排場");
      return;
    }

    let selectedPlayers = selectInitialPlayers(restPlayers);
    selectedPlayers = balancePlayerLevels(selectedPlayers, restPlayers);
    selectedPlayers = adjustPlayerGroups(selectedPlayers);

    handleUpdateCourtPlayers(selectedPlayers);
  };

  const handleUpdateCourtPlayers = (selectedPlayers) => {
    players
      .filter(
        (item) =>
          item.court === number && item.status === PLAYER_STATUS["SELECTED"]
      )
      .forEach((item) => {
        dispatch({
          type: PlayerActionTypes["UPDATE"],
          payload: {
            ...item,
            status: PLAYER_STATUS["REST"],
            court: undefined,
            playNo: undefined,
          },
        });
      });

    selectedPlayers.forEach((item, index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["SELECTED"],
          court: number,
          playNo: index,
        },
      });
    });
  };

  useEffect(() => {
    if (players?.length > 0) {
      const selectedPlayers = players?.filter((item) => item.court === number);
      if (selectedPlayers.length === 4) {
        setCourtPlayers(selectedPlayers.sort((a, b) => a.playNo - b.playNo));
      } else {
        setCourtPlayers([]);
      }
    }
  }, [number, players]);

  return (
    <GameCourtContext.Provider
      value={{ number, courtPlayers, intervalRef, onRandom }}
    >
      <Court
        middle={<GameCourtMiddle />}
        players={courtPlayers?.map((player) => (
          <PlayerCard player={player} />
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
          </div>
        }
      />
    </GameCourtContext.Provider>
  );
}
