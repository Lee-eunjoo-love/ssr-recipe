import { combineReducers } from "redux";
import users, { usersSaga } from "./users";
import counter from "./counter";
import { all } from "redux-saga/effects";

export function* rootSaga() {
  yield all([usersSaga()]);
}

const rootReducer = combineReducers({
  users,
  counter,
});

export default rootReducer;
