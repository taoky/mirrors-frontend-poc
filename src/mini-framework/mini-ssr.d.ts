export type Child = string | number | boolean | null | undefined | NodeLike | Child[];

export interface ElementLike {
  $$: 'el';
  type: string;
  props?: Record<string, any>;
  children: Child[];
}
export interface FragmentLike {
  $$: 'frag';
  children: Child[];
}
export type NodeLike = ElementLike | FragmentLike;

export function h(
  type: string | ((props: any) => any),
  props?: Record<string, any>,
  ...children: any[]
): Child;
export function Fragment(props: { children?: any[] }): FragmentLike;
export function renderToString(node: any): string;
