import "./Red.css";
import { useParams } from "react-router-dom";

const Red = () => {
  const { id } = useParams();
  return <div className="red">Red {id}</div>;
};

export default Red;
