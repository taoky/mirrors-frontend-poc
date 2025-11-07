export function h(type, props, ...children) {
  props ||= {};
  const flat = [];
  (function flatArr(a) {
    for (const c of a) Array.isArray(c) ? flatArr(c) : flat.push(c);
  })(children);
  if (typeof type === "function") return type({ ...props, children: flat });
  return { $$: "el", type, props, children: flat };
}

export function Fragment({ children = [] }) {
  return { $$: "frag", children };
}

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (m) =>
    m === "&" ? "&amp;" : m === "<" ? "&lt;" : "&gt;"
  );
}
function escapeAttr(s) {
  return String(s).replace(/[&<>"']/g, (m) =>
    m === "&"
      ? "&amp;"
      : m === "<"
      ? "&lt;"
      : m === ">"
      ? "&gt;"
      : m === '"'
      ? "&quot;"
      : "&#39;"
  );
}
function toKebab(prop) {
  if (prop.startsWith("--")) return prop;
  let s = prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  return s;
}
function styleToString(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const parts = [];
  for (const [k, val] of Object.entries(v)) {
    if (val == null || val === false) continue;
    parts.push(`${toKebab(k)}:${String(val)}`);
  }
  return parts.join(";");
}
function attrsToString(props) {
  const parts = [];
  for (const [k, v] of Object.entries(props || {})) {
    if (
      v == null ||
      v === false ||
      k === "children" ||
      k === "key" ||
      k === "ref"
    )
      continue;
    if (k.startsWith("on") && typeof v === "function") continue; // drop events on SSR
    if (k === "className") {
      if (v) parts.push('class="' + escapeAttr(v) + '"');
      continue;
    }
    if (k === "style") {
      const s = styleToString(v);
      if (s) parts.push('style="' + s + '"');
      continue;
    }
    if (v === true) parts.push(k);
    else parts.push(`${k}="${escapeAttr(v)}"`);
  }
  return parts.length ? " " + parts.join(" ") : "";
}

export function renderToString(node) {
  let out = "";
  function render(n) {
    if (n == null || n === false) return;
    if (typeof n === "string" || typeof n === "number") {
      out += escapeHtml(n);
      return;
    }
    if (Array.isArray(n)) {
      for (const c of n) render(c);
      return;
    }
    if (n && n.$$ === "frag") {
      for (const c of n.children) render(c);
      return;
    }
    if (n && n.$$ === "el") {
      const { type, props, children } = n;
      out += "<" + type + attrsToString(props) + ">";
      if (!VOID_TAGS.has(type)) {
        for (const c of children) render(c);
        out += "</" + type + ">";
      }
      return;
    }
    out += escapeHtml(String(n));
  }
  render(node);
  return out;
}
