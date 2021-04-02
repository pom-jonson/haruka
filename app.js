import "@babel/polyfill"; // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
import "./style/style.scss";
import App from "./components/App";
import React from "react";
import reactDOM from "react-dom";
import "./helpers/preventDefaultKeyNavigation";

const createRootElement = () => {
  const $root = document.createElement("div");
  document.body.appendChild($root);
  return $root;
};

const initReactApp = $container => {
  reactDOM.render(<App />, $container);
};

initReactApp(createRootElement());
