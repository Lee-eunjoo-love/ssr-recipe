import ReactDOMServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import path from "path";
import fs from "fs";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import rootReducer from "./modules";

// 스토어 생성
const store = createStore(rootReducer, applyMiddleware(thunk));

// 정적 파일 html 내부에 주입
const manifest = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../build/asset-manifest.json"),
    "utf-8"
  )
);

const chunks = Object.keys(manifest.files)
  .filter((key) => /chunk\.js$/.exec(key))
  .map((key) => `<script src="${manifest.files[key]}"></script>`)
  .join("");

/*const styles = Object.keys(manifest.files)
  .filter((key) => /\w+.css$/.exec(key))
  .map((key) => `<link href="${manifest.files[key]}" rel="stylesheet" />`)
  .join("");*/

function createPage(root) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <title>React App</title>
        <link href="${manifest.files["main.css"]}" rel="stylesheet" />
        <script src="${manifest.files["main.js"]}"></script>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">${root}</div>
        ${chunks}
    </body>
  </html>`;
}

const app = express();
const serverRender = (req, res, next) => {
  const context = {};
  const jsx = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );
  const root = ReactDOMServer.renderToString(jsx); // 렌더링된 결과물을 문자열로 변환
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답
};

// 정적 파일 제공 (index: false 옵션을 주어 '/' 경로에서 index.html 을 제공하지 않도록 설정)
const serve = express.static(path.resolve(__dirname, "../build"), {
  index: false,
});
app.use(serve);

app.use(serverRender);

app.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});

/*const html = ReactDOMServer.renderToString(
  <div>Hello Server Side Rendering!</div>
);

console.log(html);*/

/**
 * 엔트리 : 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일
 *    - src/index.js (클라이언트 사이드 렌더링)
 *    - src/index.server.js (서버 사이드 렌더링)
 *    - src/App.js (공통)
 *    - src/components (공통)
 *    - src/pages (공통)
 *
 * 데이터 로딩 : 서버의 경우 문자열 형태로 렌더링하기 때문에, state 나 리덕스 스토어의 상태가 바뀔때 자동 리렌더링이 안되므로 renderToString() 함수를 한번 더 호출해야 함
 *    - 클라이언트 사이드 렌더링 : useEffect, componentDidMount
 *    - 서버 사이드 렌더링 : renderToString() 함수 내부에서 데이터 로딩 후 렌더링
 *
 * Ducks 패턴 : 액션 타입, 액션 생성 함수, 리듀서를 하나의 파일에 작성하는 방식
 */
