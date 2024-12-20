import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { CourtActionTypes } from "../../redux/actions/courtActions";
import { PLAYER_STATUS } from "../../utils/players/constants";
import { formatTimeDifference } from "../../utils/common/functions";
import EditIcon from "../../images/icon-edit.svg";

export default function GameCourtMiddle() {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);

  const { number, courtPlayers, nextPlayers, intervalRef } =
    useGameCourtContext();

  const [timer, setTimer] = useState();
  const [editMode, setEditMode] = useState(number ? false : true);
  const [editCourt, setEditCourt] = useState(number);
  const [invalid, setInvalid] = useState(false);

  const handleSave = () => {
    if (editCourt) {
      if (
        courts?.filter((item) => item !== number).includes(parseInt(editCourt))
      ) {
        alert("已經有存在的場地名稱");
        return;
      }
      setInvalid(false);
      setEditMode(false);
      dispatch({
        type: CourtActionTypes["UPDATE"],
        payload: {
          oldNumber: number,
          newNumber: editCourt,
        },
      });
    } else {
      setInvalid(true);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setInvalid(false);
    setEditCourt(number);
  };

  useEffect(() => {
    if (courtPlayers?.some((item) => item.status === PLAYER_STATUS["GAME"])) {
      intervalRef.current = setInterval(() => {
        if (courtPlayers[0]?.time) {
          setTimer(formatTimeDifference(courtPlayers[0].time));
        }
      }, 1000);
    } else {
      setTimer();
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [courtPlayers, intervalRef]);

  return (
    <div className="d-flex align-items-center gap-2">
      {editMode ? (
        <input
          type="number"
          className={`form-control form-control-sm ${invalid && "is-invalid"}`}
          style={{
            width: "40px",
          }}
          value={editCourt}
          onChange={(e) => setEditCourt(e.target.value)}
          required
        />
      ) : (
        <div className="court-no fw-bold fs-5">{number}</div>
      )}
      {(!courtPlayers || courtPlayers?.length === 0) &&
        (!nextPlayers || nextPlayers?.length === 0) &&
        (!editMode ? (
          <img
            src={EditIcon}
            alt="edit"
            onClick={() => setEditMode(true)}
            width="18"
            className="svg-icon-white cursor-pointer"
          />
        ) : (
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-edit fs-7" onClick={handleSave}>
              儲存
            </button>
            <button className="btn btn-cancel fs-7" onClick={handleCancel}>
              取消
            </button>
          </div>
        ))}
      {courtPlayers?.every((item) => item.status === PLAYER_STATUS["GAME"]) && (
        <div className="fs-6 text-white">{timer}</div>
      )}
    </div>
  );
}
