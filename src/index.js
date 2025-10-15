import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import rootReducer, { rootSaga } from "./modules";
import createSagaMiddleware from "redux-saga";
import { loadableReady } from "@loadable/component"; // #. [모든 스크립트가 로딩된후 렌더링]

const sagaMiddleware = createSagaMiddleware();

// 스토어 생성
const store = createStore(
  rootReducer,
  window.__PRELOAD_STATE__, // #. 이 값을 초기 상태로 사용함. (브로우저에서 상태 재사용시)
  applyMiddleware(thunk, sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
/*root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);*/
// #. [모든 스크립트가 로딩된후 렌더링]
async function render() {
  if (process.env.NODE_ENV === "production") {
    await loadableReady();
  }

  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}
render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/**
 * window.__PRELOAD_STATE__ : 브로우저에서 상태를 재사용할 때 스토어 생성 과정에서 이 값을 초기값으로 사용하면 됨
 *
 * loadableReady : loadable Components 를 사용하면 성능 최적화를 위해 모든 자바스크립트 파일을 동시에 받아온다.
 *                 모든 스크립트가 로딩되고 나서 렌더링되고 나서 처리하기 위해 loadableReady 함수를 사용해야 하는데 이 함수는 프로덕션 환경에서 서버 사이드 렌더링일때만 호출하도록 해야 한다.
 */
