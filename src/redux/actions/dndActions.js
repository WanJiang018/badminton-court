export const DndActionTypes = {
  DRAG_START: "DND/DRAG_START",
  DRAG_END: "DND/DRAG_END",
  DRAG_OVER: "DND/DRAG_OVER",
};

export const dragStartAction = (payload) => ({
  type: DndActionTypes["DRAG_START"],
  payload,
});

export const dragEndAction = (payload) => ({
  type: DndActionTypes["DRAG_END"],
  payload,
});

export const dragOverAction = (payload) => ({
  type: DndActionTypes["DRAG_OVER"],
  payload,
});
