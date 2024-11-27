import React from "react";
import { useDispatch } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import ResetIcon from "../../images/icon-reset.png";
import ConfirmIcon from "../../images/icon-confirm.svg";
import CancelIcon from "../../images/icon-cancel.png";

export default function SelectingCourtAction() {
  const dispatch = useDispatch();
  const { number, courtPlayers, onRandom } = useGameCourtContext();

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
      <button className="btn btn-court-outline rounded-pill" onClick={onRandom}>
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
