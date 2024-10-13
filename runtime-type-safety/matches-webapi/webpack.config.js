// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/main.ts",
  devtool: "source-map",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
