import { PlayerActionTypes } from "../actions/playerActions";
import { PLAYER_STATUS, DEFAULT_CREATE_LEVEL } from "../../utils/constants";

const initialState = {
  players: [],
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case PlayerActionTypes["GET"]: {
      const players = JSON.parse(localStorage.getItem("players"));
      return { ...state, players: players || [] };
    }
    case PlayerActionTypes["CREATE"]: {
      const newPlayer = {
        id:
          state.players && state.players?.length > 0
            ? Math.max(...state.players.map((item) => item.id)) + 1
            : 1,
        name: "",
        level: DEFAULT_CREATE_LEVEL,
        status: PLAYER_STATUS["REST"],
      };
      const newPlayers = [...state.players, newPlayer];
      storePlayersData(newPlayers);
      return { ...state, players: newPlayers };
    }
    case PlayerActionTypes["DELETE"]: {
      const newPlayers = state.players.filter(
        (player) => player.id !== action.payload
      );
      storePlayersData(newPlayers);
      return { ...state, players: newPlayers };
    }
    case PlayerActionTypes["UPDATE"]: {
      const { id, ...data } = action.payload;
      const newPlayers = state.players.map((player) =>
        player.id === id ? { ...player, ...data } : player
      );
      storePlayersData(newPlayers);
      return { ...state, players: newPlayers };
    }
    case PlayerActionTypes["CLEAN_ALL_STATUS"]: {
      const newPlayers = state.players.map((player) => ({
        ...player,
        count: 0,
        status: PLAYER_STATUS["REST"],
        court: undefined,
        playNo: undefined,
        time: undefined,
      }));
      storePlayersData(newPlayers);
      return { ...state, players: newPlayers };
    }
    default:
      return state;
  }
};

const storePlayersData = (players) =>
  localStorage.setItem("players", JSON.stringify(players));

export default playerReducer;
