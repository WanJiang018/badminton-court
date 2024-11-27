import React from "react";
import { useDispatch } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import ScoreIcon from "../../images/icon-21.png";
import NextIcon from "../../images/icon-next.svg";

export default function PlayCourtAction() {
  const dispatch = useDispatch();
  const { courtPlayers, intervalRef, onRandom } = useGameCourtContext();

  const handleFinished = () => {
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
      <button
        onClick={() => {
          handleFinished();
          onRandom();
        }}
        className="btn btn-court rounded-pill"
      >
        <div className="d-flex align-items-center gap-1">
          <img src={NextIcon} alt="random" width="20" height="20" />
          <div>下一場</div>
        </div>
      </button>
    </>
  );
}
