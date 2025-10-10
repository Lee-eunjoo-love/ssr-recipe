const { cache } = require("react");
const paths = require("./paths");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const loader = require("sass-loader");
const resolve = require("resolve");
const cssRegx = /\.css$/;
const cssModuleRegx = /\.module\.css$/; // .module.css로 끝나는 파일만 모듈로 처리
const sassRegx = /\.(scss|sass)$/;
const sassModuleRegx = /\.module\.(scss|sass)$/; // .module.scss, .module.sass로 끝나는 파일만 모듈로 처리
const nodeExternals = require("webpack-node-externals"); // yarn add webpack-node-externals
// #. 환경변수 주입
const webpack = require("webpack");
const getClientEnvironment = require("./env");
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

module.exports = {
  mode: "production",
  entry: paths.ssrIndexJs, // [서버 전용 환경 설정] 서버 사이드 렌더링 엔트리 파일
  target: "node", // [서버 전용 환경 설정] Node.js 환경에 맞게 번들링
  output: {
    path: paths.ssrBuild, // [서버 전용 환경 설정] 빌드 결과물 위치
    filename: "server.js", // [서버 전용 환경 설정] 빌드 결과물 파일 이름
    chunkFilename: "js/[name].chunk.js", // [서버 전용 환경 설정] 코드 스플리팅된 청크 파일 이름
    publicPath: paths.publicUrlOrPath, //정적 파일이 제공될 경로
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),
              presets: [
                [
                  require.resolve("babel-preset-react-app"),
                  {
                    runtime: "automatic",
                  },
                ],
              ],
              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },
          // CSS 를 위한 처리
          {
            test: cssRegx,
            exclude: cssModuleRegx,
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
              modules: {
                exportOnlyLocals: true, // [서버 전용 환경 설정] CSS를 자바스크립트 객체로 변환하여 내보냄
              },
            },
          },
          // Sass 를 위한 처리
          {
            test: sassRegx,
            exclude: sassModuleRegx,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 3,
                  modules: {
                    exportOnlyLocals: true, // [서버 전용 환경 설정] CSS를 자바스크립트 객체로 변환하여 내보냄
                  },
                },
              },
              require.resolve("sass-loader"),
            ],
          },
          // Sass + CSS Module 처리를 위한 설정
          {
            test: sassRegx,
            exclude: sassModuleRegx,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 3,
                  modules: {
                    exportOnlyLocals: true, // [서버 전용 환경 설정] CSS를 자바스크립트 객체로 변환하여 내보냄
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
              },
              require.resolve("sass-loader"),
            ],
          },
          // url-loader를 통한 이미지, 폰트 등의 정적 파일 처리
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("resolve-url-loader"),
            options: {
              emitFile: false, // [서버 전용 환경 설정] 파일을 생성하지 않음
              limit: 10000, // 10kb 이하 파일은 Data URL로 변환
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // 위에서 설정된 확장자를 제외한 파일들에 대한 처리
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false, // [서버 전용 환경 설정] 파일을 생성하지 않음
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  // node_modules 내부 라이브러리 불러오게 설정
  resolve: {
    modules: ["node_modules"],
  },
  // node_modules 에서 불러오는 것을 제외하고 번들링 하도록 설정
  externals: [
    nodeExternals({
      allowlist: [/@babel/], // @babel 로 시작하는 모듈은 번들링에 포함
    }),
  ],
  // #. 환경변수 주입
  plugins: [new webpack.DefinePlugin(env.stringified)], // 환경변수를 전역 상수로 정의
};

/**
 * [서버 전용 환경 설정]
 * 웹팩 기본 설정
 */
