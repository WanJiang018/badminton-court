export const PlayerActionTypes = {
  GET: "PLAYER/GET",
  CREATE: "PLAYER/GCREATE",
  DELETE: "PLAYER/GDELETE",
  UPDATE: "PLAYER/GUPDATE",
  CLEAN_ALL_STATUS: "PLAYER/GCLEAN_ALL_STATUS",
};

export const getPlayersAction = () => ({
  type: PlayerActionTypes["GET"],
});

export const createPlayerAction = () => ({
  type: PlayerActionTypes["CREATE"],
});

export const deletePlayerAction = (id) => ({
  type: PlayerActionTypes["DELETE"],
  payload: id,
});

export const updatePlayerAction = (payload) => ({
  type: PlayerActionTypes["UPDATE"],
  payload,
});

export const cleanAllPlayersStatusAction = () => ({
  type: PlayerActionTypes["CLEAN_ALL_STATUS"],
});
