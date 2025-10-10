import ReactDOMServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import path from "path";
import fs from "fs";

// 정적 파일 html 내부에 주입
const manifest = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../build/asset-manifest.json"),
    "utf-8"
  )
);

function createPage(root) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <link href="${manifest.files["main.css"]}" rel="stylesheet" />
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">${root}</div>
        <script src="${manifest.files["runtime-main.js"]}"></script>
    </body>
    </html>`;
}

const app = express();
const serverRender = (req, res, next) => {
  const context = {};
  const jsx = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const root = ReactDOMServer.renderToString(jsx); // 렌더링된 결과물을 문자열로 변환
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답
};

// 정적 파일 제공 (index: false 옵션을 주어 '/' 경로에서 index.html 을 제공하지 않도록 설정)
app.use(express.static(path.resolve(__dirname, "../build"), { index: false }));

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
 */
