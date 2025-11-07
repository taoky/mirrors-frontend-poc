declare const __NODE__: boolean;

import * as ssr from "./mini-ssr";
import * as jsx from "./mini-jsx";

const { h, Fragment } = __NODE__ ? ssr : jsx;

export { h, Fragment };
