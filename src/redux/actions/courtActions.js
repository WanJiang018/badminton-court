export const CourtActionTypes = {
  GET: "COURT/GET",
  CREATE: "COURT/CREATE",
  DELETE: "COURT/DELETE",
};

export const getCourtsAction = () => ({
  type: CourtActionTypes["GET"],
});

export const createCourtAction = () => ({
  type: CourtActionTypes["CREATE"],
});

export const deleteCourtAction = (id) => ({
  type: CourtActionTypes["DELETE"],
  payload: id,
});
