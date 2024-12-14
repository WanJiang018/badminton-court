export const CourtActionTypes = {
  GET: "COURT/GET",
  UPDATE: "COURT/UPDATE",
  CREATE: "COURT/CREATE",
  DELETE: "COURT/DELETE",
};

export const getCourtsAction = () => ({
  type: CourtActionTypes["GET"],
});

export const updateCourtAction = (payload) => ({
  type: CourtActionTypes["UPDATE"],
  payload: payload,
});

export const createCourtAction = () => ({
  type: CourtActionTypes["CREATE"],
});

export const deleteCourtAction = (id) => ({
  type: CourtActionTypes["DELETE"],
  payload: id,
});
