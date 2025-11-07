import { App } from "./index";
import { initIndexClientSide } from "./index-client";
import { h, render } from "./mini-framework/mini-jsx";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
render(<App />, root);

initIndexClientSide();
