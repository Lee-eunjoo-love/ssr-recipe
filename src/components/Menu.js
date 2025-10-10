import { Link } from "react-router-dom";

const Menu = () => {
  const menus = [
    { name: "Red", path: "/red" },
    { name: "Blue", path: "/blue" },
  ];
  return (
    <ul>
      {menus &&
        menus.map((menu) => (
          <li key={menu.name}>
            <Link to={menu.path}>{menu.name}</Link>
          </li>
        ))}
    </ul>
  );
};

export default Menu;
