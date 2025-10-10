process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production"; // 프로덕션 모드로 설정

// 프로덕션 모드에서는 에러가 발생해도 빌드가 중단되지 않도록 설정
process.on("unhandledRejection", (err) => {
  throw err;
});

require("../config/env"); // 환경변수 설정
const fs = require("fs-extra");
const webpack = require("webpack"); // 웹팩 모듈 불러오기
const config = require("../config/webpack.config.server");
const paths = require("../config/paths");

function build() {
  console.log("Creating server build...");
  // 빌드 결과물 폴더 비우기
  fs.emptyDirSync(paths.ssrBuild);
  // 웹팩 빌드 실행
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stats.toString());
    });
  });
}

build(); // 빌드 함수 실행
