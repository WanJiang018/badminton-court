import { MENU_ITEMS } from "../utils/common/constants";

export default function Menu({ tab, onChangeTab }) {
  return (
    <div className="bg-main-light d-flex justify-content-center gap-3 py-2 mb-4">
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
          name={item.name}
          onChangeTab={onChangeTab}
          isSelected={tab === item.value}
        />
      ))}
    </div>
  );
}

function MenuItem({ value, name, isSelected, onChangeTab }) {
  return (
    <>
      <input
        type="radio"
        className="btn-check"
        name="menu-options"
        id={value}
        value={value}
        checked={isSelected}
        onChange={() => onChangeTab(value)}
      />
      <label className="btn btn-white shadow-sm" htmlFor={value}>
        {name}
      </label>
    </>
  );
}
