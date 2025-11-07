// Handle onXXX events.

export { h, Fragment } from './mini-ssr.js';

export function hydrate(tree, container, { verify = false, strict = false } = {}) {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
  );

  const isText = v => typeof v === 'string' || typeof v === 'number';

  function toEventName(prop) {
    return prop.slice(2).toLowerCase(); // onClick -> click
  }

  function addListener(el, name, val) {
    if (Array.isArray(val) && typeof val[0] === 'function') {
      el.addEventListener(name, val[0], val[1]);
    } else if (typeof val === 'function') {
      el.addEventListener(name, val);
    }
  }

  function applyProps(el, props) {
    if (!props) return;

    // Events and dynamic properties only. Most attributes were SSR'd already.
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;

      if (k.startsWith('on')) {
        addListener(el, toEventName(k), v);
        continue;
      }

      if (k === 'style' && v && typeof v === 'object') {
        // Merge object style; string style already exists from SSR.
        Object.assign(el.style, v);
        continue;
      }

      if (k === 'value' && 'value' in el) {
        const sv = String(v);
        if (el.value !== sv) el.value = sv;
        continue;
      }

      if ((k === 'checked' || k === 'selected') && k in el) {
        el[k] = !!v;
        continue;
      }

      // Skip: className, class, id, dataset, aria, etc. are already in SSR HTML.
    }
  }

  function mismatch(msg, dom) {
    if (strict) throw new Error(msg);
    if (verify) console.warn(msg, dom);
  }

  function nextNode() {
    const n = walker.nextNode();
    console.log('Next DOM node:', n);
    if (!n) {
      mismatch('Hydration: DOM shorter than expected');
      return null;
    }
    return n;
  }

  function walk(node) {
    if (node == null || node === false) return;
    console.log('Walking SSR node:', node, node.$$);

    if (Array.isArray(node)) {
      for (const c of node) walk(c);
      return;
    }

    if (isText(node)) {
      if (node === '') return;
      const dom = nextNode();
      if (!dom) return;
      if (verify && dom.nodeType !== Node.TEXT_NODE) {
        mismatch('Hydration mismatch: expected text node, got', dom);
      }
      return;
    }

    if (node && node.$$ === 'frag') {
      for (const c of node.children) walk(c);
      return;
    }

    if (node && node.$$ === 'el') {
      const dom = nextNode();
      if (!dom) return;

      if (verify) {
        if (dom.nodeType !== Node.ELEMENT_NODE) {
          mismatch(`Hydration mismatch: expected <${node.type}>, got non-element`, dom);
        } else {
          const tag = dom.nodeName.toLowerCase();
          if (tag !== node.type) mismatch(`Hydration mismatch: expected <${node.type}>, got <${tag}>`, dom);
        }
      }

      if (dom.nodeType === Node.ELEMENT_NODE) {
        applyProps(dom, node.props);
      }

      for (const c of node.children) walk(c);
      return;
    }

    // Fallback: consume one DOM node (keeps cursor in sync)
    nextNode();
  }

  walker.currentNode = container;
  walk(tree);

  // Extra nodes left in DOM
  if (verify) {
    const extra = walker.nextNode();
    if (extra) mismatch('Hydration: DOM longer than expected; extra nodes remain starting at', extra);
  }
}
