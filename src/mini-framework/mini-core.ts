declare const __NODE__: boolean;
declare const __HYDRATE__: boolean;

import * as ssr from "./mini-ssr";
import * as jsx from "./mini-jsx";

const { h, Fragment } = (__NODE__ || __HYDRATE__) ? ssr : jsx;

export { h, Fragment };
