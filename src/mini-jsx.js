export function h(type, props, ...children) {
  props ||= {};
  const flat = [];
  (function flatArr(a){ for (const c of a) Array.isArray(c) ? flatArr(c) : flat.push(c); })(children);

  if (typeof type === 'function') return type({ ...props, children: flat });

  const el = document.createElement(type);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'className') el.className = v;
    else if (k === 'style' && v && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of flat) {
    if (c == null || c === false) continue;
    el.appendChild(c?.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}
export function Fragment({ children = [] }) {
  const frag = document.createDocumentFragment();
  for (const c of children) {
    if (c == null || c === false) continue;
    frag.appendChild(c?.nodeType ? c : document.createTextNode(String(c)));
  }
  return frag;
}
export function render(node, container) {
  container.textContent = '';
  container.appendChild(node);
}
