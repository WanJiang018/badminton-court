import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CourtActionTypes } from "../../redux/actions/courtActions";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import RandomIcon from "../../images/icon-random.png";
import DeleteIcon from "../../images/icon-delete.svg";
import { getRandomPlayers } from "../../utils/courts/functions";

export default function IdleCourtAction() {
  const dispatch = useDispatch();
  const { number } = useGameCourtContext();
  const { courts } = useSelector((state) => state.courts);
  const { players } = useSelector((state) => state.players);

  const handleDeleteCourt = () => {
    const userConfirmed = window.confirm("確定要刪除嗎?");
    if (userConfirmed) {
      dispatch({
        type: CourtActionTypes["DELETE"],
        payload: number,
      });
    }
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

    selectedPlayers?.forEach((item, index) => {
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
      {courts?.length > 1 && (
        <button
          className="btn btn-court-outline rounded-pill"
          onClick={handleDeleteCourt}
        >
          <div className="d-flex align-items-center gap-1">
            <img
              src={DeleteIcon}
              alt="delete"
              width="20"
              height="20"
              className="svg-icon-white"
            />
            <div>刪除場地</div>
          </div>
        </button>
      )}
      <button onClick={handleRandom} className="btn btn-court rounded-pill">
        <div className="d-flex align-items-center gap-1">
          <img src={RandomIcon} alt="random" width="20" height="20" />
          <div>隨機排場</div>
        </div>
      </button>
    </>
  );
}
