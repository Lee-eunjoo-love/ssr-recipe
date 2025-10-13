import "./Menu.css";
import { Link } from "react-router-dom";

const Menu = () => {
  const menus = [
    { name: "Red", path: "/red" },
    { name: "Blue", path: "/blue" },
    { name: "Users", path: "/users" },
    { name: "Sample", path: "/sample" },
    { name: "Counter", path: "/counter" },
    { name: "About", path: "/about" },
  ];
  const ulStyle = {
    listStyle: "none",
  };
  const liStyle = {
    display: "inline-block",
    minWidth: 150,
    textDecoration: "none",
  };
  return (
    <ul style={ulStyle}>
      {menus &&
        menus.map((menu) => (
          <li key={menu.name} style={liStyle}>
            <Link to={menu.path}>{menu.name}</Link>
          </li>
        ))}
    </ul>
  );
};

export default Menu;
