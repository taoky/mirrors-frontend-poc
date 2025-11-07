// Get all client side initialization code here, for convenience of SSR.

declare const __NODE__: boolean;

import { setupModal } from "./components/script.index/modal-init";
import { setupSearchFilter } from "./components/script.index/search-filter";

// Hydration related imports
import { h } from "./mini-framework/mini-ssr";
import { hydrate } from "./mini-framework/mini-ssr-hydrate";
import { App } from "./index";

export function initIndexClientSide() {
  if (__NODE__) {
    console.log("Hydrating...");
    const root = document.getElementById("root");
    if (!root) throw new Error("#root not found");
    hydrate(<App />, root, { verify: true });
  }
  setupSearchFilter();
  setupModal();
}
