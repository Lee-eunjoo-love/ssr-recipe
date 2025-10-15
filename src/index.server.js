import ReactDOMServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import path from "path";
import fs from "fs";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import rootReducer, { rootSaga } from "./modules";
import PreloadContext from "./lib/PreloadContext";
import createSagaMiddleware, { END } from "redux-saga";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server"; // #. [청크 파일 경로 추출]

// #. [청크 파일 경로 추출]
const statsFile = path.resolve("./build/loadable-stats.json");

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

/*function createPage(root, stateScript) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <title>React App</title>
        <link href="${manifest.files["main.css"]}" rel="stylesheet" />
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">${root}</div>
        ${stateScript}
        ${chunks}
        <script src="${manifest.files["main.js"]}"></script>
    </body>
  </html>`;
}*/
// #. [청크 파일 경로 추출]
function createPage(root, tags) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <title>React App</title>
        ${tags.styles}
        ${tags.links}
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">${root}</div>
        ${tags.scripts}
    </body>
  </html>`;
}

const app = express();
const serverRender = async (req, res, next) => {
  const context = {};
  // #. [redux-saga 서버 사이드 렌더링 설정] redux-saga 사용시 Promise 를 반환하지 않으므로 추가 작업 필요
  const sagaMiddleware = createSagaMiddleware();
  // #. 스토어 생성
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, sagaMiddleware)
  ); // #. [redux-saga 서버 사이드 렌더링 설정]
  sagaMiddleware.run(rootSaga); // #. [redux-saga 서버 사이드 렌더링 설정]
  const sagaPromise = sagaMiddleware.run(rootSaga).toPromise(); // #. [redux-saga 서버 사이드 렌더링 설정] Promise 로 변환.
  // #. 서버가 실행될 때 요청이 들어올때마다 새로운 스토어를 만들기 위해 프로미스를 수집하고 기다렸다가 다시 렌더링
  const preloadContext = {
    done: false,
    promises: [],
  };

  // #. [청크 파일 경로 추출]
  const extractor = new ChunkExtractor({ statsFile });

  // #. [청크 파일 경로 추출]
  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </PreloadContext.Provider>
    </ChunkExtractorManager>
  );
  ReactDOMServer.renderToStaticMarkup(jsx); // #. renderToStaticMarkup 으로 한번 렌더링. (Preloader로 넣어 준 함수를 호출하기 위한 목적. 처리 속도가 renderToString 보다 빨라 대신 사용)
  store.dispatch(END); // #. [redux-saga 서버 사이드 렌더링 설정] redux-saga 의 END 액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료됨
  try {
    await sagaPromise; // #. [redux-saga 서버 사이드 렌더링 설정] 기존에 진행 중이던 사가들이 모두 끝날때까지 대기
    await Promise.all(preloadContext.promises); // 모든 프로미스 대기
  } catch (e) {
    return res.status(500);
  }
  preloadContext.done = true;
  const root = ReactDOMServer.renderToString(jsx); // 렌더링된 결과물을 문자열로 변환.
  const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c");
  const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // #. 리덕스 초기 상태 스크립트로 주입

  // #. [청크 파일 경로 추출]
  const tags = {
    scripts: stateScript + extractor.getScriptTags(), // #. 스크립트 앞부분에 리덕스 상태 주입
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags(),
  };

  res.send(createPage(root, tags)); // 클라이언트에게 결과물을 응답
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
 *
 * renderToStaticMarkup : 리액트를 사용하여 정적인 페이지를 만들 때 사용. 이 함수로 만든 렌더링 결과물은 클라이언트 쪽에서 HTML DOM 인터렉션 지원 어려움.
 *
 * #. 현재 스토어 상태를 문자열로 변환한 뒤 스크립트로 주입
 * const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c"); // #. 현재 스토어 상태
 * const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // #. 리덕스 초기 상태 스크립트로 주입
 */
