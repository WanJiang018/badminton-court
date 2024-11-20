import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  PLAYER_ACTION,
  PLAYER_STATUS,
  ACTIVE_PLAYER_TABLE_COLUMNS,
  INACTIVE_PLAYER_TABLE_COLUMNS,
} from "../utils/constants";
import {
  convertLevelItem,
  isActiveStatus,
  storePlayersData,
  isReadOnlyStatus,
  formatTimeDifference,
} from "../utils/functions";
import EditIcon from "../images/icon-edit.svg";
import DeleteIcon from "../images/icon-delete.svg";
import DowntIcon from "../images/icon-down.svg";
import UpIcon from "../images/icon-up.svg";
import ArrangeIcon from "../images/icon-arrange.svg";
import CouchIcon from "../images/icon-couch.svg";
import CouchPurpleIcon from "../images/icon-couch-purple.svg";
import WarIcon from "../images/icon-war.svg";
import LeaveIcon from "../images/icon-leave.png";

export default function Player() {
  const [players, setPlayers] = useState([]);
  const [quickAddData, setQuickAddData] = useState([]);

  const activePlayers = useMemo(
    () => players.filter((item) => isActiveStatus(item.status)),
    [players]
  );

  const inactivePlayers = useMemo(
    () => players.filter((item) => !isActiveStatus(item.status)),
    [players]
  );

  const handleCreate = () => {
    const newPlayer = {
      id:
        players && players?.length > 0
          ? Math.max(...players.map((item) => item.id)) + 1
          : 1,
      name: "",
      level: 4,
      status: PLAYER_STATUS["REST"],
      court: undefined,
      count: 0,
    };
    const result = [...players, newPlayer];
    setPlayers(result);
    storePlayersData(result);
  };

  const onUpdatePlayer = (id, action) => {
    if (action === PLAYER_ACTION["DELETE"]) {
      setPlayers((p) => {
        const result = p.filter((item) => item.id !== id);
        storePlayersData(result);
        return result;
      });
    } else if (action === PLAYER_ACTION["SWITCH_ACTIVE"]) {
      setPlayers((p) => {
        const result = p.map((item) =>
          item.id === id
            ? {
                ...item,
                status:
                  item.status === PLAYER_STATUS["ABSENT"]
                    ? PLAYER_STATUS["REST"]
                    : PLAYER_STATUS["ABSENT"],
              }
            : item
        );
        storePlayersData(result);
        return result;
      });
    } else if (action === PLAYER_ACTION["SWITCH_LEAVE"]) {
      setPlayers((p) => {
        const result = p.map((item) =>
          item.id === id
            ? {
                ...item,
                status:
                  item.status === PLAYER_STATUS["TEMP_LEAVE"]
                    ? PLAYER_STATUS["REST"]
                    : PLAYER_STATUS["TEMP_LEAVE"],
              }
            : item
        );
        storePlayersData(result);
        return result;
      });
    }
  };

  const onSaveEdit = (id, name, level) => {
    setPlayers((p) => {
      const result = p.map((item) =>
        item.id === id ? { ...item, name, level } : item
      );
      storePlayersData(result);
      return result;
    });
  };

  const handleClean = () => {
    const userConfirmed = window.confirm("確定要清除嗎?");
    if (userConfirmed) {
      const result = players.map((item) => ({
        ...item,
        count: 0,
        status: PLAYER_STATUS["REST"],
        court: undefined,
        playNo: undefined,
        time: undefined,
      }));
      setPlayers(result);
      storePlayersData(result);
    }
  };

  const handleQuickAdd = () => {
    try {
      const parsedData = JSON.parse(quickAddData);
      localStorage.setItem("players", JSON.stringify(parsedData));
      setPlayers(parsedData);
      setQuickAddData([]);
    } catch (error) {
      alert("格式錯誤");
    }
  };

  useEffect(() => {
    localStorage.getItem("players") &&
      setPlayers(JSON.parse(localStorage.getItem("players")));
  }, []);

  return (
    <>
      <div className="mb-5">
        {activePlayers.length > 0 && (
          <>
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <span className="fw-bold">出席球友</span>
                <span className="text-muted fs-7">
                  ({activePlayers.length})
                </span>
              </div>
              <button className="btn btn-create" onClick={handleClean}>
                清除上場次數及狀態
              </button>
            </div>
            <PlayerTable
              playerList={activePlayers}
              columns={ACTIVE_PLAYER_TABLE_COLUMNS}
              onUpdatePlayer={onUpdatePlayer}
              onSaveEdit={onSaveEdit}
            />
          </>
        )}
        <button className="btn btn-edit" onClick={handleCreate}>
          + 新增球友
        </button>
      </div>
      {inactivePlayers.length > 0 && (
        <div className="mb-5">
          <div className="d-flex align-items-center">
            <span className="fw-bold">未出席球友</span>
            <span className="text-muted fs-7">({inactivePlayers.length})</span>
          </div>
          <PlayerTable
            playerList={inactivePlayers}
            columns={INACTIVE_PLAYER_TABLE_COLUMNS}
            onUpdatePlayer={onUpdatePlayer}
            onSaveEdit={onSaveEdit}
          />
        </div>
      )}
      <div className="d-flex align-items-center">
        <span className="fw-bold">快速新增</span>
      </div>
      <textarea
        className="form-control"
        value={quickAddData}
        onChange={(e) => setQuickAddData(e.target.value)}
      />
      <button className="btn btn-edit mt-3" onClick={handleQuickAdd}>
        新增
      </button>
    </>
  );
}

function PlayerTable({ playerList, columns, onUpdatePlayer, onSaveEdit }) {
  const [list, setList] = useState(playerList);

  const onSort = (key, order = "desc") => {
    setList((p) =>
      [...p].sort((a, b) => {
        // Handle multiple keys
        if (Array.isArray(key)) {
          for (let k of key) {
            let compareResult = 0;

            // Handle Chinese characters
            if (typeof a[k] === "string" && /[\u4e00-\u9fa5]/.test(a[k])) {
              compareResult = a[k].localeCompare(b[k], "zh-TW");
            } else {
              // Handle non-Chinese values
              if (a[k] < b[k]) compareResult = -1;
              if (a[k] > b[k]) compareResult = 1;
            }

            // If current key comparison is not equal, return result
            if (compareResult !== 0) {
              return order === "desc" ? compareResult : -compareResult;
            }
          }
          return 0;
        }

        // Handle single key (backwards compatible)
        if (typeof a[key] === "string" && /[\u4e00-\u9fa5]/.test(a[key])) {
          return order === "desc"
            ? a[key].localeCompare(b[key], "zh-TW")
            : b[key].localeCompare(a[key], "zh-TW");
        }

        if (a[key] < b[key]) return order === "desc" ? -1 : 1;
        if (a[key] > b[key]) return order === "desc" ? 1 : -1;
        return 0;
      })
    );
  };

  useEffect(() => {
    setList(playerList);
  }, [playerList]);

  return (
    <>
      {list.length > 0 && (
        <table className="table table-bordered">
          <PlayerTableHead columns={columns} onSort={onSort} />
          <tbody>
            {list.map((player) => (
              <PlayerRow
                key={player.id}
                data={player}
                onUpdatePlayer={onUpdatePlayer}
                onSaveEdit={onSaveEdit}
              />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function PlayerTableHead({ columns, onSort }) {
  const [sortOrders, setSortOrders] = useState({});

  const handleSort = (field) => {
    const newOrder = sortOrders[field] === "desc" ? "asc" : "desc";
    setSortOrders((prevOrders) => ({ ...prevOrders, [field]: newOrder }));
    onSort(field, newOrder);
  };

  return (
    <thead className="table-main">
      <tr>
        {columns.map((item) => (
          <th
            key={item.key}
            className={item.sort && `sort ${sortOrders[item.key]}`}
            onClick={() => item.sort && handleSort(item.key)}
          >
            {item.name}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function PlayerRow({ data, onUpdatePlayer, onSaveEdit }) {
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

  const handleSave = () => {
    if (editName) {
      if (
        JSON.parse(localStorage.getItem("players"))
          ?.filter((item) => item.id !== id)
          ?.map((item) => item.name)
          .includes(editName)
      ) {
        alert("已經有存在的名稱");
        return;
      }
      setInvalid(false);
      setEditMode(false);
      onSaveEdit(id, editName, parseInt(editLevel));
    } else {
      setInvalid(true);
    }
  };

  const handleCancel = () => {
    if (!name) {
      onUpdatePlayer(id, PLAYER_ACTION["DELETE"]);
    } else {
      setEditMode(false);
      setEditName(name);
      setEditLevel(level);
    }
  };

  const handleDelete = () => {
    const userConfirmed = window.confirm("確定要刪除嗎?");
    if (userConfirmed) {
      onUpdatePlayer(id, PLAYER_ACTION["DELETE"]);
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
        <td>
          {editMode ? (
            <select
              className="form-select form-select-sm"
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value)}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((item) => (
                <option value={item} className={convertLevelItem(item)?.level}>
                  {item} - {convertLevelItem(item)?.name}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`badge rounded-pill level-number ${levelItem.level}`}
            >
              {`${level} - ${convertLevelItem(level)?.name}`}
            </span>
          )}
        </td>
        {status !== PLAYER_STATUS["ABSENT"] && (
          <td>
            <span className={`badge rounded-pill status ${status}`}>
              {status === PLAYER_STATUS["GAME"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={WarIcon} alt="game" width="12" height="12" />
                  {court} 號場對戰
                </div>
              )}
              {status === PLAYER_STATUS["SELECTED"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={ArrangeIcon} alt="arrange" width="12" height="12" />
                  {court} 號場排場
                </div>
              )}
              {status === PLAYER_STATUS["REST"] && (
                <>
                  <img src={CouchIcon} alt="rest" width="12" height="12" />
                  場下休息
                </>
              )}
              {status === PLAYER_STATUS["TEMP_LEAVE"] && (
                <div className="d-flex align-items-center gap-1">
                  <img src={LeaveIcon} alt="leave" width="12" height="12" />
                  暫時離開
                </div>
              )}
            </span>
            {time && <span className="text-muted fs-8 ms-md-2">{timer}</span>}
          </td>
        )}
        {isActiveStatus(status) && <td>{count ?? 0}</td>}
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
                    <button className="btn btn-icon btn-edit">
                      <img src={EditIcon} alt="edit" onClick={handleEdit} />
                    </button>
                    <button className="btn btn-icon btn-delete">
                      <img
                        src={DeleteIcon}
                        alt="delete"
                        onClick={handleDelete}
                      />
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    {status === PLAYER_STATUS["REST"] && (
                      <button className="btn btn-icon btn-leave">
                        <img
                          src={LeaveIcon}
                          onClick={() =>
                            onUpdatePlayer(id, PLAYER_ACTION["SWITCH_LEAVE"])
                          }
                          alt="leave"
                        />
                      </button>
                    )}
                    {status === PLAYER_STATUS["TEMP_LEAVE"] && (
                      <button className="btn btn-icon btn-leave">
                        <img
                          src={CouchPurpleIcon}
                          onClick={() =>
                            onUpdatePlayer(id, PLAYER_ACTION["SWITCH_LEAVE"])
                          }
                          alt="leave"
                        />
                      </button>
                    )}
                    <button className="btn btn-icon btn-switch">
                      <img
                        src={isActiveStatus(status) ? DowntIcon : UpIcon}
                        onClick={() =>
                          onUpdatePlayer(id, PLAYER_ACTION["SWITCH_ACTIVE"])
                        }
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
