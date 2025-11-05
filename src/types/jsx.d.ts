declare namespace JSX {
  interface Element extends Node {}
  interface ElementChildrenAttribute { children: {} }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
declare module '*.css' { const url: string; export default url; }
declare module '*.json' { const data: any; export default data; }
