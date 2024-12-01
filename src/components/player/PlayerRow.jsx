import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { PLAYER_STATUS } from "../../utils/players/constants";
import {
  convertLevelItem,
  formatTimeDifference,
} from "../../utils/common/functions";
import {
  isActiveStatus,
  isReadOnlyStatus,
} from "../../utils/players/functions";
import EditIcon from "../../images/icon-edit.svg";
import DeleteIcon from "../../images/icon-delete.svg";
import DowntIcon from "../../images/icon-down.svg";
import UpIcon from "../../images/icon-up.svg";
import ArrangeIcon from "../../images/icon-arrange.svg";
import CouchIcon from "../../images/icon-couch.svg";
import WarIcon from "../../images/icon-war.svg";
import LeaveIcon from "../../images/icon-leave.svg";
import LeavePurpleIcon from "../../images/icon-leave-purple.svg";
import PrepareIcon from "../../images/icon-stopwatch.svg";

export default function PlayerRow({ data }) {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const { id, name, level, status, count, court, time } = data;
  const levelItem = convertLevelItem(level);

  const [editMode, setEditMode] = useState(name ? false : true);
  const [editName, setEditName] = useState(name);
  const [editLevel, setEditLevel] = useState(level);
  const [invalid, setInvalid] = useState(false);

  const [timer, setTimer] = useState();
  const intervalRef = useRef();

  const handleEdit = () => {
    setEditMode(true);
  };
  const handleSwitchLeave = () => {
    dispatch({
      type: PlayerActionTypes["UPDATE"],
      payload: {
        ...data,
        status:
          status === PLAYER_STATUS["TEMP_LEAVE"]
            ? PLAYER_STATUS["REST"]
            : PLAYER_STATUS["TEMP_LEAVE"],
      },
    });
  };

  const handleSwitchActive = () => {
    dispatch({
      type: PlayerActionTypes["UPDATE"],
      payload: {
        ...data,
        status:
          status === PLAYER_STATUS["ABSENT"]
            ? PLAYER_STATUS["REST"]
            : PLAYER_STATUS["ABSENT"],
      },
    });
  };

  const handleSave = () => {
    if (editName) {
      if (
        players
          ?.filter((item) => item.id !== id)
          ?.map((item) => item.name)
          .includes(editName)
      ) {
        alert("已經有存在的名稱");
        return;
      }
      setInvalid(false);
      setEditMode(false);
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: { ...data, name: editName, level: parseInt(editLevel) },
      });
    } else {
      setInvalid(true);
    }
  };

  const handleCancel = () => {
    if (!name) {
      dispatch({
        type: PlayerActionTypes["DELETE"],
        payload: id,
      });
    } else {
      setEditMode(false);
      setEditName(name);
      setEditLevel(level);
    }
  };

  const handleDelete = () => {
    const userConfirmed = window.confirm("確定要刪除嗎?");
    if (userConfirmed) {
      dispatch({
        type: PlayerActionTypes["DELETE"],
        payload: id,
      });
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (time) {
        setTimer(formatTimeDifference(time));
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [time]);

  return (
    <>
      <tr>
        {/* name */}
        <td>
          {editMode ? (
            <input
              type="text"
              className={`form-control form-control-sm ${
                invalid && "is-invalid"
              }`}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          ) : (
            <div className="d-flex align-items-center gap-2">{name}</div>
          )}
        </td>
        {/* level */}
        <td>
          {editMode ? (
            <select
              className="form-select form-select-sm"
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value)}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((item) => (
                <option
                  key={item}
                  value={item}
                  className={convertLevelItem(item)?.level}
                >
                  {item} - {convertLevelItem(item)?.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="d-flex align-items-center gap-1">
              <div
                className={`rounded-circle level-number ${levelItem.level}`}
                style={{ width: "10px", height: "10px" }}
              ></div>
              <span className="fs-7">{level}</span>
            </div>
          )}
        </td>
        {/* status */}
        {status !== PLAYER_STATUS["ABSENT"] && (
          <td>
            <span className={`badge rounded-pill status ${status}`}>
              {status === PLAYER_STATUS["GAME"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={WarIcon} alt="game" width="12" height="12" />
                  {court} 號場對戰
                </div>
              )}
              {status === PLAYER_STATUS["SELECTING"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={ArrangeIcon} alt="arrange" width="12" height="12" />
                  {court} 號場排場
                </div>
              )}
              {status === PLAYER_STATUS["REST"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={CouchIcon} alt="rest" width="12" height="12" />
                  場下休息
                </div>
              )}
              {status === PLAYER_STATUS["TEMP_LEAVE"] && (
                <div className="d-flex align-items-center gap-1">
                  <img
                    src={LeavePurpleIcon}
                    alt="leave"
                    width="12"
                    height="12"
                  />
                  暫時離開
                </div>
              )}
              {status === PLAYER_STATUS["PREPARE_NEXT"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={PrepareIcon} alt="leave" width="12" height="12" />
                  {court} 號場準備
                </div>
              )}
            </span>
            {time && <span className="text-muted fs-8 ms-md-2">{timer}</span>}
          </td>
        )}
        {/* count */}
        {isActiveStatus(status) && <td>{count ?? 0}</td>}
        {/* action */}
        {editMode ? (
          <td>
            <div className="d-flex flex-column flex-md-row align-items-center gap-2">
              <button className="btn btn-edit fs-7" onClick={handleSave}>
                儲存
              </button>
              <button className="btn btn-cancel fs-7" onClick={handleCancel}>
                取消
              </button>
            </div>
          </td>
        ) : (
          <td>
            <div className="d-flex flex-column flex-md-row gap-2">
              {!isReadOnlyStatus(status) && (
                <>
                  <div className="d-flex gap-2">
                    <button className="btn btn-icon btn-status">
                      <img src={EditIcon} alt="edit" onClick={handleEdit} />
                    </button>
                    <button className="btn btn-icon btn-status">
                      <img
                        src={DeleteIcon}
                        alt="delete"
                        onClick={handleDelete}
                      />
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    {(status === PLAYER_STATUS["REST"] ||
                      status === PLAYER_STATUS["TEMP_LEAVE"]) && (
                      <button className="btn btn-icon btn-status">
                        <img
                          src={
                            status === PLAYER_STATUS["REST"]
                              ? LeaveIcon
                              : CouchIcon
                          }
                          onClick={handleSwitchLeave}
                          alt="leave"
                        />
                      </button>
                    )}
                    <button className="btn btn-icon btn-status">
                      <img
                        src={isActiveStatus(status) ? DowntIcon : UpIcon}
                        onClick={handleSwitchActive}
                        alt="switch"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </td>
        )}
      </tr>
    </>
  );
}
