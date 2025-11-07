export type Child = Node | string | number | boolean | null | undefined | Child[];
export function h(
  type: string | ((props: any) => Node),
  props?: Record<string, any>,
  ...children: any[]
): Node;
export function Fragment(props: { children?: any[] }): DocumentFragment;
export function render(node: Node, container: Element): void;
