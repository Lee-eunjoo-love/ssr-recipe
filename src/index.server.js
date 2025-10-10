import ReactDOMServer from "react-dom/server";

const html = ReactDOMServer.renderToString(
  <div>Hello Server Side Rendering!</div>
);

console.log(html);

/**
 * 엔트리 : 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일
 *    - src/index.js (클라이언트 사이드 렌더링)
 *    - src/index.server.js (서버 사이드 렌더링)
 *    - src/App.js (공통)
 *    - src/components (공통)
 *    - src/pages (공통)
 *
 */
