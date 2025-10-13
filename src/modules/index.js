import { combineReducers } from "redux";
import users from "./users";
import sample from "./sample";
import counter from "./counter";

const rootReducer = combineReducers({
  users,
  sample,
  counter,
});

export default rootReducer;
