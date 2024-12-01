import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import { getRandomPlayers } from "../../utils/courts/functions";
import ResetIcon from "../../images/icon-reset.png";
import ConfirmIcon from "../../images/icon-confirm.svg";
import CancelIcon from "../../images/icon-cancel.png";

export default function SelectingCourtAction() {
  const dispatch = useDispatch();
  const { number, courtPlayers } = useGameCourtContext();
  const { players } = useSelector((state) => state.players);

  const handleCancelRandom = () => {
    courtPlayers.forEach((item, _index) => {
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

  const handleConfirm = () => {
    courtPlayers.forEach((item, _index) => {
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
      courtPlayers.every((player) => player.id !== item.id)
    );
    const selectedNextPlayers = getRandomPlayers(restPlayers, number);
    selectedNextPlayers.forEach((item, index) => {
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
  };

  const handleRandom = () => {
    const selectedPlayers = getRandomPlayers(players, number);
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

    selectedPlayers.forEach((item, index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["SELECTING"],
          court: number,
          playNo: index,
        },
      });
    });
  };

  return (
    <>
      <button
        className="btn btn-court-outline rounded-pill"
        onClick={handleCancelRandom}
      >
        <div className="d-flex align-items-center gap-1">
          <img
            src={CancelIcon}
            alt="cancel"
            width="20"
            height="20"
            className="svg-icon-white"
          />
          <div>取消排場</div>
        </div>
      </button>
      <button
        className="btn btn-court-outline rounded-pill"
        onClick={handleRandom}
      >
        <div className="d-flex align-items-center gap-1">
          <img
            src={ResetIcon}
            alt="reset"
            width="20"
            height="20"
            className="svg-icon-white"
          />
          <div>重新排場</div>
        </div>
      </button>
      <button onClick={handleConfirm} className="btn btn-court rounded-pill">
        <div className="d-flex align-items-center gap-1">
          <img src={ConfirmIcon} alt="confirm" width="20" height="20" />
          <div>確定排場</div>
        </div>
      </button>
    </>
  );
}
