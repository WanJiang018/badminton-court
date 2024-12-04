import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import { getRandomPlayers } from "../../utils/courts/functions";
import ScoreIcon from "../../images/icon-21.png";
import NextIcon from "../../images/icon-next.svg";

export default function PlayCourtAction() {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const { number, courtPlayers, intervalRef } = useGameCourtContext();

  const nextPlayers = players.filter(
    (item) =>
      item.court === number && item.status === PLAYER_STATUS["PREPARE_NEXT"]
  );

  const finishGame = () => {
    clearInterval(intervalRef?.current);
    courtPlayers.forEach((item, _index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["REST"],
          time: new Date().getTime(),
          count: item.count + 1,
          court: undefined,
          playNo: undefined,
        },
      });
    });

    nextPlayers.forEach((item, _index) => {
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
  };

  const handleFinished = () => {
    const userConfirmed = window.confirm("確定要結束比賽嗎?");

    if (userConfirmed) {
      finishGame();
    }
  };

  const handleNext = () => {
    const userConfirmed = window.confirm("確定要進行下一場嗎?");

    if (userConfirmed) {
      finishGame();
      nextPlayers?.forEach((item, _index) => {
        dispatch({
          type: PlayerActionTypes["UPDATE"],
          payload: {
            ...item,
            status: PLAYER_STATUS["GAME"],
            time: new Date().getTime(),
            court: number,
          },
        });
      });

      const restPlayers = players.filter((item) =>
        nextPlayers.every((player) => player.id !== item.id)
      );
      const selectedPlayers = getRandomPlayers(restPlayers, number);
      selectedPlayers?.forEach((item, index) => {
        dispatch({
          type: PlayerActionTypes["UPDATE"],
          payload: {
            ...item,
            status: PLAYER_STATUS["PREPARE_NEXT"],
            court: number,
            playNo: index,
            time: undefined,
          },
        });
      });

      players
        .filter(
          (item) =>
            item.court === number && item.status === PLAYER_STATUS["SELECTING"]
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
    }
  };

  return (
    <>
      <button
        onClick={handleFinished}
        className="btn btn-court-outline rounded-pill"
      >
        <div className="d-flex align-items-center gap-1">
          <img
            src={ScoreIcon}
            alt="score"
            width="20"
            height="20"
            className="svg-icon-white"
          />
          <div>結束比賽</div>
        </div>
      </button>
      {nextPlayers?.length > 0 && (
        <button onClick={handleNext} className="btn btn-court rounded-pill">
          <div className="d-flex align-items-center gap-1">
            <img src={NextIcon} alt="random" width="20" height="20" />
            <div>下一場</div>
          </div>
        </button>
      )}
    </>
  );
}
