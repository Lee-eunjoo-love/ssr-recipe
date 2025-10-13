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
  entry: paths.ssrIndexJs, // #. [서버 전용 웹팩 환경 설정] 서버 사이드 렌더링 엔트리 파일. 엔트리 경로
  target: "node", // #. [서버 전용 웹팩 환경 설정] Node.js 환경에 맞게 번들링. node 환경에서 실행될 것임을 명시
  output: {
    path: paths.ssrBuild, // #. [서버 전용 웹팩 환경 설정] 빌드 결과물 위치. 빌드 경로
    filename: "server.js", // #. [서버 전용 웹팩 환경 설정] 빌드 결과물 파일 이름. 파일 이름
    chunkFilename: "js/[name].chunk.js", // #. [서버 전용 웹팩 환경 설정] 코드 스플리팅된 청크 파일 이름. 청크 파일 이름
    publicPath: paths.publicUrlOrPath, // #. [서버 전용 웹팩 환경 설정] 정적 파일이 제공될 경로
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
                exportOnlyLocals: true, // #. [서버 전용 환경 설정] CSS를 자바스크립트 객체로 변환하여 내보냄. true 옵션 설정해야 실제 css 파일 생성하지 않음
              },
            },
          },
          // CSS Module 을 위한 처리
          {
            test: cssModuleRegx,
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
              modules: {
                exportOnlyLocals: true,
                getLocalIdent: getCSSModuleLocalIdent,
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
                    exportOnlyLocals: true, // #. [서버 전용 웹팩 환경 설정] CSS를 자바스크립트 객체로 변환하여 내보냄
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
                    exportOnlyLocals: true, // [서버 전용 웹팩 환경 설정] CSS를 자바스크립트 객체로 변환하여 내보냄
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
              emitFile: false, // #. [서버 전용 웹팩 환경 설정] 파일을 생성하지 않음. false 설정하면 파일을 따로 저장하지 않음
              limit: 10000, // 10kb 이하 파일은 Data URL로 변환. (emitFile 이 false 이면 10kb 이하 파일이어도 경로만 준비하고 파일은 저장하지 않음)
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // 위에서 설정된 확장자를 제외한 파일들에 대한 처리
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false, // [서버 전용 웹팩 환경 설정] 파일을 생성하지 않음
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  // node_modules 내부 라이브러리 불러오게 설정. import 구문으로 불러오면 node_modules 에서 찾아 사용하고 빌드 결과물 파일 안에 해당 라이브러리 코드가 함께 번들링됨.
  resolve: {
    modules: ["node_modules"],
  },
  // node_modules 에서 불러오는 것을 제외하고 번들링 하도록 설정. 서버에는 결과물 안에 리액트 라이브러리가 들어있지 않아도 node_modules 를 통해 바로 불러 올 수 있으므로 서버를 위한 번들링시에는 node_modules 에서 불러오는 것 제외.
  externals: [
    nodeExternals({
      allowlist: [/@babel/], // @babel 로 시작하는 모듈은 번들링에 포함. (node_modules 에서 불러오는 것은 제외.)
    }),
  ],
  // #. 환경변수 주입
  plugins: [new webpack.DefinePlugin(env.stringified)], // 환경변수를 전역 상수로 정의
};

/**
 * [서버 전용 환경 설정]
 * 웹팩 기본 설정
 */
