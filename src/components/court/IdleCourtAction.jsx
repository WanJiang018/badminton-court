import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CourtActionTypes } from "../../redux/actions/courtActions";
import { useGameCourtContext } from "../../context/GameCourtContext";
import RandomIcon from "../../images/icon-random.png";
import DeleteIcon from "../../images/icon-delete.svg";

export default function IdleCourtAction() {
  const dispatch = useDispatch();
  const { number, onRandom } = useGameCourtContext();
  const { courts } = useSelector((state) => state.courts);

  const handleDeleteCourt = () => {
    const userConfirmed = window.confirm("確定要刪除嗎?");
    if (userConfirmed) {
      dispatch({
        type: CourtActionTypes["DELETE"],
        payload: number,
      });
    }
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
      <button onClick={onRandom} className="btn btn-court rounded-pill">
        <div className="d-flex align-items-center gap-1">
          <img src={RandomIcon} alt="random" width="20" height="20" />
          <div>隨機排場</div>
        </div>
      </button>
    </>
  );
}
