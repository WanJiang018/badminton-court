import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { PLAYER_STATUS } from "../../utils/players/constants";
import { convertLevelItem } from "../../utils/common/functions";
import {
  isActiveStatus,
  isReadOnlyStatus,
} from "../../utils/players/functions";
import EditIcon from "../../images/icon-edit.svg";
import DeleteIcon from "../../images/icon-delete.svg";

export default function PlayerRow({ data }) {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const { id, name, level, status } = data;
  const levelItem = convertLevelItem(level);

  const [editMode, setEditMode] = useState(name ? false : true);
  const [editName, setEditName] = useState(name);
  const [editLevel, setEditLevel] = useState(level);
  const [invalid, setInvalid] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
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

  const handleCheck = () => {
    dispatch({
      type: PlayerActionTypes["UPDATE"],
      payload: {
        ...data,
        status: isActiveStatus(status)
          ? PLAYER_STATUS["ABSENT"]
          : PLAYER_STATUS["REST"],
      },
    });
  };

  return (
    <>
      <tr>
        {/* active */}
        <td>
          {isReadOnlyStatus(status) ? (
            <input type="checkbox" class="form-check-input" checked disabled />
          ) : (
            <input
              type="checkbox"
              class="form-check-input"
              checked={isActiveStatus(status)}
              onChange={handleCheck}
            />
          )}
        </td>
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
            {!isReadOnlyStatus(status) && (
              <>
                <div className="d-flex gap-2">
                  <button className="btn btn-icon btn-status">
                    <img src={EditIcon} alt="edit" onClick={handleEdit} />
                  </button>
                  <button className="btn btn-icon btn-status">
                    <img src={DeleteIcon} alt="delete" onClick={handleDelete} />
                  </button>
                </div>
              </>
            )}
          </td>
        )}
      </tr>
    </>
  );
}
